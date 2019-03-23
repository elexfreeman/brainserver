const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

let img = tf.range(0, 35, 1);



let z = [];
for (let i = 0; i < 36; i++) {
    z.push(i);
}

const x6x6 = tf.tensor1d(z);

const x = tf.tensor2d(z, [6, 6]);
x.print();
const a = tf.split(x, 3, 0);
let counter = 0;
let imgSM = [];
a.forEach((v, k) => {
    cc = tf.split(v, 3, 1);
    cc.forEach((vv, kk) => {
        imgSM.push(vv.arraySync());
    });
});

imgSM.forEach(element => {
    console.log(element);
});
