'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var getCodeBlockAfterBlockAtLine = require('../index').getCodeBlockAfterBlockAtLine;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');


test('After block at line', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 6);
  var expected = 'mixin baz\n  div\n    | baz\n    | baz';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 33);
  var expected = 'div\n  | foo 2\n  | faa 2';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 47);
  var expected = '| faa';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 24);
  var expected = 'body';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line: none', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 53);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string if there is no match.');
  assert.end();
});

test('After block at line: none', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 20);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string if there is no match.');
  assert.end();
});

test('After block at line: linenumber less than 0', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});

test('After block at line: linenumber 1', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 1);
  var expected = 'mixin bar\n  div\n    | bar\n    | bar';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent.');
  assert.end();
});

test('After block at line: linenumber out of range', function(assert){
  var actual = getCodeBlockAfterBlockAtLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});