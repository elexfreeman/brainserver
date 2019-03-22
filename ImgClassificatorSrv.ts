
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

import { ImgClassificator } from './ImgClassificator';

app.get('/', function (req, res) {
    res.json({});
});

io.on('connection', ImgClassificator);

http.listen(3000, function () {
    console.log('listening on *:3000');
});


