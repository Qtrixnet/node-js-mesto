import { Request, Response } from 'express'
import Card from '@models/card'
import { ErrorCode } from '@constants/errors'

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
  res: Response
): Promise<void> => {
  try {
    const { name, link } = req.body
    const owner = res.locals.user._id

    const card = await Card.create({ name, link, owner })

    res.status(201).json(card)
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
