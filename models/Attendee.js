const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
  fullname: String,
  email: String,
  utils: Array,
  category: String
});

module.exports = mongoose.model("Attendee", AttendeeSchema);
