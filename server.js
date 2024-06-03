const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const redis = require("redis");
const authRoutes = require("./routes/authRoute");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection established");
  } catch (error) {
    console.log(error);
  }
};

connectDb();

// Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

app.locals.redisClient = redisClient;

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
