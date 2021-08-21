const Parser = require("./parser");
const jsonStr = process.argv[3];
console.log(Parser.parse(jsonStr));
