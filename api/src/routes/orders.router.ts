import { Router, type Request, type Response } from 'express'
import { handleRouteError } from '../errors/handleRouteError'
import { NotFoundError } from '../errors/ApiError'
import prismaClient from '../prisma/prismaClient'
import { getNextCode } from '../utils/nextCode'
import { sleep } from '../utils/sleep'
import {
   getOrdersSchema,
   getOrdersStatsSchema,
   orderCreateSchema,
} from '../models/Order.model'

const ordersRouter = Router()

// GET -> listar pedidos (resumen)
ordersRouter.get('/', async (req, res) => {
   try {
      await sleep(2000)

      const ordersSummary = await prismaClient.order.findMany({
         orderBy: { createdAt: 'desc' },
         omit: { articles: true, observation: true, updatedAt: true, clientId: true },
      })

      return res.send({
         ordersSummary,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET -> listar pedidos de un cliente (resumen)
ordersRouter.get('/client/:clientId', async (req, res) => {
   try {
      await sleep(2000)
      const { limit, orderBy } = getOrdersSchema.parse(req.query)

      const { clientId } = req.params

      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      const ordersSummary = await prismaClient.order.findMany({
         where: { clientId },
         orderBy: orderBy == 'updatedAt' ? { updatedAt: 'desc' } : { createdAt: 'desc' },
         take: limit || undefined,
         omit: { articles: true, observation: true, updatedAt: true, clientId: true },
      })

      return res.send({
         ordersSummary,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET -> obtener detalle de un pedido
ordersRouter.get('/:orderId', async (req, res) => {
   try {
      await sleep(2000)
      const { orderId } = req.params

      const order = await prismaClient.order.findFirstOrThrow({
         where: { id: orderId },
      })

      //TODO: traer remitos y ordenes de pago

      return res.send({
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

// POST -> crear pedido
ordersRouter.post('/', async (req: Request, res: Response) => {
   try {
      const { clientId, articles, observation, status } = orderCreateSchema.parse(
         req.body
      )

      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      // 1) Traer artículos
      const orderArticlesIds = articles.map((article) => article.articleId)

      const existingArticles = await prismaClient.article.findMany({
         where: { id: { in: orderArticlesIds } },
      })

      const articlesMap = new Map(
         existingArticles.map((article) => [article.id, article])
      )

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
      const totalOrderPrice = articles.reduce(
         (acumulation, article) => acumulation + article.clientPrice * article.quantity,
         0
      )

      // 4) Crear pedido con transacción para generar code único
      const newOrder = await prismaClient.$transaction(async (tx) => {
         const newCode = await getNextCode(tx, 'ORDER', 6)

         const order = await tx.order.create({
            data: {
               code: newCode,
               clientId,
               articles,
               observation: observation || '',
               status: status || 'PENDING',
               articlesCount: articles.length,
               totalPrice: totalOrderPrice,
            },
         })
         // Update client's lastOrderAt field
         await tx.client.update({
            where: { id: clientId },
            data: { lastOrderAt: order.createdAt },
         })

         return order
      })

      return res.status(201).send({ message: 'Pedido creado', order: newOrder })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET -> obtener estadísticas de pedidos de un cliente
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
