const Book = require("../models/Book");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

const Publisher = require("../models/Publisher");

// @desc           Get all books
// @route          GET /api/v1/books
// @route          GET /api/v1/publishers/:publisherId/books
// @access         Private
exports.getBooks = asyncHandler(async (req, res, next) => {
  if (req.params.publisherId) {
    const books = await Book.find({ publisher: req.params.publisherId });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc           Get Single book
// @route          GET /api/v1/books/:id
// @access         Private
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc           Create new book
// @route          POST /api/v1/publishers/publisherId/books
// @access         Private
exports.addBook = asyncHandler(async (req, res, next) => {
  // here im setting the publisher field inside the Book model to the publisherID
  req.body.publisher = req.params.publisherId;
  req.body.user = req.user.id;

  const publisher = await Publisher.findById(req.params.publisherId);

  if (!publisher) {
    return next(
      new ErrorResponse(
        `No Publisher with id of ${req.params.publisherId}`,
        404
      )
    );
  }

  // Make sure user is owner of publisher
  if (publisher.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${user.req.id} is not authorize to add book to this publisher`,
        401
      )
    );
  }

  const book = await Book.create(req.body);
  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc           Update book
// @route          PUT /api/v1/books/:id
// @access         Private
exports.updateBook = asyncHandler(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  // Make sure user is owner of book
  if (book.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${user.req.id} is not authorize to update this book `,
        401
      )
    );
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: book,
  });
});

// @desc           DELETE Single book
// @route          DELETE /api/v1/books/:id
// @access         Private
exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  // Make sure user is owner of book
  if (book.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${user.req.id} is not authorize to delete this book `,
        401
      )
    );
  }

  await book.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
