var mongoose = require ("mongoose");
mongoose.connect("mongod://localhost/zoo_app");

module.exports.Animal = require("./animal");
module.exports.Zoo = require("./zoo");