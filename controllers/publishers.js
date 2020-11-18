const Publisher = require("../models/Publisher");
const path = require("path");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc           Get all publishers
// @route          GET /api/v1/publishers
// @access         Public
exports.getPublishers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc           Get single publisher
// @route          GET /api/v1/publishers/:id
// @access         Public
exports.getPublisher = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);

  if (!publisher) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: publisher,
  });
});

// @desc           Create new publisher
// @route          POST /api/v1/publishers
// @access         Private
exports.createPublisher = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await Publisher.findOne({ user: req.user.id });

  // if user is not admin they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with id of ${req.user.id} has already published`,
        400
      )
    );
  }

  const publisher = await Publisher.create(req.body);

  res.status(200).json({
    success: true,
    data: publisher,
  });
});

// @desc           Update publisher
// @route          PUT /api/v1/publishers/:id
// @access         Private
exports.updatePublisher = asyncHandler(async (req, res, next) => {
  let publisher = await Publisher.findById(req.params.id);

  if (!publisher) {
    return next(
      new ErrorResponse(`Resourse not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the owener of the publisher
  if (publisher.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to update this publisher`,
        401
      )
    );
  }

  publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: publisher,
  });
});

// @desc           Delete publisher
// @route          DELETE  /api/v1/publishers/:id
// @access         Private
exports.deletePublisher = asyncHandler(async (req, res, next) => {
  // I could use (findByIdAndDelete) but i to make the middleware works i did the below
  const publisher = await Publisher.findById(req.params.id);

  if (!publisher) {
    return next(
      new ErrorResponse(`Resourse not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the owner of the publisher
  if (publisher.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to delete this publisher`,
        401
      )
    );
  }

  await publisher.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc           Upload photo for publisher
// @route          PUT /api/v1/publishers/:id/photo
// @access         Private
exports.uploadPublisherPhoto = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);

  if (!publisher) {
    return next(
      new ErrorResponse(`Resourse not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the owner of the publisher
  if (publisher.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to update this publisher`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // check filesize
  if (file.size > process.env.MAX_FIELD_UPLOAD) {
    return next(new ErrorResponse(`Please upload a image less than 1mb`, 400));
  }

  // create custom file name
  file.name = `photo_${publisher._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("problem with file upload", 500));
    }
  });

  await Publisher.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});
