const File = require("./File.js");

/**
 * 
 * @param {string} filename 
 */
const addHeader = function(filename) {
	const build_date = new Date();
	const header = [];
	header.push("/*!");
	header.push(" * jptext.js");
	header.push(" * https://github.com/natade-jp/jptext");
	header.push(" * Copyright 2013-" + build_date.getFullYear() + " natade < https://github.com/natade-jp >");
	header.push(" *");
	header.push(" * The MIT license.");
	header.push(" * https://opensource.org/licenses/MIT");
	header.push(" */");
	header.push("");
	const header_string = header.join("\n");
	const text = File.loadTextFile(filename);
	File.saveTextFile(filename, header_string + text);
};

// rollup
File.exec("npx rollup -c \"./scripts/rollup.config.js\"");

// 先頭に著作権表記をするターゲット
const target_file = [
	"./build/jptext.umd.js",
	"./build/jptext.module.mjs"
	"./build/jptext.umd.min.js",
	"./build/jptext.module.min.mjs"
];

// ヘッダ追加
for(const key in target_file) {
	addHeader(target_file[key]);
}

// サンプルファイルはbuild内のデータと関連付ける
File.saveTextFile(
	"./html/examples/libs/jptext.js",
	"import jptext from \"../../../build/jptext.module.min.mjs\";export default jptext;"
);
