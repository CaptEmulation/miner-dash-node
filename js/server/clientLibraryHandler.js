/**
 * Created by jdean on 11/23/13.
 */


var express = require('express');
var mime = require('mime');
var path = require('path');
var oneDay = 86400000;

exports.staticServerHandler = express().use(express.static(path.join(__dirname, '/..'), { maxAge: oneDay })).use(express.static(path.join(__dirname, '/../../css'), { maxAge: oneDay }));


