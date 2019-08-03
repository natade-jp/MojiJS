// @ts-nocheck

import buble from "rollup-plugin-buble";
import uglifyJS from "rollup-plugin-uglify";
import uglifyES from "rollup-plugin-uglify-es";

/**
 * 公開用ファイルの設定データを作成
 * @param {string} moduleName - ライブラリ名
 * @param {string} input_name - 入力となるES6のライブラリのトップファイル名
 * @param {string} output_name - 出力するファイル名
 * @param {boolean} isES6 - ES6に対応したライブラリとするか否か
 * @param {boolean} isUglify - コードを最小化させるか否か
 */
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

data.push(createData("jptext", "./src/jptext.js", "./build/jptext.module.mjs", true, false));
data.push(createData("jptext", "./src/jptext.js", "./build/jptext.umd.js", false, false));
data.push(createData("jptext", "./src/jptext.js", "./build/jptext.module.min.mjs", true, true));
data.push(createData("jptext", "./src/jptext.js", "./build/jptext.umd.min.js", false, true));

export default data;
