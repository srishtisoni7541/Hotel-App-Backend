const express = require("express");
const { authenticateUser } = require("../middlewares/authMIddleware");
const {
  createBooking,
  viewBookings,
  cancelBooking,
} = require("../controllers/booking.controller");

const router = express.Router();

router.post("/", authenticateUser, createBooking);

router.get("/user", authenticateUser, viewBookings);

router.delete("/:id", authenticateUser, cancelBooking);

module.exports = router;