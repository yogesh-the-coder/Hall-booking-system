const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

/* ---------- CREATE BOOKING ---------- */

exports.createBooking = async (req, res) => {
  try {
    const {
      hall,
      name,
      designation,
      email,
      phone,
      college,
      department,
      year,
      purpose,
      equipment,
      otherEquipment,
      date,
      slots
    } = req.body;

    if (!hall || !name || !designation || !email || !phone || !date || !slots) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!equipment) {
      return res.status(400).json({ message: "Equipment is required" });
    }

    if (equipment === "Other" && !otherEquipment?.trim()) {
      return res.status(400).json({ message: "Please specify other equipment" });
    }

    const normalizedSlots = Array.isArray(slots) ? slots : [slots];

    const isFullDay = normalizedSlots.some(s => s.includes("Full Day"));

    let exists;

    if (isFullDay) {
      exists = await Booking.findOne({
        hall,
        date,
        status: "approved"
      });
    } else {
      exists = await Booking.findOne({
        hall,
        date,
        status: "approved",
        $or: [
          { slots: { $in: normalizedSlots } },
          { slots: { $in: ["Full Day"] } }
        ]
      });
    }

    if (exists) {
      return res.status(400).json({
        message: "Selected slot already booked"
      });
    }

    const booking = await Booking.create({
      hall,
      name,
      designation,
      email,
      phone,
      college,
      department,
      year,
      purpose,
      equipment,
      otherEquipment,
      date,
      slots: normalizedSlots,
      status: "pending"
    });

    await sendSMS(
  "8925319130",
  "Test SMS from Hall Booking App"
);

    /* SMS */
    try {
      await sendSMS(phone, `Booking submitted for ${hall} on ${date}`);
    } catch (e) {
      console.log("SMS error:", e.message);
    }

    /* EMAIL */
    try {
      await sendEmail(
        "itzmeyogesh2k4@gmail.com",
        "New Booking Request",
        `Booking for ${hall} on ${date}\nSlots: ${normalizedSlots.join(", ")}`
      );
    } catch (e) {
      console.log("Admin email failed:", e.message);
    }

    if (email) {
      try {
        await sendEmail(
          email,
          "Booking Submitted",
          `Your booking slots: ${normalizedSlots.join(", ")}`
        );
      } catch (e) {
        console.log("User email failed:", e.message);
      }
    }

    // ✅ SINGLE RESPONSE
    res.json(booking);

  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json(err);
  }
};



/* ---------- GET BOOKINGS ---------- */

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};


/* ---------- UPDATE STATUS ---------- */

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === "approved") {
      const isFullDay = booking.slots.some(s => s.includes("Full Day"));

      let conflict;

      if (isFullDay) {
        conflict = await Booking.findOne({
          _id: { $ne: booking._id },
          hall: booking.hall,
          date: booking.date,
          status: "approved"
        });
      } else {
        conflict = await Booking.findOne({
          _id: { $ne: booking._id },
          hall: booking.hall,
          date: booking.date,
          status: "approved",
          $or: [
            { slots: { $in: booking.slots } },
            { slots: { $in: ["Full Day"] } }
          ]
        });
      }

      if (conflict) {
        return res.status(400).json({
          message: "Slot already approved"
        });
      }
    }

    booking.status = status;
    await booking.save();

    /* SMS */

try {

  const smsMessage =
    `Booking submitted for ${hall} on ${date}. ` +
    `Slots: ${normalizedSlots.join(", ")}`;

  await sendSMS(phone, smsMessage);

  console.log("Booking SMS sent");

} catch (e) {

  console.log("SMS error:", e.message);

}

    /* EMAIL */
    if (booking.email) {
      try {
        await sendEmail(
          booking.email,
          "Booking Status Update",
          `Your booking for ${booking.hall} on ${booking.date} is ${status}`
        );
      } catch (e) {
        console.log("Status email failed:", e.message);
      }
    }

    // ✅ SINGLE RESPONSE
    res.json(booking);

  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json(err);
  }
};


/* ---------- TECHNICIAN REPORT ---------- */

exports.updateTechnicianReport = async (req, res) => {
  try {
    const {
      keyReturned,
      damageFound,
      bannerRemoved,
      chairsArranged,
      itemsReturned,
      other
    } = req.body;

    if (
      !keyReturned ||
      !damageFound ||
      !bannerRemoved ||
      !chairsArranged ||
      !itemsReturned
    ) {
      return res.status(400).json({
        message: "All report fields are required"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        technicianReport: {
          keyReturned,
          damageFound,
          bannerRemoved,
          chairsArranged,
          itemsReturned,
          other
        }
      },
      { new: true }
    );

    res.json(booking);

  } catch (err) {
    console.error("Report update error:", err);
    res.status(500).json(err);
  }
};


/* ---------- MARK COMPLETED ---------- */

exports.markCompleted = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const report = booking.technicianReport || {};

    if (
      !report.keyReturned ||
      !report.damageFound ||
      !report.bannerRemoved ||
      !report.chairsArranged ||
      !report.itemsReturned
    ) {
      return res.status(400).json({
        message:
          "Complete technician report before marking as completed"
      });
    }

    // ✅ FIX MISSING OLD DATA
    if (!booking.designation) {
      booking.designation = "Others";
    }

    if (!booking.equipment) {
      booking.equipment = "All of the above";
    }

    booking.status = "completed";

    await booking.save();

    try {
      await sendSMS(
        booking.phone,
        `Your booking for ${booking.hall} is completed`
      );
    } catch (e) {
      console.log("SMS error:", e.message);
    }

    res.json(booking);

  } catch (err) {

    console.error("Mark completed error:", err);

    res.status(500).json({
      message: err.message
    });
  }
};

  exports.editBooking = async (req, res) => {
  try {

    const existingBooking = await Booking.findById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const updatedData = {
      ...existingBooking.toObject(),

      ...req.body,

      designation:
        req.body.designation ||
        existingBooking.designation,

      equipment:
        req.body.equipment ||
        existingBooking.equipment
    };

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    res.json(booking);

  } catch (err) {

    console.error("Edit booking error:", err);

    res.status(500).json({
      message: err.message
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json(err);
  }
};