'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var getCodeBlockBeforeBlockAtLine = require('../index').getCodeBlockBeforeBlockAtLine;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');


test('Before block at line', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 6);
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'Before block at line should return the previous code block with the same indent');
  assert.end();
});

test('Before block at line', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 36);
  var expected = '  div\n    | foo\n    | faa';

  assert.equal(actual, expected, 'Before block at line should return the previous code block with the same indent');
  assert.end();
});

test('Before block at line: none', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 12);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string if there is no match.');
  assert.end();
});

test('Before block at line: linenumber less than 0', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string if linenumber is less than 1.');
  assert.end();
});

test('Before block at line: linenumber 1', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 1);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string.');
  assert.end();
});

test('Before block at line: linenumber out of range', function(assert){
  var actual = getCodeBlockBeforeBlockAtLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});