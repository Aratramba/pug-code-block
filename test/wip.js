'use strict';
/* global require */

var byLine = require('../index').byLine;
var fs = require('fs');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

// var arr = byLine(source, 5);
var arr = byLine(source, 47, Infinity);
// var arr = byLine(source, 3);
// var arr = byLine(source, 57);
console.log(arr);