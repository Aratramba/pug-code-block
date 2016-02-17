'use strict';
/* global require, module */

var lex = require('pug-lexer');

var WHITESPACE_REGEX = /^\s*/g;


/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlockEnd(src) {
  var tokens = lex(src);
  var indent = 0;
  var end = 0;

  var i = 0;
  var indents = 0;
  var pipeless = 0;
  var attributes = 0;
  var token;

  while (token = tokens[i++]) {

    // increase for indent
    if (token.type === 'indent') {
      indents++;

    // decrease for outdent
    } else if (token.type === 'outdent') {
      indents--;

    // increase for pipeless text
    } else if (token.type === 'start-pipeless-text') {
      pipeless++;
    
    // increase for pipeless text
    } else if (token.type === 'end-pipeless-text') {
      pipeless--;
    
    // increase for pipeless text
    } else if (token.type === 'start-attributes') {
      attributes++;
    
    // increase for pipeless text
    } else if (token.type === 'end-attributes') {
      attributes--;
    }

    end = token.line;

    var isReset = Boolean(indents === 0 && pipeless === 0 && attributes === 0);

    // quit at indent match
    if (i > 1 && isReset) {
      break;
    }
  }

  return end;
}

module.exports.getCodeBlockEnd = getCodeBlockEnd;



/**
 * Get code block
 */

function getCodeBlock(src, lineNumber) {
  var lines = slice(src, lineNumber);

  if (!lines.length) {
    return '';
  }

  // get end of block
  var blockEnd = getCodeBlockEnd(lines.join('\n'));

  // get the block we need
  console.log(lines);
  lines = lines.slice(0, blockEnd - 1);
  console.log(lines);

  // remove newlines from end
  lines = trim(lines);

  return lines.join('\n');
}

module.exports.getCodeBlock = getCodeBlock;



/**
 * Normalize indentation
 */

function normalize(lines) {
  if (!lines.length) {
    return lines;
  }

  var indentLevel = getIndentLevel(lines[0]);

  if(indentLevel === 0){
    return lines;
  }

  var i = 0;
  var l = lines.length;
  for(; i<l; ++i){
    if (getIndentLevel(lines[i]) >= indentLevel) {
      lines[i] = lines[i].substring(indentLevel);
    }
  }
  return lines;
}

module.exports.normalize = normalize;



/**
 * create smaller portion from line number to end
 */

function slice(src, lineNumber) {
  var lines = src.split('\n');

  if(lineNumber <= 0 || lineNumber > lines.length){
    return '';
  }

  // create smaller portion from line number to end
  lines = lines.slice(lineNumber - 1);

  // append newline
  lines.push('\n');

  // reset base indent
  lines = normalize(lines);

  return lines;
}


/**
 * remove empty lines from the end
 */

function trim(lines) {
  if (lines.length) {
    var j = lines.length;
    while(--j){
      if(lines[j].trim() === '') {
        lines.pop();
        continue;
      }
      break;
    }
  }
  return lines;
}



/**
 * Get indent level of line
 */

function getIndentLevel(line){
  return line.match(WHITESPACE_REGEX)[0].length;
}

module.exports.getIndentLevel = getIndentLevel;



/**
 * get code block by line
 */

function byLine(src, lineNumber){
  return getCodeBlock(src, lineNumber);
}

module.exports.byLine = byLine;



/**
 * get code block by string
 */

function byString(src, string){
  var lines = src.split('\n');
  var i = 0;
  var l = lines.length;

  var matches = [];

  // find line
  for(; i<l; ++i){
    if(lines[i].indexOf(string) > -1){
      matches.push(byLine(src, i + 1));
    }
  }

  if(!matches.length){
    return '';
  }

  if(matches.length === 1){
    return matches[0];
  }

  return matches;
}

module.exports.byString = byString;



/**
 * get code block after line
 */

function getCodeBlockAfterBlockAtLine(src, lineNumber) {
  var lines = slice(src, lineNumber);

  if (!lines.length) {
    return '';
  }

  // get end of block
  var blockEnd = getCodeBlockEnd(lines.join('\n'));

  // get the block we need
  var nextBlock = getCodeBlock(lines.join('\n'), blockEnd);

  // remove newlines from end
  nextBlock = trim(nextBlock);

  return nextBlock;
}

module.exports.getCodeBlockAfterBlockAtLine = getCodeBlockAfterBlockAtLine;