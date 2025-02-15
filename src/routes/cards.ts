import { Router } from 'express'
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} from '../controllers/cards'

export const cardsRouter = Router()

cardsRouter.get('/', getCards)
cardsRouter.post('/', createCard)
cardsRouter.delete('/:cardId', deleteCard)
cardsRouter.put('/:cardId/likes', likeCard)
cardsRouter.delete('/:cardId/likes', dislikeCard)
