const nodemailer = require("nodemailer");

// Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_MAIL, // Email ID from environment variables
    pass: process.env.NODEMAILER_APP_PASSWORD, // App password from environment variables
  },
});

// Function to send an email
exports.sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_MAIL, // Sender's email address
      to,                               // Recipient's email address
      subject,                          // Subject of the email
      html: htmlContent,                // Email body in HTML format
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.response); // Log the response
    return info; // Return the response for further use
  } catch (error) {
    console.error("Error sending email: ", error); // Log the error
    throw error; // Re-throw the error for error handling
  }
};
