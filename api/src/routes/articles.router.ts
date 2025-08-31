import { Router, type Request, type Response } from 'express'
import { handleRouteError } from '../errors/handleRouteError'
import { hasRealChanges } from '../lib/hasRealChanges'
import prismaClient from '../prisma/prismaClient'
import {
   articleCreateSchema,
   articlePriceByClientSchema,
   articleUpdateSchema,
} from '../models/Article.model'

const articlesRouter = Router()

// GET /articles - listar artículos y categorías
articlesRouter.get('/', async (req: Request, res: Response) => {
   try {
      const articlesList = await prismaClient.article.findMany({
         orderBy: { createdAt: 'desc' },
      })

      const categories =
         Array.from(
            new Set(
               articlesList
                  .map((a) => a.category?.trim() ?? '')
                  .filter((c) => c.length > 0)
            )
         ).sort((a, b) => a.localeCompare(b, 'es')) || []

      return res.status(200).send({
         articles: articlesList,
         categories,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET /articles/client/:clientId - listar artículos por cliente
articlesRouter.get('/client/:id', async (req: Request, res: Response) => {
   const { id: clientId } = req.params

   try {
      // 1) chequeo que exista el cliente
      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      // 2) traigo todos los articulos
      const articlesList = await prismaClient.article.findMany({
         orderBy: { createdAt: 'desc' },
         select: { id: true, name: true, basePrice: true, code: true, category: true },
      })

      // 3) traigo todos los precios de articulos del cliente
      const clientArticlesPrices = await prismaClient.clientArticlePrice.findMany({
         where: { clientId },
      })

      // 4) formateo la lista de articulos con el precio del cliente
      const listFormated = articlesList.map((article) => {
         const clientPriceArticle = clientArticlesPrices.find(
            (price) => price.articleId === article.id
         )

         return {
            ...article,
            clientPrice: clientPriceArticle ? clientPriceArticle.price : null,
         }
      })

      const categories =
         Array.from(
            new Set(
               articlesList
                  .map((a) => a.category?.trim() ?? '')
                  .filter((c) => c.length > 0)
            )
         ).sort((a, b) => a.localeCompare(b, 'es')) || []

      return res.status(200).send({
         articles: listFormated,
         categories,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST /articles/:id/client/:clientId/price - setear precio de artículo por cliente
articlesRouter.put('/:id/client/:clientId/price', async (req: Request, res: Response) => {
   const { id: articleId, clientId } = req.params

   try {
      const body = articlePriceByClientSchema.parse(req.body)

      await Promise.all([
         prismaClient.article.findUniqueOrThrow({ where: { id: articleId } }),
         prismaClient.client.findUniqueOrThrow({ where: { id: clientId } }),
      ])

      const existing = await prismaClient.clientArticlePrice.findUnique({
         where: { clientId_articleId: { clientId, articleId } },
      })

      if (existing && existing.price === body.price) {
         return res.status(200).send({
            message: 'Sin cambios: el precio es el mismo',
            article: existing,
         })
      }

      const createdPrice = await prismaClient.clientArticlePrice.upsert({
         where: { clientId_articleId: { clientId, articleId } },
         create: { clientId, articleId, price: body.price },
         update: { price: body.price },
      })

      return res.status(201).send({
         message: 'Precio de artículo guardado',
         article: createdPrice,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST /articles - crear artículo
articlesRouter.post('/', async (req: Request, res: Response) => {
   try {
      const body = articleCreateSchema.parse(req.body)

      //CHEQUEO DE DUPLICADOS AUTOMATICO (name es @unique y case insensitive)
      const createdArticle = await prismaClient.article.create({
         data: body,
      })

      return res.status(201).send({
         message: 'Artículo creado',
         article: createdArticle,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// PUT /articles/:id - actualizar artículo
articlesRouter.patch('/:id', async (req: Request, res: Response) => {
   const { id: articleId } = req.params

   try {
      // 1) validar payload
      const body = articleUpdateSchema.parse(req.body)

      // 2) buscar artículo actual, sino tira excepcion
      const currentArticle = await prismaClient.article.findUniqueOrThrow({
         where: { id: articleId },
      })

      // 3) preparar update solo con cambios reales
      if (!hasRealChanges(currentArticle, body)) {
         return res.send({
            message: 'No hay cambios para aplicar',
            article: currentArticle,
         })
      }

      // 4) actualizar
      const updatedArticle = await prismaClient.article.update({
         where: { id: articleId },
         data: body,
      })

      return res.status(200).send({
         message: 'Artículo actualizado',
         article: updatedArticle,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// DELETE /articles/:id - eliminar artículo
articlesRouter.delete('/:id', async (req: Request, res: Response) => {
   try {
      const { id: articleId } = req.params

      const articleDeleted = await prismaClient.article.delete({
         where: { id: articleId },
      })

      return res.status(200).send({
         message: 'Artículo eliminado',
         article: articleDeleted,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

export default articlesRouter
