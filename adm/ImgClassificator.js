var socket = io('http://localhost:3000');
const log = console.log;
const img_size = 256;

/* загрузка картинки */
document.getElementById("Upload").addEventListener("click", onUploadFile);


function onUploadFile(event) {
    console.log('upload');
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('source');
        output.src = reader.result;
    };
    var selectedFile = document.getElementById('img_file').files[0];
    reader.readAsDataURL(selectedFile);
    var image = document.getElementById('source');

    let canvas = document.getElementById('img_original');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, img_size, img_size);
}

/* ******************************************* */
/* ******************************************* */
/* ******************************************* */
/* записывает из буфера в виде картинки */
function writeImg(id, Buffer) {
    let canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (!canvas.getContext) {
        log('unsuport canvas');
        return;
    }

    for (let X = 0; X < img_size; X++) {
        for (let Y = 0; Y < img_size; Y++) {
            imageData.data[i] = Buffer[Y * img_size + X];
            imageData.data[i + 1] = Buffer[Y * img_size + X];
            imageData.data[i + 2] = Buffer[Y * img_size + X];
            imageData.data[i + 3] = 255;
            i += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Whenever the server emits 'login', log the login message
socket.on('img_original', (msg) => {
    writeImg('img_original', new Uint8Array(msg));
});

socket.on('img_class', (msg) => {
    writeImg('img_class', new Uint8Array(msg));
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
