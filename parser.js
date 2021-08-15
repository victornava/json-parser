const State = {
  input: "",
  output: undefined,
  position: -1,
  char: undefined
}

// const values = ["Array", "Object", "Number", "true", "false", "null"]
const tokens = {
  arrayStart: '[',
  arrayEnd: ']',
  objectStart: '{',
  objectEnd: '}',
  stringDelimiter: '"',
  digits: [..."0123456789"],
  true: "true",
  false: "false",
  null: "null"
}

function parse(jsonStr) {
  let s = {...State, ...{ input: jsonStr }}
  advance(s);
  parseValue(s);
  return s.output;
}

// Array, Object, String, Number, True, False, Null
function parseValue(s) {
  if (s.char === tokens.arrayStart) {
    s.output = parseArray(s);
    return s;
  }
  if (s.char === tokens.objectStart) {
    s.output = parseObject(s);
    return s;
  }
  if (s.char === tokens.stringDelimiter) {
    s.output = parseString(s);
    return s;
  }
  if (tokens.digits.includes(s.char)) {
    s.output = parseNumber(s);
    return s;
  }
  if (tokens.true.startsWith(s.char)) {
    parseToken(s, tokens.true);
    s.output = true
    return s;
  }
  if (tokens.false.startsWith(s.char)) {
    parseToken(s, tokens.false);
    s.output = false
    return s;
  }
  if (tokens.null.startsWith(s.char)) {
    parseToken(s, tokens.null);
    s.output = null
    return s;
  }
  bail(s);
}

function parseArray(s) {
  if (s.char !== tokens.arrayStart) bail(s);
  advance(s);
  
  let array = []
  
  // TODO
  
  if (s.char !== tokens.arrayEnd) bail(s);
  advance(s);
  return array;
}

function parseObject(s) {
  if (s.char !== tokens.objectStart) bail(s);
  advance(s);
  
  let object = {}
  
  // TODO
  
  if (s.char !== tokens.objectEnd) bail(s);
  advance(s);
  return object;
}

function parseString(s) {
  if (s.char !== tokens.stringDelimiter) bail(s);
  advance(s);
  
  let string = ""
  
  // TODO
  
  if (s.char !== tokens.stringDelimiter) bail(s);
  advance(s);
  
  return string;
}

function parseNumber(s) {
  if (!tokens.digits.includes(s.char)) bail(s);

  let number = Number(s.char)
  
  // TODO  
  
  return number;
}

function parseToken(s, token) {
  for (char of token) {
    if (char === s.char) {
      // TODO: Handle eof gracefully
      advance(s);
    }
    else {
      bail(s)
    }
  }
  return token
}

// Helpers
function advance(s) {
  s.position++;
  s.char = s.input[s.position]
  return s.char
}

function peek(s) {
  // TODO handle end of string
  return s.input[s.position+1];
}

function hasMore(s) {
  return s.index < s.input.length - 1
  // TODO handle end of string
  return s.input[s.position+1];
}

function bail(s) {
  throw `ERROR: Unexpected char '${s.char}' at position ${s.position}`;
}

module.exports = {
  parse
}