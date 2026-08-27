const router = require("express").Router();
const Booking = require("../models/Booking");

const {
  createBooking,
  getBookings,
  updateBookingStatus,
  updateTechnicianReport,
  editBooking,
  cancelBooking,
  markCompleted
} = require("../controllers/bookingController");

router.delete("/:id", async (req, res) => {

  try {

    console.log("DELETE ID:", req.params.id);

    const deletedBooking =
      await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });

  } catch (err) {

    console.log("DELETE ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
});

router.post("/", createBooking);

router.get("/", getBookings);

router.put("/:id", updateBookingStatus);

router.put("/:id/report", updateTechnicianReport);

router.put("/:id/complete", markCompleted);

router.put("/:id/edit", editBooking);

router.put("/:id/cancel", cancelBooking);

module.exports = router;