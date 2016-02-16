'use strict';
/* global require, module */

var lex = require('pug-lexer');

var WHITESPACE_REGEX = /^\s*/g;

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


/**
 * Get indent level of line
 */

function getIndentLevel(line){
  return line.match(WHITESPACE_REGEX)[0].length;
}



/**
 * get code block by line
 */

function byLine(src, lineNumber){
  return getCodeBlock(src, lineNumber);
}


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


/**
 * Get code block after code block at line
 */

function afterBlockAtLine(src, lineNumber){
  var lines = src.split('\n');

  // bail at last line
  if(lineNumber <= 0 || lineNumber >= lines.length){
    return '';
  }

  var indent = getIndentLevel(lines[lineNumber-1]);
  var i = lineNumber-1;
  var currentIndent;

  while(++i){

    if(typeof lines[i] === 'undefined'){
      break;
    }

    currentIndent = getIndentLevel(lines[i]);

    if(lines[i].trim() !== ''){
      if(currentIndent < indent){
        break;
      }

      if(currentIndent === indent){
        return getCodeBlock(src, i + 1);
      }
    }
  }

  return '';
}


/**
 * Get code block before code block at line
 */

function beforeBlockAtLine(src, lineNumber){
  var lines = src.split('\n');

  // bail at first line
  if(lineNumber <= 0 || lineNumber >= lines.length){
    return '';
  }

  var indent = getIndentLevel(lines[lineNumber-1]);
  var i = lineNumber-1;
  var currentIndent;

  while(i--){

    if(typeof lines[i] === 'undefined'){
      break;
    }

    currentIndent = getIndentLevel(lines[i]);

    if(lines[i].trim() !== ''){
      if(currentIndent < indent){
        break;
      }

      if(currentIndent === indent){
        return getCodeBlock(src, i + 1);
      }
    }
  }

  return '';
}


/**
 * Normalize indentation
 */

function normalize(src) {
  var lines = src.split('\n');
  var indentLevel = getIndentLevel(lines[0]);

  if(indentLevel === 0){
    return src;
  }

  var i = 0;
  var l = lines.length;
  for(; i<l; ++i){
    lines[i] = lines[i].substring(indentLevel);
  }
  return lines.join('\n');
}


module.exports = {
  byLine: byLine,
  byString: byString,
  afterBlockAtLine: afterBlockAtLine,
  beforeBlockAtLine: beforeBlockAtLine,
  normalize: normalize
};