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
			if((obj instanceof Complex) || ((obj instanceof Object) && (obj.r && obj.i))) {
				this.re = obj.r;
				this.im = obj.i;
			}
			else if(typeof obj === "number" || obj instanceof Number) {
				this.re = obj;
				this.im = 0.0;
			}
			else if(obj instanceof Array && obj.length === 2) {
				this.re = obj[0];
				this.im = obj[1];
			}
			else if(typeof obj === "string" || obj instanceof String) {
				const str = obj.replace(/\s/g, "").toLowerCase();
				if(!(/[ij]/.test(str))) {
					this.re = parseFloat(str);
					this.im = 0.0;
				}
				// +i , -j のみ
				else if((/^[-+]?[ij]/.test(str))) {
					this.re = 0;
					if(/^\+/.test(str)) {
						this.im = 1;
					}
					else {
						this.im = -1;
					}
				}
				else {
					const buff = str.match(/^([+-]?)([0-9]+)(\.[0-9]+)?(e[+-]?[0-9]+)?/);
					if(buff) {
						const a = buff[0];
						const b = str.substr(a.length);
						// bの1文字目がiかjであれば、実数部なしの宣言
						if(/^[ij]/.test(b.charAt(0))) {
							this.re = 0;
							this.im = parseFloat(a);
						}
						else {
							this.re = parseFloat(a);
							this.im = parseFloat(b);
						}
					}
					else {
						this.re = 0.0;
						this.im = parseFloat(buff[0]);
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
			if(((typeof obj_0 === "number")||(obj_0 instanceof Number)) && ((typeof obj_1 === "number")||(obj_1 instanceof Number))) {
				this.re = obj_0;
				this.im = obj_1;
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		else {
			throw "IllegalArgumentException";
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
		if(this.im !== 0) {
			if(this.re === 0) {
				return formatG(this.im) + "j";
			}
			else if(this.im >= 0) {
				return formatG(this.re) + " + " + formatG(this.im) + "j";
			}
			else {
				return formatG(this.re) + " - " + formatG(-this.im) + "j";
			}
		}
		else {
			return formatG(this.re);
		}
	}
	
	clone() {
		new Complex(this.re, this.im);
	}

	add() {
		const x = new Complex(...arguments);
		x.re = this.re + x.re;
		x.im = this.im + x.im;
		return x;
	}

	sub() {
		const x = new Complex(...arguments);
		x.re = this.re - x.re;
		x.im = this.im - x.im;
		return x;
	}

	mul() {
		const x = new Complex(...arguments);
		if((this.im === 0) && (x.im === 0)) {
			x.re = this.re * x.re;
			return x;
		}
		else if((this.re === 0) && (x.re === 0)) {
			x.im = this.im * x.im;
			return x;
		}
		else {
			const re = this.re * x.re - this.im * x.im;
			const im = this.im * x.re + this.re * x.im;
			x.re = re;
			x.im = im;
			return x;
		}
	}
	
	div() {
		const x = new Complex(...arguments);
		if((this.im === 0) && (x.im === 0)) {
			x.re = this.re / x.re;
			return x;
		}
		else if((this.re === 0) && (x.re === 0)) {
			x.im = this.im / x.im;
			return x;
		}
		else {
			const re = this.re * x.re + this.im * x.im;
			const im = this.im * x.re - this.re * x.im;
			const denominator = 1.0 / (x.re * x.re + x.im * x.im);
			x.re = re * denominator;
			x.im = im * denominator;
			return x;
		}
	}

	get norm() {
		if(this.im === 0) {
			return new Complex(this.re);
		}
		else if(this.re === 0) {
			return new Complex(this.im);
		}
		else {
			return new Complex(Math.sqrt(this.re * this.re + this.im * this.im));
		}
	}

	get angle() {
		if(this.im === 0) {
			return new Complex(0);
		}
		else if(this.re === 0) {
			return new Complex(Math.PI * (this.im >= 0.0 ? 0.5 : -0.5));
		}
		else {
			return new Complex(Math.atan2(this.im, this.re));
		}
	}

	max() {
		const x = new Complex(...arguments);
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
		const x = new Complex(...arguments);
		const y1 = this.norm;
		const y2 = x.norm;
		if(y1 <= y2) {
			return this;
		}
		else {
			return x;
		}
	}

	pow() {
		const x = new Complex(...arguments);
		if((this.im === 0) && (x.im === 0)) {
			x.re = Math.pow(this.re, x.re);
			return x;
		}
		else if(x.im === 0) {
			const r = Math.pow(this.norm.re, x.re);
			const s = this.angle.re * x.re;
			x.re = r * Math.cos(s);
			x.im = r * Math.sin(s);
			return x;
		}
		else {
			throw "IllegalArgumentException";
		}
	}

}
