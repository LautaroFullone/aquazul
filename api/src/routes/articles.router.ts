import { Router, type Request, type Response } from 'express'
import { handleRouteError } from '../errors/handleRouteError'
import { hasRealChanges } from '../utils/hasRealChanges'
import { nextArticleCode } from '../utils/nextCode'
import prismaClient from '../prisma/prismaClient'
import {
   articleCreateSchema,
   articlePriceByClientSchema,
   articleUpdateSchema,
} from '../models/Article.model'
import { generateCategoriesMap } from '../utils/generateMap'
import { sleep } from '../utils/sleep'

const articlesRouter = Router()

// GET -> listar artículos y categorías
articlesRouter.get('/', async (req: Request, res: Response) => {
   await sleep(3000)
   try {
      const articles = await prismaClient.article.findMany({
         orderBy: { createdAt: 'desc' },
         select: {
            id: true,
            name: true,
            basePrice: true,
            code: true,
            category: { select: { id: true, name: true } },
         },
      })

      const categories = generateCategoriesMap(articles)

      return res.status(200).send({
         articles,
         categories,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// GET -> listar artículos por cliente
articlesRouter.get('/client/:clientId', async (req: Request, res: Response) => {
   const { clientId } = req.params

   try {
      // 1) chequeo que exista el cliente
      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      // 2) traigo todos los articulos
      const articles = await prismaClient.article.findMany({
         orderBy: { createdAt: 'desc' },
         select: {
            id: true,
            name: true,
            basePrice: true,
            code: true,
            category: { select: { id: true, name: true } },
         },
      })

      // 3) traigo todos los precios de articulos del cliente
      const clientArticlesPrices = await prismaClient.clientArticlePrice.findMany({
         where: { clientId },
      })

      // 4) formateo la lista de articulos con el precio del cliente
      const listFormated = articles.map((article) => {
         const clientPriceArticle = clientArticlesPrices.find(
            (price) => price.articleId === article.id
         )

         return {
            ...article,
            clientPrice: clientPriceArticle ? clientPriceArticle.price : null,
         }
      })

      const categories = generateCategoriesMap(articles)

      return res.status(200).send({
         articles: listFormated,
         categories,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST -> setear precio de artículo por cliente
articlesRouter.put(
   '/:articleId/client/:clientId/price',
   async (req: Request, res: Response) => {
      const { articleId, clientId } = req.params

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
   }
)

// POST -> crear artículo y asignar categoria
articlesRouter.post('/', async (req: Request, res: Response) => {
   try {
      const { basePrice, categoryName, name } = articleCreateSchema.parse(req.body)

      // Crear articulo con transacción para generar code único
      const createdArticle = await prismaClient.$transaction(async (tx) => {
         const lastArticle = await tx.article.findFirst({
            orderBy: { createdAt: 'desc' },
         })

         const newCode = nextArticleCode(lastArticle?.code)

         //CHEQUEO DE DUPLICADOS AUTOMATICO (name es @unique y case insensitive)
         return tx.article.create({
            data: {
               name,
               basePrice,
               code: newCode,
               category: {
                  //si la categoria existe, asigna el ID, sino existe la crea
                  connectOrCreate: {
                     where: { name: categoryName }, // requiere @unique en name
                     create: { name: categoryName },
                  },
               },
            },
            include: {
               category: true,
            },
         })
      })

      return res.status(201).send({
         message: 'Artículo creado',
         article: createdArticle,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

//TODO: agregar category
// PATCH -> actualizar artículo
articlesRouter.patch('/:articleId', async (req: Request, res: Response) => {
   const { articleId } = req.params

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

//TODO: eliminar category si no tiene mas articulos
// DELETE -> eliminar artículo
articlesRouter.delete('/:articleId', async (req: Request, res: Response) => {
   try {
      const { articleId } = req.params

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
