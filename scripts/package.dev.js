const File = require("./File.js");

// サンプルファイルは直接関連付ける
File.saveTextFile(
	"./html/examples/libs/MojiJS.js",
	"import MojiJS from \"../../../src/MojiJS.js\";export default MojiJS;"
);
