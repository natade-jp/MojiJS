const fs = require("fs");
const output_file_name = "./examples/libs/Senko.js";
const es_text =  'import Senko from "../../src/Senko.js";export default Senko;'
fs.writeFileSync(output_file_name, es_text, "utf-8");
