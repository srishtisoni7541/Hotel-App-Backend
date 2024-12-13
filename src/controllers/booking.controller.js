const bookingModel = require("../models/booking.model");
const propertyModel = require("../models/property.model");
const CustomError = require("../utils/customErrors");
const { sendEmail } = require("../utils/email");
const { bookingConfirmationTemplate } = require("../utils/emailTemplates");

module.exports.createBooking = async (req, res, next) => {
  const {
    propertyId,
    
    totalAmount,
    status,
    paymentId,
  } = req.body;

  try {
    if (
      !propertyId ||
      
      !totalAmount ||
      !status ||
      !paymentId
    ) {
      return next(new CustomError("Missing required booking details", 400));
    }

    const property = await propertyModel.findById(propertyId);

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const booking = await bookingModel.create({
      user: req.user._id,
      property: propertyId,
      checkInDate : new Date(),
      checkOutDate:new Date(),
      totalPrice: totalAmount,
      status,
      razorpayOrderID: paymentId,
    });

    await booking.save();

    const emailTemplate = bookingConfirmationTemplate(
      req.user.username,
      property.location,
      
    );

    await sendEmail(req.user.email, "Booking Confirmation", emailTemplate);

    res.status(200).json({
      success: true,
      booking,
      paymentId,
      currency: "INR",
      amount: totalAmount,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.viewBookings = async (req, res, next) => {
  try {
    const id = req.user._id;
    const bookings = await bookingModel
      .find({
        user: id,
      })
      .populate("property", "title location price")
      .populate("user", "username email");

      res.status(200).json(bookings);
  } catch (error) {
    next(new CustomError("Error fetching bookings", 500));
  }
};


module.exports.cancelBooking = async (req,res,next)=>{
    try {
        const {id} = req.params;
        const booking = await bookingModel.findById(id);

        if(!booking) return next(new CustomError("Booking not found",404));

        if(booking.user.toString() !== req.user._id.toString() ) return next(new CustomError("Unauthorized to cancel this booking",403));

        booking.status = "Cancelled";
        await booking.save();

        res.status(200).json({
            message:"Booking cancelled successfully",
            booking
        })
    } catch (error) {
        next(new CustomError(error.message,500));
    }
}