let express = require("express");
let app = express();

const mongoose = require("mongoose");
let config = require("./config/config");

let flash = require("connect-flash");

let session = require("express-session");
let cookieParser = require("cookie-parser");

let ticketsApi = require("./routes/tickets");
let attendeesApi = require("./routes/attendees");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(config.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    console.log("Database connection established successfully!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());

// API endpoints
app.get("/", (req, res) => res.send("Welcome to Eventomatic API."));
app.use("/tickets/", ticketsApi);
app.use("/attendees/", attendeesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res
    .status(404)
    .json({ success: false, error: `No route found for ${req.url}` });
});

// error handler
app.use(function(err, req, res, next) {
  // response and log errors
  console.log(err);
  res.status(err.status || 500);
  res.json({ success: false, error: "Somthing is wrong!" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));

// Handle UnhandeledExceptions
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
});
module.exports = app;
