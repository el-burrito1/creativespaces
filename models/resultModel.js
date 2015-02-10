var mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
	name            : String,
	address         : String,
	city            : String,
	footnote        : String,
	pricePerMonth   : Number,
	pricePerSF      : Number,
	buildingSize    : String,
	thumbnail        : String,
	SFofSpaces      : [Number]
});

var resultModel = module.exports = mongoose.model('result' , resultSchema);