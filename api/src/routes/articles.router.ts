import { articleCreateSchema, articleUpdateSchema } from '../models/article.model'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/ApiError'
import { handleRouteError } from '../errors/handleRouteError'
import { Router, type Request, type Response } from 'express'
import prismaClient from '../prisma/prismaClient'
import { hasRealChanges } from '../lib/hasRealChanges'

const articlesRouter = Router()

// GET /articles - listar artículos
articlesRouter.get('/', async (req: Request, res: Response) => {
   try {
      const articlesList = await prismaClient.article.findMany({
         orderBy: { name: 'asc' },
      })

      return res.status(200).send({
         message: 'Artículos obtenidos',
         articles: articlesList,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET /articles/client/:clientId - listar artículos por cliente
articlesRouter.get('/client/:id', async (req: Request, res: Response) => {
   const { id: clientId } = req.params

   try {
      //chequeo que exista el cliente
      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      //traigo todos los articulos
      const articlesList = await prismaClient.article.findMany({
         orderBy: { name: 'asc' },
         select: { id: true, name: true, basePrice: true },
      })

      //traigo todos los precios de articulos del cliente
      const clientArticlesPrices = await prismaClient.clientArticlePrice.findMany({
         where: { clientId },
      })

      const listFormated = articlesList.map((article) => {
         const clientPriceArticle = clientArticlesPrices.find(
            (price) => price.articleId === article.id
         )

         return {
            ...article,
            clientPrice: clientPriceArticle ? clientPriceArticle.price : null,
         }
      })

      return res.status(200).send({
         message: 'Artículos obtenidos',
         articles: listFormated,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST /articles - crear artículo
articlesRouter.post('/', async (req: Request, res: Response) => {
   try {
      const parsedArticle = articleCreateSchema.parse(req.body)

      //CHEQUEO DE DUPLICADOS AUTOMATICO (name es @unique y case insensitive)
      const createdArticle = await prismaClient.article.create({
         data: parsedArticle,
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
articlesRouter.put('/:id', async (req: Request, res: Response) => {
   const { id: articleId } = req.params

   try {
      // 1) validar payload
      const newArticle = articleUpdateSchema.parse(req.body)

      // 2) buscar artículo actual, sino tira excepcion
      const currentArticle = await prismaClient.article.findUniqueOrThrow({
         where: { id: articleId },
      })

      // 3) preparar update solo con cambios reales
      if (!hasRealChanges(currentArticle, newArticle)) {
         return res.send({
            message: 'No hay cambios para aplicar',
            article: currentArticle,
         })
      }

      // 4) actualizar
      const updatedArticle = await prismaClient.article.update({
         where: { id: articleId },
         data: newArticle,
      })

      return res.status(200).send({
         message: 'Artículo actualizado',
         article: updatedArticle,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// TODO: probar
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
