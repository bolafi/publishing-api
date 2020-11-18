const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../middlewares/error");
const User = require("../models/User");

// @desc  Get all users
// route   GET  api/v1/users
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get single user
// route   GET  api/v1/users/:id
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("user not found", 404));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc   Create new user
// @route  POST  api/v1/users
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc   Update user
// @route  PUT api/v1/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc   Delete user
// @route  DELETE api/v1/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});
