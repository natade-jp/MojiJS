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
	"./examples/libs/Senko.mjs",
	"import Senko from \"../../src/Senko.mjs\";export default Senko;"
);
saveTextFile(
	"./examples/libs/SenkoText.mjs",
	"import SenkoText from \"../../src/SenkoText.mjs\";export default SenkoText;"
);
saveTextFile(
	"./examples/libs/SenkoS3.mjs",
	"import SenkoS3 from \"../../src/SenkoS3.mjs\";export default SenkoS3;"
);
saveTextFile(
	"./examples/libs/SenkoMath.mjs",
	"import SenkoMath from \"../../src/SenkoMath.mjs\";export default SenkoMath;"
);


// その他のファイルをコピー
copy("./src/gui/SComponent.css", "./build/SComponent.css");
copy("./src/s3/gl/S3GL.fs", "./build/S3GL.fs");
copy("./src/s3/gl/S3GL.vs", "./build/S3GL.vs");
