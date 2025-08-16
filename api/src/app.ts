import { articlesRouter, ordersRouter } from './routes'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 3030
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/articles', articlesRouter)
app.use('/api/orders', ordersRouter)

app.listen(PORT, () => {
   console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
