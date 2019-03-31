var cluster = require('cluster');

import CubeTFClass from './CubeTF';
import { CubeBrainClass } from './CubeBrain';
/* Кнтролер для прощета нейросети */
/* запускается как форк основного процесса */
export async function JCubeTFFork() {
    let direction = 1;
    let lastFrame;

    let imOnLearn = false;
    console.log('FORK >>> ' + process.pid + ' has started.');
    const CubeBrain = new CubeBrainClass();
    console.log('FORK >>> createModel');
    CubeBrain.initBuffer();

    const CubeTF = new CubeTFClass(10, CubeBrain.buffer, CubeBrain.frameCounter, CubeBrain.sensorCounter);
    
    // // Send message to master process.
    // process.send({ msgFromWorker: 'This is from worker ' + process.pid + '.' })

    // Receive messages from the master process.
    process.on('message', async function (msg) {
        //console.log("FORK >>>  msg from MASTER");       
        try {
            /* отправлен state */
            if (msg.command == 'send_state') {

            } else
                if (msg.command == 'init') {
                    console.log('FORK >>> createModel');
                    /* загружаем тукущею модель */
                    CubeTF.createModel();
                    if (!imOnLearn) {
                        /* говорим что думаем */
                        process.send({command: 'imOnLearn',imOnLearn: true});
                        console.log('FORK >>> learn');
                        imOnLearn = true;
                        await CubeTF.learn();
                        imOnLearn = false;
                        /* закончили думать */
                        process.send({command: 'imOnLearn',imOnLearn: false});
                    }
                }
                /* получить направление движения  */
                else if (msg.command == 'get_direction') {
                    /* покачто рандом */
                    direction = Math.floor(Math.random() * (5 - 1) + 1);
                    console.log('FORK >>>  ' + process.pid + ' get_direction: ', direction);
                    process.send({ command: 'get_direction', direction: direction });
                } else

                /* последний сохраненный кадр */
                if (msg.command == 'drone_frame') {
                        try {
                            lastFrame = JSON.parse(msg.frame).a;
                        } catch (ee) {
                            //empty frame
                        }
                    }

        } catch (e) {
            console.log("FORK >>>  error");
            console.log(e);
        }

    });
}