import Hopfield from "./Jarvis/Hopfield";
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const img_size = 256;
const frameSize = 4;

const net = new Hopfield(img_size * img_size, 3);

/* int to bin  */
/* 
    n: чиало
    b: кол-во бит
 */
const bits = (n: number, b = 32) => {
   return Array(b).fill(0).map((x, i) => (n >> i) & 1)
};


interface ImgFrame {
    img: number[][]; /* массив крсного цвета  */
    bin: number[] /* массив бинароного представления  [0,1,1,0,0 ...] */
    size: number;
}

/* кадр изображения */
function prepareFrame(img): ImgFrame {
    let bin = [];

    img.forEach((v) => {
        v.forEach((vv) => {            
            bin = bin.concat(bits(vv, 8));//переводим в двоичное представление
        })
    });

    return {
        img: img,
        bin: bin,
        size: frameSize
    }
}

/* собственно классификатор */
/* для тестов самоклассификации частей изображения */


/* разрезает изобрадение на части для обработки */
/* выдает массив частей избражения */
async function sliceImg(Buffer) {

    let imgSM = [];

    const x = tf.tensor2d(Buffer, [img_size, img_size]);

    /* 256 / 4 = 64 */
    const a = tf.split(x, Math.trunc(img_size / frameSize), 0);

    let cc;
    let temp;
    for (let k in a) {
        /* делим еще раз */
        cc = tf.split(a[k], Math.trunc(img_size / frameSize), 1);
        for (let kk in cc) {
            temp = await cc[kk].array();
            imgSM.push(prepareFrame(temp));
        }
    }
    
    return imgSM;
}






export function ImgClassificator(socket) {

    /* обработка событий текущего состояния */
    socket.on('client send img', async (msg) => {



        let d = await sliceImg(new Uint8Array(msg));

        socket.broadcast.emit('img_class_n', msg);
        socket.broadcast.emit('img_class_n_split', d);

    });


    /*  socket.on('img_class_n', (msg) => {
         //bot.echo(msg);
         socket.broadcast.emit('img_class_n', msg);
     }); */

}