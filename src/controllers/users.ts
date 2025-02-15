import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Error as MongooseError } from 'mongoose'
import { ErrorCode, ErrorMessage } from '../constants/errors'
import { User } from '../models/user'
import { FakeAuth } from '../types'
import { ConflictError } from '../errors/conflict-error'
import { ValidationError } from '../errors/validation-error'

export const getUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({})

    res.json(users)
  } catch {
    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .send({ message: 'Произошла ошибка' })
  }
}

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      res
        .status(ErrorCode.NOT_FOUND)
        .json({ message: 'Пользователь не найден' })
      return
    }

    res.json(user)
  } catch (err) {
    const error = err as Error

    if (error.name === 'CastError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: ErrorMessage.INVALID_ID })
    } else {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({
        message: 'Ошибка при получении пользователя',
        error: error.message
      })
    }
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, about, avatar, email, password } = req.body

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })

    res.status(201).json(user)
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError(err.message))
    } else if (err instanceof Error && err.message.includes('11000')) {
      next(new ConflictError('Пользователь уже существует'))
    } else {
      next(err)
    }
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, about } = req.body
    const userId = res.locals.user._id

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    )

    if (!user) {
      res
        .status(ErrorCode.NOT_FOUND)
        .json({ message: 'Пользователь не найден' })
      return
    }

    res.json(user)
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new ValidationError(err.message))
    } else if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError(err.message))
    } else {
      next(err)
    }
  }
}

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { avatar } = req.body
    const userId = res.locals.user._id

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    )

    if (!user) {
      res
        .status(ErrorCode.NOT_FOUND)
        .json({ message: 'Пользователь не найден' })
      return
    }

    res.json(user)
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new ValidationError(err.message))
    } else if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError(err.message))
    } else {
      next(err)
    }
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findUserByCredentials(email, password)

    const token = sign({ _id: user._id }, 'secret-key', {
      expiresIn: '7d'
    })

    res
      .cookie('jwt', token, {
        maxAge: 3_600_000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      })
      .send({ message: 'Вы вошли в систему!' })
  } catch (err) {
    const error = err as Error

    if (error.name === '?') {
      res.status(ErrorCode.UNAUTHORIZED).send({ message: 'Авторизуйтесь' })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}

export const getCurrentUserInfo = (
  _req: Request,
  res: Response<unknown, FakeAuth>,
  next: NextFunction
) => {
  const userId = res.locals.user._id

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      res.send(user)
    })
    .catch(next)
}
