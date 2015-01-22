
/**
 * Module dependencies.
 */

var express = require('express');
var h5bp = require('h5bp');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var buildingModel = require('./models/buildingModel');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var sendgrid  = require('sendgrid')('spencer.spiegel','Tsukahara103');

// transporter.sendMail({
// 	from: 'spencer.spiegel@gmail.com',
// 	to: 'spiegel@westmac.com',
// 	subject: 'success!',
// 	text: 'hello!'
// });

// mongoose.connect('mongodb://localhost/buildings')

if(global.process.env.MONGOLAB_URI){
  mongoose.connect(global.process.env.MONGOLAB_URI);
}else{
  mongoose.connect('mongodb://localhost/buildings');
}

var app = express();
app.use(h5bp({ root: __dirname + '/public' }));
app.use(express.compress());
app.use(express.static(__dirname + '/public'));

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
		
		address          :   '301 North Canon Drive',
		city             :   'Santa Monica',

		description      :    'Village on Canon is located in the heart of Beverly Hills on N. Canon just one block east of Beverly Drive. The Village on Canon features distinct Mediterranean architecture and offers a central connecting courtyard in the middle of the building with a cascading fountain, bronze sculptures, and hand-painted decorative tiles.',
		smallDescription :    'Mediterranean style creative space available for sublease.',

		ratePerSF        :     2.19,
		ratePerMonth     :     3500,

		SFofSpaces       :    [1400 , 1200 , 2500] ,
		availableSuites  :    ['Suite 300 (1,400 SF)','Suite 400 (1,200 SF)','Suite 500 (2,500 SF)'],

		amenities        :    ['Kitchen' , 'Reception' , 'Parking' ],
		imageSrc         :    ['images/officeExterior.jpg' , 'images/officeInterior.JPG' , 'images/officeCourtyard.jpg' , 'images/waitingRoom.JPG'],

		buildingSize     :    '12,000'
	})

	space.save();
	res.render('index')
});

app.get('/results/:page' , function(req,res){
	var city = req.query.city;
	var minPrice = req.query.minPrice || 0;
	var maxPrice = req.query.maxPrice || 999999999;

	var minSF = req.query.minSF || 0;
	var maxSF = req.query.maxSF || 999999999;

	buildingModel.find({
		city          :  req.query.city,
		ratePerMonth  : {$gte : minPrice , $lte : maxPrice},
		SFofSpaces    : {$gte : minSF    , $lte : maxSF}
	})
	.count(function(err,doc){
		var paginate = Math.ceil(doc/6);
		var pages = [];
		for(var i = 1 ; i < paginate + 1; i++){
			pages.push(i)
		}
		buildingModel.find({
			city          :  req.query.city,
			ratePerMonth  : {$gte : minPrice , $lte : maxPrice},
			SFofSpaces    : {$gte : minSF    , $lte : maxSF}
		})
		.skip(req.params.page * 6)
		.limit(6)
		.exec(function(err,docs){
			var previous = Math.max(0,req.params.page - 1);
			var next = Math.min(pages.length-1,parseInt(req.params.page)+1);
			var count = [];
			for(var i = 1 ; i < docs.length ; i++){
				count.push(i)
			}
			var currentPage = parseInt(req.params.page) + 1;
			res.render('results' , {
				totalCount:doc,
				currentPage: currentPage,
				previous: previous,
				next: next,
				buildings:docs, 
				paginate:pages, 
				city:req.query.city,
				minSF:req.query.minSF,
				maxSF:req.query.maxSF,
				minPrice:req.query.minPrice,
				maxPrice:req.query.maxPrice
			})
		})
	})
})

app.get('/location/:id' , function(req,res){
	console.log('id = ' + req.params.id)
	buildingModel.find({address: req.params.id}, function(err,docs){
		console.log(docs)
		res.render('spaceTemplate' , {suites : docs[0]})
	})
});

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

app.post('/email' , function(req,res){
	console.log(req.body)
	res.send('success')

	var payload   = {
	  to      : req.body.email,
	  from    : 'spiegel@westmac.com',
	  subject : 'Saying Hi',
	  text    : 'Hey ' + req.body.name + ', This is my first email through SendGrid ya bish'
	}

	sendgrid.send(payload, function(err, json) {
	  if (err) { console.error(err); }
	  console.log(json);
	});
})


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
