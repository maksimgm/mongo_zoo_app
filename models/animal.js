var mongoose = require("mongoose");

var animalSchema = new mongoose.Schema({
  name: String,
  species: String,
  age: Number,
  photo: String,
  zoos:{
    type: mongoose.Schema.Type.ObjectId,
    ref: "Zoo"
  }
});

var Animal = mongoose.model("Animal", animalschema);
module.exports = Animal;