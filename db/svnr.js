var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Svnr', new Schema({
	// userid : String,
  createdBy : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
  titre : String,
  lieu : Object,
	// latLng : Object,	// ??
  file_addresses : Array,
  // svnr_date_in : {
  //   day: Number,
  //   month: Number,
  //   year: Number},
  // svnr_date_out : {
  //   day: Number,
  //   month: Number,
  //   year: Number},
  creation_date : Date,
  // created_date : {
  //   day: Number,
  //   month: Number,
  //   year: Number},
  svnr_date : Date,
  sharedFriends: [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
  type : String,
  description : String,
  hastags : Array,
  presentFriends: [{type : mongoose.Schema.Types.ObjectId, ref : "User"}]
}));
