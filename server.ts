
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

import BotController from './BotController';

app.get('/', function (req, res) {
    res.json({});
});

const port = 8080;

const BCtrl = new BotController(io);



io.on('connection', BCtrl.controller);



http.listen(port, function () {
    console.log('listening on *:' + port);
});