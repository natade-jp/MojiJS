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
					matrix_array[i] = y[i];
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
				if(Math.abs(num._re) >= exp_turn_num) {
					isDrawExp = true;
				}
				if(Math.abs(num._im) >= exp_turn_num) {
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
	 * 行列内の全ての値に処理を加えます。ミュータブルです。
	 * 内部で利用するようです。
	 * @param {Function} eachfunc Function(num, row, col)
	 * @returns {Matrix} 自分自身を返します。
	 */
	_each(eachfunc) {
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
			}
		}
		return this;
	}

	/**
	 * 自分の行列内の全ての値に処理を加えます。イミュータブルです。
	 * @param {Function} eachfunc Function(num, row, col)
	 * @returns {Matrix} 新規作成に処理を加えた行列
	 */
	createMatrixDoEachCalculation(eachfunc) {
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
		if((arguments.length === 0) || (arguments.length > 2)) {
			throw "IllegalArgumentException";
		}
		const y = [];
		const y_row_length = dimension;
		const y_column_length = column_length ? column_length : dimension;
		for(let row = 0; row < y_row_length; row++) {
			y[row] = [];
			for(let col = 0; col < y_column_length; col++) {
				y[row][col] = row === col ? Complex.ONE : Complex.ZERO;
			}
		}
		return new Matrix(y);
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
		const y = [];
		const y_row_length = dimension;
		const y_column_length = column_length ? column_length : dimension;
		if((number instanceof Matrix) && (!number.isScalar())) {
			const x = number.matrix_array;
			const x_row_length = number.row_length;
			const x_column_length = number.column_length;
			for(let row = 0; row < y_row_length; row++) {
				y[row] = [];
				for(let col = 0; col < y_column_length; col++) {
					y[row][col] = x[row % x_row_length][col % x_column_length];
				}
			}
			return new Matrix(y);
		}
		else {
			let x = 0;
			if((number instanceof Matrix) && (number.isScalar())) {
				x = number.scalar;
			}
			else {
				x = Complex.createConstComplex(number);
			}
			for(let row = 0; row < y_row_length; row++) {
				y[row] = [];
				for(let col = 0; col < y_column_length; col++) {
					y[row][col] = x;
				}
			}
			return new Matrix(y);
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
		if((arguments.length === 0) || (arguments.length > 2)) {
			throw "IllegalArgumentException";
		}
		const y = [];
		const y_row_length = dimension;
		const y_column_length = column_length ? column_length : dimension;
		for(let row = 0; row < y_row_length; row++) {
			y[row] = [];
			for(let col = 0; col < y_column_length; col++) {
				y[row][col] = Complex.rand();
			}
		}
		return new Matrix(y);
	}

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
	 * 単位行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isIdentity(epsilon) {
		if(!this.isDiagonal()) {
			return false;
		}
		for(let row = 0; row < this.row_length; row++) {
			if(!this.matrix_array[row][row].isOne(epsilon)) {
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
		for(let row = 0; row < this.row_length; row++) {
			for(let col = 0; col < this.column_length; col++) {
				if(row !== col) {
					if(!this.matrix_array[row][col].isZero(epsilon)) {
						return false;
					}
				}
			}
		}
		return true;
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
		for(let row = 0; row < this.row_length; row++) {
			for(let col = 0; col < this.column_length; col++) {
				if(Math.abs(row - col) > 1) {
					if(!this.matrix_array[row][col].isZero(epsilon)) {
						return false;
					}
				}
			}
		}
		return true;
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
	 * 対称行列を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isSymmetric(epsilon) {
		if(!this.isSquare()) {
			return false;
		}
		for(let row = 0; row < this.row_length; row++) {
			for(let col = row + 1; col < this.column_length; col++) {
				if(!this.matrix_array[row][col].equals(this.matrix_array[col][row], epsilon)) {
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
		if((M1.row_length !== M1.column_length) || (M2.row_length !== M1.column_length)) {
			throw "Matrix size does not match";
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
		const long_matrix_array = [];
		const long_length = len * 2;
		for(let row = 0; row < len; row++) {
			long_matrix_array[row] = [];
			for(let col = 0; col < len; col++) {
				long_matrix_array[row][col] = this.matrix_array[row][col];
				long_matrix_array[row][len + col] = row === col ? Complex.ONE : Complex.ZERO;
			}
		}

		//前進消去
		for(let k = 0; k < len; k++) {
			//ピポットの選択
			{
				let max_number = Complex.ZERO;
				let max_position = k;
				//絶対値が大きいのを調べる
				for(let row = k, col = k; row < len; row++) {
					const abs_data = long_matrix_array[row][col].abs();
					if(max_number.compareTo(abs_data) > 0) {
						max_number = abs_data;
						max_position = row;
					}
				}
				//交換を行う
				if(max_position !== k) {
					const swap = long_matrix_array[k];
					long_matrix_array[k] = long_matrix_array[max_position];
					long_matrix_array[max_position] = swap;
				}
			}
			//正規化
			{
				//ピポット
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

	// ----------------------
	// Comlexクラスの機能
	// ----------------------

	/**
	 * 行列の各値の実部
	 * @returns {Matrix}
	 */
	real() {
		return this.createMatrixDoEachCalculation(function(num) {
			return new Complex(num.real);
		});
	}
	
	/**
	 * 行列の各値の虚部
	 * @returns {Matrix}
	 */
	imag() {
		return this.createMatrixDoEachCalculation(function(num) {
			return new Complex(num.imag);
		});
	}

	/**
	 * 行列の各値のノルム（極座標のノルム）
	 * @returns {Matrix}
	 */
	norm() {
		return this.createMatrixDoEachCalculation(function(num) {
			return new Complex(num.norm);
		});
	}

	/**
	 * 行列の各値の偏角（極座標の角度）
	 * @returns {Matrix}
	 */
	angle() {
		return this.createMatrixDoEachCalculation(function(num) {
			return new Complex(num.angle);
		});
	}

	/**
	 * 行列の各値の符号値
	 * @returns {Matrix}
	 */
	sign() {
		return this.createMatrixDoEachCalculation(function(num) {
			return new Complex(num.sign());
		});
	}

	/**
	 * 整数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testInteger(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isInteger(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 複素整数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testComplexInteger(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isComplexInteger(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 0 を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testZero(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isZero(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 1 を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testOne(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isOne(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}
	
	/**
	 * 複素数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testComplex(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isComplex(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 実数を判定(1 or 0)
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	testReal(epsilon) {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isReal(epsilon) ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 非数を判定(1 or 0)
	 * @returns {Matrix}
	 */
	testNaN() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isNaN() ? Complex.ONE : Complex.ZERO;
		});
	}


	/**
	 * real(x) > 0
	 * @returns {Boolean}
	 */
	testPositive() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isPositive() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * real(x) < 0
	 * @returns {Boolean}
	 */
	testNegative() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isNegative() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * real(x) >= 0
	 * @returns {Boolean}
	 */
	testNotNegative() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isNotNegative() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 無限を判定
	 * @returns {Boolean}
	 */
	testInfinite() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isInfinite() ? Complex.ONE : Complex.ZERO;
		});
	}
	
	/**
	 * 有限数を判定
	 * @returns {Boolean}
	 */
	testFinite() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.isFinite() ? Complex.ONE : Complex.ZERO;
		});
	}

	/**
	 * 行列の各値の絶対値をとる
	 * @returns {Matrix}
	 */
	abs() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.abs();
		});
	}

	/**
	 * 複素共役行列
	 * @returns {Matrix}
	 */
	conj() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.conj();
		});
	}

	/**
	 * 行列の各値に -1 を掛け算する
	 * @returns {Matrix}
	 */
	negate() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.negate();
		});
	}

	/**
	 * 行列の各値に sqrt()
	 * @returns {Matrix}
	 */
	sqrt() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.sqrt();
		});
	}

	/**
	 * 行列の各値に pow(x)
	 * @param {Object} number スカラー
	 * @returns {Matrix}
	 */
	pow(number) {
		const M = Matrix.createConstMatrix(number);
		if(!M.isScalar()) {
			throw "not set Scalar";
		}
		return this.createMatrixDoEachCalculation(function(num) {
			return num.pow(M.scalar);
		});
	}

	/**
	 * 行列の各値に log()
	 * @returns {Matrix}
	 */
	log() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.log();
		});
	}

	/**
	 * 行列の各値に exp()
	 * @returns {Matrix}
	 */
	exp() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.exp();
		});
	}

	/**
	 * 行列の各値に sin()
	 * @returns {Matrix}
	 */
	sin() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.sin();
		});
	}

	/**
	 * 行列の各値に cos()
	 * @returns {Matrix}
	 */
	cos() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.cos();
		});
	}

	/**
	 * 行列の各値に tan()
	 * @returns {Matrix}
	 */
	tan() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.tan();
		});
	}
	
	/**
	 * 行列の各値に atan()
	 * @returns {Matrix}
	 */
	atan() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.atan();
		});
	}

	/**
	 * 行列の各値に atan2()
	 * @param {Object} number スカラー
	 * @returns {Matrix}
	 */
	atan2(number) {
		const M = Matrix.createConstMatrix(number);
		if(!M.isScalar) {
			throw "not set Scalar";
		}
		return this.createMatrixDoEachCalculation(function(num) {
			return num.atan2(M.scalar);
		});
	}

	/**
	 * 行列の各値に floor()
	 * @returns {Matrix}
	 */
	floor() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.floor();
		});
	}

	/**
	 * 行列の各値に ceil()
	 * @returns {Matrix}
	 */
	ceil() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.ceil();
		});
	}

	/**
	 * 行列の各値に round()
	 * @returns {Matrix}
	 */
	round() {
		return this.createMatrixDoEachCalculation(function(num) {
			return num.round();
		});
	}

	// ----------------------
	// 行列用の計算
	// ----------------------
	
	/**
	 * 行列のランク
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Matrix}
	 */
	rank(epsilon) {
		// 対角線を見てランクを計算する
		const R = this.qr().R;
		const min_length = Math.min(R.row_length, R.column_length);
		let rank = min_length;
		//const tol = // 許容誤差
		for(let i = min_length - 1; i >= 0; i--) {
			if(R.matrix_array[i][i].isZero(epsilon)) {
				rank--;
			}
			else {
				break;
			}
		}
		return new Matrix(rank);
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
		const A = this.matrix_array;
		const B = arg.matrix_array;
		if((arg.row_length !== this.row_length) || (arg.column_length > 1)) {
			throw "Matrix size does not match";
		}
		// 行列を準備する
		const long_matrix_array = [];
		const long_length = len + 1;
		for(let row = 0; row < len; row++) {
			long_matrix_array[row] = [];
			for(let col = 0; col < len; col++) {
				long_matrix_array[row][col] = A[row][col];
			}
			long_matrix_array[row][long_length - 1] = B[row][0];
		}
		// ガウスの消去法で連立1次方程式の未知数を求める
		//前進消去
		for(let k = 0; k < (len - 1); k++) {
			//ピポットの選択
			{
				let max_number = Complex.ZERO;
				let max_position = k;
				//絶対値が大きいのを調べる
				for(let row = k, col = k; row < len; row++) {
					const abs_data = long_matrix_array[row][col].abs();
					if(max_number.compareTo(abs_data) > 0) {
						max_number = abs_data;
						max_position = row;
					}
				}
				//交換を行う
				if(max_position !== k) {
					const swap = long_matrix_array[k];
					long_matrix_array[k] = long_matrix_array[max_position];
					long_matrix_array[max_position] = swap;
				}
			}
			//正規化
			{
				//ピポット
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
		const gram_schmidt_orthonormalization = function(M) {
			const len = M.column_length;
			const A = M.matrix_array;
			const Q = [];
			const R = [];
			const a = [];
			
			for(let row = 0; row < len; row++) {
				Q[row] = [];
				R[row] = [];
				for(let col = 0; col < len; col++) {
					Q[row][col] = Complex.ZERO;
					R[row][col] = Complex.ZERO;
				}
			}
			for(let i = 0; i < len; i++) {
				for(let j = 0; j < len; j++) {
					a[j] = A[j][i];
				}
				if(i > 0) {
					for(let j = 0; j < i; j++) {
						for(let k = 0; k < len; k++) {
							R[j][i] = R[j][i].add(Q[k][j].mul(A[k][i]));
						}
					}
					for(let j = 0; j < i; j++) {
						for(let k = 0; k < len; k++) {
							a[k] = a[k].sub(R[j][i].mul(Q[k][j]));
						}
					}
				}
				for(let j = 0; j < len; j++) {
					R[i][i] = R[i][i].add(a[j].mul(a[j]));
				}
				R[i][i] = R[i][i].sqrt();
				for(let j = 0;j < len;j++) {
					Q[j][i] = a[j].div(R[i][i]);
				}
			}
	
			return {
				Q : new Matrix(Q),
				R : new Matrix(R),
			};
		};

		if(this.isSquare()) {
			// 正方行列であれば、グラム・シュミットの正規直交化法を用いてQR分解を行う。
			// Q は正規直交行列、Rは上三角行列である
			return gram_schmidt_orthonormalization(this);
		}
		else {
			// ハウスホルダー変換を用いてQR分解を行う。
			// 未実装なのでエラー
			throw "Unimplemented";
		}

	}

}
