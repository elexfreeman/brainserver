import { log } from './log';
import { Vector3 } from './CommonInterfaces';
import { bots } from './Bots';
import { Socket } from 'dgram';


const { registerFont, createCanvas, createImageData } = require('canvas')

const DroneViewSize = 256;

function convertBufValue(b) {
    if (parseInt(b) < 10) {
        return '00' + b;
    } else if (parseInt(b) < 100) {
        return '0' + b;
    } else {
        return b;
    }
}

/* записывает буфер в виде картинки */
function writeImg(Buffer) {
    const canvas = createCanvas(DroneViewSize, DroneViewSize);
    var ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let i = 0;
    

    for (let X = 0; X < DroneViewSize; X++) {
        for (let Y = 0; Y < DroneViewSize; Y++) {
            imageData.data[i] = Buffer[Y * DroneViewSize + X];
            imageData.data[i + 1] = Buffer[Y * DroneViewSize + X];
            imageData.data[i + 2] = Buffer[Y * DroneViewSize + X];
            imageData.data[i + 3] = 255;
            i += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const out = fs.createWriteStream(__dirname + '/test.jpeg');
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    out.on('finish', () => {
        log('imageData.data.length');
        log(imageData.data.length);
        log('The JPEG file was created.')
    })

}

const fs = require('fs');
/* Сенсор */
interface Sensor {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    front: boolean;
    back: boolean;
}

/* кадр для AI  */
export interface AIFrame {
    force: Vector3; /* примененая сила */
    sensors: Sensor[]; /* показатели сенсоров во времени */
    goal: boolean;  /* состояния достигнутой цели */
}

/* Мозг бота */
/* Q-Learning нейросеть */
export class BotBrainClass {

    private socket;
    /* имя */
    private name: string;
    /* родитель */
    private parent: string;
    /* энергия */
    private energy: number;
    /* текущие кооррдинады в пространстве */
    private coord: Vector3;
    /* направление движения */
    private force: Vector3;

    /* Кадровый буфер */
    private frameBuffer: AIFrame[];
    /* Размер буфера кадров */
    private frameBufferLength = 3000;

    /* номер кадра сенсора для сборки фрейма */
    private sensorFrameCounter = 0;
    /* кадров для хранения посделовательности движения */
    private sensorFrameMax = 4;
    /* последовательность показаний сенсоров */
    private sensorFrame: Sensor[];

  

    /* сообщение об изменение state */
    onStateMessage(msg) {
        try {
            this.name = msg.name;
            this.parent = msg.parent;
            this.energy = msg.energy;
            this.coord = msg.coord;
            bots['bot_' + this.name] = this;
            console.log(msg.sensor);

        } catch (e) {
            log('Error: ', e)
        }
    }

    /* собщение об кадре движения */
    onGetFrame(msg) {
        log(msg);
        return true;
        /*  try {
            
             if (this.sensorFrameCounter < this.sensorFrameMax) {
                 this.sensorFrame.push(msg);
                 this.sensorFrameCounter++;
             } else {
              
                 this.sensorFrameCounter = 0;
                 this.sensorFrame = [];
             }
 
         } catch (e) {
             console.log('Error: ', e)
         } */
    }

    onDisconnect(reason) {
        /* когда отконектился удаляем из ботов */
        if (this.name) {
            log('Bot disconnected: ', 'bot_' + this.name, reason);
            delete bots['bot_' + this.name];
        }
    }

    /* вставляет в буфер памяти 1 кадр */
    pushFrameBuffer(frame: AIFrame) {

    }



    echo(msg) {
        var imgArray = new Uint8Array(msg.buffer);
        log('Length: ', imgArray.length);
        log('BYTES_PER_ELEMENT: ', imgArray.BYTES_PER_ELEMENT);
        //console.log('message: ', imgArray);
       // writeImg(imgArray);
        /* переотпрвавляем картинку всем */
        //this.socket.broadcast.emit('resend img', msg);
      


    }
}