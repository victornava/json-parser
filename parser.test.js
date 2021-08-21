// https://nodejs.org/api/assert.html

const assert = require("assert/strict");
const Parser = require("./parser");

const testFilter = process.argv[2];
if (testFilter) {
  console.log(`Filter by: ${testFilter}`);
}
console.log;

const tests = [
  // Empty value
  {
    what: "Empty Array",
    input: "[]",
  },
  {
    what: "Empty Object",
    input: "{}",
  },
  {
    what: "Empty String",
    input: '""',
  },
  {
    what: "Single Number",
    input: "0",
  },
  {
    what: "True",
    input: "true",
  },
  {
    what: "False",
    input: "false",
  },
  {
    what: "Null",
    input: "null",
  },
  // Element
  {
    what: "Element (maybe whiteSpace between values)",
    input: " \n\t\r[]\r\t\n ",
  },
  // String
  {
    what: "String Simple",
    input: `"uno dos tres"`,
  },
  {
    what: "String scaped quote",
    input: `"A \\"quote\\" B"`,
  },
  {
    what: "String scapemagedon",
    input: `"A \\",\\n,\\r\\t\\b\\f\\/B"`,
  },
  // Array Simple
  {
    what: "Array numbers",
    input: "[1, 2, 3]",
  },
  {
    what: "Array mixed",
    input: '[[], {}, "", 0, true, false, null]',
  },
  {
    what: "Array nested",
    input: "[[1, [2, [3]]]]",
  },
];

tests.forEach(({ what, input, expected }) => {
  // Run specific test
  if (testFilter && !what.includes(testFilter)) {
    return;
  }

  try {
    const actual = Parser.parse(input);
    assert.deepEqual(actual, JSON.parse(input));
    console.log(`✅ ${what}`);
  } catch (error) {
    console.error(`❌ ${what}`, error);
  }
});
