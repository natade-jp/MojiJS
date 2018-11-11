const execSync = require("child_process").execSync;
const result = execSync("npm run rollup").toString();
const fs = require("fs");
const output_file_name = "./examples/libs/Senko.js";
const es_text =  'import Senko from "../../build/Senko.module.js";export default Senko;'
fs.writeFileSync(output_file_name, es_text, "utf-8");
