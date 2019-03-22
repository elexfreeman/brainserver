const tf = require('@tensorflow/tfjs');
const readline = require('readline-sync');


// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
//require('@tensorflow/tfjs-node-gpu');
require('@tensorflow/tfjs-node');
//require('@tensorflow/tfjs-node');

class Hopfield {
    constructor(size, epochs) {
        this.size = size;
        this.epochs = epochs;
    }


    model() {

        this.model = tf.sequential();
        /* выход size вход size */
        this.model.add(tf.layers.dense({ units: this.size, activation: 'sigmoid', inputShape: [this.size] }));

        //this.model.add(tf.layers.dense({ units: size, activation: 'sigmoid', inputShape: [size] }));
        /* выход size вход size */

        this.model.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
    }

    async model1() {
        this.model = tf.sequential();

        this.model.add(tf.layers.inputLayer({ inputShape: [this.size] }));

        this.model.add(tf.layers.dense({ units: this.size, activation: 'sigmoid' }));
        this.model.add(tf.layers.dense({ units: this.size, activation: 'softmax' }));
        // this.model.add(tf.layers.dense({ units: this.size, activation: 'softmax' }));
        await this.model.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
       /*  await this.model.compile({
            optimizer: tf.train.adam(1e-6),
            loss: tf.losses.sigmoidCrossEntropy,
            metrics: ['accuracy']
        }); */
    }


    async learn(set) {

        const start = new Date().getTime();

        const iterations = 10;

        const training_data = tf.tensor(set);
        const target_data = tf.tensor(set);

        for (let i = 1; i < iterations; ++i) {
            var h = await this.model.fit(training_data, target_data, {
                epochs: 100
                , verbose: 0
            });
            console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
        }
        console.log('>>>>>>>>>>> learn...');

        const end = new Date().getTime();
        console.log(`SecondWay: ${end - start}ms`);

    }

    async feed(pattern) {
        let resp = await this.model.predict(tf.tensor([pattern])).array();
        return resp[0].map((v, k) => {
            return v > .5 ? 1 : 0;
        });
    }
}



async function feed(word) {
    var input = ascii2bin(word);
    var output = await hopfield.feed(input);
    var key = output.join('');

    if (key in map) {
        map[key].push(word);
    } else {
        var learn = [];
        map[key] = [word];


        for (let i in map) {
            learn.push(i.split(''));
        }


        for (var p in learn) {
            learn[p] = learn[p].map((v, k) => {
                return parseInt(v);
            })
        }

        console.log(map);
        await hopfield.learn(learn);
    }


    preview();
}

var preview = function () {
    for (let k in map) {
        console.log(map[k]);
    }
}


var ascii2bin = function (ascii) {
    var bin = "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (var i = 0; i < ascii.length; i++) {
        var code = ascii.charCodeAt(i);
        bin += ('00000000' + code.toString(2)).slice(-8);
    }
    let resp = bin.slice(-10 * 8).split('').reverse();
    resp = resp.map((v, k) => {
        return parseInt(v);
    })
    return resp;
}

var bin2dec = function (bin) {
    return parseInt(bin.join(''), 2);
}

var doTrain = function (set) {
    hopfield.learn(set);
}



var hopfield = new Hopfield(80);



var map = [];



map[ascii2bin("cat").join('')] = ["cat"];
map[ascii2bin("dog").join('')] = ["dog"];
map[ascii2bin("john").join('')] = ["john"];

map.forEach((v, k) => {

})
var learn_map = [ascii2bin("john"), ascii2bin("dog"), ascii2bin("cat")];








async function main() {
    await hopfield.model1();
    let word;
    preview();
    await hopfield.learn(learn_map);
    while (true) {
        word = readline.question("Input word: ");
        await feed(word.trim());

    }
}

main();