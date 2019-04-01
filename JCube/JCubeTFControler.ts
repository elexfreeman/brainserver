var cluster = require('cluster');

import CubeTFClass from './CubeTF';
import { CubeBrainClass } from './CubeBrain';


class CubeCommanderClass {
    direction = 1;
    goal = {
        lastFrame: null,
        goalDistance: -1,
        goalDirection: -1
    }
    imSeeGoal = false;

    imOnLearn = false;

    CubeBrain: CubeBrainClass;
    CubeTF: CubeTFClass;

    constructor() {
        this.CubeBrain = new CubeBrainClass();
        this.CubeBrain.initBuffer();
        this.CubeTF = new CubeTFClass(10, this.CubeBrain.buffer, this.CubeBrain.frameCounter, this.CubeBrain.sensorCounter);
        console.log('FORK >>> createModel');
       
    }

    async init() {
        console.log('FORK >>> createModel');
        /* загружаем тукущею модель */
        this.CubeTF.createModel();
        if (!this.imOnLearn) {
            /* говорим что думаем */
            process.send({ command: 'imOnLearn', imOnLearn: true });
            console.log('FORK >>> learn');
            this.imOnLearn = true;
            await this.CubeTF.learn();
            this.imOnLearn = false;
            /* закончили думать */
            process.send({ command: 'imOnLearn', imOnLearn: false });
        }
    }

    async getDirection() {
        /* покачто рандом */
        this.direction = Math.floor(Math.random() * (5 - 1) + 1);
        console.log('FORK >>>  ' + process.pid + ' get_direction: ', this.direction);
        process.send({ command: 'get_direction', direction: this.direction });
    }

    async droneFrame(msg) {
        console.log('FORK >>>  ' + process.pid + ' droneFrame');
        try {
            let input = JSON.parse(msg.frame).a;

            /* дистанция до цели в кадре минимальная */
            let frameGoalDistance = 10000;
            let frameGoalDirection = -1;
            this.imSeeGoal = false;
            for (let i = 0; i < input.length; i++) {
                /* ищем цель */
                if (input[i].objectType == 'Goal') {
                    /* берем минимальную дистанцию */
                    if (parseInt(input[i].objectDistance) < frameGoalDistance) {
                        frameGoalDistance = parseInt(input[i].objectDistance);
                        frameGoalDirection = i;
                        this.imSeeGoal = true;
                    }
                }

                /* обновляем последнее положение цели */
                if (frameGoalDistance < 10000) {
                    this.goal.goalDirection = frameGoalDistance;
                    this.goal.lastFrame = input;
                    this.goal.goalDirection = frameGoalDirection
                }
            }
        } catch (ee) {
            //empty frame
        }
    }
}

/* запускается как форк основного процесса */
export async function JCubeTFFork() {
  

    const CubeCommander = new CubeCommanderClass();

   
    // // Send message to master process.
    // process.send({ msgFromWorker: 'This is from worker ' + process.pid + '.' })

    // Receive messages from the master process.
    process.on('message', async function (msg) {
        //console.log("FORK >>>  msg from MASTER");       
        try {
            /* отправлен state */
            if (msg.command == 'send_state') {

            } 
            else if (msg.command == 'init') {
                CubeCommander.init();
            }
            /* получить направление движения  */
            else if (msg.command == 'get_direction') {
                await CubeCommander.getDirection();
            } 
            else if (msg.command == 'drone_frame') {
                /* последний сохраненный кадр */
                await CubeCommander.droneFrame(msg);

            }

        } catch (e) {
            console.log("FORK >>>  error");
            console.log(e);
        }

    });
}