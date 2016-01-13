'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var getCodeBlock = require('../index.js');

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');


/**
 * By line
 */

test('By line', function(assert){
  var actual = getCodeBlock.byLine(source, 11);
  var expected = 'mixin baz\n  div\n    | baz\n    | baz';

  assert.equal(actual, expected, 'From line 11 block should equal a complete mixin.');
  assert.end();
});

test('By line: comment', function(assert){
  var actual = getCodeBlock.byLine(source, 28);
  var expected = '//- some comment\n  some indented comment\n  some indented comment';

  assert.equal(actual, expected, 'From line 28 block should equal comment block.');
  assert.end();
});

test('By line: line 1', function(assert){
  var actual = getCodeBlock.byLine(source, 1);
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'From line 1 block should equal mixin block.');
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


/**
 * By string
 */

test('By string', function(assert){
  var actual = getCodeBlock.byString(source, 'mixin bar');
  var expected = [ 'mixin bar\n  div\n    | bar\n    | bar', 'mixin bar\n  div\n    | bar 2\n\n    \n    | bar 2' ];

  assert.deepEqual(actual, expected, 'Searching for "mixin bar" should return an array with two complete mixins.');
  assert.end();
});

test('By string', function(assert){
  var actual = getCodeBlock.byString(source, 'div').length;
  var expected = 9;

  assert.deepEqual(actual, expected, 'Searching for "div" should return an array.');
  assert.end();
});

test('By string', function(assert){
  var actual = getCodeBlock.byString(source, 'head');
  var expected = '  head\n    title my jade template';

  assert.deepEqual(actual, expected, 'Searching for "head" should return a string.');
  assert.end();
});

test('By string: not found', function(assert){
  var actual = getCodeBlock.byString(source, 'whatever');
  var expected = '';

  assert.equal(actual, expected, 'Searching for "whatever" should return an empty string.');
  assert.end();
});

test('By string: first line', function(assert){
  var actual = getCodeBlock.byString(source, 'mixin foo');
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'Searching for "mixin foo" should return a complete mixin.');
  assert.end();
});


/**
 * Test jade output
 */

test('Jade output', function(assert){
  var block = getCodeBlock.byLine(source, 18);
  var jade = require('jade');
  var actual = jade.compile(block, {pretty:false})();
  var expected = '<div>foo<div> \nfaa</div></div>';

  assert.equal(actual, expected, 'Given jade input it should produce html.');
  assert.end();
});


/**
 * After block at line
 */

test('After block at line', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 6);
  var expected = 'mixin baz\n  div\n    | baz\n    | baz';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 33);
  var expected = '  div\n    | foo 2\n    | faa 2';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent');
  assert.end();
});

test('After block at line: none', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 20);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string if there is no match.');
  assert.end();
});

test('After block at line: linenumber less than 0', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});

test('After block at line: linenumber 1', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 1);
  var expected = 'mixin bar\n  div\n    | bar\n    | bar';

  assert.equal(actual, expected, 'After block at line should return the next code block with the same indent.');
  assert.end();
});

test('After block at line: linenumber out of range', function(assert){
  var actual = getCodeBlock.afterBlockAtLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'After block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});


/**
 * Before block at line
 */

test('Before block at line', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 6);
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'Before block at line should return the previous code block with the same indent');
  assert.end();
});

test('Before block at line', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 36);
  var expected = '  div\n    | foo\n    | faa';

  assert.equal(actual, expected, 'Before block at line should return the previous code block with the same indent');
  assert.end();
});

test('Before block at line: none', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 12);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string if there is no match.');
  assert.end();
});

test('Before block at line: linenumber less than 0', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string if linenumber is less than 1.');
  assert.end();
});

test('Before block at line: linenumber 1', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 1);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string.');
  assert.end();
});

test('Before block at line: linenumber out of range', function(assert){
  var actual = getCodeBlock.beforeBlockAtLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'Before block at line should return an empty string when linenumber doesnt exist.');
  assert.end();
});