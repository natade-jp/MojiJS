import buble from "rollup-plugin-buble";
import uglifyJS from "rollup-plugin-uglify";
import uglifyES from "rollup-plugin-uglify-es";

const createData = function(moduleName, input_name, output_name, isES6, isUglify) {
	const data = {};
	data.input = input_name;
	data.output = {};
	data.output.file = output_name;
	data.output.format = isES6 ? "esm" : "umd";

	if(isES6) {
		if(isUglify) {
			data.plugins = [
				uglifyES()
			];
		}
	}
	else {
		data.output.name = moduleName; // ES5 必須
		data.plugins = [
			buble()
		];
		if(isUglify) {
			data.plugins.push(
				uglifyJS.uglify()
			);
		}
	}

	return data;
};

const data = [];

data.push(createData("Senko", "./src/Senko.js", "./build/Senko.js", true, false));
data.push(createData("Senko", "./src/Senko.js", "./build/Senko.module.js", true, true));
data.push(createData("Senko", "./src/Senko.js", "./build/Senko.umd.js", false, true));
data.push(createData("SenkoText", "./src/SenkoText.js", "./build/SenkoText.js", true, false));
data.push(createData("SenkoText", "./src/SenkoText.js", "./build/SenkoText.module.js", true, true));
data.push(createData("SenkoText", "./src/SenkoText.js", "./build/SenkoText.umd.js", false, true));

export default data;
