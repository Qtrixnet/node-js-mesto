import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Error as MongooseError } from 'mongoose'
import { User } from '../models/user'
import { FakeAuth } from '../types'
import { ConflictError } from '../errors/conflict-error'
import { ValidationError } from '../errors/validation-error'
import { NotFoundError } from '../errors/not-found-error'
import { AuthError } from '../errors/auth-error'

export const getUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({})

    res.json(users)
  } catch (err) {
    next(err)
  }
}

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
      throw new NotFoundError('Пользователь не найден')
    }

    res.json(user)
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      next(new ValidationError(err.message))
    } else {
      next(err)
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
      throw new NotFoundError('Пользователь не найден')
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
      throw new NotFoundError('Пользователь не найден')
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    if (err instanceof AuthError) {
      next(new AuthError(err.message))
    } else {
      next(err)
    }
  }
}

export const getCurrentUserInfo = async (
  _req: Request,
  res: Response<unknown, FakeAuth>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user._id

    const user = await User.findById(userId)

    if (!user) {
      throw new NotFoundError('Пользователь не найден')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}
