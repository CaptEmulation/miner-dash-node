/**
 * Created by jdean on 11/23/13.
 */


var connect = require('connect');
var path = require('path');
var oneDay = 86400000;

exports.staticServerHandler = connect().use(connect.static(path.join(__dirname, '/..'), { maxAge: oneDay })).use(connect.static(path.join(__dirname, '/../../css'), { maxAge: oneDay }));

