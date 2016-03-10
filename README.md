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

Optionally provide a limit of captures. Default limit is 1.

```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('pug-code-block');
getCodeBlock.byLine(source, 1, 3);

// div 1
// div 2
// div 3
// div -
// div -
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