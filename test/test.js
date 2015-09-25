'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var getCodeBlock = require('../index.js');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

test('by line', function(assert){
  var block = getCodeBlock.byLine(source, 11, '>>');
  assert.equal(block, 'mixin baz>>    | baz>>    | baz');
  assert.end();
});

test('by line less than 0', function(assert){
  var block = getCodeBlock.byLine(source, 0, '>>');
  assert.equal(block, '');
  assert.end();
});

test('by line out of range', function(assert){
  var block = getCodeBlock.byLine(source, 30, '>>');
  assert.equal(block, '');
  assert.end();
});

test('by string', function(assert){
  var block = getCodeBlock.byString(source, 'mixin bar', '>>');
  assert.equal(block, 'mixin bar>>    | bar>>    | bar');
  assert.end();
});

test('by string not found', function(assert){
  var block = getCodeBlock.byString(source, 'whatever', '>>');
  assert.equal(block, '');
  assert.end();
});