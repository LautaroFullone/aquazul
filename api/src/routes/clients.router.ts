import { handleRouteError } from '../errors/handleRouteError'
import { Router, type Request, type Response } from 'express'
import { clientCreateSchema } from '../models/Client.model'
import prismaClient from '../prisma/prismaClient'
import { sleep } from '../utils/sleep'
import { generateCategoriesMap } from '../utils/generateMap'

const clientsRouter = Router()

// GET -> listar clientes y categorias
clientsRouter.get('/', async (req: Request, res: Response) => {
   await sleep(3000)
   try {
      const clients = await prismaClient.client.findMany({
         orderBy: { name: 'desc' },
         select: {
            id: true,
            name: true,
            contactName: true,
            phone: true,
            email: true,
            address: true,
            category: { select: { id: true, name: true } },
         },
      })

      const categories = generateCategoriesMap(clients)

      return res.status(200).send({
         clients,
         categories,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

// POST -> crear cliente
clientsRouter.post('/', async (req: Request, res: Response) => {
   try {
      const { name, contactName, address, phone, email } = clientCreateSchema.parse(
         req.body
      )

      const createdClient = await prismaClient.client.create({
         data: {
            name,
            contactName,
            address,
            phone,
            email,
         },
      })

      return res.status(201).send({
         message: 'Cliente creado',
         client: createdClient,
      })
   } catch (error) {
      return handleRouteError(res, error)
   }
})

export default clientsRouter
