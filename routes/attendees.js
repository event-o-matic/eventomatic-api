const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

router.get("/", async (req, res) => {
  const result = await Attendee.find();
  res.json({ count: result.length, data: result });
});

router.get("/c/:category", async (req, res) => {
  const result = await Attendee.find({ category: req.params.category });
  res.json({ count: result.length, data: result });
});
router.get("/u/:util", async (req, res) => {
  const result = await Attendee.find({ utils: { $in: req.params.util } });
  res.json({ count: result.length, data: result });
});

module.exports = router;
