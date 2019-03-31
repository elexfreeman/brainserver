import CubeTFClass from './CubeTF';

import { CubeBrainClass } from './CubeBrain';
import { isMainThread } from 'worker_threads';


async function main() {
    const CubeBrain = new CubeBrainClass();
    CubeBrain.initBuffer();

    const CubeTF = new CubeTFClass(10, CubeBrain.buffer, CubeBrain.frameCounter, CubeBrain.sensorCounter);

    CubeTF.createModel();
    await CubeTF.learn();
    let patern;
    // console.log('input_data', CubeTF.input_data[0]);
    console.log('feed >>>>>> ');
    for (let i = 0; i < 5; i++) {

        console.log('out_data', CubeTF.out_data[i]);
        patern = CubeTF.input_data[i];
        console.log(await CubeTF.feed(patern));
    }





}

main();

// for (let i = 0; i < CubeBrain.buffer.length; i++) {
//     console.log(CubeBrain.buffer[i]);
// }


