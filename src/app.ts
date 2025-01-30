import express, { NextFunction, Response, Request } from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users'
import cardsRouter from './routes/cards'

const PORT = 3000

const app = express()

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, _: Response, next: NextFunction) => {
  req.user = {
    _id: '679a6d51aaba447b40d87278'
  }

  next()
})

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
