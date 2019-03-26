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
import Random from "../basic/Random.js";

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
		// 「:」のみ記載されていないかの確認
		if(row_text.trim() === ":") {
			return ":";
		}
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
			return [[new Complex(text)]];
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
	
	/**
	 * 複素行列 (immutable)
	 * @param {Object} number 行列データ( "1 + j", [1 , 1] など)
	 */
	constructor(number) {
		let matrix_array = null;
		let is_check_string = false;
		if(arguments.length === 1) {
			const y = number;
			if(y instanceof Matrix) {
				matrix_array = [];
				for(let i = 0; i < y.row_length; i++) {
					matrix_array[i] = [];
					for(let j = 0; j < y.column_length; j++) {
						matrix_array[i][j] = y.matrix_array[i][j];
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
					// 毎行ごと調査
					if(row instanceof Array) {
						const rows_array = [];
						for(let col_count = 0; col_count < row.length; col_count++) {
							const column = row[col_count];
							if(column instanceof Complex) {
								rows_array[col_count] = column;
							}
							else if(column instanceof Matrix) {
								if(!column.isScalar()) {
									throw "Matrix in matrix";
								}
								rows_array[col_count] = column.scalar;
							}
							else {
								rows_array[col_count] = new Complex(column);
							}
						}
						matrix_array[row_count] = rows_array;
					}
					else {
						// 1行の行列を定義する
						if(row_count === 0) {
							matrix_array[0] = [];
						}
						if(row instanceof Complex) {
							matrix_array[0][row_count] = row;
						}
						else if(row instanceof Matrix) {
							if(!row.isScalar()) {
								throw "Matrix in matrix";
							}
							matrix_array[0][row_count] = row.scalar;
						}
						else {
							matrix_array[0][row_count] = new Complex(row);
						}
					}
				}
			}
			else if(typeof y === "string" || y instanceof String) {
				is_check_string = true;
				matrix_array = ConstructorTool.toMatrixFromString(y);
			}
			else if(y instanceof Object && y.toString) {
				is_check_string = true;
				matrix_array = ConstructorTool.toMatrixFromString(y.toString());
			}
			else {
				matrix_array = [[new Complex(y)]];
			}
		}
		else {
			throw "Many arguments : " + arguments.length;
		}
		if(is_check_string) {
			// 文字列データの解析の場合、":" データが紛れていないかを確認する。
			// 紛れていたらその行は削除する。
			for(let row = 0; row < matrix_array.length; row++) {
				if(matrix_array[row] === ":") {
					matrix_array.splice(row--, 1);
				}
			}
		}
		if(!ConstructorTool.isCorrectMatrixArray(matrix_array)) {
			throw "new Matrix IllegalArgumentException";
		}
		this.matrix_array = matrix_array;
		this.row_length = this.matrix_array.length;
		this.column_length = this.matrix_array[0].length;
		this.string_cash = null;
	}

	/**
	 * 複製します
	 * @returns {Matrix}
	 */
	clone() {
		return new Matrix(this.matrix_array);
	}

	/**
	 * 文字列データ
	 * @returns {String} 
	 */
	toString() {
		if(this.string_cash) {
			return this.string_cash;
		}
		const exp_turn_point = 9;
		const exp_turn_num = Math.pow(10, exp_turn_point);
		const exp_point = 4;
		let isDrawImag = false;
		let isDrawExp = false;
		let draw_decimal_position = 0;

		// 行列を確認して表示するための表示方法の確認する
		this._each(
			function(num) {
				if(!num.isReal()) {
					isDrawImag = true;
				}
				if(Math.abs(num.real) >= exp_turn_num) {
					isDrawExp = true;
				}
				if(Math.abs(num.imag) >= exp_turn_num) {
					isDrawExp = true;
				}
				draw_decimal_position = Math.max(draw_decimal_position, num.getDecimalPosition());
			}
		);

		if(draw_decimal_position > 0) {
			draw_decimal_position = exp_point;
		}

		// 文字列データを作成とともに、最大の長さを記録する
		let str_max = 0;
		const draw_buff = [];
		// 数値データを文字列にする関数（eの桁がある場合は中身は3桁にする）
		const toStrFromFloat = function(number) {
			if(!isDrawExp) {
				return number.toFixed(draw_decimal_position);
			}
			const str = number.toExponential(exp_point);
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
				let real = num.real;
				data.re_sign = real < 0 ? "-" : " ";
				real = Math.abs(real);
				data.re_str = toStrFromFloat(real);
				str_max = Math.max(str_max, data.re_str.length + 1);
				if(isDrawImag) {
					let imag = num.imag;
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
			function(num, row, col) {
				const data = draw_buff.shift();
				let text = right(data.re_sign + data.re_str, str_max);
				if(isDrawImag) {
					text += " " + data.im_sign + right(data.im_str, str_max) + "i";
				}
				output.push(text);
				output.push((col < that.column_length - 1) ? " " : "\n");
			}
		);

		this.string_cash = output.join("");

		return this.string_cash;
	}

	/**
	 * A.equals(B)
	 * @param {Object} number
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean} A === B
	 */
	equals(number, epsilon) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		if((M1.row_length !== M2.row_length) || (M1.column_length !== M2.column_length)) {
			return false;
		}
		if((M1.row_length === 1) || (M1.column_length ===1)) {
			return M1.scalar.equals(M2.scalar);
		}
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		for(let row = 0; row < this.row_length; row++) {
			for(let col = 0; col < this.column_length; col++) {
				if(!x1[row][col].equals(x2[row][col], epsilon)) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 引数から行列を作成する（作成が不要の場合はnewしない）
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	static createConstMatrix(number) {
		if((arguments.length === 1) && (number instanceof Matrix)) {
			return number;
		}
		else {
			return new Matrix(number);
		}
	}
	
	/**
	 * キャッシュを削除する
	 */
	_clearCash() {
		if(this.string_cash) {
			delete this.string_cash;
		}
	}

	/**
	 * 行列内の全ての値に処理を加えます。ミュータブルです。
	 * 内部処理用
	 * @param {Function} eachfunc Function(num, row, col)
	 * @returns {Matrix} 自分自身を返します。
	 */
	_each(eachfunc) {
		let isclearcash = false;
		// 行優先ですべての値に対して指定した関数を実行する。内容を書き換える可能性もある
		for(let row = 0; row < this.row_length; row++) {
			for(let col = 0; col < this.column_length; col++) {
				const ret = eachfunc(this.matrix_array[row][col], row, col);
				if(ret === undefined) {
					continue;
				}
				else if(ret instanceof Complex) {
					this.matrix_array[row][col] = ret;
				}
				else if(ret instanceof Matrix) {
					this.matrix_array[row][col] = ret.scalar;
				}
				else {
					this.matrix_array[row][col] = new Complex(ret);
				}
				isclearcash = true;
			}
		}
		if(isclearcash) {
			this._clearCash();
		}
		return this;
	}

	/**
	 * 自分の行列内の全ての値に処理を加えます。イミュータブルです。
	 * @param {Function} eachfunc Function(row, col)
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix} 新規作成に処理を加えた行列
	 */
	static createMatrixDoEachCalculation(eachfunc, dimension, column_length) {
		if((arguments.length === 0) || (arguments.length > 3)) {
			throw "IllegalArgumentException";
		}
		const y = [];
		const y_row_length = dimension;
		const y_column_length = column_length ? column_length : dimension;
		for(let row = 0; row < y_row_length; row++) {
			y[row] = [];
			for(let col = 0; col < y_column_length; col++) {
				const ret = eachfunc(row, col);
				if(ret === undefined) {
					continue;
				}
				else if(ret instanceof Complex) {
					y[row][col] = ret;
				}
				else if(ret instanceof Matrix) {
					y[row][col] = ret.scalar;
				}
				else {
					y[row][col] = new Complex(ret);
				}
			}
		}
		return new Matrix(y);
	}

	/**
	 * 自分の行列内の全ての値に処理を加えます。イミュータブルです。
	 * @param {Function} eachfunc Function(num, row, col)
	 * @returns {Matrix} 新規作成に処理を加えた行列
	 */
	cloneMatrixDoEachCalculation(eachfunc) {
		return this.clone()._each(eachfunc);
	}

	// ----------------------
	// 内部の値を取得する
	// ----------------------
	
	/**
	 * 行列の最初の要素を返します。スカラー値を取得するときに使用してください。
	 * @returns {Complex}
	 */
	get scalar() {
		return this.matrix_array[0][0];
	}

	/**
	 * 行列の最も大きい行数、列数を返す
	 * @returns {Number}
	 */
	get length() {
		return this.row_length > this.column_length ? this.row_length : this.column_length;
	}

	/**
	 * 行列の1ノルム
	 * @returns {Number}
	 */
	get norm1() {
		const y = this.matrix_array;
		// 行ノルムを計算する
		if(this.isRow()) {
			let sum = 0.0;
			for(let col = 0; col < this.column_length; col++) {
				sum += y[0][col].norm;
			}
			return sum;
		}
		// 列ノルムを計算する
		else if(this.isColumn()) {
			let sum = 0.0;
			for(let row = 0; row < this.row_length; row++) {
				sum = y[row][0].norm;
			}
			return sum;
		}
		// 列の和の最大値
		let max = 0;
		// 列を固定して行の和を計算
		for(let col = 0; col < this.column_length; col++) {
			let sum = 0;
			for(let row = 0; row < this.row_length; row++) {
				sum += y[row][col].norm;
			}
			if(max < sum) {
				max = sum;
			}
		}
		return max;
	}
	
	/**
	 * 行列の2ノルム
	 * @returns {Number}
	 */
	get norm2() {
		const y = this.matrix_array;
		// 行ノルムを計算する
		if(this.isRow()) {
			let sum = 0.0;
			for(let col = 0; col < this.column_length; col++) {
				sum += y[0][col].square().real;
			}
			return Math.sqrt(sum);
		}
		// 列ノルムを計算する
		else if(this.isColumn()) {
			let sum = 0.0;
			for(let row = 0; row < this.row_length; row++) {
				sum = y[row][0].square().real;
			}
			return Math.sqrt(sum);
		}
		// 行列の2ノルムは未実装
		// max(svd(X))
		throw "norm2";
	}

	/**
	 * 作成中
	 * @param {Number} arg1 位置／行番号／ベクトルの場合は何番目のベクトルか
	 * @param {Number} arg2 列番号（行番号と列番号でした場合（任意））
	 * @returns {Object} 1つを指定した場合はComplex, 2つ以上指定した場合はMatrix
	 */
	get(arg1, arg2) {
		let arg1_data = null;
		let arg2_data = null;
		
		{
			if(typeof arg1 === "string" || arg1 instanceof String) {
				arg1_data = new Matrix(arg1);
			}
			else {
				arg1_data = arg1;
			}
		}
		if(arguments.length === 2) {
			if(typeof arg2 === "string" || arg2 instanceof String) {
				arg2_data = new Matrix(arg2);
			}
			else {
				arg2_data = arg2;
			}
		}

		const get_scalar = function(x) {
			let y;
			let is_scalar = false;
			if(typeof arg1 === "number" || arg1 instanceof Number) {
				y = Math.round(x);
				is_scalar = true;
			}
			else if(arg1 instanceof Complex)  {
				y = Math.round(x.real);
				is_scalar = true;
			}
			else if((arg1 instanceof Matrix) && arg1.isScalar()) {
				y = Math.round(x.scalar.real);
				is_scalar = true;
			}
			return {
				number : y,
				is_scalar : is_scalar
			};
		};

		let is_scalar = true;
		let arg1_scalar = null;
		let arg2_scalar = null;

		if(arguments.length === 1) {
			arg1_scalar = get_scalar(arg1_data);
			is_scalar &= arg1_scalar.is_scalar;
		}
		else if(arguments.length === 2) {
			arg1_scalar = get_scalar(arg1_data);
			is_scalar &= arg1_scalar.is_scalar;
			arg2_scalar = get_scalar(arg2_data);
			is_scalar &= arg2_scalar.is_scalar;
		}

		if(is_scalar) {
			if(this.isRow()) {
				return this.matrix_array[0][arg1_scalar.number];
			}
			else if(this.isColumn()) {
				return this.matrix_array[arg1_scalar.number][0];
			}
			else {
				return this.matrix_array[arg1_scalar.number][arg2_scalar.number];
			}
		}
		
		return null;
	}

	// ----------------------
	// 行列の作成関係
	// ----------------------
	
	/**
	 * 単位行列を作成
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static eye(dimension, column_length) {
		return Matrix.createMatrixDoEachCalculation(function(row, col) {
			return row === col ? Complex.ONE : Complex.ZERO;
		}, dimension, column_length);
	}
	
	/**
	 * 指定した数値で初期化
	 * @param {Object} number 
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static memset(number, dimension, column_length) {
		if((arguments.length === 0) || (arguments.length > 3)) {
			throw "IllegalArgumentException";
		}
		if((number instanceof Matrix) && (!number.isScalar())) {
			const x = number.matrix_array;
			const x_row_length = number.row_length;
			const x_column_length = number.column_length;
			return Matrix.createMatrixDoEachCalculation(function(row, col) {
				return x[row % x_row_length][col % x_column_length];
			}, dimension, column_length);
		}
		else {
			let x = 0;
			if((number instanceof Matrix) && (number.isScalar())) {
				x = number.scalar;
			}
			else {
				x = Complex.createConstComplex(number);
			}
			return Matrix.createMatrixDoEachCalculation(function() {
				return x;
			}, dimension, column_length);
		}
	}

	/**
	 * 0で初期化
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static zeros(dimension, column_length) {
		if((arguments.length === 0) || (arguments.length > 2)) {
			throw "IllegalArgumentException";
		}
		return Matrix.memset(Complex.ZERO, dimension, column_length);
	}

	/**
	 * 1で初期化
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static ones(dimension, column_length) {
		if((arguments.length === 0) || (arguments.length > 2)) {
			throw "IllegalArgumentException";
		}
		return Matrix.memset(Complex.ONE, dimension, column_length);
	}

	/**
	 * ランダム値で初期化
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static rand(dimension, column_length) {
		return Matrix.createMatrixDoEachCalculation(function() {
			return Complex.rand();
		}, dimension, column_length);
	}

	/**
	 * 正規分布に従うランダム値で初期化
	 * @param {Number} dimension 次元数
	 * @param {Number} column_length 列数（任意）
	 * @returns {Matrix}
	 */
	static randn(dimension, column_length) {
		return Matrix.createMatrixDoEachCalculation(function() {
			return Complex.randn();
		}, dimension, column_length);
	}

	// TODO 行列の結合がほしい

	// ----------------------
	// 判定関係
	// ----------------------
	
	/**
	 * スカラー値の判定
	 * @returns {Boolean}
	 */
	isScalar() {
		return this.row_length === 1 && this.column_length == 1;
	}
	
	/**
	 * 行ベクトル／横ベクトルの判定
	 * @returns {Boolean}
	 */
	isRow() {
		return this.row_length === 1;
	}
	
	/**
	 * 列ベクトル／縦ベクトルの判定
	 * @returns {Boolean}
	 */
	isColumn() {
		return this.column_length === 1;
	}

	/**
	 * ベクトルの判定
	 * @returns {Boolean}
	 */
	isVector() {
		return this.row_length === 1 || this.column_length === 1;
	}

	/**
	 * 行列の判定
	 * @returns {Boolean}
	 */
	isMatrix() {
		return this.row_length !== 1 && this.column_length !== 1;
	}

	/**
	 * 正方行列の判定
	 * @returns {Boolean}
	 */
	isSquare() {
		return this.row_length === this.column_length;
	}

	/**
	 * 実行列の判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isReal(epsilon) {
		let is_real = true;
		this._each(function(num){
			if(is_real && (num.isComplex(epsilon))) {
				is_real = false;
			}
		});
		return is_real;
	}

	/**
	 * 複素行列の判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isComplex(epsilon) {
		let is_complex = true;
		this._each(function(num){
			if(is_complex && (num.isReal(epsilon))) {
				is_complex = false;
			}
		});
		return is_complex;
	}

	/**
	 * 零行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isZero(epsilon) {
		let is_zeros = true;
		const tolerance = epsilon ? epsilon : 1.0e-10;
		this._each(function(num){
			if(is_zeros && (!num.isZero(tolerance))) {
				is_zeros = false;
			}
		});
		return is_zeros;
	}

	/**
	 * 単位行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isIdentity(epsilon) {
		if(!this.isDiagonal()) {
			return false;
		}
		const tolerance = epsilon ? epsilon : 1.0e-10;
		for(let row = 0; row < this.row_length; row++) {
			if(!this.matrix_array[row][row].isOne(tolerance)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 対角行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isDiagonal(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		let is_diagonal = true;
		const tolerance = epsilon ? epsilon : 1.0e-10;
		this._each(function(num, row, col){
			if(is_diagonal && (row !== col) && (!num.isZero(tolerance))) {
				is_diagonal = false;
			}
		});
		return is_diagonal;
	}
	
	/**
	 * 三重対角行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isTridiagonal(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		let is_tridiagonal = true;
		const tolerance = epsilon ? epsilon : 1.0e-10;
		this._each(function(num, row, col){
			if(is_tridiagonal && (Math.abs(row - col) > 1) && (!num.isZero(tolerance))) {
				is_tridiagonal = false;
			}
		});
		return is_tridiagonal;
	}

	/**
	 * 正則行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isRegular(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		// ランクが行列の次元と等しいかどうかで判定
		// det(M) != 0 でもよいが、時間がかかる可能性があるので
		// 誤差は自動で計算など本当はもうすこし良い方法を考える必要がある
		const tolerance = epsilon ? epsilon : 1.0e-10;
		return (this.rank(1.0e-10).equals(this.row_length, tolerance));
	}

	/**
	 * 直行行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isOrthogonal(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		const tolerance = epsilon ? epsilon : 1.0e-10;
		return (this.mul(this.transpose()).isIdentity(tolerance));
	}

	/**
	 * ユニタリ行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isUnitary(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		const tolerance = epsilon ? epsilon : 1.0e-10;
		return (this.mul(this.ctranspose()).isIdentity(tolerance));
	}

	/**
	 * 対称行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isSymmetric(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		const tolerance = epsilon ? epsilon : 1.0e-10;
		for(let row = 0; row < this.row_length; row++) {
			for(let col = row + 1; col < this.column_length; col++) {
				if(!this.matrix_array[row][col].equals(this.matrix_array[col][row], tolerance)) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * エルミート行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isHermitian(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		const tolerance = epsilon ? epsilon : 1.0e-10;
		for(let row = 0; row < this.row_length; row++) {
			for(let col = row; col < this.column_length; col++) {
				if(row === col) {
					if(!this.matrix_array[row][col].isReal(tolerance)) {
						return false;
					}
				}
				else if(!this.matrix_array[row][col].equals(this.matrix_array[col][row].conj(), tolerance)) {
					return false;
				}
			}
		}
		return true;
	}


	/**
	 * A.size() = [row_length column_length] 行列のサイズを取得
	 * @returns {Matix}
	 */
	size() {
		// 行列のサイズを取得
		return new Matrix([[this.row_length, this.column_length]]);
	}

	/**
	 * A.max() 行列内の最大値ベクトル、ベクトル内の最大スカラー値を取得
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matix}
	 */
	max(epsilon) {
		if(this.isRow()) {
			let y = this.matrix_array[0][0];
			for(let col = 1; col < this.column_length; col++) {
				if(y.compareTo(this.matrix_array[0][col], epsilon) > 0) {
					y = this.matrix_array[0][col];
				}
			}
			return new Matrix(y);
		}
		else {
			const y = [];
			y[0] = [];
			for(let col = 0; col < this.column_length; col++) {
				y[0][col] = this.matrix_array[0][col];
				for(let row = 1; row < this.row_length; row++) {
					if(y[0][col].compareTo(this.matrix_array[row][col], epsilon) > 0) {
						y[0][col] = this.matrix_array[row][col];
					}
				}
			}
			return new Matrix(y);
		}
	}
	
	/**
	 * A.min() 行列内の最小値ベクトル、ベクトル内の最小スカラー値を取得
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matix}
	 */
	min(epsilon) {
		if(this.isRow()) {
			let y = this.matrix_array[0][0];
			for(let col = 1; col < this.column_length; col++) {
				if(y.compareTo(this.matrix_array[0][col], epsilon) < 0) {
					y = this.matrix_array[0][col];
				}
			}
			return new Matrix(y);
		}
		else {
			const y = [];
			y[0] = [];
			for(let col = 0; col < this.column_length; col++) {
				y[0][col] = this.matrix_array[0][col];
				for(let row = 1; row < this.row_length; row++) {
					if(y[0][col].compareTo(this.matrix_array[row][col], epsilon) < 0) {
						y[0][col] = this.matrix_array[row][col];
					}
				}
			}
			return new Matrix(y);
		}
	}

	// ----------------------
	// 四則演算
	// ----------------------
	
	/**
	 * A.add(B) = A + B
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	add(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		if(	((M1.row_length % M2.row_length) === 0 || (M2.row_length % M1.row_length) === 0) &&
			((M1.column_length % M2.column_length) === 0 || (M2.column_length % M1.column_length) === 0) ) {
			throw "Matrix size does not match";
		}
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		return Matrix.createMatrixDoEachCalculation(function(row, col) {
			return x1[row % M1.row_length][col % M1.column_length].add(x2[row % M2.row_length][col % M2.column_length]);
		}, y_row_length, y_column_length);
	}

	/**
	 * A.sub(B) = A - B
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	sub(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		if(	((M1.row_length % M2.row_length) === 0 || (M2.row_length % M1.row_length) === 0) &&
			((M1.column_length % M2.column_length) === 0 || (M2.column_length % M1.column_length) === 0) ) {
			throw "Matrix size does not match";
		}
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		return Matrix.createMatrixDoEachCalculation(function(row, col) {
			return x1[row % M1.row_length][col % M1.column_length].sub(x2[row % M2.row_length][col % M2.column_length]);
		}, y_row_length, y_column_length);
	}

	/**
	 * A.mul(B) = A * B
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	mul(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		if(M1.isScalar() && M2.isScalar()) {
			return new Matrix(x1.scalar.mul(x2.scalar));
		}
		const y = [];
		if(M1.isScalar()) {
			for(let row = 0; row < M2.row_length; row++) {
				y[row] = [];
				for(let col = 0; col < M2.column_length; col++) {
					y[row][col] = M1.scalar.mul(x2[row][col]);
				}
			}
			return new Matrix(y);
		}
		else if(M2.isScalar()) {
			for(let row = 0; row < M1.row_length; row++) {
				y[row] = [];
				for(let col = 0; col < M1.column_length; col++) {
					y[row][col] = x1[row][col].mul(M2.scalar);
				}
			}
			return new Matrix(y);
		}
		if(M1.column_length !== M2.row_length) {
			throw "Matrix size does not match";
		}
		for(let row = 0; row < M1.row_length; row++) {
			y[row] = [];
			for(let col = 0; col < M2.column_length; col++) {
				let sum = Complex.ZERO;
				for(let i = 0; i < M1.column_length; i++) {
					sum = sum.add(x1[row][i].mul(x2[i][col]));
				}
				y[row][col] = sum;
			}
		}
		return new Matrix(y);
	}

	/**
	 * A.inv() = 単位行列 / A
	 * @returns {Matrix}
	 */
	inv() {
		if(this.isScalar()) {
			return new Matrix(Complex.ONE.div(this.scalar));
		}
		if(!this.isSquare()) {
			throw "not square";
		}
		if(this.isDiagonal()) {
			// 対角行列の場合は、対角成分のみ逆数をとる
			const y = new Matrix(this);
			for(let i = 0; i < y.row_length; i++) {
				y.matrix_array[i][i] = y.matrix_array[i][i].inv();
			}
			return y;
		}
		// (ここで正規直交行列の場合なら、転置させるなど入れてもいい？判定はできないけども)
		const len = this.column_length;
		// ガウス・ジョルダン法
		// 初期値の設定
		const M = new Matrix(this);
		M._concat_left(Matrix.eye(len));
		const long_matrix_array = M.matrix_array;
		const long_length = M.column_length;

		//前進消去
		for(let k = 0; k < len; k++) {
			//ピポットの選択
			{
				// k列目で最も大きな行を取得(k列目から調べる)
				const row_num = M._max_row_number(k, k);
				//交換を行う
				M._exchange_row(k, row_num);
			}
			//ピポットの正規化
			{
				const normalize_value = long_matrix_array[k][k].inv();
				for(let row = k, col = k; col < long_length; col++) {
					long_matrix_array[row][col] = long_matrix_array[row][col].mul(normalize_value);
				}
			}
			//消去
			for(let row = 0;row < len; row++) {
				if(row === k) {
					continue;
				}
				const temp = long_matrix_array[row][k];
				for(let col = k; col < long_length; col++)
				{
					long_matrix_array[row][col] = long_matrix_array[row][col].sub(long_matrix_array[k][col].mul(temp));
				}
			}
		}

		const y = [];
		//右の列を抜き取る
		for(let row = 0; row < len; row++) {
			y[row] = [];
			for(let col = 0; col < len; col++) {
				y[row][col] = long_matrix_array[row][len + col];
			}
		}

		return new Matrix(y);
	}

	/**
	 * A.div(B) = A / B
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	div(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		if(M1.isScalar() && M2.isScalar()) {
			return new Matrix(x1.scalar.div(x2.scalar));
		}
		const y = [];
		if(M2.isScalar()) {
			for(let row = 0; row < M1.row_length; row++) {
				y[row] = [];
				for(let col = 0; col < M1.column_length; col++) {
					y[row][col] = x1[row][col].div(M2.scalar);
				}
			}
			return new Matrix(y);
		}
		if(M2.row_length === M2.column_length) {
			return this.mul(M2.inv());
		}
		if(M1.column_length !== M2.column_length) {
			throw "Matrix size does not match";
		}
		
		// 疑似逆行列を使用するとよいと思われる
		// return this.mul(M2.pinv());
		// 未実装なのでエラー
		throw "Unimplemented";
	}

	/**
	 * A.nmul(B) = A .* B 各項ごとの掛け算
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	nmul(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		if(	((M1.row_length % M2.row_length) === 0 || (M2.row_length % M1.row_length) === 0) &&
			((M1.column_length % M2.column_length) === 0 || (M2.column_length % M1.column_length) === 0) ) {
			throw "Matrix size does not match";
		}
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		return Matrix.createMatrixDoEachCalculation(function(row, col) {
			return x1[row % M1.row_length][col % M1.column_length].mul(x2[row % M2.row_length][col % M2.column_length]);
		}, y_row_length, y_column_length);
	}

	/**
	 * A.ndiv(B) = A ./ B 各項ごとの割り算
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	ndiv(number) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		if(	((M1.row_length % M2.row_length) === 0 || (M2.row_length % M1.row_length) === 0) &&
			((M1.column_length % M2.column_length) === 0 || (M2.column_length % M1.column_length) === 0) ) {
			throw "Matrix size does not match";
		}
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const y_row_length = Math.max(M1.row_length, M2.row_length);
		const y_column_length = Math.max(M1.column_length, M2.column_length);
		return Matrix.createMatrixDoEachCalculation(function(row, col) {
			return x1[row % M1.row_length][col % M1.column_length].div(x2[row % M2.row_length][col % M2.column_length]);
		}, y_row_length, y_column_length);
	}

	// ----------------------
	// Comlexクラスの機能
	// ----------------------

	/**
	 * 各項の実部
	 * @returns {Matrix}
	 */
	real() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return new Complex(num.real);
		});
	}
	
	/**
	 * 各項の虚部
	 * @returns {Matrix}
	 */
	imag() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return new Complex(num.imag);
		});
	}

	/**
	 * 各項の偏角（極座標の角度）
	 * @returns {Matrix}
	 */
	angle() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return new Complex(num.angle);
		});
	}

	/**
	 * 各項の符号値
	 * @returns {Matrix}
	 */
	sign() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return new Complex(num.sign());
		});
	}

	/**
	 * 各項の整数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testInteger(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isInteger(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の複素整数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testComplexInteger(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isComplexInteger(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の 0 を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testZero(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isZero(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の 1 を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testOne(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isOne(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}
	
	/**
	 * 各項の複素数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testComplex(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isComplex(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の実数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testReal(epsilon) {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isReal(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の非数を判定(1 or 0)
	 * @returns {Matrix}
	 */
	testNaN() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isNaN() ? Complex.ONE : Complex.ZERO;
		});
	}


	/**
	 * real(x) > 0
	 * @returns {Boolean}
	 */
	testPositive() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isPositive() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * real(x) < 0
	 * @returns {Boolean}
	 */
	testNegative() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isNegative() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * real(x) >= 0
	 * @returns {Boolean}
	 */
	testNotNegative() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isNotNegative() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の無限を判定
	 * @returns {Boolean}
	 */
	testInfinite() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isInfinite() ? Complex.ONE : Complex.ZERO;
		});
	}
	
	/**
	 * 各項の有限数を判定
	 * @returns {Boolean}
	 */
	testFinite() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.isFinite() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 各項の絶対値をとる
	 * @returns {Matrix}
	 */
	abs() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.abs();
		});
	}

	/**
	 * 複素共役行列
	 * @returns {Matrix}
	 */
	conj() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.conj();
		});
	}

	/**
	 * 各項に -1 を掛け算する
	 * @returns {Matrix}
	 */
	negate() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.negate();
		});
	}

	/**
	 * 各項に sqrt()
	 * @returns {Matrix}
	 */
	sqrt() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.sqrt();
		});
	}

	/**
	 * 各項に pow(x)
	 * @param {Object} number スカラー
	 * @returns {Matrix}
	 */
	pow(number) {
		const M = Matrix.createConstMatrix(number);
		if(!M.isScalar()) {
			throw "not set Scalar";
		}
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.pow(M.scalar);
		});
	}

	/**
	 * 各項に log()
	 * @returns {Matrix}
	 */
	log() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.log();
		});
	}

	/**
	 * 各項に exp()
	 * @returns {Matrix}
	 */
	exp() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.exp();
		});
	}

	/**
	 * 各項に sin()
	 * @returns {Matrix}
	 */
	sin() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.sin();
		});
	}

	/**
	 * 各項に cos()
	 * @returns {Matrix}
	 */
	cos() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.cos();
		});
	}

	/**
	 * 各項に tan()
	 * @returns {Matrix}
	 */
	tan() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.tan();
		});
	}
	
	/**
	 * 各項に atan()
	 * @returns {Matrix}
	 */
	atan() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.atan();
		});
	}

	/**
	 * 各項に atan2()
	 * @param {Object} number スカラー
	 * @returns {Matrix}
	 */
	atan2(number) {
		const M = Matrix.createConstMatrix(number);
		if(!M.isScalar) {
			throw "not set Scalar";
		}
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.atan2(M.scalar);
		});
	}

	/**
	 * 各項に floor()
	 * @returns {Matrix}
	 */
	floor() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.floor();
		});
	}

	/**
	 * 各項に ceil()
	 * @returns {Matrix}
	 */
	ceil() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.ceil();
		});
	}

	/**
	 * 各項に round()
	 * @returns {Matrix}
	 */
	round() {
		return this.cloneMatrixDoEachCalculation(function(num) {
			return num.round();
		});
	}

	// ----------------------
	// 行列の計算でよく使用する処理。前提条件があるメソッド、ミュータブル
	// ----------------------

	/**
	 * 行列を拡張します。ミュータブルです。
	 * 拡張した場合は、0を初期値にします。
	 * 内部処理用
	 * @param {Number} row_length 新しい行の長さ
	 * @param {Number} column_length 新しい列の長さ
	 * @returns {Matrix} 自分自身を返します。
	 */
	_resize(row_length, column_length) {
		if((row_length === this.row_length) && (column_length === this.column_length)) {
			return this;
		}
		if((row_length <= 0) || (column_length <= 0)) {
			throw "_resize";
		}
		const row_max = Math.max(this.row_length, row_length);
		const col_max = Math.max(this.column_length, column_length);
		const y = this.matrix_array;
		// 大きくなった行と列に対してゼロで埋める
		for(let row = 0; row < row_max; row++) {
			if(row >= this.row_length) {
				y[row] = [];
			}
			for(let col = 0; col < col_max; col++) {
				if((row >= this.row_length) || (col >= this.column_length)) {
					y[row][col] = Complex.ZERO;
				}
			}
		}
		// 小さくなった行と列を削除する
		if(this.row_length > row_length) {
			y.splice(row_length);
		}
		if(this.column_length > column_length) {
			for(let row = 0; row < y.length; row++) {
				y[row].splice(column_length);
			}
		}
		this.row_length = row_length;
		this.column_length = column_length;
		this._clearCash();
		return this;
	}

	/**
	 * 行を消去します。ミュータブルです。
	 * 内部処理用
	 * @param {Number} row_index 行番号
	 * @returns {Matrix} 自分自身を返します。
	 */
	_delete_row(row_index) {
		if((this.row_length === 1) || (this.row_length <= row_index)) {
			throw "_delete_row";
		}
		this.matrix_array.splice(row_index, 1);
		this.row_length--;
		this._clearCash();
		return this;
	}
	
	/**
	 * 列を消去します。ミュータブルです。
	 * 内部処理用
	 * @param {Number} column_index 列番号
	 * @returns {Matrix} 自分自身を返します。
	 */
	_delete_column(column_index) {
		if((this.column_length === 1) || (this.column_length <= column_index)) {
			throw "_delete_column";
		}
		for(let row = 0; row < this.row_length; row++) {
			this.matrix_array[row].splice(column_index, 1);
		}
		this.column_length--;
		this._clearCash();
		return this;
	}

	/**
	 * 行を交換します。ミュータブルです。
	 * 内部処理用
	 * @param {Number} row_index1 行番号1
	 * @param {Number} row_index2 行番号2
	 * @returns {Matrix} 自分自身を返します。
	 */
	_exchange_row(row_index1, row_index2) {
		if((this.row_length === 1) || (this.row_length <= row_index1) || (this.row_length <= row_index2)) {
			throw "_exchange_row";
		}
		if(row_index1 === row_index2) {
			return this;
		}
		const swap = this.matrix_array[row_index1];
		this.matrix_array[row_index1] = this.matrix_array[row_index2];
		this.matrix_array[row_index2] = swap;
		this._clearCash();
		return this;
	}

	/**
	 * 行を交換します。ミュータブルです。
	 * 内部処理用
	 * @param {Number} column_index1 行番号1
	 * @param {Number} column_index2 行番号2
	 * @returns {Matrix} 自分自身を返します。
	 */
	_exchange_column(column_index1, column_index2) {
		if((this.column_length === 1) || (this.column_length <= column_index1) || (this.column_length <= column_index2)) {
			throw "_exchange_column";
		}
		if(column_index1 === column_index2) {
			return this;
		}
		for(let row = 0; row < this.row_length; row++) {
			const swap = this.matrix_array[row][column_index1];
			this.matrix_array[row][column_index1] = this.matrix_array[row][column_index2];
			this.matrix_array[row][column_index2] = swap;
		}
		this._clearCash();
		return this;
	}

	/**
	 * 行列の右に行列をくっつけます。ミュータブルです。
	 * 内部処理用
	 * @param {Matrix} left_matrix 結合したい行列
	 * @returns {Matrix} 自分自身を返します。
	 */
	_concat_left(left_matrix) {
		for(let row = 0; row < this.row_length; row++) {
			for(let col = 0; col < left_matrix.column_length; col++) {
				this.matrix_array[row].push(left_matrix.matrix_array[row][col]);
			}
		}
		this.column_length += left_matrix.column_length;
		this._clearCash();
		return this;
	}

	/**
	 * 行列の下に行列をくっつけます。ミュータブルです。
	 * 内部処理用
	 * @param {Matrix} left_matrix 結合したい行列
	 * @returns {Matrix} 自分自身を返します。
	 */
	_concat_bottom(bottom_matrix) {
		for(let row = 0; row < bottom_matrix.row_length; row++) {
			this.matrix_array.push(bottom_matrix.matrix_array[row]);
		}
		this.row_length += bottom_matrix.row_length;
		this._clearCash();
		return this;
	}

	/**
	 * 列の中で最もノルムが最大の値がある行番号を返します。ミュータブルです。
	 * 内部処理用
	 * @param {Number} column_index 列番号
	 * @param {Number} row_index_offset 行のオフセット(この値から行う)
	 * @param {Number} row_index_max 行の最大(この値は含めない)
	 * @returns {Number} 行番号
	 */
	_max_row_number(column_index, row_index_offset, row_index_max) {
		let row_index = 0;
		let row_max = 0;
		let row = row_index_offset ? row_index_offset : 0;
		const row_imax = row_index_max ? row_index_max : this.row_length;
		// n列目で最も大きな行を取得
		for(; row < row_imax; row++) {
			const norm = this.matrix_array[row][column_index].norm;
			if(norm > row_max) {
				row_max = norm;
				row_index = row;
			}
		}
		return row_index;
	}

	/**
	 * 行列の各行をベクトルと見立て、線型従属している行を抽出する
	 * 内部処理用
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Array} 行番号の行列(昇順)
	 */
	_get_linear_dependence_vector(epsilon) {
		const M = new Matrix(this);
		const m = M.matrix_array;
		const tolerance = epsilon ? epsilon : 1.0e-10;
		// 確認する行番号（ここから終わった行は削除していく）
		const row_index_array = [];
		for(let i = 0; i < this.row_length; i++) {
			row_index_array[i] = i;
		}
		// ガウスの消去法を使用して、行ベクトルを抽出していく
		for(let col_target = 0; col_target < M.column_length; col_target++) {
			let row_max_index = 0;
			{
				let row_max = 0;
				let row_max_key = 0;
				// n列目で絶対値が最も大きな行を取得
				for(const row_key in row_index_array) {
					const row = row_index_array[row_key];
					const norm = m[row][col_target].norm;
					if(norm > row_max) {
						row_max = norm;
						row_max_key = row_key;
						row_max_index = row;
					}
				}
				// 大きいのが0である＝その列は全て0である
				if(row_max <= tolerance) {
					continue;
				}
				// 大きな値があった行は、リストから除去する
				row_index_array.splice(row_max_key, 1);
				if(col_target === M.column_length - 1) {
					break;
				}
			}
			// 次の列から、大きな値があった行の成分を削除
			for(const row_key in row_index_array) {
				const row = row_index_array[row_key];
				const inv = m[row][col_target].div(m[row_max_index][col_target]);
				for(let col = col_target; col < M.column_length; col++) {
					m[row][col] = m[row][col].sub(m[row_max_index][col].mul(inv));
				}
			}
		}
		return row_index_array;
	}

	/**
	 * 行列をベクトルと見立て、正規直行化し、QとRの行列を作る
	 * 内部処理用
	 * @param {Matrix} M 正方行列
	 * @returns {Object}
	 */
	static _gram_schmidt_orthonormalization(M) {
		// グラム・シュミットの正規直交化法を使用する
		// 参考：Gilbert Strang (2007). Computational Science and Engineering.

		const len = M.column_length;
		const A = M.matrix_array;
		const Q_Matrix = Matrix.zeros(len);
		const R_Matrix = Matrix.zeros(len);
		const Q = Q_Matrix.matrix_array;
		const R = R_Matrix.matrix_array;
		const non_orthogonalized = [];
		const a = [];
		
		for(let col = 0; col < len; col++) {
			// i列目を抽出
			for(let row = 0; row < len; row++) {
				a[row] = A[row][col];
			}
			// 直行ベクトルを作成
			if(col > 0) {
				// Rのi列目を内積で計算する
				for(let j = 0; j < col; j++) {
					for(let k = 0; k < len; k++) {
						R[j][col] = R[j][col].add(Q[k][j].mul(A[k][col]));
					}
				}
				for(let j = 0; j < col; j++) {
					for(let k = 0; k < len; k++) {
						a[k] = a[k].sub(R[j][col].mul(Q[k][j]));
					}
				}
			}
			{
				// 正規化と距離を1にする
				for(let j = 0; j < len; j++) {
					R[col][col] = R[col][col].add(a[j].mul(a[j]));
				}
				R[col][col] = R[col][col].sqrt();
				if(R[col][col].isZero(1e-10)) {
					// 直行化が不可能だった列の番号をメモして、その列はゼロで埋める
					non_orthogonalized.push(col);
					for(let j = 0;j < len;j++) {
						Q[j][col] = Complex.ZERO;
					}
				}
				else {
					// ここで R[i][i] === 0 の場合、直行させたベクトルaは0であり、
					// ランク落ちしており、計算不可能である。
					// 0割りした値を、j列目のQに記録していくがInfとなる。
					for(let j = 0;j < len;j++) {
						Q[j][col] = a[j].div(R[col][col]);
					}
				}
			}
		}
		return {
			Q : Q_Matrix,
			R : R_Matrix,
			non_orthogonalized : non_orthogonalized
		};
	}
	
	/**
	 * 行列の全行ベクトルに対して、直行したベクトルを作成する
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix} 直行したベクトルがなければNULLを返す
	 */
	_createOrthogonalVector(epsilon) {
		const M = new Matrix(this);
		const m = M.matrix_array;
		const tolerance = epsilon ? epsilon : 1.0e-10;
		// 正則行列をなす場合に問題となる行番号を取得
		const not_regular_rows = M._get_linear_dependence_vector(tolerance);
		// 不要な行を削除する
		{
			// not_regular_rowsは昇順リストなので、後ろから消していく
			for(let i = not_regular_rows.length - 1; i >= 0; i--) {
				m.splice(not_regular_rows[i], 1);
				M.row_length--;
			}
		}
		// 追加できるベクトルの数
		const add_vectors = this.column_length - m.length;
		if(add_vectors <= 0) {
			return null;
		}
		// ランダムベクトル（seed値は毎回同一とする）
		const noise = new Random(0);
		let orthogonal_matrix = null;
		for(let i = 0; i < 100; i++) {
			// 直行ベクトルを作るために、いったん行と列を交換する
			// これは、グラム・シュミットの正規直交化法が列ごとに行う手法のため。
			const M2 = M.T();
			// ランダム行列を作成する
			const R = Matrix.createMatrixDoEachCalculation(function() {
				return new Complex(noise.nextGaussian());
			}, M2.row_length, add_vectors);
			// 列に追加する
			M2._concat_left(R);
			// 正規直行行列を作成する
			orthogonal_matrix = Matrix._gram_schmidt_orthonormalization(M2);
			// 正しく作成できていたら完了
			if(orthogonal_matrix.non_orthogonalized.length === 0) {
				break;
			}
		}
		if(orthogonal_matrix.non_orthogonalized.length !== 0) {
			// 普通は作成できないことはないが・・・
			console.log("miss");
			return null;
		}
		// 作成した列を切り出す
		const y = [];
		const q = orthogonal_matrix.Q.matrix_array;
		for(let row = 0; row < add_vectors; row++) {
			y[row] = [];
			for(let col = 0; col < this.column_length; col++) {
				y[row][col] = q[col][this.column_length - add_vectors + row];
			}
		}
		return new Matrix(y);
	}

	// ----------------------
	// 行列用の計算
	// ----------------------

	/**
	 * 行列のpノルムを計算する
	 * @returns {Number}
	 */
	norm(p) {
		if(arguments.length === 0) {
			return this.norm2;
		}
		if(p === 1) {
			return this.norm1;
		}
		else if(p === 2) {
			return this.norm2;
		}
		else if((p === Number.POSITIVE_INFINITY) || (p === Number.NEGATIVE_INFINITY)) {
			const y = this.matrix_array;
			let compare = p === Number.POSITIVE_INFINITY ? 0 : Number.POSITIVE_INFINITY;
			// 行を固定して列の和を計算
			for(let row = 0; row < this.row_length; row++) {
				let sum = 0.0;
				for(let col = 0; col < this.column_length; col++) {
					sum += y[row][col].norm;
				}
				if(p === Number.POSITIVE_INFINITY) {
					compare = Math.max(compare, sum);
				}
				else {
					compare = Math.min(compare, sum);
				}
			}
			return compare;
		}
		if(this.isVector()) {
			// 一般化ベクトルpノルム
			let sum = 0.0;
			for(let i = 0; i < this.length; i++) {
				sum = Math.pow(this.get(i).norm, p);
			}
			return Math.pow(sum, 1.0 / p);
		}
		// 未実装
		throw "norm";
	}

	/**
	 * A.dot(B) = ドット積（内積）
	 * @param {Object} number 
	 * @param {Number} dimension (任意)
	 * @returns {Matrix}
	 */
	dot(number, dimension) {
		const M1 = this;
		const M2 = Matrix.createConstMatrix(number);
		const x1 = M1.matrix_array;
		const x2 = M2.matrix_array;
		const dim = dimension ? dimension : 1;
		if(M1.isScalar() && M2.isScalar()) {
			return new Matrix(x1.scalar.mul(x2.scalar));
		}
		if(M1.isVector() && M2.isVector()) {
			let sum = Complex.ZERO;
			for(let i = 0; i < M1.length; i++) {
				sum = sum.add(x1.get(i).mul(x2.get(i)));
			}
			return new Matrix(sum);
		}
		if((M1.row_length !== M2.row_length) || (M1.column_length !== M2.column_length)) {
			throw "Matrix size does not match";
		}
		if(dim === 1) {
			const y = [];
			y[0] = [];
			for(let col = 0; col < M1.column_length; col++) {
				let sum = Complex.ZERO;
				for(let row = 0; row < M1.row_length; row++) {
					sum = sum.add(x1[row][col].mul(x2[row][col]));
				}
				y[0][col] = sum;
			}
			return new Matrix(y);
		}
		else if(dim === 2) {
			const y = [];
			for(let row = 0; row < M1.row_length; row++) {
				let sum = Complex.ZERO;
				for(let col = 0; col < M1.column_length; col++) {
					sum = sum.add(x1[row][col].mul(x2[row][col]));
				}
				y[row] = [sum];
			}
			return new Matrix(y);
		}
		else {
			throw "dim";
		}
	}
	
	/**
	 * 行列のランク
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Number}
	 */
	rank(epsilon) {
		return Math.abs(this.row_length, this.column_length) - (this._get_linear_dependence_vector(epsilon)).length;
	}

	/**
	 * 転置行列
	 * @returns {Matrix}
	 */
	transpose() {
		const y = [];
		for(let col = 0; col < this.column_length; col++) {
			y[col] = [];
			for(let row = 0; row < this.row_length; row++) {
				y[col][row] = this.matrix_array[row][col];
			}
		}
		return new Matrix(y);
	}

	/**
	 * エルミート転置行列
	 * @returns {Matrix}
	 */
	ctranspose() {
		return this.transpose().conj();
	}

	/**
	 * エルミート転置行列
	 * @returns {Matrix}
	 */
	T() {
		return this.ctranspose();
	}

	/**
	 * A.det() = [A] 行列式
	 * @returns {Matrix}
	 */
	det() {
		if(!this.isSquare()) {
			throw "not square";
		}
		const M = this.matrix_array;
		const calcDet = function(x) {
			if(x.length === 2) {
				// 2次元の行列式になったら、たすき掛け計算する
				return x[0][0].mul(x[1][1]).sub(x[0][1].mul(x[1][0]));
			}
			let y = Complex.ZERO;
			for(let i = 0; i < x.length; i++) {
				// N次元の行列式を、N-1次元の行列式に分解していく
				const D = [];
				const a = x[i][0];
				for(let row = 0, D_low = 0; row < x.length; row++) {
					if(i === row) {
						continue;
					}
					D[D_low] = [];
					for(let col = 1, D_col = 0; col < x.length; col++, D_col++) {
						D[D_low][D_col] = x[row][col];
					}
					D_low++;
				}
				if((i % 2) === 0) {
					y = y.add(a.mul(calcDet(D)));
				}
				else {
					y = y.sub(a.mul(calcDet(D)));
				}
			}
			return y;
		};
		return new Matrix(calcDet(M));
	}

	/**
	 * A.linsolve(B) = Ax = B となる xを解く
	 * @param {Object} number 
	 * @returns {Matrix}
	 */
	linsolve(number) {
		if(!this.isSquare()) {
			throw "Matrix size does not match";
		}
		// 連立一次方程式を解く
		const len = this.column_length;
		const arg = Matrix.createConstMatrix(number);
		if((arg.row_length !== this.row_length) || (arg.column_length > 1)) {
			throw "Matrix size does not match";
		}
		// 行列を準備する
		const M = new Matrix(this);
		M._concat_left(arg);
		const long_matrix_array = M.matrix_array;
		const long_length = M.column_length;
		// ガウスの消去法で連立1次方程式の未知数を求める
		//前進消去
		for(let k = 0; k < (len - 1); k++) {
			//ピポットの選択
			{
				// k列目で最も大きな行を取得(k列目から調べる)
				const row_num = M._max_row_number(k, k);
				//交換を行う
				M._exchange_row(k, row_num);
			}
			//ピポットの正規化
			{
				const normalize_value = long_matrix_array[k][k].inv();
				for(let row = k, col = k; col < long_length; col++) {
					long_matrix_array[row][col] = long_matrix_array[row][col].mul(normalize_value);
				}
			}
			//消去
			for(let row = k + 1;row < len; row++) {
				const temp = long_matrix_array[row][k];
				for(let col = k; col < long_length; col++)
				{
					long_matrix_array[row][col] = long_matrix_array[row][col].sub(long_matrix_array[k][col].mul(temp));
				}
			}
		}
		//後退代入
		const y = [];
		y[len - 1] = long_matrix_array[len - 1][len].div(long_matrix_array[len - 1][len - 1]);
		for(let row = len - 2; row >= 0; row--) {
			y[row] = long_matrix_array[row][long_length - 1];
			for(let j = row + 1; j < len; j++) {
				y[row] = y[row].sub(long_matrix_array[row][j] * y[j]);
			}
			y[row] = y[row].div(long_matrix_array[row][row]);
		}
		const y2 = [];
		for(let row = 0; row < this.row_length; row++) {
			y2[row] = [y[row]];
		}

		return new Matrix(y2);
	}

	/**
	 * {Q, R} = A.qr() QR分解を行う
	 * @returns {Object} {Q, R} Qは正規直行行列、Rは上三角行列
	 */
	qr() {
		// 行列を準備する
		const M = new Matrix(this);
		// 作成後のQとRのサイズ
		const Q_row_length = this.row_length;
		const Q_column_length = this.row_length;
		const R_row_length = this.row_length;
		const R_column_length = this.column_length;
		// 計算時の行と列のサイズ
		const dummy_size = Math.max(this.row_length, this.column_length);
		// 正方行列にする
		M._resize(dummy_size, dummy_size);
		// 正規直行化
		const orthogonal_matrix = Matrix._gram_schmidt_orthonormalization(M);
		// 計算したデータを取得
		const Q_Matrix = orthogonal_matrix.Q;
		const R_Matrix = orthogonal_matrix.R;
		const non_orthogonalized = orthogonal_matrix.non_orthogonalized;
		// Qのサイズを成型する
		if(non_orthogonalized.length !== 0) {
			// 直行化できていない列があるため直行化できてない列以外を抽出
			const map = {};
			for(let i = 0; i < non_orthogonalized.length; i++) {
				map[non_orthogonalized[i]] = 1;
			}
			const orthogonalized = [];
			for(let i = 0; i < dummy_size; i++) {
				if(map[i]) {
					continue;
				}
				const array = [];
				for(let j = 0; j < dummy_size; j++) {
					array[j] = Q_Matrix.matrix_array[j][i];
				}
				orthogonalized.push(array);
			}
			// 直行ベクトルを作成する
			const orthogonal_vector = (new Matrix(orthogonalized))._createOrthogonalVector();
			// 直行化できていない列を差し替える
			for(let i = 0; i < non_orthogonalized.length; i++) {
				const q_col = non_orthogonalized[i];
				for(let j = 0; j < dummy_size; j++) {
					Q_Matrix.matrix_array[j][q_col] = orthogonal_vector.matrix_array[i][j];
				}
			}
		}
		Q_Matrix._resize(Q_row_length, Q_column_length);
		// Rのサイズを成形する
		R_Matrix._resize(R_row_length, R_column_length);
		return {
			Q : Q_Matrix,
			R : R_Matrix
		};
	}

	/**
	 * n行n列のギブンス回転行列を作成
	 * @param {Number} n 行列のサイズ
	 * @param {Number} p 行番号
	 * @param {Number} q 列番号
	 * @param {Number} phi 回転角度 
	 * @returns {Matrix} G(n,p,q,phi)
	 */
	static createGivensRotation(n, p, q, phi) {
		const m = Matrix.eye(n);
		m.matrix_array[p][p] = new Complex(Math.cos(phi));
		m.matrix_array[p][q] = new Complex(Math.sin(phi));
		m.matrix_array[q][p] = new Complex(-Math.sin(phi));
		m.matrix_array[q][q] = m.matrix_array[p][p];
		return m;
	}

	/**
	 * ヤコビ法により固有値を求める
	 * このオブジェクトは実対称行列である必要がある
	 * @returns {Object} {V, D} Vは固有ベクトルの行列、Dは固有値の行列
	 */
	eigForJacobiMethod() {
		if(this.isScalar()) {
			return new Matrix(this.scalar);
		}
		if(!this.isSquare()) {
			throw "not square matrix";
		}
		if(!this.isSymmetric()) {
			throw "not Symmetric";
		}
		if(this.isComplex()) {
			throw "not Real Matrix";
		}

		const length = this.row_length;
		let V = Matrix.eye(length);
		const A = new Matrix(this);

		// 作りかけ
		let a = A.matrix_array;

		for(let count = 0;count < 150;count++) {

			// 行列Aの非対角成分Apqの中から絶対値が最大の成分を探す
			// p < q とすることにより上三角から調べる
			let p = 0;
			let q = 1;
			let max_value = a[p][q].norm;
			for(let row = 0; row < length; row++) {
				for(let col = row + 1; col < length; col++) {
					const norm = a[row][col].norm;
					if(max_value < norm) {
						max_value = norm;
						p = row;
						q = col;
					}
				}
			}

			// 非対角要素がほぼ0になるまで繰り返す
			if(max_value < 1e-14) {
				break;
			}

			// 以下、ギブンス回転

			// a_pp + a_qq
			const pp_add_qq = a[p][p].add(a[q][q]);
			// a_pp - a_qq
			const pp_sub_qq = a[p][p].sub(a[q][q]);
			// (a_pp + a_qq)*0.5
			const half_pp_add_qq = pp_add_qq.mul(Complex.HALF);
			// (a_pp - a_qq)*0.5
			const half_pp_sub_qq = pp_sub_qq.mul(Complex.HALF);

			// shita を求める
			let phi1;
			let phi2;
			if(pp_sub_qq.isZero()) {
				// π / 4
				phi1 = new Complex(Math.PI / 4.0);
				phi2 = new Complex(Math.PI / 2.0);
			}
			else {
				// 0.5 * atan( (2 * a_pq) / (a_pp - a_qq) )
				phi1 = Complex.HALF.mul((Complex.TWO.negate().mul(a[p][q]).div(pp_sub_qq)).atan());
				phi2 = phi1.mul(Complex.TWO);
			}

			// cos(s)
			const cos = phi1.cos();
			// sin(s)
			const sin = phi1.sin();
			// cos(2s)
			const cos2 = phi2.cos();
			// sin(2s)
			const sin2 = phi2.sin();

			const b = [];
			for(let i = 0; i < length; i++) {
				b[i] = [];
				for(let j = 0; j < length; j++) {
					let y;
					if((i === p) && (j === p)) {
						// b_pp
						y = half_pp_add_qq.add(half_pp_sub_qq.mul(cos2)).sub(a[p][q].mul(sin2));
					}
					else if((i === q) && (j === q)) {
						// b_qq
						y = half_pp_add_qq.sub(half_pp_sub_qq.mul(cos2)).add(a[p][q].mul(sin2));
					}
					else if(
						((i === p) && (j === q)) || 
						((i === q) && (j === p))) {
						// b_pq = b_qp
						// この計算は回転によって0になるはず？
						// y = half_pp_sub_qq.negate().mul(sin2).add(a[p][q].mul(sin2));
						y = Complex.ZERO;
					}
					else if(i === p) {
						// b_pj
						y = a[p][j].mul(cos).sub(a[q][j].mul(sin));
					}
					else if(j === p) {
						// b_ip
						y = a[p][i].mul(cos).sub(a[q][i].mul(sin));
					}
					else if(i === q) {
						// b_qj
						y = a[p][j].mul(sin).add(a[q][j].mul(cos));
					}
					else if(j === q) {
						// b_iq
						y = a[p][i].mul(sin).add(a[q][i].mul(cos));
					}
					else {
						// b_ij
						y = a[i][j];
					}
					b[i][j] = y;
				}
			}

			a = b;
			V = V.mul(Matrix.createGivensRotation(length, p, q, phi1));
		}

		// 最終的に代入
		A.matrix_array = a;

		return {
			V : V,
			D : A
		};
	}

	/**
	 * 固有値（工事中）
	 * @param {Object} info
	 * @returns {Object} {V, D} Vは固有ベクトルの行列、Dは固有値の行列
	 */
	eig(info) {
		if(this.isScalar()) {
			return new Matrix(this.scalar);
		}
		if(!this.isSquare()) {
			throw "not square matrix";
		}
		let VD;
		if(this.isSymmetric() && this.isReal()) {
			// ヤコビ法により固有値を求める
			VD = this.eigForJacobiMethod();
		}
		else {
			// 未実装なのでエラー
			// べき乗法 とかある
			throw "Unimplemented";
		}
		if(!info) {
			return VD;
		}

		if(info.is_sort) {
			const vd_sort = function(V, D) {
				const len = D.row_length;
				const sortdata = [];
				for(let i = 0; i < len; i++) {
					sortdata[i] = {
						sigma : D.matrix_array[i][i],
						index : i
					};
				}
				const compare = function(a, b){
					return a.sigma.compareTo(b.sigma);
				};
				sortdata.sort(compare);
				const MOVE = Matrix.zeros(len);
				const ND = Matrix.zeros(len);
				for(let i = 0; i < len; i++) {
					ND.matrix_array[i][i] = sortdata[i].sigma;
					MOVE.matrix_array[sortdata[i].index][i] = Complex.ONE;
				}
				return {
					V : V.mul(MOVE),
					D : ND
				};
			};

			return vd_sort(VD.V, VD.D);
		}
	}

	/**
	 * SVD分解（工事中）
	 * @returns {Object} {U,S,V}
	 */
	svd() {
		if(!this.isSquare()) {
			// 正方行列じゃないと、QR関数が使用できないので非対応
			throw "Unimplemented";
		}
		if(this.isComplex()) {
			// 複素数が入っている場合は、eig関数が使用できないので非対応
			throw "Unimplemented";
		}
		const rank = this.rank(1.0e-10).scalar.norm;
		if(rank !== this.column_length) {
			// 後に使用するQR関数が使用できないので非対応
			throw "Unimplemented";
		}
		// SVD分解
		// 参考：Gilbert Strang (2007). Computational Science and Engineering.
		// 対称行列をヤコビ法で固有値を求める
		// 固有値と固有ベクトルのセットはソート済みにする
		const VD = this.T().mul(this).eig({is_sort : true});
		const sigma = Matrix.zeros(this.row_length, this.column_length);
		sigma._each(function(num, row, col) {
			if((row === col) && (row < rank)) {
				return VD.D.get(row, row).sqrt();
			}
		});
		const u = this.mul(VD.V).mul(sigma.inv());
		const QR = u.qr();
		return {
			U : QR.Q,
			S : sigma,
			V : VD.V.T()
		};
	}

}
