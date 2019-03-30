import { log } from './log';
import { Vector3 } from './CommonInterfaces';
import { bots } from './Bots';
import { Socket } from 'dgram';



/* Мозг бота */
/* Q-Learning нейросеть */
export class CubeBrainClass {

    /* имя */
    private name: string;

    direction: number;

    constructor(){
        this.direction = 1;
    }

    onDisconnect(reason) {
    }


    getDirection() {
        return Math.random() * (5 - 1) + 1;
    }




    echo(msg) {
        console.log(msg);

    }
}