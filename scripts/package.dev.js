const File = require("./File.js");

// サンプルファイルは直接関連付ける
File.saveTextFile(
	"./html/examples/libs/jptext.js",
	"import jptext from \"../../../src/jptext.js\";export default jptext;"
);
