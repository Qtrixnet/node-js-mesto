import { Request, Response } from 'express'
import { ErrorCode } from '@constants/errors'
import User from '@models/user'

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

    res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({
      message: 'Ошибка при получении пользователя',
      error: error.message
    })
  }
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, about, avatar } = req.body

    const user = await User.create({ name, about, avatar })

    res.status(201).json(user)
  } catch (err) {
    const error = err as Error

    if (error.name === 'ValidationError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, about } = req.body
    // eslint-disable-next-line no-underscore-dangle
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
    const error = err as Error

    if (error.name === 'ValidationError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}

export const updateAvatar = async (
  req: Request,
  res: Response
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
    const error = err as Error

    if (error.name === 'ValidationError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}
