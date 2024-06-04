const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { createClient } = require("redis");
const authRoutes = require("./routes/authRoute");
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

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
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.log("Could not connect to Redis:", err));

app.locals.redisClient = redisClient;

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
