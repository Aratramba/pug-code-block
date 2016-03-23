'use strict';
/* global require */

var byLine = require('../index').byLine;

console.log(byLine(`
    //- @pugdoc
    | foo


  //- @pugdoc
    example: |
      foo

  | foo
| test
`, 1));