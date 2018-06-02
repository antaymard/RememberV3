var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Comment', new Schema({
	svnrId : String,
  createdBy : [{type : mongoose.Schema.Types.ObjectId, ref : "User"}],
  content : String,
  creationDate : Date,
  beenRead : Array,
  beenEdited : Array
}));
