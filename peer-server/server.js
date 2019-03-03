const express = require('express');
const server = express();

const PORT = process.env.PORT || 8000;

server.use('/public', express.static(__dirname + '/public'));
server.use('/scripts', express.static(`${__dirname}/node_modules/`));
server.set('views', './views');
server.set('view engine', 'pug');

server.use('/', (req, res)=>{
    res.render('index');
    console.log('someone joined!');
});

server.listen(PORT, ()=>{
    console.log(`Server is up on ${PORT}.`);
});

