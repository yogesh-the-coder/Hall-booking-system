const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");


/* =========================================================
   CREATE BOOKING
========================================================= */

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


    /* ---------- VALIDATION ---------- */

    if (
      !hall ||
      !name ||
      !designation ||
      !email ||
      !phone ||
      !date ||
      !slots
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    if (!equipment) {
      return res.status(400).json({
        message: "Equipment is required"
      });
    }

    if (
      equipment === "Other" &&
      !otherEquipment?.trim()
    ) {
      return res.status(400).json({
        message: "Please specify other equipment"
      });
    }


    /* ---------- NORMALIZE SLOTS ---------- */

    const normalizedSlots = Array.isArray(slots)
      ? slots
      : [slots];

    const isFullDay = normalizedSlots.some(
      (s) => s.includes("Full Day")
    );


    /* ---------- CHECK EXISTING BOOKING ---------- */

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
          {
            slots: {
              $in: normalizedSlots
            }
          },
          {
            slots: {
              $in: ["Full Day"]
            }
          }
        ]
      });

    }


    /* ---------- SLOT ALREADY BOOKED ---------- */

    if (exists) {
      return res.status(400).json({
        message: "Selected slot already booked"
      });
    }


    /* ---------- CREATE BOOKING ---------- */

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


    console.log(
      "Booking created:",
      booking._id
    );


    /* =====================================================
       SMS - USER
    ===================================================== */

    try {

      await sendSMS(
        phone,
        `Booking submitted for ${hall} on ${date}. Slots: ${normalizedSlots.join(", ")}`
      );

      console.log(
        "Booking SMS sent to:",
        phone
      );

    } catch (e) {

      console.error(
        "Booking SMS failed:",
        e.message
      );

    }


    /* =====================================================
       EMAIL - ADMIN
    ===================================================== */

    try {

      await sendEmail(
        process.env.EMAIL_USER,
        "New Booking Request",
        `New booking request

Hall: ${hall}
Name: ${name}
Email: ${email}
Phone: ${phone}
College: ${college || "Not provided"}
Department: ${department || "Not provided"}
Year: ${year || "Not provided"}
Purpose: ${purpose || "Not provided"}
Equipment: ${equipment}
Other Equipment: ${otherEquipment || "N/A"}
Date: ${date}
Slots: ${normalizedSlots.join(", ")}

Status: Pending
`
      );

      console.log(
        "Admin email sent to:",
        process.env.EMAIL_USER
      );

    } catch (e) {

      console.error(
        "Admin email failed:",
        e
      );

    }


    /* =====================================================
       EMAIL - USER
    ===================================================== */

    try {

      await sendEmail(
        email,
        "Booking Submitted",
        `Dear ${name},

Your hall booking request has been submitted successfully.

Booking Details
----------------

Hall: ${hall}
Date: ${date}
Slots: ${normalizedSlots.join(", ")}

Status: Pending

Your booking is currently waiting for approval.

You will receive another notification when the booking status is updated.

Thank you.

Hall Booking`
      );

      console.log(
        "User email sent to:",
        email
      );

    } catch (e) {

      console.error(
        "User email failed:",
        e
      );

    }


    /* ---------- RESPONSE ---------- */

    return res.json(booking);

  } catch (err) {

    console.error(
      "Create booking error:",
      err
    );

    return res.status(500).json({
      message: err.message
    });

  }
};


/* =========================================================
   GET BOOKINGS
========================================================= */

exports.getBookings = async (req, res) => {

  try {

    const bookings = await Booking
      .find()
      .sort({
        createdAt: -1
      });

    res.json(bookings);

  } catch (err) {

    console.error(
      "Get bookings error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

exports.updateBookingStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;


    /* ---------- FIND BOOKING ---------- */

    const booking = await Booking.findById(id);

    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }


    /* =====================================================
       CHECK SLOT CONFLICT WHEN APPROVING
    ===================================================== */

    if (status === "approved") {

      const isFullDay = booking.slots.some(
        (s) => s.includes("Full Day")
      );

      let conflict;


      if (isFullDay) {

        conflict = await Booking.findOne({
          _id: {
            $ne: booking._id
          },
          hall: booking.hall,
          date: booking.date,
          status: "approved"
        });

      } else {

        conflict = await Booking.findOne({
          _id: {
            $ne: booking._id
          },
          hall: booking.hall,
          date: booking.date,
          status: "approved",
          $or: [
            {
              slots: {
                $in: booking.slots
              }
            },
            {
              slots: {
                $in: ["Full Day"]
              }
            }
          ]
        });

      }


      /* ---------- CONFLICT ---------- */

      if (conflict) {

        return res.status(400).json({
          message: "Slot already approved"
        });

      }

    }


    /* ---------- UPDATE STATUS ---------- */

    booking.status = status;

    await booking.save();


    console.log(
      `Booking ${booking._id} status changed to ${status}`
    );


    /* =====================================================
       SMS - STATUS UPDATE
    ===================================================== */

    if (booking.phone) {

      try {

        const smsMessage =
          `Your booking for ${booking.hall} on ${booking.date} is ${status}. ` +
          `Slots: ${booking.slots.join(", ")}`;

        await sendSMS(
          booking.phone,
          smsMessage
        );

        console.log(
          "Status SMS sent to:",
          booking.phone
        );

      } catch (e) {

        console.error(
          "Status SMS failed:",
          e.message
        );

      }

    }


    /* =====================================================
       EMAIL - STATUS UPDATE
    ===================================================== */

    if (booking.email) {

      try {

        await sendEmail(
          booking.email,
          `Booking ${status}`,
          `Dear ${booking.name},

Your hall booking status has been updated.

Booking Details
----------------

Hall: ${booking.hall}
Date: ${booking.date}
Slots: ${booking.slots.join(", ")}

Status: ${status}

Thank you.

Hall Booking`
        );

        console.log(
          "Status email sent to:",
          booking.email
        );

      } catch (e) {

        console.error(
          "Status email failed:",
          e
        );

      }

    }


    /* ---------- RESPONSE ---------- */

    return res.json(booking);

  } catch (err) {

    console.error(
      "Update booking error:",
      err
    );

    return res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   UPDATE TECHNICIAN REPORT
========================================================= */

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


    /* ---------- VALIDATION ---------- */

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


    /* ---------- UPDATE REPORT ---------- */

    const booking =
      await Booking.findByIdAndUpdate(
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
        {
          new: true
        }
      );


    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }


    res.json(booking);

  } catch (err) {

    console.error(
      "Report update error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   MARK COMPLETED
========================================================= */

exports.markCompleted = async (req, res) => {

  try {

    const booking =
      await Booking.findById(req.params.id);


    /* ---------- BOOKING NOT FOUND ---------- */

    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }


    /* ---------- TECHNICIAN REPORT ---------- */

    const report =
      booking.technicianReport || {};


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


    /* ---------- FIX MISSING OLD DATA ---------- */

    if (!booking.designation) {
      booking.designation = "Others";
    }

    if (!booking.equipment) {
      booking.equipment = "All of the above";
    }


    /* ---------- MARK COMPLETED ---------- */

    booking.status = "completed";

    await booking.save();


    /* =====================================================
       SMS - COMPLETED
    ===================================================== */

    if (booking.phone) {

      try {

        await sendSMS(
          booking.phone,
          `Your booking for ${booking.hall} is completed.`
        );

        console.log(
          "Completion SMS sent to:",
          booking.phone
        );

      } catch (e) {

        console.error(
          "Completion SMS failed:",
          e.message
        );

      }

    }


    /* =====================================================
       EMAIL - COMPLETED
    ===================================================== */

    if (booking.email) {

      try {

        await sendEmail(
          booking.email,
          "Booking Completed",
          `Dear ${booking.name},

Your hall booking has been completed.

Hall: ${booking.hall}
Date: ${booking.date}
Slots: ${booking.slots.join(", ")}

Status: Completed

Thank you.

Hall Booking`
        );

        console.log(
          "Completion email sent to:",
          booking.email
        );

      } catch (e) {

        console.error(
          "Completion email failed:",
          e
        );

      }

    }


    /* ---------- RESPONSE ---------- */

    res.json(booking);

  } catch (err) {

    console.error(
      "Mark completed error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   EDIT BOOKING
========================================================= */

exports.editBooking = async (req, res) => {

  try {

    const existingBooking =
      await Booking.findById(req.params.id);


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


    const booking =
      await Booking.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          runValidators: true
        }
      );


    res.json(booking);

  } catch (err) {

    console.error(
      "Edit booking error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }

};


/* =========================================================
   CANCEL BOOKING
========================================================= */

exports.cancelBooking = async (req, res) => {

  try {

    const booking =
      await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: "cancelled"
        },
        {
          new: true
        }
      );


    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }


    /* =====================================================
       SMS - CANCELLED
    ===================================================== */

    if (booking.phone) {

      try {

        await sendSMS(
          booking.phone,
          `Your booking for ${booking.hall} on ${booking.date} has been cancelled.`
        );

        console.log(
          "Cancellation SMS sent to:",
          booking.phone
        );

      } catch (e) {

        console.error(
          "Cancellation SMS failed:",
          e.message
        );

      }

    }


    /* =====================================================
       EMAIL - CANCELLED
    ===================================================== */

    if (booking.email) {

      try {

        await sendEmail(
          booking.email,
          "Booking Cancelled",
          `Dear ${booking.name},

Your hall booking has been cancelled.

Hall: ${booking.hall}
Date: ${booking.date}
Slots: ${booking.slots.join(", ")}

Status: Cancelled

Thank you.

Hall Booking`
        );

        console.log(
          "Cancellation email sent to:",
          booking.email
        );

      } catch (e) {

        console.error(
          "Cancellation email failed:",
          e
        );

      }

    }


    /* ---------- RESPONSE ---------- */

    res.json({
      message: "Booking cancelled",
      booking
    });

  } catch (err) {

    console.error(
      "Cancel booking error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }

};