/**
 * Created by jdean on 11/27/13.
 */


var childProcess = require('child_process');
var Event = require('events').EventEmitter;
var config = require('../../config.js').config;


var MinerProcess = exports.MinerProcess = function (options) {

   var minerSpawn, heartBeat, events = new Event(), timeout = 15 * 60 * 10000;

   function resetHeartbeat() {
      heartBeat = setTimeout(function () {
         minerProcess.restart();
      }, timeout);
   }

   minerProcess = {
      start: function () {
         minerSpawn = childProcess.spawn(config.miner.executable, config.miner.arguments, config.miner.options);
         resetHeartbeat();
         minerSpawn.stdout.setEncoding('utf8');
         minerSpawn.stderr.setEncoding('utf8');
         minerSpawn.stdout.on('data', function (data) {
            //resetHeartbeat();
            events.emit('stdout', data);
         });
         minerSpawn.stderr.on('data', function (data) {
            //resetHeartbeat();
            events.emit('stdout', data);
         });
      },

      events: events,

      stop: function () {
         minerSpawn.kill();
         minerSpawn.stdout.off();
         minerSpawn.stderr.off();
         clearTimeout(heartBeat);
      },

      restart: function () {
         this.stop();
         this.start();
      }


   }

   return minerProcess;
}