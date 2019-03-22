const { GPU } = require('gpu.js');

const gpu = new GPU({ mode: 'gpu' });
const opt = {
    output: { x: 10 }
};

const myFunc = gpu.createKernel(function() {
    const array2 = [0.08, 2];
     return array2;
}, opt);

console.log(myFunc());