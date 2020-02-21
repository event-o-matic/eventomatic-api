const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

router.get("/", async (req, res) => {
  const result = await Attendee.find();
  console.log(result.length);
  res.json(result);
});

router.get("/c/:category", async (req, res) => {
  const result = await Attendee.find({ category: req.params.category });
  res.json({ count: result.length, data: result });
});
router.get("/u/:util", async (req, res) => {
  const result = await Attendee.find({ utils: { $in: req.params.util } });
  res.json({ count: result.length, data: result });
});

// router.get("/:id", (req, res) => {
//   //   get one
// });

// router.post("/import", (req, res, next) => {
//   let attendees = [];
//   try {
//     fs.createReadStream("./data/attendees.csv")
//       .pipe(csv())
//       .on("data", row => {
//         attendees.push({
//           fullname: row.name,
//           email: row.email,
//           category: row.category
//         });
//       })
//       .on("end", async () => {
//         // console.log(attendees);

//         const dbAttendees = await Attendee.find();

//         // Only need emails of all db attendees
//         const dbAttendeeEmails = dbAttendees.map(
//           dbAttendee => dbAttendee.email
//         );
//         // filter out only new entries of email
//         attendees = attendees.filter(
//           attendee => dbAttendeeEmails.indexOf(attendee.email) === -1
//         );
//         // console.log(attendees);
//         // const result = [];
//         const result = await Attendee.insertMany(attendees);
//         return res.json({
//           success: true,
//           msg: `Imported ${result.length} attendees successfully!`,
//           insertedCount: result.length
//         });
//       });
//   } catch (e) {
//     next(e);
//   }
// });

// router.post("/addone", async (req, res, next) => {
//   try {
//     const newAttendee = new Attendee({
//       email: "test4@test.com",
//       fullname: "dummy three"
//     });

//     await newAttendee.save();
//     return res.json({ success: true, msg: "Attendee added successfully!" });
//   } catch (e) {
//     next(e);
//   }
// });

// router.delete("/", async (req, res, next) => {
//   try {
//     await Attendee.deleteMany();
//     return res.json({ success: true, msg: "All Attendee deleted!" });
//   } catch (e) {
//     next(e);
//   }
// });
<<<<<<< Updated upstream

router.get("/c/:category", async (req, res) => {
  const result = await Attendee.find({ category: req.params.category });
  res.json({ count: result.length, data: result });
});
router.get("/u/:util", async (req, res) => {
  const result = await Attendee.find({ utils: { $in: req.params.util } });
  res.json({ count: result.length, data: result });
});
=======
>>>>>>> Stashed changes

router.post("/resetUtils", async (req, res, next) => {
  try {
    const result = await Attendee.updateMany(
      { utils: { $ne: [] } },
      { $set: { utils: [] } }
    );

    return res.json({
      success: true,
      msg: `${result.n} utililies updated.`
    });
  } catch (e) {
    next(e);
  }
});
router.post("/resetUtil/:util", async (req, res, next) => {
  try {
    const dbAttendees = await Attendee.where("utils").ne([]);

    dbAttendees.forEach(async dbAttendee => {
      let utils = dbAttendee.utils;
      utils = utils.filter(util => util !== req.params.util);
      dbAttendee.utils = utils;
      await dbAttendee.save();
    });
    return res.json({
      success: true,
      msg: `${req.params.util} is reset.`
    });
  } catch (e) {
    next(e);
  }
});

router.post("/export", (req, res, next) => {});

module.exports = router;
