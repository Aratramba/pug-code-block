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

  var indent = lines[lineNumber].match(WHITESPACE_REGEX)[0].length;
  var block = [lines[lineNumber]];
  var i = lineNumber;

  // remove first indent to comply with jade compiler
  block[0] = block[0].trim();

  while(++i){

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

  return block.join('\n');
}


/**
 * get code block by line
 */

function byLine(src, lineNumber){
  return getCodeBlock(src, lineNumber);
}


/**
 * find lineNumber of string
 */

function findStringIndex(src, string){
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
  return index;
}


/**
 * get code block by string
 */

function byString(src, string){
  var index = findStringIndex(src, string);

  // no matches found
  if(!index){
    return '';
  }

  return byLine(src, index + 1);
}



module.exports = {
  byLine: byLine,
  byString: byString
};

var fs = require('fs');
var source = fs.readFileSync('./test/fixtures/doc.jade', 'utf8');
byLine(source, 1);