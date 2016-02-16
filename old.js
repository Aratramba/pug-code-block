'use strict';
/* global require, module */




/**
 * Get code block after code block at line
 */

// function afterBlockAtLine(src, lineNumber){
//   var lines = src.split('\n');

//   // bail at last line
//   if(lineNumber <= 0 || lineNumber >= lines.length){
//     return '';
//   }

//   var indent = getIndentLevel(lines[lineNumber-1]);
//   var i = lineNumber-1;
//   var currentIndent;

//   while(++i){

//     if(typeof lines[i] === 'undefined'){
//       break;
//     }

//     currentIndent = getIndentLevel(lines[i]);

//     if(lines[i].trim() !== ''){
//       if(currentIndent < indent){
//         break;
//       }

//       if(currentIndent === indent){
//         return getCodeBlock(src, i + 1);
//       }
//     }
//   }

//   return '';
// }


// *
//  * Get code block before code block at line
 

// function beforeBlockAtLine(src, lineNumber){
//   var lines = src.split('\n');

//   // bail at first line
//   if(lineNumber <= 0 || lineNumber >= lines.length){
//     return '';
//   }

//   var indent = getIndentLevel(lines[lineNumber-1]);
//   var i = lineNumber-1;
//   var currentIndent;

//   while(i--){

//     if(typeof lines[i] === 'undefined'){
//       break;
//     }

//     currentIndent = getIndentLevel(lines[i]);

//     if(lines[i].trim() !== ''){
//       if(currentIndent < indent){
//         break;
//       }

//       if(currentIndent === indent){
//         return getCodeBlock(src, i + 1);
//       }
//     }
//   }

//   return '';
// }





module.exports = {
  byLine: byLine,
  byString: byString,
  // afterBlockAtLine: afterBlockAtLine,
  // beforeBlockAtLine: beforeBlockAtLine,
};