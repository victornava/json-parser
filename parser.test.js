// https://nodejs.org/api/assert.html
const fs = require("fs");
const assert = require("assert/strict");
const Parser = require("./parser");

const testFilter = process.argv[2];
if (testFilter) {
  console.log(`Filter by: ${testFilter}`);
}

function runTest({ what, input }) {
  // Run specific test
  if (testFilter && !what.includes(testFilter)) {
    console.log(`Skipped: ${what}`);
    return;
  }

  try {
    const actual = Parser.parse(input);
    assert.deepEqual(actual, JSON.parse(input));
    console.log(`✅ ${what}`);
  } catch (error) {
    console.error(`❌ ${what}`, error);
  }
}

const simpleTests = [
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
  // Array
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
  // Number
  {
    what: "Number positive integer",
    input: "1984",
  },
  {
    what: "Number negative integer",
    input: "-37",
  },
  {
    what: "Number positive with fraction",
    input: "3.14",
  },
  {
    what: "Number negative with fraction",
    input: "-0.97463",
  },
  // Object
  {
    what: "Object flat",
    input: `{ "type": "Beer", "style": "IPA", "name": "Hopster", "price": 10, "inStock": true }`,
  },
  {
    what: "Object nested",
    input: `{ "a": { "b": { "c": "OK" } } }`,
  },
];

simpleTests.forEach(runTest);

// Grab example json files
const exampleTests = fs
  .readdirSync(".")
  .filter((f) => /^t\..*json/.exec(f))
  .map((what) => {
    const input = fs.readFileSync(what).toString();
    return { what, input };
  });

exampleTests.forEach(runTest);
