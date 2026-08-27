const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  hall: String,
  name: String,
  designation: {
  type: String,
  required: true
},
  email: String,
  phone: String,
  college: String,
  department: String,
  year: String,
  purpose: String,
  equipment: {
  type: String,
  required: true
},
otherEquipment: {
  type: String,
  default: ""
},
  date: String,
  slots: [String],
  status: {
  type: String,
  enum: ["pending", "approved", "rejected", "completed"], // ✅ ADD THIS
  default: "pending"
},
technicianReport: {
  keyReturned: { type: String },          // Yes / No
  damageFound: { type: String },
  bannerRemoved: { type: String },
  chairsArranged: { type: String },
  itemsReturned: { type: String },
  other: { type: String }
}
});

module.exports = mongoose.model("Booking", bookingSchema);