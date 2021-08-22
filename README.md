# JSON Parse

Let's write a simple JSON parser to understand how parsers work a little better.

TODO

- [x] Elements
- [x] Empty values
- [x] Strings
- [x] Numbers integers, fractions
- [x] Arrays
- [x] Objects

Non-Goal

# References

- https://www.json.org/json-en.html

- https://datatracker.ietf.org/doc/html/rfc8259

# Grammar

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

# Approach

There is function to parse each element of the grammar.

Each function is reponsible for two main things:

- Detect sequence of characters matches the element
- Generate the element and add it to the output

Detect -> Generate
