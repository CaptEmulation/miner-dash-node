/**
 * Created by jdean on 11/24/13.
 */


var globalConfig = require('../../config.js').config;

var actionTypes = exports.actionTypes = {
   BTC: 'api-btc'
};

var poolType = exports.poolType = 'give-me-coins';

function getGmcPoolConfig(config) {
   var returnPool = null;
   config.pools.forEach(function (pool) {
      if (pool.type === poolType) {
         returnPool = pool;
      }
   });
   return returnPool;
};

var config = getGmcPoolConfig(globalConfig);

var createUri = exports.createUri = function (options) {

   if (!(options && options.apiKey && options.action)) {
      return new Error ("Missing required options");
   }

   return 'https://give-me-coins.com/pool/' + options.action + '?api_key=' + options.apiKey;
};

exports.defaultBtcUri = function () {
   return createUri({
      apiKey: config.apiKey,
      action: actionTypes.BTC
   });
};
