'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var byLine = require('../index').byLine;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');


/**
 * Test line numbers
 */

test('By line', function(assert){
  var actual, expected;
  
  actual = byLine(source, 1);
  expected = 'mixin foo\n  div\n    | foo\n    | foo';
  assert.equal(actual, expected, 'should be code block at line 1');
  
  actual = byLine(source, 5);
  expected = 'mixin bar\n  div\n    | bar\n    | bar';
  assert.equal(actual, expected, 'should be code block at line 5, after space');
  
  actual = byLine(source, 6);
  expected = 'mixin bar\n  div\n    | bar\n    | bar';
  assert.equal(actual, expected, 'should be code block at line 6');
  
  actual = byLine(source, 11);
  expected = 'mixin baz\n  div\n    | baz\n    | baz';
  assert.equal(actual, expected, 'should be code block at line 11');
  
  actual = byLine(source, 16);
  expected = '//- some comment';
  assert.equal(actual, expected, 'should be code block at line 16');
  
  actual = byLine(source, 18);
  expected = 'div\n  | foo\n  div \n    | faa';
  assert.equal(actual, expected, 'should be code block at line 18');
  
  actual = byLine(source, 23);
  expected = 'html\n  head\n    title my jade template\n  body';
  assert.equal(actual, expected, 'should be code block at line 23');
  
  actual = byLine(source, 24);
  expected = 'head\n  title my jade template';
  assert.equal(actual, expected, 'should be code block at line 24');
  
  actual = byLine(source, 28);
  expected = '//- some comment\n  some indented comment\n  some indented comment';
  assert.equal(actual, expected, 'should be code block at line 28');
  
  actual = byLine(source, 91);
  expected = '- var attrs = {foo: \'bar\', bar: \'<baz>\'}';
  assert.equal(actual, expected, 'should be code block at line 91');

  assert.end();
});


/**
 * Test file bounds
 */

test('By line out of bounds', function(assert){
  var actual, expected;
  
  actual = byLine(source, 0);
  expected = '';
  assert.equal(actual, expected, 'should be empty at line 1');
  
  actual = byLine(source, -10);
  expected = '';
  assert.equal(actual, expected, 'should be empty at line -10');
  
  actual = byLine(source, 1000);
  expected = '';
  assert.equal(actual, expected, 'should be empty at line 100');

  assert.end();
});


/**
 * Limits
 */

test('By line with limit', function(assert){
  var actual, expected;

  actual = byLine(source, 1, 0);
  expected = '';
  assert.equal(actual, expected, 'should be an empty string');

  actual = byLine(source, 1, 1);
  expected = 'mixin foo\n  div\n    | foo\n    | foo';
  assert.equal(actual, expected, 'should be a string with one result');

  actual = byLine(source, 1, 2);
  expected = ['mixin foo\n  div\n    | foo\n    | foo', 'mixin bar\n  div\n    | bar\n    | bar'];
  assert.deepEqual(actual, expected, 'should be an array');

  actual = byLine(source, 1, 3);
  expected = ['mixin foo\n  div\n    | foo\n    | foo', 'mixin bar\n  div\n    | bar\n    | bar', 'mixin baz\n  div\n    | baz\n    | baz'];
  assert.deepEqual(actual, expected, 'should be an array');

  actual = byLine(source, 1, Infinity).length;
  expected = 37;
  assert.equal(actual, expected, 'should be an array containing all elements');
 
  actual = byLine(source, 33, 5).length;
  expected = 2;
  assert.deepEqual(actual, expected, 'should not capture blocks with less indentation');
  
  actual = byLine(source, 71, 2);
  expected = ['a(foo=\'((foo))\', bar= (1) ? 1 : 0 )', 'select\n  option(value=\'foo\', selected) Foo\n  option(selected, value=\'bar\') Bar'];
  assert.deepEqual(actual, expected, 'should be code block at line 71');

  assert.end();
});


/**
 * Weird attribute indentation
 */

test('By line: weird attributes indentation', function(assert){
  var actual, expected;

  actual = byLine(source, 47);
  expected = 'p\n  a(href="",\ntitle=""\n)\n    | foo';
  assert.equal(actual, expected, 'should work with funny looking attributes');

  actual = byLine(source, 56);
  expected = 'foo(abc,\n    def)';
  assert.equal(actual, expected, 'should work with funny looking attributes');

  actual = byLine(source, 60);
  expected = 'foo(abc\n    ,def)';
  assert.equal(actual, expected, 'should work with funny looking attributes');

  actual = byLine(source, 62);
  expected = 'foo(abc\n    def)\n  foo(abc\n      def)';
  assert.equal(actual, expected, 'should work with funny looking attributes');

  assert.end();
});