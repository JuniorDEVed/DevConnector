import express from 'express'
import { asyncHandler } from '../../../core/asyncHandler.js'
import { NotFoundError } from '../../../core/apiErrors.js'
import { authGuard } from '../../../guard/authGuard.js'

const router = express.Router()

// @route  GET v1/auth
// @desc   Test route
// @access Public
router.get(
  '/',
  authGuard,
  asyncHandler(async (req, res, next) => {
    const user = req.user
    if (!user) return next(new NotFoundError('Users not found'))

    res.status(200).send(user)
  })
)

export default router