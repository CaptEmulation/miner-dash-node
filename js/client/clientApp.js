/**
 * Created by jdean on 11/24/13.
 */



require.config({
   baseUrl: 'client',
   paths: {
      jquery: '../lib/jquery-2.0.3',
      backbone: '../lib/backbone',
      underscore: '../lib/underscore'
   },
   shim: {
      'underscore': {
         exports: '_'
      },
      'backbone': {
         exports: 'Backbone'
      }
   }
});

requirejs(['jquery', './client/emcDataMgr.js', 'underscore', 'backbone', ''], function ($, emcDataMgr, _, Backbone) {

   var socket = io.connect('http://localhost:8181');


   socket.on("update.user", function (data) {
      var userModel = emcDataMgr.Service().createUserModel();
      var userData = JSON.parse(data);
      if (userData) {
         userModel.setData(userData);
      }
      $('label#hashSpeed').html(userModel.get('totalHashRateString'));
   });

   var lastPool = new Backbone.Model({
      round_shares: 0
   });

   var numBlocks = 0;
   $('label#foundBlockLabel').html(numBlocks);

   socket.on('update.pool', function (data) {
      var poolData = JSON.parse(data);
      if (poolData) {
         var newPool = new Backbone.Model(poolData);
         if (newPool.get('round_shares') < lastPool.get('round_shares')) {
            // New Block!!
            $('label#foundBlockLabel').html(numBlocks++);
         }
      }

   });

   socket.on('miner.stdout', function (msg) {
      $('label.minerOutput').append(msg.data.replace(/\n/g, '<br />'));
   });

   $('button.minerStarter').click(function () {
      socket.emit('startMiner');
   });

   $('button.minerStopper').click(function () {
      socket.emit('stopMiner');
   });


});