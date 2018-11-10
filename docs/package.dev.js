const fs = require("fs");
const input_file_name = "./src/Senko.js";
const output_file_name = "./build/Senko.js";

let es_text = fs.readFileSync(input_file_name, "utf-8");
es_text = es_text.replace(/(import\s+\w+\s+from\s+")(.\/)([^;]+;)/g, "$1../src/$3");
fs.writeFileSync(output_file_name, es_text, "utf-8");
