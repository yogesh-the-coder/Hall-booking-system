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


/* CREATE ADMIN FUNCTION */

async function createAdmin() {

  try {

    const admin = await User.findOne({ email: "admin@hall.com" });

    if (!admin) {

      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        email: "admin@hall.com",
        password: hashedPassword,
        role: "admin"
      });

      console.log("Default admin created");

    } else {

      console.log("Admin already exists");

    }

  } catch (error) {

    console.error("Admin creation error:", error);

  }

}

/* START SERVER */

async function startServer() {

  await connectDB();

  await createAdmin();

  app.use("/api/auth", authRoutes);
  app.use("/api/bookings", bookingRoutes);

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });

}

startServer();