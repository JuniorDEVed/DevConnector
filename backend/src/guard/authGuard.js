import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config.js'
import { UnauthorizedError } from '../core/apiErrors.js'
import { asyncHandler } from '../core/asyncHandler.js'

export const authGuard = asyncHandler(async (req, res, next) => {
  // get auth header
  const authHeader = req.headers.authorization
  // handle no-token situation
  if (!authHeader) return next(new UnauthorizedError('No token, access denied'))
  // split the token part from the authHeader
  const token = authHeader.split(' ')[1]
  // verify the token and extract the user
  const decoded = jwt.verify(token, jwtSecret)
  // attach user to req object and pass onto any receiving route
  req.user = decoded.user
  next()
})