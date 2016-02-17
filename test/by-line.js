'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var byLine = require('../index').byLine;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');



test('By line', function(assert){
  var actual = byLine(source, 11);
  var expected = 'mixin baz\n  div\n    | baz\n    | baz';

  assert.equal(actual, expected, 'From line 11 block should equal a complete mixin.');
  assert.end();
});

test('By line: comment', function(assert){
  var actual = byLine(source, 28);
  var expected = '//- some comment\n  some indented comment\n  some indented comment';

  assert.equal(actual, expected, 'From line 28 block should equal comment block.');
  assert.end();
});

test('By line: line 1', function(assert){
  var actual = byLine(source, 1);
  var expected = 'mixin foo\n  div\n    | foo\n    | foo';

  assert.equal(actual, expected, 'From line 1 block should equal mixin block.');
  assert.end();
});

test('By line: linenumber less than 0', function(assert){
  var actual = byLine(source, 0);
  var expected = '';

  assert.equal(actual, expected, 'Line 0 should return an empty string.');
  assert.end();
});

test('By line: linenumber out of range', function(assert){
  var actual = byLine(source, 100);
  var expected = '';

  assert.equal(actual, expected, 'Line 100 should return an empty string.');
  assert.end();
});

test('By line: weird attributes indentation', function(assert){
  var actual = byLine(source, 47);
  var expected = 'p\n  a(href="",\ntitle=""\n)\n    | foo';

  assert.equal(actual, expected, 'should work with funny looking attributes');
  assert.end();
});