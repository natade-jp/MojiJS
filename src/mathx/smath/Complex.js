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

/**
 * 実数専用の統計処理用の関数集
 */
class Statistics {

	/**
	 * gammaln(x) 対数ガンマ関数 
	 * @param {Number} x
	 * @returns {Number}
	 */
	static gammaln(x) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p30,技術評論社,1991
		const LOG_2PI = Math.log(2.0 * Math.PI);
		//いくつで近似するか(10で十分よいが一応16までやってみた)
		const N = 16;
		//ベルヌーイ数
		//http://fr.wikipedia.org/wiki/Nombre_de_Bernoulli
		const B2 =  1.0 / 6.0;
		const B4 = -1.0 / 30.0;
		const B6 =  1.0 / 42.0;
		const B8 = -1.0 / 30.0;
		const B10 =  5.0 / 66.0;
		const B12 = -691.0 / 2730.0;
		const B14 =  7.0 / 6.0;
		const B16 = -3617.0 / 510.0;
		const B18 = 43867.0 / 798.0;
		const B20 = -174611.0 / 330.0;
		const B22 = 854513.0 / 138.0;
		const B24 = -236364091.0 / 2730.0;
		const B26 = 8553103.0 / 6.0;
		const B28 = -23749461029.0 / 870.0;
		const B30 = 8615841276005.0 / 14322.0;
		const B32 = -7709321041217.0 / 510.0;
		let v, y;
		v = 1;
		while(x < N) {
			v *= x;
			x++;
		}
		const w = 1 / (x * x);
		y = (B32 / (32.0 * 31.0));
		y *= w;
		y = (B30 / (30.0 * 29.0));
		y *= w;
		y = (B28 / (28.0 * 27.0));
		y *= w;
		y = (B26 / (26.0 * 25.0));
		y *= w;
		y = (B24 / (24.0 * 23.0));
		y *= w;
		y = (B22 / (22.0 * 21.0));
		y *= w;
		y = (B20 / (20.0 * 19.0));
		y *= w;
		y = (B18 / (18.0 * 17.0));
		y *= w;
		y = (B16 / (16.0 * 15.0));
		y *= w;
		y += (B14 / (14.0 * 13.0));
		y *= w;
		y += (B12 / (12.0 * 11.0));
		y *= w;
		y += (B10 / (10.0 * 9.0));
		y *= w;
		y += (B8 / (8.0 * 7.0));
		y *= w;
		y += (B6 / (6.0 * 5.0));
		y *= w;
		y += (B4 / (4.0 * 3.0));
		y *= w;
		y += (B2 / (2.0 * 1.0));
		y /= x;
		y += 0.5 * LOG_2PI;
		y += - Math.log(v) - x + (x - 0.5) * Math.log(x);
		return(y);
	}

	/**
	 * gamma(x) ガンマ関数
	 * @param {Number} x
	 * @returns {Number}
	 */
	static gamma(x) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p30,技術評論社,1991
		if(x < 0) {
			return (Math.PI / (Math.sin(Math.PI * x) * Math.exp(Statistics.gammaln(1.0 - x))));
		}
		return Math.exp(Statistics.gammaln(x));
	}

	/**
	 * beta(x, y) ベータ関数
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Number}
	 */
	static beta(x, y) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p30,技術評論社,1991
		return (Math.exp(Statistics.gammaln(x) + Statistics.gammaln(y) - Statistics.gammaln(x + y)));
	}
	
	/**
	 * factorial(x) = x! 階乗関数
	 * @param {Number} x
	 * @returns {Number}
	 */
	static factorial(x) {
		const y = Statistics.gamma(x + 1.0);
		if((x | 0) === x) {
			return Math.round(y);
		}
		else {
			return y;
		}
	}

	/**
	 * nchoosek(n, k) = nCk 二項係数またはすべての組合わせ
	 * @param {Number} n
	 * @param {Number} k
	 * @return {Number} nCk
	 */
	static nchoosek(n, k) {
		return (Math.round(Statistics.factorial(n) / (Statistics.factorial(n - k) * Statistics.factorial(k))));
	}

	/**
	 * p_beta(x, a, b) 不完全ベータ関数 下側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static p_beta(x, a, b) {
		let k;
		let result, term, previous;
		if(a <= 0.0) {
			return Number.POSITIVE_INFINITY;
		}
		if(b <= 0.0) {
			if(x < 1.0) {
				return 0.0;
			}
			if(x === 1.0) {
				return 1.0;
			}
			else {
				return Number.POSITIVE_INFINITY;
			}
		}
		if(x > (a + 1.0) / (a + b + 2.0)) {
			return (1.0 - Statistics.p_beta(1.0 - x, b, a));
		}
		if(x <= 0.0) {
			return 0.0;
		}
		term = a * Math.log(x);
		term += b * Math.log(1.0 - x);
		term += Statistics.gammaln(a + b);
		term -= Statistics.gammaln(a) + Statistics.gammaln(b);
		term = Math.exp(term);
		term /= a;
		result = term;
		for(k = 1; k < 1000; k++) {
			term *= a + b + k - 1.0;
			term *= x;
			term /= a + k;
			previous = result;
			result += term;
			if(result === previous) {
				return result;
			}
		}
		return Number.NaN;
	}

	/**
	 * q_beta(x, a, b) 不完全ベータ関数 上側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static q_beta(x, a, b) {
		return (1.0 - Statistics.p_beta(x, a, b));
	}

	/**
	 * betainc(x, z, w, tail) 不完全ベータ関数
	 * @param {Number} x
	 * @param {Number} z
	 * @param {Number} w
	 * @param tail {String} lower(デフォルト)/upper
	 * @return {Number}
	 */
	static betainc(x, z, w, tail) {
		if(tail === "lower") {
			return Statistics.p_beta(x, z, w);
		}
		else if(tail === "upper") {
			return Statistics.q_beta(x, z, w);
		}
		else if(arguments.length === 3) {
			// 引数を省略した場合
			return Statistics.betainc(x, z, w, "lower");
		}
		else {
			throw "betainc unsupported argument [" + tail + "]";
		}
	}
	
	/**
	 * betacdf(x, a, b) 不完全ベータ関数の累積分布関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static betacdf(x, a, b) {
		return Statistics.betainc(x, a, b);
	}

	/**
	 * betapdf(x, a, b) 不完全ベータ関数の確率密度関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static betapdf(x, a, b) {
		//	return(Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x)) / Statistics.beta(a,  b));
		return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1) / Statistics.beta(a,  b));
	}
	
	/**
	 * betainv(x, a, b) 不完全ベータ関数の確率密度関数の逆関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static betainv(x, a, b) {
		if((x < 0.0) || (x > 1.0)) {
			return Number.NaN;
		}
		if((x == 1.0) && (a > 0.0) && (b > 0.0)) {
			return 1.0;
		}
		const eps = 1.0e-14;
		let y;
		if(b == 0) {
			y = 1.0 - eps;
		}
		else if(a == 0) {
			y = eps;
		}
		else {
			y = a / (a + b);
		}
		let d = 1.0, y2;
		for(let i = 0;(i < 10000) || (Math.abs(d) > eps); i++) {
			d = (Statistics.betacdf(y, a, b) - x) / Statistics.betapdf(y, a, b);
			y2 = y - d;
			if(y2 < eps) {
				y2 = y * 0.1;
			}
			else if(y2 > 1.0 - eps) {
				y2 = 1.0 - (1.0 - y) * 0.1;
			}
			y = y2;
		}
		return y;
	}

	/**
	 * p_gamma(x, a, gammaln_a) 不完全ガンマ関数 下側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} gammaln_a
	 * @return {Number}
	 */
	static p_gamma(x, a, gammaln_a) {
		let k;
		let result, term, previous;
		if(x >= 1.0 + a) {
			return (1.0 - Statistics.q_gamma(x, a, gammaln_a));
		}
		if(x === 0.0) {
			return 0.0;
		}
		result = term = Math.exp(a * Math.log(x) - x - gammaln_a) / a;
		for(k = 1; k < 1000; k++) {
			term *= x / (a + k);
			previous = result;
			result += term;
			if(result == previous) {
				return result;
			}
		}
		return Number.NaN;
	}

	/**
	 * q_gamma(x, a, gammaln_a) 不完全ガンマ関数 上側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} gammaln_a
	 * @return {Number}
	 */
	static q_gamma(x, a, gammaln_a) {
		let k;
		let result, w, temp, previous;
		// Laguerreの多項式
		let la = 1.0, lb = 1.0 + x - a;
		if(x < 1.0 + a) {
			return (1 - Statistics.p_gamma(x, a, gammaln_a));
		}
		w = Math.exp(a * Math.log(x) - x - gammaln_a);
		result = w / lb;
		for(k = 2; k < 1000; k++) {
			temp = ((k - 1.0 - a) * (lb - la) + (k + x) * lb) / k;
			la = lb;
			lb = temp;
			w *= (k - 1.0 - a) / k;
			temp = w / (la * lb);
			previous = result;
			result += temp;
			if(result == previous) {
				return(result);
			}
		}
		return Number.NaN;
	}

	/**
	 * gammainc(x, a, tail) 不完全ガンマ関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {String} tail lower(デフォルト)/upper
	 * @return {Number}
	 */
	static gammainc(x, a, tail) {
		if(tail === "lower") {
			return Statistics.p_gamma(x, a, Statistics.gammaln(a));
		}
		else if(tail === "upper") {
			return Statistics.q_gamma(x, a, Statistics.gammaln(a));
		}
		else if(arguments.length === 2) {
			// 引数を省略した場合
			return Statistics.gammainc(x, a, "lower");
		}
		else {
			throw "gammainc unsupported argument [" + tail + "]";
		}
	}
	
	/**
	 * erf(x) 誤差関数
	 * @param {Number} x
	 * @return {Number}
	 */
	static erf(x) {
		return (Statistics.p_gamma(x * x, 0.5, Math.log(Math.PI) * 0.5) * (x >= 0 ? 1.0 : -1.0));
	}

	/**
	 * erfc(x) 相補誤差関数
	 * @param {Number} x
	 * @return {Number}
	 */
	static erfc(x) {
		return 1.0 - Statistics.erf(x);
	}

	/**
	 * tcdf(x) スチューデントのt分布の累積分布関数
	 * @param {Number} x
	 * @param {Number} nu 自由度
	 * @param {String} tail lower(デフォルト)/upper
	 * @return {Number}
	 */
	static tcdf(x, nu, tail) {
		if(tail === "lower") {
			const y = (x * x) / (nu + x * x) ;
			const p = Statistics.betainc( y, 0.5, nu * 0.5 ) * (x < 0 ? -1 : 1);
			return 0.5 * (1 + p);
		}
		else if(tail === "upper") {
			return 1.0 - Statistics.tcdf(x, nu);
		}
		else if(arguments.length === 2) {
			// 引数を省略した場合
			return Statistics.tcdf(x, nu, "lower");
		}
		else {
			throw "tcdf unsupported argument [" + tail + "]";
		}
	}

	/**
	 * tinv(p, nu) スチューデントのt逆累積分布関数
	 * @param {Number} p 確率
	 * @param {Number} nu 自由度
	 * @return {Number}
	 */
	static tinv(p, nu) {
		if(p <= 0) {
			return Number.NEGATIVE_INFINITY;
		}
		else if(p >= 1) {
			return Number.POSITIVE_INFINITY;
		}
		else if(p < 0.5) {
			const y = Statistics.betainv(2.0 * p, 0.5 * nu, 0.5);
			return - Math.sqrt(nu / y - nu);
		}
		else {
			const y = Statistics.betainv(2.0 * (1.0 - p), 0.5 * nu, 0.5);
			return Math.sqrt(nu / y - nu);
		}
	}

	/**
	 * etdist(x, nu, tails) スチューデントのt分布のパーセンテージを返す
	 * @param {Number} x
	 * @param {Number} nu 自由度
	 * @param {Number} tails 尾部(1...片側、2...両側)
	 * @return {Number}
	 */
	static etdist(x, nu, tails) {
		return Statistics.tcdf(x, nu, "upper") *tails;
	}

	/**
	 * etinv(p, nu) スチューデントのt分布のt値を、確率と自由度から求める
	 * @param {Number} p 確率
	 * @param {Number} nu 自由度
	 * @return {Number}
	 */
	static etinv(p, nu) {
		return Statistics.tinv( 1.0 - p * 0.5, nu);
	}

	/**
	 * fcdf(x, v1, v2) F累積分布関数
	 * @param {Number} x 
	 * @param {Number} v1 分子の自由度
	 * @param {Number} v2 分母の自由度
	 * @return {Number}
	 */
	static fcdf(x, v1, v2) {
		return Statistics.betacdf( v1 * x / (v1 * x + v2), v1 * 0.5, v2 * 0.5 );
	}

	/**
	 * finv(x, v1, v2) F逆累積分布関数
	 * @param {Number} p
	 * @param {Number} v1 分子の自由度
	 * @param {Number} v2 分母の自由度
	 * @return {Number}
	 */
	static finv(p, v1, v2) {
		return (1.0 / Statistics.betainv( 1.0 - p, v2 * 0.5, v1 * 0.5 ) - 1.0) * v2 / v1;
	}

}

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
		return new Complex([Math.floor(this._re), Math.floor(this._im)]);
	}

	/**
	 * A.ceil() = ceil(A)
	 * @returns {Complex}
	 */
	ceil() {
		return new Complex([Math.ceil(this._re), Math.ceil(this._im)]);
	}
	
	/**
	 * A.round() = round(A)
	 * @returns {Complex}
	 */
	round() {
		return new Complex([Math.round(this._re), Math.round(this._im)]);
	}

	/**
	 * A.fix() = fix(A) 小数点部を消す
	 * @returns {Complex}
	 */
	fix() {
		return new Complex([this._re | 0, this._im | 0]);
	}

	/**
	 * A.fract() = fract(A) 小数点部を残す
	 * @returns {Complex}
	 */
	fract() {
		return new Complex([this._re - (this._re | 0), this._im - (this._im | 0)]);
	}

	// ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
	// statistics 統計計算用
	// ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆

	/**
	 * x.gammaln() = gammaln(x) 対数ガンマ関数 
	 * @returns {Complex}
	 */
	gammaln() {
		if(this.isComplex()) {
			throw "gammaln don't support complex numbers.";
		}
		return new Complex(Statistics.gammaln(this._re));
	}
	
	/**
	 * x.gamma() = gamma(x) ガンマ関数 
	 * @returns {Complex}
	 */
	gamma() {
		if(this.isComplex()) {
			throw "gamma don't support complex numbers.";
		}
		return new Complex(Statistics.gamma(this._re));
	}

	/**
	 * a.beta(b) = beta(a, b) ベータ関数
	 * @param {Object} b
	 * @returns {Complex}
	 */
	beta(b) {
		const x = this;
		const y = Complex.createConstComplex(b);
		if(x.isComplex() || y.isComplex()) {
			throw "beta don't support complex numbers.";
		}
		return new Complex(Statistics.beta(x._re, y._re));
	}

	/**
	 * x.factorial() = factorial(x), x! 階乗関数
	 * @returns {Complex}
	 */
	factorial() {
		if(this.isComplex()) {
			throw "factorial don't support complex numbers.";
		}
		return new Complex(Statistics.factorial(this._re));
	}

	/**
	 * n.nchoosek(k) = nchoosek(n, k), nCk 二項係数またはすべての組合わせ
	 * @param {Object} k
	 * @returns {Complex}
	 */
	nchoosek(k) {
		const n_ = this;
		const k_ = Complex.createConstComplex(k);
		if(n_.isComplex() || k_.isComplex()) {
			throw "nchoosek don't support complex numbers.";
		}
		return new Complex(Statistics.nchoosek(n_._re, k_._re));
	}
	
	/**
	 * x.betainc(z, w, tail) = betainc(x, z, w, tail) 不完全ベータ関数
	 * @param {Object} z
	 * @param {Object} w
	 * @param {String} tail lower(デフォルト)/upper
	 * @returns {Complex}
	 */
	betainc(z, w, tail) {
		const x_ = this;
		const z_ = Complex.createConstComplex(z);
		const w_ = Complex.createConstComplex(w);
		if(x_.isComplex() || z_.isComplex() || w_.isComplex()) {
			throw "betainc don't support complex numbers.";
		}
		const tail_ = arguments.length === 2 ? tail : "lower";
		return new Complex(Statistics.betainc(x_._re, z_._re, w_._re, tail_));
	}

	/**
	 * x.betacdf(a, b) = betacdf(x, a, b) 不完全ベータ関数の累積分布関数
	 * @param {Object} a
	 * @param {Object} b
	 * @returns {Complex}
	 */
	betacdf(a, b) {
		const x_ = this;
		const a_ = Complex.createConstComplex(a);
		const b_ = Complex.createConstComplex(b);
		if(x_.isComplex() || a_.isComplex() || b_.isComplex()) {
			throw "betacdf don't support complex numbers.";
		}
		return new Complex(Statistics.betacdf(x_._re, a_._re, b_._re));
	}
	
	/**
	 * x.betacdf(a, b) = betapdf(x, a, b) 不完全ベータ関数の確率密度関数
	 * @param {Object} a
	 * @param {Object} b
	 * @returns {Complex}
	 */
	betapdf(a, b) {
		const x_ = this;
		const a_ = Complex.createConstComplex(a);
		const b_ = Complex.createConstComplex(b);
		if(x_.isComplex() || a_.isComplex() || b_.isComplex()) {
			throw "betapdf don't support complex numbers.";
		}
		return new Complex(Statistics.betapdf(x_._re, a_._re, b_._re));
	}

	/**
	 * x.betainv(a, b) = betainv(x, a, b) 不完全ベータ関数の確率密度関数の逆関数
	 * @param {Object} a
	 * @param {Object} b
	 * @returns {Complex}
	 */
	betainv(a, b) {
		const x_ = this;
		const a_ = Complex.createConstComplex(a);
		const b_ = Complex.createConstComplex(b);
		if(x_.isComplex() || a_.isComplex() || b_.isComplex()) {
			throw "betainv don't support complex numbers.";
		}
		return new Complex(Statistics.betainv(x_._re, a_._re, b_._re));
	}
	
	/**
	 * x.gammainc(a, tail) = gammainc(x, a, tail) 不完全ガンマ関数
	 * @param {Object} a
	 * @param {String} tail lower(デフォルト)/upper
	 * @returns {Complex}
	 */
	gammainc(a, tail) {
		const x_ = this;
		const a_ = Complex.createConstComplex(a);
		if(x_.isComplex() || a_.isComplex()) {
			throw "gammainc don't support complex numbers.";
		}
		const tail_ = arguments.length === 2 ? tail : "lower";
		return new Complex(Statistics.gammainc(x_._re, a_._re, tail_));
	}

	/**
	 * x.erf() = erf(x) 誤差関数
	 * @returns {Complex}
	 */
	erf() {
		const x = this;
		if(x.isComplex()) {
			throw "erf don't support complex numbers.";
		}
		return new Complex(Statistics.erf(x._re));
	}

	/**
	 * x.erfc() = erfc(x) 相補誤差関数
	 * @returns {Complex}
	 */
	erfc() {
		const x = this;
		if(x.isComplex()) {
			throw "erf don't support complex numbers.";
		}
		return new Complex(Statistics.erfc(x._re));
	}

	/**
	 * x.tcdf(nu, tail) = tcdf(x, nu, tail) スチューデントのt分布の累積分布関数
	 * @param {Object} nu 自由度
	 * @param {String} tail lower(デフォルト)/upper
	 * @returns {Complex}
	 */
	tcdf(nu, tail) {
		const x_ = this;
		const nu_ = Complex.createConstComplex(nu);
		if(x_.isComplex() || nu_.isComplex()) {
			throw "tcdf don't support complex numbers.";
		}
		const tail_ = arguments.length === 2 ? tail : "lower";
		return new Complex(Statistics.tcdf(x_._re, nu_._re, tail_));
	}

	/**
	 * p.tinv(nu) = tinv(p, nu) スチューデントのt逆累積分布関数
	 * @param {Object} nu 自由度
	 * @returns {Complex}
	 */
	tinv(nu) {
		const p_ = this;
		const nu_ = Complex.createConstComplex(nu);
		if(p_.isComplex() || nu_.isComplex()) {
			throw "tinv don't support complex numbers.";
		}
		return new Complex(Statistics.tinv(p_._re, nu_._re));
	}

	/**
	 * x.tcdf(v1, v2) = tcdf(x, v1, v2) F累積分布関数
	 * @param {Object} v1 分子の自由度
	 * @param {Object} v2 分母の自由度
	 * @returns {Complex}
	 */
	fcdf(v1, v2) {
		const x_ = this;
		const v1_ = Complex.createConstComplex(v1);
		const v2_ = Complex.createConstComplex(v2);
		if(x_.isComplex() || v1_.isComplex() || v2_.isComplex()) {
			throw "fcdf don't support complex numbers.";
		}
		return new Complex(Statistics.fcdf(x_._re, v1_._re, v2_._re));
	}

	/**
	 * x.finv(v1, v2) = finv(x, v1, v2) F逆累積分布関数
	 * @param {Object} v1 分子の自由度
	 * @param {Object} v2 分母の自由度
	 * @returns {Complex}
	 */
	finv(v1, v2) {
		const x_ = this;
		const v1_ = Complex.createConstComplex(v1);
		const v2_ = Complex.createConstComplex(v2);
		if(x_.isComplex() || v1_.isComplex() || v2_.isComplex()) {
			throw "finv don't support complex numbers.";
		}
		return new Complex(Statistics.finv(x_._re, v1_._re, v2_._re));
	}

	// ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
	// signal 信号処理用
	// ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆


}

Complex.I = new Complex([0, 1]);
Complex.PI = new Complex(Math.PI);
Complex.ZERO = new Complex(0);
Complex.HALF = new Complex(0.5);
Complex.ONE = new Complex(1);
Complex.MINUS = new Complex(-1);
Complex.TWO = new Complex(2);
Complex.TEN = new Complex(10);
