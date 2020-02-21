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

router.post("/resetUtils", async (req, res, next) => {
  try {
    const result = await Attendee.updateMany({}, { $set: { utils: [] } });

    return res.json({
      success: true,
      msg: `${result.n} utililies updated.`
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
