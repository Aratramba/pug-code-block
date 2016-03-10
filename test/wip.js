'use strict';
/* global require */

var getCodeBlock = require('../index').getCodeBlock;
var fs = require('fs');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

// var arr = getCodeBlock(source, 5);
var arr = getCodeBlock(source, 47, Infinity);
// var arr = getCodeBlock(source, 3);
// var arr = getCodeBlock(source, 57);
console.log(arr);