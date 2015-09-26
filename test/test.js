'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var getCodeBlock = require('../index.js');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

test('By line', function(assert){
  var actual = getCodeBlock.byLine(source, 11);
  var expected = 'mixin baz\n  div\n    | baz\n    | baz';

  assert.equal(actual, expected, 'From line 11 block should equal a complete mixin.');
  assert.end();
});

test('By line: linenumber less than 0', function(assert){
  var actual = getCodeBlock.byLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'Line 0 should return an empty string.');
  assert.end();
});

test('By line: linenumber out of range', function(assert){
  var actual = getCodeBlock.byLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'Line 100 should return an empty string.');
  assert.end();
});

test('By string', function(assert){
  var actual = getCodeBlock.byString(source, 'mixin bar');
  var expected = 'mixin bar\n  div\n    | bar\n    | bar';

  assert.equal(actual, expected, 'Searching for "mixin bar" should return a complete mixin.');
  assert.end();
});

test('By string: not found', function(assert){
  var actual = getCodeBlock.byString(source, 'whatever');
  var expected = '';

  assert.equal(actual, expected, 'Searching for "whatever" should return an empty string.');
  assert.end();
});

test('Jade output', function(assert){
  var block = getCodeBlock.byLine(source, 18);
  var jade = require('jade');
  var actual = jade.compile(block, {pretty:false})();
  var expected = '<div>foo<div> \nfaa</div></div>';

  assert.equal(actual, expected, 'Given jade input it should produce html.');
  assert.end();
});

test('From line to line', function(assert){
  var actual = getCodeBlock.fromLineToLine(source, 1, 9);
  var expected = 'mixin foo\n  div\n    | foo\n    | foo\n\nmixin bar\n  div\n    | bar\n    | bar';

  assert.equal(actual, expected, 'Given two lines, it should produce all lines from start up to and including end.');
  assert.end();
});

test('From string to string', function(assert){
  var actual = getCodeBlock.fromStringToString(source, 'mixin bar','//- some comment');
  var expected = 'mixin bar\n  div\n    | bar\n    | bar\n\nmixin baz\n  div\n    | baz\n    | baz\n\n//- some comment';

  assert.equal(actual, expected, 'Given two strings, it should produce all lines from the first up to and including the last string.');
  assert.end();
});

test('From string to string: not found', function(assert){
  var actual = getCodeBlock.fromStringToString(source, 'mixin foo','whatever');
  var expected = '';

  assert.equal(actual, expected, 'When no match is found for string 1, it should return an empty string.');
  assert.end();
});

test('From string to string: not found', function(assert){
  var actual = getCodeBlock.fromStringToString(source, 'whatever','mixin foo');
  var expected = '';

  assert.equal(actual, expected, 'When no match is found for string 2, it should return an empty string.');
  assert.end();
});