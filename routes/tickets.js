let config = require("../config/config");
const csv = require("csv-parser");
const fs = require("fs");
var QRCode = require("qrcode");
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const Attendee = require("../models/Attendee");
const { avalibleUtils } = require("../helpers/constants");

sgMail.setApiKey(config.SENDGRID_API_KEY);
const ticketsFromCsv = [];
const path = require("path");
const directory = "./data";

router.get("/qrcode/email", async function(req, res) {
  // explicit read the .csv file
  fs.createReadStream("./data/attendees.csv")
    .pipe(csv())
    .on("data", row => {
      console.log(row);
      ticketsFromCsv.push({
        paymentId: row["Payment ID"],
        name: row["Buyer Name"],
        email: row["Buyer Email Address"],
        category: row["Link/Purpose"]
      });
    })
    .on("end", () => {
      ticketsFromCsv.forEach(ticket => {
        let id = ticket["paymentId"];
        let name = ticket["name"];
        let email = ticket["email"];
        let category = ticket["category"];

        // console.log('Name: ' + name + ', Payment id: ' + id + ', Email: ' + email + ', Category: ' + category);

        // generate a qrcode and send out email
        QRCode.toDataURL(id, function(err, url) {
          var base64Data = url.replace(/^data:image\/png;base64,/, "");

          // uncomment the next line to see the qrcode in the browser
          // note: it would show the qrcode for last item in the list of tickets
          //return res.render("index", {qrcode: url});

          require("fs").writeFile(
            "qrcodes/" + id + ".png",
            base64Data,
            "base64",
            function(err) {
              // structure the message
              const msg = {
                to: email,
                from: "our_mail@mail.com",
                subject:
                  "Your QRCode to attend ICRED International Conference 2020.",
                text:
                  "Hello " +
                  name +
                  ". \nHere is your QRCode to attend ICRED International Conference 2020.",
                attachments: [
                  {
                    filename: id + ".png",
                    type: "image/png",
                    content: base64Data,
                    content_id: "QRCode",
                    disposition: "attachment"
                  }
                ],
                html:
                  "Hello " +
                  name +
                  ".</br></br>Thank you for purchasing a ticket for <b>" +
                  category +
                  "</b> ICRED International 2020.</br></br>Here is your QRCode to attend ICRED International Conference 2020.</br></br></br></br></br>We hope to see you at the event.</br></br>Regards,</br>GDG DevFest Team"
              };

              // send the email (using SendGrid)
              sgMail.send(msg);
            }
          );
        });
      });

      // console.log('CSV file successfully processed');
    });

  return res.json({ status: true, message: "QR Code sent successfully" });
});

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

  try {
    const id = req.body.id;
    const dbAttendee = await Attendee.findById(id);
    if (!dbAttendee)
      return res.status(404).json({ success: false, error: "user not found!" });

    const utils = dbAttendee.utils || [];
    if (utils.indexOf(reqUtil) !== -1)
      return res.status(400).json({
        success: false,
        error: `user already consumed ${reqUtil}!`
      });

    utils.push(reqUtil);
    dbAttendee.update({ utils: utils });
    await dbAttendee.save();
    return res.json({
      success: true,
      msg: `${dbAttendee.fullname} consumed ${reqUtil} successfully.`
    });
  } catch (e) {
    next(e);
  }
});

router.post("/sendQRCodeEmails", async (req, res, next) => {
  try {
    const dbAttendees = await Attendee.find();

    dbAttendees.forEach(a => {
      // console.log(typeof a._id);
      generateQRCode(a._id);
      sendEmail(a.email);
    });
    return res.json({
      success: true,
      msg: `${dbAttendees.length} mails sent`
    });
  } catch (e) {
    next(e);
  }
});

router.post("/generateQRCode", async (req, res, next) => {
  try {
    const dbAttendees = await Attendee.find();

    dbAttendees.forEach(attendee => {
      // console.log(typeof a._id);
      generateQRCode(attendee);
    });
    return res.json({
      success: true,
      msg: `${dbAttendees.length} QR codes generated.`
    });
  } catch (e) {
    next(e);
  }
});

function sendEmail(to, body) {
  // TODO: add logic for sending email
  console.log(`sending email to ${to}`);
}

function generateQRCode(attendee) {
  QRCode.toDataURL(`${attendee._id}`, { version: 2 }, function(err, url) {
    if (err) throw err;
    const base64Data = url.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(
      "qrcodes/" + attendee.category + "-" + attendee.fullname + ".png",
      base64Data,
      "base64",
      function(err) {
        if (err) throw err;
      }
    );
  });
}
module.exports = router;
