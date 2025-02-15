import { Router } from 'express'
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUserInfo
} from '../controllers/users'

export const usersRouter = Router()

usersRouter.get('/', getUsers)
usersRouter.get('/me', getCurrentUserInfo)
usersRouter.get('/:userId', getUserById)
usersRouter.patch('/me', updateProfile)
usersRouter.patch('/me/avatar', updateAvatar)
