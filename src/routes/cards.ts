import { Router } from 'express'
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} from '../controllers/cards'
import { validateCard, validateCardId } from '../constants/validators'

export const cardsRouter = Router()

cardsRouter.get('/', getCards)
cardsRouter.post('/', validateCard, createCard)
cardsRouter.delete('/:cardId', validateCardId, deleteCard)
cardsRouter.put('/:cardId/likes', validateCardId, likeCard)
cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard)
