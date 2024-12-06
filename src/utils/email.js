const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_MAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

exports.sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.NODEMAILER_MAIL,
    to,
    subject,
    html:htmlContent,
  };

  return transporter.sendMail(mailOptions);
};