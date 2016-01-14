'use strict';
/* global module */

var WHITESPACE_REGEX = /^\s*/g;


/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlock(src, lineNumber){
  lineNumber = lineNumber-1;
  var lines = src.split('\n');

  if(lineNumber < 0 || lineNumber > lines.length){
    return '';
  }

  var indent = getIndentLevel(lines[lineNumber]);
  var block = [lines[lineNumber]];
  var i = lineNumber;

  while(++i){

    // end of file
    if(typeof lines[i] === 'undefined'){
      break;
    }

    // indent match breaks
    if(lines[i].trim() !== ''){
      if(getIndentLevel(lines[i]) <= indent){
        break;
      }
    }

    block.push(lines[i]);
  }

  // remove empty lines from the end
  var j = block.length;
  while(--j){
    if(block[j].trim() === '') {
      block.pop();
      continue;
    }
    break;
  }

  return block.join('\n');
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
    lines[i] = lines[i].substring(indentLevel)
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