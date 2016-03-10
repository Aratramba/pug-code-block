'use strict';
/* global require */

var getCodeBlock = require('../index').getCodeBlock;
var fs = require('fs');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

var arr = getCodeBlock(source, 33, 5);
console.log(arr);