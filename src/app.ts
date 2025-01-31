import express, { NextFunction, Response, Request } from 'express'
import mongoose from 'mongoose'
import usersRouter from '@routes/users'
import cardsRouter from '@routes/cards'
import { FakeAuth } from './types'

const PORT = 3000

const app = express()

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  // eslint-disable-next-line no-console
  .then(() => console.log('✅ Connected to MongoDB'))
  // eslint-disable-next-line no-console
  .catch((err) => console.error('❌ MongoDB connection error:', err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((_: Request, res: Response<unknown, FakeAuth>, next: NextFunction) => {
  res.locals.user = {
    _id: '679a6d51aaba447b40d87278'
  }

  next()
})

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
