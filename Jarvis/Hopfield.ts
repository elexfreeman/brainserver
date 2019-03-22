const tf = require('@tensorflow/tfjs');

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
//require('@tensorflow/tfjs-node-gpu');
require('@tensorflow/tfjs-node');
//require('@tensorflow/tfjs-node');


/* Нейро́нная сеть Хо́пфилда */

export default class Hopfield {
    size: number;
    epochs: number;
    model: any;

    constructor(size: number, epochs: number) {
        this.size = size;
        this.epochs = epochs;
    }


    
    initModel() {

        this.model = tf.sequential();
        /* выход size вход size */
        this.model.add(tf.layers.dense({ units: this.size, activation: 'sigmoid', inputShape: [this.size] }));

        this.model.compile({ loss: 'meanSquaredError', optimizer: 'rmsprop' });
    }   


    async learn(set) {
      
        const training_data = tf.tensor(set);
        const target_data = tf.tensor(set);
        var h = await this.model.fit(training_data, target_data, {
            epochs: 100
            , verbose: 0
        });
        
    }

    async feed(pattern) {
        let resp = await this.model.predict(tf.tensor([pattern])).array();
        return resp[0].map((v, k) => {
            return v > .5 ? 1 : 0;
        });
    }
}
