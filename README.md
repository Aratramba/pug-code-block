# Pug code block
Get Pug (Jade) code at and inside a given line or query.


_doc.jade_
```jade
doctype html
html
  head
    title my jade template
  body
    h1 Hello #{name}
    p foo
```

### Get block at line number
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('pug-code-block');
getCodeBlock.byLine(source, 3);

// head
//   title my jade template
```

### Get block at string match
Will return a string for a single match, an array of code blocks for multiple matches.

```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('pug-code-block');
getCodeBlock.byString(source, 'body');

// body
//   h1 Hello #{name}
//   p foo
```

### Get block after block at line
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('pug-code-block');
getCodeBlock.afterBlockAtLine(source, 3);

//  body
//    h1 Hello #{name}
//    p foo
```

### Get block before block at line
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('pug-code-block');
getCodeBlock.beforeBlockAtLine(source, 5);

//  head
//    title my jade template
```

### Normalize code block
Resets the code block to zero indents at its base.

```js
var getCodeBlock = require('pug-code-block');
getCodeBlock.normalize('        div\n          div')

// div\n  div
```