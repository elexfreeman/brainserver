var cluster = require('cluster');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

import {JCubeTFFork} from './JCube/JCubeTFControler';

import BotController from './BotController';

/* если это воркер */
if (cluster.isWorker) {

    JCubeTFFork();
}

/* основноый процесс */
if (cluster.isMaster) {
    app.get('/', function (req, res) {
        res.json({});
    });

    const port = 8080;
    const BCtrl = new BotController();

    io.on('connection', BCtrl.controller);

    http.listen(port, function () {
        console.log('listening on *:' + port);
    });
}
