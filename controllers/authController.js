const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");
const { generateOTP, verifyOTP } = require("../utils/otpService");
const { generateToken } = require("../utils/jwtService");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, isVerified: false });
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Confirmation OTP",
    text: "Your OTP code is ${otp}. It will expire in 5 minutes.",
  };
  sendEmail(mailOptions, (error) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({
      message:
        "Registration successful. Please check your email for confirmation.",
    });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const otp = generateOTP();
  await req.app.locals.redisClient.set(email, otp, "EX", 300);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };
  sendEmail(mailOptions, (error) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ message: "OTP sent to email" });
  });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  verifyOTP(req.app.locals.redisClient, email, otp, (error, valid) => {
    if (error) return res.status(500).json({ message: error.message });
    if (!valid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const token = generateToken({ email });
    res.status(200).json({ token });
  });
};
