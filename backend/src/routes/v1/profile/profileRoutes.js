import express from 'express'
import { asyncHandler } from '../../../core/asyncHandler.js'
import { NotFoundError } from '../../../core/apiErrors.js'
import { authGuard } from '../../../guard/authGuard.js'
import ProfileModel from '../../../database/mongoDB/models/ProfileModel.js'
import { checkSchema } from 'express-validator'

const router = express.Router()

// @route  GET v1/profile/me
// @desc   Get current users profile
// @access Private
router.get(
  '/me',
  authGuard,
  asyncHandler(async (req, res, next) => {
    const profile = await ProfileModel.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) return next(new NotFoundError('No profile found for user'))

    res.status(200).send(profile)
  })
)

export default router