const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Elasticemail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = (mailOptions, callback) => {
  transporter.sendMail(mailOptions, callback);
};
