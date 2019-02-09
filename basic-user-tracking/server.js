const allowedUsers = require('./users.json');

// const Datastore = require('nedb');
// const db = new Datastore({filename: "data.db", autoload: true});

// const express = require('express')
// const app = express();

// app.use(express.static('public'));

// let cookieParser = require('cookie-parser');
// app.use(cookieParser());

// let session = require('express-session');
// let nedbstore = require('nedb-session-store')(session);

// const uuidV1 = require('uuid/v1');

// app.use(
// 	session(
// 		{
// 			secret: 'secret',
// 			cookie: { maxAge: 365*24*60*60*1000},
// 			store: new nedbstore({
// 				filename: 'sessions.db'
// 			}),
// 			resave: true,
// 			saveUninitialized: true
// 		}
// 	)
// );

// let bodyParser = require('body-parser');
// let urlencodedParser = bodyParser.urlencoded({extended:true});

// app.use(urlencodedParser);

// app.get('/', function(req,res){
// 	if(!req.session.username){
// 		res.reender('login.ejs', {});
// 	} else {
// 		let visits = 0;
// 		if(req.session.visits){
// 			visits=req.session.visits;
// 		}
// 		visits++;
// 		req.session.visits = visits;
// 		console.log(req.session.username + " is on the site. They visited " + visits +" times");
// 		res.rendere('main.ejs', req);
// 	}
// });

// app.get('/logout', function(req,res){
// 	console.log(req.session.username+" just logged out! :(");
// 	delete req.session.username;
// 	res.redirect('/');
// });

// app.post('login', function(req, res){
// 	let found = false;
// 	for(let i = 0; i<allowedUsers.length;i++){
// 		if(allowedUsers[i].username == req.body.username &&
// 		   allowedUsers[i].password == req.body.password){
// 			let userRecord = allowedUsers[i];
// 			req.session.username = userRecord.username;
// 			req.session.lastlogin = Date.now();
// 			req.session.astro = req.body.astro;
// 			let visits = 0;
// 			if (req.session.visits){
// 				visits = req.session.visits;
// 			}
// 			visits++;
// 			req.session.visits=visits;
// 			console.log(req.session.username+" logged in! this is their " + visits + " :)")
// 			res.render('main.ejs', req);
// 			found = true;
// 			break
// 		}
// 	}
	
// 	if (!found){	
// 		req.session.username = req.body.username;
// 		req.session.password = req.body.password;
// 		req.session.lastlogin = Date.now();
// 		req.session.astro = req.body.astro;
// 		res.render('bad.ejs', req);
// 	}
// });

// app.listen(80);
// console.log("server is running on port 80 :)");



// Database to store data, don't forget autoload: true
var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

var express = require('express')
var app = express()

app.use(express.static('public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);

const uuidV1 = require('uuid/v1');
app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
				},
			store: new nedbstore({
			 filename: 'sessions.db'
			}),
			resave: true,
		    saveUninitialized: true
		}
	)
);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser); 

app.get('/', function (req, res) {
	if (!req.session.username) {
		res.render('login.ejs', {}); 
	} else {
		// Give them the main page

		var visits = 0;
		if (req.session.visits) {
			visits = req.session.visits;
		}
		visits++;
		req.session.visits = visits;

		console.log(req.session.username + " is on the site");
		console.log("This person visited " + visits + " times");

		res.render('main.ejs', req);
	}
});

app.get('/logout', function(req, res) {

	console.log(req.session.username + " just logged out");


	delete req.session.username;
	res.redirect('/');
});

// Post from login page
app.post('/login', function(req, res) {

	// Check username and password in database
	var found = false;
	
	for (var i = 0; i < allowedUsers.length; i++) {
		if (allowedUsers[i].username == req.body.username &&
		    allowedUsers[i].password == req.body.password) {

			// Found user
			var userRecord = allowedUsers[i];

			// Set the session variable
			req.session.username = userRecord.username;

			// Put some other data in there
			req.session.lastlogin = Date.now();

			req.session.astro = req.body.astro;

			var visits = 0;
			if (req.session.visits) {
				visits = req.session.visits;
			}
			visits++;
			req.session.visits = visits;

			console.log(req.session.username + " just logged in");
			console.log("This person visited " + visits + " times");

			res.render('main.ejs', req);

			found = true;
			break;	
		}
	}
	
	if (!found) {

		// Set the session variable
		req.session.username = req.body.username;

		// Dangerous
		req.session.password = req.body.password;

		// Put some other data in there
		req.session.lastlogin = Date.now();

		req.session.astro = req.body.astro;	

		res.render('bad.ejs', req);
	}


});
 
app.listen(process.env.PORT||8000);
console.log("Server is running on port 80")
