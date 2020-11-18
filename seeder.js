const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// load models
const Publisher = require("./models/Publisher");
const Book = require("./models/Book");
const User = require("./models/User");
const Review = require("./models/Review");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Read JSON files
const publishers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/publishers.json`, "utf-8")
);

const books = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/books.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Publisher.create(publishers);
    await Book.create(books);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data Imported...".green.inverse);
  } catch (error) {
    console.log(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Publisher.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data Destroyed...".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

// The process.argv property returns an array containing the command line arguments passed when the Node.js process was launched.
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
