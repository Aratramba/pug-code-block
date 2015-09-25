'use strict';
/* global module, require */

var WHITESPACE_REGEX = /^\s*/g;


/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlock(src, lineNumber, separator){
  lineNumber = lineNumber-1;
  var lines = src.split('\n');

  if(lineNumber < 0){
    return '';
  }

  if(lineNumber > lines.length){
    return '';
  }

  var indent = lines[lineNumber].match(WHITESPACE_REGEX)[0].length;
  var block = [lines[lineNumber]];
  var i = lineNumber + 1;

  while(i++){

    // end of file
    if(typeof lines[i] === 'undefined'){
      break;
    }

    // indent match breaks
    if(lines[i].match(WHITESPACE_REGEX)[0].length <= indent){
      break;
    }

    block.push(lines[i]);
  }

  return block.join(separator || '\n');
}


/**
 * get code block by line
 */

function byLine(src, lineNumber, separator){
  return getCodeBlock(src, lineNumber, separator);
}


/**
 * get code block by string
 */

function byString(src, string, separator){
  var lines = src.split('\n');
  var i = 0;
  var l = lines.length;
  var cursor = null;

  // find line
  for(; i<l; ++i){
    if(lines[i].indexOf(string) > -1){
      cursor = i;
      break;
    }
  }

  // no matches found
  if(!cursor){
    return '';
  }

  return byLine(src, cursor + 1, separator);
}

module.exports = {
  byLine: byLine,
  byString: byString
};