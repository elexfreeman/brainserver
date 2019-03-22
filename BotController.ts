import { BotBrainClass } from './BotBrain';

import { log } from './log';

import { bots } from './Bots';

export function BotController(socket) {
    console.log('connect');
    const bot = new BotBrainClass();
    /* обработка событий текущего состояния */
    socket.on('state message', (msg) => {
        bot.onStateMessage(msg);
    });
    socket.on('img', (msg) => {
        //bot.echo(msg);
        socket.broadcast.emit('resend img', msg);
    });
    socket.on('disconnect', (msg) => {
        bot.onDisconnect(msg);
    });
}