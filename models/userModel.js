var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	googleId: Number
});

var userModel = module.exports = mongoose.model('user' , userSchema);