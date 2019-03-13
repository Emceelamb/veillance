const http = require('http'),
	https = require('https'),
	connect = require('connect'),
	httpProxy = require('http-proxy'),
	colors = require('colors'),
	express = require('express'),
	app = express(),
	socketServer = require('http').Server(app),
	io = require('socket.io')(socketServer),
	fs = require('fs');


const PROXY_PORT = process.env.PORT || 8000,
	EDITOR_PORT = 9000;

app.use(express.static('public'));
let selects = [];
let simpleselect = {};

simpleselect.query = 'head';
simpleselect.func = function (node) {

	let peerStream = `

    		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
			<script type="text/javascript">
        	console.log('Script injected ;)');
			var socket = io.connect('http://localhost:9000');
			socket.on('connect', function() {
				console.log("Connected");
				socket.emit('watch',{});
			});

			function getElement(data) {
				var element = null;
				if (document.getElementById(data.socket_id)) {
					element = document.getElementById(data.socket_id);
				} else {
					element = document.createElement('DIV');
					element.id = data.socket_id;
					element.style.backgroundColor = "red";
					element.style.width = "10px";
					element.style.height = "10px";
					document.body.appendChild(element);
					element.style.position = "absolute";
				}
				return element;
			}
			// When the window loads
			window.addEventListener('load', function() {
				console.log("Window Loaded");
				socket.on('event', function(data) {
					console.log(data);
					element = getElement(data);
					console.log(element);
					if (data.event == "mousemove") {
						element.style.top = data.y;
						element.style.left = data.x;
					} else if (data.event == "click") {
						element.style.width = "20px";
						element.style.height = "20px";
						setTimeout(function() {
							element.style.width = "10px";
							element.style.height = "10px";
						}, 1000);
					} else if (data.event == "headline"){
						$(document.getElementsByTagName("H2")[8]).replaceWith('<h2>'+data.key+'</h2>')
                        console.log('headline sent: '+data.key);
                    }
				});
			});
	</script>
	
				 `

	let rs = node.createReadStream();
	let ws = node.createWriteStream({ outer: false });
	rs.pipe(ws, { end: false });

	rs.on('end', function () {
		ws.end(peerStream);
	});
	//console.log(peerStream);
}

selects.push(simpleselect);

let server = connect();

let proxy = httpProxy.createProxyServer({
	// target: 'https://nytimes.com',
	// agent: https.globalAgent,
	// headers: { host: 'www.nytimes.com' }

	target: 'https://foxnews.com',
	agent: https.globalAgent,
	headers: { host: 'www.foxnews.com' }
});

server.use(require('./')([], selects, true));

server.use((req, res) => {
	console.log('Serving up a hot proxy! 😘'.red);
	proxy.web(req, res);
});

console.log(`Proxy is up on ${PROXY_PORT}`.green);
http.createServer(server).listen(PROXY_PORT);

console.log(`Editor is up on ${EDITOR_PORT}`.yellow);
socketServer.listen(EDITOR_PORT);
// socket server
/*
function handler(req,res){
    let parsedURL = url.parse(req.url);
    console.log("The request is: " + parsedURL.pathname);
    
    fs.readFile(__dirname + parsedURL.pathname,
        
    function (err, data){
        if(err){
            res.writeHead(500);
            return res.end('error loading ...');
        }
        res.writeHead(200);
        res.end(data);
    });
    res.writeHead(200);
    res.end("Life is ok");
}

io.on('connection', function(socket){
    socket.emit('news', {hello: 'world!'});
        socket.on('my other event', function(data){
            console.log(data);
        });
});
*/
let watcher = null;
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {

		console.log("We have a new client: " + socket.id);

		socket.on('watch', function (data) {
			// It's the watcher
			watcher = socket;
			console.log("We have an editor!");
		});

		// client side: socket.emit('event', object representing the event);
		socket.on('event',
			// Run this function when a message is sent
			function (data) {
				console.log(data);

				// If there is a watcher, send to them
				if (watcher != null) {
					console.log("send to watcher");
					data.socket_id = socket.id;
					watcher.emit('event', data);
				}
			}
		);

		socket.on('disconnect', function () {
			console.log("Client has disconnected");
		});
	}
);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});
