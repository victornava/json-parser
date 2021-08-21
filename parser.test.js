// https://nodejs.org/api/assert.html

const assert = require("assert/strict");
const Parser = require("./parser");

const tests = [
  // Empty value
  {
    what: "Empty Array",
    input: "[]",
    expected: [],
  },
  {
    what: "Empty Object",
    input: "{}",
    expected: {},
  },
  {
    what: "Empty String",
    input: '""',
    expected: "",
  },
  {
    what: "Single Number",
    input: "0",
    expected: 0,
  },
  {
    what: "True",
    input: "true",
    expected: true,
  },
  {
    what: "False",
    input: "false",
    expected: false,
  },
  {
    what: "Null",
    input: "null",
    expected: null,
  },
  // Element
  {
    what: "Element (maybe whiteSpace between values)",
    input: " \n\t\r[]\r\t\n ",
    expected: [],
  },
  // Array Simple
  {
    what: "Array numbers",
    input: "[1, 2, 3]",
    expected: [1, 2, 3],
  },
  {
    what: "Array mixed",
    input: '[[], {}, "", 0, true, false, null]',
    expected: [[], {}, "", 0, true, false, null],
  },
  {
    what: "Array nested",
    input: "[[1, [2, [3]]]]",
    expected: [[1, [2, [3]]]],
  },
  // Object Simple
];

tests.forEach(({ what, input, expected }) => {
  try {
    const output = Parser.parse(input);
    assert.deepEqual(expected, output);
    console.log(`✅ ${what}`);
  } catch (error) {
    console.error(`❌ ${what}`, error);
  }
});
