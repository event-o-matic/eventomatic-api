const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
  fullname: String,
  email: {
    type: String,
    unique: true
  },
  utils: Array
});

module.exports = mongoose.model("Attendee", AttendeeSchema);
