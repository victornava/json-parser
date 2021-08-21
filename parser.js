const util = require("util");

const State = {
  input: "",
  position: 0,
  stackDepth: 0,
};

// const values = ["Array", "Object", "Number", "true", "false", "null"]
const tokens = {
  arrayStart: "[",
  arrayEnd: "]",
  objectStart: "{",
  objectEnd: "}",
  doubleQuote: '"',
  digits: [..."0123456789"],
  true: "true",
  false: "false",
  null: "null",
  whiteSpace: [" ", "\n", "\r", "\t"],
};

function parse(jsonStr) {
  // log(" in:", jsonStr);
  let s = { ...State, ...{ input: jsonStr } };
  return parseElement(s);
}

// Element: ws value ws
function parseElement(s) {
  // log("Element", xray(s));
  consumeWhiteSpace(s);
  const out = parseValue(s);
  consumeWhiteSpace(s);
  return out;
}

// Array, Object, String, Number, True, False, Null
function parseValue(s) {
  log("Value in:", xray(s));
  let out;
  if (char(s) === tokens.arrayStart) {
    out = parseArray(s);
  } else if (char(s) === tokens.objectStart) {
    out = parseObject(s);
  } else if (char(s) === tokens.doubleQuote) {
    out = parseString(s);
  } else if (tokens.digits.includes(char(s))) {
    out = parseNumber(s);
  } else if (tokens.true.startsWith(char(s))) {
    consumeToken(s, tokens.true);
    out = true;
  } else if (tokens.false.startsWith(char(s))) {
    consumeToken(s, tokens.false);
    out = false;
  } else if (tokens.null.startsWith(char(s))) {
    consumeToken(s, tokens.null);
    out = null;
  } else {
    bail(s, "parseValue");
  }
  log("Value out:", xray(s));
  return out;
}

function parseArray(s) {
  log("Array in:", xray(s));
  if (char(s) !== tokens.arrayStart) bail(s, "parseArray start");
  advance(s);
  consumeWhiteSpace(s);

  const out = [];

  // Empty: '[' ws ']'
  if (char(s) === tokens.arrayEnd) {
    advance(s);
    log("Array out:", out, char(s));
    return out;
  }

  // One: element
  out.push(parseElement(s));

  // Many: element ',' elements
  while (char(s) === ",") {
    advance(s);
    out.push(parseElement(s));
  }

  if (char(s) !== tokens.arrayEnd) bail(s, "parseArray end");
  advance(s);

  log("Array out:", out, char(s));
  return out;
}

function parseObject(s) {
  log("Object in:", xray(s));
  if (char(s) !== tokens.objectStart) bail(s, "parseObject");
  advance(s);

  let out = {};

  // TODO

  if (char(s) !== tokens.objectEnd) bail(s, "parseObject");
  advance(s);
  log("Object out:", out);
  return out;
}

// function parseString(s) {
//   log("String in:", xray(s));
//   if (char(s) !== tokens.doubleQuote) bail(s, "parseString");
//   advance(s);

//   let out = "";

//   while (char(s) !== tokens.doubleQuote) {
//     if (char(s) === "\\") {
//       advance(s);
//       log(`switch '${char(s)}'`);
//       switch (char(s)) {
//         case '"':
//           out += '"';
//           break;
//         case "n":
//           out += "\n";
//           break;
//         case "r":
//           out += "\r";
//           break;
//         case "t":
//           out += "\t";
//           break;
//         case "b":
//           out += "\b";
//           break;
//         case "f":
//           out += "\f";
//           break;
//         case "/":
//           out += "/";
//           break;
//         default:
//           bail(s, "parseString");
//       }
//       advance(s);
//     } else {
//       out += char(s);
//       advance(s);
//     }
//   }
//   advance(s);
//   log("String out: ", out);
//   return out;
// }

function parseString(s) {
  // log("String in:", xray(s));
  if (char(s) !== tokens.doubleQuote) bail(s, "parseString");
  advance(s);

  let out = "";

  const scape = {
    '"': '"',
    n: "\n",
    r: "\r",
    t: "\t",
    b: "\b",
    f: "\f",
    "/": "/",
  };

  while (char(s) !== tokens.doubleQuote) {
    if (char(s) === "\\") {
      advance(s);
      log(`switch '${char(s)}'`);
      const replacement = scape[char(s)];
      if (replacement === undefined) {
        bail(s, "parseString");
      }
      out += replacement;
    } else {
      out += char(s);
    }
    advance(s);
  }
  advance(s);
  // log("String out: ", out);
  return out;
}

function parseNumber(s) {
  log("Number", char(s), s);

  if (!tokens.digits.includes(char(s))) bail(s, "parseNumber");

  let out = Number(char(s));

  advance(s);

  // TODO: while

  log("Number", { out, s });

  return out;
}

function consumeToken(s, token) {
  for (c of token) {
    if (c === char(s)) {
      // TODO: Handle eof gracefully
      advance(s);
    } else {
      bail(s);
    }
  }
  return token;
}

// Helpers
function char(s) {
  // log("char", s);
  return s.input[s.position];
}

function advance(s) {
  s.position++;
  // log(`advance: '${char(s)}'`);
  return char(s);
}

function consumeWhiteSpace(s) {
  while (tokens.whiteSpace.includes(char(s))) {
    advance(s);
  }
}

function bail(s, parseFn) {
  throw `ERROR: Unexpected char '${char(s)}' at position '${
    s.position
  }' while parsing ${parseFn}`;
}

function xray(s) {
  return { around: s.input.slice(s.position, 20), position: s.position };
}

module.exports = {
  parse,
};

// Debugging
function log() {
  // console.log.apply(console, arguments);
}
