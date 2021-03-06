

export const GOAL = 2;
export const OBJECT = 1;
export const NULL_OBJECT = 0;
/* показания сенсора */
export interface JSensor {
    /* тип объекта */
    /* 
    0 - нету 
    1 - объект
    2 - цель
    */

    objectType: number;
    objectDistance: number;
}

/* данные для обучения */
export interface JFrame {
    /* массив сеносоров */
    state: JSensor[];
    /* направление движения */
    direction: number;
    /* растояние до цели - является наградой */
    distance: number;
}

/* Мозг бота */
/* Q-Learning нейросеть */
class CubeBrainClass {

    /* имя */
    private name: string;

    buffer: JFrame[];

    /* текущее направление движения */
    direction: number;
    /* кол-во сенсоров */
    sensorCounter = 25;

    frameCounter = 300;

    worker: any;

    bufferAllreadyInit: boolean;

    constructor() {
        this.direction = 1;
        this.bufferAllreadyInit = false;
        this.initBuffer();
    }

    destructor() {

    }

    /* заполняет буфер сучайными данными */
    initBuffer() {
        if (!this.bufferAllreadyInit) {


            let state: JSensor[] = [];;
            this.buffer = [];
            for (let n = 0; n < this.frameCounter; n++) {
                state = [];
                /* нлевые объекты */
                for (let i = 0; i < 25; i++) {
                    state.push({
                        objectType: 0,
                        objectDistance: Math.floor(Math.random() * (2 - 0) + 0)
                    })
                }

                /* объект */
                for (let i = 0; i < 25; i += 3) {
                    state[i] = {
                        objectType: 1,
                        objectDistance: Math.floor(Math.random() * (2 - 0) + 0)
                    }
                }

                /* цель */
                let JDistance = Math.floor(Math.random() * (2 - 0) + 0);
                state[Math.floor(Math.random() * (25 - 1) + 1)] = {
                    objectType: 1,
                    objectDistance: JDistance
                }

                this.buffer.push({
                    state: state,
                    direction: Math.floor(Math.random() * (1 - 5) + 5),
                    distance: JDistance
                });
            }
            this.bufferAllreadyInit = true;
        }
    }


    to_0_1(resp) {
        return resp > .5 ? 1 : 0;
    }

    getBuffer() {
        return this.buffer;
    }

    onDisconnect(reason) {
    }


    async getDirection() {
        return Math.random() * (5 - 1) + 1;
    }


    /* вставляет кадр в буфер кадров */
    addFrame(frame: any[]) {

    }




    echo(msg) {
        console.log(msg);

    }
}


export const CubeBrain = new CubeBrainClass();;