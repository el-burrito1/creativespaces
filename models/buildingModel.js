var mongoose = require('mongoose')

var buildingSchema = new mongoose.Schema({
	address          : String,
	longitude        : String,
	latitude         : String,
	city             : String,
	squareFoot       : Number,
	ratePerSF        : Number,
	ratePerMonth     : Number,
	description      : String,
	smallDescription : String,
	imageSrc         : [String],
	spacesAvailable  : [String],
	amenities        : [String]
})

var buildingModel = module.exports = mongoose.model('building' , buildingSchema)