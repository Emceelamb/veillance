const express = require('express');
const app = express();
const Datastore = require('nedb');
const db = new Datastore({filename:"data.db", autoload:true});
app.use(express.static('public'));
app.set('view engine', 'ejs');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('express-session');

const nedbstore = require('nedb-session-store')(session);

const uuidv1 = require('uuid/v1');

app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				maxAge: 30 *24*60*60
				},
				store: new nedbstore({
					filename: 'sessions.db'
					}),
				resave: true,
				saveUninitialized: true
		}
		)
);

app.use((req,res,next)=>{
	if(!req.session.uuid){
		req.session.uuid=uuidv1();
		console.log("New user with id " + req.session.uuid);
	} else {
		console.log("Returning user with id" + req.session.uuid);
	}
	let visits = 0;
	if(req.session.visits){
		visits = req.session.visits;
	}
	visits++;
	req.session.visits=visits;
	console.log("Visited " + visits + " times");
	if(req.session.lastvisit){
		console.log("last visit: " + req.session.lastvisit);
	}
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() +1;
	let yyyy=today.getFullYear();
	if(dd<10){
			dd='0'+dd;
	}
	if(mm<10){
		mm='0'+mm;
	}
	req.session.lastvisit = dd+'/'+mm+'/'+yyyy;

	console.log("requested: " + req.originalUrl);
	next();
});

app.get('/', (req,res)=>{
	res.render('main.ejs', req);
});


app.get('/image', (req,res)=>{
	let today = new Date();
	let dd = today.getDate();
	let mm = today.getMonth() +1;
	let yyyy=today.getFullYear();
	if(dd<10){
			dd='0'+dd;
	}
	if(mm<10){
		mm='0'+mm;
	}
	req.session.lastvisit = dd+'/'+mm+'/'+yyyy;
	console.log(req.query);
	if(req.query.source){
		let history =[];
		if(req.session.history){
			history = req.session.history;
		}
		history.push({
			source: req.query.source,
			date: dd+'/'+mm+'/'+yyyy 
			});
		req.session.history = history;
	}
	// console.log(history);
	res.sendFile(__dirname+"/public/image.gif");
});

app.listen(80);
console.log("server is running on port 80");
