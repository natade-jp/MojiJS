const copy = function(from, to) {
	const fs = require("fs");
	const bin = fs.readFileSync(from);
	fs.writeFileSync(to, bin);
};

const exec = function(command) {
	const execSync = require("child_process").execSync;
	execSync(command);
};

// UTF-8 with BOM でテキストを書き込む
const saveTextFile = function(filename, text) {
	const fs = require("fs");
	if (text.length > 0 && text.charAt(0) !== "\uFEFF") {
		fs.writeFileSync(filename, "\uFEFF" + text, "utf-8");
	}
	else {
		fs.writeFileSync(filename, text, "utf-8");
	}
};

// BOMあり／なしに関わらず、UTF-8のテキストを読み込む
const loadTextFile = function(filename) {
	const fs = require("fs");
	const text = fs.readFileSync(filename, "utf-8");
	if (text.length > 0 && text.charAt(0) === "\uFEFF") {
		return text.substr(1);
	}
	else {
		return text;
	}
};

const addHeader = function(filename) {
	const build_date = new Date();
	let header = [];
	header.push("/*!");
	header.push(" * SenkoJS");
	header.push(" * https://github.com/natade-jp/SenkoJS");
	header.push(" * Copyright 2013-" + build_date.getFullYear() + " natade");
	header.push(" *");
	header.push(" * The MIT license.");
	header.push(" * https://opensource.org/licenses/MIT");
	header.push(" */");
	header.push("");
	header = header.join("\n");
	const text = loadTextFile(filename);
	saveTextFile(filename, header + text);
};

// rollup
exec("npm run rollup");

// 先頭に著作権表記をするターゲット
const target_file = [
	"./build/Senko.umd.js",
	"./build/Senko.module.mjs",
	"./build/SenkoText.umd.js",
	"./build/SenkoText.module.mjs",
	"./build/SenkoS3.umd.js",
	"./build/SenkoS3.module.mjs",
	"./build/SenkoMath.umd.js",
	"./build/SenkoMath.module.mjs"
];

// ヘッダ追加
for(const key in target_file) {
	addHeader(target_file[key]);
}

// サンプルファイルはbuild内のデータと関連付ける
saveTextFile(
	"./examples/libs/Senko.mjs",
	"import Senko from \"../../build/Senko.module.mjs\";export default Senko;"
);
saveTextFile(
	"./examples/libs/SenkoText.mjs",
	"import SenkoText from \"../../build/SenkoText.module.mjs\";export default SenkoText;"
);
saveTextFile(
	"./examples/libs/SenkoS3.mjs",
	"import SenkoS3 from \"../../build/SenkoS3.module.mjs\";export default SenkoS3;"
);
saveTextFile(
	"./examples/libs/SenkoMath.mjs",
	"import SenkoMath from \"../../build/SenkoMath.module.mjs\";export default SenkoMath;"
);

// その他のファイルをコピー
copy("./src/gui/SComponent.css", "./build/SComponent.css");
copy("./src/s3/gl/S3GL.fs", "./build/S3GL.fs");
copy("./src/s3/gl/S3GL.vs", "./build/S3GL.vs");
