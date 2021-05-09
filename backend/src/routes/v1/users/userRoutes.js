import express from 'express'
import bcrypt from 'bcryptjs'
import gravatar from 'gravatar'
import jwt from 'jsonwebtoken'
import { checkSchema } from 'express-validator'
import { usersPostValidator } from './userValidator.js'
import { asyncHandler } from '../../../core/asyncHandler.js'
import { BadRequestError, NotFoundError } from '../../../core/apiErrors.js'
import { validationHandler } from '../../../core/validationHandler.js'
import { jwtSecret } from '../../../config.js'
import UserModel from '../../../database/mongoDB/models/UserModel.js'

const router = express.Router()

// @route  GET v1/users
// @desc   Test route
// @access Public
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const users = await UserModel.find()
    if (!users) return next(new NotFoundError('Users not found'))

    res.status(200).send(users)
  })
)

// @route  POST v1/users
// @desc   Register user
// @access Public
router.post(
  '/',
  checkSchema(usersPostValidator),
  asyncHandler(async (req, res, next) => {
    validationHandler(req)

    const { name, email, password } = req.body

    let user = await UserModel.findOne({ email })
    if (user) return next(new BadRequestError('User already exists'))

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    })

    user = new UserModel({
      name,
      email,
      avatar,
      password,
    })

    // hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // save to db
    user = await user.save()

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