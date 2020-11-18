const express = require("express");
const {
  getPublishers,
  createPublisher,
  getPublisher,
  updatePublisher,
  deletePublisher,
  uploadPublisherPhoto,
} = require("../controllers/publishers");

//
const advancedResults = require("../middlewares/advancedResults");
// call the publisher model
const Publisher = require("../models/Publisher");

// Include other resourses routers
const bookRouter = require("./books");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");

// Re-route into other resourese routers
router.use("/:publisherId/books", bookRouter);
router.use("/:publisherId/reviews", reviewRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadPublisherPhoto);

router
  .route("/")
  .get(
    advancedResults(Publisher, {
      path: "books",
      select: "title",
    }),
    getPublishers
  )
  .post(protect, authorize("publisher", "admin"), createPublisher);

router
  .route("/:id")
  .get(getPublisher)
  .put(protect, authorize("publisher", "admin"), updatePublisher)
  .delete(protect, authorize("publisher", "admin"), deletePublisher);

module.exports = router;
