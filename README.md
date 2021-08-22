# JSON Parser

A simple JSON parser written in JavaScript. Just to understand how parsers work.

# TODO

- [x] Elements
- [x] Empty values
- [x] Strings
- [x] Numbers integers, fractions
- [x] Arrays
- [x] Objects
- [ ] Handle error cases

# Approach

There is function to parse each major element in the grammar. Each parsing function is reponsible for:

- Detecting a sequence of characters matches an element
- Producing the correcponding js element
- Leaving the parser position in the right place

Is this a recursive descent parser?

## Running the tests

```sh
./test
```

or

```sh
node parser.test.js <test filter>
```

# References

- https://www.json.org/json-en.html
- https://datatracker.ietf.org/doc/html/rfc8259
- https://jsonplaceholder.typicode.com/

Example tests come from these places.

# Grammar (json.org)

```
json
    element

value
    object
    array
    string
    number
    "true"
    "false"
    "null"

object
    '{' ws '}'
    '{' members '}'

members
    member
    member ',' members

member
    ws string ws ':' element

array
    '[' ws ']'
    '[' elements ']'

elements
    element
    element ',' elements

element
    ws value ws

string
    '"' characters '"'

characters
    ""
    character characters

character
    '0020' . '10FFFF' - '"' - '\'
    '\' escape

escape
    '"'
    '\'
    '/'
    'b'
    'f'
    'n'
    'r'
    't'
    'u' hex hex hex hex

hex
    digit
    'A' . 'F'
    'a' . 'f'

number
    integer fraction exponent

integer
    digit
    onenine digits
    '-' digit
    '-' onenine digits

digits
    digit
    digit digits

digit
    '0'
    onenine

onenine
    '1' . '9'

fraction
    ""
    '.' digits

exponent
    ""
    'E' sign digits
    'e' sign digits

sign
    ""
    '+'
    '-'

ws
    ""
    '0020' ws
    '000A' ws
    '000D' ws
    '0009' ws
```
