import CubeTFClass from './CubeTF';

import { CubeBrainClass } from './CubeBrain';
import { isMainThread } from 'worker_threads';


async function main() {
    const CubeBrain = new CubeBrainClass();
    CubeBrain.initBuffer();

    const CubeTF = new CubeTFClass(100, CubeBrain.buffer, CubeBrain.frameCounter, CubeBrain.sensorCounter);

    CubeTF.createModel();
    await CubeTF.learn();

    console.log('input_data', CubeTF.input_data[0]);
    console.log('out_data', CubeTF.out_data[0]);
    let patern = CubeTF.input_data[0];

    console.log(await CubeTF.feed(patern));

    

}

main();

// for (let i = 0; i < CubeBrain.buffer.length; i++) {
//     console.log(CubeBrain.buffer[i]);
// }


