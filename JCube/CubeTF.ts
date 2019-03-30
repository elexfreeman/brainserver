const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

import { JSensor, JFrame } from './CubeBrain';

export default class CubeTFClass {

    epochs: number;
    model: any;
    buffer: JFrame[];
    frameCounter: number;
    sensorCounter: number;

    input_data: any;
    out_data: any;

    constructor(epochs: number, buffer: JFrame[], frameCounter: number, sensorCounter: number) {
        this.epochs = epochs;
        this.buffer = buffer;
        this.frameCounter = frameCounter;
        this.sensorCounter = sensorCounter;
        this.prepareData();
    }

    /* подготавливаем данные для тренировки */
    prepareData() {
        this.input_data = [];
        this.out_data = [];

        let input = [];
        for (let i = 0; i < this.buffer.length; i++) {
            input = [];
            for (let j = 0; j < this.buffer[i].state.length; j++) {
                input.push(this.buffer[i].state[j].objectType);
                input.push(this.buffer[i].state[j].objectDistance);
            }
            input.push(this.buffer[i].distance);

            this.input_data.push([...input]);
            this.out_data.push([
                (this.buffer[i].direction==1) ? 1:0,
                (this.buffer[i].direction==2) ? 1:0,
                (this.buffer[i].direction==3) ? 1:0,
                (this.buffer[i].direction==4) ? 1:0,
            ]);
        }
        console.log('input_data', this.input_data.length);
        console.log('input_data item', this.input_data[0].length);
        console.log('out_data', this.out_data.length);

    }

    createModel() {

        this.model = tf.sequential();
        /* выход size вход size */
        // this.model.add(tf.layers.dense({
        //     units: 4,
        //     activation: 'softmax',
        //     kernelInitializer: 'varianceScaling',
        //     inputShape: [this.input_data[0].length]
        // }));

        this.model.add(tf.layers.dense({ 
            units: 4, 
            activation: 'sigmoid', 
            inputShape: [this.input_data[0].length] 
        }));
        /* выход size вход size */

        // Choose an optimizer, loss function and accuracy metric,
        // then compile and return the model
        const optimizer = tf.train.adam();
        this.model.compile({
            optimizer: optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
       // this.model.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
    }


    async learn() {

        const start = new Date().getTime();

        const iterations = 10;


        /* подготавливаем данные для тренировки */

        const training_data = tf.tensor(this.input_data).softmax();
        const target_data = tf.tensor(this.out_data).softmax();

        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = {
          name: 'Model Training', styles: { height: '1000px' }
        };
        


        for (let i = 1; i < iterations; ++i) {
            // var h = await this.model.fit(training_data, target_data, {
            //     epochs: this.epochs
            //     , verbose: 0
            // });
            var h = await this.model.fit(training_data, target_data, {
                batchSize: training_data.length,
                validationData: [training_data, target_data],
                epochs: this.epochs,
                shuffle: true,
                verbose: 0
              });
            console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
        }
        console.log('>>>>>>>>>>> learn...');

        const end = new Date().getTime();
        console.log(`SecondWay: ${end - start}ms`);

    }

    async feed(pattern) {
        return await this.model.predict(tf.tensor([pattern])).array();
        // return resp[0].map((v, k) => {
        //     return v > .5 ? 1 : 0;
        // });
    }

}