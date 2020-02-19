const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Attendee = require("../models/Attendee");
const fs = require("fs");
const csv = require("csv-parser");

router.get("/", async (req, res) => {
  const result = await Attendee.find();
  res.json(result);
});

router.get("/:id", (req, res) => {
  //   get one
});

router.post("/import", (req, res, next) => {
  let attendees = [];
  try {
    fs.createReadStream("./data/attendees.csv")
      .pipe(csv())
      .on("data", row => {
        attendees.push({
          fullname: row.name,
          email: row.email
        });
      })
      .on("end", async () => {
        // console.log(attendees);

        const dbAttendees = await Attendee.find();

        // Only need emails of all db attendees
        const dbAttendeeEmails = dbAttendees.map(
          dbAttendee => dbAttendee.email
        );

        // filter out only new entries of email
        attendees = attendees.filter(
          attendee => dbAttendeeEmails.indexOf(attendee.email) === -1
        );
        // const result = [];
        const result = await Attendee.insertMany(attendees);
        return res.json({
          success: true,
          msg: `Imported ${result.length} attendees successfully!`,
          insertedCount: result.length
        });
      });
  } catch (e) {
    next(e);
  }
});

router.post("/addone", async (req, res, next) => {
  try {
    const newAttendee = new Attendee({
      email: "test4@test.com",
      fullname: "dummy three"
    });

    await newAttendee.save();
    return res.json({ success: true, msg: "Attendee added successfully!" });
  } catch (e) {
    next(e);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    await Attendee.deleteMany();
    return res.json({ success: true, msg: "All Attendee deleted!" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
