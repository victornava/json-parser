const util = require("util");

const State = {
  input: "",
  position: 0,
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

function parseValue(s) {
  const c = char(s);
  if (c === "[") return parseArray(s);
  if (c === "{") return parseObject(s);
  if (c === '"') return parseString(s);
  if ("0123456789".includes(c)) return parseNumber(s);
  if (c === "t") return consumeToken(s, "true", true);
  if (c === "f") return consumeToken(s, "false", false);
  if (c === "n") return consumeToken(s, "null", null);
  bail(s, "parseValue");
}

function parseArray(s) {
  log("Array in:", xray(s));
  if (char(s) !== "[") bail(s, "parseArray start");
  advance(s);
  consumeWhiteSpace(s);

  const out = [];

  // Empty: '[' ws ']'
  if (char(s) === "]") {
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

  if (char(s) !== "]") bail(s, "parseArray end");
  advance(s);

  log("Array out:", out, char(s));
  return out;
}

function parseObject(s) {
  log("Object in:", xray(s));
  if (char(s) !== "{") bail(s, "parseObject");
  advance(s);

  let out = {};

  // TODO

  if (char(s) !== "}") bail(s, "parseObject");
  advance(s);
  log("Object out:", out);
  return out;
}

function parseString(s) {
  // log("String in:", xray(s));
  if (char(s) !== '"') bail(s, "parseString");
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

  while (char(s) !== '"') {
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

  if (!"0123456789".includes(char(s))) bail(s, "parseNumber");

  let out = Number(char(s));

  advance(s);

  // TODO: while

  log("Number", { out, s });

  return out;
}

function consumeToken(s, token, returnValue = null) {
  for (c of token) {
    if (c === char(s)) {
      advance(s);
    } else {
      bail(s);
    }
  }
  return returnValue;
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
  while (" \n\r\t".includes(char(s))) {
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
