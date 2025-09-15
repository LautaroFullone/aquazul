import { Router, type Request, type Response } from 'express'
import { handleRouteError } from '../errors/handleRouteError'
import { generateCategoriesMap } from '../utils/generateMap'
import { hasRealChanges } from '../utils/hasRealChanges'
import prismaClient from '../prisma/prismaClient'
import { getNextCode } from '../utils/nextCode'
import { sleep } from '../utils/sleep'
import {
   articleCreateSchema,
   articlePriceByClientSchema,
   articlePriceMapByClientSchema,
   articleUpdateSchema,
} from '../models/Article.model'

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

// GET -> listar artículos por cliente con sus precios especiales
articlesRouter.get('/client/:clientId', async (req: Request, res: Response) => {
   const { clientId } = req.params
   await sleep(3000)

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
            clientPrice: clientPriceArticle?.price || article?.basePrice,
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

// GET -> obtener artículo por id
articlesRouter.get('/:articleId', async (req, res) => {
   try {
      await sleep(5000)
      const { articleId } = req.params

      const article = await prismaClient.article.findFirstOrThrow({
         where: { id: articleId },
         select: {
            id: true,
            name: true,
            basePrice: true,
            code: true,
            category: { select: { id: true, name: true } },
         },
      })

      return res.send({
         message: 'Artículo obtenido',
         article: {
            ...article,
         },
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST -> crear artículo y asignar o crear la categoría
articlesRouter.post('/', async (req: Request, res: Response) => {
   try {
      const { name, basePrice, categoryName } = articleCreateSchema.parse(req.body)

      // Crear articulo con transacción para generar code único
      const createdArticle = await prismaClient.$transaction(async (tx) => {
         const lastArticle = await tx.article.findFirst({
            orderBy: { createdAt: 'desc' },
         })

         // const newCode = nextArticleCode(lastArticle?.code)
         const newCode = await getNextCode(tx, 'ARTICLE', 4)

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

// PUT -> setear precio de artículo por cliente
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
               message: 'El precio del artículo no ha cambiado',
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

// PUT -> setear precios de artículos por cliente (múltiples)
articlesRouter.put('/prices/client/:clientId', async (req: Request, res: Response) => {
   const { clientId } = req.params

   try {
      // Validar el formato del objeto recibido {articleId: price, articleId2: price2, ...}
      const pricesMap = articlePriceMapByClientSchema.parse(req.body)

      // Verificar que el cliente existe
      await prismaClient.client.findUniqueOrThrow({
         where: { id: clientId },
      })

      // Convertir el objeto a un array de operaciones
      const articleIds = Object.keys(pricesMap)

      // Verificar que todos los artículos existen
      await Promise.all(
         articleIds.map((articleId) =>
            prismaClient.article.findUniqueOrThrow({ where: { id: articleId } })
         )
      )

      // Actualizar los precios en la base de datos
      const updatedPrices = await Promise.all(
         articleIds.map((articleId) =>
            prismaClient.clientArticlePrice.upsert({
               where: {
                  clientId_articleId: { clientId, articleId },
               },
               create: {
                  clientId,
                  articleId,
                  price: pricesMap[articleId],
               },
               update: {
                  price: pricesMap[articleId],
               },
            })
         )
      )

      return res.status(200).send({
         message: 'Precios de artículos actualizados',
         articles: updatedPrices,
         clientId,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// PATCH -> actualizar artículo y manejar categoría
articlesRouter.patch('/:articleId', async (req: Request, res: Response) => {
   const { articleId } = req.params
   await sleep(5000)
   try {
      // 1) validar payload
      const body = articleUpdateSchema.parse(req.body)

      // 2) buscar artículo actual, sino tira excepcion
      const currentArticle = await prismaClient.article.findUniqueOrThrow({
         where: { id: articleId },
         include: { category: true },
      })

      // 3) preparar update solo con cambios reales
      if (!hasRealChanges(currentArticle, body)) {
         return res.send({
            message: 'No hay cambios para aplicar',
            article: currentArticle,
         })
      }

      // 4) actualizar usando transacción para manejar categorías
      const result = await prismaClient.$transaction(async (tx) => {
         let categoryDeleted = null
         const updateData: any = { ...body }
         const oldCategoryId = currentArticle.category.id

         // Si hay cambio de categoría
         if (body?.categoryName && body.categoryName !== currentArticle.category.name) {
            // Usar connectOrCreate para la nueva categoría
            updateData.category = {
               connectOrCreate: {
                  where: { name: body.categoryName },
                  create: { name: body.categoryName },
               },
            }
            console.log('## 3 updateData', updateData) //
         }
         // Eliminar categoryName del objeto de actualización para evitar errores
         delete updateData.categoryName //categoryName no existe en el modelo Article, existe category: {id,name}

         const updatedArticle = await tx.article.update({
            where: { id: articleId },
            data: updateData,
            include: { category: true },
         })

         // Solo verificar la categoría antigua si cambió
         if (body?.categoryName && updatedArticle.category.id !== oldCategoryId) {
            // Verificar si la categoría anterior tiene más artículos
            const oldCategoryHasMoreArticles = await tx.article.findFirst({
               where: {
                  categoryId: oldCategoryId,
               },
            })

            // Eliminar la categoría anterior si no tiene más artículos
            if (!oldCategoryHasMoreArticles) {
               categoryDeleted = await tx.articleCategory.delete({
                  where: { id: oldCategoryId },
               })
            }
         }

         return {
            updatedArticle,
            categoryDeleted,
         } as const
      })

      return res.status(200).send({
         message: result.categoryDeleted
            ? 'Artículo actualizado y categoría anterior eliminada'
            : 'Artículo actualizado',
         article: result.updatedArticle,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// DELETE -> eliminar artículo
articlesRouter.delete('/:articleId', async (req: Request, res: Response) => {
   const { articleId } = req.params

   try {
      const result = await prismaClient.$transaction(async (tx) => {
         // 1) Eliminar el artículo
         const articleDeleted = await tx.article.delete({
            where: { id: articleId },
            include: { category: { select: { id: true } } },
         })

         // Verificar si la categoría tiene más artículos
         const categoryHasMoreArticles = await tx.article.findFirst({
            where: {
               categoryId: articleDeleted.category.id,
               id: { not: articleDeleted.id }, // Excluir el que acabamos de eliminar
            },
         })

         // 3) Solo eliminar la categoría si no tiene más artículos
         let categoryDeleted = null

         if (!categoryHasMoreArticles) {
            categoryDeleted = await tx.articleCategory.delete({
               where: { id: articleDeleted.category.id },
            })
         }

         return {
            articleDeleted,
            categoryDeleted,
         } as const
      })

      return res.status(200).send({
         message: result.categoryDeleted
            ? 'Artículo y categoría eliminados'
            : 'Artículo eliminado',
         article: result.articleDeleted,
         category: result.categoryDeleted, //category solo se envía si se eliminó la categoría
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

export default articlesRouter
