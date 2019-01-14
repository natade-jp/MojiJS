/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class Complex {

	constructor() {
		if(arguments.length === 1) {
			const obj = arguments[0];
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
				const str = obj.replace(/\s/g, "").toLowerCase();
				if(!(/[ij]/.test(str))) {
					this._re = parseFloat(str);
					this._im = 0.0;
				}
				// +i , -j のみ
				else if((/^[-+]?[ij]/.test(str))) {
					this._re = 0;
					if(/^\+/.test(str)) {
						this._im = 1;
					}
					else {
						this._im = -1;
					}
				}
				else {
					const buff = str.match(/^([+-]?)([0-9]+)(\.[0-9]+)?(e[+-]?[0-9]+)?/);
					if(buff) {
						const a = buff[0];
						const b = str.substr(a.length);
						// bの1文字目がiかjであれば、実数部なしの宣言
						if(/^[ij]/.test(b.charAt(0))) {
							this._re = 0;
							this._im = parseFloat(a);
						}
						else {
							this._re = parseFloat(a);
							if((/^[-+]?[ij]/.test(b))) {
								if(/^\+/.test(b)) {
									this._im = 1;
								}
								else {
									this._im = -1;
								}
							}
							else {
								this._im = parseFloat(b);
							}
						}
					}
					else {
						this._re = 0.0;
						this._im = parseFloat(buff[0]);
					}
				}
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		else if(arguments.length === 2) {
			const obj_0 = arguments[0];
			const obj_1 = arguments[1];
			if(obj_0 instanceof Complex && obj_1 instanceof Complex) {
				if(obj_0._im || obj_1._im) {
					throw "IllegalArgumentException";
				}
				this._re = obj_0._re;
				this._im = obj_1._re;
			}
			else if(((typeof obj_0 === "number")||(obj_0 instanceof Number)) && ((typeof obj_1 === "number")||(obj_1 instanceof Number))) {
				this._re = obj_0;
				this._im = obj_1;
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	static createConstComplex() {
		if((arguments.length === 1) && (arguments[0] instanceof Complex)) {
			return arguments[0];
		}
		else {
			new Complex(...arguments);
		}
	}

	toString() {
		const formatG = function(x) {
			let numstr = x.toPrecision(6);
			if(numstr.indexOf(".") !== -1) {
				numstr = numstr.replace(/\.?0+$/, "");  // 1.00 , 1.10
				numstr = numstr.replace(/\.?0+e/, "e"); // 1.0e , 1.10e
			}
			return numstr;
		};
		if(this._im !== 0) {
			if(this._re === 0) {
				return formatG(this._im) + "j";
			}
			else if(this._im >= 0) {
				return formatG(this._re) + " + " + formatG(this._im) + "j";
			}
			else {
				return formatG(this._re) + " - " + formatG(-this._im) + "j";
			}
		}
		else {
			return formatG(this._re);
		}
	}
	
	clone() {
		new Complex(this._re, this._im);
	}

	add() {
		const x = new Complex(...arguments);
		x._re = this._re + x._re;
		x._im = this._im + x._im;
		return x;
	}

	sub() {
		const x = new Complex(...arguments);
		x._re = this._re - x._re;
		x._im = this._im - x._im;
		return x;
	}

	mul() {
		const x = new Complex(...arguments);
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
	
	div() {
		const x = new Complex(...arguments);
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

	mod() {
		const x = new Complex(...arguments);
		if((this._im !== 0) || (x._im !== 0)) {
			throw "IllegalArgumentException";
		}
		let _re = this._re - x._re * (0 | (this._re / x._re));
		if(_re < 0) {
			_re += x._re;
		}
		x._re = _re;
		return x;
	}
	
	get sign() {
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

	get norm() {
		if(this._im === 0) {
			return new Complex(this._re);
		}
		else if(this._re === 0) {
			return new Complex(this._im);
		}
		else {
			return new Complex(Math.sqrt(this._re * this._re + this._im * this._im));
		}
	}

	get angle() {
		if(this._im === 0) {
			return new Complex(0);
		}
		else if(this._re === 0) {
			return new Complex(Math.PI * (this._im >= 0.0 ? 0.5 : -0.5));
		}
		else {
			return new Complex(Math.atan2(this._im, this._re));
		}
	}

	get real() {
		return new Complex(this._re);
	}
	
	get imag() {
		return new Complex(this._im);
	}

	equals() {
		const x = Complex.createConstComplex(...arguments);
		return (Math.abs(this._re - x._re) <  Number.EPSILON) && (Math.abs(this._im - x._im) <  Number.EPSILON);
	}

	max() {
		const x = Complex.createConstComplex(...arguments);
		const y1 = this.norm;
		const y2 = x.norm;
		if(y1 >= y2) {
			return this;
		}
		else {
			return x;
		}
	}

	min() {
		const x = Complex.createConstComplex(...arguments);
		const y1 = this.norm;
		const y2 = x.norm;
		if(y1 <= y2) {
			return this;
		}
		else {
			return x;
		}
	}

	isZero() {
		return (Math.abs(this._re) <  Number.EPSILON) && (Math.abs(this._im) <  Number.EPSILON);
	}

	isOne() {
		return (Math.abs(this._re - 1.0) <  Number.EPSILON) && (Math.abs(this._im) <  Number.EPSILON);
	}

	isNaN() {
		return isNaN(this._re) || isNaN(this._im);
	}

	isPositive() {
		return 0.0 < this._re;
	}

	isNegative() {
		return 0.0 > this._re;
	}

	isInfinite() {
		return	(this._re === Number.POSITIVE_INFINITY) ||
				(this._im === Number.POSITIVE_INFINITY) ||
				(this._re === Number.NEGATIVE_INFINITY) ||
				(this._im === Number.NEGATIVE_INFINITY);
	}

	isFinite() {
		return !this.isNaN() && !this.isInfinite();
	}

	compare() {
		const x = Complex.createConstComplex(...arguments);
		if(this.equals(x)) {
			return 0;
		}
		const max = this.max(x);
		if(max.equals(x)) {
			return 1;
		}
		else {
			return -1;
		}
	}

	pow() {
		const x = new Complex(...arguments);
		if((this._im === 0) && (x._im === 0)) {
			x._re = Math.pow(this._re, x._re);
			return x;
		}
		else if(x._im === 0) {
			const r = Math.pow(this.norm._re, x._re);
			const s = this.angle._re * x._re;
			x._re = r * Math.cos(s);
			x._im = r * Math.sin(s);
			return x;
		}
		else {
			return x.mul(this.log()).exp();
		}
	}

	sqrt() {
		if(this._im === 0) {
			return new Complex(Math.sqrt(this._re));
		}
		const r = Math.sqrt(this.norm._re);
		const s = this.angle._re * 0.5;
		return new Complex(r * Math.cos(s), r * Math.sin(s));
	}

	log() {
		if(this._im === 0) {
			return new Complex(Math.log(this._re));
		}
		// 複素対数関数
		return new Complex(Math.log(this.norm), this.angle._re);
	}

	exp() {
		if(this._im === 0) {
			return new Complex(Math.exp(this._re));
		}
		// 複素指数関数
		const r = Math.exp(this._re);
		return new Complex(r * Math.cos(this._im), r * Math.sin(this._im));
	}

}
