var test = require("tape");
var fs = require("fs");
var byLine = require("../index").byLine;

var source = fs.readFileSync("./test/fixtures/doc.pug", "utf8");

test("Pug output", function (assert) {
  const block = byLine(source, 18);
  const pug = require("pug");
  const actual = pug.compile(block, { pretty: false })();
  const expected = "<div>foo<div> faa</div></div>";

  assert.equal(actual, expected, "Given pug input it should produce html.");
  assert.end();
});
