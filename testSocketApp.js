/**
 * Created by jdean on 11/23/13.
 */



//var config = require('./server/config.js');
var io = require('socket.io');
var fs = require('fs');
var connect = require('connect');
var staticClientServer = require('./js/server/clientLibraryHandler.js').staticServerHandler;
var emcUri = require('./js/server/emcUri.js');
var gmcUri = require('./js/server/gmcUri.js');
var request = require('request');
var MinerSocket = require('./js/server/minerSocket.js').MinerSocket;
var MinerProcess = require('./js/server/minerProcess.js').MinerProcess;
var config = require('./config.js').config;

var app = connect().use(staticClientServer).use(handler).listen(8181);

//app.listen(8181);

function handler (req, res, next) {

   fs.readFile(__dirname + '/index.html',
      function (err, data) {
         if (err) {
            return next();
         }

         res.writeHead(200);
         res.end(data);
      });
}


if (config.nodeType == 'server') {
   io = io.listen(app);
   io.sockets.on('connection', function (socket) {

      var lastDuration;

      function doRequest() {
         request(emcUri.defaultUserUri(), function (error, response, body) {
            if (!error && response.statusCode == 200) {
               socket.emit('update.emc.user', body);
            }
         });

         request(emcUri.defaultPoolUri(), function (error, response, body) {
            if (!error && response.statusCode == 200) {
               socket.emit('update.emc.pool', body);
            }
         });

         request(gmcUri.defaultBtcUri(), function (error, response, body) {
            if (!error && response.statusCode == 200) {
               socket.emit('update.gmc', body);
            }
         });
      }

      doRequest();
      setInterval(doRequest, 6000);

      var minerSocket = new MinerSocket({
         socket: socket
      });
      minerSocket.start();
   });
} else if (config.nodeType == 'slave') {
   var minerProcess = new MinerProcess();
   minerProcess.start();
}


