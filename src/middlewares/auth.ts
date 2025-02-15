import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { FakeAuth } from '../types'
import { AuthError } from '../errors/auth-error'

export const auth = (
  req: Request,
  res: Response<unknown, FakeAuth>,
  next: NextFunction
) => {
  const { cookies } = req

  if (!cookies?.jwt) {
    return next(new AuthError('Авторизуйтесь'))
  }

  let payload

  try {
    payload = verify(cookies.jwt, 'secret-key')

    res.locals.user = payload as { _id: string }

    return next()
  } catch {
    return next(new AuthError('Авторизуйтесь'))
  }
}
