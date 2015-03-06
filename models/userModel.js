var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	googleId: Number,
	email: String
});

var userModel = module.exports = mongoose.model('user' , userSchema);