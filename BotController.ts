var cluster = require('cluster');

import { CubeBrainClass } from './JCube/CubeBrain';
import { bots } from './Bots';

export default class BotController {

    io: any;
    constructor(io: any) {
        this.io = io;
    }


    controller(socket) {
        console.log('connect: ' + socket.id);
        bots[socket.id] = cluster.fork();

        /* -------------------------------------------- */
        /* прием от форка */
        if (bots[socket.id]) {
            bots[socket.id].on('message', function (msg) {
                console.log(msg);
                msg = JSON.parse(msg);
                /* если это json то обрабатываем */
                if (msg) {
                    /* получаем от форка направение */
                    if(msg.command == 'get_direction') {                        
                        socket.emit('set_direction', msg.direction);
                    }
                }
                console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
            });
        }
        /* -------------------------------------------- */


        /* -------------------------------------------- */
        /* отправка в форк */
        if (bots[socket.id]) {
            socket.emit('set_move', true);
            socket.emit('set_direction', bots[socket.id].getDirection());
        }

        /* дивижение закончилось */
        /* msg = {

        } */
        socket.on('on_cube_stop', (msg) => {
            /* отправляем новое расчитаный вектор двежения */
            /* на основе полученных данных */
            if (bots[socket.id]) {
                socket.emit('set_direction', bots[socket.id].getDirection());
                socket.emit('set_move', true);
            }
            bots[socket.id].onStateMessage(msg);
        });


        socket.on('drone_frame', (msg) => {
            msg = msg.replace(/'/g, '"');
            //console.log(msg);
            try {
                // console.log(JSON.parse(msg));
            } catch (e) {
                //console.log('JSON - error');
            }
        });
        socket.on('disconnect', (msg) => {
            bots[socket.id].onDisconnect(msg);
            /* удаляем процес и почищам память */
            bots[socket.id].send({cmd: 'destroy'});            
            delete bots[socket.id];
        });
    }

}