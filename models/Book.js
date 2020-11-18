const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a book title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  writer: {
    type: String,
    required: [true, "Please add a writer name"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
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

module.exports = mongoose.model("Book", BookSchema);
