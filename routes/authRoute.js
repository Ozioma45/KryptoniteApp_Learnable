const express = require("express");
const { uploadFile } = require("../controllers/upload.controller");
const Auth = require("../middlewares/Auth.js");
const { upload } = require("../config/cloudinary.js");
const { register, login, verifyOTP } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);

// Route for file uploads
router.post("/upload", Auth, upload.single("file"), uploadFile);

module.exports = router;
