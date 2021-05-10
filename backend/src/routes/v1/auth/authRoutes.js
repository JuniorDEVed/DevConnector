import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../../core/asyncHandler.js'
import { BadRequestError, NotFoundError } from '../../../core/apiErrors.js'
import { authGuard } from '../../../guard/authGuard.js'
import { checkSchema } from 'express-validator'
import { validationHandler } from '../../../core/validationHandler.js'
import { jwtSecret } from '../../../config.js'
import { authPostValidator } from './authValidators.js'
import UserModel from '../../../database/mongoDB/models/UserModel.js'

const router = express.Router()

// @route  GET v1/auth
// @desc   return a user by id if authenticated
// @access Public
router.get(
  '/',
  authGuard,
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('-password')
    if (!user) return next(new NotFoundError('User not found'))

    res.status(200).send(user)
  })
)

// @route  POST v1/auth
// @desc   Authenticate user
// @access Public
router.post(
  '/',
  checkSchema(authPostValidator),
  asyncHandler(async (req, res, next) => {
    validationHandler(req)
    const { email, password } = req.body

    let user = await UserModel.findOne({ email })
    if (!user) return next(new NotFoundError('User not found'))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return next(new BadRequestError('Invalid credentials'))

    const payload = {
      user: {
        id: user._id,
      },
    }

    // jwt sign and return token & user object in response to client
    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err
      res.status(201).send({ token, user })
    })
  })
)

export default router