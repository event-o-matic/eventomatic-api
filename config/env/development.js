var envFile = __dirname + "/env.json";
var jsonfile = require("jsonfile");

var envVars = jsonfile.readFileSync(envFile);

module.exports = {
  NODE_ENV: envVars["NODE_ENV"],
  MONGODB_CONNECTION: envVars["MONGODB_CONNECTION"],
  SENDGRID_API_KEY: envVars["SENDGRID_API_KEY"]
};
