// routes/orders.routes.ts
import { handleRouteError } from '../errors/handleRouteError'
import { Router, type Request, type Response } from 'express'
import { orderCreateSchema } from '../models/order.model'
import prismaClient from '../prisma/prismaClient'
import { NotFoundError } from '../errors/ApiError'

const ordersRouter = Router()

// ordersRouter.get('/', async (_req: Request, res: Response) => {
//    try {
//       const orders = await prismaClient.order.findMany({
//          orderBy: { createdAt: 'desc' },
//          include: { articles: { include: { article: true } } },
//       })

//       return res.status(200).send({ message: 'Pedidos obtenidos', orders })
//    } catch (error) {
//       return handleRouteError(res, error)
//    }
// })

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

      // podria trer los precios de articulos del cliente
      // const clientArticlesPrices = await prismaClient.clientArticlePrice.findMany({
      //    where: { clientId: body.clientId },
      // })

      const totalOrderPrice = body.articles.reduce(
         (acumulation, article) => acumulation + article.clientPrice * article.quantity,
         0
      )

      const newOrder = await prismaClient.order.create({
         data: {
            clientId: body.clientId,
            observation: body.observation || '',
            status: body.status || 'PENDING',
            articles: body.articles,
            totalPrice: totalOrderPrice,
         },
      })

      return res
         .status(201)
         .send({ message: 'Pedido creado correctamente', order: newOrder })
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
