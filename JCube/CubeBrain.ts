
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
export class CubeBrainClass {

    /* имя */
    private name: string;

    buffer: JFrame[];

    /* текущее направление движения */
    direction: number;
    /* кол-во сенсоров */
    sensorCounter = 24;

    frameCounter = 300;

    constructor() {
        this.direction = 1;
    }

    /* заполняет буфер сучайными данными */
    initBuffer() {
        let state: JSensor[] = [];;
        this.buffer = [];
        for (let n = 0; n < this.frameCounter; n++) {
            state = [];
            /* нлевые объекты */
            for (let i = 0; i < 24; i++) {
                state.push({
                    objectType: 0,
                    objectDistance: Math.floor(Math.random() * (2 - 0) + 0)
                })
            }

            /* объект */
            for (let i = 0; i < 24; i += 3) {
                state[i] = {
                    objectType: 1,
                    objectDistance: Math.floor(Math.random() * (2 - 0) + 0)
                }
            }

            /* цель */
            let JDistance = Math.floor(Math.random() * (2 - 0) + 0);
            state[Math.floor(Math.random() * (24 - 1) + 1)] = {
                objectType: 1,
                objectDistance: JDistance
            }

            this.buffer.push({
                state: state,
                direction: Math.floor(Math.random() * (1 - 5) + 5),
                distance: JDistance
            });
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


    getDirection() {
        return Math.random() * (5 - 1) + 1;
    }


    /* вставляет кадр в буфер кадров */
    addFrame(frame: any[]) {

    }




    echo(msg) {
        console.log(msg);

    }
}