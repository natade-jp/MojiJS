/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Complex from "./Complex.js";

const ConstructorTool = {

	match2 : function(text, regexp) {
		// 対象ではないregexpの情報以外も抽出match
		// つまり "1a2b" で \d を抽出すると、次のように抽出される
		// [false "1"]
		// [true "a"]
		// [false "2"]
		// [true "b"]
		// 0 ... 一致したかどうか
		// 1 ... 一致した文字列、あるいは一致していない文字列
		const output = [];
		let search_target = text;
		let match = true;
		for(let x = 0; x < 1000; x++) {
			match = search_target.match(regexp);
			if(match === null) {
				if(search_target.length) {
					output.push([ false, search_target ]);
				}
				break;
			}
			if(match.index > 0) {
				output.push([ false, search_target.substr(0, match.index) ]);
			}
			output.push([ true, match[0] ]);
			search_target = search_target.substr(match.index + match[0].length);
		}
		return output;
	},
	
	trimBracket : function(text) {
		// 前後に[]があるか確認
		if( !(/^\[/).test(text) || !(/\]$/).test(text)) {
			return null;
		}
		// 前後の[]を除去
		return text.substring(1, text.length - 1);
	},

	toMatrixFromStringForArrayJSON : function(text) {
		const matrix_array = [];
		// さらにブランケット内を抽出
		let rows = text.match(/\[[^\]]+\]/g);
		if(rows === null) {
			// ブランケットがない場合は、1行行列である
			rows = [text];
		}
		// 各ブランケット内を列ごとに調査
		for(let row_count = 0; row_count < rows.length; row_count++) {
			const row = rows[row_count];
			const column_array = row.substring(1, row.length - 1).split(",");
			const rows_array = [];
			for(let col_count = 0; col_count < column_array.length; col_count++) {
				const column = column_array[col_count];
				rows_array[col_count] = new Complex(column);
			}
			matrix_array[row_count] = rows_array;
		}
		return matrix_array;
	},

	InterpolationCalculation : function(from, delta, to) {
		const FromIsGreaterThanTo = to.compareTo(from);
		if(FromIsGreaterThanTo === 0) {
			return from;
		}
		if(delta.isZero()) {
			throw "IllegalArgumentException";
		}
		// delta が負のため、どれだけたしても to にならない。
		if(delta.isNegative() && (FromIsGreaterThanTo === -1)) {
			throw "IllegalArgumentException";
		}
		const rows_array = [];
		let num = from;
		rows_array[0] = num;
		for(let i = 1; i < 0x10000; i++) {
			num = num.add(delta);
			if(num.compareTo(to) === FromIsGreaterThanTo) {
				break;
			}
			rows_array[i] = num;
		}
		return rows_array;
	},

	toArrayFromString : function(row_text) {
		// 左が実数（強制）で右が複素数（任意）タイプ
		const reg1 = /[+-]? *[0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?( *[+-] *[- ]([0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?)?[ij])?/;
		// 左が複素数（強制）で右が実数（任意）タイプ
		const reg2 = /[+-]? *([0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?)?[ij]( *[+] *[- ]([0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?)?)?/;
		// reg2優先で検索
		const reg3 = new RegExp("(" + reg2.source + ")|(" + reg1.source + ")", "i");
		// 問題として 1 - -jが通る

		const xs = ConstructorTool.match2(row_text, reg3);
		const rows_array = [];

		for(let i = 0; i < xs.length; i++) {
			const xx = xs[i];
			if(!xx[0]) {
				// 一致していないデータであれば次へ
				continue;
			}
			// 「:記法」 1:3 なら 1,2,3。 1:2:9 なら 1:3:5:7:9
			if((i < xs.length - 2) && !xs[i + 1][0] && /:/.test(xs[i + 1][1])) {
				let from, delta, to;
				if((i < xs.length - 4) && !xs[i + 3][0] && /:/.test(xs[i + 3][1])) {
					from = new Complex(xx[1]);
					delta = new Complex(xs[i + 2][1]);
					to = new Complex(xs[i + 4][1]);
					i += 4;
				}
				else {
					from = new Complex(xx[1]);
					delta = Complex.ONE;
					to = new Complex(xs[i + 2][1]);
					i += 2;
				}
				const ip_array = ConstructorTool.InterpolationCalculation(from, delta, to);
				for(let j = 0; j < ip_array.length; j++) {
					rows_array.push(ip_array[j]);
				}
			}
			else {
				rows_array.push(new Complex(xx[1]));
			}
		}

		return rows_array;
	},

	toMatrixFromStringForArrayETC : function(text) {
		// 行ごとを抽出して
		const matrix_array = [];
		const rows = text.split(";");
		for(let row_count = 0; row_count < rows.length; row_count++) {
			// 各行の文字を解析
			matrix_array[row_count] = ConstructorTool.toArrayFromString(rows[row_count]);
		}
		return matrix_array;
	},

	toMatrixFromStringForArray : function(text) {
		// JSON形式
		if(/[[\],]/.test(text)) {
			return ConstructorTool.toMatrixFromStringForArrayJSON(text);
		}
		// それ以外(MATLAB, Octave, Scilab)
		else {
			return ConstructorTool.toMatrixFromStringForArrayETC(text);
		}
	},

	toMatrixFromString : function(text) {
		// 前後のスペースを除去
		const trimtext = text.replace(/^\s*|\s*$/g, "");
		// ブランケットを外す
		const withoutBracket = ConstructorTool.trimBracket(trimtext);
		if(withoutBracket) {
			// 配列用の初期化
			return ConstructorTool.toMatrixFromStringForArray(withoutBracket);
		}
		else {
			// スカラー用の初期化
			return [new Complex(text)];
		}
	},

	isCorrectMatrixArray : function(m_array) {
		if(m_array.length === 0) {
			return false;
		}
		const num = m_array[0].length;
		if(num === 0) {
			return false;
		}
		for(let i = 1; i < m_array.length; i++) {
			if(m_array[i].length !== num) {
				return false;
			}
		}
		return true;
	}
};

export default class Matrix {
	constructor() {
		let matrix_array = null;
		if(arguments.length === 1) {
			const y = arguments[0];
			if(y instanceof Matrix) {
				matrix_array = [];
				for(let i = 0; i < y.row_length; i++) {
					matrix_array[i] = [];
					for(let j = 0; j < y.column_length; j++) {
						matrix_array[i][j] = y[i][j];
					}
				}
			}
			else if(y instanceof Complex) {
				matrix_array = [[y]];
			}
			else if(y instanceof Array) {
				matrix_array = [];
				for(let row_count = 0; row_count < y.length; row_count++) {
					const row = y[row_count];
					if(row instanceof Complex) {
						matrix_array[row_count] = row;
					}
					else if(row instanceof Array) {
						const rows_array = [];
						for(let col_count = 0; col_count < row.length; col_count++) {
							const column = row[col_count];
							if(column instanceof Complex) {
								rows_array[col_count] = column;
							}
							else {
								rows_array[col_count] = new Complex(column);
							}
						}
						matrix_array[row_count] = rows_array;
					}
					else {
						matrix_array[row_count] = new Complex(row);
					}
				}
			}
			else if(typeof y === "string" || y instanceof String) {
				matrix_array = ConstructorTool.toMatrixFromString(y);
			}
			else if(y instanceof Object && y.toString) {
				matrix_array = ConstructorTool.toMatrixFromString(y.toString());
			}
			else {
				matrix_array = [[new Complex(y)]];
			}
		}
		if(!ConstructorTool.isCorrectMatrixArray(matrix_array)) {
			throw "IllegalArgumentException";
		}
		this.matrix_array = matrix_array;
		this.row_length = this.matrix_array.length;
		this.column_length = this.matrix_array[0].length;
		this.string_cash = null;
	}

	_each(eachfunc) {
		// 行優先ですべての値に対して指定した関数を実行する
		for(let i = 0; i < this.row_length; i++) {
			const row = this.matrix_array[i];
			for(let j = 0; j < this.column_length; j++) {
				eachfunc(row[j], i, j);
			}
		}
	}

	clone() {
		return new Matrix(this.matrix_array);
	}

	get scalar() {
		return this.matrix_array[0][0];
	}

	static createConstMatrix() {
		if((arguments.length === 1) && (arguments[0] instanceof Matrix)) {
			return arguments[0];
		}
		else {
			return new Matrix(...arguments);
		}
	}

	createMatrixDoEachCalculation(eachfunc) {
		const output = this.clone();
		output._each(eachfunc);
		return output;
	}
	
	toString() {
		if(this.string_cash) {
			return this.string_cash;
		}
		const exp_turn_point = 9;
		const exp_turn_num = Math.pow(10, exp_turn_point);
		const exp_point = 4;
		let isDrawImag = false;
		let isDrawExp = false;

		// 行列を確認して表示するための表示方法の確認する
		this._each(
			function(num) {
				if(!num.isReal()) {
					isDrawImag = true;
				}
				if(Math.abs(num._re) >= exp_turn_num) {
					isDrawExp = true;
				}
				if(Math.abs(num._im) >= exp_turn_num) {
					isDrawExp = true;
				}
			}
		);

		// 文字列データを作成とともに、最大の長さを記録する
		let str_max = 0;
		const draw_buff = [];
		// 数値データを文字列にする関数（eの桁がある場合は中身は3桁にする）
		const toStrFromFloat = function(text) {
			if(!isDrawExp) {
				return text.toFixed();
			}
			const str = text.toExponential(exp_point);
			const split = str.split("e");
			let exp_text = split[1];
			if(exp_text.length === 2) {
				exp_text = exp_text.substr(0, 1) + "00" + exp_text.substr(1);
			}
			else if(exp_text.length === 3) {
				exp_text = exp_text.substr(0, 1) + "0" + exp_text.substr(1);
			}
			return split[0] + "e" + exp_text;
		};
		this._each(
			function(num) {
				const data = {};
				let real = num._re;
				data.re_sign = real < 0 ? "-" : " ";
				real = Math.abs(real);
				data.re_str = toStrFromFloat(real);
				str_max = Math.max(str_max, data.re_str.length + 1);
				if(isDrawImag) {
					let imag = num._im;
					data.im_sign = imag < 0 ? "-" : "+";
					imag = Math.abs(imag);
					data.im_str = toStrFromFloat(imag);
					str_max = Math.max(str_max, data.im_str.length + 1);
				}
				draw_buff.push(data);
			}
		);

		// 右寄せ用関数
		const right = function(text, length) {
			const space = "                                        ";
			return space.substr(0, length - text.length) + text;
		};
		// 出力用文字列を作成する
		const output = [];
		const that = this;
		this._each(
			function(num, i, j) {
				const data = draw_buff.shift();
				let text = right(data.re_sign + data.re_str, str_max);
				if(isDrawImag) {
					text += " " + data.im_sign + right(data.im_str, str_max) + "i";
				}
				output.push(text);
				output.push((j < that.column_length - 1) ? " " : "\n");
			}
		);

		this.string_cash = output.join("");

		return this.string_cash;
	}

	isSquareMatrix() {
		return this.row_length === this.column_length;
	}

	isScalar() {
		return this.row_length === 1 && this.column_length == 1;
	}

	static _checkMatrixArrayErrorType1(M1, M2) {
		if(	((M1.row_length % M2.row_length) === 0 || (M2.row_length % M1.row_length) === 0) &&
			((M1.column_length % M2.column_length) === 0 || (M2.column_length % M1.column_length) === 0) ) {
			throw "IllegalArgumentMatrixException";
		}
	}

	add() {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(...arguments);
		Matrix._checkMatrixErrorType1(M1, M2);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y = [];
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		for(let row = 0; row < y_row_length; row++) {
			y[row] = [];
			for(let col = 0; col < y_column_length; col++) {
				y[row][col] = x1[row % M1.row_length][col % M1.column_length].add(x2[row % M2.row_length][col % M2.column_length]);
			}
		}
		return new Matrix(y);
	}

	sub() {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(...arguments);
		Matrix._checkMatrixErrorType1(M1, M2);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y = [];
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		for(let row = 0; row < y_row_length; row++) {
			y[row] = [];
			for(let col = 0; col < y_column_length; col++) {
				y[row][col] = x1[row % M1.row_length][col % M1.column_length].sub(x2[row % M2.row_length][col % M2.column_length]);
			}
		}
		return new Matrix(y);
	}

	mul() {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(...arguments);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		if(M1.isScalar() && M2.isScalar()) {
			return new Matrix(x1.matrix_array[0][0].mul(x2.matrix_array[0][0]));
		}
		const y = [];
		if(M1.isScalar()) {
			for(let row = 0; row < M2.row_length; row++) {
				y[row] = [];
				for(let col = 0; col < M2.column_length; col++) {
					y[row][col] = x1[0][0].mul(x2[row][col]);
				}
			}
			return new Matrix(y);
		}
		else if(M2.isScalar()) {
			for(let row = 0; row < M1.row_length; row++) {
				y[row] = [];
				for(let col = 0; col < M1.column_length; col++) {
					y[row][col] = x1[row][col].mul(x2[0][0]);
				}
			}
			return new Matrix(y);
		}
		if((M1.row_length !== M1.column_length) || (M2.row_length !== M1.column_length)) {
			throw "IllegalArgumentMatrixException";
		}
		for(let row = 0; row < M1.row_length; row++) {
			y[row] = [];
			for(let col = 0; col < M1.column_length; col++) {
				let sum = Complex.ZERO;
				for(let i = 0; i < M1.row_length; i++) {
					sum = sum.add(x1[row][i].mul(x2[i][col]));
				}
				y[row][col] = sum;
			}
		}
		return new Matrix(y);
	}

}
