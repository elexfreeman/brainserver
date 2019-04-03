var cluster = require('cluster');

import { CubeTFClass, GoalInterface } from './CubeTF';
import { CubeBrain, JFrame, GOAL, OBJECT, NULL_OBJECT } from './CubeBrain';


class CubeCommanderClass {
    direction = 1;


    Goal: GoalInterface;
    GoalPrev: GoalInterface;

    imSeeGoal = false;

    imOnLearn = false;

    
    CubeTF: CubeTFClass;

    constructor() {

        /* замеченная цель */
        this.Goal = {
            goalDirection: -1,
            goalDistance: -1,
            lastFrame: null
        }
        this.GoalPrev = {
            goalDirection: -1,
            goalDistance: -1,
            lastFrame: null
        }
 
        this.CubeTF = new CubeTFClass(4, CubeBrain.buffer, CubeBrain.frameCounter, CubeBrain.sensorCounter);       

    }

    async init() {
        //console.log('FORK >>> createModel');
        /* загружаем тукущею модель */
        this.CubeTF.createModel();
        if (!this.imOnLearn) {
            this.doLearn();
        }
    }


    prepareFeed() {
        let resp = [];
        for (let i = 0; i < this.Goal.lastFrame.length; i++) {
            resp.push(this.Goal.lastFrame[i].objectType);
            resp.push(this.Goal.lastFrame[i].objectDistance);
        }

        /* ожидаемую дистанцию */
        resp.push(2);
        return resp;
    }

    async doLearn() {
        process.send({ command: 'imOnLearn', imOnLearn: true });
        //console.log('FORK >>> learn');
        this.imOnLearn = true;
        await this.CubeTF.learn();
        //console.log('FORK >>> STOP learn');
        this.imOnLearn = false;
        /* закончили думать */
        process.send({ command: 'imOnLearn', imOnLearn: false });
    }

    async getDirection() {
        /* если вижу цель */
        if (this.imSeeGoal) {
            if (!this.imOnLearn) {
                /* есть текущее положение цели */
                //console.log('Im on Learn', this.imOnLearn);
                /* пробуем новое положение */
                this.direction = await this.CubeTF.feed(this.prepareFeed());

                //console.log('FORK >>>  ' + process.pid + ' get_direction NET: ', this.direction);
                process.send({ command: 'get_direction', direction: this.direction });

                /* если есть кадр о переучиваемся */
                if (this.GoalPrev.lastFrame) {

                    this.CubeTF.bufferPush({
                        state: this.GoalPrev.lastFrame,
                        direction: this.GoalPrev.goalDirection,
                        distance: this.Goal.goalDistance
                    });
                    await this.doLearn();
                    
                    // this.GoalPrev.goalDirection = this.Goal.goalDirection;
                    // this.GoalPrev.goalDistance = this.Goal.goalDistance;
                    // this.GoalPrev.lastFrame = this.Goal.lastFrame;
                    
                }
                this.GoalPrev = {...this.Goal};                
            }
        } else {
            /* рандом */
            this.direction = Math.floor(Math.random() * (5 - 1) + 1);
            //console.log('FORK >>>  ' + process.pid + ' get_direction: ', this.direction);
            process.send({ command: 'get_direction', direction: this.direction });
        }
    }

    async droneFrame(msg) {
        //console.log('FORK >>>  ' + process.pid + ' droneFrame');
        try {
            let input = JSON.parse(msg.frame).a;

            /* дистанция до цели в кадре минимальная */
            let frameGoalDistance = 10000;

            /* незнаю куда двигаться */
            let frameGoalDirection = -1;
            /* я не вижу цели */
            this.imSeeGoal = false;
            for (let i = 0; i < input.length; i++) {
                /* ищем цель */

                /* цель в поле зрения */
                if (input[i].objectType == 'Goal') {
                    /* берем минимальную дистанцию */
                    /* до ближайшей цели */
                    if (parseInt(input[i].objectDistance) < frameGoalDistance) {
                        frameGoalDistance = parseInt(input[i].objectDistance);
                        frameGoalDirection = i;
                        this.imSeeGoal = true;
                    }
                    /* переопределяем объект */
                    input[i].objectType = GOAL;
                } else if (input[i].objectType == 0) {
                    input[i].objectType = NULL_OBJECT;
                } else {
                    input[i].objectType = OBJECT;
                }

                /* обновляем последнее положение цели */
                if (this.imSeeGoal) {
                    this.Goal.goalDirection = frameGoalDirection;
                    this.Goal.goalDistance = frameGoalDistance;
                    this.Goal.lastFrame = input;
                }
            }

            if (this.imSeeGoal) {
                //console.log('FORK >>>  goal: ', this.Goal.goalDirection, this.Goal.goalDistance);
            }
            /* логируем  */
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
        ////console.log("FORK >>>  msg from MASTER");       
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
            //console.log("FORK >>>  error");
            //console.log(e);
        }

    });
}