const copy = function(from, to) {
	const fs = require("fs");
	const bin = fs.readFileSync(from);
	fs.writeFileSync(to, bin);
};

const saveTextFile = function(filename, text) {
	const fs = require("fs");
	fs.writeFileSync(filename, text, "utf-8");
};

const es_text =  "import Senko from \"../../src/Senko.js\";export default Senko;";
saveTextFile("./examples/libs/Senko.js", es_text);

copy("./src/gui/SComponent.css", "./build/SComponent.css");
copy("./src/renderer/gl/S3GL.fs", "./build/S3GL.fs");
copy("./src/renderer/gl/S3GL.vs", "./build/S3GL.vs");
