/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

// 色を扱うクラス
//
// 【参考】
// HSV色空間 / HLS色空間
// https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
// https://ja.wikipedia.org/wiki/HLS%E8%89%B2%E7%A9%BA%E9%96%93

export default class Color {
		
	constructor() {
		// 中身は 0 ~ 1に正規化した値とする
		this.r = 0.0;
		this.g = 0.0;
		this.b = 0.0;
		this.a = 1.0;
	}
	
	limit() {
		const color = new Color();
		color.r = Color._limit(this.r);
		color.g = Color._limit(this.g);
		color.b = Color._limit(this.b);
		color.a = Color._limit(this.a);
		return color;
	}

	bake() {
		const color = new Color();
		color.r = this.r * this.a;
		color.g = this.g * this.a;
		color.b = this.b * this.a;
		color.a = 1.0;
		return color.limit();
	}

	addColorMixture(x) {
		// 加法混色
		if(!(x instanceof Color)) {
			throw "IllegalArgumentException";
		}
		return Color.newColorNormalizedRGB(
			this.r + x.r * x.a,
			this.g + x.g * x.a,
			this.b + x.b * x.a,
			this.a);
	}
	
	subColorMixture(x) {
		// 減法混色
		if(!(x instanceof Color)) {
			throw "IllegalArgumentException";
		}
		const r = Math.min(this.r, x.r);
		const g = Math.min(this.g, x.g);
		const b = Math.min(this.b, x.b);
		return Color.newColorNormalizedRGB(
			Color._mix(this.r, r, x.a),
			Color._mix(this.g, g, x.a),
			Color._mix(this.b, b, x.a),
			this.a);
	}

	mul(x) {
		if(x instanceof Color) {
			return Color.newColorNormalizedRGB(
				this.r * x.r,
				this.g * x.g,
				this.b * x.b,
				this.a * x.a);
		}
		else if((typeof x === "number")||(x instanceof Number)) {
			return Color.newColorNormalizedRGB(
				this.r * x,
				this.g * x,
				this.b * x,
				this.a);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	clone() {
		const color = new Color();
		color.r = this.r;
		color.g = this.g;
		color.b = this.b;
		color.a = this.a;
		return color;
	}

	toString() {
		return	"Color[" +
				this.getCSSHex() + ", " +
				this.getCSS255() + ", " +
				this.getCSSPercent() + "]";
	}
	
	static _mix(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	}
	
	static _limit(x) {
		return Math.max(Math.min( x, 1.0), 0.0);
	}

	static _flact(x) {
		return(x - Math.floor(x));
	}

	static _hex(x) {
		x = Math.round(x * 255.0).toString(16);
		if(x.length === 1) {
			return "0" + x;
		}
		else {
			return x;
		}
	}

	_setRGB(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
		if(a) this.a = a;
		return this;
	}

	_setHSV(h, s, v, a) {
		let i, f;

		this.r = v;
		this.g = v;
		this.b = v;
		if(a) this.a = a;

		if(s > 0.0) {
			h *= 6.0;
			i = ~~Math.floor(h);
			f = h - i;
			if(i === 0) {
				this.g *= 1.0 - s * (1.0 - f);
				this.b *= 1.0 - s;
			}
			else if(i === 1) {
				this.r *= 1.0 - s * f;
				this.b *= 1.0 - s;
			}
			else if(i === 2) {
				this.r *= 1.0 - s;
				this.b *= 1.0 - s * (1.0 - f);
			}
			else if(i === 3) {
				this.r *= 1.0 - s;
				this.g *= 1.0 - s * f;
			}
			else if(i === 4) {
				this.r *= 1.0 - s * (1.0 - f);
				this.g *= 1.0 - s;
			}
			else if(i === 5) {
				this.g *= 1.0 - s;
				this.b *= 1.0 - s * f;
			}
		}
		return this;
	}

	_setHSL(h, s, l, a) {

		if(a) this.a = a;

		if(s === 0.0) {
			this.r = 0.0;
			this.g = 0.0;
			this.b = 0.0;
			return this;
		}

		let max;
		if(l < 0.5) {
			max = l * (1.0 + s);
		}
		else {
			max = l * (1.0 - s) + s;
		}
		const min = 2.0 * l - max;
		const delta = max - min;

		h *= 6.0;
		const i = ~~Math.floor(h);
		const f = h - i;

		if(i === 0) {
			this.r = max;
			this.g = max - delta * (1.0 - f);
			this.b = min;
		}
		else if(i === 1) {
			this.r = min + delta * (1.0 - f);
			this.g = max;
			this.b = min;
		}
		else if(i === 2) {
			this.r = min;
			this.g = max;
			this.b = max - delta * (1.0 - f);
		}
		else if(i === 3) {
			this.r = min;
			this.g = min + delta * (1.0 - f);
			this.b = max;
		}
		else if(i === 4) {
			this.r = max - delta * (1.0 - f);
			this.g = min;
			this.b = max;
		}
		else if(i === 5) {
			this.r = max;
			this.g = min;
			this.b = min + delta * (1.0 - f);
		}

		return this;
	}

	_getRGB() {
		return {
			r : this.r,
			g : this.g,
			b : this.b,
			a : this.a
		};
	}

	_getHSV() {
		const max = Math.max( this.r, this.g, this.b );
		const min = Math.min( this.r, this.g, this.b );
		const delta = max - min;

		let h   = 0;
		let s   = max - min;
		const v = max;

		if(max !== 0.0) {
			s /= max;
		}

		if(delta === 0.0) {
			return [h, s, v];
		}

		if(max === this.r) {
			h = (this.g - this.b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		}
		else if(max === this.g) {
			h = 2.0 + (this.b - this.r) / delta;
		}
		else {
			h = 4.0 + (this.r - this.g) / delta;
		}
		h /= 6.0;

		return {
			h : h,
			s : s,
			v : v,
			a : this.a
		};
	}

	_getHSL() {

		const max   = Math.max( this.r, this.g, this.b );
		const min   = Math.min( this.r, this.g, this.b );

		const l = (max + min) * 0.5;
		const delta = max - min;

		if(delta === 0) {
			return [0, l, 0];
		}

		let s;
		if(l < 0.5) {
			s = delta / (max + min);
		}
		else {
			s = delta / (2.0 - max - min);
		}

		let h;
		if(max === this.r) {
			h = (this.g - this.b) / delta;
			if (h < 0.0) {
				h += 6.0;
			}
		}
		else if(max === this.g) {
			h = 2.0 + (this.b - this.r) / delta;
		}
		else {
			h = 4.0 + (this.r - this.g) / delta;
		}
		h /= 6.0;

		return {
			h : h,
			s : s,
			l : l,
			a : this.a
		};
	}

	getNormalizedRGB() {
		return this._getRGB();
	}

	getRGB() {
		return{
			r : Math.round(this.r * 255.0),
			g : Math.round(this.g * 255.0),
			b : Math.round(this.b * 255.0),
			a : Math.round(this.a * 255.0)
		};
	}

	getRRGGBB() {
		return(	(Math.round(255.0 * Color._limit(this.r)) << 16) |
				(Math.round(255.0 * Color._limit(this.g)) << 8 ) |
				(Math.round(255.0 * Color._limit(this.b))      ));
	}

	getAARRGGBB() {
		return( (Math.round(255.0 * Color._limit(this.a)) << 24) |
				(Math.round(255.0 * Color._limit(this.r)) << 16) |
				(Math.round(255.0 * Color._limit(this.g)) << 8 ) |
				(Math.round(255.0 * Color._limit(this.b))      ));
	}

	getNormalizedHSV() {
		return this._getHSV();
	}

	getHSV() {
		const color = this.getNormalizedHSV();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.v = Math.round(color.v * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	getNormalizedHSL() {
		return this._getHSL();
	}

	getHSL() {
		const color = this.getNormalizedHSL();
		color.h = Math.round(color.h * 360.0);
		color.s = Math.round(color.s * 255.0);
		color.l = Math.round(color.l * 255.0);
		color.a = Math.round(color.a * 255.0);
		return color;
	}

	getRed() {
		return Math.round(this.r * 255.0);
	}

	getGreen() {
		return Math.round(this.g * 255.0);
	}

	getBlue() {
		return Math.round(this.b * 255.0);
	}

	getAlpha() {
		return Math.round(this.b * 255.0);
	}

	brighter() {
		const FACTOR = 1.0 / 0.7;
		return this.mul(FACTOR).limit();
	}

	darker() {
		const FACTOR = 0.7;
		return this.mul(FACTOR).limit();
	}

	getCSSHex() {
		if(this.a === 1.0) {
			return "#" +
				Color._hex(Color._limit(this.r)) + 
				Color._hex(Color._limit(this.g)) +
				Color._hex(Color._limit(this.b));
		}
		else {
			return "#" +
				Color._hex(Color._limit(this.a)) + 
				Color._hex(Color._limit(this.r)) + 
				Color._hex(Color._limit(this.g)) +
				Color._hex(Color._limit(this.b));
		}
	}

	getCSS255() {
		if(this.a === 1.0) {
			return "rgb(" +
			Math.round(Color._limit(this.r) * 255) + "," +
			Math.round(Color._limit(this.g) * 255) + "," +
			Math.round(Color._limit(this.b) * 255) + ")";
		}
		else {
			return "rgba(" +
			Math.round(Color._limit(this.r) * 255) + "," +
			Math.round(Color._limit(this.g) * 255) + "," +
			Math.round(Color._limit(this.b) * 255) + "," +
			this.a + ")";
		}
	}

	getCSSPercent() {
		if(this.a === 1.0) {
			return "rgb(" +
			Math.round(Color._limit(this.r) * 100) + "%," +
			Math.round(Color._limit(this.g) * 100) + "%," +
			Math.round(Color._limit(this.b) * 100) + "%)";
		}
		else {
			return "rgba(" +
			Math.round(Color._limit(this.r) * 100) + "%," +
			Math.round(Color._limit(this.g) * 100) + "%," +
			Math.round(Color._limit(this.b) * 100) + "%," +
			Math.round(Color._limit(this.a) * 100) + "%)";
		}
	}
	
	setAlpha(a) {
		const color = this.clone();
		color.a = a;
		return color;
	}

	static newColorNormalizedRGB() {
		let r = 0.0;
		let g = 0.0;
		let b = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].r) r = arguments[0].r;
			if(arguments[0].g) g = arguments[0].g;
			if(arguments[0].b) b = arguments[0].b;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				r = arguments[0][0];
				g = arguments[0][1];
				b = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				r = arguments[0];
				g = arguments[1];
				b = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		// 出力時にLimitする。入力時にはLimitしない。
		const color = new Color();
		color._setRGB(r, g, b, a);
		return color;
	}
	
	static newColorRGB() {
		let r = 0.0;
		let g = 0.0;
		let b = 0.0;
		let a = 255.0;
		if(arguments.length >= 3) {
			r = arguments[0];
			g = arguments[1];
			b = arguments[2];
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		else if(arguments.length >= 1) {
			if(typeof arguments[0] === "number") {
				r = (arguments[0] >> 16) & 0xff;
				g = (arguments[0] >> 8) & 0xff;
				b =  arguments[0] & 0xff;
				if(arguments[1]) {
					a = (arguments[0] >> 24) & 0xff;
				}
			}
			else if(typeof arguments[0].length === "undefined") {
				if(arguments[0].r) r = arguments[0].r;
				if(arguments[0].g) g = arguments[0].g;
				if(arguments[0].b) b = arguments[0].b;
				if(arguments[0].a) a = arguments[0].a;
			}
			else if (arguments[0].length >= 3) {
				r = arguments[0][0];
				g = arguments[0][1];
				b = arguments[0][2];
				if (arguments[0].length >= 4) {
					a = arguments[0][3];
				}
			}
		}
		// 出力時にLimitする。入力時にはLimitしない。
		const color = new Color();
		color._setRGB(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
		return color;
	}

	static newColorNormalizedHSV() {
		let h = 0.0;
		let s = 0.0;
		let v = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].v) v = arguments[0].v;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				v = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				v = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		// HSVの計算上この時点でLimitさせる
		s = Color._limit(s);
		v = Color._limit(v);
		const color = new Color();
		color._setHSV( Color._flact(h), s, v, a );
		return color;
	}

	static newColorHSV() {
		let h = 0.0;
		let s = 0.0;
		let v = 0.0;
		let a = 255.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].v) v = arguments[0].v;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				v = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				v = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		return Color.newColorNormalizedHSV(
			h / 360.0,
			s / 255.0,
			v / 255.0,
			a / 255.0
		);
	}

	static newColorNormalizedHSL() {
		let h = 0.0;
		let s = 0.0;
		let l = 0.0;
		let a = 1.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].l) l = arguments[0].l;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				l = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				l = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		// HLSの計算上この時点でLimitさせる
		s = Color._limit(s);
		l = Color._limit(l);
		const color = new Color();
		color._setHSL( Color._flact(h), s, l, a );
		return color;
	}

	static newColorHSL() {
		let h = 0.0;
		let s = 0.0;
		let l = 0.0;
		let a = 255.0;
		if(arguments.length === 1) {
			if(arguments[0].h) h = arguments[0].h;
			if(arguments[0].s) s = arguments[0].s;
			if(arguments[0].l) l = arguments[0].l;
			if(arguments[0].a) a = arguments[0].a;
			if (arguments[0].length >= 3) {
				h = arguments[0][0];
				s = arguments[0][1];
				l = arguments[0][2];
			}
			if (arguments[0].length >= 4) {
				a = arguments[0][3];
			}
		}
		else {
			if(arguments.length >= 3) {
				h = arguments[0];
				s = arguments[1];
				l = arguments[2];
			}
			if (arguments.length >= 4) {
				a = arguments[3];
			}
		}
		return Color.newColorNormalizedHSL(
			h / 360.0,
			s / 255.0,
			l / 255.0,
			a / 255.0
		);
	}
}

Color.white			= Color.newColorRGB(0xffffff);
Color.lightGray		= Color.newColorRGB(0xd3d3d3);
Color.gray			= Color.newColorRGB(0x808080);
Color.darkGray		= Color.newColorRGB(0xa9a9a9);
Color.black			= Color.newColorRGB(0x000000);
Color.red			= Color.newColorRGB(0xff0000);
Color.pink			= Color.newColorRGB(0xffc0cb);
Color.orange		= Color.newColorRGB(0xffa500);
Color.yellow		= Color.newColorRGB(0xffff00);
Color.green			= Color.newColorRGB(0x008000);
Color.magenta		= Color.newColorRGB(0xff00ff);
Color.cyan			= Color.newColorRGB(0x00ffff);
Color.blue			= Color.newColorRGB(0x0000ff);

Color.WHITE			= Color.white;
Color.LIGHT_GRAY	= Color.lightGray;
Color.GRAY			= Color.gray;
Color.DARK_GRAY		= Color.darkGray;
Color.RED			= Color.red;
Color.PINK			= Color.pink;
Color.ORANGE		= Color.orange;
Color.YELLOW		= Color.yellow;
Color.GREEN			= Color.green;
Color.MAGENTA		= Color.magenta;
Color.CYAN			= Color.cyan;
Color.BLUE			= Color.blue;

