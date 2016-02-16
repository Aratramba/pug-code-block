'use strict';
/* global require */

var test = require('tape');
var normalize = require('../index').normalize;


test('Normalize', function(assert){
  var actual = normalize(['  div','    div','      div','        p foo']);
  var expected = ['div','  div','    div','      p foo'];

  assert.deepEqual(actual, expected, 'Normalize should reset indents to its base level');
  assert.end();
});

test('Normalize ignore', function(assert){
  var actual = normalize(['div','  div','    div','      p foo']);
  var expected = ['div','  div','    div','      p foo'];

  assert.deepEqual(actual, expected, 'Normalize should not reset anything');
  assert.end();
});

test('Normalize empty', function(assert){
  var actual = normalize([]);
  var expected = [];

  assert.deepEqual(actual, expected, 'Normalize should return empty array');
  assert.end();
});

test('Normalize tab', function(assert){
  var actual = normalize([' div','    div','      div']);
  var expected = ['div','   div','     div'];

  assert.deepEqual(actual, expected, 'Normalize should reset indents if they are tabs');
  assert.end();
});
