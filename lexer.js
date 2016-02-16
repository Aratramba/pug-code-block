'use strict';
/* global require */

var lex = require('pug-lexer');
var assert = require('assert');



/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlockEnd(src) {
  var tokens = lex(src);
  var indent = 0;
  var end = 0;

  var i = 0;
  var token;

  while (token = tokens[i++]) {

    // increase for indent
    if (token.type === 'indent') {
      indent++;

    // decrease for outdent
    } else if (token.type === 'outdent') {
      indent--;

    // increase for pipeless text
    } else if (token.type === 'start-pipeless-text') {
      indent++;
    
    // increase for pipeless text
    } else if (token.type === 'end-pipeless-text') {
      indent--;
    }

    end = token.line;

    // quit at indent match
    if (i > 1 && indent === 0) {
      break;
    }
  }

  return end;
}


/**
 * Get code block
 */

function getCodeBlock(src, lineNumber) {

  var lines = src.split('\n');

  if(lineNumber <= 0 || lineNumber > lines.length){
    return '';
  }

  // create smaller portion from line number to end
  lines = lines.slice(lineNumber - 1);

  // add final newline
  lines.push('\n');

  // get end of block
  var blockEnd = getCodeBlockEnd(lines.join('\n'));

  // get the block we need
  lines = lines.slice(0, blockEnd - 1);

  // remove empty lines at the end
  var j = lines.length;
  while(--j){
    if(lines[j].trim() === '') {
      lines.pop();
      continue;
    }
    break;
  }

  return lines.join('\n');
}


var source = require('fs').readFileSync('./test/fixtures/doc2.jade', 'utf8');
assert.equal(getCodeBlock(source, 1), 'mixin foo\n  div\n    | 1\n    | 2\n  div 3');
assert.equal(getCodeBlock(source, 7), '| 4');
assert.equal(getCodeBlock(source, 9), '//- some comment');
assert.equal(getCodeBlock(source, 11), 'div\n  | 5\n  div\n    | 6');

source = require('fs').readFileSync('./test/fixtures/doc.jade', 'utf8');
assert.equal(getCodeBlock(source, 28), '//- some comment\n  some indented comment\n  some indented comment');
assert.equal(getCodeBlock(source, 1), 'mixin foo\n  div\n    | foo\n    | foo');
assert.equal(getCodeBlock(source, 0), '');