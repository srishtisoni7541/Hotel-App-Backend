const User = require("../models/user.model.js");
const CustomError = require("../utils/customErrors.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // Import jwt for token generation

// Utility function to check if JWT_SECRET_KEY exists
const validateSecretKey = () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY must be defined in the environment variables.");
  }
};

module.exports.currentUser = (req, res, next) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Ensure JWT_SECRET_KEY is set
    validateSecretKey();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new CustomError("User already exists", 400));

    // Create the user
    const user = await User.create({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5, // 5 hours
    });

    // Send response
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

console.log(req.body);
  try {
    // Ensure JWT_SECRET_KEY is set
    validateSecretKey();

    // Check if the user exists
    const existingUser = await User.findOne({ email });
   
    if (!existingUser) return next(new CustomError("User does not exist", 400));
  

    // Authenticate user
    const user = await User.authenticate(email, password);
   // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5, // 5 hours
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(new CustomError("Logout Failed", 500));
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (username) req.user.username = username;
    if (email) req.user.email = email;
    if (password) req.user.password = await bcrypt.hash(password, 10);

    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: req.user,
    });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

module.exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Ensure JWT_SECRET_KEY is set
    validateSecretKey();

    const user = await User.findOne({ email });
    if (!user) return next(new CustomError("User not found", 404));

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:5713/reset-password/${resetToken}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.NODEMAILER_MAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click on the link to reset your password: ${resetLink}`,
    };

    // Send email
    await transporter.sendMail(mailOption);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
