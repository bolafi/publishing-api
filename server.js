const express = require("express");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const fileupload = require("express-fileupload");

const errorHandler = require("./middlewares/error");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connection to DB
connectDB();

// Route files
const publishers = require("./routes/publishers");
const books = require("./routes/books");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// Prevent xss attacks
app.use(xss());

// Rate limiting
const limiter = rateLimiting({
  windowMs: 10 * 60 * 1000, // 10min
  max: 100,
});

app.use(limiter);

// Prevent param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Mount Routes
app.use("/api/v1/publishers", publishers);
app.use("/api/v1/books", books);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
// Handle unhandeled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server & exit process
  server.close(() => process.exit(1));
});
