var envFile = __dirname + "/env.json";
var jsonfile = require("jsonfile");

var envVars = jsonfile.readFileSync(envFile);

module.exports = {
  MONGODB_CONNECTION: envVars["MONGODB_CONNECTION"]
};
