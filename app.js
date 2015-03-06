
/**
 * Module dependencies.
 */

var express = require('express');
var h5bp = require('h5bp');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var resultModel = require('./models/resultModel');
var listingModel = require('./models/listingModel');
var tenantModel = require('./models/tenantModel');
var userModel = require('./models/userModel')
var sendgrid  = require('sendgrid')('spencer.spiegel','westmac');
var email = sendgrid.Email();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

if(global.process.env.MONGOLAB_URI){
  mongoose.connect(global.process.env.MONGOLAB_URI);
}else{
  mongoose.connect('mongodb://localhost/creativespaces');
}

passport.use(new GoogleStrategy({
    clientID: '776859070043-7kus72kc059lq7gcupi24hei172sph2f.apps.googleusercontent.com',
    clientSecret: 'SNU0THTxOZeLQFcwQ3v9JohB',
    callbackURL: "http://creativespacesla.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
    	// var user = new userModel({
    	// 	googleId: profile.id
    	// })
    	// user.save();
        return done(null, profile);
    });
  }
));

var app = express();
app.use(h5bp({ root: __dirname + '/public' }));
app.use(express.compress());
app.use(express.static(__dirname + '/public'));

// all environments
app.use(passport.initialize());
app.use(passport.session());
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

app.get('/admin', ensureAuthenticated, function(req,res){
	res.render('admin')
})

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log(req.user.id)
  	// userModel.find({},function(err,docs){
  	// 	if(req.user.id == docs[0].googleId){
  	// 		res.render('admin')
  	// 	} else {
  	// 		res.redirect('login')
  	// 	}
  	// })

  	if(req.user.id == '114314334918398337595'){
  		console.log('yo')
  		res.render('admin')
  	} else {
  		console.log('no')
  		res.redirect('login')
  	}
  	
  });


app.get('/', function(req,res){
	res.render('index' , {title:'Discover Creative Office Space in Los Angeles' , meta:'Creative Office Spaces are work environments principled in design. Discover all available creative office space in Los Angeles with CreativeSpacesLA.'})
});

app.get('/results/:page' , function(req,res){
	console.log(req.query)
	var city = req.query.city;
	var minPrice = req.query.minPrice || 0;
	var maxPrice = req.query.maxPrice || 999999999;
	var minSF = req.query.minSF || 0;
	var maxSF = req.query.maxSF || 999999999;
	console.log(req.query.price)

	resultModel.find({
		city          : req.query.city,
		pricePerMonth  : {$gte : minPrice , $lte : maxPrice},
		SFofSpaces    : {$gte : minSF    , $lte : maxSF}
	})
	.count(function(err,doc){
		console.log(doc)
		var paginate = Math.ceil(doc/6);
		var pages = [];
		for(var i = 1 ; i < paginate + 1; i++){
			pages.push(i)
		}
		resultModel.find({
			city          :  req.query.city,
			pricePerMonth  : {$gte : minPrice , $lte : maxPrice},
			SFofSpaces    : {$gte : minSF    , $lte : maxSF}
		})
		.skip(req.params.page * 6)
		.limit(6)
		.exec(function(err,docs){
			console.log(docs)
			console.log(req.query.price)
			var previous = Math.max(0,req.params.page - 1);
			var next = Math.min(pages.length-1,parseInt(req.params.page)+1);
			var count = [];
			for(var i = 1 ; i < docs.length ; i++){
				count.push(i)
			}
			var currentPage = parseInt(req.params.page) + 1;

			res.render('results' , {
				meta: 'Creative Office Spaces are work environments principled in design. Discover all available creative office space in ' + req.query.city + ' with CreativeSpacesLA.',
				title: 'Creative Office Space in ' + req.query.city,
				totalCount:doc,
				currentPage: currentPage,
				previous: previous,
				next: next,
				results:docs, 
				paginate:pages, 
				price:req.query.price || 'pricePerSF',
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
	listingModel.find({address: req.params.id}, function(err,docs){
		console.log(docs)
		res.render('listingTemplate' , {listing : docs[0] , title: 'Creative Office at ' + docs[0].address , meta: 'See details, view photos, and learn more about the creative office space at ' + docs[0].address , photosLength : docs[0].photos.length})
	})
});

app.post('/email' , function(req,res){
	console.log(req.body)
	res.send('success')

	var tenant = new tenantModel({
		email: req.body.email,
		name: req.body.name,
		address: req.body.address
	})

	tenant.save();

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
	var StringofCoordinates = req.body.coordinates.split(',');
	var coordinates = [];
	for(var i = 0 ; i < StringofCoordinates.length ; i++){
		coordinates.push(parseFloat(i))
	}
	var latitude = coordinates[0];
	var longitude = coordinates[1];

	var listing = new listingModel({
		name            : req.body.name,
		address         : req.body.address,
		city            : req.body.city,
		description     : req.body.description,
		availableSpaces : req.body.availableSpaces.split('.'),
		amenities       : req.body.amenities.split(','),
		photos          : req.body.photos.split(','),
		latitude        : latitude,
		longitude       : longitude,
		buildingFlyer   : req.body.buildingFlyer
	})
	listing.save()
	res.send('success')
})

app.post('/subscribe' , function(req,res){
	console.log(req.body)
	var user = new userModel({
		email : req.body.email
	})

	user.save();
	res.send('success')
})

app.get('/about' , function(req,res){
	res.render('about' , {title: 'CreativeSpacesLA - We know every brick of Creative Office in Los Angeles' , meta:'Creative Office Spaces are work environments principled in design. Discover all available creative office space in Los Angeles with CreativeSpacesLA.'})
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
