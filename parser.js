// Top level parse function
function parse(jsonStr) {
  // Parser state
  let s = {
    input: jsonStr,
    position: 0,
  };
  return parseElement(s);
}

function parseElement(s) {
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
  if (c === "-" || isDigit(c)) return parseNumber(s);
  if (c === "t") return parseToken(s, "true", true);
  if (c === "f") return parseToken(s, "false", false);
  if (c === "n") return parseToken(s, "null", null);
  bail(s, "parseValue");
}

function parseArray(s) {
  char(s) === "[" ? advance(s) : bail(s, "parseArray");
  consumeWhiteSpace(s);

  const out = [];

  if (char(s) === "]") {
    advance(s);
    return [];
  }

  out.push(parseElement(s));
  while (char(s) === ",") {
    advance(s);
    out.push(parseElement(s));
  }

  char(s) === "]" ? advance(s) : bail(s, "parseArray")
  return out;
}

function parseObject(s) {
  char(s) === "{" ? advance(s) : bail(s, "parseObject");

  const out = {};

  while (true) {
    consumeWhiteSpace(s);

    if (char(s) !== '"')
      break;

    const key = parseString(s);

    if (out.hasOwnProperty(key))
      bail(s, "parseObject");

    consumeWhiteSpace(s);
    char(s) === ":" ? advance(s) : bail(s, "parseObject");

    const value = parseElement(s);
    out[key] = value;

    if (char(s) === ",") {
      advance(s);
    } else {
      break;
    }
  }

  char(s) === "}" ? advance(s) : bail(s, "parseObject");
  return out;
}

function parseString(s) {
  char(s) === '"' ? advance(s) : bail(s, "parseString");

  let out = "";

  const scape = {
    '"': '"',
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "b": "\b",
    "f": "\f",
    "/": "/",
  };

  while (char(s) !== '"') {
    if (char(s) === "\\") {
      advance(s);
      const replacement = scape[char(s)];
      if (replacement === undefined)
        bail(s, "parseString");
      out += replacement;
    } else {
      out += char(s);
    }
    advance(s);
  }

  advance(s);
  return out;
}

function parseNumber(s) {
  let out = "";

  // Maybe negative number
  if (char(s) === "-")
    out += take(s);

  // Next char must be a digit
  if (!isDigit(char(s)))
    bail(s, "parseNumber");

  out += take(s);

  // TODO: If first digit is zero, next char can't be digit
  while (isDigit(char(s))) out += take(s);

  // Fraction
  if (char(s) === ".") {
    out += take(s);

    if (!isDigit(char(s)))
      bail(s, "parseNumber");

    while (isDigit(char(s))) {
      out += take(s)
    };
  }

  return Number(out);
}

// Helpers

function take(s) {
  const c = char(s);
  advance(s);
  return c;
}

function parseToken(s, token, returnValue) {
  for (c of token) {
    c === char(s) ? advance(s) : bail(s, `parseToken '${token}'`)
  }
  return returnValue;
}

function char(s) {
  return s.input[s.position];
}

function advance(s) {
  s.position++;
  return char(s);
}

function consumeWhiteSpace(s) {
  while (" \n\r\t".includes(char(s))) {
    advance(s);
  }
}

function bail(s, parseFn) {
  throw `ERROR: Unexpected char '${char(s)}' at position '${s.position}' while parsing ${parseFn}`;
}

function isDigit(c) {
  return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(c);
}

// Debugging
// function log() {
//   console.log.apply(console, arguments);
// }
//
// function xray(s) {
//   return { around: s.input.slice(s.position, 20), position: s.position };
// }

// Exports

module.exports = {
  parse,
};
