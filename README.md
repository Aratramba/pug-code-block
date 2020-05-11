# Pug code block
Get Pug code at and inside a given line or query.


_doc.pug_
```pug
doctype html
html
  head
    title my pug template
  body
    h1 Hello #{name}
    p foo
```

### Get block at line number
Will return a string for a single match, an array of code blocks for multiple matches.

```js
const source = fs.readFileSync('./doc.pug', 'utf8');

const getCodeBlock = require('pug-code-block');
getCodeBlock.byLine(source, 2);

// head
//   title my pug template
```

Optionally provide a limit of blocks to be captured. Default limit is 1. Use `Infinity` if you want to capture all blocks.

```js
const source = fs.readFileSync('./doc.pug', 'utf8');

const getCodeBlock = require('pug-code-block');
getCodeBlock.byLine(source, 1, 3);

// div yep
// div yep
// div yep
// div nope
// div nope
```


### Get block at string match
Will return a string for a single match, an array of code blocks for multiple matches. Arguments can be a string or regex.

```js
const source = fs.readFileSync('./doc.pug', 'utf8');

const getCodeBlock = require('pug-code-block');
getCodeBlock.byString(source, 'body');

// body
//   h1 Hello #{name}
//   p foo
```

```js
const source = fs.readFileSync('./doc.pug', 'utf8');

const getCodeBlock = require('pug-code-block');
getCodeBlock.byString(source, /body/);

// body
//   h1 Hello #{name}
//   p foo
```