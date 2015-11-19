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
    if(getIndentLevel(lines[i]) <= indent){
      break;
    }

    block.push(lines[i]);
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
  var index = null;

  // find line
  for(; i<l; ++i){
    if(lines[i].indexOf(string) > -1){
      index = i;
      break;
    }
  }

  // no matches found
  if(index === null){
    return '';
  }

  return byLine(src, index + 1);
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


module.exports = {
  byLine: byLine,
  byString: byString,
  afterBlockAtLine: afterBlockAtLine,
  beforeBlockAtLine: beforeBlockAtLine
};