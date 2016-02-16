'use strict';
/* global require */

var lex = require('pug-lexer');
var assert = require('assert');



var source = require('fs').readFileSync('./test/fixtures/doc2.jade', 'utf8');



/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlockEnd(src) {
  var tokens = lex(src);
  var indent = 0;
  var end = 0;

  var i = -1;
  var l = tokens.length;
  var token;

  while (i++ < l) {
    token = tokens[i];

    // increase for indent
    if (token.type === 'indent') {
      indent++;

    // decrease for outdent
    } else if (token.type === 'outdent') {
      indent--;
    }

    end = token.line;
    
    // quit at indent match
    if (i > 0 && indent === 0) {
      break;
    }

    // quit
    if (i > 0 && token.line === tokens[0].line) {
      break;
    }
  }

  return end;
}


/**
 * Get code block
 */

function getCodeBlock(src, lineNumber) {
  var lines = src.split('\n').slice(lineNumber - 1);
  var blockEnd = getCodeBlockEnd(lines.join('\n'));
  lines = lines.slice(0, blockEnd - 1);

  return lines.join('\n');
}



assert.equal(getCodeBlock(source, 1), 'mixin foo\n  div\n    | foo\n    | foo\n  div foo\n');
assert.equal(getCodeBlock(source, 7), '|   end\n');
assert.equal(getCodeBlock(source, 9), '//- some comment\n');
assert.equal(getCodeBlock(source, 11), 'div\n  | foo\n  div \n    | faa\n');