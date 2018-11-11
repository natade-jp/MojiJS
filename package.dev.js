const fs = require("fs");
const input_file_name = "./src/Senko.js";
const output_file_name = "./build/Senko.js";

// ファイルを読み込む
let es_text = fs.readFileSync(input_file_name, "utf-8");

// import するファイルパスを変更
es_text = es_text.replace(/(import\s+\w+\s+from\s+")(.\/)([^;]+;)/g, "$1../src/$3");

// build用のフォルダへ保存
fs.writeFileSync(output_file_name, es_text, "utf-8");
