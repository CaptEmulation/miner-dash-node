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

requirejs(['jquery', './client/emcDataMgr.js',  './client/gmcDataMgr.js', 'underscore', 'backbone', ''], function ($, emcDataMgr, gmcDataMgr, _, Backbone) {

   var socket = io.connect('http://localhost:8181');


   socket.on("update.emc.user", function (data) {
      var emcModel = emcDataMgr.Service().createUserModel(data);
      $('label#emcHashSpeed').html(emcModel.get('totalHashRateString'));
      $('label#emcConfirmedRewards').html(emcModel.get('data').user.confirmed_rewards + ' BTC');
      $('label#emcUnconfirmedRewards').html(emcModel.get('data').user.unconfirmed_rewards + ' BTC');
      $('label#emcEstimatedRewards').html(emcModel.get('data').user.estimated_rewards + ' BTC');
   });

   socket.on("update.gmc", function (data) {
      var gmcModel = gmcDataMgr.Service().createUserModel(data);
      $('label#gmcHashSpeed').html(gmcModel.get('totalHashRateString'));
      $('label#gmcConfirmedRewards').html(gmcModel.get('confirmed_rewards') + ' BTC');
      $('label#gmcEstimatedRewards').html(gmcModel.get('round_estimate') + ' BTC');
   });

   socket.on('update.emc.pool', function (data) {
      var poolData = JSON.parse(data);
      if (poolData) {
         var newPool = new Backbone.Model(poolData);
         if (newPool.get('round_duration')) {
            // round duration
            $('label#emcLastDuration').html(newPool.get('round_duration'));
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