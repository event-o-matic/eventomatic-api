let config = require("../config/config");
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const Attendee = require("../models/Attendee");
const { avalibleUtils } = require("../helpers/constants");

sgMail.setApiKey(config.SENDGRID_API_KEY);

// [AUTHOR: PRUTHVI PATEL]
router.post("/check/:util", async (req, res, next) => {
  const reqUtil = req.params.util;

  if (avalibleUtils.indexOf(reqUtil) === -1)
    return res
      .status(404)
      .json({ success: false, error: `${reqUtil} is not correct utility!` });

  if (!req.body.id) {
    return res
      .status(422)
      .json({ success: false, error: "No user id provided!" });
  }

  const msg = "";

  try {
    const id = req.body.id;
    const dbAttendee = await Attendee.findById(id);
    if (!dbAttendee)
      return res.status(404).json({ success: false, error: "user not found!" });

    const utils = dbAttendee.utils || [];
    if (utils.indexOf(reqUtil) !== -1)
      return res.status(400).json({
        success: false,
        error: `${dbAttendee.fullname} already received ${reqUtil}!`
      });

    utils.push(reqUtil);
    dbAttendee.update({ utils: utils });
    await dbAttendee.save();
    return res.json({
      success: true,
      msg: `${dbAttendee.fullname} received ${reqUtil} successfully.`
    });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
