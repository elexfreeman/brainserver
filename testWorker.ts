var cluster = require('cluster');

if (cluster.isWorker) {

  console.log('Worker ' + process.pid + ' has started.');

  // Send message to master process.
  process.send({msgFromWorker: 'This is from worker ' + process.pid + '.'})

  // Receive messages from the master process.
  process.on('message', function(msg) {
    console.log('Worker ' + process.pid + ' received message from master.', msg);
  });

  //worker.kill();

}


if (cluster.isMaster) {

  console.log('Master ' + process.pid + ' has started.');

  // Fork workers.
  for (var i = 0; i < 200; i++) {
    var worker = cluster.fork();

    // Receive messages from this worker and handle them in the master process.
    worker.on('message', function(msg) {
      console.log('Master ' + process.pid + ' received message from worker ' + this.pid + '.', msg);
    });

    // Send a message from the master process to the worker.
    worker.send({msgFromMaster: 'This is from master ' + process.pid + ' to worker ' + worker.pid + '.'});
  }

  // Be notified when worker processes die.
  cluster.on('death', function(worker) {
    console.log('Worker ' + worker.pid + ' died.');
  });

}