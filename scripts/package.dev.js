const File = require("./File.js");

// サンプルファイルは直接関連付ける
File.saveTextFile(
	"./html/examples/libs/mojijs.js",
	"import mojijs from \"../../../src/mojijs.js\";export default mojijs;"
);
