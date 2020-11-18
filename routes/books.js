const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addBook,
  getBooks,
  updateBook,
  getBook,
  deleteBook,
} = require("../controllers/books");

// call advancedResults
const advancedResults = require("../middlewares/advancedResults");
// call Book mode
const Book = require("../models/Book");

const { protect, authorize } = require("../middlewares/auth");

router
  .route("/")
  .get(
    advancedResults(Book, {
      path: "publisher",
      select: "name description",
    }),
    getBooks
  )
  .post(protect, authorize("publisher", "admin"), addBook);

router
  .route("/:id")
  .put(protect, authorize("publisher", "admin"), updateBook)
  .get(getBook)
  .delete(protect, authorize("publisher", "admin"), deleteBook);

module.exports = router;
