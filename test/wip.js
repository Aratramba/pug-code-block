const byLine = require("../index").byLine;

console.log(
  byLine(
    `
  foo(
)
  faa
`,
    1
  )
);
