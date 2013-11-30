/**
 * Created by jdean on 11/24/13.
 */


define(['underscore', 'backbone'], function (_, Backbone) {
   var Model = Backbone.Model;
   var Collection = Backbone.Collection;
   var exports = {};

   var unitToMultiplier = {
      'TH\/s': 1000000000000,
      'GH\/s': 1000000000,
      'MH\/s': 1000000,
      'KHS/s': 1000
   }

   function sum(memo, num){ return memo + num; };

   var EmcUserModel = exports.EmcUserModel = Model.extend({
      defaults: {
         hashRate: 0
      },

      initialize: function (options) {
         this.on("sync", this._onFetch, this);

         Model.prototype.initialize.apply(this, arguments);
      },

      _convertToRawHashRate: function (string) {
         var value = 0, multiplier = 0;
         Object.keys(unitToMultiplier).forEach(function (multiplierStr) {
            if (string.indexOf(multiplierStr) != -1) {
               value = string.split(' ' + multiplierStr)[0];
               multiplier = unitToMultiplier[multiplierStr];
            }
         });

         return value * multiplier;
      },

      _onFetch: function (collection) {
         this.setData(collection);
      },

      _sum: function (hashes) {
         return _.reduce(hashes, sum, 0);
      },

      setData: function(data) {
         data.totalHashRate = _.map(data.workers, function (worker) {
            return this._convertToRawHashRate(worker.hash_rate);
         }.bind(this)).reduce(sum, 0);
         data.totalHashRateString = this._convertHashrateToString(data.totalHashRate);
         this.set(data);
      },

      _convertHashrateToString: function (hashRate) {
         var abrVal, str = '';
         Object.keys(unitToMultiplier).forEach(function (multiplierStr) {
            abrVal = hashRate / unitToMultiplier[multiplierStr];
            if ((abrVal > 1) && (abrVal < 1000)) {
               str = abrVal + ' ' + multiplierStr;
            }
         });
         return str;
      },

      setTotalHashRate: function (hash) {
         if (_.isArray(hash)) {
            hash = this._sum(hash);
         } else if (!_.isNumber(hash)) {
            return;
         }

         this.set('totalHashRate', hash);
      }

   });

   var Service = exports.Service = function () {


      return {
         /**
          *
          * @returns {EmcUserModel}
          */
         createUserModel: function (options) {
            var eum = new EmcUserModel();
            return eum;
         }
      };
   };

   return exports;
});
