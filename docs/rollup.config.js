import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";

export default {
	entry: "src/Senko.js",
	dest: "build/Senko.js",
	format: "es",
	moduleName: "Senko",
	plugins: [
		buble(),
//		uglify.uglify(),
	],
};
