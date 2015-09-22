var mongoose = require("mongoose");
var Animal = require("./animal");

var zooSchema = new mongoose.Schema({
  name: String,
  location: String,
  animal:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal"
  }
});


var Zoo = mongoose.model("Zoo", zooSchema);

module.exports = Zoo;