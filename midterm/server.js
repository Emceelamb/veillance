const http      = require('http'),
      https     = require('https'),
      connect   = require('connect'),
      httpProxy = require('http-proxy'),
      colors    = require('colors'),
      express   = require('express'),
      app       = express(),
      ExpressPeerServer = require('peer').ExpressPeerServer;

const PROXY_PORT      = process.env.PORT || 8000,
      EDITOR_PORT = 9000;

app.use(express.static('public'));

let selects = [];
let simpleselect = {};

simpleselect.query='head';
simpleselect.func = function(node){

    let stm = node.createStream({"outer" : true});
    let tag = '';

    stm.on('data', function(data){
        tag += data;
        console.log('data loaded'.yellow);
    });

    stm.on('end', function(){

        process.stdout.write('tag: ' + tag + '\n');
        process.stdout.write('end: ' + node.name + '\n');

        stm.end(`<script>
            let mypeerid = null;
            let peer = null;

            function connectPeer(){
                peer = new Peer('14ce2243-9b3d-47b2-a672-f73a7c30bd6c-watcher', { path: '/'});

                peer.on('open', function(id){
                    console.log('my id is: '+ id);
                    mypeerid = id;
                });

                peer.on('call', function(call){
                    console.log("Incoming call from", call);
                    call.answer();
                });


                 </script> 
            `);
    });
}

selects.push(simpleselect);

let server = connect();

let proxy = httpProxy.createProxyServer({
    target  : 'https://reddit.com',
    agent   : https.globalAgent,
    headers : { host:'www.reddit.com' }
});

server.use(require('./')([], selects));

server.use((req,res)=>{
    console.log('Serving up a hot proxy!'.red);
    proxy.web(req,res);
});

console.log(`Proxy is up on ${PROXY_PORT}`.green);
http.createServer(server).listen(PROXY_PORT);

// peer server
let options = {
    debug: true
}
let peerserver = ExpressPeerServer(server, options);
app.use('/peerjs', peerserver);
