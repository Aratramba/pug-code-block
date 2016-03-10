'use strict';
/* global require, module */

var lex = require('pug-lexer');

var WHITESPACE_REGEX = /^\s*/g;


/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlockEnd(src) {
  src = normalize(src);
  src = src.join('\n');
  var tokens = lex(src);
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
 * Normalize indentation
 */

function normalize(lines) {
  lines = lines.slice(0);

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
  // lines = normalize(lines);

  return lines;
}


/**
 * remove empty lines from the start / end
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

    var i = 0;
    while(i < lines.length){
      if(lines[i].trim() === '') {
        lines.shift();
        continue;
      }
      break;
    }
    ++i;
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
      matches.push(getCodeBlock(src, i + 1));
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
 * get code block(s) after line
 */

function getCodeBlock(src, lineNumber, limit) {
  var lines = slice(src, lineNumber);

  if (!lines.length) {
    return '';
  }

  // no idea why anyone would do this
  if (limit === 0) {
    return '';
  }

  limit = limit || 1;
  var blocks = [];
  var blockEnd;
  var nextBlock;

  var indentLevel = getIndentLevel(lines[0]);
  var nextBlockIndentLevel;

  for(var i = 0; i < limit; i++) {
    if (blockEnd) {
      lines = lines.slice(blockEnd - 1);
    }

    lines = trim(lines);

    // get end of block
    blockEnd = getCodeBlockEnd(lines);

    // get the block we need
    nextBlock = lines.slice(0, blockEnd -1);

    if (!nextBlock.length) {
      break;
    }

    nextBlockIndentLevel = getIndentLevel(nextBlock[0]);
    if (nextBlockIndentLevel < indentLevel) {
      break;
    }

    // remove newlines from end
    nextBlock = trim(nextBlock);

    // normalize block
    nextBlock = normalize(nextBlock);

    // stringify
    nextBlock = nextBlock.join('\n');

    // push
    blocks.push(nextBlock);

    // blocks.push(nextBlock);
    if (nextBlock.trim() === '') {
      break;
    }
  }

  if (blocks.length === 1) {
    return blocks[0];
  }

  return blocks;
}

module.exports.getCodeBlock = getCodeBlock;
module.exports.byLine = getCodeBlock;