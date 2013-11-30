/**
 * Created by jdean on 11/28/13.
 */


var MinerProcess = require('./minerProcess.js').MinerProcess;

var MinerSocket = exports.MinerSocket = function (options) {

   if (!(options && options.socket)) {
      throw new Error('Need options, options.socket for MinerSocket')
   }

   var minerProcesses = {}, socket = options.socket;

   function startMiner(options) {
      var minerProcess;

      options = options || {};
      options.name = options.name || 'default';

      if (!minerProcesses[options.name]) {
         minerProcess = new MinerProcess();
         minerProcess.start();
         minerProcess.events.on('stdout', function (data) {
            socket.emit('miner.stdout', {
               name: options.name,
               data: data
            });
         });
         minerProcesses[options.name] = minerProcess;
      }

      return minerProcess;
   }

   function stopMiner(options) {
      options = options || {};
      options.name = options.name || 'default';

      if(minerProcesses[options.name]) {
         minerProcesses[options.name].stop();
      }
   }

   return {

      createMiner: startMiner,

      start: function () {
         socket.on('startMiner', function (options) {
            startMiner(options);
         });

         socket.on('stopMiner', function (options) {
            stopMiner(options);
         });
      }

   };
}