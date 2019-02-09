const express = require('express');
const app = express();

app.get('/', function(request, response){
	response.send('Hello ;)');
});

app.listen(30000, function (){
	console.log('listening on port 3000');
});

app.get('/goodbye', function(request,response){
	response.send('Goodbye :(');
});

app.use(express.static('public'));

app.get('/randomfile', function(request,response){
	let fileToSend = "randomfile.txt";
	response.sendfile(fileToSend, {root: './public'});
});
