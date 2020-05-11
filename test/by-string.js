const test = require("tape");
const fs = require("fs");
const byString = require("../index").byString;

const source = fs.readFileSync("./test/fixtures/doc.pug", "utf8");

test("By string: mixin bar", function (assert) {
  let actual = byString(source, "mixin bar");
  let expected = [
    "mixin bar\n  div\n    | bar\n    | bar",
    "mixin bar\n  div\n    | bar 2\n\n    \n    | bar 2",
  ];

  assert.deepEqual(
    actual,
    expected,
    'Searching for "mixin bar" should return an array with two complete mixins.'
  );
  assert.end();
});

test("By string: div", function (assert) {
  let actual = byString(source, "div").length;
  let expected = 10;

  assert.deepEqual(
    actual,
    expected,
    'Searching for "div" should return an array.'
  );
  assert.end();
});

test("By string: head", function (assert) {
  let actual = byString(source, "head");
  let expected = "head\n  title my pug template";

  assert.deepEqual(
    actual,
    expected,
    'Searching for "head" should return a string.'
  );
  assert.end();
});

test("By string: not found", function (assert) {
  let actual = byString(source, "whatever");
  let expected = "";

  assert.equal(
    actual,
    expected,
    'Searching for "whatever" should return an empty string.'
  );
  assert.end();
});

test("By string: first line", function (assert) {
  let actual = byString(source, "mixin foo");
  let expected = "mixin foo\n  div\n    | foo\n    | foo";

  assert.equal(
    actual,
    expected,
    'Searching for "mixin foo" should return a complete mixin.'
  );
  assert.end();
});

test("By string: regex", function (assert) {
  let actual = byString(source, /mIXin\sfOO/i);
  let expected = "mixin foo\n  div\n    | foo\n    | foo";

  assert.equal(
    actual,
    expected,
    "Searching for /mixinsfoo/ should return a complete mixin."
  );
  assert.end();
});
