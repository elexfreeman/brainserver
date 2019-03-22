var socket = io('http://localhost:3000');
const log = console.log;
const DroneViewSize = 256;

/* записывает буфер в виде картинки */
function writeImg(Buffer) {
    let canvas = document.getElementById('drone_view');
     var ctx = canvas.getContext('2d');
     let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);


    if (!canvas.getContext) {
        log('unsuport canvas');
        return;
    }
    

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
}

// Whenever the server emits 'login', log the login message
socket.on('resend img', (msg) => {
    writeImg(new Uint8Array(msg));
});


socket.on('disconnect', () => {
    log('you have been disconnected');
});

socket.on('reconnect', () => {
    log('you have been reconnected');
});

socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
});
