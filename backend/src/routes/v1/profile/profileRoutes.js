import express from 'express'
import { asyncHandler } from '../../../core/asyncHandler.js'
import { NotFoundError } from '../../../core/apiErrors.js'
import { authGuard } from '../../../guard/authGuard.js'
import ProfileModel from '../../../database/mongoDB/models/ProfileModel.js'
import { checkSchema } from 'express-validator'
import { validationHandler } from '../../../core/validationHandler.js'
import { createProfileValidation } from './profileValidation.js'
import UserModel from '../../../database/mongoDB/models/UserModel.js'

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

// @route   POST v1/profile
// @desc    Create a profile or update user profile
// @access  Private
router.post(
  '/',
  [authGuard, checkSchema(createProfileValidation)],
  asyncHandler(async (req, res, next) => {
    validationHandler(req)

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    // builds base profile fields if passed
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skills) => skills.trim())
    }

    // build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    let profile = await ProfileModel.findOne({ user: req.user.id })
    // if profile exists then update with new values
    if (profile) {
      profile = await ProfileModel.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
      return res.status(201).send(profile)
    }

    // otherwise just save new profile
    profile = new ProfileModel(profileFields)
    await profile.save()

    res.status(201).send(profile)
  })
)

// @route   GET v1/profile/
// @desc    Get all profiles
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const profiles = await ProfileModel.find().populate('user', ['name', 'avatar'])

    if (!profiles) return next(new NotFoundError('Users not found'))

    res.status(200).send(profiles)
  })
)

// @route   GET v1/profile/user/:user_id
// @desc    Ge profile by user ID
// @access  Public
router.get(
  '/user/:user_id',
  asyncHandler(async (req, res, next) => {
    const id = req.params.user_id
    const profile = await ProfileModel.findOne({ user: id }).populate('user', ['name', 'avatar'])

    if (!profile) return next(new NotFoundError('Profile not found'))

    res.status(200).send(profile)
  })
)

// @route   DELETE v1/profile/
// @desc    Get all profiles
// @access  Private
router.delete(
  '/',
  authGuard,
  asyncHandler(async (req, res, next) => {
    console.log(req.user.id)
    // Remove profile
    await ProfileModel.findOneAndDelete({ user: req.user.id })
    await UserModel.findOneAndRemove({
      _id: req.user.id,
    })

    res.status(200).send({ msg: 'User and Profile deleted' })
  })
)

export default router