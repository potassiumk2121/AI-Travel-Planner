import { User } from "../models/User.js";
import { recordEvent } from "../services/analyticsService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/tokens.js";

const authResponse = (user, statusCode, res) => {
  const token = signToken(user);
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeJSON()
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  await recordEvent({ eventType: "signup", user, req });

  authResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  await recordEvent({ eventType: "login", user, req });

  authResponse(user, 200, res);
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user.toSafeJSON()
  });
});
