var mongoose = require("mongoose");
var Animal = require("./animal");

var zooSchema = new mongoose.Schema({
  name: String,
  location: String,
  animals:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal"
  }]
});

zooSchema.pre("remove",function(callback){
  Animal.remove({author: this._id}).exec();
  callback();
});


var Zoo = mongoose.model("Zoo", zooschema);
module.exports = Zoo;