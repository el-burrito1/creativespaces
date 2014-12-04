
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var buildingModel = require('./models/buildingModel');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

// transporter.sendMail({
// 	from: 'spencer.spiegel@gmail.com',
// 	to: 'spiegel@westmac.com',
// 	subject: 'success!',
// 	text: 'hello!'
// });

mongoose.connect('mongodb://localhost/buildings')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req,res){
	var space = new buildingModel({
		address:'301 North Canon Drive',
		imageSrc: ['/images/officeExterior.jpg' , '/images/officeInterior.jpg' , '/images/officeCourtyard.jpg' , '/images/waitingRoom.jpg'],
		city: 'Santa Monica',
		description: 'Artists compound blocks from Venice Beach',
		ratePerMonth: 3500,
		availableSuites: ['Suite 300 (1,400 SF)','Suite 400 (1,200 SF)','Suite 500 (2,500 SF)'],
		amenities: ['Kitchen' , 'Reception' , 'Parking' ]
	})
	space.save();
	res.render('index')
});

app.get('/results/:id' , function(req,res){
	console.log(req.params.id)
	buildingModel.find({}, function(err,docs){
		console.log(docs)
		res.render('spaceTemplate' , {suites : docs[0]})
	})
});

app.get('/results' , function(req,res){
	console.log(req.query)
	buildingModel.find({city:req.query.city}, function(err,docs){
		console.log(docs)
		res.render('results' , {buildings:docs})
	})
})

app.get('/admin' , function(req,res){
	res.render('admin')
})

app.post('/create' , function(req,res){
	console.log(req)
	var space = new buildingModel({
		address           : req.body.address,
		city              : req.body.city,
		
		latitude          : req.body.latitude,
		longitude         : req.body.longitude,
		
		description       : req.body.description,
		smallDescription  : req.body.smallDescription,
		
		ratePerSF         : req.body.ratePerSF,
		ratePerMonth      : req.body.ratePerMonth,
		
		SFofSpaces        : req.body.SFofSpaces,
		availableSuites   : req.body.availableSuites,

		amenities         : req.body.amenities,
		imageSrc          : req.body.imageSrc
	})

	space.save()
	res.redirect('/admin')
})


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
