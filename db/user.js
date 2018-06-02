var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
	username : String,
  prenom : String,
  nom : String,
  email : String,
  password : String,
  photo_address : String,
  friends_id : Array,
  friends : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
  birthday : Date,                          //MAYBE PROBLEM !!!!!
  current_city : String,
  living_city : String,
  pers_color : String
  // svnrs : [{type : mongoose.Schema.Types.ObjectId, ref : "Svnr"}]
}));
