const lex = require("pug-lexer");
const rebaseIndent = require("rebase-indent");
const detectIndent = require("detect-indent");

/**
 * get code block starting at line
 * and ending at indent mismatch
 */

function getCodeBlockEnd(src) {
  src = rebaseIndent(src, 0, true);

  src = src.join("\n");
  src += "\n| eos";
  const tokens = lex(src);
  let end = 0;

  let i = 0;
  let indents = 0;
  let pipeless = 0;
  let attributes = 0;
  let token;
  let isReset;

  while ((token = tokens[i++])) {
    // increase for indent
    if (token.type === "indent") {
      indents++;

      // decrease for outdent
    } else if (token.type === "outdent") {
      indents--;

      // increase for pipeless text
    } else if (token.type === "start-pipeless-text") {
      pipeless++;

      // increase for pipeless text
    } else if (token.type === "end-pipeless-text") {
      pipeless--;

      // increase for pipeless text
    } else if (token.type === "start-attributes") {
      attributes++;

      // increase for pipeless text
    } else if (token.type === "end-attributes") {
      attributes--;
    }

    end = token.loc.end.line;

    isReset = Boolean(indents === 0 && pipeless === 0 && attributes === 0);

    // quit at indent match
    if (
      i > 1 &&
      isReset &&
      (token.type === "newline" || token.type === "outdent")
    ) {
      break;
    }
  }

  return end;
}

module.exports.getCodeBlockEnd = getCodeBlockEnd;

/**
 * create smaller portion from line number to end
 */

function slice(src, lineNumber) {
  let lines = src.split("\n");

  if (lineNumber <= 0 || lineNumber > lines.length) {
    return "";
  }

  // create smaller portion from line number to end
  lines = lines.slice(lineNumber - 1);

  // append newline
  lines.push("\n");

  return lines;
}

/**
 * remove empty lines from the start / end
 */

function trim(lines) {
  if (lines.length) {
    let j = lines.length;
    while (--j) {
      if (lines[j].trim() === "") {
        lines.pop();
        continue;
      }
      break;
    }

    let i = 0;
    while (i < lines.length) {
      if (lines[i].trim() === "") {
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
 * get code block by string or regex
 */

function byString(src, needle) {
  const lines = src.split("\n");
  let i = 0;
  const l = lines.length;

  let matches = [];

  // find line
  let match;
  for (; i < l; ++i) {
    match = false;
    if (needle instanceof RegExp) {
      if (needle.test(lines[i])) {
        match = true;
      }
    } else {
      if (lines[i].indexOf(needle) > -1) {
        match = true;
      }
    }

    if (match) {
      matches.push(byLine(src, i + 1));
    }
  }

  if (!matches.length) {
    return "";
  }

  if (matches.length === 1) {
    return matches[0];
  }

  return matches;
}

module.exports.byString = byString;

/**
 * get code block(s) after line
 */

function byLine(src, lineNumber, limit) {
  let lines = slice(src, lineNumber);

  if (!lines.length) {
    return "";
  }

  // no idea why anyone would do this
  if (limit < 1) {
    return "";
  }

  limit = limit || 1;
  const blocks = [];
  let blockEnd;
  let nextBlock;

  lines = trim(lines);

  const indentLevel = detectIndent(lines[0]).indent.length;
  let nextBlockIndentLevel;

  for (let i = 0; i < limit; i++) {
    if (blockEnd) {
      lines = lines.slice(blockEnd - 1);
    }

    // remove empty lines from start / end
    lines = trim(lines);

    // get end of code block
    blockEnd = getCodeBlockEnd(lines);

    // get the block we need
    nextBlock = lines.slice(0, blockEnd - 1);

    if (!nextBlock.length) {
      break;
    }

    nextBlockIndentLevel = detectIndent(nextBlock[0]).indent.length;
    if (nextBlockIndentLevel < indentLevel) {
      break;
    }

    // remove newlines from end
    nextBlock = trim(nextBlock);

    // normalize block
    nextBlock = rebaseIndent(nextBlock);

    // stringify
    nextBlock = nextBlock.join("\n");

    // push
    blocks.push(nextBlock);

    // blocks.push(nextBlock);
    if (nextBlock.trim() === "") {
      break;
    }
  }

  if (blocks.length === 0) {
    return "";
  }

  if (blocks.length === 1) {
    return blocks[0];
  }

  return blocks;
}

module.exports.byLine = byLine;
