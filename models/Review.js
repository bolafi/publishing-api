const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publisher: {
    type: mongoose.Schema.ObjectId,
    ref: "Publisher",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ publisher: 1, user: 1 }, { unique: true });

// Create static method to get average of rating and save
ReviewSchema.statics.getAverageRating = async function (publisherId) {
  const obj = await this.aggregate([
    {
      $match: { publisher: publisherId },
    },
    {
      $group: { _id: "$publisher", averageRating: { $avg: "$rating" } },
    },
  ]);

  try {
    await this.model("Publisher").findByIdAndUpdate(publisherId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.publisher);
});

// Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.publisher);
});

module.exports = mongoose.model("Review", ReviewSchema);
