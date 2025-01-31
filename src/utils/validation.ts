import mongoose from 'mongoose'
import { Response } from 'express'
import { ErrorMessage } from '@constants/errors'

export const validateObjectId = (
  id: string,
  status: 400,
  res: Response
): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(status).json({ message: ErrorMessage.INVALID_ID })
  }
}

export const handleValidationError = (res: Response, error: Error) => {
  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: ErrorMessage.VALIDATION_ERROR,
      error: error.message
    })
  }
}
