require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* DATABASE CONNECTION */

connectDB();

/* CREATE ADMIN */

async function createAdmin() {
  try {
    const admin = await User.findOne({
      email: "admin@hall.com"
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(
        "Admin@123",
        10
      );

      await User.create({
        email: "admin@hall.com",
        password: hashedPassword,
        role: "admin"
      });

      console.log("Default admin created");
    }
  } catch (error) {
    console.error("Admin creation error:", error);
  }
}

createAdmin();

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

/* TEST ROUTE */

app.get("/", (req, res) => {
  res.json({
    message: "Hall Booking Backend API is running"
  });
});

/* EXPORT FOR VERCEL */

module.exports = app;