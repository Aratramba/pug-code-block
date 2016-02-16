'use strict';
/* global require */

var test = require('tape');
var fs = require('fs');
var byLine = require('../index').byLine;

var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');

test('Jade output', function(assert){
  var block = byLine(source, 18);
  var jade = require('jade');
  var actual = jade.compile(block, {pretty:false})();
  var expected = '<div>foo<div> \nfaa</div></div>';

  assert.equal(actual, expected, 'Given jade input it should produce html.');
  assert.end();
});