
/**
 * Module dependencies.
 */

var express = require('express');
var h5bp = require('h5bp');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var resultModel = require('./models/resultModel');
var listingModel = require('./models/listingModel');
var tenantModel = require('./models/tenantModel');
var mongoose = require('mongoose');
var sendgrid  = require('sendgrid')('spencer.spiegel','westmac');
var email = sendgrid.Email();

if(global.process.env.MONGOLAB_URI){
  mongoose.connect(global.process.env.MONGOLAB_URI);
}else{
  mongoose.connect('mongodb://localhost/creativespaces');
  // mongoose.connect('mongodb://localhost/results')
  // mongoose.connect('mongodb://localhost/tenants')
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

	// var space = new buildingModel({
		
	// 	address          :   '5340 Alla Road',
	// 	city             :   'Playa Vista',

	// 	description      :    "The Annex is more than just a property, it's a true campus for a preeminent brand that's more than the sum of its parts. The Annex is for a culture. It's an ideal property for media, tech, production, product development or creative agencies. It is adjacent to heavies like Deutsch, Sony, Facebook, Belkin, Digital Domain, and Toms Shoes.",
	// 	smallDescription :    "The Annex is more than just a property, it's a true campus for a preeminent brand that's more than the sum of its parts.",

	// 	ratePerSF        :     2.95,
	// 	ratePerMonth     :     26000,

	// 	SFofSpaces       :    [8977 , 12407 , 9466 , 50000] ,
	// 	availableSuites  :    ['Space 205 (8,977 SF)','Space 108 (12,407 SF)','Space 109 (9,466 SF)','Space 210 (50,000 SF)'],

	// 	amenities        :    ['Reception' , 'Conference' , 'Kitchen'],
	// 	imageSrc         :    ['annex/outside.jpg' , 'annex/table.jpg' , 'annex/inside.jpg' , 'annex/patio.jpg'],

	// 	buildingSize     :    '80,850'
	// })	

	// space.save();
	res.render('index')
});

app.get('/results/:page' , function(req,res){
	console.log(req.query)
	var city = req.query.city;
	var minPrice = req.query.minPrice || 0;
	var maxPrice = req.query.maxPrice || 999999999;

	var minSF = req.query.minSF || 0;
	var maxSF = req.query.maxSF || 999999999;

	resultModel.find({
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
		resultModel.find({
			city          :  req.query.city,
			ratePerMonth  : {$gte : minPrice , $lte : maxPrice},
			SFofSpaces    : {$gte : minSF    , $lte : maxSF}
		})
		.skip(req.params.page * 6)
		.limit(6)
		.exec(function(err,docs){
			console.log(docs)
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
				results:docs, 
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

app.post('/email' , function(req,res){
	console.log(req.body)
	res.send('success')

	var html_body = '<p>Thank you for contacting us regarding ' + req.body.address + '. A representative will contact you shortly.<p> <br> <img src="https://s3-us-west-1.amazonaws.com/creativespacesla/public/images/emailLogo.png">'

	var payload = {
	  to      : req.body.email,
	  from    : 'listings@creativespacesla.com',
	  subject : req.body.address,
	  html    : html_body,
	  bcc     : 'spiegel@westmac.com'
	}

	sendgrid.send(payload , function(err,json){
		console.log(json)
	})

})

app.post('/createresult' , function(req,res){
	console.log(req.body)
	var StringofSpaces = req.body.SFofSpaces.split(',')
	var SFofSpaces = [];
	for(var i = 0 ; i < StringofSpaces.length ; i++){
		SFofSpaces.push(parseFloat(i))
	}
	var result = new resultModel({
		name          : req.body.name,
		address       : req.body.address,
		city          : req.body.city,
		footnote      : req.body.footnote,
		pricePerMonth : parseFloat(req.body.pricePerMonth),
		pricePerSF    : parseFloat(req.body.pricePerSF),
		buildingSize  : req.body.buildingSize,
		thumbnail     : req.body.thumbnail,
		SFofSpaces    : SFofSpaces
	})
	result.save()
	res.send('success')
})

app.post('/createlisting' , function(req,res){
	console.log(req.body)
	var listing = new listingModel({
		name            : req.body.name,
		address         : req.body.address,
		city            : req.body.city,
		description     : req.body.description,
		availableSpaces : req.body.availableSpaces.split(','),
		amenities       : req.body.amenities.split(','),
		photos          : req.body.photos.split(','),
		coordinates     : req.body.coordinates.split(','),
		buildingFlyer   : req.body.buildingFlyer
	})
	listing.save()
	res.send('success')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
