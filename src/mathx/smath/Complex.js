/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Random from "../basic/Random.js";

const random_class = new Random();

/**
 * 文字列から複素数を解析する
 * @param {String} text 解析したい文字列
 * @param {Complex} that 代入先 
 * @returns
 */
const ToComplexFromString = function(text, that) {
	const str = text.replace(/\s/g, "").toLowerCase();
	// 複素数の宣言がない場合
	if(!(/[ij]/.test(str))) {
		that._re = parseFloat(str);
		that._im = 0.0;
		return;
	}
	// この時点で複素数である。
	// 以下真面目に調査
	let re = 0;
	let im = 0;
	let buff;
	// 最後が$なら右側が実数、最後が[+-]なら左側が実数
	buff = str.match(/[+-]?[0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?($|[+-])/);
	if(buff) {
		re = parseFloat(buff[0]);
	}
	// 複素数は数値が省略される場合がある
	buff = str.match(/[+-]?([0-9]+(\.[0-9]+)?(e[+-]?[0-9]+)?)?[ij]/);
	if(buff) {
		buff = buff[0].substring(0, buff[0].length - 1);
		// i, +i, -j のように実数部がなく、数値もない場合
		if((/^[-+]$/.test(buff)) || buff.length === 0) {
			im = buff === "-" ? -1 : 1;
		}
		else {
			im = parseFloat(buff);
		}
	}
	that._re = re;
	that._im = im;
};

export default class Complex {

	/**
	 * 複素数 (immutable)
	 * 行列で使うためイミュータブルは必ず守ること。
	 * @param {Object} number 複素数データ( "1 + j", [1 , 1] など)
	 */
	constructor(number) {
		if(arguments.length === 1) {
			const obj = number;
			if((obj instanceof Complex) || ((obj instanceof Object) && (obj._re && obj._im))) {
				this._re = obj._re;
				this._im = obj._im;
			}
			else if(typeof obj === "number" || obj instanceof Number) {
				this._re = obj;
				this._im = 0.0;
			}
			else if(obj instanceof Array && obj.length === 2) {
				this._re = obj[0];
				this._im = obj[1];
			}
			else if(typeof obj === "string" || obj instanceof String) {
				ToComplexFromString(obj, this);
			}
			else if(obj instanceof Object && obj.toString) {
				ToComplexFromString(obj.toString(), this);
			}
			else {
				throw "Unsupported argument";
			}
		}
		else {
			throw "Many arguments : " + arguments.length;
		}
	}

	/**
	 * ディープコピー（※実際にはイミュータブルなのでコピーする）
	 * @returns {Complex} 
	 */
	clone() {
		return this;
	}

	/**
	 * 文字列データ
	 * @returns {String} 
	 */
	toString() {
		const formatG = function(x) {
			let numstr = x.toPrecision(6);
			if(numstr.indexOf(".") !== -1) {
				numstr = numstr.replace(/\.?0+$/, "");  // 1.00 , 1.10
				numstr = numstr.replace(/\.?0+e/, "e"); // 1.0e , 1.10e
			}
			return numstr;
		};
		if(!this.isReal()) {
			if(this._re === 0) {
				return formatG(this._im) + "i";
			}
			else if(this._im >= 0) {
				return formatG(this._re) + " + " + formatG(this._im) + "i";
			}
			else {
				return formatG(this._re) + " - " + formatG(-this._im) + "i";
			}
		}
		else {
			return formatG(this._re);
		}
	}
	
	/**
	 * 引数から複素数を作成する（作成が不要の場合はnewしない）
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	static createConstComplex(number) {
		if(number instanceof Complex) {
			return number;
		}
		else {
			return new Complex(number);
		}
	}
	
	/**
	 * ランダムな値を作成
	 * @returns {Complex}
	 */
	static rand() {
		return new Complex(random_class.nextDouble());
	}

	/**
	 * 正規分布に従うランダムな値を作成
	 * @returns {Complex}
	 */
	static randn() {
		return new Complex(random_class.nextGaussian());
	}

	/**
	 * A.equals(B)
	 * @param {Object} number
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean} A === B
	 */
	equals(number, epsilon) {
		const x = Complex.createConstComplex(number);
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return (Math.abs(this._re - x._re) <  tolerance) && (Math.abs(this._im - x._im) < tolerance);
	}

	/**
	 * 実部
	 * @returns {Number} 実部の数値（非Complexオブジェクト）
	 */
	get real() {
		return this._re;
	}
	
	/**
	 * 虚部
	 * @returns {Number} 虚部の数値（非Complexオブジェクト）
	 */
	get imag() {
		return this._im;
	}

	/**
	 * ノルム（極座標のノルム）
	 * @returns {Number} ノルムの数値（非Complexオブジェクト）
	 */
	get norm() {
		if(this._im === 0) {
			return Math.abs(this._re);
		}
		else if(this._re === 0) {
			return Math.abs(this._im);
		}
		else {
			return Math.sqrt(this._re * this._re + this._im * this._im);
		}
	}

	/**
	 * 偏角（極座標の角度）
	 * @returns {Number} 偏角の数値（非Complexオブジェクト）
	 */
	get angle() {
		if(this._im === 0) {
			return 0;
		}
		else if(this._re === 0) {
			return Math.PI * (this._im >= 0.0 ? 0.5 : -0.5);
		}
		else {
			return Math.atan2(this._im, this._re);
		}
	}

	/**
	 * 実部、虚部の小数点の桁数の最大値
	 * @returns {Number} 小数点の桁（非Complexオブジェクト）
	 */
	getDecimalPosition() {
		let point = 0;
		let x = this;
		for(let i = 0; i < 20; i++) {
			if(x.isComplexInteger()) {
				break;
			}
			x = x.mul(Complex.TEN);
			point++;
		}
		return point;
	}

	/**
	 * A.add(B) = A + B
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	add(number) {
		const x = new Complex(number);
		x._re = this._re + x._re;
		x._im = this._im + x._im;
		return x;
	}

	/**
	 * A.sub(B) = A - B
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	sub(number) {
		const x = new Complex(number);
		x._re = this._re - x._re;
		x._im = this._im - x._im;
		return x;
	}

	/**
	 * A.mul(B) = A * B
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	mul(number) {
		const x = new Complex(number);
		if((this._im === 0) && (x._im === 0)) {
			x._re = this._re * x._re;
			return x;
		}
		else if((this._re === 0) && (x._re === 0)) {
			x._re = - this._im * x._im;
			x._im = 0;
			return x;
		}
		else {
			const re = this._re * x._re - this._im * x._im;
			const im = this._im * x._re + this._re * x._im;
			x._re = re;
			x._im = im;
			return x;
		}
	}
	
	/**
	 * A.dot(B) = A・B = A * conj(B)
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	dot(number) {
		const x = new Complex(number);
		if((this._im === 0) && (x._im === 0)) {
			x._re = this._re * x._re;
			return x;
		}
		else if((this._re === 0) && (x._re === 0)) {
			x._re = this._im * x._im;
			x._im = 0;
			return x;
		}
		else {
			const re = this._re * x._re + this._im * x._im;
			const im = - this._im * x._re + this._re * x._im;
			x._re = re;
			x._im = im;
			return x;
		}
	}
	
	/**
	 * A.div(B) = A / B
	 * @param {Object} number 
	 * @returns {Complex}
	 */
	div(number) {
		const x = new Complex(number);
		if((this._im === 0) && (x._im === 0)) {
			x._re = this._re / x._re;
			return x;
		}
		else if((this._re === 0) && (x._re === 0)) {
			x._re = this._im / x._im;
			x._im = 0;
			return x;
		}
		else {
			const re = this._re * x._re + this._im * x._im;
			const im = this._im * x._re - this._re * x._im;
			const denominator = 1.0 / (x._re * x._re + x._im * x._im);
			x._re = re * denominator;
			x._im = im * denominator;
			return x;
		}
	}

	/**
	 * A.mod(B) = A mod B (複素数での計算はできません)
	 * @param {Object} number 複素数を含まない数値 
	 * @returns {Complex}
	 */
	mod(number) {
		const x = new Complex(number);
		if((this._im !== 0) || (x._im !== 0)) {
			throw "calculation method is undefined.";
		}
		let _re = this._re - x._re * (0 | (this._re / x._re));
		if(_re < 0) {
			_re += x._re;
		}
		x._re = _re;
		return x;
	}

	/**
	 * A.inv() = 1 / A
	 * @returns {Complex}
	 */
	inv() {
		if(this._im === 0) {
			return new Complex(1.0 / this._re);
		}
		else if(this._re === 0) {
			return new Complex([0, - 1.0 / this._im]);
		}
		return Complex.ONE.div(this);
	}

	/**
	 * A.sign() は長さを1にします -100 なら -1 にします
	 * @returns {Complex}
	 */
	sign() {
		if(this._im === 0) {
			if(this._re === 0) {
				return new Complex(0);
			}
			else {
				return new Complex(this._re > 0 ? 1 : -1);
			}
		}
		return this.div(this.norm);
	}
	
	/**
	 * A.max(B) = max([A, B])
	 * @param {Object} number
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Complex}
	 */
	max(number, epsilon) {
		const x = Complex.createConstComplex(number);
		if(this.compareTo(x, epsilon) <= 0) {
			return this;
		}
		else {
			return x;
		}
	}

	/**
	 * A.min(B) = min([A, B])
	 * @param {Object} number
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Complex}
	 */
	min(number, epsilon) {
		const x = Complex.createConstComplex(number);
		if(this.compareTo(x, epsilon) >= 0) {
			return this;
		}
		else {
			return x;
		}
	}

	/**
	 * A.compareTo(B) 今の値Aと、指定した値Bとを比較する
	 * 戻り値は、IF文で利用できるように、非Complexオブジェクトとなる。
	 * @param {Object} number
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Number} A < B ? 1 : (A === B ? 0 : -1)（※非Complexオブジェクト）
	 */
	compareTo(number, epsilon) {
		// ※実数を返す（非Complexオブジェクト）
		const x = Complex.createConstComplex(number);
		if(this.equals(x, epsilon)) {
			return 0;
		}
		// 実部と虚部の比較は、どちらを優先すべきか分からない
		// 符号付きでマンハッタン距離を算出して、距離の比較を行う
		const a = this.real + this.imag;
		const b = x.real + x.imag;
		return a < b ? 1 : -1;
	}

	// ----------------------
	// テスト系
	// ----------------------
	
	/**
	 * 整数を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isInteger(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return this.isReal() && (Math.abs(this._re - (this._re | 0)) < tolerance);
	}

	/**
	 * 複素整数を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isComplexInteger(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		// 複素整数
		return (Math.abs(this._re - (this._re | 0)) < tolerance) &&
				(Math.abs(this._im - (this._im | 0)) < tolerance);
	}

	/**
	 * 0 を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isZero(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return (Math.abs(this._re) < tolerance) && (Math.abs(this._im) < tolerance);
	}

	/**
	 * 1 を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isOne(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return (Math.abs(this._re - 1.0) < tolerance) && (Math.abs(this._im) < tolerance);
	}

	/**
	 * 複素数を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isComplex(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return (Math.abs(this._im) >= tolerance);
	}
	
	/**
	 * 実数を判定
	 * @param {Number} epsilon 誤差（任意）
	 * @returns {Boolean}
	 */
	isReal(epsilon) {
		const tolerance = epsilon ? epsilon : Number.EPSILON;
		return (Math.abs(this._im) < tolerance);
	}

	/**
	 * 非数を判定
	 * @returns {Boolean}
	 */
	isNaN() {
		return Math.isNaN(this._re) || Math.isNaN(this._im);
	}

	/**
	 * real(x) > 0
	 * @returns {Boolean}
	 */
	isPositive() {
		// Number.EPSILONは使用しない。どちらにぶれるか不明な点及び
		// わずかな負の数だった場合に、sqrtでエラーが発生するため
		return 0.0 < this._re;
	}

	/**
	 * real(x) < 0
	 * @returns {Boolean}
	 */
	isNegative() {
		return 0.0 > this._re;
	}

	/**
	 * real(x) >= 0
	 * @returns {Boolean}
	 */
	isNotNegative() {
		return 0.0 <= this._re;
	}

	/**
	 * 無限を判定
	 * @returns {Boolean}
	 */
	isInfinite() {
		return	(this._re === Number.POSITIVE_INFINITY) ||
				(this._im === Number.POSITIVE_INFINITY) ||
				(this._re === Number.NEGATIVE_INFINITY) ||
				(this._im === Number.NEGATIVE_INFINITY);
	}
	
	/**
	 * 有限数を判定
	 * @returns {Boolean}
	 */
	isFinite() {
		return !this.isNaN() && !this.isInfinite();
	}

	// ----------------------
	// 複素数
	// ----------------------
	
	/**
	 * A.abs() = abs(A)
	 * @returns {Complex}
	 */
	abs() {
		return new Complex(this.norm);
	}

	/**
	 * A.conj() = real(A) - imag(A)j (共役複素数)
	 * @returns {Complex}
	 */
	conj() {
		if(this._im === 0) {
			return this;
		}
		// 共役複素数
		return new Complex([this._re, -this._im]);
	}

	/**
	 * A.negate() = - A
	 * @returns {Complex}
	 */
	negate() {
		return new Complex([-this._re, -this._im]);
	}

	// ----------------------
	// 指数
	// ----------------------
	
	/**
	 * A.pow(B) = A^B
	 * @param {Object} number
	 * @returns {Complex}
	 */
	pow(number) {
		const x = new Complex(number);
		if((this.isReal()) && (x.isReal()) && (this.isNotNegative())) {
			x._re = Math.pow(this._re, x._re);
			return x;
		}
		else if(x.isReal()) {
			const r = Math.pow(this.norm, x._re);
			const s = this.angle * x._re;
			x._re = r * Math.cos(s);
			x._im = r * Math.sin(s);
			return x;
		}
		else {
			return x.mul(this.log()).exp();
		}
	}

	/**
	 * A.square() = A^2
	 * @returns {Complex}
	 */
	square() {
		return new Complex(this._re * this._re + this._im * this._im);
	}

	/**
	 * A.sqrt() = sqrt(A)
	 * @returns {Complex}
	 */
	sqrt() {
		if(this.isReal()) {
			if(this.isNotNegative()) {
				return new Complex(Math.sqrt(this._re));
			}
			else {
				return new Complex([0, Math.sqrt(this._re)]);
			}
		}
		const r = Math.sqrt(this.norm);
		const s = this.angle * 0.5;
		return new Complex([r * Math.cos(s), r * Math.sin(s)]);
	}

	/**
	 * A.log() = log A
	 * @returns {Complex}
	 */
	log() {
		if(this.isReal() && this.isNotNegative()) {
			return new Complex(Math.log(this._re));
		}
		// 複素対数関数
		return new Complex([Math.log(this.norm), this.angle]);
	}

	/**
	 * A.exp() = e^A
	 * @returns {Complex}
	 */
	exp() {
		if(this.isReal()) {
			return new Complex(Math.exp(this._re));
		}
		// 複素指数関数
		const r = Math.exp(this._re);
		return new Complex([r * Math.cos(this._im), r * Math.sin(this._im)]);
	}

	// ----------------------
	// 三角関数
	// ----------------------
	
	/**
	 * A.sin() = sin(A)
	 * @returns {Complex}
	 */
	sin() {
		if(this.isReal()) {
			return new Complex(Math.sin(this._re));
		}
		// オイラーの公式より
		// sin x = (e^ix - e^-ex) / 2i
		const a = this.mul(Complex.I).exp();
		const b = this.mul(Complex.I.negate()).exp();
		return a.sub(b).div([0, 2]);
	}

	/**
	 * A.cos() = cos(A)
	 * @returns {Complex}
	 */
	cos() {
		if(this.isReal()) {
			return new Complex(Math.cos(this._re));
		}
		// オイラーの公式より
		// cos x = (e^ix + e^-ex) / 2
		const a = this.mul(Complex.I).exp();
		const b = this.mul(Complex.I.negate()).exp();
		return a.add(b).div(2);
	}

	/**
	 * A.tan() = tan(A)
	 * @returns {Complex}
	 */
	tan() {
		if(this.isReal()) {
			return new Complex(Math.tan(this._re));
		}
		// 三角関数の相互関係 tan x = sin x / cos x
		return this.sin().div(this.cos());
	}

	/**
	 * A.atan() = atan(A)
	 * @returns {Complex}
	 */
	atan() {
		if(this.isReal()) {
			return new Complex(Math.atan(this._re));
		}
		// 逆正接 tan-1 x = i/2 log( i+x / i-x )
		return Complex.I.div(Complex.TWO).mul(Complex.I.add(this).div(Complex.I.sub(this)).log());
	}

	/**
	 * Y.atan2(X) = atan2(Y, X) 複素数のatan2は計算不能
	 * @param {Object} number 複素数を含まない数値 
	 * @returns {Complex}
	 */
	atan2() {
		if(arguments.length === 0) {
			return new Complex(this.angle);
		}
		// y.atan2(x) とする。
		const y = this;
		const x = new Complex(...arguments);
		if(y.isReal() && x.isReal()) {
			return new Complex(Math.atan2(y._re, x._re));
		}
		// 複素数のatan2は未定義である（実装不可能）
		throw "calculation method is undefined.";
	}
	
	// ----------------------
	// 丸め
	// ----------------------
	
	/**
	 * A.floor() = floor(A)
	 * @returns {Complex}
	 */
	floor() {
		return new Complex([Math.floor(this._im), Math.floor(this._re)]);
	}

	/**
	 * A.ceil() = ceil(A)
	 * @returns {Complex}
	 */
	ceil() {
		return new Complex([Math.ceil(this._im), Math.ceil(this._re)]);
	}
	
	/**
	 * A.round() = round(A)
	 * @returns {Complex}
	 */
	round() {
		return new Complex([Math.round(this._im), Math.round(this._re)]);
	}


}

Complex.I = new Complex([0, 1]);
Complex.ZERO = new Complex(0);
Complex.HALF = new Complex(0.5);
Complex.ONE = new Complex(1);
Complex.MINUS = new Complex(-1);
Complex.TWO = new Complex(2);
Complex.TEN = new Complex(10);
