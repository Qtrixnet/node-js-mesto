import express, { Response, Request, NextFunction } from 'express'
import mongoose from 'mongoose'
import { usersRouter } from './routes/users'
import { cardsRouter } from './routes/cards'
import { login, createUser } from './controllers/users'
import { auth } from './middlewares/auth'
import { requestLogger, errorLogger } from './middlewares/logger'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'

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

app.use(requestLogger)

app.use('/signin', login)
app.use('/signup', createUser)

app.use(auth)

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use(errorLogger)
app.use(errorHandler)

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'))
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
