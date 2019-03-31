var cluster = require('cluster');

import CubeTFClass from './CubeTF';
import { CubeBrainClass } from './CubeBrain';
/* Кнтролер для прощета нейросети */
/* запускается как форк основного процесса */
export async function JCubeTFFork() {

    const CubeBrain = new CubeBrainClass();
    CubeBrain.initBuffer();

    const CubeTF = new CubeTFClass(10, CubeBrain.buffer, CubeBrain.frameCounter, CubeBrain.sensorCounter);

    /* загружаем тукущею модель */
    CubeTF.createModel();
    await CubeTF.learn();

    console.log('Worker ' + process.pid + ' has started.');

    // Send message to master process.
    process.send({ msgFromWorker: 'This is from worker ' + process.pid + '.' })

    // Receive messages from the master process.
    process.on('message', function (msg) {
        msg = JSON.parse(msg);
        /* если это json то обрабатываем */
        if (msg) {
            /* убить процесс */
            if (msg.command == 'destroy') {
                worker.kill();
            } else

                /* отправлен state */
                if (msg.command == 'send_state') {
                    console.log(msg);
                } else

                    /* получить направление движения  */
                    if (msg.command == 'set_direction') {
                        console.log('Worker ' + process.pid + ' set_direction');
                        process.send({
                            command: 'set_direction',
                            direction: Math.floor(Math.random() * (5 - 1) + 1)
                        })
                    }
        }

        else {
            /* иначе убиваем */
            worker.kill();
        }
        console.log('Worker ' + process.pid + ' received message from master.', msg);
    });


}