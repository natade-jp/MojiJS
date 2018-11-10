import buble from "rollup-plugin-buble";
import uglifyJS from "rollup-plugin-uglify";
import uglifyES from "rollup-plugin-uglify-es";

export default [
	{
		input: 'src/Senko.js',
		output: {
			file: 'build/Senko.js',
			format: 'esm'
		}
	},
	{
		input: 'src/Senko.js',
		plugins: [
			uglifyES(),
		],
		output: {
			file: 'build/Senko.module.js',
			format: 'esm'
		}
	},
	{
		input: 'src/Senko.js',
		moduleName: "Senko",
		plugins: [
			buble(),
			uglifyJS.uglify(),
		],
		output: {
			file: 'build/Senko.umd.js',
			format: 'umd'
		}
	}
];
