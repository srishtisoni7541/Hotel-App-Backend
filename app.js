require("dotenv").config();
const express = require("express");
const connect = require("./src/db/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorHandler"); // Fix the path if needed
const PORT = process.env.PORT || 3000;

// Connect to database
connect();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));

// Setup CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Example Routes (Add your routes here)
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Handle 404 errors for unknown routes
app.use("*", (req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

// Global error handler (Ensure this exports a middleware function)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
