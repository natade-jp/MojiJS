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
		//ベルヌーイ数
		//http://fr.wikipedia.org/wiki/Nombre_de_Bernoulli
		const K2 = ( 1.0 / 6.0)					/ (2 * 1);
		const K4 = (-1.0 / 30.0)				/ (4 * 3);
		const K6 = ( 1.0 / 42.0)				/ (6 * 5);
		const K8 = (-1.0 / 30.0)				/ (8 * 7);
		const K10 = ( 5.0 / 66.0)				/ (10 * 9);
		const K12 = (-691.0 / 2730.0)			/ (12 * 11);
		const K14 = ( 7.0 / 6.0)				/ (14 * 13);
		const K16 = (-3617.0 / 510.0)			/ (16 * 15);
		const K18 = (43867.0 / 798.0)			/ (18 * 17);
		const K20 = (-174611.0 / 330.0)			/ (20 * 19);
		const K22 = (854513.0 / 138.0)			/ (22 * 21);
		const K24 = (-236364091.0 / 2730.0)		/ (24 * 23);
		const K26 = (8553103.0 / 6.0)			/ (26 * 25);
		const K28 = (-23749461029.0 / 870.0)	/ (28 * 27);
		const K30 = (8615841276005.0 / 14322.0)	/ (30 * 29);
		const K32 = (-7709321041217.0 / 510.0)	/ (32 * 31);
		const LIST = [
			K32, K30, K28, K26, K24, K22, K20, K18,
			K16, K14, K12, K10, K8, K6, K4, K2
		];
		let v = 1;
		while(x < LIST.length) {
			v *= x;
			x++;
		}
		const w = 1 / (x * x);
		let y = LIST[0];
		for(let i = 1; i < LIST.length; i++) {
			y *= w;
			y += LIST[i];
		}
		y /= x;
		y += 0.5 * LOG_2PI;
		y += - Math.log(v) - x + (x - 0.5) * Math.log(x);
		return(y);
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
	 * p_gamma(x, a, gammaln_a) 不完全ガンマ関数 下側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} gammaln_a
	 * @return {Number}
	 */
	static p_gamma(x, a, gammaln_a) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p227,技術評論社,1991
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
	 * gamma(z) ガンマ関数
	 * @param {Number} z
	 * @returns {Number}
	 */
	static gamma(z) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p30,技術評論社,1991
		if(z < 0) {
			return (Math.PI / (Math.sin(Math.PI * z) * Math.exp(Statistics.gammaln(1.0 - z))));
		}
		return Math.exp(Statistics.gammaln(z));
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
	 * gampdf(x, k, s) ガンマ分布の確率密度関数
	 * @param {Number} x
	 * @param {Number} k 形状母数
	 * @param {Number} s 尺度母数
	 * @return {Number}
	 */
	static gampdf(x, k, s) {
		let y = 1.0 / (Statistics.gamma(k) * Math.pow(s, k));
		y *= Math.pow( x, k - 1);
		y *= Math.exp( - x / s );
		return y;
	}

	/**
	 * gamcdf(x, k, s) ガンマ分布の累積分布関数
	 * @param {Number} x
	 * @param {Number} k 形状母数
	 * @param {Number} s 尺度母数
	 * @return {Number}
	 */
	static gamcdf(x, k, s) {
		return Statistics.gammainc(x / s, k);
	}
	
	/**
	 * gaminv(p, k, s) ガンマ分布の累積分布関数の逆関数
	 * @param {Number} p
	 * @param {Number} k 形状母数
	 * @param {Number} s 尺度母数
	 * @return {Number}
	 */
	static gaminv(p, k, s) {
		if((p < 0.0) || (p > 1.0)) {
			return Number.NaN;
		}
		else if(p == 0.0) {
			return 0.0;
		}
		else if(p == 1.0) {
			return Number.POSITIVE_INFINITY;
		}
		const eps = 1.0e-12;
		// 初期値を決める
		let y = k * s;
		// 単調増加関数なのでニュートン・ラフソン法で解く
		// x_n+1 = x_n - f(x) / f'(x)
		// ここで f(x) は累積分布関数、f'(x) は確率密度関数
		// a = 累積分関数 → f(x)  = 累積分関数 - a と置く。
		// aの微分は0なので無関係
		let delta, y2;
		for(let i = 0; i < 100; i++) {
			y2 = y - ((Statistics.gamcdf(y, k, s) - p) / Statistics.gampdf(y, k, s));
			delta = y2 - y;
			if(Math.abs(delta) <= eps) {
				break;
			}
			y = y2;
		}
		return y;
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
	 * p_beta(x, a, b) 不完全ベータ関数 下側
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static p_beta(x, a, b) {
		// 参考：奥村,"C言語による最新アルゴリズム事典",p231,技術評論社,1991
		let k;
		let result, term, previous;
		if(a <= 0.0) {
			return Number.POSITIVE_INFINITY;
		}
		if(b <= 0.0) {
			if(x < 1.0) {
				return 0.0;
			}
			else if(x === 1.0) {
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
	 * betainc(x, a, b, tail) 不完全ベータ関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @param tail {String} lower(デフォルト)/upper
	 * @return {Number}
	 */
	static betainc(x, a, b, tail) {
		if(tail === "lower") {
			return Statistics.p_beta(x, a, b);
		}
		else if(tail === "upper") {
			return Statistics.q_beta(x, a, b);
		}
		else if(arguments.length === 3) {
			// 引数を省略した場合
			return Statistics.betainc(x, a, b, "lower");
		}
		else {
			throw "betainc unsupported argument [" + tail + "]";
		}
	}
	
	/**
	 * betapdf(x, a, b) ベータ分布の確率密度関数
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
	 * betacdf(x, a, b) ベータ分布の累積分布関数
	 * @param {Number} x
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static betacdf(x, a, b) {
		return Statistics.betainc(x, a, b);
	}
	
	/**
	 * betainv(p, a, b) ベータ分布の累積分布関数の逆関数
	 * @param {Number} p
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 */
	static betainv(p, a, b) {
		if((p < 0.0) || (p > 1.0)) {
			return Number.NaN;
		}
		else if((p == 1.0) && (a > 0.0) && (b > 0.0)) {
			return 1.0;
		}
		const eps = 1.0e-14;
		// 初期値を決める
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
		// 単調増加関数なのでニュートン・ラフソン法で解く
		// x_n+1 = x_n - f(x) / f'(x)
		// ここで f(x) は累積分布関数、f'(x) は確率密度関数
		// a = 累積分関数 → f(x)  = 累積分関数 - a と置く。
		// aの微分は0なので無関係
		let delta, y2;
		for(let i = 0; i < 100; i++) {
			y2 = y - ((Statistics.betacdf(y, a, b) - p) / Statistics.betapdf(y, a, b));
			delta = y2 - y;
			if(Math.abs(delta) <= eps) {
				break;
			}
			y = y2;
		}
		return y;
	}

	/**
	 * factorial(n) = n! 階乗関数
	 * @param {Number} n
	 * @returns {Number}
	 */
	static factorial(n) {
		const y = Statistics.gamma(n + 1.0);
		if((n | 0) === n) {
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
	 * tpdf(t, k) t分布の確率密度関数
	 * @param {Number} t 
	 * @param {Number} v 自由度
	 * @return {Number}
	 */
	static tpdf(t, v) {
		let y = 1.0 / (Math.sqrt(v) * Statistics.beta(0.5, v * 0.5));
		y *= Math.pow( 1 + t * t / v, - (v + 1) * 0.5);
		return y;
	}

	/**
	 * tcdf(t) t分布の累積分布関数
	 * @param {Number} t
	 * @param {Number} v 自由度
	 * @param {String} tail lower(デフォルト)/upper
	 * @return {Number}
	 */
	static tcdf(t, v, tail) {
		if(tail === "lower") {
			const y = (t * t) / (v + t * t) ;
			const p = Statistics.betainc( y, 0.5, v * 0.5 ) * (t < 0 ? -1 : 1);
			return 0.5 * (1 + p);
		}
		else if(tail === "upper") {
			return 1.0 - Statistics.tcdf(t, v);
		}
		else if(arguments.length === 2) {
			// 引数を省略した場合
			return Statistics.tcdf(t, v, "lower");
		}
		else {
			throw "tcdf unsupported argument [" + tail + "]";
		}
	}

	/**
	 * tinv(p, v) t分布の累積分布関数の逆関数
	 * @param {Number} p 確率
	 * @param {Number} v 自由度
	 * @return {Number}
	 */
	static tinv(p, v) {
		if((p < 0) || (p > 1)) {
			return Number.NaN;
		}
		if(p == 0) {
			return Number.NEGATIVE_INFINITY;
		}
		else if(p == 1) {
			return Number.POSITIVE_INFINITY;
		}
		else if(p < 0.5) {
			const y = Statistics.betainv(2.0 * p, 0.5 * v, 0.5);
			return - Math.sqrt(v / y - v);
		}
		else {
			const y = Statistics.betainv(2.0 * (1.0 - p), 0.5 * v, 0.5);
			return Math.sqrt(v / y - v);
		}
	}

	/**
	 * etdist(x, nu, tails) t分布のパーセンテージを返す
	 * @param {Number} x
	 * @param {Number} nu 自由度
	 * @param {Number} tails 尾部(1...片側、2...両側)
	 * @return {Number}
	 */
	static etdist(x, nu, tails) {
		return Statistics.tcdf(x, nu, "upper") *tails;
	}

	/**
	 * etinv(p, nu) t分布のt値を、確率と自由度から求める
	 * @param {Number} p 確率
	 * @param {Number} nu 自由度
	 * @return {Number}
	 */
	static etinv(p, nu) {
		return Statistics.tinv( 1.0 - p / 2.0, nu);
	}

	/**
	 * chi2pdf(x, v) カイ二乗分布の確率密度関数
	 * @param {Number} x 
	 * @param {Number} k 自由度
	 * @return {Number}
	 */
	static chi2pdf(x, k) {
		if(x <= 0.0) {
			return 0;
		}
		let y = Math.pow(x, k / 2.0 - 1.0) * Math.exp( - x / 2.0 );
		y /= Math.pow(2, k / 2.0) * Statistics.gamma( k / 2.0);
		return y;
	}

	/**
	 * chi2cdf(x, v) カイ二乗分布の累積分布関数
	 * @param {Number} x 
	 * @param {Number} k 自由度
	 * @return {Number}
	 */
	static chi2cdf(x, k) {
		return Statistics.gammainc(x / 2.0, k / 2.0);
	}

	/**
	 * chi2inv(p, v) カイ二乗分布の逆累積分布関数
	 * @param {Number} p 確率
	 * @param {Number} k 自由度
	 * @return {Number}
	 */
	static chi2inv(p, k) {
		return Statistics.gaminv(p, k / 2.0, 2);
	}

	/**
	 * fpdf(x, d1, d2) F分布の確率密度関数
	 * @param {Number} x 
	 * @param {Number} d1 分子の自由度
	 * @param {Number} d2 分母の自由度
	 * @return {Number}
	 */
	static fpdf(x, d1, d2) {
		let y = 1.0;
		y *= Math.pow( (d1 * x) / (d1 * x + d2) , d1 / 2.0);
		y *= Math.pow( 1.0 - ((d1 * x) / (d1 * x + d2)), d2 / 2.0);
		y /= x * Statistics.beta(d1 / 2.0, d2 / 2.0);
		return y;
	}

	/**
	 * fcdf(x, d1, d2) F分布の累積分布関数
	 * @param {Number} x 
	 * @param {Number} d1 分子の自由度
	 * @param {Number} d2 分母の自由度
	 * @return {Number}
	 */
	static fcdf(x, d1, d2) {
		return Statistics.betacdf( d1 * x / (d1 * x + d2), d1 / 2.0, d2 / 2.0 );
	}

	/**
	 * finv(p, d1, d2) F分布の累積分布関数の逆関数
	 * @param {Number} p 確率
	 * @param {Number} d1 分子の自由度
	 * @param {Number} d2 分母の自由度
	 * @return {Number}
	 */
	static finv(p, d1, d2) {
		return (1.0 / Statistics.betainv( 1.0 - p, d2 / 2.0, d1 / 2.0 ) - 1.0) * d2 / d1;
	}

}

/*
test

// -0.12078223763524543
console.log(Statistics.gammaln(1.5));
// 0.8862269254527578
console.log(Statistics.gamma(1.5));
// 0.034141584125708564
console.log(Statistics.gammainc(0.7, 3));
// 0.02265533286799037
console.log(Statistics.gampdf(10, 7, 3));
// 0.054134113294645195
console.log(Statistics.gamcdf(10, 7, 3));
// 24.333147920078357
console.log(Statistics.gaminv(0.7, 7, 3));

// 1.570796326794883
console.log(Statistics.beta(0.5, 1.5));
// 0.9824904585216
console.log(Statistics.betainc(0.6, 5, 10));
// 0.3400783626239994
console.log(Statistics.betapdf(0.6, 5, 10));
// 0.9824904585216
console.log(Statistics.betacdf(0.6, 5, 10));
// 0.3573724870841673
console.log(Statistics.betainv(0.6, 5, 10));

// 0.3286267594591274
console.log(Statistics.erf(0.3));

// 0.2713125051165461
console.log(Statistics.tpdf(0.8, 7));
// 0.7749986502650896
console.log(Statistics.tcdf(0.8, 7));
// 0.8960296443137515
console.log(Statistics.tinv(0.8, 7));
// 0.05534766632274616
console.log(Statistics.chi2pdf(2, 7));
// 0.04015963126989858
console.log(Statistics.chi2cdf(2, 7));
// 8.383430828608336
console.log(Statistics.chi2inv(0.7, 7));
// 0.17142030504271438
console.log(Statistics.fpdf(0.7, 0.6, 0.8));
// 0.5005807484277708
console.log(Statistics.fcdf(0.7, 0.6, 0.8));
// 3.8856206694367055
console.log(Statistics.finv(0.7, 0.6, 0.8));
*/

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
		// 負の値が入っているか、もともと複素数が入っている場合は、複素対数関数
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
	 * z.gamma() = gamma(z) ガンマ関数 
	 * @returns {Complex}
	 */
	gamma() {
		if(this.isComplex()) {
			throw "gamma don't support complex numbers.";
		}
		return new Complex(Statistics.gamma(this._re));
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
	 * x.gampdf(k, s) = gampdf(x, k, s) ガンマ分布の確率密度関数
	 * @param {Object} k 形状母数
	 * @param {Object} s 尺度母数
	 * @returns {Complex}
	 */
	gampdf(k, s) {
		const x_ = this;
		const k_ = Complex.createConstComplex(k);
		const s_ = Complex.createConstComplex(s);
		if(x_.isComplex() || k_.isComplex() || s_.isComplex()) {
			throw "gampdf don't support complex numbers.";
		}
		return new Complex(Statistics.gampdf(x_._re, k_._re, s_._re));
	}

	/**
	 * x.gamcdf(k, s) = gamcdf(x, k, s) ガンマ分布の確率密度関数
	 * @param {Object} k 形状母数
	 * @param {Object} s 尺度母数
	 * @returns {Complex}
	 */
	gamcdf(k, s) {
		const x_ = this;
		const k_ = Complex.createConstComplex(k);
		const s_ = Complex.createConstComplex(s);
		if(x_.isComplex() || k_.isComplex() || s_.isComplex()) {
			throw "gamcdf don't support complex numbers.";
		}
		return new Complex(Statistics.gamcdf(x_._re, k_._re, s_._re));
	}

	/**
	 * p.gaminv(k, s) = gaminv(p, k, s) ガンマ分布の累積分布関数の逆関数
	 * @param {Object} k 形状母数
	 * @param {Object} s 尺度母数
	 * @returns {Complex}
	 */
	gaminv(k, s) {
		const p_ = this;
		const k_ = Complex.createConstComplex(k);
		const s_ = Complex.createConstComplex(s);
		if(p_.isComplex() || k_.isComplex() || s_.isComplex()) {
			throw "gaminv don't support complex numbers.";
		}
		return new Complex(Statistics.gaminv(p_._re, k_._re, s_._re));
	}

	/**
	 * x.beta(y) = beta(x, y) ベータ関数
	 * @param {Object} y
	 * @returns {Complex}
	 */
	beta(y) {
		const x_ = this;
		const y_ = Complex.createConstComplex(y);
		if(x_.isComplex() || y_.isComplex()) {
			throw "beta don't support complex numbers.";
		}
		return new Complex(Statistics.beta(x_._re, y_._re));
	}

	/**
	 * x.betainc(a, b, tail) = betainc(x, a, b, tail) 不完全ベータ関数
	 * @param {Object} a
	 * @param {Object} b
	 * @param {String} tail lower(デフォルト)/upper
	 * @returns {Complex}
	 */
	betainc(a, b, tail) {
		const x_ = this;
		const a_ = Complex.createConstComplex(a);
		const b_ = Complex.createConstComplex(b);
		if(x_.isComplex() || a_.isComplex() || b_.isComplex()) {
			throw "betainc don't support complex numbers.";
		}
		const tail_ = arguments.length === 2 ? tail : "lower";
		return new Complex(Statistics.betainc(x_._re, a_._re, b_._re, tail_));
	}

	/**
	 * x.betapdf(a, b) = betapdf(x, a, b) ベータ分布の確率密度関数
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
	 * x.betacdf(a, b) = betacdf(x, a, b) ベータ分布の累積分布関数
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
	 * p.betainv(a, b) = betainv(p, a, b) ベータ分布の累積分布関数の逆関数
	 * @param {Object} a
	 * @param {Object} b
	 * @returns {Complex}
	 */
	betainv(a, b) {
		const p_ = this;
		const a_ = Complex.createConstComplex(a);
		const b_ = Complex.createConstComplex(b);
		if(p_.isComplex() || a_.isComplex() || b_.isComplex()) {
			throw "betainv don't support complex numbers.";
		}
		return new Complex(Statistics.betainv(p_._re, a_._re, b_._re));
	}

	/**
	 * n.factorial() = factorial(n), n! 階乗関数
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
			throw "erfc don't support complex numbers.";
		}
		return new Complex(Statistics.erfc(x._re));
	}

	/**
	 * t.tpdf(v) = tpdf(t, v) t分布の確率密度関数
	 * @param {Object} v 自由度
	 * @returns {Complex}
	 */
	tpdf(v) {
		const t_ = this;
		const v_ = Complex.createConstComplex(v);
		if(t_.isComplex() || v_.isComplex()) {
			throw "tpdf don't support complex numbers.";
		}
		return new Complex(Statistics.tpdf(t_._re, v_._re));
	}

	/**
	 * t.tcdf(v, tail) = tcdf(t, v, tail) t分布の累積分布関数
	 * @param {Object} v 自由度
	 * @param {String} tail lower(デフォルト)/upper
	 * @returns {Complex}
	 */
	tcdf(v, tail) {
		const t_ = this;
		const v_ = Complex.createConstComplex(v);
		if(t_.isComplex() || v_.isComplex()) {
			throw "tcdf don't support complex numbers.";
		}
		const tail_ = arguments.length === 2 ? tail : "lower";
		return new Complex(Statistics.tcdf(t_._re, v_._re, tail_));
	}

	/**
	 * p.tinv(v) = tinv(p, v) t分布の累積分布関数の逆関数
	 * @param {Object} v 自由度
	 * @returns {Complex}
	 */
	tinv(v) {
		const p_ = this;
		const v_ = Complex.createConstComplex(v);
		if(p_.isComplex() || v_.isComplex()) {
			throw "tinv don't support complex numbers.";
		}
		return new Complex(Statistics.tinv(p_._re, v_._re));
	}

	/**
	 * x.chi2pdf(k) = chi2pdf(x, k) カイ二乗分布の確率密度関数
	 * @param {Object} k 自由度
	 * @returns {Complex}
	 */
	chi2pdf(k) {
		const x_ = this;
		const k_ = Complex.createConstComplex(k);
		if(x_.isComplex() || k_.isComplex()) {
			throw "chi2pdf don't support complex numbers.";
		}
		return new Complex(Statistics.chi2pdf(x_._re, k_._re));
	}

	/**
	 * x.chi2cdf(k) = chi2cdf(x, k) カイ二乗分布の累積分布関数
	 * @param {Object} k 自由度
	 * @returns {Complex}
	 */
	chi2cdf(k) {
		const x_ = this;
		const k_ = Complex.createConstComplex(k);
		if(x_.isComplex() || k_.isComplex()) {
			throw "chi2cdf don't support complex numbers.";
		}
		return new Complex(Statistics.chi2cdf(x_._re, k_._re));
	}

	/**
	 * p.chi2inv(k) = chi2inv(p, k) カイ二乗分布の累積分布関数の逆関数
	 * @param {Object} k 自由度
	 * @returns {Complex}
	 */
	chi2inv(k) {
		const p_ = this;
		const k_ = Complex.createConstComplex(k);
		if(p_.isComplex() || k_.isComplex()) {
			throw "chi2inv don't support complex numbers.";
		}
		return new Complex(Statistics.chi2inv(p_._re, k_._re));
	}

	/**
	 * x.fpdf(d1, d2) = fpdf(x, d1, d2) F分布の確率密度関数
	 * @param {Object} d1 分子の自由度
	 * @param {Object} d2 分母の自由度
	 * @returns {Complex}
	 */
	fpdf(d1, d2) {
		const x_ = this;
		const d1_ = Complex.createConstComplex(d1);
		const d2_ = Complex.createConstComplex(d2);
		if(x_.isComplex() || d1_.isComplex() || d2_.isComplex()) {
			throw "fpdf don't support complex numbers.";
		}
		return new Complex(Statistics.fpdf(x_._re, d1_._re, d2_._re));
	}

	/**
	 * x.fcdf(d1, d2) = fcdf(x, d1, d2) F分布の累積分布関数
	 * @param {Object} d1 分子の自由度
	 * @param {Object} d2 分母の自由度
	 * @returns {Complex}
	 */
	fcdf(d1, d2) {
		const x_ = this;
		const d1_ = Complex.createConstComplex(d1);
		const d2_ = Complex.createConstComplex(d2);
		if(x_.isComplex() || d1_.isComplex() || d2_.isComplex()) {
			throw "fcdf don't support complex numbers.";
		}
		return new Complex(Statistics.fcdf(x_._re, d1_._re, d2_._re));
	}

	/**
	 * p.finv(d1, d2) = finv(p, d1, d2) F分布の累積分布関数の逆関数
	 * @param {Object} d1 分子の自由度
	 * @param {Object} d2 分母の自由度
	 * @returns {Complex}
	 */
	finv(d1, d2) {
		const p_ = this;
		const d1_ = Complex.createConstComplex(d1);
		const d2_ = Complex.createConstComplex(d2);
		if(p_.isComplex() || d1_.isComplex() || d2_.isComplex()) {
			throw "finv don't support complex numbers.";
		}
		return new Complex(Statistics.finv(p_._re, d1_._re, d2_._re));
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
