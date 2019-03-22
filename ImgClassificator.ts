import Hopfield from "./Jarvis/Hopfield";

const net = new Hopfield(100, 3);

/* собственно классификатор */
/* для тестов самоклассификации частей изображения */

export function ImgClassificator(socket) {    
   
    /* обработка событий текущего состояния */
    socket.on('client send img', (msg) => {
        console.log(msg);
    });

    
    socket.on('img', (msg) => {
        //bot.echo(msg);
        socket.broadcast.emit('resend img', msg);
    });
    
}