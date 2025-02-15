import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  getCurrentUserInfo
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/me', getCurrentUserInfo)
router.get('/:userId', getUserById)
router.post('/', createUser)
router.patch('/me', updateProfile)
router.patch('/me/avatar', updateAvatar)

export default router
