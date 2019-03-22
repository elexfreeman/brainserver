// Run on a GPU machine with CUDA installed
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node-gpu');
console.log(tf.getBackend());
// tensorflow