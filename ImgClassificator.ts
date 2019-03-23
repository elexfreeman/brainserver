import Hopfield from "./Jarvis/Hopfield";
const img_size = 256;
const net = new Hopfield(img_size * img_size, 3);

/* собственно классификатор */
/* для тестов самоклассификации частей изображения */


/* разрезает изобрадение на части для обработки */
/* выдает массив частей избражения */
function sliceImg(Buffer) {
    const frameSize = 4;
    let resp = [];
    let buf = [];

    let counter;
    for (let X = 0; X < 256 - frameSize; X++) {
        for (let Y = 0; Y < 256 - frameSize; Y++) {
            buf = [];
            counter = Y * img_size + X;
            for (let j = 0; j < frameSize; j++) {
                for (let i = counter; i < frameSize; i++) {
                    buf.push(Buffer[i + (256 * j)]);
                }
            }
            resp.push({
                frame: buf,
                bin: convertBufferToBin(buf)
            });
        }
    }
    return resp;
}

function convertBufferToBin(Buffer) {
    let resp = '';
    for (let j = 0; j < img_size * img_size; j++) {
        resp += parseInt(Buffer[j]).toString(2);
    }

    let t = resp.split('');
    return t;
}

export function ImgClassificator(socket) {

    /* обработка событий текущего состояния */
    socket.on('client send img', (msg) => {
        //console.log(msg.length);
        let AIData = convertBufferToBin(new Uint8Array(msg));
        let d = sliceImg(new Uint8Array(msg));
       // if (AIData.length == 445633) {
            console.log(d);
            socket.broadcast.emit('img_class_n', msg);
        //}


    });


    /*  socket.on('img_class_n', (msg) => {
         //bot.echo(msg);
         socket.broadcast.emit('img_class_n', msg);
     }); */

}