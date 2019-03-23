var socket = io('http://localhost:3000');
var socket2 = io('http://localhost:3000');
const log = console.log;
const img_size = 256;

/* загрузка картинки */
document.getElementById("Upload").addEventListener("click", onUploadFile);

/* делает буфер для вывода */
function makeBuffer(source) {
    let Buffer = new Uint8Array(img_size * img_size);;
    let canvas = document.getElementById(source);
    var ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let i = 0;
    for (let j = 0; j < img_size * img_size; j++) {
        Buffer[j] = imageData.data[i]; //берем красный
        i += 4;
    }

    delete imageData, ctx, canvas;
    return Buffer;
}

/* событие загрузки файла */
function onUploadFile(event) {
    let reader, output, canvas, ctx, buffer, image, selectedFile;

    /*  */
    reader = new FileReader();
    reader.onload = function () {
        output = document.getElementById('source');
        output.src = reader.result;
    };

    /* читаем файл и ложим в картинку на канвасе */
    selectedFile = document.getElementById('img_file').files[0];
    reader.readAsDataURL(selectedFile);

    image = document.getElementById('source');

    /* вставляем в канвас оригинала */
    canvas = document.getElementById('img_original');
    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, img_size, img_size);

    /* чето делаем */
    buffer = makeBuffer('img_original');
    /* вставляем обработанный */
    writeImg('img_class', buffer);
    var t = setInterval(() => {
        socket.emit('client send img', new Blob([buffer]));
    }, 1000);
    delete reader, output, canvas, ctx, buffer, image, selectedFile;;


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

    let i = 0;
    for (let Y = 0; Y < img_size; Y++) {
        for (let X = 0; X < img_size; X++) {

            imageData.data[i] = Buffer[Y * img_size + X];
            imageData.data[i + 1] = Buffer[Y * img_size + X];
            imageData.data[i + 2] = Buffer[Y * img_size + X];
            imageData.data[i + 3] = 255;
            i += 4;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    delete imageData, i, canvas, ctx;
}


socket.on('img_original', (msg) => {
    writeImg('img_original', new Uint8Array(msg));
});

socket2.on('img_class_n', (msg) => {
    let img = new Uint8Array(msg);
    writeImg('img_class_n', new Uint8Array(msg));
    delete img;
});

socket2.on('img_class_n_split', (msg) => {
    console.log(msg);
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
