/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ArrayList {
	
	constructor() {
		this.element = [];
		if(arguments.length === 1) {
			for(let i = 0; i < arguments[0].element.length; i++) {
				this.element[i] = arguments[0].element[i];
			}
		}
	}

	each(func) {
		let out = true;
		for(let i = 0; i < this.element.length; i++) {
			const x = this.element[i];
			if(func.call(x, i, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		return this.join(", ");
	}
	
	isEmpty() {
		return this.element.length === 0;
	}
	
	contains(object) {
		return this.element.contains(object);
	}
	
	size() {
		return this.element.length;
	}
	
	clear() {
		this.element.length = 0;
	}
	
	join(separator) {
		if(arguments.length === 0) {
			separator = ",";
		}
		return this.element.join(separator);
	}
	
	clone() {
		const out = new ArrayList();
		for(let i = 0; i < this.element.length; i++) {
			out.element[i] = this.element[i];
		}
		return out;
	}
	
	indexOf(object) {
		for(let i = 0; i < this.element.length; i++) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	lastIndexOf(object) {
		for(let i = this.element.length - 1; i !== -1; i--) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	get(index) {
		return this.element[index];
	}
	
	add() {
		if(arguments.length === 1) {
			const object = arguments[0];
			this.element.push(object);
		}
		else if(arguments.length === 2) {
			const index = arguments[0];
			const object = arguments[1];
			this.element.splice(index, 0, object);
		}
	}
	
	addAll() {
		if(arguments.length === 1) {
			const list  = arguments[0];
			let j = this.element.length;
			for(let i = 0; i < list.length; i++) {
				this.element[j++] = list.element[i];
			}
		}
		else if(arguments.length === 2) {
			let index = arguments[0];
			let list  = arguments[1].element;
			if(list === this.element) {
				list = this.element.slice(0);
			}
			let size = this.element.length - index;
			let target_i = this.element.length + list.length - 1;
			let source_i = this.element.length - 1;
			for(let i = 0; i < size ; i++ ) {
				this.element[target_i--] = this.element[source_i--];
			}
			size = list.length;
			for(let i = 0; i < size; i++) {
				this.element[index++] = list[i];
			}
		}
	}
	
	set(index, object) {
		this.element[index] = object;
	}
	
	remove(index) {
		this.element.splice(index, 1);
	}
	
	removeRange(fromIndex, toIndex) {
		this.element.splice(fromIndex, toIndex - fromIndex);
	}
	
	sort(compareFunction) {
		let compare;
		if(arguments.length === 0) {
			// 比較関数
			compare = function(a, b) {
				if(a === b) {
					return(0);
				}
				if(typeof a === typeof b) {
					return(a < b ? -1 : 1);
				}
				return ((typeof a < typeof b) ? -1 : 1);
			};
		}
		else {
			compare = compareFunction;
		}
		const temp = [];
		// ソート関数（安定マージソート）
		const sort = function(element, first, last, cmp_function) { 
			if(first < last) {
				const middle = Math.floor((first + last) / 2);
				sort(element, first, middle, cmp_function);
				sort(element, middle + 1, last, cmp_function);
				let p = 0, i, j, k;
				for(i = first; i <= middle; i++) {
					temp[p++] = element[i];
				}
				i = middle + 1;
				j = 0;
				k = first;
				while((i <= last) && (j < p)) {
					if(cmp_function(element[i], temp[j]) >= 0) {
						element[k++] = temp[j++];
					}
					else {
						element[k++] = element[i++];
					}
				}
				while(j < p) {
					element[k++] = temp[j++];
				}
			}
			return true;
		};
		sort(this.element, 0, this.element.length - 1, compare);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 色を扱うクラス
//
// 【参考】
// HSV色空間 / HLS色空間
// https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
// https://ja.wikipedia.org/wiki/HLS%E8%89%B2%E7%A9%BA%E9%96%93

class Color {
		
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
		return {
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

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const CSVTool = {
	
	parseCSV: function(text, separator) {
		if(arguments.length < 2) {
			separator = ",";
		}
		// 改行コードの正規化
		text = text.replace(/\r\n?|\n/g, "\n");
		const CODE_SEPARATOR = separator.charCodeAt(0);
		const CODE_CR    = 0x0D;
		const CODE_LF    = 0x0A;
		const CODE_DOUBLEQUOTES = 0x22;
		const out = [];
		const length = text.length;
		let element = "";
		let count_rows    = 0;
		let count_columns = 0;
		let isnextelement = false;
		let isnextline    = false;
		for(let i = 0; i < length; i++) {
			let code = text.charCodeAt(i);
			// 複数行なら一気に全て読み込んでしまう(1文字目がダブルクォーテーションかどうか)
			if((code === CODE_DOUBLEQUOTES)&&(element.length === 0)) {
				i++;
				for(;i < length;i++) {
					code = text.charCodeAt(i);
					if(code === CODE_DOUBLEQUOTES) {
						// フィールドの終了か？
						// 文字としてのダブルクォーテーションなのか
						if((i + 1) !== (length - 1)) {
							if(text.charCodeAt(i + 1) === CODE_DOUBLEQUOTES) {
								i++;
								element += "\""; 
							}
							else {
								break;
							}
						}
						else {
							break;
						}
					}
					else {
						element += text.charAt(i);
					}
				}
			}
			// 複数行以外なら1文字ずつ解析
			else {
				switch(code) {
					case(CODE_SEPARATOR):
						isnextelement = true;
						break;
					case(CODE_CR):
					case(CODE_LF):
						isnextline = true;
						break;
					default:
						break;
				}
				if(isnextelement) {
					isnextelement = false;
					if(out[count_rows] === undefined) {
						out[count_rows] = [];
					}
					out[count_rows][count_columns] = element;
					element = "";
					count_columns += 1;
				}
				else if(isnextline) {
					isnextline = false;
					//文字があったり、改行がある場合は処理
					//例えば CR+LF や 最後のフィールド で改行しているだけなどは無視できる
					if((element !== "")||(count_columns !== 0)) {
						if(out[count_rows] === undefined) {
							out[count_rows] = [];
						}
						out[count_rows][count_columns] = element;
						element = "";
						count_rows    += 1;
						count_columns  = 0;
					}
				}
				else {
					element += text.charAt(i);
				}
			}
			// 最終行に改行がない場合
			if(i === length - 1) {
				if(count_columns !== 0) {
					out[count_rows][count_columns] = element;
				}
			}
		}
		return out;
	},
	
	makeCSV: function(text, separator, newline) {
		if(arguments.length < 2) {
			separator = ",";
		}
		if(arguments.length < 3) {
			newline = "\r\n";
		}
		let out = "";
		const escape = /["\r\n,\t]/;
		if(text !== undefined) {
			for(let i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(let j = 0;j < text[i].length;j++) {
						let element = text[i][j];
						if(escape.test(element)) {
							element = element.replace(/"/g, "\"\"");
							element = "\"" + element + "\"";
						}
						out += element;
						if(j !== text[i].length - 1) {
							out += separator;
						}
					}
				}
				out += newline;
			}
		}
		return out;
	}
};

class File$1 {
	
	constructor(pathname) {
		this.isHTML = (typeof window !== "undefined");
		this.isNode = false;
		if(arguments.length !== 1) {
			throw "IllegalArgumentException";
		}
		else if((typeof pathname === "string")||(pathname instanceof String)) {
			// \を/に置き換える
			this.pathname = pathname.replace(/\\/g, "/" );
		}
		else if(pathname instanceof File$1) {
			this.pathname = pathname.getAbsolutePath();
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	delete_() {
		throw "IllegalMethod";
	}
	
	exists() {
		throw "IllegalMethod";
	}
	
	copy() {
		throw "IllegalMethod";
	}
	
	move() {
		throw "IllegalMethod";
	}
	
	toString() {
		return this.getAbsolutePath();
	}
	
	getName() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合は、ファイル名取得できない
			if(this.isDirectory()) {
				return "";
			}
			const slashsplit = this.pathname.split("/");
			return slashsplit[slashsplit.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	// 親フォルダの絶対パス名
	getParent() {
		const x = this.getAbsolutePath().match(/.*[/\\]/)[0];
		return x.substring(0 ,x.length - 1);
	}
	
	getParentFile() {
		return new File$1(this.getParent());
	}
	
	getExtensionName() {
		if(this.isHTML) {
			const dotlist = this.getName().split(".");
			return dotlist[dotlist.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isAbsolute() {
		if(this.isHTML) {
			return this.getAbsolutePath() === this.pathname;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isDirectory() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合はディレクトリ
			return /\/$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isFile() {
		if(this.isHTML) {
			// 最後がスラッシュで終えていない場合はファイル
			return /[^/]$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	isHidden() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	lastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setLastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	length() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getSubFolders() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getNormalizedPathName() {
		if(this.pathname === "") {
			return ".\\";
		}
		let name = this.pathname.replace(/\//g, "\\");
		if(name.slice(-1) !== "\\") {
			name += "\\";
		}
		return name;
	}
	
	getAllFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	list() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getAbsolutePath() {
		if(this.isHTML) {
			let all_path = null;
			// URLを一度取得する
			if(/^http/.test(this.pathname)) {
				all_path = this.pathname;
			}
			else {
				let curdir = window.location.toString();
				// 最後がスラッシュで終えていないは、ファイル部分を削る
				if(!(/\/$/.test(curdir))) {
					curdir = curdir.match(/.*\//)[0];
				}
				all_path = curdir + this.pathname;
			}
			// ホストとファイルに分ける
			const hosttext = all_path.match(/^http[^/]+\/\/[^/]+\//)[0];
			const filetext = all_path.substr(hosttext.length);
			// パスを1つずつ解析しながら辿っていく
			let name = hosttext;
			const namelist = filetext.split("/");
			let i;
			for(i = 0; i < namelist.length; i++) {
				if((namelist[i] === "") || (namelist[i] === ".")) {
					continue;
				}
				if(namelist[i] === "..") {
					name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
					continue;
				}
				name += namelist[i];
				if(i !== namelist.length - 1) {
					name += "/";
				}
			}
			return name;
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdir() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdirs() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	renameTo() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	run() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	writeLine() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	download(callback) {
		if(this.isHTML) {
			const ext = this.getExtensionName().toLocaleString();
			const that = this;
			if((ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg")) {
				const image = new Image();
				image.onload = function() {
					that.dataImage = image;
					callback(that);
				};
				image.src = this.pathname;
			}
			else {
				const http = File$1.createXMLHttpRequest();
				if(http === null) {
					return null;
				}
				const handleHttpResponse = function (){
					// readyState === 0 UNSENT
					// readyState === 1 OPENED
					// readyState === 2 HEADERS_RECEIVED
					// readyState === 3 LOADING
					if(http.readyState === 4) { // DONE
						if(http.status !== 200) {
							console.log("error downloadText " + that.pathname);
							return null;
						}
						that.dataText = http.responseText;
						callback(that);
					}
				};
				http.onreadystatechange = handleHttpResponse;
				http.open("GET", this.pathname, true);
				http.send(null);
			}
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getImage() {
		if(this.isHTML) {
			return this.dataImage;
		}
	}
	
	getText() {
		if(this.isHTML) {
			return this.dataText;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setText() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getCSV(separator, charset, newline) {
		if(this.isHTML) {
			return(CSVTool.parseCSV(this.dataText, separator, newline));
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setCSV() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	getByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	static createTempFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not createTempFile";
		}
	}
	
	static getCurrentDirectory(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			const file = new File$1("./");
			return file.getParent();
		}
	}
	
	static setCurrentDirectory() {
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not setCurrentDirectory";
		}
	}
	
	static searchFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not searchFile";
		}
	}
	
	static downloadFileList(files, lastCallback, fileCallback) {
		let downloadcount = 0;
		let i;
		const inf = function(filenumber) {
			return function() {
				downloadcount++;
				if(fileCallback && fileCallback.length && fileCallback[filenumber] ) {
					fileCallback[filenumber](files[filenumber]);
				}
				if(downloadcount === files.length) {
					if(lastCallback) {
						lastCallback(files);
					}
				}
			};
		};
		for(i = 0; i < files.length; i++ ) {
			files[i].download(inf(i));
		}
	}

	static createXMLHttpRequest() {
		return new XMLHttpRequest();
	}
	
	static getCSVTool() {
		return CSVTool;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class HashMap {
	
	constructor() {
		this.map = [];
		this.size_ = 0;
		if(arguments.length === 1) {
			for(const key in arguments[0].map) {
				this.map[key] =arguments[0].map[key];
			}
			this.size_ = arguments[0].size_;
		}
	}

	each(func) {
		let out = true;
		for(const key in this.map) {
			const x = this.map[key];
			if(func.call(x, key, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		let output = "";
		let i = 0;
		for(const key in this.map) {
			output += key + "=>" + this.map[key];
			i++;
			if(i !== this.size_) {
				output += "\n";
			}
		}
		return output;
	}
	
	containsKey(key) {
		return (typeof this.map[key] !== "undefined");
	}
	
	containsValue(value) {
		for(const key in this.map) {
			if(this.map[key] === value) {
				return true;
			}
		}
		return false;
	}
	
	isEmpty() {
		return (this.size_ === 0);
	}
	
	clear() {
		this.map   = [];
		this.size_ = 0;
	}
	
	clone() {
		const out = new HashMap();
		for(const key in this.map) {
			out.map[key] = this.map[key];
		}
		out.size_ = this.size_;
		return out;
	}
	
	size() {
		return this.size_;
	}
	
	get(key) {
		return this.map[key];
	}
	
	put(key, value) {
		if(this.containsKey(key) === false) {
			this.map[key] = value;
			this.size_ = this.size_ + 1;
			return null;
		}
		else {
			const output = this.map[key];
			this.map[key] = value;
			return output;
		}
	}
	
	putAll(hashmap) {
		for(const key in hashmap.map) {
			if(typeof this.map[key] === "undefined") {
				this.map[key] = hashmap.map[key];
				this.size_ = this.size_ + 1;
			}
		}
	}
	
	remove(key) {
		if(this.containsKey(key) === false) {
			return null;
		}
		else {
			const output = this.map[key];
			delete this.map[key];
			this.size_ = this.size_ - 1;
			return output;
		}
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class Format {

	/**
	 * C言語のprintfを再現
	 * ロケール、日付時刻等はサポートしていません。
	 * sprintfの変換指定子のpとnはサポートしていません。
	 * @param {String} text 
	 * @param {String} parm パラメータは可変引数
	 * @returns {String}
	 */
	static format() {
		let parm_number = 1;
		const parm = arguments;
		const toUnsign  = function(x) {
			if(x >= 0) {
				return(x);
			}
			else {
				x = -x;
				//16ビットごとに分けてビット反転
				let high = ((~x) >> 16) & 0xFFFF;
				high *= 0x00010000;
				const low  =  (~x) & 0xFFFF;
				return(high + low + 1);
			}
		};
		const func = function(str) {
			// 1文字目の%を除去
			str = str.substring(1, str.length);
			let buff;
			// [6] 変換指定子(最後の1文字を取得)
			buff = str.match(/.$/);
			const type = buff[0];
			if(type === "%") {
				return("%");
			}
			// ここからパラメータの解析開始
			// [1] 引数順
			buff = str.match(/^[0-9]+\$/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				// 数字だけ切り出す
				buff = buff.substring(0, buff.length - 1);
				// 整数へ
				parm_number = parseInt(buff , 10);
			}
			// 引数を取得
			let parameter = parm[parm_number];
			parm_number = parm_number + 1;
			// [2] フラグ
			buff = str.match(/^[-+ #0]+/);
			let isFlagSharp = false;
			let isFlagTextAlignLeft = false;
			let isFlagFillZero = false;
			let sSignCharacter = "";
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("#") !== -1) {
					isFlagSharp = true;
				}
				if(buff.indexOf("-") !== -1) {
					isFlagTextAlignLeft = true;
				}
				if(buff.indexOf(" ") !== -1) {
					sSignCharacter = " ";
				}
				if(buff.indexOf("+") !== -1) {
					sSignCharacter = "+";
				}
				if(buff.indexOf("0") !== -1) {
					isFlagFillZero = true;
				}
			}
			// [3] 最小フィールド幅
			let width = 0;
			buff = str.match(/^([0-9]+|\*)/);
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				if(buff.indexOf("*") !== -1) { // 引数で最小フィールド幅を指定
					width = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else { // 数字で指定
					width = parseInt(buff , 10);
				}
			}
			// [4] 精度の指定
			let isPrecision = false;
			let precision = 0;
			buff = str.match(/^(\.((-?[0-9]+)|\*)|\.)/); //.-3, .* , .
			if(buff !== null) {
				buff = buff[0];
				// 残りの文字列を取得
				str = str.substring(buff.length, str.length);
				isPrecision = true;
				if(buff.indexOf("*") !== -1) { // 引数で精度を指定
					precision = parameter;
					parameter = parm[parm_number];
					parm_number = parm_number + 1;
				}
				else if(buff.length === 1) { // 小数点だけの指定
					precision = 0;
				}
				else { // 数字で指定
					buff = buff.substring(1, buff.length);
					precision = parseInt(buff , 10);
				}
			}
			// 長さ修飾子(非サポート)
			buff = str.match(/^hh|h|ll|l|L|z|j|t/);
			if(buff !== null) {
				str = str.substring(buff.length, str.length);
			}
			// 文字列を作成する
			let output = "";
			let isInteger = false;
			switch(type.toLowerCase()) {
				// 数字関連
				case "d":
				case "i":
				case "u":
				case "b":
				case "o":
				case "x":
					isInteger = true;
					// falls through
				case "e":
				case "f":
				case "g":
				{
					let sharpdata = "";
					let textlength = 0; // 現在の文字を構成するために必要な長さ
					let spacesize;  // 追加する横幅
					// 整数
					if(isInteger) {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseInt(parameter, 10);
						}
						// 正負判定
						if((type === "d") || (type === "i")) {
							if(parameter < 0) {
								sSignCharacter = "-";
								parameter  = -parameter;
							}
							parameter  = Math.floor(parameter);
						}
						else {
							if(parameter >= 0) {
								parameter  = Math.floor(parameter);
							}
							else {
								parameter  = Math.ceil(parameter);
							}
						}
					}
					// 実数
					else {
						// 数字に変換
						if(isNaN(parameter)) {
							parameter = parseFloat(parameter);
						}
						// 正負判定
						if(parameter < 0) {
							sSignCharacter = "-";
							parameter  = -parameter;
						}
						if(!isPrecision) {
							precision = 6;
						}
					}
					// 文字列を作成していく
					switch(type.toLowerCase()) {
						case "d":
						case "i":
							output += parameter.toString(10);
							break;
						case "u":
							output += toUnsign(parameter).toString(10);
							break;
						case "b":
							output += toUnsign(parameter).toString(2);
							if(isFlagSharp) {
								sharpdata = "0b";
							}
							break;
						case "o":
							output  += toUnsign(parameter).toString(8);
							if(isFlagSharp) {
								sharpdata = "0";
							}
							break;
						case "x":
						case "X":
							output  += toUnsign(parameter).toString(16);
							if(isFlagSharp) {
								sharpdata = "0x";
							}
							break;
						case "e":
							output += parameter.toExponential(precision);
							break;
						case "f":
							output += parameter.toFixed(precision);
							break;
						case "g":
							if(precision === 0) { // 0は1とする
								precision = 1;
							}
							output += parameter.toPrecision(precision);
							// 小数点以下の語尾の0の削除
							if((!isFlagSharp) && (output.indexOf(".") !== -1)) {
								output = output.replace(/\.?0+$/, "");  // 1.00 , 1.10
								output = output.replace(/\.?0+e/, "e"); // 1.0e , 1.10e
							}
							break;
						default:
							// 上でチェックしているため、ありえない
							break;
					}
					// 整数での後処理
					if(isInteger) {
						if(isPrecision) { // 精度の付け足し
							spacesize  = precision - output.length;
							for(let i = 0; i < spacesize; i++) {
								output = "0" + output;
							}
						}
					}
					// 実数での後処理
					else {
						if(isFlagSharp) { 
							// sharp指定の時は小数点を必ず残す
							if(output.indexOf(".") === -1) {
								if(output.indexOf("e") !== -1) {
									output = output.replace("e", ".e");
								}
								else {
									output += ".";
								}
							}
						}
					}
					// 指数表記は、3桁表示(double型のため)
					if(output.indexOf("e") !== -1) {
						const buff = function(str) {
							const l   = str.length;
							if(str.length === 3) { // e+1 -> e+001
								return(str.substring(0, l - 1) + "00" + str.substring(l - 1, l));
							}
							else { // e+10 -> e+010
								return(str.substring(0, l - 2) + "0" + str.substring(l - 2, l));
							}
						};
						output = output.replace(/e[+-][0-9]{1,2}$/, buff);
					}
					textlength = output.length + sharpdata.length + sSignCharacter.length;
					spacesize  = width - textlength;
					// 左よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < spacesize; i++) {
							output = output + " ";
						}
					}
					// 0を埋める場合
					if(isFlagFillZero) {
						for(let i = 0; i < spacesize; i++) {
							output = "0" + output;
						}
					}
					// マイナスや、「0x」などを接続
					output = sharpdata + output;
					output = sSignCharacter + output;
					// 0 で埋めない場合
					if((!isFlagFillZero) && (!isFlagTextAlignLeft)) {
						for(let i = 0; i < spacesize; i++) {
							output = " " + output;
						}
					}
					// 大文字化
					if(type.toUpperCase() === type) {
						output = output.toUpperCase();
					}
					break;
				}
				// 文字列の場合
				case "c":
					if(!isNaN(parameter)) {
						parameter = String.fromCharCode(parameter);
					}
					// falls through
				case "s":
				{
					if(!isNaN(parameter)) {
						parameter = parameter.toString(10);
					}
					output = parameter;
					if(isPrecision) { // 最大表示文字数
						if(output.length > precision) {
							output = output.substring(0, precision);
						}
					}
					const s_textlength = output.length; // 現在の文字を構成するために必要な長さ
					const s_spacesize  = width - s_textlength;  // 追加する横幅
					// 左よせ / 右よせ
					if(isFlagTextAlignLeft) {
						for(let i = 0; i < s_spacesize; i++) {
							output = output + " ";
						}
					}
					else {
						// 拡張
						const s = isFlagFillZero ? "0" : " ";
						for(let i = 0; i < s_spacesize; i++) {
							output = s + output;
						}
					}
					break;
				}
				// パーセント
				case "%":
					output = "%";
					break;
				// 未サポート
				case "p":
				case "n":
					output = "(変換できません)";
					break;
				default:
					// 正規表現でチェックしているため、ありえない
					break;
			}
			return (output);	
		};
		return (parm[0].replace(/%[^diubBoxXeEfFgGaAcspn%]*[diubBoxXeEfFgGaAcspn%]/g, func));
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
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

class Complex {

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
				ToComplexFromString(obj, this);
			}
			else if(obj instanceof Object && obj.toString) {
				ToComplexFromString(obj.toString(), this);
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		else if(arguments.length === 2) {
			const obj_0 = arguments[0];
			const obj_1 = arguments[1];
			if((obj_0 instanceof Complex) && (!obj_0._im)) {
				this._re = obj_0._re;
			}
			else if((typeof obj_0 === "number")||(obj_0 instanceof Number)) {
				this._re = obj_0;
			}
			else {
				throw "IllegalArgumentException";
			}
			if((obj_1 instanceof Complex) && (!obj_1._im)) {
				this._im = obj_1._re;
			}
			else if((typeof obj_1 === "number")||(obj_1 instanceof Number)) {
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

	inv() {
		if(this._im === 0) {
			return new Complex(1.0 / this._re);
		}
		else if(this._re === 0) {
			return new Complex(0, - 1.0 / this._im);
		}
		return Complex.ONE.div(this);
	}
	
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
		return (Math.abs(this._re) <  Number.EPSILON) && (Math.abs(this._im) < Number.EPSILON);
	}

	isOne() {
		return (Math.abs(this._re - 1.0) <  Number.EPSILON) && (Math.abs(this._im) < Number.EPSILON);
	}

	isComplex() {
		return (Math.abs(this._im) >= Number.EPSILON);
	}
	
	isReal() {
		return (Math.abs(this._im) < Number.EPSILON);
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

	compareTo() {
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

	abs() {
		return this.norm;
	}

	negate() {
		return new Complex(-this._re, -this._im);
	}

	pow() {
		const x = new Complex(...arguments);
		if((this._im === 0) && (this._im >= 0) && (x._im === 0)) {
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
			if(this._re >= 0) {
				return new Complex(Math.sqrt(this._re));
			}
			else {
				return new Complex(0, Math.sqrt(this._re));
			}
		}
		const r = Math.sqrt(this.norm._re);
		const s = this.angle._re * 0.5;
		return new Complex(r * Math.cos(s), r * Math.sin(s));
	}

	log() {
		if((this._im === 0) && (this._re >= 0)) {
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

	sin() {
		if(this._im === 0) {
			return new Complex(Math.sin(this._re));
		}
		// オイラーの公式より
		// sin x = (e^ix - e^-ex) / 2i
		const a = this.mul(Complex.I).exp();
		const b = this.mul(Complex.I.negate()).exp();
		return a.sub(b).div([0, 2]);
	}

	cos() {
		if(this._im === 0) {
			return new Complex(Math.cos(this._re));
		}
		// オイラーの公式より
		// cos x = (e^ix + e^-ex) / 2
		const a = this.mul(Complex.I).exp();
		const b = this.mul(Complex.I.negate()).exp();
		return a.add(b).div(2);
	}

	tan() {
		if(this._im === 0) {
			return new Complex(Math.tan(this._re));
		}
		// 三角関数の相互関係 tan x = sin x / cos x
		return this.sin().div(this.cos());
	}

	atan() {
		if(this._im === 0) {
			return new Complex(Math.atan(this._re));
		}
		// 逆正接 tan-1 x = i/2 log( i+x / i-x )
		return Complex.I.div(Complex.TWO).mul(Complex.I.add(this).div(Complex.I.sub(this)).log());
	}

	atan2() {
		if(arguments.length === 0) {
			return this.angle;
		}
		else {
			const x = new Complex(...arguments);
			if(this._im || x._im) {
				throw "IllegalArgumentException";
			}
			return Math.atan2(this._re, x._re);
		}
	}

}

Complex.I = new Complex(0, 1);
Complex.ZERO = new Complex(0);
Complex.ONE = new Complex(1);
Complex.TWO = new Complex(2);
Complex.TEN = new Complex(10);

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 「M系列乱数」
// 比較的長い 2^521 - 1通りを出力します。
// 詳細は、奥村晴彦 著『C言語によるアルゴリズム辞典』を参照
// 乱数はCでの動作と同じ値が出ることを確認。(seed = 1として1000番目の値が等しいことを確認)
//
// Javaの仕様に基づく48ビット線形合同法を実装仕様と思いましたが
// 「キャリー付き乗算」、「XorShift」、「線形合同法」などは
// 2つを組にしてプロットするといった使い方をすると、模様が見える可能性があるようで止めました。
// 有名で超高性能な「メルセンヌツイスタ」は、MITライセンスのため組み込みませんでした。

class Random {
		
	constructor() {
		this.x = [];
		for(let i = 0;i < 521;i++) {
			this.x[i] = 0;
		}
		if(arguments.length >= 1) {
			this.setSeed(arguments[0]);
		}
		else {
			// 線形合同法で適当に乱数を作成する
			const seed = ((new Date()).getTime() + Random.seedUniquifier) & 0xFFFFFFFF;
			Random.seedUniquifier = (Random.seedUniquifier + 1) & 0xFFFFFFFF;
			this.setSeed(seed);
		}
	}

	static _unsigned32(x) {
		return ((x < 0) ? ((x & 0x7FFFFFFF) + 0x80000000) : x);
	}
	
	_multiplication32(x1, x2) {
		let b = (x1 & 0xFFFF) * (x2 & 0xFFFF);
		let y = Random._unsigned32(b);
		b = (x1 & 0xFFFF) * (x2 >>> 16);
		y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
		b = (x1 >>> 16) * (x2 & 0xFFFF);
		y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
		return (y & 0xFFFFFFFF);
	}

	_rnd521() {
		const x = this.x;
		for(let i = 0; i < 32; i++) {
			x[i] ^= x[i + 489];
		}
		for(let i = 32; i < 521; i++) {
			x[i] ^= x[i - 32];
		}
	}

	setSeed(seed) {
		// 伏見「乱数」東京大学出版会,1989 の方法により初期値を設定
		let u = 0;
		const x = this.x;
		// seedを使用して線形合同法でx[0-16]まで初期値を設定
		for(let i = 0; i <= 16; i++) {
			for(let j = 0; j < 32; j++) {
				seed = this._multiplication32(seed, 0x5D588B65) + 1;
				u = (u >>> 1) + ((seed < 0) ? 0x80000000 : 0);
			}
			x[i] = u;
		}
		// 残りのビットはx[i] = x[i-32] ^ x[i-521]で生成
		for(let i = 16; i < 521; i++) {
			u = (i === 16) ? i : (i - 17);
			x[i] = ((x[u] << 23) & 0xFFFFFFFF) ^ (x[i - 16] >>> 9) ^ x[i - 1];
		}
		// ビットをシャッフル
		for(let i = 0; i < 4; i++) {
			this._rnd521();
		}
		this.xi = 0;
		this.haveNextNextGaussian = false;
		this.nextNextGaussian = 0;
	}

	genrand_int32() {
		// 全て使用したら、再び混ぜる
		if(this.xi === 521) {
			this._rnd521();
			this.xi = 0;
		}
		const y = Random._unsigned32(this.x[this.xi]);
		this.xi = this.xi + 1;
		return y;
	}

	next(bits) {
		if(bits === 0) {
			return 0;
		}
		else if(bits === 32) {
			return this.genrand_int32();
		}
		else if(bits < 32) {
			// 線形合同法ではないため

			// 上位のビットを使用しなくてもいいがJavaっぽく。
			return (this.genrand_int32() >>> (32 - bits));
		}
		// double型のため、52ビットまでは、整数として出力可能
		else if(bits === 63) {
			// 正の値を出力するように調節
			return (this.next(32) * 0x80000000 + this.next(32));
		}
		else if(bits === 64) {
			return (this.next(32) * 0x100000000 + this.next(32));
		}
		else if(bits < 64) {
			return (this.genrand_int32() * (1 << (bits - 32)) + (this.genrand_int32()  >>> (64 - bits)));
		}
	}

	nextBytes(y) {
		// 配列yに乱数を入れる
		// 8ビットのために、32ビット乱数を1回回すのはもったいない
		for(let i = 0;i < y.length; i++) {
			y[i] = this.next(8);
		}
		return;
	}

	nextInt() {
		if(arguments.length === 1) {
			let r, y;
			const a = arguments[0];
			do {
				r = Random._unsigned32(this.genrand_int32());
				y = r % a;
			} while((r - y + a) > 0x100000000 );
			return y;
		}
		return (this.next(32) & 0xFFFFFFFF);
	}

	nextLong() {
		return this.next(64);
	}

	nextBoolean() {
		// 1ビットのために、32ビット乱数を1回回すのはもったいない
		return (this.next(1) !== 0);
	}

	nextFloat() {
		return (this.next(24) / 0x1000000);
	}

	nextDouble() {
		const a1 = this.next(26) * 0x8000000 + this.next(27);
		const a2 = 0x8000000 * 0x4000000;
		return (a1 / a2);
	}

	nextGaussian() {
		if(this.haveNextNextGaussian) {
			this.haveNextNextGaussian = false;
			return this.nextNextGaussian;
		}
		const a = Math.sqrt( -2 * Math.log( this.nextDouble() ) );
		const b = 2 * Math.PI * this.nextDouble();
		const y = a * Math.sin(b);
		this.nextNextGaussian = a * Math.cos(b);
		this.haveNextNextGaussian = true;
		return y;
	}
}

Random.seedUniquifier = 0x87654321;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

// 内部では1変数内の中の16ビットごとに管理
// 2変数で16ビット*16ビットで32ビットを表す

class BigInteger {

	constructor() {
		this.element     = [];
		this.sign        = 0;
		if((arguments.length === 2) && (typeof Random !== "undefined") && (arguments[1] instanceof Random)) {
			this.sign = 1;
			const len = arguments[0];
			const random = arguments[1];
			const size = ((len - 1) >> 4) + 1;
			let r;
			if(len === 0) {
				return;
			}
			for(let i = 0, j = 0; i < size; i++) {
				if(j === 0) {
					r = random.nextInt(); // 32ビットずつ作成する
					this.element[i] = r & 0xFFFF;
					j = 1;
				}
				else {
					this.element[i] = (r >>> 16) & 0xFFFF;
					j = 0;
				}
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			if((len % 16) !== 0) {
				this.element[this.element.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 最後のビットに 0 をたくさん作成していると、
			// 0のみのデータになる可能性があるためメモリを修正
			this._memory_reduction();
		}
		else if(arguments.length === 3) {
			if(typeof Random === "undefined") {
				return;
			}
			while(true) {
				const x = new BigInteger(arguments[0], arguments[2]);
				if(x.isProbablePrime(arguments[1])) {
					this.element = x.element;
					this.sign = x.sign;
					break;
				}
			}
		}
		else if(arguments.length >= 1) {
			this.sign = 1;
			const obj = arguments[0];
			if(obj instanceof BigInteger) {
				for(let i = 0; i < arguments[0].element.length; i++) {
					this.element[i] = arguments[0].element[i];
				}
				this.sign = arguments[0].sign;
			}
			else if((typeof obj === "number")||(obj instanceof Number)) {
				let x = arguments[0];
				if(x < 0) {
					this.sign = -1;
					x = -x;
				}
				this.element = this._number_to_binary_number(x);
			}
			else if((typeof obj === "string")||(obj instanceof String)) {
				let x = arguments[0].replace(/\s/g, "").toLowerCase();
				let buff = x.match(/^[-+]+/);
				if(buff !==  null) {
					buff = buff[0];
					x = x.substring(buff.length, x.length);
					if(buff.indexOf("-") !==  -1) {
						this.sign = -1;
					}
				}
				if(arguments.length === 2) {
					this.element = this._string_to_binary_number(x, arguments[1]);
				}
				else if(/^0x/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 16);
				}
				else if(/^0b/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 2);
				}
				else if(/^0/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(1, x.length), 8);
				}
				else {
					this.element = this._string_to_binary_number(x, 10);
				}
				// "0"の場合がある為
				if((this.element.length === 1)&&(this.element[0] === 0)) {
					this.element = [];
				}
			}
		}
	}

	equals(x) {
		if(!(x instanceof BigInteger)) {
			x = new BigInteger(x);
		}
		if(this.signum() !==  x.signum()) {
			return false;
		}
		if(this.element.length !==  x.element.length) {
			return false;
		}
		for(let i = 0;i < x.element.length; i++) {
			if(this.element[i] !==  x.element[i]) {
				return false;
			}
		}
		return true;
	}

	toString(radix) {
		if(arguments.length === 0) {
			radix = 10;
		}
		// int型で扱える数値で toString が可能なので、
		// せっかくだからより大きな進数で計算していけば、あとでtoStringする回数が減るテクニック
		// 2進数であれば、2^n乗で計算しても問題がない 4進数や8進数で計算して、2進数に戻せば巡回少数なし
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		//                        max_num > radix^x
		// floor(log max_num / log radix) = x
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		// zeros = "00000000...."
		let zeros = [];
		let i;
		for(i = 0; i < keta; i++) {
			zeros[i] = "0";
		}
		zeros = zeros.join("");
		// v0.03ここまで
		const x = this._binary_number_to_string(this.element, calcradix);
		const y = [];
		let z = "";
		if(this.signum() < 0) {
			y[y.length] = "-";
		}
		for(i = x.length - 1;i >= 0; i--) {
			z = x[i].toString(radix);
			if(i < (x.length - 1)) {
				y[y.length] = zeros.substring(0, keta - z.length);
			}
			y[y.length] = z;
		}
		return y.join("");
	}

	// 内部計算用
	getShort(n) {
		if((n < 0) || (this.element.length <= n)) {
			return 0;
		}
		return this.element[n];
	}

	byteValue() {
		let x = this.getShort(0);
		x &= 0xFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	shortValue() {
		let x = this.getShort(0);
		x &= 0xFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	intValue() {
		let x = this.getShort(0) + (this.getShort(1) << 16);
		x &= 0xFFFFFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	longValue() {
		let x = 0;
		for(let i = 3; i >= 0; i--) {
			x *= 65536;
			x += this.getShort(i);
		}
		if(this.sign < 0) {
			x = -x;
		}
		return x;
	}

	floatValue() {
		return parseFloat(this.toString());
	}

	doubleValue() {
		return parseFloat(this.toString());
	}

	clone() {
		const y = new BigInteger();
		y.element = this.element.slice(0);
		y.sign    = this.sign;
		return y;
	}

	getLowestSetBit() {
		for(let i = 0;i < this.element.length;i++) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 0; j < 16; j++) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j;
					}
				}
			}
		}
		return -1;
	}

	bitLength() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 15; j >= 0; j--) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j + 1;
					}
				}
			}
		}
		return 0;
	}

	bitCount() {
		let target;
		if(this.sign >= 0) {
			target = this;
		}
		else {
			target = this.add(new BigInteger(1));
		}
		const len = target.bitLength();
		let bit = 0;
		let count = 0;
		for(let i = 0;bit < len;i++) {
			const x = target.element[i];
			for(let j = 0;((j < 16) && (bit < len));j++, bit++) {
				if(((x >>> j) & 1) !==  0) {
					count = count + 1;
				}
			}
		}
		return count;
	}

	// 内部計算用
	// 負の場合は、2の補数表現を作成します
	getTwosComplement(len) {
		const y = this.clone();
		if(y.sign >= 0) {
			return y;
		}
		else {
			// 正にする
			y.sign = 1;
			// ビットの数が存在しない場合は数える
			if(arguments.length === 0) {
				len = y.bitLength();
			}
			const e = y.element;
			// ビット反転後
			for(let i = 0; i < e.length; i++) {
				e[i] ^= 0xFFFF;
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			// nビットのマスク（なお負の値を表す最上位ビットは削除する）
			if((len % 16) !== 0) {
				e[e.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 1を加算
			y._add(new BigInteger(1));
			return y;
		}
	}

	_and(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 & x2;
		}
		if(this.bitLength() === 0) {
			this.element = [];
			this.sign = 0;
		}
		if((s1 === 1)||(s2 === 1)) {
			this.sign = 1;
		}
		// 出力が負の場合は、2の補数
		else if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	and(val) {
		return this.clone()._and(val);
	}

	_or(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 | x2;
		}
		this.sign = ((s1 === -1)||(s2 === -1)) ? -1 : Math.max(s1, s2);
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	or(val) {
		return this.clone()._or(val);
	}

	_xor(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 ^ x2;
		}
		this.sign = ((s1 !== 0)&&(s1 !== s2)) ? -1 : 1;
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	xor(val) {
		return(this.clone()._xor(val));
	}

	_not() {
		return(this._add(new BigInteger(1))._negate());
	}

	not() {
		return(this.clone()._not());
	}

	_andNot(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		return(this._and(val.not()));
	}

	andNot(val) {
		return(this.clone()._andNot(val));
	}

	_number_to_binary_number(x) {
		if(x > 0xFFFFFFFF) {
			return(this._string_to_binary_number(x.toFixed(), 10));
		}
		const y = [];
		while(x !==  0) {
			y[y.length] = x & 1;
			x >>>= 1;
		}
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_string_to_binary_number(text, radix) {
		// 下の変換をすることで、2進数での変換時に内部のforの繰り返す回数が減る
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		let x = [];
		const y = [];
		const len = Math.ceil(text.length / keta);
		let offset = text.length;
		for(let i = 0; i < len; i++ ) {
			offset -= keta;
			if(offset >= 0) {
				x[i] = parseInt(text.substring(offset, offset + keta), radix);
			}
			else {
				x[i] = parseInt(text.substring(0, offset + keta), radix);
			}
		}
		radix = calcradix;
		// v0.03ここまで
		// 2で割っていくアルゴリズムで2進数に変換する
		while(x.length !==  0) {
			// 2で割っていく
			// 隣の桁でたcarryはradix進数をかけて桁上げしてる
			let carry = 0;
			for(let i = x.length - 1; i >= 0; i--) {
				const a = x[i] + carry * radix;
				x[i]  = a >>> 1;
				carry = a & 1;
			}
			// 1余るかどうかをテストする
			y[y.length] = carry;
			// xが0になっている部分は削除していく
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		// メモリ節約のため1つの変数（16ビット）に収めるだけ収めていく
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_binary_number_to_string(binary, radix) {
		const add = function(x1, x2, y) {
			const size = x1.length;
			let carry = 0;
			for(let i = 0; i < size; i++) {
				y[i] = x1[i] + ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(y[i] >= radix) {
					carry = 1;
					y[i] -= radix;
				}
				else {
					carry = 0;
				}
			}
			if(carry === 1) {
				y[size] = 1;
			}
		};
		const y = [0];
		const t = [1];
		for(let i = 0;i < binary.length;i++) {
			for(let j = 0; j < 16; j++) {
				if((binary[i] >>> j) & 1) {
					add(t, y, y);
				}
				add(t, t, t);
			}
		}
		return y;
	}

	_memory_allocation(n) {
		const elementsize = this.element.length << 4;
		if(elementsize < n) {
			const addsize = (((n - elementsize - 1) & 0xFFFFFFF0) >>> 4) + 1;
			for(let i = 0;i < addsize;i++) {
				this.element[this.element.length] = 0;
			}
		}
	}

	_memory_reduction() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				if(i < this.element.length - 1) {
					this.element.splice(i + 1, this.element.length - i - 1);
				}
				return;
			}
		}
		this.sign = 0;
		this.element = [];
	}

	// ユークリッド互除法（非再帰）
	// x = this, y = val としたとき gcd(x,y)を返す
	gcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let x = this, y = val, z;
		while(y.signum() !== 0) {
			z = x.remainder(y);
			x = y;
			y = z;
		}
		return x;
	}

	// 拡張ユークリッド互除法（非再帰）
	// x = this, y = valとしたとき、 a*x + b*y = c = gcd(x, y) の[a, b, c]を返す
	extgcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const ONE  = new BigInteger(1);
		const ZERO = new BigInteger(0);
		let r0 = this, r1 = val, r2, q1;
		let a0 = ONE,  a1 = ZERO, a2;
		let b0 = ZERO, b1 = ONE,  b2;
		while(r1.signum() !== 0) {
			const y = r0.divideAndRemainder(r1);
			q1 = y[0];
			r2 = y[1];
			a2 = a0.subtract(q1.multiply(a1));
			b2 = b0.subtract(q1.multiply(b1));
			a0 = a1;
			a1 = a2;
			b0 = b1;
			b1 = b2;
			r0 = r1;
			r1 = r2;
		}
		return [a0, b0, r0];
	}

	_abs() {
		// -1 -> 1, 0 -> 0, 1 -> 1
		this.sign *= this.sign;
		return this;
	}

	abs() {
		return this.clone()._abs();
	}


	_negate() {
		this.sign *= -1;
		return this;
	}

	negate() {
		return this.clone()._negate();
	}

	signum() {
		if(this.element.length === 0) {
			return 0;
		}
		return this.sign;
	}

	compareToAbs(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.element.length < val.element.length) {
			return -1;
		}
		else if(this.element.length > val.element.length) {
			return 1;
		}
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !== val.element[i]) {
				const x = this.element[i] - val.element[i];
				return ( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
			}
		}
		return 0;
	}

	compareTo(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.signum() !== val.signum()) {
			if(this.sign > val.sign) {
				return 1;
			}
			else {
				return -1;
			}
		}
		else if(this.signum() === 0) {
			return 0;
		}
		return this.compareToAbs(val) * this.sign;
	}

	max(val) {
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	min(val) {
		if(this.compareTo(val) >= 0) {
			return val.clone();
		}
		else {
			return this.clone();
		}
	}

	_shift(n) {
		if(n === 0) {
			return this;
		}
		const x = this.element;
		// 1ビットなら専用コードで高速計算
		if(n === 1) {
			let i = x.length - 1;
			if((x[i] & 0x8000) !==  0) {
				x[x.length] = 1;
			}
			for(;i >= 0;i--) {
				x[i] <<= 1;
				x[i]  &= 0xFFFF;
				if((i > 0) && ((x[i - 1] & 0x8000) !==  0)) {
					x[i] += 1;
				}
			}
		}
		else if(n === -1) {
			for(let i = 0;i < x.length;i++) {
				x[i] >>>= 1;
				if((i < x.length - 1) && ((x[i + 1] & 1) !==  0)) {
					x[i] |= 0x8000;
				}
			}
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		else {
			// 16ビット単位なら配列を追加削除する高速計算
			if(n >= 16) {
				const m = n >>> 4;
				for(let i = x.length - 1; i >= 0; i--) {
					x[i + m] = x[i];
				}
				for(let i = m - 1; i >= 0; i--) {
					x[i] = 0;
				}
				n &= 0xF;
			}
			else if(n <= -16){
				const m = (-n) >>> 4;
				x.splice(0, m);
				n += m << 4;
			}
			if(n !== 0) {
				// 15ビット以内ならビット演算でまとめて操作
				if(0 < n) {
					let carry = 0;
					for(let i = 0; i < x.length; i++) {
						x[i] = (x[i] << n) + carry;
						if(x[i] > 0xFFFF) {
							carry = x[i] >>> 16;
							x[i] &= 0xFFFF;
						}
						else {
							carry = 0;
						}
					}
					if(carry !== 0) {
						x[x.length] = carry;
					}
				}
				else {
					n = -n;
					for(let i = 0; i < x.length; i++) {
						if(i !== x.length - 1) {
							x[i] += x[i + 1] << 16;
							x[i] >>>= n;
							x[i] &= 0xFFFF;
						}
						else {
							x[i] >>>= n;
						}
					}
					if(x[x.length - 1] === 0) {
						x.pop();
					}
				}
			}
		}
		return this;
	}

	shift(n) {
		return this.clone()._shift(n);
	}

	shiftLeft(n) {
		return this.shift(n);
	}

	shiftRight(n) {
		return this.shift(-n);
	}

	_add(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const o1 = this;
		const o2 = val;
		let x1 = o1.element;
		let x2 = o2.element;
		if(o1.sign === o2.sign) {
			//足し算
			this._memory_allocation(x2.length << 4);
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] += ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] > 0xFFFF) {
					carry = 1;
					x1[i] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x1[x1.length] = carry;
			}
		}
		else {
			// 引き算
			const compare = o1.compareToAbs(o2);
			if(compare === 0) {
				this.element = [];
				this.sign = 1;
				return this;
			}
			else if(compare === -1) {
				this.sign = o2.sign;
				const swap = x1;
				x1 = x2.slice(0);
				x2 = swap;
			}
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] -= ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] < 0) {
					x1[i] += 0x10000;
					carry  = 1;
				}
				else {
					carry  = 0;
				}
			}
			this.element = x1;
			this._memory_reduction();
		}
		return this;
	}

	add(val) {
		return this.clone()._add(val);
	}

	_subtract(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const sign = val.sign;
		const out  = this._add(val._negate());
		val.sign = sign;
		return out;
	}

	subtract(val) {
		return this.clone()._subtract(val);
	}

	_multiply(val) {
		const x = this.multiply(val);
		this.element = x.element;
		this.sign    = x.sign;
		return this;
	}

	multiply(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out  = new BigInteger();
		const buff = new BigInteger();
		const o1 = this;
		const o2 = val;
		const x1 = o1.element;
		const x2 = o2.element;
		const y  = out.element;
		for(let i = 0; i < x1.length; i++) {
			buff.element = [];
			// x3 = x1[i] * x2
			const x3 = buff.element;
			let carry = 0;
			for(let j = 0; j < x2.length; j++) {
				x3[j] = x1[i] * x2[j] + carry;
				if(x3[j] > 0xFFFF) {
					carry = x3[j] >>> 16;
					x3[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x3[x3.length] = carry;
			}
			// x3 = x3 << (i * 16)
			//buff._shift(i << 4);
			for(let j = x3.length - 1; j >= 0; j--) {
				x3[j + i] = x3[j];
			}
			for(let j = i - 1; j >= 0; j--) {
				x3[j] = 0;
			}
			// y = y + x3 (out._add(buff))
			//out._add(buff);
			carry = 0;
			out._memory_allocation(x3.length << 4);
			for(let j = i; j < y.length; j++) {
				y[j] += ((x3.length >= (j + 1)) ? x3[j] : 0) + carry;
				if(y[j] > 0xFFFF) {
					carry = 1;
					y[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				y[y.length] = carry;
			}
		}
		out.sign = this.sign * val.sign;
		return out;
	}

	_divideAndRemainder(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out = [];
		if(val.signum() === 0) {
			out[0] = 1 / 0;
			out[1] = 0 / 0;
			return out;
		}
		const compare = this.compareToAbs(val);
		if(compare < 0) {
			out[0] = new BigInteger(0);
			out[1] = this.clone();
			return out;
		}
		else if(compare === 0) {
			out[0] = new BigInteger(1);
			out[0].sign = this.sign * val.sign;
			out[1] = new BigInteger(0);
			return out;
		}
		const ONE = new BigInteger(1);
		const size = this.bitLength() - val.bitLength();
		const x1 = this.clone()._abs();
		const x2 = val.shift(size)._abs();
		const y  = new BigInteger();
		for(let i = 0; i <= size; i++) {
			if(x1.compareToAbs(x2) >= 0) {
				x1._subtract(x2);
				y._add(ONE);
			}
			if(i === size) {
				break;
			}
			x2._shift(-1);
			y._shift(1);
		}
		out[0] = y;
		out[0].sign = this.sign * val.sign;
		out[1] = x1;
		out[1].sign = this.sign;
		return out;
	}

	divideAndRemainder(val) {
		return this.clone()._divideAndRemainder(val);
	}

	_divide(val) {
		return this._divideAndRemainder(val)[0];
	}

	divide(val) {
		return this.clone()._divide(val);
	}

	_remainder(val) {
		return this._divideAndRemainder(val)[1];
	}

	remainder(val) {
		return this.clone()._remainder(val);
	}

	_mod(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(val.signum() < 0) {
			return null;
		}
		const y = this._divideAndRemainder(val);
		if(y[1] instanceof BigInteger) {
			if(y[1].signum() >= 0) {
				return y[1];
			}
			else {
				return y[1]._add(val);
			}
		}
		return null;
	}

	mod(val) {
		return this.clone()._mod(val);
	}

	_setBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] |= 1 << (n & 0xF);
		return this;
	}

	setBit(n) {
		return this.clone()._setBit(n);
	}

	_flipBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] ^= 1 << (n & 0xF);
		return this;
	}

	flipBit(n) {
		return this.clone()._flipBit(n);
	}

	clearBit(n) {
		const y = this.clone();
		y.element[n >>> 4] &= ~(1 << (n & 0xF));
		y._memory_reduction();
		return y;
	}

	testBit(n) {
		return ((this.element[n >>> 4] >>> (n & 0xF)) & 1);
	}

	pow(n) {
		let x, y;
		x = new BigInteger(this);
		y = new BigInteger(1);
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x);
			}
			x = x.multiply(x);
			n >>>= 1;
		}
		return y;
	}

	modPow(exponent, m) {
		m = new BigInteger(m);
		let x = new BigInteger(this);
		let y = new BigInteger(1);
		const e = new BigInteger(exponent);
		while(e.element.length !== 0) {
			if((e.element[0] & 1) !== 0) {
				y = y.multiply(x).mod(m);
			}
			x = x.multiply(x).mod(m);
			e._shift(-1);
		}
		return y;
	}

	modInverse(m) {
		m = new BigInteger(m);
		const y = this.extgcd(m);
		const ONE  = new BigInteger(1);
		if(y[2].compareTo(ONE) !== 0) {
			return null;
		}
		// 正にするため remainder ではなく mod を使用する
		return y[0]._add(m)._mod(m);
	}

	isProbablePrime(certainty) {
		const e = this.element;
		//0, 1, 2 -> true
		if( (e.length === 0) || ((e.length === 1)&&(e[0] <= 2)) ) {
			return true;
		}
		//even number -> false
		else if( ((e[0] & 1) === 0) || (certainty <= 0) ) {
			return false;
		}
		if(typeof Random === "undefined") {
			return false;
		}
		// ミラーラビン素数判定法
		// かなり処理が重たいです。まあお遊び程度に使用という感じで。
		certainty	= certainty >> 1;
		const ZERO	= new BigInteger(0);
		const ONE	= new BigInteger(1);
		const n		= this;
		const LEN	= n.bitLength();
		const n_1	= n.subtract(ONE);
		const s 	= n_1.getLowestSetBit();
		const d 	= n_1.shift(-s);
		const random = new Random();
		let a;
		let isComposite;
		for(let i = 0; i < certainty; i++ ) {
			//[ 1, n - 1] の範囲から a を選択
			do {
				a = new BigInteger( LEN, random );
			} while(( a.compareTo(ZERO) === 0 )||( a.compareTo(n) !== -1 ));
			// a^d != 1 mod n
			a = a.modPow(d, n);
			if( a.compareTo(ONE) === 0 ) {
				continue;
			}
			// x ^ 4 % 2 = ((x ^ 2 % 2) ^ 2 % 2) のように分解しておく
			isComposite = true;
			for(let j = 0; j <= s; j++) {
				if(a.compareTo(n_1) === 0) {
					isComposite = false;
					break;
				}
				if(j < s) {
					a = a.multiply(a)._mod(n);
				}
			}
			if(isComposite) {
				return false;
			}
		}
		return true;
	}

	nextProbablePrime() {
		if(typeof Random === "undefined") {
			return(new BigInteger(0));
		}
		const x = this.clone();
		const ONE	= new BigInteger(1);
		while(true) {
			x._add(ONE);
			if(x.isProbablePrime(100)) {
				break;
			}
		}
		return x;
	}
	
	static valueOf(x) {
		return new BigInteger(x);
	}
	
	static probablePrime(bitLength, rnd) {
		return new BigInteger(bitLength ,100 ,rnd);
	}
	
}

BigInteger.ONE = new BigInteger(1);
BigInteger.TEN = new BigInteger(10);
BigInteger.ZERO = new BigInteger(0);

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class BigDecimal {

	constructor() {
		this.integer = 0;
		this._scale = 0;
		let p1 = 0;
		let p2 = 0;
		let p3 = null;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if(arguments.length >= 3) {
			p3 = arguments[2];
		}
		// BigDecimal(BigInteger val, MathContext mc)
		if(p2 instanceof MathContext) {
			p3 = p2;
		}
		if(p1 instanceof BigDecimal) {
			// Senko.println(p1.integer);
			this.integer	= p1.integer.clone();
			this._scale		= p1._scale;
			this.int_string	= p1.int_string;
		}
		else if(p1 instanceof BigInteger) {
			this.integer = p1.clone();
			this._scale   = p2;
		}
		else if(typeof p1 === "number") {
			// 整数か
			if(p1 === Math.floor(p1)) {
				this.integer = new BigInteger(p1);
				this._scale   = 0;
			}
			// 実数か
			else {
				this._scale = 0;
				while(true) {
					p1 = p1 * 10;
					this._scale = this._scale + 1;
					if(p1 === Math.floor(p1)) {
						break;
					}
				}
				this.integer = new BigInteger(p1);
			}
		}
		else if(typeof p1 === "string") {
			this._scale = 0;
			let buff;
			// 正規化
			let text = p1.replace(/\s/g, "").toLowerCase();
			// +-の符号があるか
			let number_text = "";
			buff = text.match(/^[+-]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				if(buff.indexOf("-") !== -1) {
					number_text += "-";
				}
			}
			// 整数部があるか
			buff = text.match(/^[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				number_text += buff;
			}
			// 小数部があるか
			buff = text.match(/^\.[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				buff = buff.substr(1);
				this._scale   = this._scale + buff.length;
				number_text += buff;
			}
			// 指数表記があるか
			buff = text.match(/^e[+-]?[0-9]+/);
			if(buff !== null) {
				buff = buff[0].substr(1);
				this._scale   = this._scale - parseInt(buff, 10);
			}
			this.integer = new BigInteger(number_text, 10);
		}
		if(p3 instanceof MathContext) {
			const newbigdecimal = this.round(p3);
			this.integer	= newbigdecimal.integer;
			this._scale		= newbigdecimal._scale;
		}
		//	Senko.println(p1 + "\t\n->\t[" + this.integer + "," + this._scale +"]\n\t"+ this.toEngineeringString() );
	}

	_getUnsignedIntegerString() {
		// キャッシュする
		if(typeof this.int_string === "undefined") {
			this.int_string = this.integer.toString(10).replace(/^-/, "");
		}
		return this.int_string;
	}

	clone() {
		return new BigDecimal(this);
	}

	scale() {
		return this._scale;
	}

	signum() {
		return this.integer.signum();
	}

	precision() {
		return this._getUnsignedIntegerString().length;
	}

	unscaledValue() {
		return new BigInteger(this.integer);
	}

	toScientificNotation(e) {
		const text	= this._getUnsignedIntegerString();
		let s		= this.scale();
		const x		= [];
		let i, k;
		// -
		if(this.signum() === -1) {
			x[x.length] = "-";
		}
		// 表示上の桁数
		s = - e - s;
		// 小数点が付かない
		if(s >= 0) {
			x[x.length] = text;
			for(i = 0; i < s; i++) {
				x[x.length] = "0";
			}
		}
		// 小数点が付く
		else {
			k = this.precision() + s;
			if(0 < k) {
				x[x.length] = text.substring(0, k);
				x[x.length] = ".";
				x[x.length] = text.substring(k, text.length);
			}
			else {
				k = - k;
				x[x.length] = "0.";
				for(i = 0; i < k; i++) {
					x[x.length] = "0";
				}
				x[x.length] = text;
			}
		}
		x[x.length] = "E";
		if(e >= 0) {
			x[x.length] = "+";
		}
		x[x.length] = e;
		return x.join("");
	}

	toString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			return this.toScientificNotation(x);
		}
	}

	toEngineeringString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			// 0 でない値の整数部が 1 〜 999 の範囲に収まるように調整
			return this.toScientificNotation(Math.floor(x / 3) * 3);
		}
	}

	toPlainString() {
		// スケールの変換なし
		if(this.scale() === 0) {
			if(this.signum() < 0) {
				return "-" + this._getUnsignedIntegerString();
			}
			else {
				return this._getUnsignedIntegerString();
			}
		}
		// 指数0で文字列を作成後、Eの後ろの部分をとっぱらう
		const text = this.toScientificNotation(0);
		return text.match(/^[^E]*/)[0];
	}

	ulp() {
		return new BigDecimal(BigInteger.ONE, this.scale());
	}

	setScale(newScale, roundingMode) {
		if(this.scale() === newScale) {
			// scaleが同一なので処理の必要なし
			return(this.clone());
		}
		if(arguments.length === 1) {
			roundingMode = RoundingMode.UNNECESSARY;
		}
		else {
			roundingMode = RoundingMode.getRoundingMode(roundingMode);
		}
		// 文字列を扱ううえで、符号があるとやりにくいので外しておく
		let text		= this._getUnsignedIntegerString();
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		// scale の誤差
		// 0 以上なら 0 を加えればいい。0未満なら0を削るか、四捨五入など丸めを行う
		const delta		= newScale - this.scale();	// この桁分増やすといい
		if(0 <= delta) {
			// 0を加える
			let i;
			for(i = 0; i < delta; i++) {
				text = text + "0";
			}
			return new BigDecimal(new BigInteger(sign_text + text), newScale);
		}
		const keta			= text.length + delta;		// 最終的な桁数
		const keta_marume		= keta + 1;
		if(keta <= 0) {
			// 指定した scale では設定できない場合
			// 例えば "0.1".setScale(-2), "10".setScale(-3) としても表すことは不可能であるため、
			// sign（-1, 0, +1）のどれかの数値を使用して丸める
			const outdata = (sign + roundingMode.getAddNumber(sign)) / 10;
			// 上記の式は、CEILINGなら必ず1、正でCEILINGなら1、負でFLOORなら1、それ以外は0となり、
			// さらに元々の数値が 0 なら 0、切り捨て不能なら例外が返る計算式である。
			// これは Java の動作をまねています。
			return new BigDecimal(new BigInteger(outdata), newScale);
		}
		{
			// 0を削るだけで解決する場合
			// 単純な切捨て(0を削るのみ)
			const zeros			= text.match(/0+$/);
			const zero_length		= (zeros !== null) ? zeros[0].length : 0;
			if(( (zero_length + delta) >= 0 ) || (roundingMode === RoundingMode.DOWN)) {
				return new BigDecimal(new BigInteger(sign_text + text.substring(0, keta)), newScale);
			}
		}
		{
			// 丸め計算で解決する場合
			// 12345 -> '123'45
			text = text.substring(0, keta_marume);
			// 丸め計算に必要な切り取る桁数(後ろの1～2桁を取得)
			const cutsize = text.length > 1 ? 2 : 1;
			// '123'45 -> 1'23'4
			const number = parseInt(text.substring(text.length - cutsize, text.length)) * sign;
			// 「元の数」と「丸めに必要な数」を足す
			const x1 = new BigInteger(sign_text + text);
			const x2 = new BigInteger(roundingMode.getAddNumber(number));
			text = x1.add(x2).toString();
			// 丸め後の桁数に戻して
			return new BigDecimal(new BigInteger(text.substring(0, text.length - 1)), newScale);
		}
	}

	round(mc) {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const newPrecision	= mc.getPrecision();
		const delta			= newPrecision - this.precision();
		if((delta === 0)||(newPrecision === 0)) {
			return this.clone();
		}
		const newBigDecimal = this.setScale( this.scale() + delta, mc.getRoundingMode());
		/* 精度を上げる必要があるため、0を加えた場合 */
		if(delta > 0) {
			return newBigDecimal;
		}
		/* 精度を下げる必要があるため、丸めた場合は、桁の数が正しいか調べる */
		if(newBigDecimal.precision() === mc.getPrecision()) {
			return newBigDecimal;
		}
		/* 切り上げなどで桁数が１つ増えた場合 */
		const sign_text	= newBigDecimal.integer.signum() >= 0 ? "" : "-";
		const abs_text	= newBigDecimal._getUnsignedIntegerString();
		const inte_text	= sign_text + abs_text.substring(0, abs_text.length - 1);
		return new BigDecimal(new BigInteger(inte_text), newBigDecimal.scale() - 1);
	}

	abs(mc) {
		const output = this.clone();
		output.integer = output.integer.abs();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	plus(mc) {
		const output = this.clone();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	negate(mc) {
		const output = this.clone();
		output.integer = output.integer.negate();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	compareTo(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= val;
		// 簡易計算
		{
			const src_sign	= src.signum();
			const tgt_sign	= tgt.signum();
			if((src_sign === 0) && (src_sign === tgt_sign)) {
				return 0;
			}
			else if(src_sign === 0) {
				return - tgt_sign;
			}
			else if(tgt_sign === 0) {
				return src_sign;
			}
		}
		// 実際に計算する
		if(src._scale === tgt._scale) {
			return src.integer.compareTo(tgt.integer);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return src.integer.compareTo(newdst.integer);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return newsrc.integer.compareTo(tgt.integer);
		}
	}

	equals(x) {
		if(!(x instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		return ((this._scale === x._scale) && (this.integer.equals(x.integer)));
	}

	min(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) <= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	max(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	movePointLeft(n) {
		let output = this.scaleByPowerOfTen( -n );
		output = output.setScale(Math.max(this.scale() + n, 0));
		return output;
	}

	movePointRight(n) {
		let output = this.scaleByPowerOfTen( n );
		output = output.setScale(Math.max(this.scale() - n, 0));
		return output;
	}

	scaleByPowerOfTen(n) {
		const output = this.clone();
		output._scale = this.scale() - n;
		return output;
	}

	stripTrailingZeros() {
		// 0をできる限り取り除く
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		const text		= this.integer.toString(10).replace(/^-/, "");
		const zeros		= text.match(/0+$/);
		let zero_length	= (zeros !== null) ? zeros[0].length : 0;
		if(zero_length === text.length) {
			// 全て 0 なら 1 ケタ残す
			zero_length = text.length - 1;
		}
		const newScale	= this.scale() - zero_length;
		return new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), newScale);
	}

	add(augend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(augend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= augend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			// 1 e1 + 1 e1 = 1
			return new BigDecimal(src.integer.add(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			// 1 e-2 + 1 e-1
			const newdst = tgt.setScale(src._scale);
			// 0.01 + 0.10 = 0.11 = 11 e-2
			return new BigDecimal(src.integer.add(newdst.integer), newscale, mc);
		}
		else {
			// 1 e-1 + 1 e-2
			const newsrc = src.setScale(tgt._scale);
			// 0.1 + 0.01 = 0.11 = 11 e-2
			return new BigDecimal(newsrc.integer.add(tgt.integer), newscale, mc);
		}
	}

	subtract(subtrahend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(subtrahend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= subtrahend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			return new BigDecimal(src.integer.subtract(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return new BigDecimal(src.integer.subtract(newdst.integer), newscale, mc);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return new BigDecimal(newsrc.integer.subtract(tgt.integer), newscale, mc);
		}
	}

	multiply(multiplicand, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(multiplicand instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= multiplicand;
		const newinteger	= src.integer.multiply(tgt.integer);
		// 0.1 * 0.01 = 0.001
		const newscale	= src._scale + tgt._scale;
		return new BigDecimal(newinteger, newscale, mc);
	}

	divideToIntegralValue(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const getDigit  = function( num ) {
			let i;
			let text = "1";
			for(i = 0; i < num; i++) {
				text = text + "0";
			}
			return new BigInteger(text);
		};
		if(divisor.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}

		// 1000e0		/	1e2				=	1000e-2
		// 1000e0		/	10e1			=	100e-1
		// 1000e0		/	100e0			=	10e0
		// 1000e0		/	1000e-1			=	1e1
		// 1000e0		/	10000e-2		=	1e1
		// 1000e0		/	100000e-3		=	1e1

		// 10e2			/	100e0			=	1e1
		// 100e1		/	100e0			=	1e1
		// 1000e0		/	100e0			=	10e0
		// 10000e-1		/	100e0			=	100e-1	
		// 100000e-2	/	100e0			=	1000e-2

		const src		= this;
		const tgt		= divisor;
		let src_integer	= src.integer;
		let tgt_integer	= tgt.integer;
		const newScale	= src._scale - tgt._scale;

		// 100e-2 / 3e-1 = 1 / 0.3 -> 100 / 30
		if(src._scale > tgt._scale) {
			// src._scale に合わせる
			tgt_integer = tgt_integer.multiply(getDigit(  newScale ));
		}
		// 1e-1 / 3e-2 = 0.1 / 0.03 -> 10 / 3
		else if(src._scale < tgt._scale) {
			// tgt._scale に合わせる
			src_integer = src_integer.multiply(getDigit( -newScale ));
		}

		// とりあえず計算結果だけ作ってしまう
		const new_integer	= src_integer.divide(tgt_integer);
		const sign			= new_integer.signum();
		if(sign !== 0) {
			const text	= new_integer.toString(10).replace(/^-/, "");
			// 指定した桁では表すことができない
			if((mc.getPrecision() !== 0) && (text.length > mc.getPrecision())) {
				throw "ArithmeticException";
			}
			// 結果の優先スケール に合わせる (this.scale() - divisor.scale())
			if(text.length <= (-newScale)) {
				// 合わせることができないので、0をできる限り削る = stripTrailingZerosメソッド
				const zeros			= text.match(/0+$/);
				const zero_length	= (zeros !== null) ? zeros[0].length : 0;
				const sign_text		= sign >= 0 ? "" : "-";
				return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), -zero_length));
			}
		}

		let output = new BigDecimal(new_integer);
		output = output.setScale(newScale, RoundingMode.UP);
		output = output.round(mc);
		return output;
	}

	divideAndRemainder(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}

		// 1000e0		/	1e2				=	1000e-2	... 0e0
		// 1000e0		/	10e1			=	100e-1	... 0e0
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 1000e0		/	1000e-1			=	1e1		... 0e0
		// 1000e0		/	10000e-2		=	1e1		... 0e-1
		// 1000e0		/	100000e-3		=	1e1		... 0e-2

		// 10e2			/	100e0			=	1e1		... 0e1
		// 100e1		/	100e0			=	1e1		... 0e1
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 10000e-1		/	100e0			=	100e-1	... 0e-1
		// 100000e-2	/	100e0			=	1000e-2	... 0e-2

		const result_divide	= this.divideToIntegralValue(divisor, mc);
		const result_remaind	= this.subtract(result_divide.multiply(divisor, mc), mc);

		const output = [result_divide, result_remaind];
		return output;
	}

	divide(divisor, p1, p2) {
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= divisor;
		let roundingMode	= null;
		let mc				= MathContext.UNLIMITED;
		let newScale		= 0;
		let isPriorityScale	= false;
		let parm;
		if(arguments.length === 1) {
			newScale		 = src.scale() - tgt.scale();
			isPriorityScale	= true;
		}
		else if(arguments.length === 2) {
			parm = p1;
			newScale		= src.scale();
			isPriorityScale	= true;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else if(arguments.length === 3) {
			if((typeof p1 === "number")||(p1 instanceof Number)) {
				newScale = p1;
			}
			else {
				throw "scale is not Integer";
			}
			parm = p2;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else {
			throw "The argument is over.";
		}
		if(tgt.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}
		let i;
		let newsrc = src;
		const result_map = [];
		let result, result_divide, result_remaind, all_result;
		all_result = BigDecimal.ZERO;
		const precision = mc.getPrecision();
		const check_max = precision !== 0 ? (precision + 8) : 0x3FFFF;
		for(i = 0; i < check_max; i++) {
			result = newsrc.divideAndRemainder(tgt, MathContext.UNLIMITED);
			result_divide	= result[0];
			result_remaind	= result[1];
			all_result = all_result.add(result_divide.scaleByPowerOfTen(-i), MathContext.UNLIMITED);
			if(result_remaind.compareTo(BigDecimal.ZERO) !== 0) {
				if(precision === 0) {	// 精度無限大の場合は、循環小数のチェックが必要
					if(result_map[result_remaind._getUnsignedIntegerString()]) {
						throw "ArithmeticException " + all_result + "[" + result_remaind._getUnsignedIntegerString() + "]";
					}
					else {
						result_map[result_remaind._getUnsignedIntegerString()] = true;
					}
				}
				newsrc = result_remaind.scaleByPowerOfTen(1);
			}
			else {
				break;
			}
		}
		if(isPriorityScale) {
			// 優先スケールの場合は、スケールの変更に失敗する可能性あり
			try {
				all_result = all_result.setScale(newScale, roundingMode);
			}
			catch(e) {
				// falls through
			}
		}
		else {
			all_result = all_result.setScale(newScale, roundingMode);
		}
		all_result = all_result.round(mc);
		return all_result;
	}

	toBigInteger() {
		const x = this.toPlainString().replace(/\.\d*$/, "");
		return new BigInteger(x.toPlainString());
	}

	toBigIntegerExact() {
		const x = this.setScale(0, RoundingMode.UNNECESSARY);
		return new BigInteger(x.toPlainString());
	}

	longValue() {
		let x = this.toBigInteger();
		x = x.longValue();
		return x;
	}

	longValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		return x;
	}

	intValue() {
		let x = this.toBigInteger();
		x = x.intValue();
		return x & 0xFFFFFFFF;
	}

	intValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		if((x < -2147483648) || (2147483647 < x)) {
			throw "ArithmeticException";
		}
		return x;
	}

	floatValue() {
		const p = this.precision();
		if(MathContext.DECIMAL32.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	doubleValue() {
		const p = this.precision();
		if(MathContext.DECIMAL64.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	pow(n, mc) {
		if(Math.abs(n) > 999999999) {
			throw "ArithmeticException";
		}
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		if((mc.getPrecision() === 0) && (n < 0)) {
			throw "ArithmeticException";
		}
		if((mc.getPrecision() > 0) && (n > mc.getPrecision())) {
			throw "ArithmeticException";
		}
		let x, y;
		x = this.clone();
		y = BigDecimal.ONE;
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x, MathContext.UNLIMITED);
			}
			x = x.multiply(x, MathContext.UNLIMITED);
			n >>>= 1;
		}
		return y.round(mc);
	}
	
	static valueOf(val, scale) {
		if(arguments.length === 1) {
			return new BigDecimal(val);
		}
		else if(arguments.length === 2) {
			if((typeof val === "number") && (val === Math.floor(val))) {
				return new BigDecimal(new BigInteger(val), scale);
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		throw "IllegalArgumentException";
	}
	
}

const RoundingMode = {
	
	// 0 から離れる
	UP: {
		toString : function() {
			return "UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return (-(10 + x));
			}
		}
	},
	
	// 0 に近づく
	DOWN: {
		toString : function() {
			return "DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			return -x;
		}
	},
	
	// 正の無限大に近づく
	CEILING: {
		toString : function() {
			return "CEILING";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return -x;
			}
		}
	},
	
	// 負の無限大に近づく
	FLOOR: {
		toString : function() {
			return "FLOOR";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return -x;
			}
			else {
				return(-(10 + x));
			}
		}
	},
	
	// 四捨五入
	HALF_UP: {
		toString : function() {
			return "HALF_UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 5) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 五捨六入
	HALF_DOWN: {
		toString : function() {
			return "HALF_DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 6) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 等間隔なら偶数側へ丸める
	HALF_EVEN: {
		toString : function() {
			return "HALF_EVEN";
		},
		getAddNumber : function(x) {
			x = x % 100;
			let sign, even;
			if(x < 0) {
				sign = -1;
				even = Math.ceil(x / 10) & 1;
			}
			else {
				sign = 1;
				even = Math.floor(x / 10) & 1;
			}
			let center;
			if(even === 1) {
				center = 5;
			}
			else {
				center = 6;
			}
			x = x % 10;
			if(Math.abs(x) < center) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 丸めない（丸める必要が出る場合はエラー）
	UNNECESSARY: {
		toString : function() {
			return "UNNECESSARY";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else {
				throw "ArithmeticException";
			}
		}
	},
	
	valueOf: function(name) {
		if(name === null) {
			throw "NullPointerException";
		}
		const values = RoundingMode.values;
		for(let i = 0; i < values.length; i++) {
			if(values[i].toString() === name) {
				return values[i];
			}
		}
		throw "IllegalArgumentException";
	},
	
	getRoundingMode: function(roundingMode) {
		let mode;
		switch(roundingMode) {
			case RoundingMode.CEILING:
			case RoundingMode.DOWN:
			case RoundingMode.FLOOR:
			case RoundingMode.HALF_DOWN:
			case RoundingMode.HALF_EVEN:
			case RoundingMode.HALF_UP:
			case RoundingMode.UNNECESSARY:
			case RoundingMode.UP:
				mode = roundingMode;
				break;
			default:
				if((typeof roundingMode === "number")||(roundingMode instanceof Number)) {
					mode = RoundingMode.values[roundingMode];
				}
				else if((typeof roundingMode === "string")||(roundingMode instanceof String)) {
					mode = RoundingMode.valueOf(roundingMode);
				}
		}
		if(!mode) {
			throw "Not RoundingMode";
		}
		return mode;
	}
};

RoundingMode.values = {
	0	:	RoundingMode.CEILING,
	1	:	RoundingMode.DOWN,
	2	:	RoundingMode.FLOOR,
	3	:	RoundingMode.HALF_DOWN,
	4	:	RoundingMode.HALF_EVEN,
	5	:	RoundingMode.HALF_UP,
	6	:	RoundingMode.UNNECESSARY,
	7	:	RoundingMode.UP
};

class MathContext {

	constructor() {
		this.precision = 0;
		this.roundingMode = RoundingMode.HALF_UP;
		let p1 = 0;
		let p2 = 0;
		let buff;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if((typeof p1 === "string")||(p1 instanceof String)) {
			buff = p1.match(/precision=\d+/);
			if(buff !== null) {
				buff = buff[0].substring("precision=".length, buff[0].length);
				this.precision = parseInt(buff, 10);
			}
			buff = p1.match(/roundingMode=\w+/);
			if(buff !== null) {
				buff = buff[0].substring("roundingMode=".length, buff[0].length);
				this.roundingMode = RoundingMode.valueOf(buff);
			}	
		}
		else if(arguments.length === 1) {
			this.precision = p1;
		}
		else if(arguments.length === 2) {
			this.precision = p1;
			this.roundingMode = p2;
		}
		if(this.precision < 0) {
			throw "IllegalArgumentException";
		}
	}

	getPrecision() {
		return this.precision;
	}

	getRoundingMode() {
		return this.roundingMode;
	}

	equals(x) {
		if(x instanceof MathContext) {
			if(x.toString() === this.toString()) {
				return true;
			}
		}
		return false;
	}

	toString() {
		return ("precision=" + this.precision + " roundingMode=" + this.roundingMode.toString());
	}
}

MathContext.UNLIMITED	= new MathContext(0,	RoundingMode.HALF_UP);
MathContext.DECIMAL32	= new MathContext(7,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL64	= new MathContext(16,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL128	= new MathContext(34,	RoundingMode.HALF_EVEN);

BigDecimal.RoundingMode			= RoundingMode;
BigDecimal.MathContext			= MathContext;

BigDecimal.ZERO					= new BigDecimal(0);
BigDecimal.ONE					= new BigDecimal(1);
BigDecimal.TEN					= new BigDecimal(10);
BigDecimal.ROUND_CEILING		= RoundingMode.CEILING;
BigDecimal.ROUND_DOWN			= RoundingMode.DOWN;
BigDecimal.ROUND_FLOOR			= RoundingMode.FLOOR;
BigDecimal.ROUND_HALF_DOWN		= RoundingMode.HALF_DOWN;
BigDecimal.ROUND_HALF_EVEN		= RoundingMode.HALF_EVEN;
BigDecimal.ROUND_HALF_UP		= RoundingMode.HALF_UP;
BigDecimal.ROUND_UNNECESSARY	= RoundingMode.UNNECESSARY;
BigDecimal.ROUND_UP				= RoundingMode.UP;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const SNumber = {
	
	Complex : Complex,
	BigDecimal : BigDecimal,
	BigInteger : BigInteger,
	Random : Random

};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDSwitch {
	
	/**
	 * 押す、離すが可能なボタン
	 * @returns {IDSwitch}
	 */
	constructor() {
		this._initIDSwitch();
	}

	_initIDSwitch() {
		/**
		 * 押した瞬間に反応
		 */
		this.istyped		= false;

		/**
		 * 押している間に反応
		 */
		this.ispressed		= false;

		/**
		 * 離した瞬間に反応
		 */
		this.isreleased		= false;

		/**
		 * 押している時間に反応
		 */
		this.pressed_time	= 0;
	}

	clone () {
		const ret = new IDSwitch();
		ret.istyped			= this.istyped;
		ret.ispressed		= this.ispressed;
		ret.isreleased		= this.isreleased;
		ret.pressed_time	= this.pressed_time;
		return ret;
	}

	/**
	 * キーを押した情報
	 */
	keyPressed() {
		if(!this.ispressed) {
			this.istyped = true;
		}
		this.ispressed = true;
		this.pressed_time++;
	}

	/**
	 * キーを離した情報
	 */
	keyReleased() {
		this.ispressed  = false;
		this.isreleased = true;
		this.pressed_time = 0;
	}

	/**
	 * フォーカスが消えたとき
	 */
	focusLost() {
		this.keyReleased();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDSwitch)) {
			throw "IllegalArgumentException";
		}
		c.ispressed			= this.ispressed;
		c.istyped			= this.istyped;
		c.isreleased		= this.isreleased;
		c.pressed_time		= this.pressed_time;
		this.isreleased		= false;
		this.istyped		= false;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDPosition {
		
	/**
	 * 位置情報
	 * @param {Number} x 任意
	 * @param {Number} y 任意
	 * @returns {IDPosition}
	 */
	constructor(x, y) {
		this._initIDPosition(x, y);
	}

	_initIDPosition(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.set(position);
		}
		else if(x === undefined) {
			this.x = 0; this.y = 0;
		}
		else if(arguments.length === 2) {
			this.set(x, y);
		}
		else {
			this.x = 0; this.y = 0;
		}
	}
	
	clone() {
		const ret = new IDPosition(this);
		return ret;
	}
	
	set(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x = position.x; this.y = position.y;
		}
		else {
			this.x = x; this.y = y;
		}
	}
	
	add(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x += position.x; this.y += position.y;
		}
		else {
			this.x += x; this.y += y;
		}
	}
	
	sub(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x -= position.x; this.y -= position.y;
		}
		else {
			this.x -= x; this.y -= y;
		}
	}
	
	static norm(p1, p2) {
		const x = p1.x - p2.x;
		const y = p1.y - p2.y;
		return Math.sqrt(x * x + y * y);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDDraggableSwitch {

	/**
	 * 動かすことが可能なクラス
	 * @param {Integer} mask
	 * @returns {IDDraggableSwitch}
	 */
	constructor(mask) {
		this._initIDDraggableSwitch(mask);
	}

	_initIDDraggableSwitch(mask) {
		this.mask			= mask;
		this.switch			= new IDSwitch();
		this.client			= new IDPosition();
		this.deltaBase		= new IDPosition();
		this.dragged		= new IDPosition();
	}

	clone() {
		const ret = new IDDraggableSwitch();
		ret.mask			= this.mask;
		ret.switch			= this.switch.clone();
		ret.client			= this.client.clone();
		ret.deltaBase		= this.deltaBase.clone();
		ret.dragged			= this.dragged.clone();
		return ret;
	}

	correctionForDOM(event) {
		// イベントが発生したノードの取得
		let node = event.target;
		if(!node) {
			// IE?
			node = event.currentTarget;
		}
		if(node === undefined) {
			return new IDPosition(
				event.clientX,
				event.clientY
			);
		}
		else {
			// ノードのサイズが変更されていることを考慮する
			// width / height が内部のサイズ
			// clientWidth / clientHeight が表示上のサイズ
			return new IDPosition(
				(event.clientX / node.clientWidth)  * node.width,
				(event.clientY / node.clientHeight) * node.height
			);
		}
	}

	setPosition(event) {
		// 強制的にその位置に全ての値をセットする
		const position = this.correctionForDOM(event);
		this.client.set(position);
		this.deltaBase.set(position);
		this.dragged._initIDPosition();
	}

	mousePressed(event) {
		const position = this.correctionForDOM(event);
		const state	= event.button;
		if(state === this.mask) {
			if(!this.switch.ispressed) {
				this.dragged._initIDPosition();
			}
			this.switch.keyPressed();
			this.client.set(position);
			this.deltaBase.set(position);
		}
	}

	mouseReleased(event) {
		const state	= event.button;
		if(state === this.mask) {
			if(this.switch.ispressed) {
				this.switch.keyReleased();
			}
		}
	}

	mouseMoved(event) {
		const position = this.correctionForDOM(event);
		if(this.switch.ispressed) {
			const delta = new IDPosition(position);
			delta.sub(this.deltaBase);
			this.dragged.add(delta);
		}
		this.client.set(position.x ,position.y);
		this.deltaBase.set(position.x ,position.y);
	}

	focusLost() {
		this.switch.focusLost();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDDraggableSwitch)) {
			throw "IllegalArgumentException";
		}
		this.switch.pickInput(c.switch);
		c.client.set(this.client);
		c.dragged.set(this.dragged);
		this.dragged._initIDPosition();
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDMouse {

	constructor() {
		this._initIDMouse();
	}
	
	_initIDMouse() {
		this.left   = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON1_MASK);
		this.center = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON2_MASK);
		this.right  = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON3_MASK);
		this.position = new IDPosition();
		this.wheelrotation = 0;
	}

	clone() {
		const ret = new IDMouse();
		ret.left		= this.left.clone();
		ret.center		= this.center.clone();
		ret.right		= this.right.clone();
		ret.position	= this.position.clone();
		ret.wheelrotation = this.wheelrotation;
		return ret;
	}

	mousePressed(mouseevent) {
		this.left.mousePressed(mouseevent);
		this.center.mousePressed(mouseevent);
		this.right.mousePressed(mouseevent);
	}

	mouseReleased(mouseevent) {
		this.left.mouseReleased(mouseevent);
		this.center.mouseReleased(mouseevent);
		this.right.mouseReleased(mouseevent);
	}

	mouseMoved(mouseevent) {
		this.left.mouseMoved(mouseevent);
		this.center.mouseMoved(mouseevent);
		this.right.mouseMoved(mouseevent);
		this.position.x = this.left.client.x;
		this.position.y = this.left.client.y;
	}

	mouseWheelMoved(event) {
		if(event.wheelDelta !== 0) {
			this.wheelrotation += event.deltaY > 0 ? -1 : 1;
		}
	}

	focusLost() {
		this.left.focusLost();
		this.center.focusLost();
		this.right.focusLost();
	}

	pickInput(c) {
		if(!(c instanceof IDMouse)) {
			throw "IllegalArgumentException";
		}
		this.left.pickInput(c.left);
		this.center.pickInput(c.center);
		this.right.pickInput(c.right);
		c.position.set(this.position);
		c.wheelrotation = this.wheelrotation;
		this.wheelrotation = 0;
	}

	setListenerOnElement(element) {
		const that = this;
		const mousePressed = function(e) {
			that.mousePressed(e);
		};
		const mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		const mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		const focusLost = function() {
			that.focusLost();
		};
		const mouseWheelMoved = function(e) {
			that.mouseWheelMoved(e);
			e.preventDefault();
		};
		const contextMenu  = function(e) {
			e.preventDefault();
		};
		element.style.cursor = "crosshair";
		// 非選択化
		element.style.mozUserSelect			= "none";
		element.style.webkitUserSelect		= "none";
		element.style.msUserSelect			= "none";
		// メニュー非表示化
		element.style.webkitTouchCallout	= "none";
		// タップのハイライトカラーを消す
		element.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

		element.addEventListener("mousedown",	mousePressed, false );
		element.addEventListener("mouseup",		mouseReleased, false );
		element.addEventListener("mousemove",	mouseMoved, false );
		element.addEventListener("mouseout",	focusLost, false );
		element.addEventListener("wheel",		mouseWheelMoved, false );
		element.addEventListener("contextmenu",	contextMenu, false );
	}
}

IDMouse.MOUSE_EVENTS = {
	BUTTON1_MASK : 0,
	BUTTON2_MASK : 1,
	BUTTON3_MASK : 2
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class IDTouch extends IDMouse {

	/**
	 * 指3本まで対応するタッチデバイス
	 * 1本目は左クリックに相当
	 * 2本目は右クリックに相当
	 * 3本目は中央クリックに相当
	 * @returns {IDTouch}
	 */
	constructor() {
		super();
		this._initIDTouch();
	}
	
	_initIDTouch() {
		this.touchcount_to_mask = {
			1 : IDMouse.MOUSE_EVENTS.BUTTON1_MASK,
			2 : IDMouse.MOUSE_EVENTS.BUTTON3_MASK,
			3 : IDMouse.MOUSE_EVENTS.BUTTON2_MASK
		};
		const that = this;
		this._mousePressed = function(e) {
			that.mousePressed(e);
		};
		this._mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		this._mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		this.isdoubletouch	= false;
	}

	_initPosition(mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	}

	_MultiTouchToMouse(touchevent) {
		let x = 0, y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for(let i = 0;i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		const event = {};
		if(touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button  = this.touchcount_to_mask[touchevent.touches.length];
			const touch = touchevent.touches[0];
			event.target  = touch.target ? touch.target : touch.currentTarget;
		}
		else {
			event.clientX = 0;
			event.clientY = 0;
			event.button  = 0;
		}
		event.touchcount = touchevent.touches.length;
		return event;
	}

	_MoveMultiTouch(touchevent) {
		if(touchevent.touches.length === 2) {
			const p1 = touchevent.touches[0];
			const p2 = touchevent.touches[1];
			if(this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this.doubleposition = [];
				this.doubleposition[0] = new IDPosition(p1.clientX, p1.clientY);
				this.doubleposition[1] = new IDPosition(p2.clientX, p2.clientY);
			}
			else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				const newp1 = new IDPosition(p1.clientX, p1.clientY);
				const newp2 = new IDPosition(p2.clientX, p2.clientY);
				const x = IDPosition.norm(this.doubleposition[0], this.doubleposition[1]) - IDPosition.norm(newp1, newp2);
				this.doubleposition[0] = newp1;
				this.doubleposition[1] = newp2;
				// そんなにずれていなかったら無視する
				const r = (Math.abs(x) < 10) ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		}
		else {
			this.isdoubletouch === false;
		}
	}

	_actFuncMask(mouseevent, funcOn, funcOff, target) {
		for(const key in IDMouse.MOUSE_EVENTS) {
			mouseevent.button = IDMouse.MOUSE_EVENTS[key];
			if(IDMouse.MOUSE_EVENTS[key] === target) {
				funcOn(mouseevent);
			}
			else {
				funcOff(mouseevent);
			}
		}
	}

	touchStart(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(
			mouseevent,
			this._mousePressed,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchEnd(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseReleased,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchMove(touchevent) {
		this._MoveMultiTouch(touchevent);
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseMoved,
			this._mouseMoved,
			mouseevent.button
		);
	}

	setListenerOnElement(element) {
		super.setListenerOnElement(element);

		const that = this;
		const touchStart = function(touchevent) {
			that.touchStart(touchevent);
		};
		const touchEnd = function(touchevent) {
			that.touchEnd(touchevent);
		};
		const touchMove = function(touchevent) {
			that.touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart",	touchStart, false );
		element.addEventListener("touchend",	touchEnd, false );
		element.addEventListener("touchmove",	touchMove, false );
		element.addEventListener("touchcancel",	touchEnd, false );
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const IDTools = {
	
	/**
	 * 縦のスクロールバーを削除
	 */
	noScroll : function() {
		// 縦のスクロールバーを削除
		const main = function() {
			// body
			document.body.style.height			= "100%";
			document.body.style.overflow		= "hidden";
			// html
			document.documentElement.height		= "100%";
			document.documentElement.overflow	= "hidden";
		};
		window.addEventListener("load", main, false);
	}
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Device = {
	DraggableSwitch		: IDDraggableSwitch,
	Mouse				: IDMouse,
	Position			: IDPosition,
	Switch				: IDSwitch,
	Touch				: IDTouch,
	Tools				: IDTools
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const BlendFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	brendNone : function(x, y, alpha) {
		return y;
	},
	
	brendAlpha : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = BlendFunctions.ipLerp(x, y, y_alpha);
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendAdd : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.addColor(y.mul(y_alpha));
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendSub : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.subColor(y.mul(y_alpha));
		return x.setBlendAlpha(new_alpha);
	},
	
	brendRevSub : function(x, y, alpha) {
		const new_alpha = y.getBlendAlpha();
		const x_alpha = x.getBlendAlpha() * alpha;
		y = y.subColor(x.mul(x_alpha));
		return y.setBlendAlpha(new_alpha);
	},
	
	brendMul : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.mulColor(y.mul(y_alpha).div(255.0));
		return x.setBlendAlpha(new_alpha);
	}
};

class ImgBlend {

	constructor(mode) {
		this.blendfunc = BlendFunctions.brendNone;
		if(arguments.length === 1) {
			this.setBlendMode(mode);
		}
	}
	
	clone() {
		return new ImgBlend(this.blendmode);
	}
	
	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.brendtype} _blendtype
	 * @returns {undefined}
	 */
	setBlendMode(mode) {
		this.blendmode = mode;
		if(mode === ImgBlend.MODE.NONE) {
			this.blendfunc = BlendFunctions.brendNone;
		}
		else if(mode === ImgBlend.MODE.ALPHA) {
			this.blendfunc = BlendFunctions.brendAlpha;
		}
		else if(mode === ImgBlend.MODE.ADD) {
			this.blendfunc = BlendFunctions.brendAdd;
		}
		else if(mode === ImgBlend.MODE.SUB) {
			this.blendfunc = BlendFunctions.brendSub;
		}
		else if(mode === ImgBlend.MODE.REVSUB) {
			this.blendfunc = BlendFunctions.brendRevSub;
		}
		else if(mode === ImgBlend.MODE.MUL) {
			this.blendfunc = BlendFunctions.brendMul;
		}
	}
	
	blend(color1, color2, alpha) {
		return this.blendfunc(color1, color2, alpha);
	}
	
}

ImgBlend.MODE = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColor {
	
	/**
	 * ImgColor 抽象クラス
	 */
	constructor() {	
	}

	getColor() {
		return null;
	}
	
	clone() {
		return null;
	}
	
	zero() {
		return null;
	}
	
	one() {
		return null;
	}
	
	add() {
		return null;
	}
	
	sub() {
		return null;
	}
	
	mul() {
		return null;
	}
	
	div() {
		return null;
	}
	
	exp() {
		return null;
	}
	
	log() {
		return null;
	}
	
	pow() {
		return null;
	}
	
	baselog() {
		return null;
	}
	
	table() {
		return null;
	}
	
	random() {
		return null;
	}
	
	luminance() {
		return null;
	}
	
	addColor() {
		return null;
	}
	
	subColor() {
		return null;
	}
	
	mulColor() {
		return null;
	}
	
	divColor() {
		return null;
	}
	
	maxColor() {
		return null;
	}
	
	minColor() {
		return null;
	}
	
	norm() {
		return null;
	}
	
	normFast() {
		return null;
	}
	
	normColor(c, normType) {
		return this.subColor(c).norm(normType);
	}
	
	normColorFast(c, normType) {
		return this.subColor(c).normFast(normType);
	}
	
	getBlendAlpha() {
		return null;
	}
	
	setBlendAlpha() {
		return null;
	}
	
	exchangeColorAlpha() {
		return null;
	}
	
	equals() {
		return false;
	}
	
	/**
	 * パレットから最も近い色を2色探します。
	 * @param {Array} palettes
	 * @param {ImgColor.normType} normType
	 * @returns {object}
	 */
	searchColor(palettes, normType) {
		let norm = 0;
		let c1_norm_max	= 0x7fffffff;
		let c1_color	= null;
		let c2_norm_max	= 0x7ffffffe;
		let c2_color	= null;
		for(let i = 0; i < palettes.length; i++) {
			norm = this.normColorFast(palettes[i], normType);
			if(norm < c2_norm_max) {
				if(norm < c1_norm_max) {
					c2_norm_max	= c1_norm_max;
					c2_color	= c1_color;
					c1_norm_max	= norm;
					c1_color	= palettes[i];
				}
				else {
					c2_norm_max	= norm;
					c2_color	= palettes[i];
				}
			}
		}
		return {
			c1 : {
				color : c1_color,
				norm  : c1_norm_max
			},
			c2 : {
				color : c2_color,
				norm  : c2_norm_max
			}
		};
	}
	
}

ImgColor.NORM_MODE = {
	/**
	 * マンハッタン距離を使用する
	 * @type Number
	 */
	MANHATTEN : 0,

	/**
	 * ユーグリッド距離を使用する
	 * @type Number
	 */
	EUGRID : 1
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapInside {
	
	constructor(width, height) {
		if(arguments.length === 2) {
			this.setSize(width, height);
		}
		else {
			this.setSize(0, 0);
		}
	}
	
	clone() {
		return new ImgWrapInside(this.width, this.height);
	}
	
	setSize(width, height) {
		this.width  = width;
		this.height = height;
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		else {
			return null;
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapClamp extends ImgWrapInside {
		
	constructor(width, height) {
		super(width, height);
	}
	
	clone() {
		return new ImgWrapClamp(this.width, this.height);
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		// はみ出た場合は中にむりやり収める
		x = ~~Math.floor(Math.min(Math.max(0, x), this.width  - 1));
		y = ~~Math.floor(Math.min(Math.max(0, y), this.height - 1));
		return [x, y];
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrapRepeat extends ImgWrapInside {
		
	constructor(width, height) {
		super(width, height);
	}
	
	clone() {
		return new ImgWrapRepeat(this.width, this.height);
	}
	
	getPixelPosition(x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		const x_times = Math.floor(x / this.width);
		const y_times = Math.floor(y / this.height);
		// リピート
		x -= Math.floor(this.width  * x_times);
		y -= Math.floor(this.height * y_times);
		if(x < 0) {
			x += this.width;
		}
		if(y < 0) {
			y += this.height;
		}
		return [x, y];
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgWrap {
	
	constructor(mode, width, height) {
		this.width	= 1;
		this.height	= 1;
		if(arguments.length >= 2) {
			this.width	= width;
			this.height	= height;
		}
		if(arguments.length == 3) {
			this.setImgWrapMode(mode);
		}
		else {
			this.setImgWrapMode(ImgWrap.MODE.INSIDE);
		}
	}
	
	clone() {
		return new ImgWrap(this.wrapmode, this.width, this.height);
	}
	
	setImgWrapMode(mode) {
		this.wrapmode = mode;
		if(mode === ImgWrap.MODE.INSIDE) {
			this.wrap = new ImgWrapInside(this.width, this.height);
		}
		else if(mode === ImgWrap.MODE.CLAMP) {
			this.wrap = new ImgWrapClamp(this.width, this.height);
		}
		else if(mode === ImgWrap.MODE.REPEAT) {
			this.wrap = new ImgWrapRepeat(this.width, this.height);
		}
	}
	
	setSize(width, height) {
		this.width = width;
		this.height = height;
		if(this.wrap) {
			this.wrap.setSize(width, height);
		}
	}
	
	getPixelPosition(x, y) {
		return this.wrap.getPixelPosition(x, y);
	}	
}

ImgWrap.MODE = {
	INSIDE			: "INSIDE",
	CLAMP			: "CLAMP",
	REPEAT			: "REPEAT"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const InterpolationFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	ipCosine : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
	},
	
	ipHermite2p3 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
	},
	
	ipHermite2p5 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
	},
	
	ipHermite4p : function(v0, v1, v2, v3, x) {
		const P = v3.subColor(v2).subColor(v0.subColor(v1));
		const Q = v0.subColor(v1).subColor(P);
		const R = v2.subColor(v0);
		const S = v1;
		return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
	},
	
	funcInBicubic : function(d, a) {
		if(d <= 1.0) {
			return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
		}
		else {
			return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
		}
	},
	
	ipBicubic : function(v0, v1, v2, v3, x, a) {
		const w0 = InterpolationFunctions.funcInBicubic(x + 1, a);
		const w1 = InterpolationFunctions.funcInBicubic(x    , a);
		const w2 = InterpolationFunctions.funcInBicubic(1 - x, a);
		const w3 = InterpolationFunctions.funcInBicubic(2 - x, a);
		const c = v0.mul(w0).addColor(v1.mul(w1)).addColor(v2.mul(w2)).addColor(v3.mul(w3));
		return c.mul(1.0 / (w0 + w1 + w2 + w3));
	},
	
	ipBicubicSoft : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -0.5);
	},
	
	ipBicubicNormal : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.0);
	},
	
	ipBicubicSharp : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.2);
	},
	
	ipBicubic2D : function(va, nx, ny, a) {
		let output = va[0][0].zero();
		let x, y, y_weight, weight, sum = 0.0;
		for(y = 0; y < 4; y++) {
			y_weight = InterpolationFunctions.funcInBicubic(Math.abs(- ny + y - 1), a);
			for(x = 0; x < 4; x++) {
				weight  = InterpolationFunctions.funcInBicubic(Math.abs(- nx + x - 1), a);
				weight *= y_weight;
				sum    += weight;
				output = output.addColor(va[y][x].mul(weight));
			}
		}
		output = output.mul(1.0 / sum);
		return output;
	},
	
	ipBicubic2DSoft : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -0.5);
	},
	
	ipBicubic2DNormal : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.0);
	},
	
	ipBicubic2DSharp : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.2);
	}
};

class ImgInterpolation {
		
	constructor(mode) {
		if(arguments.length === 0) {
			mode = ImgInterpolation.MODE.NEAREST_NEIGHBOR;
		}
		this.setInterpolationMode(mode);
	}
	
	clone() {
		return new ImgInterpolation(this.ipmode);
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.filtermode} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ipmode	= ipmode;
		if(ipmode === ImgInterpolation.MODE.NEAREST_NEIGHBOR) {
			this.ipfunc	= InterpolationFunctions.ipLerp;
			this.ipn	= 1;
		}
		else if(ipmode === ImgInterpolation.MODE.BILINEAR) {
			this.ipfunc = InterpolationFunctions.ipLerp;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.COSINE) {
			this.ipfunc = InterpolationFunctions.ipCosine;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_3) {
			this.ipfunc = InterpolationFunctions.ipHermite2p3;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_5) {
			this.ipfunc = InterpolationFunctions.ipHermite2p5;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE16) {
			this.ipfunc = InterpolationFunctions.ipHermite4p;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC) {
			this.ipfunc = InterpolationFunctions.ipBicubic2DNormal;
			this.ipn	= 16;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SOFT) {
			this.ipfunc = InterpolationFunctions.ipBicubicSoft;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_NORMAL) {
			this.ipfunc = InterpolationFunctions.ipBicubicNormal;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SHARP) {
			this.ipfunc = InterpolationFunctions.ipBicubicSharp;
			this.ipn	= 4;
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(imgdata, x, y) {
		const rx = Math.floor(x);
		const ry = Math.floor(y);
		if(	(this.ipn === 1) ||
			((rx === x) && (ry === y))) {
			return imgdata.getPixel(rx, ry);
		}
		else if(this.ipn === 2) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1;
			c0 = imgdata.getPixel(rx    , ry    );
			c1 = imgdata.getPixel(rx + 1, ry    );
			const n0  = this.ipfunc(c0, c1 , nx);
			c0 = imgdata.getPixel(rx    , ry + 1);
			c1 = imgdata.getPixel(rx + 1, ry + 1);
			const n1  = this.ipfunc(c0, c1 , nx);
			return this.ipfunc( n0, n1, ny );
		}
		else if(this.ipn === 4) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1, c2, c3;
			c0 = imgdata.getPixel(rx - 1, ry - 1);
			c1 = imgdata.getPixel(rx    , ry - 1);
			c2 = imgdata.getPixel(rx + 1, ry - 1);
			c3 = imgdata.getPixel(rx + 2, ry - 1);
			const n0 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry    );
			c1 = imgdata.getPixel(rx    , ry    );
			c2 = imgdata.getPixel(rx + 1, ry    );
			c3 = imgdata.getPixel(rx + 2, ry    );
			const n1 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 1);
			c1 = imgdata.getPixel(rx    , ry + 1);
			c2 = imgdata.getPixel(rx + 1, ry + 1);
			c3 = imgdata.getPixel(rx + 2, ry + 1);
			const n2 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 2);
			c1 = imgdata.getPixel(rx    , ry + 2);
			c2 = imgdata.getPixel(rx + 1, ry + 2);
			c3 = imgdata.getPixel(rx + 2, ry + 2);
			const n3 = this.ipfunc(c0, c1, c2, c3, nx);
			return this.ipfunc( n0, n1, n2, n3, ny );
		}
		else if(this.ipn === 16) {
			const nx = x - rx;
			const ny = y - ry;
			let ix, iy;
			const cdata = [];
			for(iy = -1; iy < 3; iy++) {
				const cx = [];
				for(ix = -1; ix < 3; ix++) {
					cx[cx.length] = imgdata.getPixel(rx + ix, ry + iy);
				}
				cdata[cdata.length] = cx;
			}
			return this.ipfunc( cdata, nx, ny );
		}
		return null;
	}
}

ImgInterpolation.MODE = {
	NEAREST_NEIGHBOR	: "NEAREST_NEIGHBOR",
	BILINEAR			: "BILINEAR",
	COSINE				: "COSINE",
	HERMITE4_3			: "HERMITE4_3",
	HERMITE4_5			: "HERMITE4_5",
	HERMITE16			: "HERMITE16",
	BICUBIC				: "BICUBIC",
	BICUBIC_SOFT		: "BICUBIC_SOFT",
	BICUBIC_NORMAL		: "BICUBIC_NORMAL",
	BICUBIC_SHARP		: "BICUBIC_SHARP"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgFIRMatrix {
	
	/**
	 * 画像処理に使用する配列のフィルタ用クラス
	 * @param {type} matrix 2次元配列
	 * @returns {ImgFIRMatrix}
	 */
	constructor(matrix) {
		this.height = matrix.length;
		this.width  = matrix[0].length;
		this.matrix = [];
		let i;
		for(i = 0; i < matrix.length; i++) {
			this.matrix[i] = matrix[i].slice();
		}
	}
	
	clone() {
		return new ImgFIRMatrix(this.matrix);
	}
	
	rotateEdge(val) {
		// 周囲の値を時計回りに回転させます。
		const m = this.clone();

		const x = [], y = [];
		let i, j;
		{
			// 上側
			for(i = 0;i < this.width - 1; i++) {
				x.push(m.matrix[0][i]);
			}
			// 右側
			for(i = 0;i < this.height - 1; i++) {
				x.push(m.matrix[i][this.width - 1]);
			}
			// 下側
			for(i = this.width - 1;i > 0; i--) {
				x.push(m.matrix[this.height - 1][i]);
			}
			// 左側
			for(i = this.height - 1;i > 0; i--) {
				x.push(m.matrix[i][0]);
			}
		}
		for(i = 0;i < x.length; i++) {
			// かならず正とする
			y[i] = x[((i + val) % x.length + x.length) % x.length];
		}
		{
			// 上側
			m.matrix[0] = y.slice(0, this.width);
			// 右側
			for(i = 0;i < this.height; i++) {
				m.matrix[i][this.width - 1] = y[this.width + i];
			}
			// 下側
			m.matrix[this.height - 1] = y.slice(
				this.width + this.height - 2,
				this.width + this.height - 2 + this.width ).reverse();
			// 左側
			for(i = this.height - 1, j = 0;i > 0; i--, j++) {
				m.matrix[i][0] = y[this.width + this.height + this.width - 3 + j];
			}
		}
		return m;
	}
	
	mul(val) {
		const m = this.clone();
		let x, y;
		for(y = 0; y < m.height; y++) {
			for(x = 0; x < m.width; x++) {
				m.matrix[y][x] *= val;
			}
		}
		return m;
	}
	
	sum() {
		let sum = 0;
		let x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				sum += this.matrix[y][x];
			}
		}
		return sum;
	}
	
	normalize() {
		return this.clone().mul(1.0 / this.sum());
	}
	
	addCenter(val) {
		const m = this.clone();
		m.matrix[m.height >> 1][m.width >> 1] += val;
		return m;
	}
	
	static makeLaplacianFilter() {
		return new ImgFIRMatrix([
			[ 0.0, -1.0, 0.0],
			[-1.0,  4.0,-1.0],
			[ 0.0, -1.0, 0.0]
		]);
	}
	
	static makeSharpenFilter(power) {
		const m = ImgFIRMatrix.makeLaplacianFilter();
		return m.mul(power).addCenter(1.0);
	}
	
	static makeBlur(width, height) {
		const m = [];
		const value = 1.0 / (width * height);
		let x, y;
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = value;
			}
		}
		return new ImgFIRMatrix(m);
	}
	
	static makeGaussianFilter(width, height, sd) {
		if(sd === undefined) {
			sd = 1.0;
		}
		const m = [];
		let i, x, y;
		const v = [];
		const n = Math.max(width, height);
		let s = - Math.floor(n / 2);
		for(i = 0; i < n; i++, s++) {
			v[i] = Math.exp( - (s * s) / ((sd * sd) * 2.0) );
		}
		for(y = 0; y < height; y++) {
			m[y] = [];
			for(x = 0; x < width; x++) {
				m[y][x] = v[x] * v[y];
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

	static makeCircle(r) {
		const m = [];
		const radius	= r * 0.5;
		const center	= r >> 1;
		let x, y;
		for(y = 0; y < r; y++) {
			m[y] = [];
			for(x = 0; x < r; x++) {
				if (Math.sqrt(	(center - x) * (center - x) +
								(center - y) * (center - y)) < radius) {
					m[y][x] = 1.0;
				}
				else {
					m[y][x] = 0.0;
				}
			}
		}
		return new ImgFIRMatrix(m).normalize();
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgData {
	
	/**
	 * 画像データクラス
	 * ImgDataRGBA   32bit整数 0xRRGGBBAA で管理
	 * ImgDataY 32bit浮動小数点で管理
	 */
	constructor() {
		this.width  = 1;
		this.height = 1;
		this.globalAlpha = 1.0;
		this.data	= null;
		this.blend  = new ImgBlend(ImgBlend.MODE.NONE);
		this.wrap   = new ImgWrap(ImgWrap.MODE.INSIDE, this.width, this.height);
		this.ip     = new ImgInterpolation(ImgInterpolation.MODE.NEAREST_NEIGHBOR);
		if(arguments.length === 1) {
			const image = arguments[0];
			this.putImageData(image);
		}
		else if(arguments.length === 2) {
			const width  = arguments[0];
			const height = arguments[1];
			this.setSize(width, height);
		}
	}
	
	putImageData(imagedata) {
	}
	
	/**
	 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
	 * 以前と同一の画像の場合は初期化されません。
	 * @param {type} width
	 * @param {type} height
	 * @returns {undefined}
	 */
	setSize(width, height) {
		if((this.width === width) && (this.height === height)) {
			return;
		}
		this.width	= width;
		this.height	= height;
		this.wrap.setSize(width, height);
	}
	
	/**
	 * 内部の情報をxにコピーする
	 * @param {type} x
	 * @returns {undefined}
	 */
	_copyData(x) {
		x.blend  = this.blend.clone();
		x.wrap   = this.wrap.clone();
		x.ip     = this.ip.clone();
		x.setSize(this.width, this.height);
		x.data.set(this.data);
		x.globalAlpha = this.globalAlpha;
	}
	
	clone() {
		const x = new ImgData();
		this._copyData(x);
		return x;
	}

	/**
	 * 画面外の色を選択する方法を選ぶ
	 * @param {ImgData.MODE_WRAP} _wrapmode
	 * @returns {undefined}
	 */
	setWrapMode(wrapmode) {
		this.wrap.setImgWrapMode(wrapmode);
	}
	
	/**
	 * 画面外の色を選択する方法を取得する
	 * @returns {ImgData.MODE_WRAP}
	 */
	getWrapMode() {
		return this.wrap.wrapmode;
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.MODE_IP} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ip.setInterpolationMode(ipmode);
	}

	/**
	 * 実数で色を選択した場合に、どのように色を補完するか取得する
	 * @returns {ImgData.MODE_IP}
	 */
	getInterpolationMode() {
		return this.ip.ipmode;
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.MODE_BLEND} blendmode
	 * @returns {undefined}
	 */
	setBlendType(blendmode) {
		this.blend.setBlendMode(blendmode);
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
	 * @returns {ImgData.MODE_BLEND}
	 */
	getBlendType() {
		return this.blend.blendmode;
	}
	
	/**
	 * 中身をクリアします。
	 * @returns {undefined}
	 */
	clear() {
		if(this.data) {
			this.data.fill(0);
		}
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {number} x
	 * @param {number} y
	 * @returns {ImgColorRGBA}
	 */
	getPixelInside(x, y) {
		return null;
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixelInside(x, y, color) {
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getPixel(x, y) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			return this.getPixelInside(p[0], p[1]);
		}
		return this.getPixelInside(0, 0).zero();
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixel(x, y, color) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			if(this._blendtype === ImgData.MODE_BLEND.NONE) {
				this.setPixelInside(p[0], p[1], color);
			}
			else {
				const mycolor = this.getPixelInside(p[0], p[1]);
				const newcolor = this.blend.blend(mycolor, color, this.globalAlpha);
				this.setPixelInside(p[0], p[1], newcolor);
			}
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(x, y) {
		return this.ip.getColor(this, x, y);
	}

	/**
	 * 座標系は、0-1を使用して、テクスチャとみたてて色を取得します。
	 * @param {type} u
	 * @param {type} v
	 * @returns {ImgColor}
	 */
	getColorUV(u, v) {
		return this.getColor(u * this.width, v * this.height);
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setColor(x, y, color) {
		this.setPixel(Math.floor(x), Math.floor(y), color);
	}
	
	/**
	 * Canvas型の drawImage と同じ使用方法で ImgData をドローする
	 * ImgDataRGBA データの上には、ImgDataRGBA のみ書き込み可能
	 * ImgDataY    データの上には、ImgDataY    のみ書き込み可能
	 * @param {ImgData} image
	 * @param {number} sx
	 * @param {number} sy
	 * @param {number} sw
	 * @param {number} sh
	 * @param {number} dx
	 * @param {number} dy
	 * @param {number} dw
	 * @param {number} dh
	 * @returns {undefined}
	 */
	drawImgData(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		if(!(image instanceof ImgData)) {
			throw "IllegalArgumentException";
		}
		if(arguments.length === 3) {
			dx = sx;
			dy = sy;
			dw = image.width;
			dh = image.height;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 5) {
			dx = sx;
			dy = sy;
			dw = sw;
			dh = sh;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 9) ;
		else {
			throw "IllegalArgumentException";
		}
		const delta_w = sw / dw;
		const delta_h = sh / dh;
		let src_x, src_y;
		let dst_x, dst_y;

		src_y = sy;
		for(dst_y = dy; dst_y < (dy + dh); dst_y++) {
			src_x = sx;
			for(dst_x = dx; dst_x < (dx + dw); dst_x++) {
				const color = image.getColor(src_x, src_y);
				if(color) {
					this.setColor(dst_x, dst_y, color);
				}
				src_x += delta_w;
			}
			src_y += delta_h;
		}
	}

	/**
	 * 全画素に指定した関数の操作を行う
	 * @param {function} callback callback(color, x, y, this) 実行したいコールバック関数
	 * @returns {undefined}
	 */
	forEach(callback) {
		let x = 0, y = 0;
		for(; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				callback(this.getPixelInside(x, y), x, y, this);
			}
		}
	}
	
	/**
	 * ImgFIRMatrix を使用して畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @returns {undefined}
	 */
	convolution(matrix) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してバイラテラルフィルタ的な畳込みを行う
	 * 対象の色に近いほど、フィルタをかける処理となる
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	convolutionBilateral(matrix, p) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(p === undefined) {
			p = 0.8;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		// -0.010 - -0.001
		const rate = - (1.0 - p) * 0.01 - 0.001;
		const exptable = [];
		for(x = 0; x < 256 * 3; x++) {
			exptable[x] = Math.exp(x * x * rate);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				const thiscolor = bufferimage.getPixel(x, y);
				const thisalpha = thiscolor.getBlendAlpha();
				let sumfilter = 0;
				let newcolor  = zero_color;
				const m2 = [];
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					m2[my] = [];
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const tgtcolor = bufferimage.getPixel(fx, fy);
						if(!tgtcolor) {
							continue;
						}
						const newfilter = exptable[Math.floor(tgtcolor.normColor(thiscolor, ImgColor.NORM_MODE.EUGRID))] * m[my][mx];
						newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
						sumfilter += newfilter;
					}
				}
				newcolor = newcolor.div(sumfilter).setBlendAlpha(thisalpha);
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用して指数関数空間で畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	convolutionExp(matrix, e) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(e === undefined) {
			e = 1.2;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		const exptable = [];
		for(x = 0; x < 256; x++) {
			exptable[x] = Math.pow(e, x);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.table(exptable).mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor.baselog(e));
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してアンシャープ畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {type} rate
	 * @returns {undefined}
	 */
	convolutionUnSharp(matrix, rate) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				const thiscolor = bufferimage.getPixel(x, y);
				const deltaColor = thiscolor.subColor(newcolor).mul(rate);
				this.setPixelInside(x, y, thiscolor.addColor(deltaColor));
			}
		}
	}

	/**
	 * シャープフィルタ
	 * @param {number} power 強度
	 * @returns {undefined}
	 */
	filterSharp(power) {
		const m = ImgFIRMatrix.makeSharpenFilter(power);
		this.convolution(m);
	}

	/**
	 * ブラーフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterBlur(n) {
		let m;
		m = ImgFIRMatrix.makeBlur(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeBlur(1, n);
		this.convolution(m);
	}

	/**
	 * ガウシアンフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterGaussian(n) {
		let m;
		m = ImgFIRMatrix.makeGaussianFilter(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeGaussianFilter(1, n);
		this.convolution(m);
	}

	/**
	 * アンシャープ
	 * @param {number} n 口径
	 * @param {number} rate
	 * @returns {undefined}
	 */
	filterUnSharp(n, rate) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionUnSharp(m, rate);
	}

	/**
	 * バイラテラルフィルタ
	 * @param {number} n 口径
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	filterBilateral(n, p) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionBilateral(m, p);
	}

	/**
	 * レンズフィルタ
	 * @param {type} n 口径
	 * @param {type} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	filterSoftLens(n, e) {
		const m = ImgFIRMatrix.makeCircle(n);
		this.convolutionExp(m, e);
	}
	
}

ImgData.MODE_WRAP	= ImgWrap.MODE;
ImgData.MODE_IP		= ImgInterpolation.MODE;
ImgData.MODE_BLEND	= ImgBlend.MODE;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgVector {
		
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	/**
	 * クロス積
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	cross(tgt) {
		return new ImgVector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x
		);
	}

	/**
	 * ターゲットへのベクトル
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	getDirection(tgt) {
		return new ImgVector(
			tgt.x - this.x,
			tgt.y - this.y,
			tgt.z - this.z
		);
	}

	/**
	 * ターゲットへの方向ベクトル
	 * @returns {ImgVector}
	 */
	normalize() {
		let b = this.x * this.x + this.y * this.y + this.z * this.z;
		b = Math.sqrt(1.0 / b);
		return new ImgVector(
			this.x * b,
			this.y * b,
			this.z * b
		);
	}

	/**
	 * 方向ベクトルから、RGBの画素へ変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgColorRGBA}
	 */
	getNormalMapColor() {
		return new ImgColorRGBA([
			Math.round((1.0 + this.x) * 127.5),
			Math.round((1.0 - this.y) * 127.5),
			Math.round((1.0 + this.z) * 127.5),
			255
		]);
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColorRGBA extends ImgColor {
	
	constructor(color) {
		super();
		// ディープコピー
		this.rgba = [color[0], color[1], color[2], color[3]];
	}

	get r() {
		return this.rgba[0];
	}

	get g() {
		return this.rgba[1];
	}

	get b() {
		return this.rgba[2];
	}

	get a() {
		return this.rgba[3];
	}

	getColor() {
		return this.rgba;
	}
	
	clone() {
		return new ImgColorRGBA(this.rgba);
	}
	
	zero() {
		return new ImgColorRGBA([0.0, 0.0, 0.0, 0.0]);
	}
	
	one() {
		return new ImgColorRGBA([1.0, 1.0, 1.0, 1.0]);
	}
	
	add(x) {
		return new ImgColorRGBA([
			this.r + x,	this.g + x,
			this.b + x,	this.a + x ]);
	}
	
	sub(x) {
		return new ImgColorRGBA([
			this.r - x,	this.g - x,
			this.b - x,	this.a - x ]);
	}
	
	mul(x) {
		return new ImgColorRGBA([
			this.r * x,	this.g * x,
			this.b * x,	this.a * x ]);
	}
	
	div(x) {
		return new ImgColorRGBA([
			this.r / x,	this.g / x,
			this.b / x,	this.a / x ]);
	}
	
	exp() {
		return new ImgColorRGBA([
			Math.exp(this.r),	Math.exp(this.g),
			Math.exp(this.b),	Math.exp(this.a) ]);
	}
	
	log() {
		return new ImgColorRGBA([
			Math.log(this.r),	Math.log(this.g),
			Math.log(this.b),	Math.log(this.a) ]);
	}
	
	pow(base) {
		return new ImgColorRGBA([
			Math.pow(base, this.r),	Math.pow(base, this.g),
			Math.pow(base, this.b),	Math.pow(base, this.a) ]);
	}
	
	baselog(base) {
		const x = 1.0 / Math.log(base);
		return new ImgColorRGBA([
			Math.log(this.r) * x,	Math.log(this.g) * x,
			Math.log(this.b) * x,	Math.log(this.a) * x ]);
	}
	
	table(table) {
		return new ImgColorRGBA([
			table[Math.round(this.r)], table[Math.round(this.g)],
			table[Math.round(this.b)], table[Math.round(this.a)] ]);
	}
	
	random() {
		return new ImgColorRGBA([
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
	}
	
	luminance() {
		return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b;
	}
	
	addColor(c) {
		return new ImgColorRGBA([
			this.r + c.r,	this.g + c.g,
			this.b + c.b,	this.a + c.a ]);
	}
	
	subColor(c) {
		return new ImgColorRGBA([
			this.r - c.r,	this.g - c.g,
			this.b - c.b,	this.a - c.a ]);
	}
	
	mulColor(c) {
		return new ImgColorRGBA([
			this.r * c.r,	this.g * c.g,
			this.b * c.b,	this.a * c.a ]);
	}
	
	divColor(c) {
		return new ImgColorRGBA([
			this.r / c.r,	this.g / c.g,
			this.b / c.b,	this.a / c.a ]);
	}
	
	maxColor(c) {
		return new ImgColorRGBA([
			Math.max(c.r, this.r),Math.max(c.g, this.g),
			Math.max(c.b, this.b),Math.max(c.a, this.a)]);
	}
	
	minColor(c) {
		return new ImgColorRGBA([
			Math.min(c.r, this.r),Math.min(c.g, this.g),
			Math.min(c.b, this.b),Math.min(c.a, this.a)]);
	}
	
	norm(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return (Math.abs(this.r) + Math.abs(this.g) + Math.abs(this.b)) / 3;
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b) / 3;
		}
	}
	
	normFast(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return Math.abs(this.r) + Math.abs(this.g) + Math.abs(this.b);
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return this.r * this.r + this.g * this.g + this.b * this.b;
		}
	}
	
	getBlendAlpha() {
		return this.a / 255.0;
	}
	
	setBlendAlpha(x) {
		const color = this.clone();
		color.rgba[3] = x * 255.0;
		return color;
	}
	
	exchangeColorAlpha(color) {
		return new ImgColorRGBA( [ this.r, this.g, this.b, color.a ]);
	}
	
	getRRGGBB() {
		return (this.r << 16) | (this.g << 8) | (this.b & 0xff);
	}
	
	getRed() {
		return (this.r);
	}
	
	getGreen() {
		return (this.g);
	}
	
	getBlue() {
		return (this.b);
	}
	
	equals(c) {
		return	(this.r === c.r) &&
				(this.g === c.g) &&
				(this.b === c.b) &&
				(this.a === c.a) ;
	}
	
	toString() {
		return "color(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
	
	mulMatrix(m) {
		const color = new ImgColorRGBA();
		color.rgba[0] =	this.r * m[0][0] +
						this.g * m[0][1] +
						this.b * m[0][2] +
						this.a * m[0][3];
		color.rgba[1] =	this.r * m[1][0] +
						this.g * m[1][1] +
						this.b * m[1][2] +
						this.a * m[1][3];
		color.rgba[2] =	this.r * m[2][0] +
						this.g * m[2][1] +
						this.b * m[2][2] +
						this.a * m[2][3];
		color.rgba[3] =	this.r * m[3][0] +
						this.g * m[3][1] +
						this.b * m[3][2] +
						this.a * m[3][3];
		return color;
	}
	
	/**
	 * RGBの画素から方向ベクトルへの変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgVector}
	 */
	getNormalVector() {
		return new ImgVector(
			(this.r / 128.0) - 1.0,
			- (this.g / 128.0) + 1.0,
			(this.b / 128.0) - 1.0
		);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgColorY extends ImgColor {
		
	constructor(color) {
		super();
		// ディープコピー
		this.y = color;
	}

	getColor() {
		return this.y;
	}
	
	clone() {
		return new ImgColorY(this.y);
	}
	
	zero() {
		return new ImgColorY(0.0);
	}
	
	one() {
		return new ImgColorY(1.0);
	}
	
	add(x) {
		return new ImgColorY(this.y + x);
	}
	
	sub(x) {
		return new ImgColorY(this.y - x);
	}
	
	mul(x) {
		return new ImgColorY(this.y * x);
	}
	
	div(x) {
		return new ImgColorY(this.y / x);
	}
	
	exp() {
		return new ImgColorY(Math.exp(this.y));
	}
	
	log() {
		return new ImgColorY(Math.log(this.y));
	}
	
	pow(base) {
		return new ImgColorY(Math.pow(base, this.y));
	}
	
	baselog(base) {
		return new ImgColorY(Math.log(this.y) / Math.log(base));
	}
	
	table(table) {
		return new ImgColorY(table[Math.floor(this.y)]);
	}
	
	random() {
		return new ImgColorY(Math.random() * 256);
	}
	
	luminance() {
		return this.y;
	}
	
	addColor(c) {
		return new ImgColorY(this.y + c.y);
	}
	
	subColor(c) {
		return new ImgColorY(this.y - c.y);
	}
	
	mulColor(c) {
		return new ImgColorY(this.y * c.y);
	}
	
	divColor(c) {
		return new ImgColorY(this.y / c.y);
	}
	
	maxColor(c) {
		return new ImgColorY(Math.max(c.y, this.y));
	}
	
	minColor(c) {
		return new ImgColorY(Math.min(c.y, this.y));
	}
	
	norm() {
		return Math.abs(this.y);
	}
	
	normFast() {
		return Math.abs(this.y);
	}
	
	getBlendAlpha() {
		return 1.0;
	}
	
	setBlendAlpha() {
		return this;
	}
	
	exchangeColorAlpha() {
		return this;
	}
	
	equals(c) {
		return this.y === c.y;
	}
	
	toString() {
		return "color(" + this.y + ")";
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgDataY extends ImgData {
	
	constructor() {
		if(arguments.length === 1) {
			super(arguments[0]);
		}
		else if(arguments.length === 2) {
			super(arguments[0], arguments[1]);
		}
		else {
			super();
		}
	}
	
	clone() {
		const x = new ImgDataY(this.width, this.height);
		this._copyData(x);
		return x;
	}
	
	setSize(width, height) {
		super.setSize(width, height);
		this.data	= new Float32Array(this.width * this.height);
	}
	
	getPixelInside(x, y) {
		const p = y * this.width + x;
		return new ImgColorY(this.data[p]);
	}
	
	setPixelInside(x, y, color) {
		const p = y * this.width + x;
		this.data[p]     = color.getColor();
	}
	
	putImageData(imagedata, n) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			if(n === undefined) {
				n = 0;
			}
			let p = 0;
			for(let i = 0; i < this.data.length; i++) {
				this.data[i] = imagedata.data[p + n];
				p += 4;
			}
		}
		else if(imagedata instanceof ImgDataY) {
			this.setSize(imagedata.width, imagedata.height);
			this.data.set(imagedata.data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	putImageDataR(imagedata) {
		this.putImageData(imagedata, 0);
	}
	
	putImageDataG(imagedata) {
		this.putImageData(imagedata, 1);
	}
	
	putImageDataB(imagedata) {
		this.putImageData(imagedata, 2);
	}
	
	putImageDataA(imagedata) {
		this.putImageData(imagedata, 3);
	}
	
	getImageData() {
		const canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		const context = canvas.getContext("2d");
		const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		let p = 0, i = 0;
		for(; i < this.data.length; i++) {
			const x = Math.floor(this.data[i]);
			imagedata.data[p + 0] = x;
			imagedata.data[p + 1] = x;
			imagedata.data[p + 2] = x;
			imagedata.data[p + 3] = 255;
			p += 4;
		}
		return imagedata;
	}
	
	/**
	 * ノーマルマップを作成する
	 * @returns {ImgColorRGBA}
	 */
	getNormalMap() {
		if(this.getWrapMode() === ImgData.MODE_WRAP.INSIDE) {
			// 端の値を取得できないのでエラー
			throw "not inside";
		}
		
		const output = new ImgDataRGBA(this.width, this.height);
		let x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				const x1 = new ImgVector(x - 1, y, this.getPixel(x - 1, y).getColor());
				const x2 = new ImgVector(x + 1, y, this.getPixel(x + 1, y).getColor());
				const x3 = x1.getDirection(x2);
				const y1 = new ImgVector(x, y - 1, this.getPixel(x, y - 1).getColor());
				const y2 = new ImgVector(x, y + 1, this.getPixel(x, y + 1).getColor());
				const y3 = y1.getDirection(y2);
				const n  = x3.cross(y3).normalize();
				output.setPixelInside(x, y, n.getNormalMapColor());
			}
		}
		return output;
	}
	
	/**
	 * ノーマルマップに対して、環境マッピングする
	 * @param {ImgColorRGBA} texture
	 * @returns {ImgColorRGBA}
	 */
	filterEnvironmentMapping(texture) {
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class ImgDataRGBA extends ImgData {
		
	constructor() {
		if(arguments.length === 1) {
			super(arguments[0]);
		}
		else if(arguments.length === 2) {
			super(arguments[0], arguments[1]);
		}
		else {
			super();
		}
	}
	
	clone() {
		const x = new ImgDataRGBA(this.width, this.height);
		this._copyData(x);
		return x;
	}
	
	setSize(width, height) {
		super.setSize(width, height);
		this.data	= new Uint8ClampedArray(this.width * this.height * 4);
	}
	
	getPixelInside(x, y) {
		const p = (y * this.width + x) * 4;
		const c = new ImgColorRGBA([
			this.data[p],
			this.data[p + 1],
			this.data[p + 2],
			this.data[p + 3]
		]);
		return c;
	}

	setPixelInside(x, y, color) {
		const p = (y * this.width + x) * 4;
		this.data[p]     = color.getColor()[0];
		this.data[p + 1] = color.getColor()[1];
		this.data[p + 2] = color.getColor()[2];
		this.data[p + 3] = color.getColor()[3];
	}
	
	putDataY(imagedata, n) {
		if(!(imagedata instanceof ImgDataY)) {
			throw "IllegalArgumentException";
		}
		this.setSize(imagedata.width, imagedata.height);
		if(n === undefined) {
			n = 0;
		}
		let p = 0, i = 0;
		for(; i < imagedata.data.length; i++) {
			this.data[p + n] = Math.floor(imagedata.data[i]);
			p += 4;
		}
	}
	
	putDataYToR(imagedata) {
		this.putDataS(imagedata, 0);
	}
	
	putDataYToG(imagedata) {
		this.putDataS(imagedata, 1);
	}
	
	putDataYToB(imagedata) {
		this.putDataS(imagedata, 2);
	}
	
	putDataYToA(imagedata) {
		this.putDataS(imagedata, 3);
	}
	
	putImageData(imagedata) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			this.data.set(imagedata.data);
		}
		else if(imagedata instanceof ImgDataY) {
			this.putImageData(imagedata.getImageData());
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	getImageData() {
		const canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		const context = canvas.getContext("2d");
		const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedata.data.set(this.data);
		return imagedata;
	}
	
	grayscale() {
		this.forEach(function(color, x, y, data) {
			const luminance = ~~color.luminance();
			const newcolor = new ImgColorRGBA( [luminance, luminance, luminance, color.rgba[3]] );
			data.setPixelInside(x, y, newcolor);
		});
	}
	
	/**
	 * 使用している色数を取得します
	 * ※透過色はカウントしません
	 * @returns {Number}
	 */
	getColorCount() {
		// 色を記録する領域
		// 0x200000 = 256 * 256 * 256 / 8 = 2097152
		const sw = new Uint8ClampedArray(0x200000);
		let count = 0;
		this.forEach(function(color) {
			const rrggbb = color.getRRGGBB();
			const p1 = rrggbb >> 3; // x / 8
			const p2 = rrggbb  % 7; // x & 8
			if(((sw[p1] >> p2) & 1) === 0) {
				count++;
				sw[p1] = (sw[p1] ^ (1 << p2)) & 0xFF;
			}
		});
		return count;
	}

	/**
	 * メディアンカットで減色後のパレットを取得します。
	 * @param {Number} colors 色の数
	 * @returns {}
	 */
	getPalletMedianCut(colors) {
		if(this.getColorCount()<=colors){
			return(null);
		}
		let i;
		let r, g, b;

		// 減色に用いる解像度
		const bit = 7;

		// 含まれる色数
		const color = new Uint32Array((1<<bit)*(1<<bit)*(1<<bit));

		// 現在の色数
		let colorcnt = 0;

		// 色から指定した解像度のrrggbb値を返す
		const RGBtoPositionForColor = function(color) {
			const r = color.getRed();
			const g = color.getGreen();
			const b = color.getBlue();
			return ((r>>(8-bit))<<(bit*2))|((g>>(8-bit))<<bit)|(b>>(8-bit));
		};

		// 0区切り目の初期値を計算する
		// それぞれの区切り幅に含まれた色数、及び区切り幅の最大値と最小値
		// R = 0, G = 1, B = 2 の位置とする
		const color_cnt = [];	
		const color_max = [[], [], []];
		const color_min = [[], [], []];
		// 色数は全画素
		color_cnt[0] = this.width * this.height;
		// 色の幅も最小から最大までとる
		for(i = 0; i < 3; i++) {
			color_min[i][colorcnt] = 0;					//bit最小値
			color_max[i][colorcnt] = (1 << bit) - 1;	//bit最大値
		}

		// あらかじめ各色が何画素含まれているかを調査する
		this.forEach(function(targetcolor) {
			color[RGBtoPositionForColor(targetcolor)]++;
		});

		// 色の幅
		let r_delta, g_delta, b_delta;
		// 色の最大幅
		let max_r_delta, max_g_delta, max_b_delta;
		// 区切った回数
		let kugiri;

		// ここからアルゴリズム頑張った……！

		colorcnt++;
		for(kugiri = 1; colorcnt < colors ;) {

			//区切る場所(R・G・Bのどれを区切るか)を大雑把に決める
			//基準は体積
			let max_volume = 0, tgt = 0;
			for(i = 0; i < kugiri; i++) {
				r_delta = color_max[0][i] - color_min[0][i];
				g_delta = color_max[1][i] - color_min[1][i];
				b_delta = color_max[2][i] - color_min[2][i];
				const this_volume = r_delta * g_delta * b_delta;
				if(max_volume < this_volume) {
					max_volume = this_volume;
					max_r_delta = r_delta;
					max_g_delta = g_delta;
					max_b_delta = b_delta;
					tgt = i;
				}
			}

			//その立方体のうちどの次元を区切るか大雑把に決める
			//基準は幅
			let max_delta = max_g_delta; // 緑を優先して区切る
			let tgt_col = 1;
			if(max_delta < max_r_delta) {
				max_delta = max_r_delta;
				tgt_col = 0;
			}
			if(max_delta < max_b_delta) {
				max_delta = max_b_delta;
				tgt_col = 2;
			}

			// それ以上区切れなかった場合は終了
			if(max_delta === 0) {
				break;
			}

			// tgt の範囲を
			// tgt_col  の次元の中央で区切る
			{
				//区切る位置を調べる(色数の中心)
				const point = color_min[tgt_col][tgt] + (max_delta >> 1); //実際の中心
				//
				//新しく区切った範囲を作成
				if(point === color_max[tgt_col][tgt]) {
					color_min[tgt_col][kugiri] = point;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point - 1;
				}
				else {
					color_min[tgt_col][kugiri] = point + 1;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point;
				}

				//その他の範囲は受け継ぐ
				for( i=0;i < 3;i++){
					if(i === tgt_col) {
						continue;
					}
					color_min[i][kugiri] = color_min[i][tgt];
					color_max[i][kugiri] = color_max[i][tgt];
				}
			}

			// 新しく区切った範囲に対して、含まれる色の画素数を計算しなおす
			color_cnt[kugiri] = 0;
			for( r = color_min[0][kugiri];r <= color_max[0][kugiri];r++) {
				for( g = color_min[1][kugiri];g <= color_max[1][kugiri];g++) {
					for( b = color_min[2][kugiri];b <= color_max[2][kugiri];b++) {
						color_cnt[kugiri] += color[(r<<(bit<<1))|(g<<bit)|b];
					}
				}
			}
			color_cnt[tgt] -= color_cnt[kugiri];

			// 新しく区切った先に画素が入って、区切り元の画素数がなくなった場合
			if(color_cnt[tgt] === 0) {
				// 区切った先のデータを、区切り元にコピーして、
				// 区切ったことをなかったことにする
				color_cnt[tgt] = color_cnt[kugiri];
				for(i = 0; i < 3; i++){
					color_min[i][tgt] = color_min[i][kugiri];
					color_max[i][tgt] = color_max[i][kugiri];
				}
			}
			// せっかく区切ったが、区切った先の画素数が0だった
			else if(color_cnt[kugiri] === 0) ;
			//色が両方とも分別できた場合
			else {
				kugiri++;
				colorcnt++;
			}
		}

		// 作成するパレット
		const pallet = [];

		//パレットを作る
		for(i = 0; i < colorcnt; i++) {
			//色数 × 色
			let avr_r = 0;
			let avr_g = 0;
			let avr_b = 0;
			for(r = color_min[0][i];r <= color_max[0][i];r++) {
				for(g = color_min[1][i];g <= color_max[1][i];g++) {
					for(b = color_min[2][i];b <= color_max[2][i];b++) {
						const color_sum = color[(r<<(bit<<1))|(g<<bit)|b];
						avr_r += color_sum * (r << (8-bit));
						avr_g += color_sum * (g << (8-bit));
						avr_b += color_sum * (b << (8-bit));
					}
				}
			}
			//平均を取る
			r = Math.round(avr_r / color_cnt[i]);
			g = Math.round(avr_g / color_cnt[i]);
			b = Math.round(avr_b / color_cnt[i]);
			r = r < 0 ? 0 : r > 255 ? 255 : r;
			g = g < 0 ? 0 : g > 255 ? 255 : g;
			b = b < 0 ? 0 : b > 255 ? 255 : b;

			//COLORREF 型で代入
			pallet[i] = new ImgColorRGBA([r, g, b, 255]);
		}

		return pallet;
	}

	/**
	 * 使用されている色のパレットを取得します。
	 * 最大256色まで取得します。
	 * @returns {Array|ImgData.getPallet.pallet}
	 */
	getPallet() {
		const pallet = [];
		const rrggbb_array = new Uint32Array(256);
		let count = 0;
		let i = 0;
		this.forEach(function(color) {
			if(count > 255) {
				return;
			}
			const rrggbb = color.getRRGGBB();
			for(i = 0; i < count; i++) {
				if(rrggbb_array[i] === rrggbb) {
					return;
				}
			}
			rrggbb_array[count] = rrggbb;
			pallet[count] = color;
			count++;
		});
		return pallet;
	}

	/**
	 * グレースケールのパレットを取得します。
	 * @param {Number} colors 階調数(2~256)
	 * @returns {}
	 */
	getPalletGrayscale(colors) {
		const n = colors < 2 ? 2 : colors > 256 ? 256 : colors;
		const pallet = [];
		const diff = 255.0 / (n - 1);
		let col = 0.0;
		let i;
		for(i = 0; i < n; i++) {
			let y = Math.round(col);
			y = y < 0 ? 0 : y > 255 ? 255 : y;
			pallet[i] = new ImgColorRGBA([y, y, y, 255]);
			col += diff;
		}
		return pallet;
	}

	/**
	 * パレットを用いて単純減色する
	 * @param {Array} palettes
	 * @returns {undefined}
	 */
	quantizationSimple(palettes) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			data.setPixelInside(x, y, palletcolor.c1.color.exchangeColorAlpha(thiscolor));
		});
	}

	/**
	 * パレットから組織的ディザ法による減色を行います。(Error-diffusion dithering)
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.orderPattern} orderPattern
	 * @param {ImgColor.NORM_MODE} normType
	 * @returns {undefined}
	 */
	quantizationOrdered(palettes, orderPattern, normType) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, normType);
			const color1 = palletcolor.c1.color;
			const norm1  = palletcolor.c1.norm;
			const color2 = palletcolor.c2.color;
			const norm2  = palletcolor.c2.norm;
			let normsum = norm1 + norm2;
			let sumdiff = 0;
			normsum = normsum === 0 ? 1 : normsum;
			const pattern = orderPattern.pattern[y % orderPattern.height][x % orderPattern.width];
			let newcolor = null;
			if(color1.luminance > color2.luminance) {
				sumdiff = Math.floor((norm2 * orderPattern.maxnumber) / normsum);
				if (pattern <= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			else {
				sumdiff = Math.floor((norm1 * orderPattern.maxnumber) / normsum);
				if (pattern >= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			data.setPixelInside(x, y, newcolor);
		});
	}

	/**
	 * パレットから誤差拡散法による減色を行います。
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	quantizationDiffusion(palettes, diffusionPattern) {

		// 誤差拡散するにあたって、0未満や255より大きな値を使用するため
		// 一旦、下記のバッファにうつす
		const pixelcount	= this.width * this.height;
		const color_r		= new Int16Array(pixelcount);
		const color_g		= new Int16Array(pixelcount);
		const color_b		= new Int16Array(pixelcount);

		// 現在の位置
		let point		= 0;
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			color_r[point] = thiscolor.getRed();
			color_g[point] = thiscolor.getGreen();
			color_b[point] = thiscolor.getBlue();
		});

		// 誤差拡散できない右端
		const width_max = this.width - diffusionPattern.width + diffusionPattern.center;

		// パターンを正規化して合計を1にする
		let px, py;
		let pattern_sum = 0;
		for(py = 0; py < diffusionPattern.height; py++) {
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_sum += diffusionPattern.pattern[py][px];
			}
		}
		const pattern_normalize = [];
		for(py = 0; py < diffusionPattern.height; py++) {
			pattern_normalize[py] = [];
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_normalize[py][px] = diffusionPattern.pattern[py][px] / pattern_sum;
			}
		}

		// 選択処理
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			const diffcolor = new ImgColorRGBA(
				[color_r[point], color_g[point], color_b[point], 255]
			);
			// 最も近い色を探して
			let palletcolor = diffcolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			palletcolor = palletcolor.c1.color;
			// 値を設定する
			data.setPixelInside(x, y, palletcolor.exchangeColorAlpha(thiscolor));
			// 右端の近くは誤差分散させられないので拡散しない
			if(x > width_max) {
				return;
			}
			// ここから誤差を求める
			const deltacolor = diffcolor.subColor(palletcolor);
			for(py = 0; py < diffusionPattern.height; py++) {
				px = py === 0 ? diffusionPattern.center : 0;
				for(; px < diffusionPattern.width; px++) {
					const dx = x + px - diffusionPattern.center;
					const dy = y + py;
					// 画面外への拡散を防止する
					if((dx < 0) || (dy >= data.height)){
						continue;
					}
					const dp = dy * data.width + dx;
					color_r[dp] += deltacolor.getRed()   * pattern_normalize[py][px];
					color_g[dp] += deltacolor.getGreen() * pattern_normalize[py][px];
					color_b[dp] += deltacolor.getBlue()  * pattern_normalize[py][px];
				}
			}
		});
	}

	/**
	 * 単純減色
	 * @param {Array} colorcount 減色後の色数
	 * @returns {undefined}
	 */
	filterQuantizationSimple(colorcount) {
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationSimple(pallet);
		}
	}

	/**
	 * 組織的ディザ法による減色
	 * @param {Array} colorcount 減色後の色数
	 * @param {ImgColor.NORM_MODE} normType 
	 * @returns {undefined}
	 */
	filterQuantizationOrdered(colorcount, normType) {
		if(normType === undefined) {
			normType = ImgColor.NORM_MODE.EUGRID;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationOrdered(
				pallet,
				ImgDataRGBA.quantization.orderPattern.patternBayer,
				normType
			);
		}
	}

	/**
	 * 誤差拡散法による減色
	 * @param {Array} colorcount
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	filterQuantizationDiffusion(colorcount, diffusionPattern) {
		if(diffusionPattern === undefined) {
			diffusionPattern = ImgDataRGBA.quantization.diffusionPattern.patternFloydSteinberg;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationDiffusion(
				pallet,
				diffusionPattern
			);
		}
	}
}

ImgDataRGBA.quantization = {
	
	diffusionPattern : {

		/**
		 * 誤差拡散法に用いるFloyd & Steinbergのパターン
		 */
		patternFloydSteinberg : {
			width	: 3,
			height	: 2,
			center	: 1,
			pattern	: [
				[0, 0, 7],
				[3, 5, 1]
			]
		},

		/**
		 * 誤差拡散法に用いるJarvis,Judice & Ninkeのパターン
		 */
		patternJarvisJudiceNinke : {
			width	: 5,
			height	: 3,
			center	: 2,
			pattern	: [
				[0, 0, 0, 7, 5],
				[3, 5, 7, 5, 3],
				[1, 3, 5, 3, 1]
			]
		}
	},

	orderPattern : {
		/**
		 * 組織的ディザ法に用いるBayerのパターン
		 */
		patternBayer : {
			width	: 4,
			height	: 4,
			maxnumber : 16,
			pattern	: [
				[ 0, 8, 2,10],
				[12, 4,14, 6],
				[ 3,11, 1, 9],
				[15, 7,13, 5]
			]
		}
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const ImageProcessing = {
	ImgDataRGBA		: ImgDataRGBA,
	ImgColorRGBA	: ImgColorRGBA,
	ImgDataY		: ImgDataY,
	ImgColorY		: ImgColorY,
	MODE_WRAP		: ImgData.MODE_WRAP,
	MODE_IP			: ImgData.MODE_IP,
	MODE_BLEND		: ImgData.MODE_BLEND
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

/**
 * 基底クラス
 */
class SBase {
	
	constructor(elementtype, title) {
		this.id				= "SComponent_" + (SBase._counter++).toString(16);
		this.wallid			= "SComponent_" + (SBase._counter++).toString(16);
		this.isshow			= false;
		this._element		= null;
		this._wall			= null;
		this.elementtype	= elementtype;
		this.unit			= SBase.UNIT_TYPE.EM;

		const that = this;
		const mouseevent = {
			over : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
			},
			out : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			down  : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			up  : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			}
		};

		this.tool			= {
			attachMouseEvent : function(element) {
				element.addEventListener("touchstart", mouseevent.over	,false);
				element.addEventListener("touchend", mouseevent.up		,false);
				element.addEventListener("mouseover",mouseevent.over	,false);
				element.addEventListener("mouseout"	,mouseevent.out		,false);
				element.addEventListener("mousedown",mouseevent.down	,false);
				element.addEventListener("mouseup"	,mouseevent.up		,false);
			},
			removeNodeForId : function(id) {
				const element = document.getElementById(id);
				SBase.node_tool.removeNode(element);
				return element;
			},
			AputB : function(target, component, type) {
				if((!target) || (!component) || (!(component instanceof SBase))) {
					throw "IllegalArgumentException";
				}
				else if(target === component) {
					throw "it referenced me";
				}
				else if((type !== SBase.PUT_TYPE.IN) &&
					(type !== SBase.PUT_TYPE.RIGHT) &&
					(type !== SBase.PUT_TYPE.NEWLINE) ) {
					throw "IllegalArgumentException";
				}
				let node = null;
				if((typeof target === "string")||(target instanceof String)) {
					node = document.getElementById(target);
				}
				else if(target instanceof SBase) {
					if(type === SBase.PUT_TYPE.IN) {
						if(target.isContainer()) {
							node = target.getContainerElement();
						}
						else {
							throw "not Container";
						}
					}
					else {
						node = target.getElement();
					}
				}
				if(node === null) {
					throw "Not Found " + target;
				}
				// この時点で
				// node は HTML要素 となる。
				// component は SBase となる。

				const insertNext = function(newNode, referenceNode) {
					if(referenceNode.nextSibling) {
						referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
					}
					else {
						referenceNode.parentNode.appendChild(newNode);
					}
				};
				// 移動前に自分を消去
				component.removeMe();
				if(type === SBase.PUT_TYPE.IN) {
					// 最後の行があるならば次の行へ
					component.onAdded();
					if(node.lastChild !== null) {
						component.getWall(SBase.PUT_TYPE.NEWLINE).style.display = "block";
						node.appendChild(component.getWall());
					}
					component.getElement().style.display = "inline-block";
					node.appendChild(component.getElement());
				}
				else {
					if(node.parentNode === null) {
						throw "not found element on the html";
					}
					component.onAdded();
					insertNext(component.getWall(type), node);
					insertNext(component.getElement(), component.getWall(type));
					if(type === SBase.PUT_TYPE.RIGHT) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "inline-block";
						component.getElement().style.display = "inline-block";
					}
					else if(type === SBase.PUT_TYPE.NEWLINE) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "block";
						component.getElement().style.display = "inline-block";
					}
				}
			}
		};

		this.setText(title);
	}
	
	getWidth() {
		let width = this.getElement().style.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}

	getHeight() {
		let height = this.getElement().style.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}

	getSize() {
		return {
			width : this.getWidth(),
			height : this.getHeight()
		};
	}

	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.width = width.toString() + this.unit;
	}

	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.height = height.toString() + this.unit;
	}

	setSize(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	}

	removeMe() {
		this.tool.removeNodeForId(this.id);
		this.tool.removeNodeForId(this.space_id);
	}

	onAdded() {
	}

	getWall(type) {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._wall) {
			return this._wall;
		}
		const wall = document.createElement("span");
		wall.id = this.wallid;
		if(type === SBase.PUT_TYPE.RIGHT) {
			wall.className = SBase.CLASS_NAME.SPACE;
		}
		else if(type === SBase.PUT_TYPE.NEWLINE) {
			wall.className = SBase.CLASS_NAME.NEWLINE;
		}
		wall.style.display = "inline-block";
		this._wall = wall;
		return wall;
	}

	isContainer() {
		return this.getContainerElement() !== null;
	}

	getContainerElement() {
		return null;
	}

	getElement() {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._element) {
			return this._element;
		}
		const element = document.createElement(this.elementtype);
		element.id = this.id;
		element.className = SBase.CLASS_NAME.COMPONENT;
		element.style.display = "inline-block";
		this._element = element;
		this.tool.attachMouseEvent(element);
		return element;
	}

	put(targetComponent, type) {
		this.tool.AputB(this, targetComponent, type);
		return;
	}

	putMe(target, type) {
		this.tool.AputB(target, this, type);
		return;
	}

	isVisible() {
		if(this.getElement().style.visibility === null) {
			return true;
		}
		return this.getElement().style.visibility !== "hidden";
	}

	setVisible(isvisible) {
		if(isvisible) {
			this.getElement().style.visibility	= "visible";
			this.getWall().style.visibility		= "visible";
		}
		else {
			this.getElement().style.visibility	= "hidden";
			this.getWall().style.visibility		= "hidden";
		}
		return;
	}
	
	getTextNode() {
		const element = this.getElement();
		// childNodes でテキストノードまで取得する
		const childnodes = element.childNodes;
		let textnode = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(childnodes[i] instanceof Text) {
				textnode = childnodes[i];
				break;
			}
		}
		// テキストノードがない場合は null をかえす
		return textnode;
	}

	getElementNode() {
		const element = this.getElement();
		// children でテキストノード意外を取得する
		const childnodes = element.children;
		let node = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(!(childnodes[i] instanceof Text)) {
				node = childnodes[i];
				break;
			}
		}
		return node;
	}

	getEditableNodeForValue() {
		// Value要素をもつもの
		return null;
	}

	getEditableNodeForNodeValue() {
		// Value要素をもつなら、このメソッドは利用不可とする
		if(this.getEditableNodeForValue()) {
			return null;
		}
		// nodeValue 要素をもつもの
		let textnode = this.getTextNode();
		// 見つからなかったら作成する
		if(textnode === null) {
			const element = this.getElement();
			textnode = document.createTextNode("");
			element.appendChild(textnode);
		}
		return textnode;
	}

	setText(title) {
		if(!title) {
			return;
		}
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			node.value = title;
			return;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			node.nodeValue = title;
			return;
		}
	}

	getText() {
		let title = null;
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			title = node.value;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			title = node.nodeValue.trim();
		}
		return (title === null) ? "" : title;
	}

	getEnabledElement() {
		return null;
	}

	setEnabled(isenabled) {
		if(isenabled) {
			SBase.node_tool.removeClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		else {
			SBase.node_tool.addClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		const element = this.getEnabledElement();
		// disabled属性が利用可能ならつける
		if(element !== null) {
			SBase.node_tool.setBooleanAttribute(element, "disabled", isenabled);
		}
	}
	
	isEnabled() {
		return !SBase.node_tool.isSetClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
	}

	getId() {
		return this.id;
	}

	getUnit() {
		return this.unit;
	}

	setUnit(UNIT_TYPE) {
		this.unit = UNIT_TYPE;
	}

	addClass(classname) {
		return SBase.node_tool.addClass(this.getElement(), classname);
	}

	toString() {
		return this._elementtype + "(" + this.id + ")";
	}
}

SBase.PUT_TYPE = {
	IN		: 0,
	RIGHT	: 1,
	NEWLINE	: 2
};

SBase.UNIT_TYPE = {
	PX		: "px",
	EM		: "em",
	PERCENT	: "%"
};

SBase.LABEL_POSITION = {
	LEFT	: 0,
	RIGHT	: 1
};

SBase.CLASS_NAME = {
	MOUSEOVER		: "SCOMPONENT_MouseOver",
	MOUSEDOWN		: "SCOMPONENT_MouseDown",
	DISABLED		: "SCOMPONENT_Disabled",
	COMPONENT		: "SCOMPONENT_Component",
	NEWLINE			: "SCOMPONENT_Newline",
	CLOSE			: "SCOMPONENT_Close",
	OPEN			: "SCOMPONENT_Open",
	SPACE			: "SCOMPONENT_Space",
	CONTENTSBOX		: "SCOMPONENT_ContentsBox",
	PANEL			: "SCOMPONENT_Panel",
	PANEL_LEGEND	: "SCOMPONENT_PanelLegend",
	SLIDEPANEL		: "SCOMPONENT_SlidePanel",
	SLIDEPANEL_LEGEND: "SCOMPONENT_SlidePanelLegend",
	SLIDEPANEL_SLIDE: "SCOMPONENT_SlidePanelSlide",
	GROUPBOX		: "SCOMPONENT_GroupBox",
	GROUPBOX_LEGEND	: "SCOMPONENT_GroupBoxLegend",
	IMAGEPANEL		: "SCOMPONENT_ImagePanel",
	LABEL			: "SCOMPONENT_Label",
	SELECT			: "SCOMPONENT_Select",
	COMBOBOX		: "SCOMPONENT_ComboBox",
	CHECKBOX		: "SCOMPONENT_CheckBox",
	CHECKBOX_IMAGE	: "SCOMPONENT_CheckBoxImage",
	BUTTON			: "SCOMPONENT_Button",
	FILELOAD		: "SCOMPONENT_FileLoad",
	FILESAVE		: "SCOMPONENT_FileSave",
	CANVAS			: "SCOMPONENT_Canvas",
	PROGRESSBAR		: "SCOMPONENT_ProgressBar",
	SLIDER			: "SCOMPONENT_Slider",
	COLORPICKER		: "SCOMPONENT_ColorPicker"
};

SBase._counter			= 0;

SBase.node_tool = {
	setBooleanAttribute : function(element, attribute, isset) {
		if((	!(typeof attribute === "string") &&
				!(attribute instanceof String)) ||
				(typeof isset !== "boolean")) {
			throw "IllegalArgumentException";
		}
		const checked = element.getAttribute(attribute);
		if((!isset) && (checked === null))  {
			// falseなので無効化させる。すでにチェック済みなら何もしなくてよい
			element.setAttribute(attribute, attribute);
		}
		else if ((isset) && (checked !== null)) {
			element.removeAttribute(attribute);
		}
	},

	isBooleanAttribute : function(element, attribute) {
		if( !(typeof attribute === "string") &&
			!(attribute instanceof String)) {
			throw "IllegalArgumentException";
		}
		return (element.getAttribute(attribute) === null);
	},

	removeNode : function(element) {
		if(element) {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
		return element;
	},

	removeChildNodes : function(element) {
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		return;
	},

	isSetClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return false;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		return pattern.test(classdata);
	},

	addClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			element.className = classname;
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(pattern.test(classdata)) {
			return;
		}
		element.className = classdata + " " + classname;
	},

	removeClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(!pattern.test(classdata)) {
			return;
		}
		element.className = classdata.replace(pattern, "");
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SButton extends SBase {
	
	constructor(title) {
		super("input", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.getElement().type = "button";
	}
	
	getEditableNodeForValue() {
		return this.getElement();
	}
	
	getEnabledElement () {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("click", func, false);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SCanvas extends SBase {
	
	constructor() {
		super("canvas");
		this.addClass(SBase.CLASS_NAME.CANVAS);
		this.canvas = super.getElement();
		this.glmode = false;
		this.setPixelSize(300, 150);	// canvas のデフォルト値を設定する
	}
	
	getPixelSize() {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		};
	}

	getCanvas() {
		return this.canvas;
	}

	setPixelSize(width, height) {
		if(	(arguments.length !== 2) || 
			((typeof width !== "number") || (typeof height !== "number")) ||
			((width < 0) || (height < 0))) {
			throw "IllegalArgumentException";
		}
		width  = ~~Math.floor(width);
		height = ~~Math.floor(height);
		this.canvas.width = width;
		this.canvas.height = height;
	}

	getContext() {
		// 一度でも GL で getContext すると使用できなくなります。
		if(this.context === undefined) {
			this.context = this.canvas.getContext("2d");
			if(this.context === null) {
				this.glmode = true;
				this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
				this.context = this.gl;
			}
		}
		return this.context;
	}

	clear() {
		if(this.glmode) {
			this.getContext().clear(this.gl.COLOR_BUFFER_BIT);
		}
		else {
			this.getContext().clearRect(0, 0,  this.canvas.width, this.canvas.height);
		}
	}

	getImageData() {
		if(this.glmode) {
			return;
		}
		return this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
	}

	putImageData(imagedata) {
		if(this.glmode) {
			return;
		}
		this.getContext().putImageData(imagedata, 0, 0);
	}

	_putImage(image, isresizecanvas, drawsize) {
		const pixelsize = this.canvas;
		let dx = 0, dy = 0;
		let width  = pixelsize.width;
		let height = pixelsize.height;
		if(SCanvas.drawtype.ORIGINAL === drawsize) {
			width  = image.width;
			height = image.height;
		}
		else if(SCanvas.drawtype.STRETCH === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
		}
		else if(SCanvas.drawtype.FILL_ASPECT_RATIO === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
		}
		else {
			width  = image.width;
			height = image.height;
			if(SCanvas.drawtype.ASPECT_RATIO === drawsize) {
				if(width > pixelsize.width) {
					width  = pixelsize.width;
					height = Math.floor(height * (width / image.width));
				}
				if(height > pixelsize.height) {
					width  = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
			}
			if(SCanvas.drawtype.LETTER_BOX === drawsize) {
				width  = pixelsize.width;
				height = Math.floor(height * (width / image.width));
				if(height > pixelsize.height) {
					width  = Math.floor(width * (pixelsize.height / height));
					height = pixelsize.height;
				}
				dx = Math.floor((pixelsize.width - width) / 2);
				dy = Math.floor((pixelsize.height - height) / 2);
				isresizecanvas = false;
			}
		}
		if(isresizecanvas) {
			this.setUnit(SBase.UNIT_TYPE.PX);
			this.setSize(width, height);
			this.setPixelSize(width, height);
		}
		this.clear();

		if(image instanceof Image) {
			this.context.drawImage(
				image,
				0, 0, image.width, image.height,
				dx, dy, width, height
			);
		}
		else if(image instanceof ImageData) {
			this.context.putImageData(
				image,
				0, 0,
				dx, dy, width, height
			);
		}
	}

	putImage(data, drawcallback, drawsize, isresizecanvas) {
		if(!drawcallback) {
			drawcallback = null;
		}
		if(drawsize === undefined) {
			drawsize = SCanvas.drawtype.LETTER_BOX;
		}
		if(isresizecanvas === undefined) {
			isresizecanvas = false;
		}
		if((data instanceof Image) || (data instanceof ImageData)) {
			// Image -> canvas, ImageData -> canvas
			this._putImage(data, isresizecanvas, drawsize);
			if(typeof drawcallback === "function") {
				drawcallback();
			}
		}
		else if(typeof data === "string") {
			const _this = this;
			const image = new Image();
			// URL(string) -> Image
			image.onload = function() {
				_this.putImage(image, isresizecanvas, drawsize, drawcallback);
			};
			image.src = data;
		}
		else if(data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.getElement(), isresizecanvas, drawsize, drawcallback);
		}
		else if((data instanceof Element) && (data.tagName === "CANVAS")){
			// canvas -> URL(string)
			this.putImage(data.toDataURL(), isresizecanvas, drawsize, drawcallback);
		}
		else if((data instanceof Blob) || (data instanceof File)) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, isresizecanvas, drawsize, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	toDataURL(type) {
		if(!type) {
			type = "image/png";
		}
		return this.canvas.toDataURL(type);
	}
}

SCanvas.drawtype = {
	ORIGINAL		: 0,
	ASPECT_RATIO	: 1,
	STRETCH			: 2,
	LETTER_BOX		: 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SCheckBox extends SBase {
		
	constructor(title) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.CHECKBOX);
		
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;
		this.textnode = document.createTextNode( title ? title : "");
		const element   = this.getElement();
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	getEnabledElement() {
		return this.checkbox;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getElementNode() {
		return this.checkbox;
	}
	
	setLabelPosition(LABEL_POSITION) {
		// ラベルかどうか確認
		const element = this.getElement();
		const textnode = this.getTextNode();
		const elementnode = this.getElementNode();
		// 中身を一旦消去する
		this.node_tool.removeChildNodes(element);
		// 配置を設定する
		if(LABEL_POSITION === SBase.LABEL_POSITION.LEFT) {
			// ラベル内のテキストは左側
			element.appendChild(textnode);
			element.appendChild(elementnode);
		}
		else {
			// ラベルのテキストは右側
			element.appendChild(elementnode);
			element.appendChild(textnode);
		}
		return;
	}
	
	setCheckBoxImageSize(size) {
		if(typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width  = size.toString() + this.unit;
	}
	
	addListener(func) {
		this.checkbox.addEventListener("change", func, false);
	}
	
	setChecked(ischecked) {
		this.checkbox.checked = ischecked;
	}
	
	isChecked() {
		return this.checkbox.checked;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SColorPicker extends SBase {
	
	constructor() {
		
		super("div");
		this.addClass(SBase.CLASS_NAME.COLORPICKER);
		
		const element	= this.getElement();
		const that = this;
		const hls = {
			H : {
				div : document.createElement("div"),
				split : 6,
				value : 0.0,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			},
			S : {
				div : document.createElement("div"),
				split : 1,
				value : 0.5,
				input : null,
				gauge : null,
				color_data	: [],
				color_node	: [],
				is_press : false
			},
			L :	{
				div : document.createElement("div"),
				split : 2,
				value : 0.5,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			}
		};

		for(let i = 0; i <= hls.H.split; i++) {
			const x = 1.0 / hls.H.split * i;
			hls.H.color_data.push(Color.newColorNormalizedHSL([x, 1.0, 0.5]).getCSSHex());
		}

		// イベントをどこで発生させたか分かるように、
		// 関数を戻り値としてもどし、戻り値として戻した関数を
		// イベント発生時に呼び出すようにしています。

		// 押したときにマウスの位置を取得して更新する
		const pushevent = function(name) {
			return function(event) {
				if(event.length) event = event[0];
				if(hls[name].is_press) {
					let node = event.target;
					node = node ? node : event.currentTarget;
					hls[name].value = event.offsetX / node.clientWidth;
					that.redraw();
				}
			};
		};

		// 押した・離したの管理
		const pressevent = function(name, is_press) {
			return function(event) {
				if(event.length) event = event[0];
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].is_press = is_press;
				if(is_press) {
					pushevent(name)(event);
				}
			};
		};

		// インプットボックスの変更
		const inputevent = function(name) {
			return function(event) {
				// イベントが発生したノードの取得
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].value = node.value / 100.0;
				that.redraw();
			};
		};

		// 内部のカラーバーを作成
		const createSelectBar = function(target, name) {
			const element_cover	= document.createElement("div");	// クリック検出
			const element_gauge	= document.createElement("div");	// ゲージ表示用
			const element_gradient= document.createElement("div");	// グラデーション作成用

			// レイヤーの初期設定
			target.style.position			= "relative";
			element_cover.style.position	= "absolute";
			element_gauge.style.position	= "absolute";
			element_gradient.style.position	= "absolute";
			element_cover.style.margin		= "0px";
			element_cover.style.padding		= "0px";
			element_gauge.style.margin		= "0px";
			element_gauge.style.padding		= "0px";
			element_gradient.style.margin	= "0px";
			element_gradient.style.padding	= "0px";

			// 上にかぶせるカバー
			element_cover.addEventListener("mousedown"	, pressevent(name, true), false);
			element_cover.addEventListener("mouseup"	, pressevent(name, false), false);
			element_cover.addEventListener("mouseout"	, pressevent(name, false), false);
			element_cover.addEventListener("mousemove"	, pushevent(name), false);
			element_cover.addEventListener("touchstart"	, pressevent(name, true), false);
			element_cover.addEventListener("touchend"	, pressevent(name, false), false);
			element_cover.addEventListener("touchcancel", pressevent(name, false), false);
			element_cover.dataset.name	= name;
			element_cover.style.width			= "100%";
			element_cover.style.height			= "100%";
			element_cover.style.bottom			= "0px";

			// ゲージ（横幅で｜を表す）
			element_gauge.style.width			= "33%";
			element_gauge.style.height			= "100%";
			element_gauge.style.bottom			= "0px";
			element_gauge.style.borderStyle		= "ridge";
			element_gauge.style.borderWidth		= "0px 2px 0px 0px";
			hls[name].gauge = element_gauge;

			// グラデーション部分
			const split = hls[name].split;
			element_gradient.style.width			= "100%";
			element_gradient.style.height			= "100%";
			element_gradient.style.overflow		= "hidden";
			for(let i = 0; i < split; i++) {
				const element_color = document.createElement("div");
				element_color.style.display		= "inline-block";
				element_color.style.margin		= "0px";
				element_color.style.padding		= "0px";
				element_color.style.height		= "100%";
				element_color.style.width		= 100.0 / split + "%";
				element_color.style.background	= "linear-gradient(to right, #000, #FFF)";
				hls[name].color_node.push(element_color);
				element_gradient.appendChild(element_color);
			}

			// 3つのレイヤーを結合
			target.appendChild(element_gradient);
			target.appendChild(element_gauge);
			target.appendChild(element_cover);
		};

		// 1行を作成
		const createColorBar = function(name) {
			const element_text		= document.createElement("span");
			const element_colorbar	= document.createElement("div");
			const element_inputbox	= document.createElement("input");

			// 位置の基本設定
			element_text.style.display		= "inline-block";
			element_colorbar.style.display	= "inline-block";
			element_inputbox.style.display	= "inline-block";
			element_text.style.verticalAlign		= "top";
			element_colorbar.style.verticalAlign	= "top";
			element_inputbox.style.verticalAlign	= "top";
			element_text.style.height		= "100%";
			element_colorbar.style.height	= "100%";
			element_inputbox.style.height	= "100%";

			// 文字
			element_text.style.margin		= "0px";
			element_text.style.padding		= "0px";
			element_text.style.textAlign	= "center";

			// 中央のバー
			element_colorbar.style.margin	= "0px 0.5em 0px 0.5em";
			element_colorbar.style.padding	= "0px";
			element_colorbar.style.borderStyle	= "solid";
			element_colorbar.style.borderWidth	= "1px";

			// 入力ボックス
			element_inputbox.addEventListener("input", inputevent(name), false);
			element_inputbox.type = "number";
			element_inputbox.style.margin	= "0px";
			element_inputbox.style.padding	= "0px";
			element_inputbox.style.borderStyle	= "none";
			element_inputbox.min = 0.0;
			element_inputbox.max = 100.0;
			element_inputbox.step = 1.0;
			hls[name].input = element_inputbox;

			// 横幅調整
			element_text.style.width		= "1.5em";
			element_colorbar.style.width	= "calc(100% - 6.0em)";
			element_inputbox.style.width	= "3.5em";

			// バーの内部を作成
			createSelectBar(element_colorbar, name);

			// バーのサイズ調整
			const target = hls[name].div;
			target.style.height				= "1.2em";
			target.style.margin				= "0.5em 0px 0.5em 0px";

			element_text.appendChild(document.createTextNode(name));
			target.appendChild(element_text);
			target.appendChild(element_colorbar);
			target.appendChild(element_inputbox);
		};

		// HSLの3つを作成する
		for(const key in hls) {
			createColorBar(key);
		}

		this.hls = hls;
		this.listener = [];

		// Elementを更新後にくっつける
		this.redraw();
		element.appendChild(this.hls.H.div);
		element.appendChild(this.hls.S.div);
		element.appendChild(this.hls.L.div);
	}
	
	setColor(color) {
		if(!(color instanceof Color)) {
			throw "ArithmeticException";
		}
		const hls = this.hls;
		const c = color.getNormalizedHSL();
		hls.H.value = c.h;
		hls.S.value = c.s; 
		hls.L.value = c.l; 
		this.redraw();
	}
	
	getColor() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		return Color.newColorNormalizedHSL([h, s, l]);
	}
	
	redraw() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		hls.S.color_data = [
			Color.newColorNormalizedHSL([h, 0.0, l]).getCSSHex(),
			Color.newColorNormalizedHSL([h, 1.0, l]).getCSSHex()
		];
		hls.L.color_data = [
			Color.newColorNormalizedHSL([h, s, 0.0]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 0.5]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 1.0]).getCSSHex()
		];
		for(const key in hls) {
			const data = hls[key].color_data;
			const node = hls[key].color_node;
			for(let i = 0; i < node.length; i++) {
				node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
			}
			const value = Math.round(100.0 * hls[key].value);
			hls[key].gauge.style.width = value + "%";
			hls[key].input.value = value;
		}
		for(let i = 0;i < this.listener.length; i++) {
			this.listener[i]();
		}
	}

	addListener(func) {
		this.listener.push(func);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SComboBox extends SBase {
	
	constructor(item) {
		super("select", item);
		this.addClass(SBase.CLASS_NAME.SELECT);
		this.addClass(SBase.CLASS_NAME.COMBOBOX);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("change", func, false);
	}
	
	setText(title) {
		if(!title) {
			return;
		}
		const element = this.getElement();
		// 1つの文字列のみならば、配列化する
		if	((typeof title === "string") &&
			(title instanceof String)) {
			title = [title];
		}
		// 内部の要素を全部消去する
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		let i = 0;
		// 追加していく
		for(i = 0; i < title.length; i++) {
			const option_node = document.createElement("option");
			option_node.text = title[i].toString();
			option_node.value = title[i].toString();
			element.appendChild(option_node);
		}
	}
	
	getText() {
		const element = this.getElement();
		// select要素なら option を取得
		const child = element.children;
		let i = 0;
		const output = [];
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				output[output.length] = child[i].text;
			}
		}
		return output;
	}
	
	setSelectedItem(text) {
		const child = this.getElement().children;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(child[i].value === text.toString()) {
					this.getElement().selectedIndex = j;
					break;
				}
				j++;
			}
		}
	}
	
	getSelectedItem() {
		const child = this.getElement().children;
		const selectindex = this.getElement().selectedIndex;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(selectindex === j) {
					return child[i].value;
				}
				j++;
			}
		}
		return "";
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SFileLoadButton extends SBase {
	
	constructor(title) {
		super("label", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILELOAD);
		
		// CSS有効化のために、label 内に input(file) を入れる
		// Edge のバグがあるので Edgeで使用できない
		// https://github.com/facebook/react/issues/7683
		const element   = super.getElement();
		const file = document.createElement("input");
		element.style.textAlign =  "center";  
		file.setAttribute("type", "file");
		file.id = this.getId() + "_file";
		file.style.display = "none";
		this.file = file;
		element.appendChild(file);
	}
	
	getEnabledElement() {
		return this.file;
	}
	
	getFileAccept() {
		const accept = this.file.getAttribute("accept");
		return (accept === null) ? "" : accept;
	}
	
	setFileAccept(filter) {
		if(filter === SFileLoadButton.FILE_ACCEPT.DEFAULT) {
			if(this.file.getAttribute("accept") !== null) {
				this.file.removeAttribute("accept");
			}
		}
		else {
			this.file.accept = filter;
		}
	}
	
	addListener(func) {
		this.file.addEventListener("change",
			function(event){
				func(event.target.files);
			}, false );
	}

}

SFileLoadButton.FILE_ACCEPT = {
	DEFAULT	: "",
	IMAGE	: "image/*",
	AUDIO	: "audio/*",
	VIDEO 	: "video/*",
	TEXT 	: "text/*",
	PNG 	: "image/png",
	JPEG 	: "image/jpg",
	GIF 	: "image/gif"
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SFileSaveButton extends SBase {
	
	constructor(title) {
		super("a", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILESAVE);
		this.filename = "";
		this.url      = "";
		this.getElement().setAttribute("download", this.filename);
	}
	
	getFileName() {
		return this.filename;
	}
	
	setFileName(filename) {
		this.filename = filename;
		this.getElement().setAttribute("download", this.filenam);
	}
	
	setURL(url) {
		this.getElement().href = url;
		this.url               = url;
	}
	
	setEnabled(isenabled) {
		if(this.isEnabled() !== isenabled) {
			if(isenabled) {
				this.getElement().href = this.url;
			}
			else {
				this.getElement().removeAttribute("href");
			}
		}
		super.setEnabled(isenabled);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SGroupBox extends SBase {
	
	constructor(title) {
		super("fieldset");
		this.addClass(SBase.CLASS_NAME.GROUPBOX);
		this.legend = document.createElement("legend");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.GROUPBOX_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.textContent = title;
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const element   = this.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SImagePanel extends SBase {
	
	constructor() {
		super("div");
		this.addClass(SBase.CLASS_NAME.IMAGEPANEL);
		const image = document.createElement("img");
		image.id = this.id + "_img";
		this.image = image;
		this.getElement().appendChild(this.image);
	}
	
	clear() {
		// 未作成
		this.node_tool.removeChildNodes(this.getElement());
	}
	
	toDataURL() {
		return this.image.src;
	}
	
	putImageData(imagedata) {
		this.putImage(imagedata);
	}
	
	putImage(data, drawcallback) {
		if(!drawcallback) {
			drawcallback = null;
		}
		if(typeof data === "string") {
			// URL(string) -> IMG
			this.image.onload = function() {
				if(typeof drawcallback === "function") {
					drawcallback();
				}
			};
			this.image.src = data;
		}
		else if(data instanceof ImageData) {
			const canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			const context = canvas.getContext("2d");
			context.putImageData(data, 0, 0);
			this.putImage(canvas, drawcallback);
		}
		else if(data instanceof Image) {
			this.image.src = data.src;
		}
		else if(data instanceof SCanvas) {
			// SCanvas -> canvas
			this.putImage(data.getElement(), drawcallback);
		}
		else if((data instanceof Element) && (data.tagName === "CANVAS")){
			// canvas -> URL(string)
			try {
				this.putImage(data.toDataURL("image/png"), drawcallback);
			} catch(e) {
				try {
					this.putImage(data.toDataURL("image/jpeg"), drawcallback);
				} catch(e) {
					// falls through
				}
			}
		}
		else if((data instanceof Blob) || (data instanceof File)) {
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SLabel extends SBase {
	
	constructor(title) {
		super("div", title);
		this.addClass(SBase.CLASS_NAME.LABEL);
	}
	
	getContainerElement() {
		return this.getElement();
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SPanel extends SBase {
	
	constructor(title) {
		super("div", null);
		this.addClass(SBase.CLASS_NAME.PANEL);
		const element = this.getElement();
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.PANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		this.paneltool = {
			setText :  function(title) {
				if(title) {
					that.legend.textContent = title;
					that.legend.style.display = "block";
				}
				else {
					that.legend.style.display = "none";
				}
			}
		};
		this.paneltool.setText(title);
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	setText(title) {
		if(this.paneltool) {
			this.paneltool.setText(title);
		}
	}

	getContainerElement() {
		return this.body;
	}

	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SProgressBar extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.PROGRESSBAR);
		
		this.min	= 0.0;
		this.max	= 0.0;
		this.value	= min;
		this.is_indeterminate = false;
		if(arguments.length === 0) {
			this.min = 0.0;
			this.max = 1.0;
		}
		else if(arguments.length === 2) {
			this.min = min;
			this.max = max;
		}
		else {
			throw "IllegalArgumentException";
		}
		this.progress = document.createElement("progress");
		this.getElement().appendChild(this.progress);
		this.progress.id = this.getId() + "_progress";
		this.progress.className = SBase.CLASS_NAME.PROGRESSBAR;
		// 内部の目盛りは0-1を使用する
		this.progress.value	= 0.0;
		this.progress.max	= 1.0;
	}
	
	setMaximum(max) {
		this.max = max;
	}
	
	setMinimum(min) {
		this.min = min;
	}
	
	getMaximum() {
		return this.max;
	}
	
	getMinimum() {
		return this.min;
	}
	
	setValue(value) {
		this.value = value;
		this.progress.value = this.getPercentComplete();
	}
	
	getValue() {
		return this.value;
	}
	
	setIndeterminate(newValue) {
		this.is_indeterminate = newValue;
		if(this.is_indeterminate) {
			this.progress.removeAttribute("value");
		}
		else {
			this.setValue(this.value);
		}
	}
	
	isIndeterminate() {
		return this.is_indeterminate;
	}
	
	getPercentComplete() {
		const delta = this.max - this.min;
		return (this.value - this.min) / delta;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SSlidePanel extends SBase {
	
	constructor(title) {
		super("div");
		this.addClass(SBase.CLASS_NAME.SLIDEPANEL);
		this.textnode = document.createTextNode( title ? title : "");
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);
		this.slide = document.createElement("div");
		SBase.node_tool.addClass(this.slide, SBase.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		const clickfunc = function() {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);
		this.setOpen(false);
		this.slide.appendChild(this.body);
		const element   = super.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}
	
	setOpen(is_open) {
		this.is_open = is_open;
		if (this.is_open){
			this.slide.style.maxHeight	= this.body.scrollHeight + "px";
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.OPEN);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight	= null;
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.CLOSE);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.OPEN);
		} 
	}
	
	isOpen() {
		return this.is_open;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class SSlider extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.SLIDER);
		
		if(arguments.length === 0) {
			min = 0.0;
			max = 1.0;
		}
		else if(arguments.length !== 2) {
			throw "IllegalArgumentException";
		}
		this.slider = document.createElement("input");
		this.slider.id = this.getId() + "_slider";
		this.slider.type	= "range";
		this.slider.className = SBase.CLASS_NAME.SLIDER;
		this.slider.value	= min;
		this.slider.min		= min;
		this.slider.max		= max;
		this.slider.step	= (max - min) / 100;
		this.datalist		= document.createElement("datalist");
		this.datalist.id	= this.getId() + "_datalist";
		this.slider.setAttribute("list", this.datalist.id);
		this.getElement().appendChild(this.slider);
		this.getElement().appendChild(this.datalist);
	}
	
	getEnabledElement() {
		return this.slider;
	}
	
	setMaximum(max) {
		this.slider.max = max;
	}
	
	setMinimum(min) {
		this.slider.min = min;
	}
	
	getMaximum() {
		return parseFloat(this.slider.max);
	}
	
	getMinimum() {
		return parseFloat(this.slider.min);
	}
	
	setValue(value) {
		this.slider.value = value;
	}
	
	getValue() {
		return parseFloat(this.slider.value);
	}
	
	setMinorTickSpacing(step) {
		this.slider.step = step;
	}
	
	getMinorTickSpacing() {
		return parseFloat(this.slider.step);
	}
	
	setMajorTickSpacing(step) {
		this.majortick = step;
		this.removeMajorTickSpacing();
		let i;
		const min = this.getMinimum();
		const max = this.getMaximum();
		for(i = min; i <= max; i+= step) {
			const option_node = document.createElement("option");
			option_node.value = i.toString();
			this.datalist.appendChild(option_node);
		}
	}
	
	getMajorTickSpacing() {
		return this.majortick;
	}
	
	removeMajorTickSpacing() {
		const element = this.datalist;
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
	}
	
	addListener(func) {
		let isDown = false;
		const _this = this;
		const setDown = function() {
			isDown = true;
		};
		const setUp = function() {
			if(isDown) {
				if(_this.slider.disabled !== "disabled") {
					func();
				}
				isDown = false;
			}
		};
		this.slider.addEventListener("touchstart", setDown, false );
		this.slider.addEventListener("touchend", setUp, false );
		this.slider.addEventListener("mousedown", setDown, false );
		this.slider.addEventListener("mouseup", setUp, false );
	}

	getWidth() {
		let width = this.slider.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}
	
	getHeight() {
		let height = this.slider.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}
	
	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setWidth(width);
		this.slider.style.width = width.toString() + this.unit;
	}
	
	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setHeight(height);
		this.slider.style.height = height.toString() + this.unit;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const SComponent = {
	
	Button : SButton,
	Canvas : SCanvas,
	CheckBox : SCheckBox,
	ColorPicker : SColorPicker,
	ComboBox : SComboBox,
	FileLoadButton : SFileLoadButton,
	FileSaveButton : SFileSaveButton,
	GroupBox : SGroupBox,
	ImagePanel : SImagePanel,
	Label : SLabel,
	Panel : SPanel,
	ProgressBar : SProgressBar,
	SlidePanel : SSlidePanel,
	Slider : SSlider,
	
	PUT_TYPE : SBase.PUT_TYPE,
	UNIT_TYPE : SBase.UNIT_TYPE,
	LABEL_POSITION : SBase.LABEL_POSITION,
	FILE_ACCEPT : SFileLoadButton.FILE_ACCEPT
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3Math =  {
	EPSILON: 2.2204460492503130808472633361816E-8,
	
	clamp: function(x, min, max) {
		return (x < min) ? min : (x > max) ? max : x;
	},
	
	step: function(edge, x) {
		return edge > x ? 1 : 0;
	},
	
	mix: function(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	},
	
	smoothstep: function(v0, v1, x) {
		const s = x * x * (3.0 - 2.0 * x);
		return v0 + (v1 - v0) * s;
	},
	
	equals: function(x1, x2) {
		return Math.abs(x1 - x2) < S3Math.EPSILON;
	},
	
	mod: function(x, y) {
		return x - y * parseInt(x / y);
	},
	
	sign: function(x) {
		return x >= 0.0 ? 1.0 : -1.0;
	},
	
	fract: function(x) {
		return x - Math.floor(x);
	},
	
	rsqrt: function(x) {
		return Math.sqrt(1.0 / x);
	},
	
	radius: function(degree) {
		return (degree / 360.0) * (2.0 * Math.PI);
	},
	
	degrees: function(rad) {
		return rad / (2.0 * Math.PI) * 360.0;
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Matrix {
	
	/**
	 * 3DCG用 の4x4行列  (immutable)
	 * 引数は、MATLAB と同じように行で順番に定義していきます。
	 * この理由は、行列を初期化する際に見た目が分かりやすいためです。
	 * 9個の引数なら3x3行列、16個の引数なら4x4行列として扱います。
	 * @param {Number} m00
	 * @param {Number} m01
	 * @param {Number} m02
	 * @param {Number} m03
	 * @param {Number} m10
	 * @param {Number} m11
	 * @param {Number} m12
	 * @param {Number} m13
	 * @param {Number} m20
	 * @param {Number} m21
	 * @param {Number} m22
	 * @param {Number} m23
	 * @param {Number} m30
	 * @param {Number} m31
	 * @param {Number} m32
	 * @param {Number} m33
	 * @returns {S3Matrix}
	 */
	constructor(
		m00, m01, m02, m03,		// row 1
		m10, m11, m12, m13,		// row 2
		m20, m21, m22, m23,		// row 3
		m30, m31, m32, m33 ) {	// row 4
		if(arguments.length === 0) {
			this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;	this.m03 = 0.0;
			this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;	this.m13 = 0.0;
			this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 0.0;
		}
		else if(arguments.length === 9) {
			// 3x3行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = 0.0;
			this.m10 = m03;	this.m11 = m10;	this.m12 = m11;	this.m13 = 0.0;
			this.m20 = m12;	this.m21 = m13;	this.m22 = m20;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 1.0;
		}
		else if(arguments.length === 16) {
			// 4x4行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = m03;
			this.m10 = m10;	this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
			this.m20 = m20;	this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
			this.m30 = m30;	this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	equals(tgt) {
		return (
			S3Math.equals(this.m00, tgt.m00) &&
			S3Math.equals(this.m01, tgt.m01) &&
			S3Math.equals(this.m02, tgt.m02) &&
			S3Math.equals(this.m03, tgt.m03) &&
			S3Math.equals(this.m10, tgt.m10) &&
			S3Math.equals(this.m11, tgt.m11) &&
			S3Math.equals(this.m12, tgt.m12) &&
			S3Math.equals(this.m13, tgt.m13) &&
			S3Math.equals(this.m20, tgt.m20) &&
			S3Math.equals(this.m21, tgt.m21) &&
			S3Math.equals(this.m22, tgt.m22) &&
			S3Math.equals(this.m23, tgt.m23) &&
			S3Math.equals(this.m30, tgt.m30) &&
			S3Math.equals(this.m31, tgt.m31) &&
			S3Math.equals(this.m32, tgt.m32) &&
			S3Math.equals(this.m33, tgt.m33)
		);
	}
	
	clone() {
		return new S3Matrix(
			this.m00, this.m01, this.m02, this.m03,
			this.m10, this.m11, this.m12, this.m13,
			this.m20, this.m21, this.m22, this.m23,
			this.m30, this.m31, this.m32, this.m33
		);
	}
	
	transposed() {
		return new S3Matrix(
			this.m00, this.m10, this.m20, this.m30,
			this.m01, this.m11, this.m21, this.m31,
			this.m02, this.m12, this.m22, this.m32,
			this.m03, this.m13, this.m23, this.m33
		);
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return	isNaN(this.m00) || isNaN(this.m01) || isNaN(this.m02)  || isNaN(this.m03) ||
				isNaN(this.m10) || isNaN(this.m11) || isNaN(this.m12)  || isNaN(this.m13) ||
				isNaN(this.m20) || isNaN(this.m21) || isNaN(this.m22)  || isNaN(this.m23) ||
				isNaN(this.m30) || isNaN(this.m31) || isNaN(this.m32)  || isNaN(this.m33);
	}

	/**
	 * 有限の値であるか確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return	isFinite(this.m00) && isFinite(this.m01) && isFinite(this.m02)  && isFinite(this.m03) ||
				isFinite(this.m10) && isFinite(this.m11) && isFinite(this.m12)  && isFinite(this.m13) ||
				isFinite(this.m20) && isFinite(this.m21) && isFinite(this.m22)  && isFinite(this.m23) ||
				isFinite(this.m30) && isFinite(this.m31) && isFinite(this.m32)  && isFinite(this.m33);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * 掛け算します。
	 * @param {S3Vector|S3Matrix} tgt 行列、縦ベクトル
	 * @returns {S3Vector|S3Matrix}
	 */
	mul(tgt) {
		if(tgt instanceof S3Matrix) {
			const A = this;
			const B = tgt;
			const C = new S3Matrix();
			// 行列クラスのコンストラクタを変更しても問題がないように
			// 後で代入を行っております。
			C.m00 = A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20 + A.m03 * B.m30;
			C.m01 = A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21 + A.m03 * B.m31;
			C.m02 = A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22 + A.m03 * B.m32;
			C.m03 = A.m00 * B.m03 + A.m01 * B.m13 + A.m02 * B.m23 + A.m03 * B.m33;
			C.m10 = A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20 + A.m13 * B.m30;
			C.m11 = A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31;
			C.m12 = A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32;
			C.m13 = A.m10 * B.m03 + A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33;
			C.m20 = A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20 + A.m23 * B.m30;
			C.m21 = A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31;
			C.m22 = A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32;
			C.m23 = A.m20 * B.m03 + A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33;
			C.m30 = A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + A.m33 * B.m30;
			C.m31 = A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31;
			C.m32 = A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32;
			C.m33 = A.m30 * B.m03 + A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33;
			return C;
		}
		else if(tgt instanceof S3Vector) {
			const A = this;
			const v = tgt;
			// 行列×縦ベクトル＝縦ベクトル
			// Av = u なので、各項を行列の行ごとで掛け算する
			return new S3Vector(
				A.m00 * v.x + A.m01 * v.y + A.m02 * v.z + A.m03 * v.w,
				A.m10 * v.x + A.m11 * v.y + A.m12 * v.z + A.m13 * v.w,
				A.m20 * v.x + A.m21 * v.y + A.m22 * v.z + A.m23 * v.w,
				A.m30 * v.x + A.m31 * v.y + A.m32 * v.z + A.m33 * v.w
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	det3() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22;
		out += A.m10 * A.m21 * A.m02;
		out += A.m20 * A.m01 * A.m12;
		out -= A.m00 * A.m21 * A.m12;
		out -= A.m20 * A.m11 * A.m02;
		out -= A.m10 * A.m01 * A.m22;
		return out;
	}
	
	inverse3() {
		const A = this;
		const det = A.det3();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = A.clone();
		B.m00 = (A.m11 * A.m22 - A.m12 * A.m21) * id;
		B.m01 = (A.m02 * A.m21 - A.m01 * A.m22) * id;
		B.m02 = (A.m01 * A.m12 - A.m02 * A.m11) * id;
		B.m10 = (A.m12 * A.m20 - A.m10 * A.m22) * id;
		B.m11 = (A.m00 * A.m22 - A.m02 * A.m20) * id;
		B.m12 = (A.m02 * A.m10 - A.m00 * A.m12) * id;
		B.m20 = (A.m10 * A.m21 - A.m11 * A.m20) * id;
		B.m21 = (A.m01 * A.m20 - A.m00 * A.m21) * id;
		B.m22 = (A.m00 * A.m11 - A.m01 * A.m10) * id;
		return B;
	}
	
	det4() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22 * A.m33;
		out += A.m00 * A.m12 * A.m23 * A.m31;
		out += A.m00 * A.m13 * A.m21 * A.m32;
		out += A.m01 * A.m10 * A.m23 * A.m32;
		out += A.m01 * A.m12 * A.m20 * A.m33;
		out += A.m01 * A.m13 * A.m22 * A.m30;
		out += A.m02 * A.m10 * A.m21 * A.m33;
		out += A.m02 * A.m11 * A.m23 * A.m30;
		out += A.m02 * A.m13 * A.m20 * A.m31;
		out += A.m03 * A.m10 * A.m22 * A.m31;
		out += A.m03 * A.m11 * A.m20 * A.m32;
		out += A.m03 * A.m12 * A.m21 * A.m30;
		out -= A.m00 * A.m11 * A.m23 * A.m32;
		out -= A.m00 * A.m12 * A.m21 * A.m33;
		out -= A.m00 * A.m13 * A.m22 * A.m31;
		out -= A.m01 * A.m10 * A.m22 * A.m33;
		out -= A.m01 * A.m12 * A.m23 * A.m30;
		out -= A.m01 * A.m13 * A.m20 * A.m32;
		out -= A.m02 * A.m10 * A.m23 * A.m31;
		out -= A.m02 * A.m11 * A.m20 * A.m33;
		out -= A.m02 * A.m13 * A.m21 * A.m30;
		out -= A.m03 * A.m10 * A.m21 * A.m32;
		out -= A.m03 * A.m11 * A.m22 * A.m30;
		out -= A.m03 * A.m12 * A.m20 * A.m31;
		return out;
	}
	
	inverse4() {
		const A = this;
		const det = A.det4();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = new S3Matrix();
		B.m00 = (A.m11*A.m22*A.m33 + A.m12*A.m23*A.m31 + A.m13*A.m21*A.m32 - A.m11*A.m23*A.m32 - A.m12*A.m21*A.m33 - A.m13*A.m22*A.m31) * id;
		B.m01 = (A.m01*A.m23*A.m32 + A.m02*A.m21*A.m33 + A.m03*A.m22*A.m31 - A.m01*A.m22*A.m33 - A.m02*A.m23*A.m31 - A.m03*A.m21*A.m32) * id;
		B.m02 = (A.m01*A.m12*A.m33 + A.m02*A.m13*A.m31 + A.m03*A.m11*A.m32 - A.m01*A.m13*A.m32 - A.m02*A.m11*A.m33 - A.m03*A.m12*A.m31) * id;
		B.m03 = (A.m01*A.m13*A.m22 + A.m02*A.m11*A.m23 + A.m03*A.m12*A.m21 - A.m01*A.m12*A.m23 - A.m02*A.m13*A.m21 - A.m03*A.m11*A.m22) * id;
		B.m10 = (A.m10*A.m23*A.m32 + A.m12*A.m20*A.m33 + A.m13*A.m22*A.m30 - A.m10*A.m22*A.m33 - A.m12*A.m23*A.m30 - A.m13*A.m20*A.m32) * id;
		B.m11 = (A.m00*A.m22*A.m33 + A.m02*A.m23*A.m30 + A.m03*A.m20*A.m32 - A.m00*A.m23*A.m32 - A.m02*A.m20*A.m33 - A.m03*A.m22*A.m30) * id;
		B.m12 = (A.m00*A.m13*A.m32 + A.m02*A.m10*A.m33 + A.m03*A.m12*A.m30 - A.m00*A.m12*A.m33 - A.m02*A.m13*A.m30 - A.m03*A.m10*A.m32) * id;
		B.m13 = (A.m00*A.m12*A.m23 + A.m02*A.m13*A.m20 + A.m03*A.m10*A.m22 - A.m00*A.m13*A.m22 - A.m02*A.m10*A.m23 - A.m03*A.m12*A.m20) * id;
		B.m20 = (A.m10*A.m21*A.m33 + A.m11*A.m23*A.m30 + A.m13*A.m20*A.m31 - A.m10*A.m23*A.m31 - A.m11*A.m20*A.m33 - A.m13*A.m21*A.m30) * id;
		B.m21 = (A.m00*A.m23*A.m31 + A.m01*A.m20*A.m33 + A.m03*A.m21*A.m30 - A.m00*A.m21*A.m33 - A.m01*A.m23*A.m30 - A.m03*A.m20*A.m31) * id;
		B.m22 = (A.m00*A.m11*A.m33 + A.m01*A.m13*A.m30 + A.m03*A.m10*A.m31 - A.m00*A.m13*A.m31 - A.m01*A.m10*A.m33 - A.m03*A.m11*A.m30) * id;
		B.m23 = (A.m00*A.m13*A.m21 + A.m01*A.m10*A.m23 + A.m03*A.m11*A.m20 - A.m00*A.m11*A.m23 - A.m01*A.m13*A.m20 - A.m03*A.m10*A.m21) * id;
		B.m30 = (A.m10*A.m22*A.m31 + A.m11*A.m20*A.m32 + A.m12*A.m21*A.m30 - A.m10*A.m21*A.m32 - A.m11*A.m22*A.m30 - A.m12*A.m20*A.m31) * id;
		B.m31 = (A.m00*A.m21*A.m32 + A.m01*A.m22*A.m30 + A.m02*A.m20*A.m31 - A.m00*A.m22*A.m31 - A.m01*A.m20*A.m32 - A.m02*A.m21*A.m30) * id;
		B.m32 = (A.m00*A.m12*A.m31 + A.m01*A.m10*A.m32 + A.m02*A.m11*A.m30 - A.m00*A.m11*A.m32 - A.m01*A.m12*A.m30 - A.m02*A.m10*A.m31) * id;
		B.m33 = (A.m00*A.m11*A.m22 + A.m01*A.m12*A.m20 + A.m02*A.m10*A.m21 - A.m00*A.m12*A.m21 - A.m01*A.m10*A.m22 - A.m02*A.m11*A.m20) * id;
		return B;
	}
	
	toString() {
		return "[" +
		"[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n" + 
		" [" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + 
		" [" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + 
		" [" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]]";
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.m00]);
		}
		else if(dimension === 4) {
			return new Instance(
				[   this.m00, this.m10, 
					this.m01, this.m11]);
		}
		else if(dimension === 9) {
			return new Instance(
				[   this.m00, this.m10, this.m20,
					this.m01, this.m11, this.m21,
					this.m02, this.m12, this.m22]);
		}
		else {
			return new Instance(
				[   this.m00, this.m10, this.m20, this.m30,
					this.m01, this.m11, this.m21, this.m31,
					this.m02, this.m12, this.m22, this.m32,
					this.m03, this.m13, this.m23, this.m33]);
		}
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Vector {
	
	/**
	 * 3DCG用 のベクトルクラス (immutable)
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param {Number} w (遠近除算用のため掛け算以外で使用されません)
	 * @returns {S3Vector}
	 */
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		if(z === undefined) {
			this.z = 0.0;
		}
		else {
			this.z = z;
		}
		if(w === undefined) {
			this.w = 1.0;
		}
		else {
			this.w = w;
		}
	}
	
	clone() {
		return new S3Vector(this.x, this.y, this.z, this.w);
	}
	
	negate() {
		return new S3Vector(-this.x, -this.y, -this.z, this.w);
	}
	
	cross(tgt) {
		return new S3Vector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x,
			1.0
		);
	}
	
	dot(tgt) {
		return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
	}
	
	add(tgt) {
		return new S3Vector(
			this.x + tgt.x,
			this.y + tgt.y,
			this.z + tgt.z,
			1.0
		);
	}
	
	sub(tgt) {
		return new S3Vector(
			this.x - tgt.x,
			this.y - tgt.y,
			this.z - tgt.z,
			1.0
		);
	}
	
	mul(tgt) {
		if(tgt instanceof S3Vector) {
			return new S3Vector(
				this.x * tgt.x,
				this.y * tgt.y,
				this.z * tgt.z,
				1.0
			);
		}
		else if(tgt instanceof S3Matrix) {
			// 横ベクトル×行列＝横ベクトル
			const v = this;
			const A = tgt;
			// vA = u なので、各項を行列の列ごとで掛け算する
			return new S3Vector(
				v.x * A.m00 + v.y * A.m10 + v.z * A.m20 + v.w * A.m30,
				v.x * A.m01 + v.y * A.m11 + v.z * A.m21 + v.w * A.m31,
				v.x * A.m02 + v.y * A.m12 + v.z * A.m22 + v.w * A.m32,
				v.x * A.m03 + v.y * A.m13 + v.z * A.m23 + v.w * A.m33
			);
		}
		else if(typeof tgt === "number") {
			return new S3Vector(
				this.x * tgt,
				this.y * tgt,
				this.z * tgt,
				1.0
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setX(x) {
		return new S3Vector(x, this.y, this.z, this.w);
	}
	
	setY(y) {
		return new S3Vector(this.x, y, this.z, this.w);
	}
	
	setZ(z) {
		return new S3Vector(this.x, this.y, z, this.w);
	}
	
	setW(w) {
		return new S3Vector(this.x, this.y, this.z, w);
	}
	
	max(tgt) {
		return new S3Vector(
			Math.max(this.x, tgt.x),
			Math.max(this.y, tgt.y),
			Math.max(this.z, tgt.z),
			Math.max(this.w, tgt.w)
		);
	}
	
	min(tgt) {
		return new S3Vector(
			Math.min(this.x, tgt.x),
			Math.min(this.y, tgt.y),
			Math.min(this.z, tgt.z),
			Math.min(this.w, tgt.w)
		);
	}

	equals(tgt) {
		return (
			S3Math.equals(this.x, tgt.x) &&
			S3Math.equals(this.y, tgt.y) &&
			S3Math.equals(this.z, tgt.z) &&
			S3Math.equals(this.w, tgt.w)
		);
	}
	
	mix(tgt, alpha) {
		return new S3Vector(
			S3Math.mix(this.x, tgt.x, alpha),
			S3Math.mix(this.y, tgt.y, alpha),
			S3Math.mix(this.z, tgt.z, alpha),
			S3Math.mix(this.w, tgt.w, alpha)
		);
	}
	
	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	
	normFast() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	
	normalize() {
		let b = this.normFast();
		if(b === 0.0) {
			throw "divide error";
		}
		b = Math.sqrt(1.0 / b);
		return new S3Vector(
			this.x * b,
			this.y * b,
			this.z * b,
			1.0
		);
	}
	
	toString(num) {
		if(num === 1) {
			return "[" + this.x + "]T";
		}
		else if(num === 2) {
			return "[" + this.x + "," + this.y + "]T";
		}
		else if(num === 3) {
			return "[" + this.x + "," + this.y + "," + this.z + "]T";
		}
		else {
			return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
		}
	}
	
	toHash(num) {
		const s = 4;
		const t = 10000;
		let x = (parseFloat(this.x.toExponential(3).substring(0,5)) * 321) & 0xFFFFFFFF;
		if(num >= 2) {
			x = (x * 12345 + parseFloat(this.y.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 3) {
			x = (x * 12345 + parseFloat(this.z.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 4) {
			x = (x * 12345 + parseFloat(this.w.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		return x;
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.x]);
		}
		else if(dimension === 2) {
			return new Instance([this.x, this.y]);
		}
		else if(dimension === 3) {
			return new Instance([this.x, this.y, this.z]);
		}
		else {
			return new Instance([this.x, this.y, this.z, this.w]);
		}
	}
	
	pushed(array, num) {
		if(num === 1) {
			array.push(this.x);
		}
		else if(num === 2) {
			array.push(this.x);
			array.push(this.y);
		}
		else if(num === 3) {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
		}
		else {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
			array.push(this.w);
		}
	}

	/**
	 * tgt への方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirection(tgt) {
		return tgt.sub(this);
	}

	/**
	 * tgt への正規方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirectionNormalized(tgt) {
		return tgt.sub(this).normalize();
	}

	/**
	 * 指定した位置までの距離を取得する
	 * @param {S3Vector} tgt
	 * @returns {Number}
	 */
	getDistance(tgt) {
		return this.getDirection(tgt).norm();
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z)  || isNaN(this.w);
	}

	/**
	 * 有限の値か確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * A, B, C の3点を通る平面の法線と、UV座標による接線、従法線を求めます。
	 * A, B, C の3点の時計回りが表だとした場合、表方向へ延びる法線となります。
	 * @param {S3Vector} posA
	 * @param {S3Vector} posB
	 * @param {S3Vector} posC
	 * @param {S3Vector} uvA
	 * @param {S3Vector} uvB
	 * @param {S3Vector} uvC
	 * @returns {Object}
	 */
	static getNormalVector(posA, posB, posC, uvA, uvB, uvC) {
		let N;

		while(1) {
			const P0 = posA.getDirection(posB);
			const P1 = posA.getDirection(posC);
			try {
				N = (P0.cross(P1)).normalize();
			}
			catch (e) {
				// 頂点の位置が直行しているなどのエラー処理
				N = new S3Vector(0.3333, 0.3333, 0.3333);
				break;
			}
			if((uvA === null) | (uvB === null) | (uvC === null)) {
				// UV値がない場合はノーマルのみ返す
				break;
			}
			// 接線と従法線を計算するにあたり、以下のサイトを参考にしました。
			// http://sunandblackcat.com/tipFullView.php?l=eng&topicid=8
			// https://stackoverflow.com/questions/5255806/how-to-calculate-tangent-and-binormal
			// http://www.terathon.com/code/tangent.html
			const st0 = uvA.getDirection(uvB);
			const st1 = uvA.getDirection(uvC);
			let q;
			try {
				// 接線と従法線を求める
				q = 1.0 / ((st0.cross(st1)).z);
				const T = new S3Vector(); // Tangent	接線
				const B = new S3Vector(); // Binormal	従法線
				T.x = q * (  st1.y * P0.x - st0.y * P1.x);
				T.y = q * (  st1.y * P0.y - st0.y * P1.y);
				T.z = q * (  st1.y * P0.z - st0.y * P1.z);
				B.x = q * ( -st1.x * P0.x + st0.x * P1.x);
				B.y = q * ( -st1.x * P0.y + st0.x * P1.y);
				B.z = q * ( -st1.x * P0.z + st0.x * P1.z);
				return {
					normal		: N,
					tangent		: T.normalize(),
					binormal	: B.normalize()
				};
				/*
				// 接線と従法線は直行していない
				// 直行している方が行列として安定している。
				// 以下、Gram-Schmidtアルゴリズムで直行したベクトルを作成する場合
				const nT = T.sub(N.mul(N.dot(T))).normalize();
				const w  = N.cross(T).dot(B) < 0.0 ? -1.0 : 1.0;
				const nB = N.cross(nT).mul(w);
				return {
					normal		: N,
					tangent		: nT,
					binormal	: nB
				}
				*/
			}
			catch (e) {
				break;
			}
		}
		return {
			normal		: N,
			tangent		: null,
			binormal	: null
		};
	}
	
	/**
	 * A, B, C の3点が時計回りなら true をかえす。
	 * 時計回りでも反時計回りでもないと null を返す
	 * @param {S3Vector} A
	 * @param {S3Vector} B
	 * @param {S3Vector} C
	 * @returns {Boolean}
	 */
	static isClockwise(A, B, C) {
		const v1 = A.getDirection(B).setZ(0);
		const v2 = A.getDirection(C).setZ(0);
		const type = v1.cross(v2).z;
		if(type === 0) {
			return null;
		}
		else if(type > 0) {
			return true;
		}
		else {
			return false;
		}
	}

}

/**
 * 0
 * @type S3Vector
 */
S3Vector.ZERO = new S3Vector(0.0, 0.0, 0.0);

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Camera {

	/**
	 * カメラ (mutable)
	 * @param {type} s3system
	 * @returns {S3Camera}
	 */
	constructor(s3system) {
		this.sys = s3system;
		this.init();
	}

	dispose() {
		this.sys		= null;
		this.fovY		= 0;
		this.eye		= null;
		this.at			= null;
		this.near		= 0;
		this.far		= 0;
	}
	
	init() {
		this.fovY		= 45;
		this.eye		= new S3Vector(0, 0, 0);
		this.at			= new S3Vector(0, 0, 1);
		this.near		= 1;
		this.far		= 1000;
	}
	
	clone() {
		const camera = new S3Camera(this.sys);
		camera.fovY		= this.fovY;
		camera.eye		= this.eye;
		camera.at		= this.at;
		camera.near		= this.near;
		camera.far		= this.far;
		return camera;
	}
	
	getVPSMatrix(canvas) {
		const x = S3System.calcAspect(canvas.width, canvas.height);
		// ビューイング変換行列を作成する
		const V = this.sys.getMatrixLookAt(this.eye, this.at);
		// 射影トランスフォーム行列
		const P = this.sys.getMatrixPerspectiveFov(this.fovY, x, this.near, this.far );
		// ビューポート行列
		const S = this.sys.getMatrixViewport(0, 0, canvas.width, canvas.height);
		return { LookAt : V, aspect : x, PerspectiveFov : P, Viewport : S };
	}
	
	setDrawRange(near, far) {
		this.near	= near;
		this.far	= far;
	}
	
	setFovY(fovY) {
		this.fovY = fovY;
	}
	
	setEye(eye) {
		this.eye = eye.clone();
	}
	
	setCenter(at) {
		this.at = at.clone();
	}
	
	getDirection() {
		return this.eye.getDirectionNormalized(this.at);
	}
	
	getDistance() {
		return this.at.getDistance(this.eye);
	}
	
	setDistance(distance) {
		const direction = this.at.getDirectionNormalized(this.eye);
		this.eye = this.at.add(direction.mul(distance));
	}
	
	getRotateY() {
		const ray = this.at.getDirection(this.eye);
		return S3Math.degrees(Math.atan2(ray.x, ray.z));
	}
	
	setRotateY(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.at.getDirection(this.eye);
		const length = ray.setY(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.at.x + length * sin,
			this.eye.y,
			this.at.z + length * cos
		);
	}
	
	addRotateY(deg) {
		this.setRotateY(this.getRotateY() + deg);
	}
	
	getRotateX() {
		const ray = this.at.getDirection(this.eye);
		return S3Math.degrees(Math.atan2( ray.z, ray.y ));
	}
	
	setRotateX(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.at.getDirection(this.eye);
		const length = ray.setX(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.eye.x,
			this.at.y + length * cos,
			this.at.z + length * sin
		);
	}
	
	addRotateX(deg) {
		this.setRotateX(this.getRotateX() + deg);
	}
	
	translateAbsolute(v) {
		this.eye	= this.eye.add(v);
		this.at	= this.at.add(v);
	}
	
	translateRelative(v) {
		let X, Y, Z;
		const up = new S3Vector(0.0, 1.0, 0.0);
		// Z ベクトルの作成
		Z = this.eye.getDirectionNormalized(this.at);
		
		// 座標系に合わせて計算
		if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		X = up.cross(Z).normalize();
		Y = Z.cross(X);
		// 移動
		X = X.mul(v.x);
		Y = Y.mul(v.y);
		Z = Z.mul(v.z);
		this.translateAbsolute(X.add(Y).add(Z));
	}
	
	toString() {
		return "camera[\n" +
				"eye  :" + this.eye		+ ",\n" +
				"at   :" + this.at		+ ",\n" +
				"fovY :" + this.fovY 	+ "]";
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Light {
	
	constructor() {
		this.init();
	}
	
	init() {
		this.mode		= S3Light.MODE.DIRECTIONAL_LIGHT;
		this.power		= 1.0;
		this.range		= 1000.0;
		this.position	= new S3Vector(0.0, 0.0, 0.0);
		this.direction	= new S3Vector(0.0, 0.0, -1.0);
		this.color		= new S3Vector(1.0, 1.0, 1.0);
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Light;
		}
		const light = new Instance();
		light.mode		= this.mode;
		light.power		= this.power;
		light.range		= this.range;
		light.position	= this.position;
		light.direction	= this.direction;
		light.color		= this.color;
		return light;
	}
	
	setMode(mode) {
		this.mode = mode;
	}
	
	setPower(power) {
		this.power = power;
	}
	
	setRange(range) {
		this.range = range;
	}
	
	setPosition(position) {
		this.position = position;
	}
	
	setDirection(direction) {
		this.direction = direction;
	}
	
	setColor(color) {
		this.color = color;
	}
}

S3Light.MODE = {
	NONE				: 0,
	AMBIENT_LIGHT		: 1,
	DIRECTIONAL_LIGHT	: 2,
	POINT_LIGHT			: 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Material {

	/**
	 * 素材 (mutable)
	 * @param {S3Material} type
	 * @param {S3Material} name
	 * @returns {S3Material}
	 */
	constructor(s3system, name) {
		this.sys		= s3system;
		this.name		= "s3default";
		if(name !== undefined) {
			this.name = name;
		}
		this.color		= new S3Vector(1.0, 1.0, 1.0, 1.0);	// 拡散反射の色
		this.diffuse	= 0.8;								// 拡散反射の強さ
		this.emission	= new S3Vector(0.0, 0.0, 0.0);		// 自己照明（輝き）
		this.specular	= new S3Vector(0.0, 0.0, 0.0);		// 鏡面反射の色
		this.power		= 5.0;								// 鏡面反射の強さ
		this.ambient	= new S3Vector(0.6, 0.6, 0.6);		// 光によらない初期色
		this.reflect	= 0.0;								// 環境マッピングによる反射の強さ
		this.textureColor	= this.sys.createTexture();
		this.textureNormal	= this.sys.createTexture();
	}

	dispose() {
	}
	
	setName(name) {
		this.name = name;
	}
	
	setColor(color) {
		this.color = this.sys._toVector3(color);
	}
	
	setDiffuse(diffuse) {
		this.diffuse = this.sys._toValue(diffuse);
	}
	
	setEmission(emission) {
		this.emission = this.sys._toVector3(emission);
	}
	
	setSpecular(specular) {
		this.specular = this.sys._toVector3(specular);
	}
	
	setPower(power) {
		this.power = this.sys._toValue(power);
	}
	
	setAmbient(ambient) {
		this.ambient = this.sys._toVector3(ambient);
	}
	
	setReflect(reflect) {
		this.reflect = this.sys._toValue(reflect);
	}
	
	setTextureColor(data) {
		if(this.textureColor !== null) {
			this.textureColor.dispose();
		}
		this.textureColor = this.sys.createTexture();
		this.textureColor.setImage(data);
	}
	
	setTextureNormal(data) {
		if(this.textureNormal !== null) {
			this.textureNormal.dispose();
		}
		this.textureNormal = this.sys.createTexture();
		this.textureNormal.setImage(data);
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Vertex {
	
	/**
	 * 頂点 (immutable)
	 * @param {S3Vector} position 座標
	 * @returns {S3Vertex}
	 */
	constructor(position) {
		this.position	= position;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Vertex;
		}
		return new Instance(this.position);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3TriangleIndex {

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex
	 * @param {Array} uvlist S3Vector Array
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this._init(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex 負の場合や未定義の場合は 0 とします。
	 * @param {Array} uvlist S3Vector Array
	 */
	_init(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this.index				= null;		// 各頂点を示すインデックスリスト
		this.uv					= null;		// 各頂点のUV座標
		this.materialIndex		= null;		// 面の材質
		if((indexlist instanceof Array) && (indexlist.length > 0)) {
			this.index = [indexlist[i1], indexlist[i2], indexlist[i3]];
		}
		else {
			throw "IllegalArgumentException";
		}
		if((uvlist !== undefined) && (uvlist instanceof Array) && (uvlist.length > 0) && (uvlist[0] instanceof S3Vector)) {
			this.uv = [uvlist[i1], uvlist[i2], uvlist[i3]];
		}
		else {
			this.uv = [null, null, null];
		}
		materialIndex = materialIndex      ? materialIndex : 0;
		materialIndex = materialIndex >= 0 ? materialIndex : 0;
		this.materialIndex = materialIndex;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 0, 1, 2, this.index, this.materialIndex, this.uv );
	}
	
	inverseTriangle(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 2, 1, 0, this.index, this.materialIndex, this.uv );
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Mesh {
	
	/**
	 * 立体物 (mutable)
	 * @param {S3System} sys
	 * @returns {S3Mesh}
	 */
	constructor(sys) {
		this.sys = sys;
		this._init();
	}
	
	_init() {
		// 変数の準備
		this.src = {};
		this.src.vertex			= [];
		this.src.triangleindex	= [];
		this.src.material		= [];
		this.is_complete	= false;
	}
	
	isComplete() {
		return this.is_complete;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Mesh;
		}
		const mesh = new Instance(this.sys);
		mesh.addVertex(this.getVertexArray());
		mesh.addTriangleIndex(this.getTriangleIndexArray());
		mesh.addMaterial(this.getMaterialArray());
		return mesh;
	}
	
	setComplete(is_complete) {
		this.is_complete = is_complete;
	}
	
	setInverseTriangle(inverse) {
		this.setComplete(false);
		this.is_inverse = inverse; 
	}
	
	getVertexArray() {
		return this.src.vertex;
	}
	
	getTriangleIndexArray() {
		return this.src.triangleindex;
	}
	
	getMaterialArray() {
		return this.src.material;
	}
	
	addVertex(vertex) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshvertex = this.getVertexArray(); 
		if(vertex === undefined) ;
		else if(vertex instanceof S3Vertex) {
			meshvertex[meshvertex.length] = vertex;
		}
		else {
			for(let i = 0; i < vertex.length; i++) {
				meshvertex[meshvertex.length] = vertex[i];
			}
		}
	}
	
	addTriangleIndex(ti) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshtri = this.getTriangleIndexArray();
		if(ti === undefined) ;
		else if(ti instanceof S3TriangleIndex) {
			meshtri[meshtri.length] = this.is_inverse ? ti.inverseTriangle() : ti;
		}
		else {
			for(let i = 0; i < ti.length; i++) {
				meshtri[meshtri.length] = this.is_inverse ? ti[i].inverseTriangle() : ti[i];
			}
		}
	}
	
	addMaterial(material) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshmat = this.getMaterialArray();
		if(material === undefined) ;
		else if(material instanceof S3Material) {
			meshmat[meshmat.length] = material;
		}
		else {
			for(let i = 0; i < material.length; i++) {
				meshmat[meshmat.length] = material[i];
			}
		}
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Angles {
	
	/**
	 * 3DCG用 のオイラー角 (immutable)
	 * @param {Number} z ロール
	 * @param {Number} x ピッチ
	 * @param {Number} y ヨー
	 * @returns {S3Angle}
	 */
	constructor(z, x, y) {
		this.setRotateZXY(z, x, y);
	}

	static _toPeriodicAngle(x) {
		if(x > S3Angles.PI) {
			return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
		}
		else if(x < -S3Angles.PI) {
			return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
		}
		return x;
	}

	clone() {
		return new S3Angles(this.roll, this.pitch, this.yaw);
	}

	setRotateZXY(z, x, y) {
		this.roll	= S3Angles._toPeriodicAngle(isNaN(z) ? 0.0 : z);
		this.pitch	= S3Angles._toPeriodicAngle(isNaN(x) ? 0.0 : x);
		this.yaw	= S3Angles._toPeriodicAngle(isNaN(y) ? 0.0 : y);
	}

	addRotateX(x) {
		return new S3Angles(this.roll, this.pitch + x, this.yaw);
	}

	addRotateY(y) {
		return new S3Angles(this.roll, this.pitch, this.yaw + y);
	}

	addRotateZ(z) {
		return new S3Angles(this.roll + z, this.pitch, this.yaw);
	}

	setRotateX(x) {
		return new S3Angles(this.roll, x, this.yaw);
	}

	setRotateY(y) {
		return new S3Angles(this.roll, this.pitch, y);
	}

	setRotateZ(z) {
		return new S3Angles(z, this.pitch, this.yaw);
	}

	toString() {
		return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
	}

}

S3Angles.PI		= 180.0;
S3Angles.PIOVER2= S3Angles.PI / 2.0;
S3Angles.PILOCK	= S3Angles.PIOVER2 - 0.0001;
S3Angles.PI2	= 2.0 * S3Angles.PI;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Model {
	
	/**
	* 色々な情報をいれたモデル (mutable)
	* @returns {S3Model}
	*/
	constructor() {
		this._init();
	}
		
	_init() {
		this.angles			= new S3Angles();
		this.scale			= new S3Vector(1, 1, 1);
		this.position		= new S3Vector(0, 0, 0);
		this.mesh			= new S3Mesh();
	}
	
	setMesh(mesh) {
		this.mesh			= mesh;
	}
	
	getMesh() {
		return this.mesh;
	}
	
	setScale(x, y, z) {
		if(arguments.length === 1) {
			if(typeof x === "number"){
				this.scale = new S3Vector(x, x, x);
			}
			else if(x instanceof S3Vector){
				this.scale = x;
			}
		}
		else {
			this.scale = new S3Vector(x, y, z);
		}
	}
	
	getScale() {
		return this.scale;
	}
	
	setPosition(x, y, z) {
		if((arguments.length === 1) && (x instanceof S3Vector)){
			this.position = x;
		}
		else {
			this.position = new S3Vector(x, y, z);
		}
	}
	
	getPosition() {
		return this.position;
	}
	
	getAngle() {
		return this.angles;
	}
	
	setAngle(angles) {
		this.angles = angles;
	}
	
	addRotateX(x) {
		this.angles = this.angles.addRotateX(x);
	}
	
	addRotateY(y) {
		this.angles = this.angles.addRotateY(y);
	}
	
	addRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
	setRotateX(x) {
		this.angles = this.angles.setRotateX(x);
	}
	
	setRotateY(y) {
		this.angles = this.angles.setRotateY(y);
	}
	
	setRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Scene {
	
	/**
	 * 描写するときのシーン (mutable)
	 * @returns {S3Scene}
	 */
	constructor() {
		this._init();
	}
	
	_init() {
		this.camera		= new S3Camera();
		this.model		= [];
		this.light		= [];
	}
	
	empty() {
		this.model		= [];
		this.light		= [];
	}
	
	setCamera(camera) {
		this.camera = camera.clone();
	}
	
	addModel(model) {
		this.model[this.model.length] = model;
	}
	
	addLight(light) {
		this.light[this.light.length] = light;
	}
	
	getCamera() {
		return this.camera;
	}
	
	getModels() {
		return this.model;
	}
	
	getLights() {
		return this.light;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Texture {
	
	constructor(s3system, data) {
		this.sys	= s3system;
		this._init();
		if(data !== undefined) {
			this.setImage(data);
		}
	}
	
	_init() {
		this.url			= null;
		this.image			= null;
		this.is_loadimage	= false;
		this.is_dispose		= false;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
		}
	}
	
	setImage(image) {
		if((image === null) || this.is_dispose){
			return;
		}
		if(	(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement)) {
			const original_width  = image.width;
			const original_height = image.height;
			const ceil_power_of_2 = function(x) {
				// IE には Math.log2 がない
				const a = Math.log(x) / Math.log(2);
				if ((a - Math.floor(a)) < 1e-10) {
					return x;
				}
				else {
					return 1 << Math.ceil(a);
				}
			};
			const ceil_width  = ceil_power_of_2(original_width);
			const ceil_height = ceil_power_of_2(original_height);
			if((original_width !== ceil_width) || (original_height !== ceil_height)) {
				// 2の累乗ではない場合は、2の累乗のサイズに変換
				const ceil_image = document.createElement("canvas");
				ceil_image.width	= ceil_width;
				ceil_image.height	= ceil_height;
				ceil_image.getContext("2d").drawImage(
					image,
					0, 0, original_width, original_height,
					0, 0, ceil_width, ceil_height
				);
				image = ceil_image;
			} 
		}
		if(	(image instanceof ImageData) ||
			(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement) ||
			(image instanceof HTMLVideoElement)) {
			if(this.url === null) {
				// 直接設定した場合はIDをURLとして設定する
				this.url		= this.sys._createID();
			}
			this.image			= image;
			this.is_loadimage	= true;
			return;
		}
		else if((typeof image === "string")||(image instanceof String)) {
			this.url = image;
			const that = this;
			this.sys._download(this.url, function (image){
				that.setImage(image);
			});
			return;
		}
		else {
			console.log("not setImage");
			console.log(image);
		}
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */


/**
 * /////////////////////////////////////////////////////////
 * 描写に使用するシーンを構成するクラス群
 * 
 * ポリゴン情報を構成部品
 * S3Vertex			頂点
 * S3Material		素材
 * S3TriangleIndex	インデックス
 * S3Mesh			頂点とインデックス情報と素材からなるメッシュ
 * 
 * ポリゴンの描写用構成部品
 * S3Model			どの座標にどのように表示するかモデル
 * S3Camera			映像をどのように映すか
 * S3Scene			モデルとカメラを使用してシーン
 * 
 * /////////////////////////////////////////////////////////
 */

class S3System {
	
	/**
	 * S3System
	 * 3DCGを作成するための行列を準備したり、シーンの描写をしたりする
	 * 
	 * 3DCGを作るうえで必要最小限の機能を提供する
	 * ・それらを構成する頂点、材質、面（全てimmutable）
	 * ・モデル (mutable)
	 * ・カメラ (mutable)
	 * ・シーン (mutable)
	 * ・描写用の行列作成
	 * ・描写のための必要最低限の計算
	 */
	constructor() {
		this._init();
	}

	_init() {
		this.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
		this.setBackgroundColor(new S3Vector(1.0, 1.0, 1.0, 1.0));
	}

	_createID() {
		if(typeof this._CREATE_ID1 === "undefined") {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2 = 0;
			this._CREATE_ID3 = 0;
			this._CREATE_ID4 = 0;
		}
		const id = ""+
			this._CREATE_ID4.toString(16)+":"+
			this._CREATE_ID3.toString(16)+":"+
			this._CREATE_ID2.toString(16)+":"+
			this._CREATE_ID1.toString(16);
		this._CREATE_ID1++;
		if(this._CREATE_ID1 === 0x100000000) {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2++;
			if(this._CREATE_ID2 === 0x100000000) {
				this._CREATE_ID2 = 0;
				this._CREATE_ID3++;
				if(this._CREATE_ID3 === 0x100000000) {
					this._CREATE_ID3 = 0;
					this._CREATE_ID4++;
					if(this._CREATE_ID4 === 0x100000000) {
						this._CREATE_ID4 = 0;
						throw "createID";
					}
				}
			}
		}
		return id;
	}
	
	_download(url, callback) {
		const dotlist = url.split(".");
		let isImage = false;
		const ext = "";
		if(dotlist.length > 1) {
			const ext = dotlist[dotlist.length - 1].toLocaleString();
			isImage = (ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg");
		}
		if(isImage) {
			const image = new Image();
			image.onload = function() {
				callback(image, ext);
			};
			image.src = url;
			return;
		}
		const http = new XMLHttpRequest();
		const handleHttpResponse = function (){
			if(http.readyState === 4) { // DONE
				if(http.status !== 200) {
					console.log("error download [" + url + "]");
					return(null);
				}
				callback(http.responseText, ext);
			}
		};
		http.onreadystatechange = handleHttpResponse;
		http.open("GET", url, true);
		http.send(null);
	}
	
	_toVector3(x) {
		if(x instanceof S3Vector) {
			return x;
		}
		else if(!isNaN(x)) {
			return new S3Vector(x, x, x);
		}
		else if(x instanceof Array) {
			return new S3Vector(x[0], x[1], x[2]);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	_toValue(x) {
		if(!isNaN(x)) {
			return x;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setBackgroundColor(color) {
		this.backgroundColor = color;
	}
	
	getBackgroundColor() {
		return this.backgroundColor;
	}
	
	setSystemMode(mode) {
		this.systemmode = mode;
		if(this.systemmode === S3System.SYSTEM_MODE.OPEN_GL) {
			this.depthmode		= S3System.DEPTH_MODE.OPEN_GL;
			this.dimensionmode	= S3System.DIMENSION_MODE.RIGHT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR4x1;
			this.frontface		= S3System.FRONT_FACE.COUNTER_CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
		else {
			this.depthmode		= S3System.DEPTH_MODE.DIRECT_X;
			this.dimensionmode	= S3System.DIMENSION_MODE.LEFT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR1x4;
			this.frontface		= S3System.FRONT_FACE.CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
	}
	
	/**
	 * ビューポート行列を作成する際に、Z値の範囲の範囲をどうするか
	 * @param {S3System.DEPTH_MODE} depthmode
	 * @returns {undefined}
	 */
	setDepthMode(depthmode) {
		this.depthmode = depthmode;
	}
	
	/**
	 * 座標軸について左手系か、右手系か
	 * @param {S3System.DIMENSION_MODE} dimensionmode
	 * @returns {undefined}
	 */
	setDimensionMode(dimensionmode) {
		this.dimensionmode = dimensionmode;
	}
	
	/**
	 * N次元の座標について、横ベクトルか、縦ベクトル、どちらで管理するか
	 * @param {S3System.VECTOR_MODE} vectormode
	 * @returns {undefined}
	 */
	setVectorMode(vectormode) {
		this.vectormode = vectormode;
	}
	
	/**
	 * どのようなポリゴンの頂点の順序を表として定義するか
	 * @param {S3System.FRONT_FACE} frontface
	 * @returns {undefined}
	 */
	setFrontMode(frontface) {
		this.frontface = frontface;
	}
	
	/**
	 * どの方向を描写しないかを設定する。
	 * @param {S3System.CULL_MODE} cullmode
	 * @returns {undefined}
	 */
	setCullMode(cullmode) {
		this.cullmode = cullmode;
	}
	
	setCanvas(canvas) {
		const that		= this;
		const ctx			= canvas.getContext("2d");
		this.canvas		= canvas;
		this.context2d = {
			context : ctx,
			drawLine : function(v0, v1) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.stroke();
			},
			drawLinePolygon : function(v0, v1, v2) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.lineTo( v2.x, v2.y );
				ctx.closePath();
				ctx.stroke();
			},
			setLineWidth : function(width) {
				ctx.lineWidth = width;
			},
			setLineColor : function(color) {
				ctx.strokeStyle = color;
			},
			clear : function() {
				const color = that.getBackgroundColor();
				ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
				ctx.fillStyle = "rgba(" + color.x * 255 + "," + color.y * 255 + "," + color.z * 255 + "," + color.w + ")";
				ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);
			}
		};
	}
	
	/**
	 * カリングのテストをする
	 * @param {S3Vector} p1
	 * @param {S3Vector} p2
	 * @param {S3Vector} p3
	 * @returns {Boolean} true で描写しない
	 */
	testCull(p1, p2, p3) {
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			return false;
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			return true;
		}
		const isclock = S3Vector.isClockwise(p1, p2, p3);
		if(isclock === null) {
			return true;
		}
		else if(!isclock) {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode !== S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode !== S3System.CULL_MODE.FRONT;
			}
		}
		else {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode === S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode === S3System.CULL_MODE.FRONT;
			}
		}
	}
	
	/**
	 * ビューポート行列を作成する
	 * @param {Number} x 描写する左上の座標X
	 * @param {Number} y 描写する左上の座標Y
	 * @param {Number} Width 描写幅
	 * @param {Number} Height 描写幅
	 * @param {Number} MinZ 深度値の変換
	 * @param {Number} MaxZ 深度値の変換
	 * @returns {S3Matrix}
	 */
	getMatrixViewport(x, y, Width, Height, MinZ, MaxZ) {
		if(MinZ === undefined) {
			MinZ = 0.0;
		}
		if(MaxZ === undefined) {
			MaxZ = 1.0;
		}
		// M.m11 は、DirectXだとマイナス、OpenGLだとプラスである
		// 今回は、下がプラスであるcanvasに表示させることを考えて、マイナスにしてある。
		const M = new S3Matrix();
		M.m00 =  Width/2; M.m01 =       0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =      0.0; M.m11 = -Height/2; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =      0.0; M.m21 =       0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =x+Width/2; M.m31 =y+Height/2; M.m32 = 0.0; M.m33 = 1.0;
		
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = MinZ - MaxZ;
			M.m32 = MinZ;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (MinZ - MaxZ) / 2;
			M.m32 = (MinZ + MaxZ) / 2;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 視体積の上下方向の視野角を求める
	 * @param {Number} zoomY
	 * @returns {Number}
	 */
	static calcFovY(zoomY) {
		return(2.0 * Math.atan(1.0 / zoomY));
	}
	
	/**
	 * アスペクト比を求める
	 * @param {Number} width
	 * @param {Number} height
	 * @returns {Number}
	 */
	static calcAspect(width, height) {
		return(width / height);
	}
	
	/**
	 * パースペクティブ射影行列を作成する
	 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
	 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
	 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
	 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
	 * @returns {S3Matrix}
	 */
	getMatrixPerspectiveFov(fovY, Aspect, Near, Far) {
		const arc = S3Math.radius(fovY);
		const zoomY = 1.0 / Math.tan(arc / 2.0);
		const zoomX = zoomY / Aspect;
		const M = new S3Matrix();
		M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 0.0;
		const Delta = Far - Near;
		if(Near > Far) {
			throw "Near > Far error";
		}
		else if(Delta === 0.0) {
			throw "divide error";
		}
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = Far / Delta;
			M.m32 = - Far * Near / Delta;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (Far + Near) / Delta;
			M.m32 = - 2.0 * Far * Near / Delta;
		}
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			M.m22 = - M.m22;
			M.m23 = - M.m23;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * ビュートランスフォーム行列を作成する
	 * @param {S3Vector} eye カメラの座標の位置ベクトル
	 * @param {S3Vector} at カメラの注視点の位置ベクトル
	 * @param {S3Vector} up カメラの上への方向ベクトル
	 * @returns {S3Matrix}
	 */
	getMatrixLookAt(eye, at, up) {
		if(up === undefined) {
			up = new S3Vector(0.0, 1.0, 0.0);
		}
		// Z ベクトルの作成
		let Z = eye.getDirectionNormalized(at);
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		const X = up.cross(Z).normalize();
		const Y = Z.cross(X);
		const M = new S3Matrix();
		M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
		M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
		M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
		M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 単位行列を作成します。
	 * @returns {S3Matrix}
	 */
	getMatrixIdentity() {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return M;
	}
	
	/**
	 * 平行移動行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixTranslate(x, y, z) {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 拡大縮小行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixScale(x, y, z) {
		const M = new S3Matrix();
		M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * X軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateX(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * Y軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateY(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * Z軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZ(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * 縦型、横型を踏まえて掛け算します。
	 * @param {S3Matrix} A
	 * @param {S3Matrix|S3Vector} B
	 * @returns {S3Matrix|S3Vector}
	 */
	mulMatrix(A, B) {
		if(B instanceof S3Matrix) {
			// 横型の場合は、v[AB]=u
			// 縦型の場合は、[BA]v=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? B.mul(A) : A.mul(B);
		}
		else if(B instanceof S3Vector) {
			// 横型の場合は、[vA]=u
			// 縦型の場合は、[Av]=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? A.mul(B) : B.mul(A);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	/**
	 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
	 * @param {Number} z
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZXY(z, x, y) {
		const Z = this.getMatrixRotateZ(z);
		const X = this.getMatrixRotateX(x);
		const Y = this.getMatrixRotateY(y);
		return this.mulMatrix(this.mulMatrix(Z, X), Y);
	}

	getMatrixWorldTransform(model) {
		// 回転行列
		const R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
		// スケーリング
		const S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
		// 移動行列
		const T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
		// ワールド変換行列を作成する
		const W = this.mulMatrix(this.mulMatrix(S, R), T);
		return W;
	}

	clear() {
		this.context2d.clear();
	}

	_calcVertexTransformation(vertexlist, MVP, Viewport) {
		const newvertexlist = [];
		
		for(let i = 0; i < vertexlist.length; i++) {
			let p = vertexlist[i].position;
			
			//	console.log("1 " + p);
			//	console.log("2 " + this.mulMatrix(VPS.LookAt, p));
			//	console.log("3 " + this.mulMatrix(VPS.PerspectiveFov, this.mulMatrix(VPS.LookAt, p)));
			//	console.log("4 " + this.mulMatrix(MVP, p));
			
			p = this.mulMatrix(MVP, p);
			const rhw = p.w;
			p = p.mul(1.0 / rhw);
			p = this.mulMatrix(Viewport, p);
			newvertexlist[i] = new S3Vertex(p);
		}
		return newvertexlist;
	}

	drawAxis(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		const vertexvector = [];
		vertexvector[0] = new S3Vector(0, 0, 0);
		vertexvector[1] = new S3Vector(10, 0, 0);
		vertexvector[2] = new S3Vector(0, 10, 0);
		vertexvector[3] = new S3Vector(0, 0, 10);
		
		const newvector = [];
		const M = this.mulMatrix(VPS.LookAt, VPS.PerspectiveFov);
		for(let i = 0; i < vertexvector.length; i++) {
			let p = vertexvector[i];
			p = this.mulMatrix(M, p);
			p = p.mul(1.0 / p.w);
			p = this.mulMatrix(VPS.Viewport, p);
			newvector[i] = p;
		}
		
		this.context2d.setLineWidth(3.0);
		this.context2d.setLineColor("rgb(255, 0, 0)");
		this.context2d.drawLine(newvector[0], newvector[1]);
		this.context2d.setLineColor("rgb(0, 255, 0)");
		this.context2d.drawLine(newvector[0], newvector[2]);
		this.context2d.setLineColor("rgb(0, 0, 255)");
		this.context2d.drawLine(newvector[0], newvector[3]);
	}

	_drawPolygon(vetexlist, triangleindexlist) {
		for(let i = 0; i < triangleindexlist.length; i++) {
			const ti = triangleindexlist[i];
			if(this.testCull(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position )) {
				continue;
			}
			this.context2d.drawLinePolygon(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position
			);
		}
	}

	drawScene(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		this.context2d.setLineWidth(1.0);
		this.context2d.setLineColor("rgb(0, 0, 0)");
		
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			const M = this.getMatrixWorldTransform(model);
			const MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
			const vlist = this._calcVertexTransformation(mesh.src.vertex, MVP, VPS.Viewport);
			this._drawPolygon(vlist, mesh.src.triangleindex);
		}
	}

	_disposeObject() {
	}
	
	createVertex(position) {
		return new S3Vertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3Texture(this, name);
	}
	
	createScene() {
		return new S3Scene();
	}
	
	createModel() {
		return new S3Model();
	}
	
	createMesh() {
		return new S3Mesh(this);
	}
	
	createMaterial(name) {
		return new S3Material(this, name);
	}
	
	createLight() {
		return new S3Light();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}

S3System.SYSTEM_MODE = {
	OPEN_GL		: 0,
	DIRECT_X	: 1
};

S3System.DEPTH_MODE = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPEN_GL		: 0,
	/**
	 * Z値の範囲などの依存関係をDirecX準拠
	 * @type Number
	 */
	DIRECT_X	: 1
};

S3System.DIMENSION_MODE = {
	/**
	 * 右手系
	 * @type Number
	 */
	RIGHT_HAND	: 0,
	/**
	 * 左手系
	 * @type Number
	 */
	LEFT_HAND	: 1
};

S3System.VECTOR_MODE = {
	/**
	 * 値を保持するベクトルを縦ベクトルとみなす
	 * @type Number
	 */
	VECTOR4x1	: 0,
	/**
	 * 値を保持するベクトルを横ベクトルとみなす
	 * @type Number
	 */
	VECTOR1x4	: 1
};

S3System.FRONT_FACE = {
	/**
	 * 反時計回りを前面とする
	 * @type Number
	 */
	COUNTER_CLOCKWISE : 0,
	
	/**
	 * 時計回りを前面とする
	 * @type Number
	 */
	CLOCKWISE : 1
};

S3System.CULL_MODE = {
	
	/**
	 * 常にすべての三角形を描画します。
	 * @type Number
	 */
	NONE : 0,
	
	/**
	 * 前向きの三角形を描写しません。
	 * @type Number
	 */
	FRONT : 1,
	
	/**
	 * 後ろ向きの三角形を描写しません。
	 * @type Number
	 */
	BACK : 2,
	
	/**
	 * 常に描写しない。
	 * @type Number
	 */
	FRONT_AND_BACK : 3
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLShader {
	
	/**
	 * WebGLのシェーダー情報
	 * 頂点シェーダー／フラグメントシェーダ―用クラス
	 * ソースコード、コンパイル済みデータ、シェーダータイプを格納できる
	 * S3GLProgram 内部で利用するもので、一般的にこれ単体では使用しない
	 * @param {S3GLSystem} sys
	 * @param {String} code
	 * @returns {S3GLShader}
	 */
	constructor(sys, code) {
		this._init(sys, code);
	}
	
	_init(sys, code) {
		this.sys			= sys;
		this.code			= null;
		this.shader			= null;
		this.sharder_type	= -1;
		this.is_error		= false;
		const that = this;
		const downloadCallback = function(code) {
			that.code = code;
		};
		if(code.indexOf("\n") === -1) {
			// 1行の場合はURLとみなす（雑）
			this.sys._download(code, downloadCallback);
		}
		else {
			this.code = code;
		}
	}
	
	isError() {
		return this.is_error;
	}
	
	getCode() {
		return this.code;
	}
	
	getShader() {
		const gl = this.sys.getGL();
		if((gl === null) || this.is_error || (this.code === null)) {
			// まだ準備ができていないのでエラーを発生させない
			return null;
		}
		if(this.shader !== null) {
			// すでにコンパイル済みであれば返す
			return this.shader;
		}
		let code = this.code;
		// コメントを除去する
		code = code.replace(/\/\/.*/g,"");
		code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
		// コード内を判定して種別を自動判断する（雑）
		let sharder_type = 0;
		if(code.indexOf("gl_FragColor") !== -1) {
		// フラグメントシェーダである
			sharder_type = gl.FRAGMENT_SHADER;
		}
		else {
			// バーテックスシェーダである
			sharder_type = gl.VERTEX_SHADER;
		}
		const data = this.sys.glfunc.createShader(sharder_type, code);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		this.shader			= data.shader;
		this.sharder_type	= sharder_type;
		return this.shader;
		
	}
	
	getShaderType() {
		if(this.sharder_type !== -1) {
			return this.sharder_type;
		}
		if(this.getShader() !== null) {
			return this.sharder_type;
		}
		return null;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return null;
		}
		if(this.shader === null) {
			return true;
		}
		this.sys.glfunc.deleteShader(this.shader);
		this.shader	= null;
		this.sharder_type = -1;
		return true;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLArray {
	
	/**
	 * WebGL用の配列 (immutable)
	 * @param {Object} data 数値／配列／S3Vector/S3Matrix
	 * @param {Number} dimension 例えば3次元のベクトルなら、3
	 * @param {S3GLArray.datatype} datatype
	 * @returns {S3GLArray}
	 */
	constructor(data, dimension, datatype) {
		// 引数の情報(S3GLArray.datatype.instance)を用いて、
		// JS用配列を、WEBGL用配列に変換して保存する
		if(data instanceof datatype.instance) {
			this.data	= data;
		}
		else if((data instanceof S3Vector) || (data instanceof S3Matrix)) {
			this.data	= data.toInstanceArray(datatype.instance, dimension);
		}
		else if(data instanceof Array) {
			this.data	= new datatype.instance(data);
		}
		else if(!isNaN(data)) {
			this.data	= new datatype.instance([data]);
		}
		else {
			throw "IllegalArgumentException";
		}
		this.dimension	= dimension;
		this.datatype	= datatype;
		
		let instance = "";
		if(data instanceof S3Vector) {
			instance = "S3Vector";
		}
		else if(data instanceof S3Matrix) {
			instance = "S3Matrix";
		}
		else {
			instance = "Number";
		}
		this.glsltype = S3GLArray.gltypetable[datatype.name][instance][dimension];
	}
	
}

// Int32Array を一応定義してあるが、整数型は補間できないため、Attributeには使用できない。
S3GLArray.datatype = {
	"Float32Array"	: {
		instance	: Float32Array,
		name	: "Float32Array"
	},
	"Int32Array"	: {
		instance	: Int32Array,
		name	: "Int32Array"
	}
};

S3GLArray.gltypetable = {
	"Float32Array"	: {
		"Number"	:	{
			1	:	"float",
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Vector"	:	{
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Matrix"	:	{
			4	:	"mat2",
			9	:	"mat3",
			16	:	"mat4"
		}
	},
	"Int32Array"	: {
		"Number"	:	{
			1	:	"int",
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		},
		"S3Vector"	:	{
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		}
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLProgram {
	
	/**
	 * WebGLのプログラム情報
	 * 頂点シェーダー、フラグメントシェーダーの2つを組み合わせたプログラム用のクラス
	 * 2種類のシェーダーと、リンクしたプログラムを格納できる
	 * またプログラムをセットしたり、セットした後は変数とのバインドができる。
	 * @param {S3GLSystem} sys
	 * @param {Integer} id
	 * @returns {S3GLProgram}
	 */
	constructor(sys, id) {
		this._init(sys, id);
	}

	_init(sys, id) {
		this.id				= id;
		this.sys			= sys;
		this.vertex			= null;
		this.fragment		= null;
		this.isDLVertex		= false;
		this.isDLFragment	= false;
		this.program		= null;
		this.is_linked		= false;
		this.is_error		= false;
		this.enable_vertex_number = {};
		
		const variable = {};
		variable.attribute	= {};
		variable.uniform	= {};
		variable.modifiers	= [];
		variable.datatype	= [];
		this.variable = variable;
		
		const _this = this;
		this.activeTextureId = 0;
		
		const g = {
			uniform1iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1iv(location, value); }},
			uniform2iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2iv(location, value); }},
			uniform3iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3iv(location, value); }},
			uniform4iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4iv(location, value); }},
			uniform1fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1fv(location, value); }},
			uniform2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2fv(location, value); }},
			uniform3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3fv(location, value); }},
			uniform4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4fv(location, value); }},
			uniformMatrix2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix2fv(location, false, value); }},
			uniformMatrix3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix3fv(location, false, value); }},
			uniformMatrix4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix4fv(location, false, value); }},
			uniformSampler2D: function(location, value) {
				const gl = sys.getGL();
				if(gl){
					gl.activeTexture(gl.TEXTURE0 + _this.activeTextureId);
					gl.bindTexture(gl.TEXTURE_2D, value);
					gl.uniform1i(location, _this.activeTextureId);
					_this.activeTextureId++;
				}
			}
		};
		
		const info = {
			int		: {glsltype : "int",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			float	: {glsltype : "float",	instance : Float32Array,	size : 1, btype : "FLOAT",	bind : g.uniform1fv},
			bool	: {glsltype : "bool",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			mat2	: {glsltype : "mat2",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniformMatrix2fv},
			mat3	: {glsltype : "mat3",	instance : Float32Array,	size : 9, btype : "FLOAT",	bind : g.uniformMatrix3fv},
			mat4	: {glsltype : "mat4",	instance : Float32Array,	size : 16,btype : "FLOAT",	bind : g.uniformMatrix4fv},
			vec2	: {glsltype : "vec2",	instance : Float32Array,	size : 2, btype : "FLOAT",	bind : g.uniform2fv},
			vec3	: {glsltype : "vec3",	instance : Float32Array,	size : 3, btype : "FLOAT",	bind : g.uniform3fv},
			vec4	: {glsltype : "vec4",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniform4fv},
			ivec2	: {glsltype : "ivec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			ivec3	: {glsltype : "ivec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			ivec4	: {glsltype : "ivec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			bvec2	: {glsltype : "bvec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			bvec3	: {glsltype : "bvec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			bvec4	: {glsltype : "bvec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			sampler2D		: {glsltype : "sampler2D",	instance : Image, size : 1, btype : "TEXTURE",	bind : g.uniformSampler2D},
			samplerCube	: {glsltype : "samplerCube",instance : Image, size : 1, btype : "TEXTURE",	bind : null}
		};
		
		this.analysisShader = function(code, variable) {
			// コメントを除去する
			code = code.replace(/\/\/.*/g,"");
			code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
			// 1行ずつ解析
			const codelines = code.split("\n");
			for(let i = 0; i < codelines.length; i++) {
				// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
				const data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\w+\s*\])?;/);
				if(data === null) {
					continue;
				}
				// 見つけたら変数名や、型を記録しておく
				// 配列数の調査は、定数などを使用されると簡単に調べられないため取得できない
				// そのため自動でテストできないため、bindする際に、正しい配列数の配列をbindすること
				const text_space			= data[1];
				const text_type			= data[2];
				const text_variable		= data[3];
				const text_array			= data[4];
				const is_array			= text_array !== undefined;
				// 型に応じたテンプレートを取得する
				// data[1] ... uniform, data[2] ... mat4, data[3] ... M
				const targetinfo = info[text_type];
				variable[text_variable]			= {};
				// 参照元データを書き換えないようにディープコピーする
				for(const key in targetinfo) {
					variable[text_variable][key]	= targetinfo[key];	// glsl, js, size, bind
				}
				// さらに情報を保存しておく
				variable[text_variable].name		= text_variable;		// M
				variable[text_variable].modifiers	= text_space;			// uniform
				variable[text_variable].is_array	= is_array;
				variable[text_variable].location	= [];
				
			}
			return;
		};
	}
	
	resetActiveTextureId() {
		this.activeTextureId = 0;
	}
	
	isLinked() {
		return this.is_linked;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return false;
		}
		if(this.is_linked) {
			this.disuseProgram();
			this.sys.glfunc.deleteProgram(this.program,
				this.vertex.getShader(), this.fragment.getShader()
			);
			this.program		= null;
			this.is_linked		= false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this._init(this.sys, this.id);
		return true;
	}
	
	setVertexShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		this.vertex = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}
	
	setFragmentShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this.fragment = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}

	useProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const program = this.getProgram();
		if(program && this.sys.getGL()) {
			this.sys.getGL().useProgram(program);
		}
		return true;
	}
	
	disuseProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const gl = this.sys.getGL();
		if(gl) {
			// enable化したデータを解放する
			for(const key in this.enable_vertex_number) {
				gl.disableVertexAttribArray(key);
			}
			this.enable_vertex_number = {};
		}
		return true;
	}
	
	getProgram() {
		const gl = this.sys.getGL();
		// 1度でもエラーが発生したか、glキャンバスの設定をしていない場合
		if((gl === null) || this.is_error) {
			return null;
		}
		// ダウンロード中なら無視する
		if(this.isDLVertex || this.isDLFragment) {
			return null;
		}
		// すでにリンク済みのがあれば返す
		if(this.isLinked()) {
			return this.program;
		}
		// シェーダーを取得する
		if(this.vertex === null) {
			console.log("do not set VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment === null) {
			console.log("do not set FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		const is_error_vertex		= this.vertex.isError();
		const is_error_fragment	= this.fragment.isError();
		if(is_error_vertex || is_error_fragment) {
			console.log("shader compile error");
			this.is_error = true;
			return null;
		}
		const shader_vertex	= this.vertex.getShader();
		const shader_fragment	= this.fragment.getShader();
		if((shader_vertex === null) || (shader_fragment === null)) {
			// まだロードが終わってない可能性あり
			return null;
		}
		if(this.vertex.getShaderType() !== gl.VERTEX_SHADER) {
			console.log("VERTEX_SHADER is not VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment.getShaderType() !== gl.FRAGMENT_SHADER) {
			console.log("FRAGMENT_SHADER is not FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		// 取得したシェーダーを用いてプログラムをリンクする
		const data = this.sys.glfunc.createProgram(shader_vertex, shader_fragment);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		// リンクが成功したらプログラムの解析しておく
		this.is_linked = true;
		this.program = data.program;
		this.analysisShader(this.vertex.getCode(), this.variable);
		this.analysisShader(this.fragment.getCode(), this.variable);
		return this.program;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {String} name
	 * @param {Object} data
	 * @returns {undefined}
	 */
	bindData(name, data) {
		if(!this.isLinked()) {
			return false;
		}
		const gl	= this.sys.getGL();
		const prg	= this.getProgram();
		const variable	= this.variable[name];
		
		// ---- check Location ----
		if(variable === undefined) {
			// シェーダーでは利用していないものをbindしようとした。
			return false;
		}
		// 長さが0なら位置が未調査なので調査する
		if(variable.location.length === 0) {
			if(variable.modifiers === "attribute") {
				variable.location[0] = gl.getAttribLocation(prg, name);
			}
			else {
				if(!variable.is_array) {
					variable.location[0] = gl.getUniformLocation(prg, name);
				}
				else {
					// 配列の場合は、配列の数だけlocationを調査する
					// 予め、シェーダー内の配列数と一致させておくこと
					for(let i = 0; i < data.length; i++) {
						variable.location[i] = gl.getUniformLocation(prg, name + "[" + i + "]");
					}
				}
			}
		}
		if(variable.location[0] === -1) {
			// 変数は宣言されているが、関数の中で使用していないと -1 がかえる
			return false;
		}
		// data が bind できる形になっているか調査する
		
		// ---- check Type ----
		// glslの型をチェックして自動型変換する
		const toArraydata = function(data) {
			if(data instanceof WebGLBuffer) {
				// VBO型は、無視する
				if(variable.modifiers === "attribute"){
					return data;
				}
			}
			if(data instanceof WebGLTexture) {
				// テクスチャ型なら無視する
				if(variable.glsltype === "sampler2D") {
					return data;
				}
			}
			if(data instanceof variable.instance) {
				// 型と同じインスタンスであるため問題なし
				return data;
			}
			// GL用の型
			if(data instanceof S3GLArray) {
				if(variable.glsltype === data.glsltype) {
					return data.data;
				}
			}
			// 入力型が行列型であり、GLSLも行列であれば
			if(data instanceof S3Matrix) {
				if(	(variable.glsltype === "mat2") ||
					(variable.glsltype === "mat3") ||
					(variable.glsltype === "mat4") ){
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型がベクトル型であり、GLSLも数値であれば
			if(data instanceof S3Vector) {
				if(	(variable.glsltype === "vec2") ||
					(variable.glsltype === "vec3") ||
					(variable.glsltype === "vec4") ||
					(variable.glsltype === "ivec2") ||
					(variable.glsltype === "ivec3") ||
					(variable.glsltype === "ivec4") ||
					(variable.glsltype === "bvec2") ||
					(variable.glsltype === "bvec3") ||
					(variable.glsltype === "bvec4") ) {
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型が数値型であり、GLSLも数値であれば
			if((typeof data === "number")||(data instanceof Number)) {
				if(	(variable.glsltype === "int") ||
					(variable.glsltype === "float") ||
					(variable.glsltype === "bool") ) {
					return new variable.instance([data]);
				}
			}
			console.log(data);
			throw "not toArraydata";
		};
		
		// 引数の値をArray型に統一化する
		if(!variable.is_array) {
			data = toArraydata(data);
		}
		else {
			for(let i = 0; i < data.length; i++) {
				if(variable.location[i] !== -1) {
					// 配列の値が NULL になっているものは調査しない
					if(data[i] !== null) {
						data[i] = toArraydata(data[i]);
					}
				}
			}
		}
		
		// ---- bind Data ----
		// 装飾子によって bind する方法を変更する
		if(variable.modifiers === "attribute") {
			// bindしたいデータ
			gl.bindBuffer(gl.ARRAY_BUFFER, data);
			// 有効化していない場合は有効化する
			if(!this.enable_vertex_number[variable.location[0]]) {
				gl.enableVertexAttribArray(variable.location[0]);
				this.enable_vertex_number[variable.location[0]] = true;
			}
			// bind。型は適当に設定
			gl.vertexAttribPointer(
				variable.location[0],
				variable.size,
				variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
				false, 0, 0);
		}
		else {
			// uniform の設定
			if(!variable.is_array) {
				variable.bind(variable.location[0], data);
			}
			else {
				// 配列の場合は、配列の数だけbindする
				for(let i = 0; i < data.length; i++) {
					if(variable.location[i] !== -1) {
						// 配列の値が NULL になっているものはbindしない
						if(data[i] !== null) {
							variable.bind(variable.location[i], data[i]);
						}
					}
				}
			}
		}
		
		return true;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {Object} s3mesh
	 * @returns {Integer} IBOのインデックス数
	 */
	bindMesh(s3mesh) {
		if(!this.isLinked()) {
			// programが未作成
			return 0;
		}
		const gl = this.sys.getGL();
		if(gl === null) {
			// glが用意されていない
			return 0;
		}
		const gldata = s3mesh.getGLData();
		if(gldata === null) {
			// 入力値が用意されていない
			return 0;
		}
		// インデックスをセット
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
		const index_length = gldata.ibo.array_length;
		// 頂点をセット(あらかじめコードから解析した attribute について埋める)
		for(const key in this.variable) {
			
			if(this.variable[key].modifiers === "uniform") {
				// uniform は共通設定なので省略
				continue;
			}
			// 例えば、vboのリストにあるが、gldata内に情報をもっていない場合がある
			// それは、カメラ用の行列などがあげられる。
			// 逆に、gldata内に情報をもっているが、vbo内に定義されていないのであれば、
			// 使用しない。
			if(gldata.vbo[key] === undefined) {
				continue;
			}
			this.bindData(key, gldata.vbo[key].data);
		}
		// 戻り値でインデックスの長さを返す
		// この長さは、drawElementsで必要のため
		return index_length;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLLight extends S3Light {

	/**
	 * ライト情報にデータ取得用のメソッドを拡張している。
	 */
	constructor() {
		super();
	}

	clone() {
		return super.clone(S3GLLight);
	}
	
	getGLHash() {
		return "" + this.mode + this.power + this.range + this.position.toString(3) + this.direction.toString(3) + this.color.toString(3);
	}
	
	getGLData() {
		const lightsColor = this.color.mul(this.power);
		let lightsVector = new S3Vector();
		// uniform 節約のためにライト用のベクトルは用途によって入れる値を変更する
		if(this.mode === S3Light.MODE.DIRECTIONAL_LIGHT) {
			lightsVector = this.direction;
		}
		else if(this.mode === S3Light.MODE.POINT_LIGHT) {
			lightsVector = this.position;
		}
		// uniform 節約のために最終的に渡すデータをまとめる
		return {
			lightsData1	: new S3GLArray([this.mode, this.range, lightsVector.x, lightsVector.y] , 4, S3GLArray.datatype.Float32Array),
			lightsData2	: new S3GLArray([lightsVector.z, lightsColor.x, lightsColor.y, lightsColor.z] , 4, S3GLArray.datatype.Float32Array)
		};
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLMaterial extends S3Material {
	
	constructor(s3dlsystem, name) {
		super(s3dlsystem, name);
	}
	
	getGLHash() {
		// 名前は被らないので、ハッシュに使用する
		return this.name;
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * uniform の数がハードウェア上限られているため、送る情報は選定すること
	 * @returns {頂点データ（色情報）}
	 */
	getGLData() {
		// テクスチャを取得
		let tex_color	= this.textureColor.getGLData();
		let tex_normal	= this.textureNormal.getGLData();
		// テクスチャのありなしフラグを作成。ない場合はダミーデータを入れる。
		const tex_exist	= [tex_color === null?0:1, tex_normal === null?0:1];
		tex_color	= tex_color === null	? this.sys._getDummyTexture() : tex_color;
		tex_normal	= tex_normal === null	? this.sys._getDummyTexture() : tex_normal;
		return {
			materialsColorAndDiffuse	:
				new S3GLArray([this.color.x, this.color.y, this.color.z, this.diffuse]			, 4, S3GLArray.datatype.Float32Array),
			materialsSpecularAndPower	:
				new S3GLArray([this.specular.x, this.specular.y, this.specular.z, this.power]	, 4, S3GLArray.datatype.Float32Array),
			materialsEmission	:
				new S3GLArray(this.emission	, 3, S3GLArray.datatype.Float32Array),
			materialsAmbientAndReflect	:
				new S3GLArray([this.ambient.x, this.ambient.y, this.ambient.z, this.reflect]	, 4, S3GLArray.datatype.Float32Array),
			materialsTextureExist	:
				new S3GLArray(tex_exist	, 2, S3GLArray.datatype.Float32Array),
			materialsTextureColor	:	tex_color,
			materialsTextureNormal	:	tex_normal
		};
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTexture extends S3Texture {
	
	constructor(s3glsystem, data) {
		super(s3glsystem, data);
		this.gldata			= null;
	}

	_init() {
		super._init();
		this.gldata			= null;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
			if(this.gldata !== null) {
				this.sys._disposeObject(this);
				this.gldata = null;
			}
		}
	}

	getGLData() {
		if(this.is_dispose) {
			return null;
		}
		if(this.gldata !== null) {
			return this.gldata;
		}
		if(this.is_loadimage) {
			this.gldata = this.sys.glfunc.createTexture(this.url, this.image);
			return this.gldata;
		}
		return null;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLMesh extends S3Mesh {
	
	/**
	 * 既存の部品に WebGL 用の情報を記録するための拡張
	 * 主に、描写のための VBO と IBO を記録する
	 * @param {S3System} sys 
	 */
	constructor(sys) {
		super(sys);
	}
	
	_init() {
		super._init();
		// webgl用
		this.gldata = {};
		this.is_compile_gl	= false;
	}
	
	clone() {
		return super.clone(S3GLMesh);
	}
	
	isCompileGL() {
		return this.is_compile_gl;
	}
	
	setCompileGL(is_compile_gl) {
		this.is_compile_gl = is_compile_gl;
	}
	
	/**
	 * 三角形インデックス情報（頂点ごとのYV、法線）などを求める
	 * 具体的には共有している頂点をしらべて、法線の平均値をとる
	 * @returns {S3GLTriangleIndexData}
	 */
	createTriangleIndexData() {
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.getTriangleIndexArray();
		const tid_list = [];
		
		const normallist = {
			normal		: null,
			tangent		: null,
			binormal	: null
		};
		
		// 各面の法線、接線、従法線を調べる
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const index	= triangleindex.index;
			const uv		= triangleindex.uv;
			tid_list[i]	= triangleindex.createGLTriangleIndexData();
			const triangledata = tid_list[i];
			let vector_list = null;
			// 3点を時計回りで通る平面が表のとき
			if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[0]].position, vertex_list[index[1]].position, vertex_list[index[2]].position,
					uv[0], uv[1], uv[2]
				);
			}
			else {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[2]].position, vertex_list[index[1]].position, vertex_list[index[0]].position,
					uv[2], uv[1], uv[0]
				);
			}
			for(const vector_name in normallist) {
				triangledata.face[vector_name] = vector_list[vector_name];
			}
		}
		
		// 素材ごとに、三角形の各頂点に、面の法線情報を追加する
		// 後に正規化する（平均値をとる）が、同じベクトルを加算しないようにキャッシュでチェックする
		const vertexdatalist_material = [];
		const vertexdatalist_material_cash = [];
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			// 未登録なら新規作成する
			if(vertexdatalist_material[material] === undefined) {
				vertexdatalist_material[material] = [];
				vertexdatalist_material_cash[material] = [];
			}
			const vertexdata_list = vertexdatalist_material[material];
			const vertexdata_list_cash = vertexdatalist_material_cash[material];
			// 素材ごとの三角形の各頂点に対応する法線情報に加算していく
			for(let j = 0; j < 3; j++) {
				// 未登録なら新規作成する
				const index = triangleindex.index[j];
				if(vertexdata_list[index] === undefined) {
					vertexdata_list[index] = {
						normal		: new S3Vector(0, 0, 0),
						tangent		: new S3Vector(0, 0, 0),
						binormal	: new S3Vector(0, 0, 0)
					};
					vertexdata_list_cash[index] = {
						normal		: [],
						tangent		: [],
						binormal	: []
					};
				}
				const vertexdata = vertexdata_list[index];
				const vertexdata_cash = vertexdata_list_cash[index];
				
				// 加算する
				for(const vector_name in normallist) {
					if(triangledata.face[vector_name] !== null) {
						// データが入っていたら加算する
						const id = triangledata.face[vector_name].toHash(3);
						if(vertexdata_cash[vector_name][id]) continue;
						vertexdata[vector_name] = vertexdata[vector_name].add(triangledata.face[vector_name]);
						vertexdata_cash[vector_name][id] = true;
					}
				}
			}
		}
		
		// マテリアルごとの頂点の法線を、正規化して1とする（平均値をとる）
		for(const material in vertexdatalist_material) {
			const vertexdata_list = vertexdatalist_material[material];
			for(const index in vertexdata_list) {
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					// あまりに小さいと、0で割ることになるためチェックする
					if(vertexdata[vectorname].normFast() > 0.000001) {
						vertexdata[vectorname] = vertexdata[vectorname].normalize();
					}
				}
			}
		}
		
		// 面法線と、頂点（スムーズ）法線との角度の差が、下記より大きい場合は面法線を優先
		const SMOOTH = {};
		SMOOTH.normal	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.tangent	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.binormal	= Math.cos((50/360)*(2*Math.PI));
		
		// 最終的に三角形の各頂点の法線を求める
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			const vertexdata_list = vertexdatalist_material[material];
			
			// 法線ががあまりに違うのであれば、面の法線を採用する
			for(let j = 0; j < 3; j++) {
				const index = triangleindex.index[j];
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					let targetdata;
					if(triangledata.face[vectorname]) {
						// 面で計算した値が入っているなら、
						// 面で計算した値と、頂点の値とを比較してどちらかを採用する
						const rate  = triangledata.face[vectorname].dot(vertexdata[vectorname]);
						// 指定した度以上傾いていたら、面の法線を採用する
						targetdata = (rate < SMOOTH[vectorname]) ? triangledata.face : vertexdata;
					}
					else {
						targetdata = vertexdata;
					}
					// コピー
					triangledata.vertex[vectorname][j]	= targetdata[vectorname];
				}
			}
		}
		
		return tid_list;
	}

	/**
	 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
	 * @returns {undefined}
	 */
	_getGLArrayData() {
		
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.createTriangleIndexData();
		const hashlist = [];
		let vertex_length = 0;
		
		const triangle			= [];
		const vertextypelist	= {};
		
		// インデックスを再構築して、VBOとIBOを作る
		// 今の生データだと、頂点情報、素材情報がばらばらに保存されているので
		// 1つの頂点情報（位置、色等）を1つのセットで保存する必要がある
		// 面に素材が結びついているので、面が1つの頂点を共有していると
		// それらの面の素材情報によって、別の頂点として扱う必要がある
		// なので基本的には頂点情報を毎回作り直す必要があるが、
		// 1度作ったものと等しいものが必要であれば、キャッシュを使用する
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const indlist = [];
			// ポリゴンの各頂点を調べる
			for(let j = 0; j < 3; j++) {
				// その頂点（面の情報（UVなど）も含めたデータ）のハッシュ値を求める
				const hash = triangleindex.getGLHash(j, vertex_list);
				// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
				const hit = hashlist[hash];
				indlist[j] = (hit !== undefined) ? hit : vertex_length;
				// 頂点がもしヒットしていなかったら
				if(hit === undefined) {
					// 頂点データを作成して
					const vertexdata = triangleindex.getGLData(j, vertex_list);
					hashlist[hash]  = vertex_length;
					// 頂点にはどういった情報があるか分からないので、in を使用する。
					// key には、position / normal / color / uv などがおそらく入っている
					for(const key in vertexdata) {
						if(vertextypelist[key] === undefined) {
							vertextypelist[key]		= [];
						}
						vertextypelist[key].push(vertexdata[key]);
					}
					vertex_length++;
				}
			}
			// 3つの頂点のインデックスを記録
			triangle[i] = new Int16Array(indlist);
		}
		
		// データ結合処理
		// これまでは複数の配列にデータが入ってしまっているので、
		// 1つの指定した型の配列に全てをまとめる必要がある
		
		let pt = 0;
		const ibo = {};
		{
			// IBOの結合（インデックス）
			ibo.array_length	= triangleindex_list.length * 3;
			ibo.array			= new Int16Array(ibo.array_length);
			pt = 0;
			for(let i = 0; i < triangleindex_list.length; i++) {
				for(let j = 0; j < 3; j++) {
					ibo.array[pt++] = triangle[i][j];
				}
			}
		}
		const vbo = {};
		{
			// VBOの結合（頂点）
			// 位置、法線、色などを、それぞれ1つの配列として記録する
			for(const key in vertextypelist) {
				const srcdata		= vertextypelist[key];
				const dimension	= srcdata[0].dimension;
				const dstdata	= {};
				// 情報の名前(position / uv / normal など)
				dstdata.name			= key;
				// 1つの頂点あたり、いくつの値が必要か。例えばUVなら2次元情報
				dstdata.dimension		= srcdata[0].dimension;
				// 型情報 Float32Array / Int32Array なのかどうか
				dstdata.datatype		= srcdata[0].datatype;
				// 配列の長さ
				dstdata.array_length	= dimension * vertex_length;
				// 型情報と、配列の長さから、メモリを確保する
				dstdata.array			= new dstdata.datatype.instance(dstdata.array_length);
				// data を1つの配列に結合する
				pt = 0;
				for(let i = 0; i < vertex_length; i++) {
					for(let j = 0; j < dimension; j++) {
						dstdata.array[pt++] = srcdata[i].data[j];
					}
				}
				// VBOオブジェクトに格納
				vbo[key] = dstdata;
			}
		}
		
		const arraydata = {};
		arraydata.ibo		= ibo;
		arraydata.vbo		= vbo;
		return arraydata;
	}

	disposeGLData() {
		// コンパイルしていなかったら抜ける
		if(!this.isCompileGL()) {
			return;
		}
		const gldata = this.getGLData();
		if(gldata !== null) {
			if(gldata.ibo !== undefined) {
				if(gldata.ibo.data !== undefined) {
					this.sys.glfunc.deleteBuffer(gldata.ibo.data);
				}
				delete gldata.ibo;
			}
			if(gldata.vbo !== undefined) {
				for(const key in gldata.vbo) {
					if(gldata.vbo[key].data !== undefined) {
						this.sys.glfunc.deleteBuffer(gldata.vbo[key].data);
					}
				}
				delete gldata.vbo;
			}
			{
				const material_list = this.getMaterialArray();
				for(let i = 0; i < material_list.length; i++) {
					const mat = material_list[i];
					for(const key in mat) {
						const obj = mat[key];
						if(obj instanceof S3GLTexture) {
							obj.dispose();
						}
					}
				}
			}
		}
		delete this.gldata;
		this.gldata = {};
		this.setCompileGL(false);
	}

	/**
	 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
	 * @returns {S3GLMesh.gldata}
	 */
	getGLData() {
		// すでに存在している場合は、返す
		if(this.isCompileGL()) {
			return this.gldata;
		}
		// 完成していない場合は null
		if(this.isComplete() === false) {
			return null;
		}
		// GLを取得できない場合も、この時点で終了させる
		if(!this.sys.isSetGL()) {
			return null;
		}
		const gldata = this._getGLArrayData(); // GL用の配列データを作成
		
		// IBO / VBO 用のオブジェクトを作成
		gldata.ibo.data = this.sys.glfunc.createBufferIBO(gldata.ibo.array);
		for(const key in gldata.vbo) {
			gldata.vbo[key].data = this.sys.glfunc.createBufferVBO(gldata.vbo[key].array);
		}
		// 代入
		this.gldata = gldata;
		this.setCompileGL(true);
		return this.gldata;
	}
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLModel extends S3Model {

	constructor() {
		super();
	}
	
	/**
	 * Uniform を作成して返す
	 */
	getUniforms() {
		const uniforms				= {};
		{
			const MATELIAL_MAX			= 4;
			const material_array			= this.getMesh().getMaterialArray();
			const materialLength			= Math.min(material_array.length, MATELIAL_MAX);
			for(let i = 0; i < materialLength; i++) {
				const data = material_array[i].getGLData();
				for(const key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		const ret = [];
		ret.uniforms = uniforms;
		return ret;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLScene extends S3Scene {
	
	constructor() {
		super();
	}
	
	getUniforms() {
		const uniforms			= {};
		// カメラ情報もUniformで送る
		{
			uniforms.eyeWorldDirection = this.getCamera().getDirection();
		}
		// ライト情報はUniformで送る
		{
			const LIGHTS_MAX			= 4;
			const light_array			= this.getLights();
			const lightsLength		= Math.min(light_array.length, LIGHTS_MAX);
			uniforms.lightsLength	= new S3GLArray(lightsLength, 1, S3GLArray.datatype.Int32Array);
			for(let i = 0; i < lightsLength; i++) {
				const data = light_array[i].getGLData();
				for(const key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		const ret = [];
		ret.uniforms = uniforms;
		return ret;
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTriangleIndexData {
	
	constructor(triangle_index) {
		this.index				= triangle_index.index;				// 各頂点を示すインデックスリスト
		this.materialIndex		= triangle_index.materialIndex;		// 面の材質
		this.uv					= triangle_index.uv;				// 各頂点のUV座標
		this._isEnabledTexture	= triangle_index.uv[0] !== null;	// UV情報があるか
		
		this.face				= {};
		this.vertex				= {};
		// S3Vector.getTangentVectorの取得値を格納用
		this.face.normal		= null;							// 面の法線情報
		this.face.tangent		= null;							// 面の接線情報
		this.face.binormal		= null;							// 面の従法線情報
		this.vertex.normal		= [null, null, null];			// 頂点ごとの法線
		this.vertex.tangent		= [null, null, null];			// 頂点ごとの接線 
		this.vertex.binormal	= [null, null, null];			// 頂点ごとの従法線 
	}

	getGLHash(number, vertexList) {
		const uvdata = this._isEnabledTexture ? this.uv[number].toString(2) + this.face.binormal.toString(2) + this.face.tangent.toString(2): "";
		const vertex   = vertexList[this.index[number]].getGLHash();
		return vertex + this.materialIndex + uvdata + this.vertex.normal[number].toString(3);
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @param {Integer} number 三角形の何番目の頂点データを取得するか
	 * @param {S3Vertex[]} vertexList 頂点の配列
	 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
	 */
	getGLData(number, vertexList) {
		const vertex		= {};
		const vertexdata_list = vertexList[this.index[number]].getGLData();
		for(const key in vertexdata_list) {
			vertex[key]	= vertexdata_list[key];
		}
		const uvdata = this._isEnabledTexture ? this.uv[number] : new S3Vector(0.0, 0.0);
		vertex.vertexTextureCoord	= new S3GLArray(uvdata, 2, S3GLArray.datatype.Float32Array);
		vertex.vertexMaterialFloat	= new S3GLArray(this.materialIndex, 1, S3GLArray.datatype.Float32Array);
		vertex.vertexNormal			= new S3GLArray(this.vertex.normal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexBinormal		= new S3GLArray(this.vertex.binormal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexTangent		= new S3GLArray(this.vertex.tangent[number], 3, S3GLArray.datatype.Float32Array);
		return vertex;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLTriangleIndex extends S3TriangleIndex {
	
	/**
	 * 3つの頂点を持つポリゴン情報にデータ取得用のメソッドを拡張
	 * @param {Number} i1 
	 * @param {Number} i2 
	 * @param {Number} i3 
	 * @param {Array} indexlist 
	 * @param {Array} materialIndex 
	 * @param {Array} uvlist 
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		super(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	clone() {
		return super.clone(S3GLTriangleIndex);
	}
	
	inverseTriangle() {
		return super.inverseTriangle(S3GLTriangleIndex);
	}

	createGLTriangleIndexData() {
		return new S3GLTriangleIndexData(this);
	}	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLVertex extends S3Vertex {

	constructor(position) {
		super(position);
	}
	
	clone() {
		return super.clone(S3GLVertex);
	}

	getGLHash() {
		return this.position.toString(3);
	}
	
	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @returns {頂点データ（座標、法線情報）}
	 */
	getGLData() {
		return {
			vertexPosition	: new S3GLArray(this.position, 3, S3GLArray.datatype.Float32Array)
		};
	}
	
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3GLSystem extends S3System {
	
	constructor() {
		super();
		this.program		= null;
		this.gl				= null;
		this.is_set			= false;
		this.program_list	= [];
		this.program_listId	= 0;
		const that = this;
		
		const glfunc_texture_cash = {};
		
		this.glfunc = {
			
			createBufferVBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const vbo = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				return vbo;
			},

			createBufferIBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const ibo = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				return ibo;
			},
			
			deleteBuffer : function(data) {
				const gl = that.getGL();
				if(gl !== null) {
					gl.deleteBuffer(data);
				}
			},
			
			createTexture : function(id, image) {
				if(	!(image instanceof ImageData) &&
					!(image instanceof HTMLImageElement) &&
					!(image instanceof HTMLCanvasElement) &&
					!(image instanceof HTMLVideoElement)) {
					throw "createBufferTexture";
				}
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let texture = null;
				if(!glfunc_texture_cash[id]) {
					texture = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					const cash = {};
					cash.texture	= texture;
					cash.count		= 0;
					glfunc_texture_cash[id] = cash;
				}
				texture = glfunc_texture_cash[id].texture;
				glfunc_texture_cash[id].count++;
				return texture;
			},
			
			deleteTexture : function(id) {
				const gl = that.getGL();
				if(gl !== null) {
					if(glfunc_texture_cash[id]) {
						glfunc_texture_cash[id].count--;
						if(glfunc_texture_cash[id].count === 0) {
							gl.deleteBuffer(glfunc_texture_cash[id].texture);
							delete glfunc_texture_cash[id];
						}
					}
				}
			},
			
			createProgram : function(shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let program		= gl.createProgram();
				let is_error	= false;
				gl.attachShader(program, shader_vertex   );
				gl.attachShader(program, shader_fragment );
				gl.linkProgram(program);
				if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
					console.log("link error " + gl.getProgramInfoLog(program));
					gl.detachShader(program, shader_vertex   );
					gl.detachShader(program, shader_fragment );
					gl.deleteProgram(program);
					program		= null;
					is_error	= true;
				}
				return {
					program		: program,
					is_error	: is_error
				};
			},
			
			deleteProgram : function(program, shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.detachShader(program, shader_vertex   );
				gl.detachShader(program, shader_fragment );
				gl.deleteProgram(program);
			},
			
			createShader : function(sharder_type, code) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let shader		= gl.createShader(sharder_type);
				let is_error	= false;
				gl.shaderSource(shader, code);
				gl.compileShader(shader);
				if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.log("compile error " + gl.getShaderInfoLog(shader));
					gl.deleteShader(shader);
					shader		= null;
					is_error	= true;
				}
				return {
					shader		: shader,
					is_error	: is_error
				};
			},
			
			deleteShader : function(shader) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.deleteShader(shader);
			}
			
		};
	}
	
	getGL() {
		return this.gl;
	}

	isSetGL() {
		return this.gl !== null;
	}
	
	setCanvas(canvas) {
		// 初期化色
		const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.canvas = canvas;
		this.gl = gl;
	}

	createProgram() {
		const program = new S3GLProgram(this, this.program_listId);
		this.program_list[this.program_listId] = program;
		this.program_listId++;
		return program;
	}

	disposeProgram() {
		for(const key in this.program_list) {
			this.program_list[key].dispose();
			delete this.program_list[key];
		}
	}

	setProgram(glprogram) {
		// nullの場合はエラーも無視
		if(glprogram === null) {
			return false;
		}
		// 明確な入力の誤り
		if(!(glprogram instanceof S3GLProgram)) {
			throw "not S3GLProgram";
		}
		// 新規のプログラムなら保持しておく
		if(this.program === null) {
			this.program = glprogram;
		}
		// プログラムが取得できない場合は、ダウンロード中の可能性あり無視する
		const new_program = glprogram.getProgram();
		if(null === new_program) {
			return false;
		}
		// すでに動作中で、設定されているものと同一なら無視する
		if((this.program === glprogram) && this.is_set) {
			return true;
		}
		// 新しいプログラムなのでセットする
		if(this.program !== null) {
			this.program.disuseProgram();
		}
		this.program = glprogram;
		this.program.useProgram();
		this.is_set = true;
	}

	clear() {
		if(this.gl === null) {
			return false;
		}
		const color = this.getBackgroundColor();
		this.gl.clearColor(color.x, color.y, color.z, color.w);
		this.gl.clearDepth(1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		return true;
	}

	drawElements(indexsize) {
		if(!this.is_set) {
			return;
		}
		this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
		this.gl.flush();
	}

	deleteBuffer(data) {
		if(this.gl === null) {
			return null;
		}
		this.gl.deleteBuffer(data);
	}

	_getDummyTexture() {
		if(this._textureDummyData === undefined) {
			const canvas = document.createElement("canvas");
			canvas.width  = 1;
			canvas.height = 1;
			const context = canvas.getContext("2d");
			const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
			this._textureDummyId = this._createID();
			this._textureDummyData = this.glfunc.createTexture(this._textureDummyId, imagedata);
		}
		return this._textureDummyData;
	}

	_setDepthMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}

	_setCullMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			gl.disable(gl.CULL_FACE);
			return;
		}
		else {
			gl.enable(gl.CULL_FACE);
		}
		if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
			gl.frontFace(gl.CW);
		}
		else {
			gl.frontFace(gl.CCW);
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			gl.cullFace(gl.FRONT_AND_BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.BACK) {
			gl.cullFace(gl.BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.FRONT) {
			gl.cullFace(gl.FRONT);
		}
	}

	_bindStart() {
		this.program.resetActiveTextureId();
	}

	_bindEnd() {
		
	}

	_bind(p1, p2) {
		if(!this.is_set) {
			return;
		}
		const prg = this.program;
		let index_lenght = 0;
		// p1が文字列、p2がデータの場合、データとして結びつける
		if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
			prg.bindData(p1, p2);
		}
		// 引数がモデルであれば、モデルとして紐づける
		else if((arguments.length === 1) && (p1 instanceof S3GLModel)) {
			const mesh = p1.getMesh();
			if(mesh instanceof S3GLMesh) {
				index_lenght = prg.bindMesh(mesh);
			}
		}
		// uniformsデータであれば、内部のデータを全て割り当てる
		else if((arguments.length === 1) && (p1.uniforms)) {
			const uniforms = p1.uniforms;
			for(const key in uniforms) {
				prg.bindData(key, uniforms[key]);
			}
		}
		return index_lenght;
	}

	drawScene(scene) {
		// プログラムを再設定
		this.setProgram(this.program);
		
		// まだ設定できていない場合は、この先へいかせない
		if(!this.is_set) {
			return;
		}
		
		// 画面の初期化
		this._setDepthMode();
		this._setCullMode();
		
		// 描写開始
		this._bindStart();
		
		// Sceneに関するUniform設定（カメラやライト設定など）
		this._bind(scene.getUniforms());
		
		// カメラの行列を取得する
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		// モデル描写
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			
			// モデルに関するUniform設定（材質の設定など）
			this._bind(model.getUniforms());
			
			// モデル用のBIND
			const M = this.getMatrixWorldTransform(model);
			const MV = this.mulMatrix(M, VPS.LookAt);
			const MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
			this._bind("matrixWorldToLocal4", M.inverse4());
			this._bind("matrixLocalToWorld4", M);
			this._bind("matrixLocalToWorld3", M);
			this._bind("matrixLocalToPerspective4", MVP);
			
			const indexsize = this._bind(model);
			if(indexsize) {
				this.drawElements(indexsize);
			}
		}
		
		// 描写終了
		this._bindEnd();
	}

	_disposeObject(obj) {
		if(obj instanceof S3GLTexture) {
			this.glfunc.deleteTexture(this.url);
		}
	}
	
	createVertex(position) {
		return new S3GLVertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3GLTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3GLTexture(this, name);
	}
	
	createScene() {
		return new S3GLScene();
	}
	
	createModel() {
		return new S3GLModel();
	}
	
	createMesh() {
		return new S3GLMesh(this);
	}
	
	createMaterial(name) {
		return new S3GLMaterial(this, name);
	}
	
	createLight() {
		return new S3GLLight();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const DefaultMaterial = {
	name : "s3default",
	color		:new S3Vector(1.0, 1.0, 1.0, 1.0),	// 拡散反射の色
	diffuse	: 0.8,									// 拡散反射の強さ
	emission	: new S3Vector(0.0, 0.0, 0.0),		// 自己照明（輝き）
	specular	: new S3Vector(0.0, 0.0, 0.0),		// 鏡面反射の色
	power		: 5.0,								// 鏡面反射の強さ
	ambient	: new S3Vector(0.6, 0.6, 0.6),			// 光によらない初期色
	reflect	: 0.0,									// 環境マッピングによる反射の強さ
	textureColor	: null,
	textureNormal	: null
};

/*
	次のようなデータを入出力できます。
	const sample = {
		Indexes:{
			body:[
				[ 0, 1, 2],
				[ 3, 1, 0],
				[ 3, 0, 2],
				[ 3, 2, 1]
			]
		},
		Vertices:[
			[  0,  0,  -5],
			[  0, 20,  -5],
			[ 10,  0,  -5],
			[  0,  0, -20]
		]
	};
*/

const S3MeshLoaderJSON = {

	name : "JSON",

	input : function(sys, mesh, json) {
		let meshdata;
		if((typeof json === "string")||(json instanceof String)) {
			meshdata = JSON.parse(json);
		}
		else {
			meshdata = json;
		}
		let material = 0;
		// 材質名とインデックスを取得
		for(const materialname in meshdata.Indexes) {
			mesh.addMaterial(sys.createMaterial(materialname));
			const materialindexlist = meshdata.Indexes[materialname];
			for(let i = 0; i < materialindexlist.length; i++) {
				const list = materialindexlist[i];
				for(let j = 0; j < list.length - 2; j++) {
					// 3角形と4角形に対応
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, list, material)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, list, material);
					mesh.addTriangleIndex(ti);
				}
			}
			material++;
		}
		// 頂点座標を取得
		for(let i = 0; i < meshdata.Vertices.length; i++) {
			const vector = new S3Vector(meshdata.Vertices[i][0], meshdata.Vertices[i][1], meshdata.Vertices[i][2]);
			const vertex = sys.createVertex(vector);
			mesh.addVertex(vertex);
		}
		return true;
	},

	output : function(mesh) {
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		const material_vertexlist = [];
		const material_length = material.length !== 0 ? material.length : 1;
		const default_material = DefaultMaterial;
		// 材質リストを取得
		for(let i = 0; i < material_length; i++) {
			material_vertexlist[i] = {
				material: material[i] ? material[i] : default_material ,
				list:[]
			};
		}
		// 材質名に合わせて、インデックスリストを取得
		for(let i = 0; i < triangleindex.length; i++) {
			const ti = triangleindex[i];
			material_vertexlist[ti.materialIndex].list.push( ti.index );
		}
		const output = [];
		output.push("{");
		output.push("\tIndexes:{");
		for(let i = 0; i < material_vertexlist.length; i++) {
			const mv = material_vertexlist[i];
			output.push("\t\t" + mv.material.name + ":[");
			for(let j = 0; j < mv.list.length; j++) {
				const vi = mv.list[j];
				output.push("\t\t\t[" + vi[0] + " " + vi[1] + " " + vi[2] + "]" + ((j === mv.list.length - 1) ? "" : ",") );
			}
			output.push("\t\t]" + ((i === material_vertexlist.length - 1) ? "" : ",") );
		}
		output.push("\t},");
		output.push("\tVertices:[");
		for(let i = 0; i < vertex.length; i++) {
			const vp = vertex[i].position;
			output.push("\t\t[" + vp.x + " " + vp.y + " " + vp.z + "]" + ((vp === vertex.length - 1) ? "" : ",") );
		}
		output.push("\t]");
		output.push("}");
		return(output.join("\n"));
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class File$2 {

	constructor(pathname) {
		this.pathname = pathname.replace(/\\/g, "/" );
	}

	getAbsolutePath() {
		if(/$http/.test(this.pathname)) {
			return this.pathname;
		}
		let name = window.location.toString();
		if(!(/\/$/.test(name))) {
			name = name.match(/.*\//)[0];
		}
		const namelist = this.pathname.split("/");
		for(let i = 0; i < namelist.length; i++) {
			if((namelist[i] === "") || (namelist[i] === ".")) {
				continue;
			}
			if(namelist[i] === "..") {
				name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
				continue;
			}
			name += namelist[i];
			if(i !== namelist.length - 1) {
				name += "/";
			}
		}
		return name;
	}

	getParent() {
		const x = this.getAbsolutePath().match(/.*\//)[0];
		return(x.substring(0 ,x.length - 1));
	}
}

const S3MeshLoaderMQO = {

	name : "MQO",

	/**
	 * メタセコイア形式で入力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		let mqofile = null;
		let parent_dir = "./";
		if(url) {
			mqofile = new File$2(url);
			parent_dir = mqofile.getParent() + "/";
		}
		
		const lines = text.split("\n");
		const block_stack = [];
		let block_type  = "none";
		// 半角スペース区切りにの文字列数値を、数値型配列にする
		const toNumberArray = function(text) {
			const x = text.split(" "), out = [];
			for(let i = 0; i < x.length; i++) {
				out[i] = parseFloat(x[i]);
			}
			return out;
		};
		// func(XXX) のXXXの中身を抜き出す
		const getValueFromPrm = function(text, parameter) {
			const x = text.split(" " + parameter + "(");
			if(x.length === 1) {
				return [];
			}
			return x[1].split(")")[0];
		};
		// func(XXX) のXXXの中を抜き出して数値化
		const getNumberFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return [];
			}
			return toNumberArray(value);
		};
		// func(XXX) のXXXの中を抜き出して文字列取得
		const getURLFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return null;
			}
			const x = value.split("\"");
			if(x.length !== 3) {
				return null;
			}
			return x[1];
		};
		for(let i = 0;i < lines.length; i++) {
			const trim_line = lines[i].replace(/^\s+|\s+$/g, "");
			const first = trim_line.split(" ")[0];
			if ( trim_line.indexOf("{") !== -1) {
				// 階層に入る前の位置を保存
				block_stack.push(block_type);
				block_type = first;
				continue;
			}
			else if( trim_line.indexOf("}") !== -1) {
				block_type = block_stack.pop();
				continue;
			}
			if(	(block_type === "Thumbnail") || 
				(block_type === "none")) {
				continue;
			}
			if(block_type === "Material") {
				const material_name = first.replace(/"/g, "");
				const material = sys.createMaterial();
				material.setName(material_name);
				let val;
				val = getNumberFromPrm(trim_line, "col");
				if(val.length !== 0) {
					material.setColor(new S3Vector(val[0], val[1], val[2], val[3]));
				}
				val = getNumberFromPrm(trim_line, "dif");
				if(val.length !== 0) {
					material.setDiffuse(val[0]);
				}
				val = getNumberFromPrm(trim_line, "amb");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "amb_col");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "emi");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "emi_col");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "spc");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "spc_col");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "power");
				if(val.length !== 0) {
					material.setPower(val[0]);
				}
				val = getNumberFromPrm(trim_line, "reflect");
				if(val.length !== 0) {
					material.setReflect(val[0]);
				}
				val = getURLFromPrm(trim_line, "tex");
				if(val) {
					material.setTextureColor(parent_dir + val);
				}
				val = getURLFromPrm(trim_line, "bump");
				if(val) {
					material.setTextureNormal(parent_dir + val);
				}
				mesh.addMaterial(material);
			}
			else if(block_type === "vertex") {
				const words = toNumberArray(trim_line);
				const vector = new S3Vector(words[0], words[1], words[2]);
				const vertex = sys.createVertex(vector);
				mesh.addVertex(vertex);
			}
			else if(block_type === "face") {
				const facenum = parseInt(first);
				const v		= getNumberFromPrm(trim_line, "V");
				const uv_a	= getNumberFromPrm(trim_line, "UV");
				const uv		= [];
				let material= getNumberFromPrm(trim_line, "M");
				material = (material.length === 0) ? 0 : material[0];
				if(uv_a.length !== 0) {
					for(let j = 0; j < facenum; j++) {
						uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
					}
				}
				for(let j = 0;j < facenum - 2; j++) {
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, v, material, uv)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, v, material, uv);
					mesh.addTriangleIndex(ti);
				}
			}
		}
		return true;
	},

	/**
	 * メタセコイア形式で出力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @returns {String}
	 */
	output : function(mesh) {
		const output = [];
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		
		// 材質の出力
		output.push("Material " + material.length + " {");
		for(let i = 0; i < material.length; i++) {
			const mv = material[i];
			//  こんな感じにする必要がある・・・
			// "mat" shader(3) col(1.000 1.000 1.000 0.138) dif(0.213) amb(0.884) emi(0.301) spc(0.141) power(38.75) amb_col(1.000 0.996 0.000) emi_col(1.000 0.000 0.016) spc_col(0.090 0.000 1.000) reflect(0.338) refract(2.450)
			output.push("\t\"" + mv.name + "\" col(1.000 1.000 1.000 1.000) dif(0.800) amb(0.600) emi(0.000) spc(0.000) power(5.00)");
		}
		output.push("}");
		
		// オブジェクトの出力
		output.push("Object \"obj1\" {");
		{
			// 頂点の出力
			output.push("\tvertex " + vertex.length + " {");
			for(let i = 0; i < vertex.length; i++) {
				const vp = vertex[i].position;
				output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
			}
			output.push("}");

			// 面の定義
			output.push("\tface " + triangleindex.length + " {");
			for(let i = 0; i < triangleindex.length; i++) {
				const ti = triangleindex[i];
				let line = "\t\t3";
				// 座標と材質は必ずある
				line += " V(" + ti.index[0] + " " + ti.index[1] + " " + ti.index[2] + ")";
				line += " M(" + ti.materialIndex + ")";
				// UVはないかもしれないので、条件を付ける
				if((ti.uv !== undefined) && (ti.uv[0] !== null)) {
					line += " UV(" + ti.uv[0] + " " + ti.uv[1] + " " + ti.uv[2] +")";
				}
				output.push(line);
			}
		}
		output.push("\t}");
		
		output.push("}");
		return output.join("\n");
	}

};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3MeshLoaderOBJ = {

	name : "OBJ",

	/**
	 * Wavefront OBJ形式で入力
	 * v 頂点
	 * vt テクスチャ
	 * vn テクスチャ 
	 * f 面
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		const trim = function(str) {
			return(str.replace(/^\s+|\s+$/g, ""));
		};
		
		// 文字列解析
		const lines = text.split("\n");
		const v_list = [];
		const face_v_list = [];
		for(let i = 0; i < lines.length; i++) {
			// コメントより前の文字を取得
			const line = trim(lines[i].split("#")[0]);
			
			if(line.length === 0) {
				// 空白なら何もしない
				continue;
			}
			
			const data = line.split(" ");
			if(data[0] === "v") {
				// vertex
				const v = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				v_list.push(v);
			}
			else if(data[1] === "vt") {
				// texture
				const vt = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				
			}
			else if(data[2] === "vn") {
				// normal
				const vn = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
			}
			else if(data[0] === "f") {
				// face
				const vcount = data.length - 3; // 繰り返す回数
				for(let j = 0;j < vcount; j++) {
					const fdata = [];
					if((j % 2) === 0) {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					else {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					const face_v = [];
					const face_vt = [];
					const face_vn = [];
					// 数字は1から始まるので、1を引く
					for(let k = 0;k < 3; k++) {
						const indexdata = fdata[k].split("/");
						if(indexdata.length === 1) {
							// 頂点インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
						}
						else if(indexdata.length === 2) {
							// 頂点テクスチャ座標インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
							face_vt[k]	= parseInt(indexdata[1], 10) - 1;
						}
						else if(indexdata.length === 3) {
							if(indexdata[1].length !== 0) {
								// 頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= parseInt(indexdata[1], 10) - 1;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
							else {
								// テクスチャ座標インデックス無しの頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= null;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
						}
					}
					face_v_list.push(face_v);
				}
			}
		}
		
		// 変換
		// マテリアルの保存
		const material = sys.createMaterial();
		mesh.addMaterial(material);
		// 頂点の保存
		for(let i = 0; i < v_list.length; i++) {
			const vertex = sys.createVertex(v_list[i]);
			mesh.addVertex(vertex);
		}
		// インデックスの保存
		for(let i = 0; i < face_v_list.length; i++) {
			const triangle = sys.createTriangleIndex(0, 1, 2, face_v_list[i], 0);
			mesh.addTriangleIndex(triangle);
		}
		
		return true;
	}
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3MeshLoader = {

	// 他のファイルの読み書きの拡張用
	inputData: function(s3system, data, type) {
		const s3mesh = s3system.createMesh();
		const load = function(ldata, ltype, url) {
			s3mesh._init();
			const isLoad = S3MeshLoader._DATA_INPUT_FUNCTION[ltype](s3system, s3mesh, ldata, url);
			s3mesh.setComplete(isLoad);
		};
		if(((typeof data === "string")||(data instanceof String))&&((data.indexOf("\n") === -1))) {
			// 1行の場合はURLとみなす（雑）
			const downloadCallback = function(text) {
				load(text, type, data);
			};
			s3system._download(data, downloadCallback);
		}
		else {
			load(data, type, "");
		}
		return s3mesh;
	},
	
	outputData: function(s3mesh, type) {
		return S3MeshLoader._DATA_OUTPUT_FUNCTION[type](s3mesh);
	}

};

S3MeshLoader.TYPE = {
	JSON : S3MeshLoaderJSON.name,
	MQO : S3MeshLoaderMQO.name,
	OBJ : S3MeshLoaderOBJ.name
};

S3MeshLoader._DATA_INPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.input;
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.input;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderOBJ.name] = S3MeshLoaderOBJ.input;

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class S3Plane {
    
	/**
     * 面を作成する。
     * @param {S3Vector} n 面の法線
     * @param {Number|S3Vector} d 原点からの距離 | 面の中のある点
     */
	constructor(n , d) {
		if(d instanceof S3Vector) {
			this.n = n;
			this.d = this.n.dot(d);
		}
		else {
			this.n = n;
			this.d = d;
		}
	}
	
	/**
	 * 任意の点から平面への距離を求めます。
	 * @param {S3Vector} position
	 * @return {Number}
	 */
	getDistance(position) {
		return (position.dot(this.n) - this.d);
	}

	/**
	 * 任意の点から一番近い平面上の点を求めます。
	 * @param {S3Vector} position
	 * @return {S3Vector}
	 */
	getNearestPoint(position) {
		return this.n.mul(- this.getDistance(position)).add(position);
	}

	/**
	 * 面の内側にあるかどうか判定する
	 * @param {S3Vector} position
	 * @return {Boolean}
	 */
	isHitPosition(position) {
		return this.getDistance(position) < 0;
	}

	/**
	 * 文字列に変換します。
	 */
	toString() {
		return "Plane("+ this.n.toString() +", ["+this.d+"])";
	}


    
}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

class CameraController {

	constructor() {
		this.mouse		= new Device.Touch();
		this.moveDistance	= 4.0;
		this.moveRotate		= 0.5;
		this.moveTranslateRelative	= 0.1;
	}

	setCanvas(element) {
		this.mouse.setListenerOnElement(element);
	}

	setCamera(camera) {
		this.camera = camera.clone();
	}

	getCamera() {
		const data = new Device.Touch();
		this.mouse.pickInput(data);
		{
			this.camera.translateRelative(
				new S3Vector(
					- data.left.dragged.x * this.moveTranslateRelative,
					data.left.dragged.y * this.moveTranslateRelative,
					0
				)
			);
		}
		{
			this.camera.addRotateY(   data.right.dragged.x * this.moveRotate );
			this.camera.addRotateX( - data.right.dragged.y * this.moveRotate );
		}
		{
			let distance = this.camera.getDistance();
			const l = data.wheelrotation;
			distance -= l * this.moveDistance * Math.log(distance);
			this.camera.setDistance(distance);
		}
		return this.camera;
	}

}

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3 = {
	
	System : S3System,
	GLSystem : S3GLSystem,
	Math : S3Math,
	Angles : S3Angles,
	Vector : S3Vector,
	Matrix : S3Matrix,
	Plane : S3Plane,

	SYSTEM_MODE : S3System.SYSTEM_MODE,
	DEPTH_MODE : S3System.DEPTH_MODE,
	DIMENSION_MODE : S3System.DIMENSION_MODE,
	VECTOR_MODE : S3System.VECTOR_MODE,
	FRONT_FACE : S3System.FRONT_FACE,
	CULL_MODE : S3System.CULL_MODE,
	LIGHT_MODE : S3Light.MODE,
	MESH_TYPE : S3MeshLoader.TYPE,
	
	MeshLoader : S3MeshLoader,
	CameraController : CameraController,
	
};

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Senko = {

	_toString: function(text_obj) {
		let text;
		if((typeof text_obj === "string")||(text_obj instanceof String)) {
			if(text_obj.length === 0) {
				// Edge だと console.log("") でエラー表示になるため
				text = " ";
			}
			else {
				text = text_obj;
			}
		}
		else if(typeof text_obj === "undefined") {
			text = typeof text_obj;
		}
		else if(text_obj === null) {
			text = text_obj;
		}
		else if(typeof text_obj.toString === "function") {
			text = text_obj.toString();
		}
		return text;
	},

	println: function(text_obj) {
		const out = console;
		const text = Senko._printbuffer + Senko._toString(text_obj);
		Senko._printbuffer = "";
		out.log(text);
	},
	
	print: function(text_obj) {
		Senko._printbuffer += Senko._toString(text_obj);
	},
	
	printf: function() {
		const x = [];
		for(let i = 0 ; i < arguments.length ; i++) {
			x[i] = arguments[i];
		}
		Senko.print(Senko.format.apply(this, x));
	}
};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File$1;
Senko.HashMap = HashMap;
Senko.format = Format.format;
Senko.Number = SNumber;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;
Senko.S3 = S3;

export default Senko;
