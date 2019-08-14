const File = require("./File.js");

const jest_config_js = {
	"verbose": true,
	"rootDir": "./src",
	"moduleFileExtensions": [
		"js",
		"mjs"
	],
	// @ts-ignore
	"testMatch": [
	],
	"transform": {
		"^.+\\.(js|mjs)$": "babel-jest"
	}
};

if(process.argv[2]) {
	const test_file_name = process.argv[2];
	jest_config_js["testMatch"].push("**/?(*.)" + test_file_name + ".test.?(m)js");
}
else {
	jest_config_js["testMatch"].push("**/__tests__/**/*.?(m)js?(x)");
	jest_config_js["testMatch"].push("**/?(*.)(spec|test).?(m)js?(x)");
}

File.saveTextFile(
	"jest.config.js",
	"module.exports = " + JSON.stringify( jest_config_js ) + ";"
);

File.exec("npx jest");

File.deleteFile("jest.config.js");
