import { Router } from 'express'
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUserInfo
} from '../controllers/users'
import {
  validateAvatar,
  validateEditableUserData,
  validateUserId
} from '../constants/validators'

export const usersRouter = Router()

usersRouter.get('/', getUsers)
usersRouter.get('/me', getCurrentUserInfo)
usersRouter.get('/:userId', validateUserId, getUserById)
usersRouter.patch('/me', validateEditableUserData, updateProfile)
usersRouter.patch('/me/avatar', validateAvatar, updateAvatar)
