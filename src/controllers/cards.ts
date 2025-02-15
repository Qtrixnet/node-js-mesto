import { Request, Response, NextFunction } from 'express'
import { Error as MongooseError } from 'mongoose'
import { ErrorCode, ErrorMessage } from '../constants/errors'
import { Card } from '../models/card'
import { ValidationError } from '../errors/validation-error'

export const getCards = async (_: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.find({})

    res.json(cards)
  } catch {
    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .send({ message: 'Произошла ошибка' })
  }
}

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, link } = req.body
    const owner = res.locals.user._id

    const card = await Card.create({ name, link, owner })

    res.status(201).json(card)
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError(err.message))
    } else {
      next(err)
    }
  }
}

export const deleteCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params

    const card = await Card.findByIdAndDelete(cardId)

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json({ message: 'Карточка удалена' })
  } catch (err) {
    const error = err as Error

    if (error.name === 'CastError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: ErrorMessage.INVALID_ID })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}

export const likeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: res.locals.user._id } },
      { new: true }
    )

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json(card)
  } catch (err) {
    const error = err as Error

    if (error.name === 'CastError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: ErrorMessage.INVALID_ID })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}

export const dislikeCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: res.locals.user._id } },
      { new: true }
    )

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json(card)
  } catch (err) {
    const error = err as Error

    if (error.name === 'CastError') {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: ErrorMessage.INVALID_ID })
    } else {
      res
        .status(ErrorCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' })
    }
  }
}
