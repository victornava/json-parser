const Parser = require("./parser");

const tests = [
  // Empty value
  {
    what: 'Empty Array',
    input: '[]',
    expected: []
  },
  {
    what: 'Empty Object',
    input: '{}',
    expected: {}
  },
  {
    what: 'Empty String',
    input: '""',
    expected: ''
  },
  {
    what: 'Single Number',
    input: '0',
    expected: 0
  },
  {
    what: 'True',
    input: 'true',
    expected: true
  },
  {
    what: 'False',
    input: 'false',
    expected: false
  },
  {
    what: "Null",
    input: 'null',
    expected: null
  }
]

tests.forEach(({ what, input, expected }) => {
  const output = Parser.parse(input)
  if (equals(expected, output)) {
    console.log(`✅ ${what}`) 
  } else {
    console.error("❌", { what, input, expected, output }) 
  }
});

function equals(expected, actual) {
  if (expected === null || typeof expected === 'boolean') {
    return expected === actual
  }
  // Rest
  return expected.toString() === actual.toString();    
}
 