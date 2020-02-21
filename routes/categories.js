const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

router.get("/", async (req, res) => {
  const result = await Attendee.distinct("category");
  res.json({ count: result.length, data: result });
});

module.exports = router;
