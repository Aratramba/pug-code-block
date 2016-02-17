// 'use strict';
// /* global require */

// var normalize = require('../index').normalize;

// var lines = '  a(href=""\ntitle=""\n)\n    | foo'.split('\n');

// console.log(lines.join('\n'));
// console.log(normalize(lines).join('\n'))
// console.log('a(href=""\ntitle=""\n)\n  | foo');




// var test = require('tape');
// test('Normalize outdented attributes', function(assert){
//   var actual = normalize(lines).join('\n');
//   var expected = 'a(href=""\ntitle=""\n)\n  | foo';

//   assert.equal(actual, expected, 'Normalize should work with outdented attributes');
//   assert.end();
// });