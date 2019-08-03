const copy = function(from, to) {
	const fs = require("fs");
	const bin = fs.readFileSync(from);
	fs.writeFileSync(to, bin);
};

const saveTextFile = function(filename, text) {
	const fs = require("fs");
	fs.writeFileSync(filename, text, "utf-8");
};

// サンプルファイルは直接関連付ける
saveTextFile(
	"./examples/libs/SenkoText.mjs",
	"import SenkoText from \"../../src/SenkoText.mjs\";export default SenkoText;"
);
