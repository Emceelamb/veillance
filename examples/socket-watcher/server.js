const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 8000;
server.listen(PORT);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.send("Hello, world.");
});

// websocket
let watch = null;

io.sockets.on('connection',
    function(socket){
        console.log("We have a client: " + socket.id);

        socket.on('watch', function(data){
            watcher = socket;
            console.log("Someones watching");
        });

        socket.on('event',
            function(data){
                console.log(data);

                if(watcher != null){
                    console.log("Send to watcher");
                    data.socket_id = socket.id
                    watcher.emit('event', data);
                }
            }
        );

        socket.on('disconnect', function() {
            console.log("Client left");
        });
        
    }
);



console.log(`Server up on port  ${PORT}`);


