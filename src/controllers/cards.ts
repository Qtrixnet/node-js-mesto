import Card from '../models/card'
import { Request, Response } from 'express'
import { validateObjectId, handleValidationError } from '../utils/validation'
import { ErrorCode } from '../constants/errorConstants'

export const getCards = async (_: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.find({})

    res.json(cards)
  } catch (err) {
    const error = err as Error

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при получении карточек', error: error.message })
  }
}

export const createCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, link } = req.body
    const owner = req.user._id

    if (!name || !link) {
      res
        .status(ErrorCode.BAD_REQUEST)
        .json({ message: 'Имя и ссылка обязательны' })
      return
    }

    const card = await Card.create({ name, link, owner })

    res.status(201).json(card)
  } catch (err) {
    const error = err as Error

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при создании карточки', error: error.message })
  }
}

export const deleteCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params

    validateObjectId(cardId, ErrorCode.BAD_REQUEST, res)

    const card = await Card.findByIdAndDelete(cardId)

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json({ message: 'Карточка удалена' })
  } catch (err) {
    const error = err as Error

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при удалении карточки', error: error.message })
  }
}

export const likeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params

    validateObjectId(cardId, ErrorCode.BAD_REQUEST, res)

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json(card)
  } catch (err) {
    const error = err as Error

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при лайке карточки', error: error.message })
  }
}

export const dislikeCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params

    validateObjectId(cardId, ErrorCode.BAD_REQUEST, res)

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )

    if (!card) {
      res.status(ErrorCode.NOT_FOUND).json({ message: 'Карточка не найдена' })
      return
    }

    res.json(card)
  } catch (err) {
    const error = err as Error

    handleValidationError(res, error)

    res
      .status(ErrorCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Ошибка при дизлайке карточки', error: error.message })
  }
}
