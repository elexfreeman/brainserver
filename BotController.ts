var cluster = require('cluster');
import { bots } from './Bots';

class JBotCommander {
    socket: any;
    constructor(socket) {
        this.socket = socket;
    }

    getDirection() {
        let that = this;
        return new Promise((resolve, reject) => {
            try {
                /* отправляем запрос на просчет */
                bots[that.socket.id].send({ command: 'get_direction' });
                /* ждем просчета */
                bots[that.socket.id].on('message', (msg) => {
                    try {
                        /* если это json то обрабатываем */
                        if (msg.command == 'get_direction') {
                            /* получаем от форка направение */
                            console.log('MASTER >>> : Sending direction: ', msg.direction);
                            that.socket.emit('set_direction', msg.direction);
                            resolve(true);
                        }
                    } catch (e) {

                    }

                });
            } catch (e) {
                resolve(false);
            }
        })
    }
}

export default class BotController {



    async controller(socket) {

        /* признак занятости обучением */
        /* нельзя посылать команды тк процесс не отвечает на них */
        let imOnLearn = false;

        let direction;


        let that = this;        
        console.log('connect: ' + socket.id);
        bots[socket.id] = cluster.fork();

        /* -------------------------------------------- */
        /* отправка в форк */
        if (bots[socket.id]) {
            console.log('MASTER >>> getDirection');
            /* отправляем запрос на просчет */
            imOnLearn = true;
            direction = Math.floor(Math.random() * (5 - 1) + 1);
            socket.emit('set_direction', direction);
            /* начинаем двигаться */
            socket.emit('set_move', true);

            /* инициализируем мозк */
            bots[socket.id].send({ command: 'init' });
        }

        /* сообщения из форка */
        bots[socket.id].on('message', (msg) => {
            try {
                /* если это json то обрабатываем */
                if (msg.command == 'get_direction') {
                    /* получаем от форка направение */
                    console.log('MASTER >>> : Sending direction: ', msg.direction);
                    socket.emit('set_direction', msg.direction);
                    console.log('MASTER >>> set_move');
                    /* начинаем двигаться */
                    socket.emit('set_move', true);
                } else if (msg.command == 'imOnLearn') {
                    imOnLearn = msg.imOnLearn;
                }
            } catch (e) {

            }

        });

        /* дивижение закончилось */
        /* msg = {

        } */
        socket.on('on_cube_stop', async (msg) => {
            /* отправляем новое расчитаный вектор двежения */
            /* на основе полученных данных */
            //console.log('MASTER >>> on_cube_stop');

            if (imOnLearn) {
                direction = Math.floor(Math.random() * (5 - 1) + 1);
                /* теоретически он не должен двигаться */
                socket.emit('set_direction', direction);
                /* начинаем двигаться */
                socket.emit('set_move', true);
            } else {
                /* отправляем запрос на просчет */
                bots[socket.id].send({ command: 'get_direction' });
            }


        });


        /* получает последний кадр с сенсоров */
        socket.on('drone_frame', (msg) => {
            msg = msg.replace(/'/g, '"');
            //console.log(msg);
            try {
                if (!imOnLearn) {
                    bots[socket.id].send({
                        command: 'drone_frame',
                        frame: msg
                    });
                }
            } catch (e) {
                //console.log('JSON - error');
            }
        });
        socket.on('disconnect', (msg) => {
            console.log('MASTER >>> client ' + socket.id + ' disconnected');
            /* удаляем процес и почищам память */
            bots[socket.id].kill();
            delete bots[socket.id];
        });
    }

}