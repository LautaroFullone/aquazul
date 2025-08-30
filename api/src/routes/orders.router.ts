import { Router, type Request, type Response } from 'express'
import { handleRouteError } from '../errors/handleRouteError'
import { NotFoundError } from '../errors/ApiError'
import prismaClient from '../prisma/prismaClient'
import { sleep } from '../lib/sleep'
import {
   getOrdersSchema,
   getOrdersStatsSchema,
   orderCreateSchema,
} from '../models/Order.model'

const ordersRouter = Router()

ordersRouter.get('/', async (req, res) => {
   try {
      await sleep(2000)
      const { limit, clientId } = getOrdersSchema.parse(req.query)

      const where: any = {}
      if (clientId) where.clientId = clientId

      // A) Si viene `limit` ignoro el get all
      if (limit) {
         const orders = await prismaClient.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            omit: { articles: true, observation: true, updatedAt: true, clientId: true },
         })

         return res.send({ message: 'Pedidos obtenidos', orders })
      }

      // B) get all
      const orders = await prismaClient.order.findMany({
         where,
         orderBy: { createdAt: 'desc' },
         omit: { articles: true, observation: true, updatedAt: true, clientId: true },
      })

      return res.send({
         message: 'Pedidos obtenidos',
         orders,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

ordersRouter.get('/:orderId', async (req, res) => {
   try {
      await sleep(2000)
      const { orderId } = req.params

      const order = await prismaClient.order.findUnique({
         where: { id: orderId },
      })

      if (!order) {
         throw new NotFoundError('Pedido no existente', { orderId })
      }

      //TODO: traer remitos y ordenes de pago

      return res.send({
         message: 'Pedido obtenido',
         order: {
            ...order,
            deliveryNotes: [
               // { id: 'REM-000123', createdAt: order.createdAt, details: {} },
               // { id: 'REM-000124', createdAt: order.createdAt, details: {} },
            ],
            paymentNotes: [
               // {
               //    id: 'ODP-000123',
               //    createdAt: order.createdAt,
               //    total: order.totalPrice / 2,
               // },
               // {
               //    id: 'ODP-000124',
               //    createdAt: order.createdAt,
               //    total: order.totalPrice / 2,
               // },
            ],
         },
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST /orders - crear
ordersRouter.post('/', async (req: Request, res: Response) => {
   try {
      const body = orderCreateSchema.parse(req.body)

      // 1) Traer artículos
      const orderArticlesIds = body.articles.map((article) => article.articleId)

      const articles = await prismaClient.article.findMany({
         where: { id: { in: orderArticlesIds } },
      })

      const articlesMap = new Map(articles.map((article) => [article.id, article]))

      // 2) Validar existencia
      for (const orderArticleID of orderArticlesIds) {
         if (!articlesMap.get(orderArticleID)) {
            throw new NotFoundError('Articulo no existente', {
               articleId: orderArticleID,
            })
         }
      }

      // podria trer y validar los precios de articulos del cliente
      // const clientArticlesPrices = await prismaClient.clientArticlePrice.findMany({
      //    where: { clientId: body.clientId },
      // })

      // 3) Seteo el total de la orden
      const totalOrderPrice = body.articles.reduce(
         (acumulation, article) => acumulation + article.clientPrice * article.quantity,
         0
      )

      // 4) Crear pedido con transacción para generar code único
      const newOrder = await prismaClient.$transaction(async (tx) => {
         const lastOrder = await tx.order.findFirst({
            orderBy: { createdAt: 'desc' },
         })

         let nextNumber = 1
         if (lastOrder?.code) {
            const lastNumber = Number(lastOrder.code.replace('PED-', ''))
            nextNumber = lastNumber + 1
         }
         const newCode = `PED-${String(nextNumber).padStart(6, '0')}`

         return tx.order.create({
            data: {
               code: newCode,
               clientId: body.clientId,
               observation: body.observation || '',
               status: body.status || 'PENDING',
               articles: body.articles,
               articlesCount: body.articles.length,
               totalPrice: totalOrderPrice,
            },
         })
      })

      return res
         .status(201)
         .send({ message: 'Pedido creado correctamente', order: newOrder })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

//
ordersRouter.get('/client/:clientId/stats', async (req, res) => {
   try {
      const { clientId } = getOrdersStatsSchema.parse(req.params)

      const [totalOrdersCount, ordersInProgressCount, ordersCompletedCount] =
         await Promise.all([
            prismaClient.order.count({ where: { clientId } }),
            prismaClient.order.count({ where: { clientId, status: 'IN_PROGRESS' } }),
            prismaClient.order.count({ where: { clientId, status: 'COMPLETED' } }),
         ])

      const now = new Date()
      const startOfCurrentMonth = new Date(
         Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      )
      const endOfCurrentMonth = new Date(
         Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0)
      )

      const totalOrdersMonthPrice = await prismaClient.order.aggregate({
         _sum: { totalPrice: true },
         where: {
            clientId,
            status: 'COMPLETED',
            createdAt: { gte: startOfCurrentMonth, lt: endOfCurrentMonth },
         },
      })

      return res.send({
         totalOrdersCount,
         ordersInProgressCount,
         ordersCompletedCount,
         totalOrdersMonthPrice: totalOrdersMonthPrice._sum.totalPrice,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET /orders/:id - detalle
// ordersRouter.get('/:id', async (req: Request, res: Response) => {
//    try {
//       const { id } = req.params
//       const order = await prisma.order.findUnique({
//          where: { id },
//          include: { items: { include: { article: true } } },
//       })
//       if (!order) throw new ApiError('Pedido no encontrado', { id }, 404)

//       return res.status(200).send({ message: 'Pedido obtenido', order })
//    } catch (error) {
//       console.log(error)
//       if (error instanceof ApiError) {
//          return res
//             .status(error.statusCode)
//             .send({ message: error.message, ...error.data })
//       }
//       return res.status(500).send({ message: 'Ocurrió un error inesperado del servidor' })
//    }
// })

// PUT /orders/:id - actualizar (status/observation)
// ordersRouter.put('/:id', async (req: Request, res: Response<ResponseEntity>) => {
//    try {
//       const { id } = req.params
//       const partial = orderUpdateSchema.parse(req.body)

//       const exists = await prisma.order.findUnique({ where: { id } })
//       if (!exists) throw new ApiError('Pedido no encontrado', { id }, 404)

//       const orderUpdated = await prisma.order.update({
//          where: { id },
//          data: {
//             observation: partial.observation ?? exists.observation,
//             status: partial.status ?? exists.status,
//          },
//          include: { items: { include: { article: true } } },
//       })

//       return res.status(200).send({ message: 'Pedido actualizado', order: orderUpdated })
//    } catch (error) {
//       console.log(error)
//       if (error instanceof ApiError) {
//          return res
//             .status(error.statusCode)
//             .send({ message: error.message, ...error.data })
//       }
//       return res.status(500).send({ message: 'Ocurrió un error inesperado del servidor' })
//    }
// })

// // DELETE /orders/:id - eliminar
// ordersRouter.delete('/:id', async (req: Request, res: Response<ResponseEntity>) => {
//    try {
//       const { id } = req.params

//       const order = await prisma.order.findUnique({
//          where: { id },
//          include: { items: true },
//       })
//       if (!order) throw new ApiError('Pedido no encontrado', { id }, 404)

//       // Borrar items primero para evitar restricciones de FK si no usás onDelete: Cascade
//       await prisma.$transaction([
//          prisma.orderItem.deleteMany({ where: { orderId: id } }),
//          prisma.order.delete({ where: { id } }),
//       ])

//       return res.status(200).send({ message: 'Pedido eliminado', order })
//    } catch (error) {
//       console.log(error)
//       if (error instanceof ApiError) {
//          return res
//             .status(error.statusCode)
//             .send({ message: error.message, ...error.data })
//       }
//       return res.status(500).send({ message: 'Ocurrió un error inesperado del servidor' })
//    }
// })

export default ordersRouter
