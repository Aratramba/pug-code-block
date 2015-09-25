# jade-code-block
get Jade code block.


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