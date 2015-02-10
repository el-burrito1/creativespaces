var mongoose = require('mongoose');

var tenantSchema = new mongoose.Schema({
	email           : String,
	name            : String,
	address         : String
});

var tenantModel = module.exports = mongoose.model('tenant' , tenantSchema);