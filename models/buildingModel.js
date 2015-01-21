var mongoose = require('mongoose')

var buildingSchema = new mongoose.Schema({
	address          : String,
	city             : String,

	latitude         : String,
	longitude        : String,

	ratePerSF        : Number,
	ratePerMonth     : Number,

	description      : String,
	smallDescription : String,

	SFofSpaces       : [Number],
	availableSuites  : [String],

	amenities        : [String],
	imageSrc         : [String],

	buildingFlyer    :  String,
	buildingSize     :  String
})

var buildingModel = module.exports = mongoose.model('building' , buildingSchema)