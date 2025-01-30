import User from '../models/user'
import { Request, Response } from 'express'
import { validateObjectId, handleValidationError } from '../utils/validation'
import { ErrorCode } from '../constants/errorConstants'

export const getUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({})

    res.json(users)
  } catch (err) {
    const error = err as Error

    res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({
      message: 'Ошибка при получении пользователей',
      error: error.message
    })
  }
}

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params

    validateObjectId(userId, ErrorCode.BAD_REQUEST, res)

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

    handleValidationError(res, error)

    res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({
      message: 'Ошибка при создании пользователя',
      error: error.message
    })
  }
}

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, about } = req.body
    const userId = req.user._id

    if (!name || !about) {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: 'Имя и информация о себе обязательны' })
      return
    }

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

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при обновлении профиля', error })
  }
}

export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { avatar } = req.body
    const userId = req.user._id

    if (!avatar) {
      res.status(ErrorCode.BAD_REQUEST).json({ message: 'Аватар обязателен' })
      return
    }

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

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при обновлении аватара', error })
  }
}
