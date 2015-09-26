# Jade code block
Get Jade code at and inside a given line or query.


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

_byLine.js_
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.byLine(source, 3);

// head
//   title my jade template
```

_byString.js_
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.byString(source, 'body');

// body
//   h1 Hello #{name}
//   p foo
```

_fromLineToLine.js_
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.fromLineToLine(source, 1, 5);

// doctype html
// html
//   head
//     title my jade template
//   body
```

_fromStringToString.js_
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.fromStringToString(source, 'head', 'body');

//   head
//     title my jade template
//   body
```
