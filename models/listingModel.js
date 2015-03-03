var mongoose = require('mongoose');

var listingSchema = new mongoose.Schema({
	name             : String,
	address          : String,
	city             : String,
	description      : String,
	availableSpaces  :[String],
	amenities        :[String],
	photos           :[String],
	latitude         : Number,
	longitude        : Number,
	buildingFlyer    : String
})

var listingModel = module.exports = mongoose.model('listing' , listingSchema);