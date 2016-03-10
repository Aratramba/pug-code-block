'use strict';
/* global require */

var byLine = require('../index').byLine;
var byString = require('../index').byString;
var fs = require('fs');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

// var arr = byLine(source, 5);
var arr = byLine('//-\n  foo:\n  arguments:\n    - {string} str1 - my string\n    - {string} str2 - my string\n');
// var arr = byLine(source, 3);
// var arr = byLine(source, 57);
console.log(arr);