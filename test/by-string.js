'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var byString = require('../index').byString;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');


test('By string: mixin bar', function(assert){
  var actual = byString(source, 'mixin bar');
  var expected = [ 'mixin bar\n  div\n    | bar\n    | bar', 'mixin bar\n  div\n    | bar 2\n\n    \n    | bar 2' ];

  assert.deepEqual(actual, expected, 'Searching for "mixin bar" should return an array with two complete mixins.');
  assert.end();
});

test('By string: div', function(assert){
  var actual = byString(source, 'div').length;
  var expected = 9;

  assert.deepEqual(actual, expected, 'Searching for "div" should return an array.');
  assert.end();
});

test('By string: head', function(assert){
  var actual = byString(source, 'head');
  var expected = 'head\n  title my jade template';

  assert.deepEqual(actual, expected, 'Searching for "head" should return a string.');
  assert.end();
});

test('By string: not found', function(assert){
  var actual = byString(source, 'whatever');
  var expected = '';

  assert.equal(actual, expected, 'Searching for "whatever" should return an empty string.');
  assert.end();
});

test('By string: first line', function(assert){
  var actual = byString(source, 'mixin foo');
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'Searching for "mixin foo" should return a complete mixin.');
  assert.end();
});