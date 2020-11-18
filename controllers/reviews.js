const Review = require("../models/Review");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

const Publisher = require("../models/Publisher");

// @desc           Get all revews
// @route          GET /api/v1/reviews
// @route          GET /api/v1/publishers/:publisherId/reviews
// @access         Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.publisherId) {
    const reviews = await Review.find({ publisher: req.params.publisherId });
    return res
      .status(200)
      .json({ success: true, data: reviews, count: reviews.length });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc           Get single review
// @route          GET /api/v1/reviews/:id
// @access         Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc           Create review
// @route          POST /api/v1/publisher/publisherId/reviews
// @access         Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.publisher = req.params.publisherId;
  req.body.user = req.user.id;

  const publisher = await Publisher.findById(req.params.publisherId);

  if (!publisher) {
    return next(
      new ErrorResponse(
        `No publisher with the id of ${req.params.publisherId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @desc           Update review
// @route          PUT /api/v1/publisher/publisherId/reviews/:id
// @access         Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is owner or user is admin

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user not authorize to update this review`, 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc           delete review
// @route          DELETE /api/v1/publisher/publisherId/reviews/:id
// @access         Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.id}`, 404)
    );
  }

  // Make sure the user is owner or user is admin

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`user not authorize to update this review`, 401)
    );
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
