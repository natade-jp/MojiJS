const File = require("./File.js");

/**
 * 
 * @param {string} filename 
 */
const addHeader = function(filename) {
	const build_date = new Date();
	const header = [];
	header.push("/*!");
	header.push(" * MojiJS.js");
	header.push(" * https://github.com/natade-jp/MojiJS");
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
	"./build/mojijs.umd.min.js",
	"./build/mojijs.esm.min.js"
];

// ヘッダ追加
for(const key in target_file) {
	addHeader(target_file[key]);
}

// ES6用のモジュールをnode.jsで利用できるように修正する
{
	let text = File.loadTextFile("./build/CommonJS/index.js");
	text = text.replace("export default MojiJS;", "module.exports = MojiJS;");
	File.saveTextFile("./build/CommonJS/index.js", text);
}

// 一部のファイルの情報を修正する
{
	const correctionReservedWords = function(filename) {
		let text = File.loadTextFile(filename);
		// "do" を予約語の do に変換される場合があるため
		text = text.replace(/,do:/g, ",\"do\":");
		File.saveTextFile(filename, text);
	};
	const files = [
		"./build/mojijs.esm.min.js",
		"./build/mojijs.umd.min.js"
	];
	for(let i = 0; i < files.length; i++) {
		correctionReservedWords(files[i]);
	}
}

// JScript用のソースコードも作成
{
	const MojiJS = require("../build/CommonJS/index.js");
	const text = File.loadTextFile("./build/mojijs.umd.min.js");
	const output_data = MojiJS.encode(text.replace(/\n/g, "\r\n"), "UTF16-LE");
	File.saveBinaryFile("./build/mojijs.wsh.js", output_data);
}

// サンプルファイルはbuild内のデータと関連付ける
File.saveTextFile(
	"./html/examples/libs/MojiJS.js",
	"import MojiJS from \"../../../build/mojijs.esm.min.js\";export default MojiJS;"
);

