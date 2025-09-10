import articlesRouter from './routes/articles.router'
import clientsRouter from './routes/clients.router'
import ordersRouter from './routes/orders.router'
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
app.use('/api/clients', clientsRouter)

app.listen(PORT, () => {
   console.log(`🚀 Server running on http://localhost:${PORT}`)
})
