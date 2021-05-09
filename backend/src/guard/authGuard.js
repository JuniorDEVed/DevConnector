import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config.js'
import { UnauthorizedError } from '../core/apiErrors.js'
import { asyncHandler } from '../core/asyncHandler.js'

export const authGuard = asyncHandler(async (req, res, next) => {
  // get header
  const authHeader = req.headers.authorization
  if (!authHeader) return next(new UnauthorizedError('No token, access denied'))

  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, jwtSecret)
  req.user = decoded.user

  next()
})