//var http = require('http');
var https = require('https');

var fs = require('fs'); // Using the filesystem module

/*modulevar options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};*/

//var httpServer = http.createServer(requestHandler);

var httpServer = https.createServer(requestHandler);
httpServer.listen(8080);


var url = require('url');
// httpServer.listen(8080);
console.log('Server listening on port 8080');

function requestHandler(req, res) {

  var parsedUrl = url.parse(req.url);
  console.log("The Request is: " + parsedUrl.pathname);

  // Read in the file they requested
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function, called when reading is complete
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
}

var numUsers = 0;
var maxNumUsers = 2;

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    //if (numUsers < maxNumUsers) {
    numUsers++;
    console.log("We have a new client: " + socket.id);

    socket.on('coordinates', function(data) {
      io.sockets.emit('coordates', data);
    });

    socket.on('dataurl', function(data) {
      io.sockets.emit('dataurl', data);
    });

    // When this user "send" from clientside javascript, we get a "message"
    // client side: socket.send("the message");  or socket.emit('message', "the message");
    socket.on('message',
      // Run this function when a message is sent
      function(data) {
        console.log("message: " + data);

        // Call "broadcast" to send it to all clients (except sender), this is equal to
        // socket.broadcast.emit('message', data);
        //socket.broadcast.send(data);

        // To all clients, on io.sockets instead
        io.sockets.emit('message', data);
      }
    );

    socket.on('draw',
      // Run this function when a message is sent
      function(data) {
        console.log(data);

        // Call "broadcast" to send it to all clients (except sender), this is equal to
        // socket.broadcast.emit('message', data);
        //socket.broadcast.send(data);

        // To all clients, on io.sockets instead
        io.sockets.emit('draw', data);
      }
    );

    socket.on('blink',
      // Run this function when a message is sent
      function(data) {
        console.log(data);

        // Call "broadcast" to send it to all clients (except sender), this is equal to
        // socket.broadcast.emit('message', data);
        //socket.broadcast.send(data);

        // To all clients, on io.sockets instead
        io.sockets.emit('blink', data);
      }
    );

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('otherevent', function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'otherevent' " + data);
    });


    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      numUsers--;
    });
    // } else {
    //   socket.disconnect();
    //
    // }
  }
);
