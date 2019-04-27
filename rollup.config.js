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

data.push(createData("Senko", "./src/Senko.mjs", "./build/Senko.module.mjs", true, true));
data.push(createData("Senko", "./src/Senko.mjs", "./build/Senko.umd.js", false, true));
data.push(createData("SenkoText", "./src/SenkoText.mjs", "./build/SenkoText.module.mjs", true, true));
data.push(createData("SenkoText", "./src/SenkoText.mjs", "./build/SenkoText.umd.js", false, true));
data.push(createData("SenkoS3", "./src/SenkoS3.mjs", "./build/SenkoS3.module.mjs", true, true));
data.push(createData("SenkoS3", "./src/SenkoS3.mjs", "./build/SenkoS3.umd.js", false, true));
data.push(createData("SenkoMath", "./src/SenkoMath.mjs", "./build/SenkoMath.module.mjs", true, true));
data.push(createData("SenkoMath", "./src/SenkoMath.mjs", "./build/SenkoMath.umd.js", false, true));

export default data;
