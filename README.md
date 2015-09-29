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

### Get block at line number
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.byLine(source, 3);

// head
//   title my jade template
```

### Get block at string match
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.byString(source, 'body');

// body
//   h1 Hello #{name}
//   p foo
```

### Get block after block at line
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.afterBlockAtLine(source, 3);

//  body
//    h1 Hello #{name}
//    p foo
```

### Get block before block at line
```js
var source = fs.readFileSync('./doc.jade', 'utf8');

var getCodeBlock = require('../index.js');
getCodeBlock.beforeBlockAtLine(source, 5);

//  head
//    title my jade template
```