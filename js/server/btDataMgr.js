/**
 * Created by jdean on 11/24/13.
 */


var request = require('request');
var moment = require('moment');

/**
 *
 * @param {Object} poolDurationString poolupdate "round_duration" string
 * @returns {*|Date}
 */
exports.convertPoolDurationToDate = function (poolDurationString) {
   var numberArray = [];
   poolDurationString.split(':').forEach(function (i) {
      numberArray.push(i);
   });
   // Add trailing zero for MS
   numberArray.push(0);
   // pad front of moment
   numberArray = [ 0, 0, 0, 0, 0, 0, 0 ].slice(numberArray.length).concat(numberArray);

   return moment(numberArray);
};