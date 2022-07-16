// an end point file of backend server

import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config() // import some stuff from .env

connectDB()

const app = express() // initialize express

// morgan, untuk memberi tahu informasi method req, hitted route, status code dsb
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// mengakses data json di body. contoh untuk email password dsb
app.use(express.json())

// mounting
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// PAYPAL ENDPOINT
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

// mendefinisikan lokasi folder upload secara static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

if (process.env.NODE_ENV === 'production') {
  // jika dalam production, set frontend/build to a static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  // any routes '*' is going to point to index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound) // error middleware (url)
app.use(errorHandler) // error middleware (-example: product not found)

const PORT = process.env.PORT || 5000 // default value 5000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)
