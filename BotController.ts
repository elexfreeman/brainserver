import { CubeBrainClass } from './JCube/CubeBrain';

import { log } from './log';

import { bots } from './Bots';

export default class BotController {

    io: any;
    constructor(io: any) {
        this.io = io;
    }


    controller(socket) {
        console.log('connect: ' + socket.id);
        bots[socket.id] = new CubeBrainClass();

        bots[socket.id].initBuffer();
        console.log('buffer: ',bots[socket.id].getBuffer());


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


        socket.on('img', (msg) => {
            //bot.echo(msg);
            socket.broadcast.emit('resend img', msg);
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
            delete bots[socket.id];
        });
    }

}