var mongoose = require('mongoose');

// var buildingSchema = new mongoose.Schema({
// 	address          : String,
// 	city             : String,

// 	latitude         : String,
// 	longitude        : String,

// 	ratePerSF        : Number,
// 	ratePerMonth     : Number,

// 	description      : String,
// 	smallDescription : String,

// 	SFofSpaces       : [Number],
// 	availableSuites  : [String],

// 	amenities        : [String],
// 	imageSrc         : [String],

// 	buildingFlyer    :  String,
// 	buildingSize     :  String
// });

var listingSchema = new mongoose.Schema({
	name             : String,
	address          : String,
	city             : String,
	description      : String,
	availableSpaces  :[String],
	amenities        :[String],
	photos           :[String],
	coordinates      :[Number],
	buildingFlyer    : String
})

var listingModel = module.exports = mongoose.model('listing' , listingSchema);