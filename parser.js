const util = require("util");

const State = {
  input: "",
  position: 0,
};

// const values = ["Array", "Object", "Number", "true", "false", "null"]
const tokens = {
  arrayStart: "[",
  arrayEnd: "]",
  objectStart: "{",
  objectEnd: "}",
  stringDelimiter: '"',
  digits: [..."0123456789"],
  true: "true",
  false: "false",
  null: "null",
  whiteSpace: [" ", "\n", "\r", "\t"],
  comma: ",",
};

function parse(jsonStr) {
  let s = { ...State, ...{ input: jsonStr } };
  return parseElement(s);
}

// Element: ws value ws
function parseElement(s) {
  log("parseElement", char(s), s);
  consumeWhiteSpace(s);
  const out = parseValue(s);
  consumeWhiteSpace(s);
  return out;
}

// Array, Object, String, Number, True, False, Null
function parseValue(s) {
  let out;
  if (char(s) === tokens.arrayStart) {
    out = parseArray(s);
  } else if (char(s) === tokens.objectStart) {
    out = parseObject(s);
  } else if (char(s) === tokens.stringDelimiter) {
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
  return out;
}

function parseArray(s) {
  log("parseArray", char(s), s);
  if (char(s) !== tokens.arrayStart) bail(s, "parseArray start");
  advance(s);
  consumeWhiteSpace(s);

  const out = [];

  // Empty: '[' ws ']'
  if (char(s) === tokens.arrayEnd) {
    advance(s);
    return out;
  }

  // One or Many: [' elements ']'

  // One: element
  out.push(parseElement(s));

  log("parseArray", out, char(s));

  // Many: element ',' elements
  while (char(s) === tokens.comma) {
    log("parseArray while -> ", char(s));
    advance(s);
    out.push(parseElement(s));
  }

  if (char(s) !== tokens.arrayEnd) bail(s, "parseArray end");
  advance(s);

  return out;
}

function parseObject(s) {
  if (char(s) !== tokens.objectStart) bail(s, "parseObject");
  advance(s);

  let object = {};

  // TODO

  if (char(s) !== tokens.objectEnd) bail(s, "parseObject");
  advance(s);
  return object;
}

function parseString(s) {
  if (char(s) !== tokens.stringDelimiter) bail(s, "parseString");
  advance(s);

  let string = "";

  // TODO

  if (char(s) !== tokens.stringDelimiter) bail(s, "parseString");
  advance(s);

  return string;
}

function parseNumber(s) {
  log("parseNumber", char(s), s);

  if (!tokens.digits.includes(char(s))) bail(s, "parseNumber");

  let out = Number(char(s));

  advance(s);

  // TODO: while

  log("parseNumber", { out, s });

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
  log("char", s);
  return s.input[s.position];
}

function advance(s) {
  // TODO don't advance after eol
  log("advance: before", char(s), s);
  s.position++;
  log("advance: after", char(s), s);
  return char(s);
}

function consumeWhiteSpace(s) {
  while (tokens.whiteSpace.includes(char(s))) {
    advance(s);
  }
}

function peek(s) {
  // log("peek", s, s.position + 1);
  return s.input[s.position + 1];
}

// function hasMore(s) {
//   return s.index < s.input.length - 1;
// }

function bail(s, parseFn) {
  throw `ERROR: Unexpected char '${char(s)}' at position '${
    s.position
  }' while parsing ${parseFn}`;
}

// Debuggin
function log() {
  // console.log.apply(console, arguments);
}

module.exports = {
  parse,
};
