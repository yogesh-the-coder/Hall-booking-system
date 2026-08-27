const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



/* SIGNUP */

exports.signup = async (req, res) => {

  try {

    const { email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    res.json({ message: "User created" });

  } catch (err) {
    res.status(500).json(err);
  }
};


/* LOGIN */

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

  // PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // prevent cancel if already completed
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT /api/bookings/:id/edit
exports.editBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // allow edit only before completed
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot edit completed booking" });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};