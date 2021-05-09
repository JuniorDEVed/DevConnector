import express from "express";
import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import { NotFoundError } from "../../../core/apiErrors.js";

const router = express.Router();

// @route  GET v1/profile
// @desc   Test route
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const user = { message: "profile route" };
    if (!user) return next(new NotFoundError("Users not found"));

    res.status(200).send(user);
  })
);

export default router;