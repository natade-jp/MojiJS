/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ArrayList = function ArrayList() {
	var arguments$1 = arguments;

	this.element = [];
	if(arguments.length === 1) {
		for(var i = 0; i < arguments[0].element.length; i++) {
			this.element[i] = arguments$1[0].element[i];
		}
	}
};

ArrayList.prototype.each = function each (func) {
	var out = true;
	for(var i = 0; i < this.element.length; i++) {
		var x = this.element[i];
		if(func.call(x, i, x) === false) {
			out = false;
			break;
		}
	}
	return out;
};
	
ArrayList.prototype.toString = function toString () {
	return this.join(", ");
};
	
ArrayList.prototype.isEmpty = function isEmpty () {
	return this.element.length === 0;
};
	
ArrayList.prototype.contains = function contains (object) {
	return this.element.contains(object);
};
	
ArrayList.prototype.size = function size () {
	return this.element.length;
};
	
ArrayList.prototype.clear = function clear () {
	this.element.length = 0;
};
	
ArrayList.prototype.join = function join (separator) {
	if(arguments.length === 0) {
		separator = ",";
	}
	return this.element.join(separator);
};
	
ArrayList.prototype.clone = function clone () {
	var out = new ArrayList();
	for(var i = 0; i < this.element.length; i++) {
		out.element[i] = this.element[i];
	}
	return out;
};
	
ArrayList.prototype.indexOf = function indexOf (object) {
	for(var i = 0; i < this.element.length; i++) {
		if(this.element[i] === object) {
			return i;
		}
	}
	return -1;
};
	
ArrayList.prototype.lastIndexOf = function lastIndexOf (object) {
	for(var i = this.element.length - 1; i !== -1; i--) {
		if(this.element[i] === object) {
			return i;
		}
	}
	return -1;
};
	
ArrayList.prototype.get = function get (index) {
	return this.element[index];
};
	
ArrayList.prototype.add = function add () {
	if(arguments.length === 1) {
		var object = arguments[0];
		this.element.push(object);
	}
	else if(arguments.length === 2) {
		var index = arguments[0];
		var object$1 = arguments[1];
		this.element.splice(index, 0, object$1);
	}
};
	
ArrayList.prototype.addAll = function addAll () {
	if(arguments.length === 1) {
		var list  = arguments[0];
		var j = this.element.length;
		for(var i = 0; i < list.length; i++) {
			this.element[j++] = list.element[i];
		}
	}
	else if(arguments.length === 2) {
		var index = arguments[0];
		var list$1  = arguments[1].element;
		if(list$1 === this.element) {
			list$1 = this.element.slice(0);
		}
		var size = this.element.length - index;
		var target_i = this.element.length + list$1.length - 1;
		var source_i = this.element.length - 1;
		for(var i$1 = 0; i$1 < size ; i$1++ ) {
			this.element[target_i--] = this.element[source_i--];
		}
		size = list$1.length;
		for(var i$2 = 0; i$2 < size; i$2++) {
			this.element[index++] = list$1[i$2];
		}
	}
};
	
ArrayList.prototype.set = function set (index, object) {
	this.element[index] = object;
};
	
ArrayList.prototype.remove = function remove (index) {
	this.element.splice(index, 1);
};
	
ArrayList.prototype.removeRange = function removeRange (fromIndex, toIndex) {
	this.element.splice(fromIndex, toIndex - fromIndex);
};
	
ArrayList.prototype.sort = function sort (compareFunction) {
	var compare;
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
	var temp = [];
	// ソート関数（安定マージソート）
	var sort = function(element, first, last, cmp_function) { 
		if(first < last) {
			var middle = Math.floor((first + last) / 2);
			sort(element, first, middle, cmp_function);
			sort(element, middle + 1, last, cmp_function);
			var p = 0, i, j, k;
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

// 色を扱うクラス
//
// 【参考】
// HSV色空間 / HLS色空間
// https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93
// https://ja.wikipedia.org/wiki/HLS%E8%89%B2%E7%A9%BA%E9%96%93

var Color = function Color() {
	// 中身は 0 ~ 1に正規化した値とする
	this.r = 0.0;
	this.g = 0.0;
	this.b = 0.0;
	this.a = 1.0;
};
	
Color.prototype.clone = function clone () {
	var color = new Color();
	color.r = this.r;
	color.g = this.g;
	color.b = this.b;
	color.a = this.a;
	return color;
};

Color.prototype.toString = function toString () {
	return "Color[" +
			this.getCSSHex() + ", " +
			this.getCSS255() + ", " +
			this.getCSSPercent() + "]";
};
	
Color._flact = function _flact (x) {
	return(x - Math.floor(x));
};

Color._hex = function _hex (x) {
	x = Math.round(x * 255.0).toString(16);
	if(x.length === 1) {
		return "0" + x;
	}
	else {
		return x;
	}
};

Color.prototype._setRGB = function _setRGB (r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	if(a) { this.a = a; }
	return this;
};

Color.prototype._setHSV = function _setHSV (h, s, v, a) {
	var i, f;

	this.r = v;
	this.g = v;
	this.b = v;
	if(a) { this.a = a; }

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
};

Color.prototype._setHSL = function _setHSL (h, s, l, a) {

	if(a) { this.a = a; }

	if(s === 0.0) {
		this.r = 0.0;
		this.g = 0.0;
		this.b = 0.0;
		return this;
	}

	var max;
	if(l < 0.5) {
		max = l * (1.0 + s);
	}
	else {
		max = l * (1.0 - s) + s;
	}
	var min = 2.0 * l - max;
	var delta = max - min;

	h *= 6.0;
	var i = ~~Math.floor(h);
	var f = h - i;

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
};

Color.prototype._getRGB = function _getRGB () {
	return {
		r : this.r,
		g : this.g,
		b : this.b,
		a : this.a
	};
};

Color.prototype._getHSV = function _getHSV () {
	var max = Math.max( this.r, this.g, this.b );
	var min = Math.min( this.r, this.g, this.b );
	var delta = max - min;

	var h   = 0;
	var s   = max - min;
	var v = max;

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
};

Color.prototype._getHSL = function _getHSL () {

	var max   = Math.max( this.r, this.g, this.b );
	var min   = Math.min( this.r, this.g, this.b );

	var l = (max + min) * 0.5;
	var delta = max - min;

	if(delta === 0) {
		return [0, l, 0];
	}

	var s;
	if(l < 0.5) {
		s = delta / (max + min);
	}
	else {
		s = delta / (2.0 - max - min);
	}

	var h;
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
};

Color.prototype.getNormalizedRGB = function getNormalizedRGB () {
	return this._getRGB();
};

Color.prototype.getRGB = function getRGB () {
	return {
		r : Math.round(this.r * 255.0),
		g : Math.round(this.g * 255.0),
		b : Math.round(this.b * 255.0),
		a : Math.round(this.a * 255.0)
	};
};

Color.prototype.getRGB24 = function getRGB24 () {
	return((Math.round(255.0 * this.r) << 16) |
			(Math.round(255.0 * this.g) << 8 ) |
			(Math.round(255.0 * this.b)      ));
};

Color.prototype.getRGB32 = function getRGB32 () {
	return( (Math.round(255.0 * this.a) << 24) |
			(Math.round(255.0 * this.r) << 16) |
			(Math.round(255.0 * this.g) << 8 ) |
			(Math.round(255.0 * this.b)      ));
};

Color.prototype.getNormalizedHSV = function getNormalizedHSV () {
	return this._getHSV();
};

Color.prototype.getHSV = function getHSV () {
	var color = this.getNormalizedHSV();
	color.h = Math.round(color.h * 360.0);
	color.s = Math.round(color.s * 255.0);
	color.v = Math.round(color.v * 255.0);
	color.a = Math.round(color.a * 255.0);
	return color;
};

Color.prototype.getNormalizedHSL = function getNormalizedHSL () {
	return this._getHSL();
};

Color.prototype.getHSL = function getHSL () {
	var color = this.getNormalizedHSL();
	color.h = Math.round(color.h * 360.0);
	color.s = Math.round(color.s * 255.0);
	color.l = Math.round(color.l * 255.0);
	color.a = Math.round(color.a * 255.0);
	return color;
};

Color.prototype.getRed = function getRed () {
	return Math.round(this.r * 255.0);
};

Color.prototype.getGreen = function getGreen () {
	return Math.round(this.g * 255.0);
};

Color.prototype.getBlue = function getBlue () {
	return Math.round(this.b * 255.0);
};

Color.prototype.getAlpha = function getAlpha () {
	return Math.round(this.b * 255.0);
};

Color.prototype.brighter = function brighter () {
	var FACTOR = 1.0 / 0.7;
	var color = new Color();
	color.r = Math.min( this.r * FACTOR, 1.0);
	color.g = Math.min( this.g * FACTOR, 1.0);
	color.b = Math.min( this.b * FACTOR, 1.0);
	color.a = this.a;
	return color;
};

Color.prototype.darker = function darker () {
	var FACTOR = 0.7;
	var color = new Color();
	color.r = Math.max( this.r * FACTOR, 0.0);
	color.g = Math.max( this.g * FACTOR, 0.0);
	color.b = Math.max( this.b * FACTOR, 0.0);
	color.a = this.a;
	return color;
};

Color.prototype.getCSSHex = function getCSSHex () {
	if(this.a === 1.0) {
		return "#" +
			Color._hex(this.r) + 
			Color._hex(this.g) +
			Color._hex(this.b);
	}
	else {
		return "#" +
			Color._hex(this.a) + 
			Color._hex(this.r) + 
			Color._hex(this.g) +
			Color._hex(this.b);
	}
};

Color.prototype.getCSS255 = function getCSS255 () {
	if(this.a === 1.0) {
		return "rgb(" +
		Math.round(this.r * 255) + "," +
		Math.round(this.g * 255) + "," +
		Math.round(this.b * 255) + ")";
	}
	else {
		return "rgba(" +
		Math.round(this.r * 255) + "," +
		Math.round(this.g * 255) + "," +
		Math.round(this.b * 255) + "," +
		this.a + ")";
	}
};

Color.prototype.getCSSPercent = function getCSSPercent () {
	if(this.a === 1.0) {
		return "rgb(" +
		Math.round(this.r * 100) + "%," +
		Math.round(this.g * 100) + "%," +
		Math.round(this.b * 100) + "%)";
	}
	else {
		return "rgba(" +
		Math.round(this.r * 100) + "%," +
		Math.round(this.g * 100) + "%," +
		Math.round(this.b * 100) + "%," +
		Math.round(this.a * 100) + "%)";
	}
};

Color.newColorNormalizedRGB = function newColorNormalizedRGB () {
	var r = 0.0;
	var g = 0.0;
	var b = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].r) { r = arguments[0].r; }
		if(arguments[0].g) { g = arguments[0].g; }
		if(arguments[0].b) { b = arguments[0].b; }
		if(arguments[0].a) { a = arguments[0].a; }
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
	var color = new Color();
	color.r = Math.min(Math.max(r, 0.0), 1.0);
	color.g = Math.min(Math.max(g, 0.0), 1.0);
	color.b = Math.min(Math.max(b, 0.0), 1.0);
	color.a = Math.min(Math.max(a, 0.0), 1.0);
	return color;
};
	
Color.newColorRGB = function newColorRGB () {
	var r = 0.0;
	var g = 0.0;
	var b = 0.0;
	var a = 255.0;
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
			if(arguments[0].r) { r = arguments[0].r; }
			if(arguments[0].g) { g = arguments[0].g; }
			if(arguments[0].b) { b = arguments[0].b; }
			if(arguments[0].a) { a = arguments[0].a; }
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
	var color = new Color();
	color.r = Math.min(Math.max(r / 255.0, 0.0), 1.0);
	color.g = Math.min(Math.max(g / 255.0, 0.0), 1.0);
	color.b = Math.min(Math.max(b / 255.0, 0.0), 1.0);
	color.a = Math.min(Math.max(a / 255.0, 0.0), 1.0);
	return color;
};

Color.newColorNormalizedHSV = function newColorNormalizedHSV () {
	var h = 0.0;
	var s = 0.0;
	var v = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].h) { h = arguments[0].h; }
		if(arguments[0].s) { s = arguments[0].s; }
		if(arguments[0].v) { v = arguments[0].v; }
		if(arguments[0].a) { a = arguments[0].a; }
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
	s = Math.min(Math.max(s, 0.0), 1.0);
	v = Math.min(Math.max(v, 0.0), 1.0);
	a = Math.min(Math.max(a, 0.0), 1.0);
	var color = new Color();
	color._setHSV( Color._flact(h), s, v, a );
	return color;
};

Color.newColorHSV = function newColorHSV () {
	var h = 0.0;
	var s = 0.0;
	var v = 0.0;
	var a = 255.0;
	if(arguments.length === 1) {
		if(arguments[0].h) { h = arguments[0].h; }
		if(arguments[0].s) { s = arguments[0].s; }
		if(arguments[0].v) { v = arguments[0].v; }
		if(arguments[0].a) { a = arguments[0].a; }
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
};

Color.newColorNormalizedHSL = function newColorNormalizedHSL () {
	var h = 0.0;
	var s = 0.0;
	var l = 0.0;
	var a = 1.0;
	if(arguments.length === 1) {
		if(arguments[0].h) { h = arguments[0].h; }
		if(arguments[0].s) { s = arguments[0].s; }
		if(arguments[0].l) { l = arguments[0].l; }
		if(arguments[0].a) { a = arguments[0].a; }
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
	s = Math.min(Math.max(s, 0.0), 1.0);
	l = Math.min(Math.max(l, 0.0), 1.0);
	a = Math.min(Math.max(a, 0.0), 1.0);
	var color = new Color();
	color._setHSL( Color._flact(h), s, l, a );
	return color;
};

Color.newColorHSL = function newColorHSL () {
	var h = 0.0;
	var s = 0.0;
	var l = 0.0;
	var a = 255.0;
	if(arguments.length === 1) {
		if(arguments[0].h) { h = arguments[0].h; }
		if(arguments[0].s) { s = arguments[0].s; }
		if(arguments[0].l) { l = arguments[0].l; }
		if(arguments[0].a) { a = arguments[0].a; }
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
};

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

var CSVTool = {
	
	parseCSV: function(text, separator) {
		if(arguments.length < 2) {
			separator = ",";
		}
		// 改行コードの正規化
		text = text.replace(/\r\n?|\n/g, "\n");
		var CODE_SEPARATOR = separator.charCodeAt(0);
		var CODE_CR    = 0x0D;
		var CODE_LF    = 0x0A;
		var CODE_DOUBLEQUOTES = 0x22;
		var out = [];
		var length = text.length;
		var element = "";
		var count_rows    = 0;
		var count_columns = 0;
		var isnextelement = false;
		var isnextline    = false;
		for(var i = 0; i < length; i++) {
			var code = text.charCodeAt(i);
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
		var out = "";
		var escape = /["\r\n,\t]/;
		if(text !== undefined) {
			for(var i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(var j = 0;j < text[i].length;j++) {
						var element = text[i][j];
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

var File$1 = function File(pathname) {
	this.isHTML = (typeof window !== "undefined");
	this.isNode = false;
	if(arguments.length !== 1) {
		throw "IllegalArgumentException";
	}
	else if((typeof pathname === "string")||(pathname instanceof String)) {
		// \を/に置き換える
		this.pathname = pathname.replace(/\\/g, "/" );
	}
	else if(pathname instanceof File) {
		this.pathname = pathname.getAbsolutePath();
	}
	else {
		throw "IllegalArgumentException";
	}
};

File$1.prototype.delete_ = function delete_ () {
	throw "IllegalMethod";
};
	
File$1.prototype.exists = function exists () {
	throw "IllegalMethod";
};
	
File$1.prototype.copy = function copy () {
	throw "IllegalMethod";
};
	
File$1.prototype.move = function move () {
	throw "IllegalMethod";
};
	
File$1.prototype.toString = function toString () {
	return this.getAbsolutePath();
};
	
File$1.prototype.getName = function getName () {
	if(this.isHTML) {
		// 最後がスラッシュで終えている場合は、ファイル名取得できない
		if(this.isDirectory()) {
			return "";
		}
		var slashsplit = this.pathname.split("/");
		return slashsplit[slashsplit.length - 1];
	}
	else if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
// 親フォルダの絶対パス名
File$1.prototype.getParent = function getParent () {
	var x = this.getAbsolutePath().match(/.*[/\\]/)[0];
	return x.substring(0 ,x.length - 1);
};
	
File$1.prototype.getParentFile = function getParentFile () {
	return new File$1(this.getParent());
};
	
File$1.prototype.getExtensionName = function getExtensionName () {
	if(this.isHTML) {
		var dotlist = this.getName().split(".");
		return dotlist[dotlist.length - 1];
	}
	else if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.isAbsolute = function isAbsolute () {
	if(this.isHTML) {
		return this.getAbsolutePath() === this.pathname;
	}
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.isDirectory = function isDirectory () {
	if(this.isHTML) {
		// 最後がスラッシュで終えている場合はディレクトリ
		return /\/$/.test(this.pathname);
	}
	else if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.isFile = function isFile () {
	if(this.isHTML) {
		// 最後がスラッシュで終えていない場合はファイル
		return /[^/]$/.test(this.pathname);
	}
	else if(this.isNode) {
		throw "IllegalMethod";
	}
};
File$1.prototype.isHidden = function isHidden () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.lastModified = function lastModified () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.setLastModified = function setLastModified () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.length = function length () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.getFiles = function getFiles () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.getSubFolders = function getSubFolders () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.getNormalizedPathName = function getNormalizedPathName () {
	if(this.pathname === "") {
		return ".\\";
	}
	var name = this.pathname.replace(/\//g, "\\");
	if(name.slice(-1) !== "\\") {
		name += "\\";
	}
	return name;
};
	
File$1.prototype.getAllFiles = function getAllFiles () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.list = function list () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.getAbsolutePath = function getAbsolutePath () {
	if(this.isHTML) {
		var all_path = null;
		// URLを一度取得する
		if(/^http/.test(this.pathname)) {
			all_path = this.pathname;
		}
		else {
			var curdir = window.location.toString();
			// 最後がスラッシュで終えていないは、ファイル部分を削る
			if(!(/\/$/.test(curdir))) {
				curdir = curdir.match(/.*\//)[0];
			}
			all_path = curdir + this.pathname;
		}
		// ホストとファイルに分ける
		var hosttext = all_path.match(/^http[^/]+\/\/[^/]+\//)[0];
		var filetext = all_path.substr(hosttext.length);
		// パスを1つずつ解析しながら辿っていく
		var name = hosttext;
		var namelist = filetext.split("/");
		var i;
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
};
	
File$1.prototype.mkdir = function mkdir () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.mkdirs = function mkdirs () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.renameTo = function renameTo () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.run = function run () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.writeLine = function writeLine () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.download = function download (callback) {
	if(this.isHTML) {
		var ext = this.getExtensionName().toLocaleString();
		var that = this;
		if((ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg")) {
			var image = new Image();
			image.onload = function() {
				that.dataImage = image;
				callback(that);
			};
			image.src = this.pathname;
		}
		else {
			var http = File$1.createXMLHttpRequest();
			if(http === null) {
				return null;
			}
			var handleHttpResponse = function (){
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
};
	
File$1.prototype.getImage = function getImage () {
	if(this.isHTML) {
		return this.dataImage;
	}
};
	
File$1.prototype.getText = function getText () {
	if(this.isHTML) {
		return this.dataText;
	}
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.setText = function setText () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.prototype.getCSV = function getCSV (separator, charset, newline) {
	if(this.isHTML) {
		return(CSVTool.parseCSV(this.dataText, separator, newline));
	}
	else if(this.isNode) {
		throw "IllegalMethod";
	}
};

File$1.prototype.setCSV = function setCSV () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};

File$1.prototype.getByte = function getByte () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};

File$1.prototype.setByte = function setByte () {
	if(this.isNode) {
		throw "IllegalMethod";
	}
};
	
File$1.createTempFile = function createTempFile (){
	var isHTML = (typeof window !== "undefined");
	if(isHTML) {
		throw "not createTempFile";
	}
};
	
File$1.getCurrentDirectory = function getCurrentDirectory (){
	var isHTML = (typeof window !== "undefined");
	if(isHTML) {
		var file = new File$1("./");
		return file.getParent();
	}
};
	
File$1.setCurrentDirectory = function setCurrentDirectory () {
	var isHTML = (typeof window !== "undefined");
	if(isHTML) {
		throw "not setCurrentDirectory";
	}
};
	
File$1.searchFile = function searchFile (){
	var isHTML = (typeof window !== "undefined");
	if(isHTML) {
		throw "not searchFile";
	}
};
	
File$1.downloadFileList = function downloadFileList (files, lastCallback, fileCallback) {
	var downloadcount = 0;
	var i;
	var inf = function(filenumber) {
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
};

File$1.createXMLHttpRequest = function createXMLHttpRequest () {
	return new XMLHttpRequest();
};
	
File$1.getCSVTool = function getCSVTool () {
	return CSVTool;
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

var HashMap = function HashMap() {
	var arguments$1 = arguments;

	this.map = [];
	this.size_ = 0;
	if(arguments.length === 1) {
		for(var key in arguments[0].map) {
			this.map[key] =arguments$1[0].map[key];
		}
		this.size_ = arguments[0].size_;
	}
};

HashMap.prototype.each = function each (func) {
	var out = true;
	for(var key in this.map) {
		var x = this.map[key];
		if(func.call(x, key, x) === false) {
			out = false;
			break;
		}
	}
	return out;
};
	
HashMap.prototype.toString = function toString () {
	var output = "";
	var i = 0;
	for(var key in this.map) {
		output += key + "=>" + this.map[key];
		i++;
		if(i !== this.size_) {
			output += "\n";
		}
	}
	return output;
};
	
HashMap.prototype.containsKey = function containsKey (key) {
	return (typeof this.map[key] !== "undefined");
};
	
HashMap.prototype.containsValue = function containsValue (value) {
	for(var key in this.map) {
		if(this.map[key] === value) {
			return true;
		}
	}
	return false;
};
	
HashMap.prototype.isEmpty = function isEmpty () {
	return (this.size_ === 0);
};
	
HashMap.prototype.clear = function clear () {
	this.map   = [];
	this.size_ = 0;
};
	
HashMap.prototype.clone = function clone () {
	var out = new HashMap();
	for(var key in this.map) {
		out.map[key] = this.map[key];
	}
	out.size_ = this.size_;
	return out;
};
	
HashMap.prototype.size = function size () {
	return this.size_;
};
	
HashMap.prototype.get = function get (key) {
	return this.map[key];
};
	
HashMap.prototype.put = function put (key, value) {
	if(this.containsKey(key) === false) {
		this.map[key] = value;
		this.size_ = this.size_ + 1;
		return null;
	}
	else {
		var output = this.map[key];
		this.map[key] = value;
		return output;
	}
};
	
HashMap.prototype.putAll = function putAll (hashmap) {
	for(var key in hashmap.map) {
		if(typeof this.map[key] === "undefined") {
			this.map[key] = hashmap.map[key];
			this.size_ = this.size_ + 1;
		}
	}
};
	
HashMap.prototype.remove = function remove (key) {
	if(this.containsKey(key) === false) {
		return null;
	}
	else {
		var output = this.map[key];
		delete this.map[key];
		this.size_ = this.size_ - 1;
		return output;
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

var Text$1 = {

	/**
	 * サロゲートペアの上位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isHighSurrogateAt : function(text, index) {
		var ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDBFF));
	},

	/**
	 * サロゲートペアの下位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isLowSurrogateAt : function(text, index) {
		var ch = text.charCodeAt(index);
		return ((0xDC00 <= ch) && (ch <= 0xDFFF));
	},
	
	/**
	 * サロゲートペアか
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isSurrogatePairAt : function(text, index) {
		var ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDFFF));
	},
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	codePointAt : function(text, index) {
		if(this.isHighSurrogateAt(text, index)) {
			var high = text.charCodeAt(index);
			var low  = text.charCodeAt(index + 1);
			return ((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
		}
		else {
			return (text.charCodeAt(index));
		}
	},
	
	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	codePointBefore : function(text, index) {
		if(!this.isLowSurrogateAt(text, index - 1)) {
			return (text.charCodeAt(index - 1));
		}
		else {
			return (text.codePointAt(index - 2));
		}
	},

	/**
	 * コードポイント換算で文字列数を調査する
	 * @param {String} text 対象テキスト
	 * @param {Number} beginIndex 最初のインデックス（省略可）
	 * @param {Number} endIndex 最後のインデックス（ここは含めない）（省略可）
	 * @returns {Number} 文字数
	 */
	codePointCount : function(text, beginIndex, endIndex) {
		if(arguments.length < 2) {
			beginIndex = 0;
		}
		if(arguments.length < 3) {
			endIndex = text.length;
		}
		var count = 0;
		for(;beginIndex < endIndex;beginIndex++) {
			count++;
			if(this.isSurrogatePairAt(text, beginIndex)) {
				beginIndex++;
			}
		}
		return count;
	},

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {String} text 対象テキスト
	 * @param {Number} index オフセット
	 * @param {Number} codePointOffset ずらすコードポイント数
	 * @returns {Number} ずらしたインデックス
	 */
	offsetByCodePoints : function(text, index, codePointOffset) {
		var count = 0;
		if(codePointOffset === 0) {
			return (index);
		}
		if(codePointOffset > 0) {
			for(;index < text.length;index++) {
				count++;
				if(this.isHighSurrogateAt(text, index)) {
					index++;
				}
				if(count === codePointOffset) {
					return (index + 1);
				}
			}

		}
		else {
			codePointOffset = -codePointOffset;
			for(;index >= 0;index--) {
				count++;
				if(this.isLowSurrogateAt(text, index - 1)) {
					index--;
				}
				if(count === codePointOffset) {
					return (index - 1);
				}
			}
		}
		return false;
	},

	/**
	 * コードポイントの数値データを文字列へ変換します
	 * @param {Array} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	fromCodePoint : function() {
		var arguments$1 = arguments;

		var text = [];
		for(var i = 0;i < arguments.length;i++) {
			var codepoint = arguments$1[i];
			if(0x10000 <= codepoint) {
				var high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
				var low  = (codepoint & 0x3FF) + 0xDC00;
				text[text.length] = String.fromCharCode(high);
				text[text.length] = String.fromCharCode(low);
			}
			else {
				text[text.length] = String.fromCharCode(codepoint);
			}
		}
		return(text.join(""));
	},

	/**
	 * カタカナをひらがなにします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHiragana : function(text) {
		var func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0x0060));
		};
		return (text.replace(/[\u30A1-\u30F6]/g, func));
	},

	/**
	 * ひらがなをカタカナにします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toKatakana : function(text) {
		var func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0x0060));
		};
		return (text.replace(/[\u3041-\u3096]/g, func));
	},
	
	/**
	 * スペースを半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidthSpace : function(text) {
		return (text.replace(/\u3000/g, String.fromCharCode(0x0020)));
	},
	
	/**
	 * スペースを全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidthSpace : function(text) {
		return (text.replace(/\u0020/g, String.fromCharCode(0x3000)));
	},
	
	/**
	 * 英数記号を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidthAsciiCode : function(text) {
		var out = text;
		out = out.replace(/\u3000/g, "\u0020");				//全角スペース
		out = out.replace(/[\u2018-\u201B]/g, "\u0027");	//シングルクォーテーション
		out = out.replace(/[\u201C-\u201F]/g, "\u0022");	//ダブルクォーテーション
		var func = function(ch) {
			ch = ch.charCodeAt(0);
			return (String.fromCharCode(ch - 0xFEE0));
		};
		return (out.replace(/[\uFF01-\uFF5E]/g, func));
	},
	
	/**
	 * 英数記号を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidthAsciiCode : function(text) {
		var out = text;
		out = out.replace(/\u0020/g, "\u3000");	//全角スペース
		out = out.replace(/\u0022/g, "\u201D");	//ダブルクォーテーション
		out = out.replace(/\u0027/g, "\u2019");	//アポストロフィー
		var func = function(ch) {
			ch = ch.charCodeAt(0);
			return (String.fromCharCode(ch + 0xFEE0));
		};
		return (out.replace(/[\u0020-\u007E]/g, func));
	},
	
	/**
	 * 英語を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidthAlphabet : function(text) {
		var func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, func));
	},
	
	/**
	 * 英語を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidthAlphabet : function(text) {
		var func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[A-Za-z]/g, func));
	},
	
	/**
	 * 数値を半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidthNumber : function(text) {
		var func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF10-\uFF19]/g, func));
	},
	
	/**
	 * 数値を全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidthNumber : function(text) {
		var func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[0-9]/g, func));
	},
	
	/**
	 * カタカナを半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidthKana : function(text) {
		var map = {
			0x3001	:	"\uFF64"	,	//	､
			0x3002	:	"\uFF61"	,	//	。	｡
			0x300C	:	"\uFF62"	,	//	「	｢
			0x300D	:	"\uFF63"	,	//	」	｣
			0x309B	:	"\uFF9E"	,	//	゛	ﾞ
			0x309C	:	"\uFF9F"	,	//	゜	ﾟ
			0x30A1	:	"\uFF67"	,	//	ァ	ｧ
			0x30A2	:	"\uFF71"	,	//	ア	ｱ
			0x30A3	:	"\uFF68"	,	//	ィ	ｨ
			0x30A4	:	"\uFF72"	,	//	イ	ｲ
			0x30A5	:	"\uFF69"	,	//	ゥ	ｩ
			0x30A6	:	"\uFF73"	,	//	ウ	ｳ
			0x30A7	:	"\uFF6A"	,	//	ェ	ｪ
			0x30A8	:	"\uFF74"	,	//	エ	ｴ
			0x30A9	:	"\uFF6B"	,	//	ォ	ｫ
			0x30AA	:	"\uFF75"	,	//	オ	ｵ
			0x30AB	:	"\uFF76"	,	//	カ	ｶ
			0x30AC	:	"\uFF76\uFF9E"	,	//	ガ	ｶﾞ
			0x30AD	:	"\uFF77"	,	//	キ	ｷ
			0x30AE	:	"\uFF77\uFF9E"	,	//	ギ	ｷﾞ
			0x30AF	:	"\uFF78"	,	//	ク	ｸ
			0x30B0	:	"\uFF78\uFF9E"	,	//	グ	ｸﾞ
			0x30B1	:	"\uFF79"	,	//	ケ	ｹ
			0x30B2	:	"\uFF79\uFF9E"	,	//	ゲ	ｹﾞ
			0x30B3	:	"\uFF7A"	,	//	コ	ｺ
			0x30B4	:	"\uFF7A\uFF9E"	,	//	ゴ	ｺﾞ
			0x30B5	:	"\uFF7B"	,	//	サ	ｻ
			0x30B6	:	"\uFF7B\uFF9E"	,	//	ザ	ｻﾞ
			0x30B7	:	"\uFF7C"	,	//	シ	ｼ
			0x30B8	:	"\uFF7C\uFF9E"	,	//	ジ	ｼﾞ
			0x30B9	:	"\uFF7D"	,	//	ス	ｽ
			0x30BA	:	"\uFF7D\uFF9E"	,	//	ズ	ｽﾞ
			0x30BB	:	"\uFF7E"	,	//	セ	ｾ
			0x30BC	:	"\uFF7E\uFF9E"	,	//	ゼ	ｾﾞ
			0x30BD	:	"\uFF7F"	,	//	ソ	ｿ
			0x30BE	:	"\uFF7F\uFF9E"	,	//	ゾ	ｿﾞ
			0x30BF	:	"\uFF80"	,	//	タ	ﾀ
			0x30C0	:	"\uFF80\uFF9E"	,	//	ダ	ﾀﾞ
			0x30C1	:	"\uFF81"	,	//	チ	ﾁ
			0x30C2	:	"\uFF81\uFF9E"	,	//	ヂ	ﾁﾞ
			0x30C3	:	"\uFF6F"	,	//	ッ	ｯ
			0x30C4	:	"\uFF82"	,	//	ツ	ﾂ
			0x30C5	:	"\uFF82\uFF9E"	,	//	ヅ	ﾂﾞ
			0x30C6	:	"\uFF83"	,	//	テ	ﾃ
			0x30C7	:	"\uFF83\uFF9E"	,	//	デ	ﾃﾞ
			0x30C8	:	"\uFF84"	,	//	ト	ﾄ
			0x30C9	:	"\uFF84\uFF9E"	,	//	ド	ﾄﾞ
			0x30CA	:	"\uFF85"	,	//	ナ	ﾅ
			0x30CB	:	"\uFF86"	,	//	ニ	ﾆ
			0x30CC	:	"\uFF87"	,	//	ヌ	ﾇ
			0x30CD	:	"\uFF88"	,	//	ネ	ﾈ
			0x30CE	:	"\uFF89"	,	//	ノ	ﾉ
			0x30CF	:	"\uFF8A"	,	//	ハ	ﾊ
			0x30D0	:	"\uFF8A\uFF9E"	,	//	バ	ﾊﾞ
			0x30D1	:	"\uFF8A\uFF9F"	,	//	パ	ﾊﾟ
			0x30D2	:	"\uFF8B"	,	//	ヒ	ﾋ
			0x30D3	:	"\uFF8B\uFF9E"	,	//	ビ	ﾋﾞ
			0x30D4	:	"\uFF8B\uFF9F"	,	//	ピ	ﾋﾟ
			0x30D5	:	"\uFF8C"	,	//	フ	ﾌ
			0x30D6	:	"\uFF8C\uFF9E"	,	//	ブ	ﾌﾞ
			0x30D7	:	"\uFF8C\uFF9F"	,	//	プ	ﾌﾟ
			0x30D8	:	"\uFF8D"	,	//	ヘ	ﾍ
			0x30D9	:	"\uFF8D\uFF9E"	,	//	ベ	ﾍﾞ
			0x30DA	:	"\uFF8D\uFF9F"	,	//	ペ	ﾍﾟ
			0x30DB	:	"\uFF8E"	,	//	ホ	ﾎ
			0x30DC	:	"\uFF8E\uFF9E"	,	//	ボ	ﾎﾞ
			0x30DD	:	"\uFF8E\uFF9F"	,	//	ポ	ﾎﾟ
			0x30DE	:	"\uFF8F"	,	//	マ	ﾏ
			0x30DF	:	"\uFF90"	,	//	ミ	ﾐ
			0x30E0	:	"\uFF91"	,	//	ム	ﾑ
			0x30E1	:	"\uFF92"	,	//	メ	ﾒ
			0x30E2	:	"\uFF93"	,	//	モ	ﾓ
			0x30E3	:	"\uFF6C"	,	//	ャ	ｬ
			0x30E4	:	"\uFF94"	,	//	ヤ	ﾔ
			0x30E5	:	"\uFF6D"	,	//	ュ	ｭ
			0x30E6	:	"\uFF95"	,	//	ユ	ﾕ
			0x30E7	:	"\uFF6E"	,	//	ョ	ｮ
			0x30E8	:	"\uFF96"	,	//	ヨ	ﾖ
			0x30E9	:	"\uFF97"	,	//	ラ	ﾗ
			0x30EA	:	"\uFF98"	,	//	リ	ﾘ
			0x30EB	:	"\uFF99"	,	//	ル	ﾙ
			0x30EC	:	"\uFF9A"	,	//	レ	ﾚ
			0x30ED	:	"\uFF9B"	,	//	ロ	ﾛ
			0x30EE	:	"\uFF9C"	,	//	ヮ	ﾜ
			0x30EF	:	"\uFF9C"	,	//	ワ	ﾜ
			0x30F0	:	"\uFF72"	,	//	ヰ	ｲ
			0x30F1	:	"\uFF74"	,	//	ヱ	ｴ
			0x30F2	:	"\uFF66"	,	//	ヲ	ｦ
			0x30F3	:	"\uFF9D"	,	//	ン	ﾝ
			0x30F4	:	"\uFF73\uFF9E"	,	//	ヴ	ｳﾞ
			0x30F5	:	"\uFF76"	,	//	ヵ	ｶ
			0x30F6	:	"\uFF79"	,	//	ヶ	ｹ
			0x30F7	:	"\uFF9C\uFF9E"	,	//	ヷ	ﾜﾞ
			0x30F8	:	"\uFF72\uFF9E"	,	//	ヸ	ｲﾞ
			0x30F9	:	"\uFF74\uFF9E"	,	//	ヹ	ｴﾞ
			0x30FA	:	"\uFF66\uFF9E"	,	//	ヺ	ｦﾞ
			0x30FB	:	"\uFF65"	,	//	・	･
			0x30FC	:	"\uFF70"		//	ー	ｰ
		};
		var func = function(ch) {
			if(ch.length === 1) {
				return(map[ch.charCodeAt(0)]);
			}
			else {
				return(map[ch.charCodeAt(0)] + map[ch.charCodeAt(1)]);
			}
		};
		return (text.replace(/[\u3001\u3002\u300C\u300D\u309B\u309C\u30A1-\u30FC][\u309B\u309C]?/g, func));
	},

	/**
	 * カタカナを全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidthKana : function(text) {
		var map = {
			0xFF61	:	0x3002	,	//	。	｡
			0xFF62	:	0x300C	,	//	「	｢
			0xFF63	:	0x300D	,	//	」	｣
			0xFF64	:	0x3001	,	//	､
			0xFF65	:	0x30FB	,	//	・	･
			0xFF66	:	0x30F2	,	//	ヲ	ｦ
			0xFF67	:	0x30A1	,	//	ァ	ｧ
			0xFF68	:	0x30A3	,	//	ィ	ｨ
			0xFF69	:	0x30A5	,	//	ゥ	ｩ
			0xFF6A	:	0x30A7	,	//	ェ	ｪ
			0xFF6B	:	0x30A9	,	//	ォ	ｫ
			0xFF6C	:	0x30E3	,	//	ャ	ｬ
			0xFF6D	:	0x30E5	,	//	ュ	ｭ
			0xFF6E	:	0x30E7	,	//	ョ	ｮ
			0xFF6F	:	0x30C3	,	//	ッ	ｯ
			0xFF70	:	0x30FC	,	//	ー	ｰ
			0xFF71	:	0x30A2	,	//	ア	ｱ
			0xFF72	:	0x30A4	,	//	イ	ｲ
			0xFF73	:	0x30A6	,	//	ウ	ｳ
			0xFF74	:	0x30A8	,	//	エ	ｴ
			0xFF75	:	0x30AA	,	//	オ	ｵ
			0xFF76	:	0x30AB	,	//	カ	ｶ
			0xFF77	:	0x30AD	,	//	キ	ｷ
			0xFF78	:	0x30AF	,	//	ク	ｸ
			0xFF79	:	0x30B1	,	//	ケ	ｹ
			0xFF7A	:	0x30B3	,	//	コ	ｺ
			0xFF7B	:	0x30B5	,	//	サ	ｻ
			0xFF7C	:	0x30B7	,	//	シ	ｼ
			0xFF7D	:	0x30B9	,	//	ス	ｽ
			0xFF7E	:	0x30BB	,	//	セ	ｾ
			0xFF7F	:	0x30BD	,	//	ソ	ｿ
			0xFF80	:	0x30BF	,	//	タ	ﾀ
			0xFF81	:	0x30C1	,	//	チ	ﾁ
			0xFF82	:	0x30C4	,	//	ツ	ﾂ
			0xFF83	:	0x30C6	,	//	テ	ﾃ
			0xFF84	:	0x30C8	,	//	ト	ﾄ
			0xFF85	:	0x30CA	,	//	ナ	ﾅ
			0xFF86	:	0x30CB	,	//	ニ	ﾆ
			0xFF87	:	0x30CC	,	//	ヌ	ﾇ
			0xFF88	:	0x30CD	,	//	ネ	ﾈ
			0xFF89	:	0x30CE	,	//	ノ	ﾉ
			0xFF8A	:	0x30CF	,	//	ハ	ﾊ
			0xFF8B	:	0x30D2	,	//	ヒ	ﾋ
			0xFF8C	:	0x30D5	,	//	フ	ﾌ
			0xFF8D	:	0x30D8	,	//	ヘ	ﾍ
			0xFF8E	:	0x30DB	,	//	ホ	ﾎ
			0xFF8F	:	0x30DE	,	//	マ	ﾏ
			0xFF90	:	0x30DF	,	//	ミ	ﾐ
			0xFF91	:	0x30E0	,	//	ム	ﾑ
			0xFF92	:	0x30E1	,	//	メ	ﾒ
			0xFF93	:	0x30E2	,	//	モ	ﾓ
			0xFF94	:	0x30E4	,	//	ヤ	ﾔ
			0xFF95	:	0x30E6	,	//	ユ	ﾕ
			0xFF96	:	0x30E8	,	//	ヨ	ﾖ
			0xFF97	:	0x30E9	,	//	ラ	ﾗ
			0xFF98	:	0x30EA	,	//	リ	ﾘ
			0xFF99	:	0x30EB	,	//	ル	ﾙ
			0xFF9A	:	0x30EC	,	//	レ	ﾚ
			0xFF9B	:	0x30ED	,	//	ロ	ﾛ
			0xFF9C	:	0x30EF	,	//	ワ	ﾜ
			0xFF9D	:	0x30F3	,	//	ン	ﾝ
			0xFF9E	:	0x309B	,	//	゛	ﾞ
			0xFF9F	:	0x309C		//	゜	ﾟ
		};
		var func = function(str) {
			if(str.length === 1) {
				return (String.fromCharCode(map[str.charCodeAt(0)]));
			}
			else {
				var next = str.charCodeAt(1);
				var ch   = str.charCodeAt(0);
				if(next === 0xFF9E) {
					// Shift-JISにない濁点は無視
					// ヴ
					if (ch === 0xFF73) {
						return (String.fromCharCode(0x3094));
					}
					// ガ-ド、バ-ボ
					else if(
						((0xFF76 <= ch) && (ch <= 0xFF84)) ||
						((0xFF8A <= ch) && (ch <= 0xFF8E))	) {
						return (String.fromCharCode(map[ch] + 1));
					}
				}
				// 半濁点
				else if(next === 0xFF9F) {
					// パ-ポ
					if((0xFF8A <= ch) && (ch <= 0xFF8E)) {
						return (String.fromCharCode(map[ch] + 2));
					}
				}
				return (String.fromCharCode(map[ch]) + String.fromCharCode(map[next]));
			}
		};
		return (text.replace(/[\uFF61-\uFF9F][\uFF9E\uFF9F]?/g, func));
	},
	
	/**
	 * 半角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toHalfWidth : function(text) {
		return this.toHalfWidthKana(this.toHalfWidthAsciiCode(text));
	},
	
	/**
	 * 全角にします。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	toFullWidth : function(text) {
		return this.toFullWidthKana(this.toFullWidthAsciiCode(text));
	},

	/**
	 * コメントを除去します。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	removeComment : function(text) {
		var istextA  = false;
		var isescape = false;
		var commentA1 = false;
		var commentA2 = false;
		var commentB2 = false;
		var commentB3 = false;
		var output = [];

		for(var i = 0;i < text.length;i++) {
			var character = text.charAt(i);

			//文字列（ダブルクォーテーション）は除去しない
			if(istextA) {
				if(isescape) {
					isescape = false;
				}
				else if(character === "\\") {
					isescape = true;
				}
				else if(character === "\"") {
					istextA = false;
				}
				output[output.length] = character;
				continue;
			}

			//複数行コメント
			if(commentB2) {
				//前回複数行コメントが終了の可能性があった場合
				if(commentB3){
					commentB3 = false;
					//コメント終了
					if(character === "/") {
						commentB2 = false;
					}
				}
				//ここにelseをつけると、**/ が抜ける
				if(character === "*") {
					commentB3 = true;
				}
				else if(character === "\n"){
					output[output.length] = character;
				}
				continue;
			}

			//１行コメントである
			if(commentA2) {
				//改行でコメント修了
				if(character === "\n"){
					commentA2 = false;
					output[output.length] = character;
				}
				continue;
			}

			//前回コメントの開始点だと思われている場合
			if(commentA1){
				commentA1 = false;
				//1行コメントの場合
				if(character === "/") {
					commentA2 = true;
					output[output.length - 1] = "";
					continue;
				}
				//複数行コメントの場合
				else if(character === "*") {
					commentB2 = true;
					output[output.length - 1] = "";
					continue;
				}
			}

			//文字列開始点
			if(character === "\"") {
				istextA = true;
			}
			//コメントの開始点だと追われる場合
			if(character === "/") {
				commentA1 = true;
			}
			output[output.length] = character;
		}
		return (output.join(""));
	},
	
	/**
	 * C言語のprintfを再現
	 * ロケール、日付時刻等はサポートしていません。
	 * sprintfの変換指定子のpとnはサポートしていません。
	 * @param {String} text 
	 * @param {String} parm パラメータは可変引数
	 * @returns {String}
	 */
	format : function() {
		var parm_number = 1;
		var parm = arguments;
		var toUnsign  = function(x) {
			if(x >= 0) {
				return(x);
			}
			else {
				x = -x;
				//16ビットごとに分けてビット反転
				var high = ((~x) >> 16) & 0xFFFF;
				high *= 0x00010000;
				var low  =  (~x) & 0xFFFF;
				return(high + low + 1);
			}
		};
		var func = function(str) {
			// 1文字目の%を除去
			str = str.substring(1, str.length);
			var buff;
			// [6] 変換指定子(最後の1文字を取得)
			buff = str.match(/.$/);
			var type = buff[0];
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
			var parameter = parm[parm_number];
			parm_number = parm_number + 1;
			// [2] フラグ
			buff = str.match(/^[-+ #0]+/);
			var isFlagSharp = false;
			var isFlagTextAlignLeft = false;
			var isFlagFillZero = false;
			var sSignCharacter = "";
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
			var width = 0;
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
			var isPrecision = false;
			var precision = 0;
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
			var output = "";
			var isInteger = false;
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
					var sharpdata = "";
					var textlength = 0; // 現在の文字を構成するために必要な長さ
					var spacesize;  // 追加する横幅
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
							for(var i = 0; i < spacesize; i++) {
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
						var buff$1 = function(str) {
							var l   = str.length;
							if(str.length === 3) { // e+1 -> e+001
								return(str.substring(0, l - 1) + "00" + str.substring(l - 1, l));
							}
							else { // e+10 -> e+010
								return(str.substring(0, l - 2) + "0" + str.substring(l - 2, l));
							}
						};
						output = output.replace(/e[+-][0-9]{1,2}$/, buff$1);
					}
					textlength = output.length + sharpdata.length + sSignCharacter.length;
					spacesize  = width - textlength;
					// 左よせ
					if(isFlagTextAlignLeft) {
						for(var i$1 = 0; i$1 < spacesize; i$1++) {
							output = output + " ";
						}
					}
					// 0を埋める場合
					if(isFlagFillZero) {
						for(var i$2 = 0; i$2 < spacesize; i$2++) {
							output = "0" + output;
						}
					}
					// マイナスや、「0x」などを接続
					output = sharpdata + output;
					output = sSignCharacter + output;
					// 0 で埋めない場合
					if((!isFlagFillZero) && (!isFlagTextAlignLeft)) {
						for(var i$3 = 0; i$3 < spacesize; i$3++) {
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
					var s_textlength = output.length; // 現在の文字を構成するために必要な長さ
					var s_spacesize  = width - s_textlength;  // 追加する横幅
					// 左よせ / 右よせ
					if(isFlagTextAlignLeft) {
						for(var i$4 = 0; i$4 < s_spacesize; i$4++) {
							output = output + " ";
						}
					}
					else {
						// 拡張
						var s = isFlagFillZero ? "0" : " ";
						for(var i$5 = 0; i$5 < s_spacesize; i$5++) {
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

var IDSwitch = function IDSwitch() {
	this._initIDSwitch();
};

IDSwitch.prototype._initIDSwitch = function _initIDSwitch () {
	/**
		 * 押した瞬間に反応
		 */
	this.istyped	= false;

	/**
		 * 押している間に反応
		 */
	this.ispressed	= false;

	/**
		 * 離した瞬間に反応
		 */
	this.isreleased	= false;

	/**
		 * 押している時間に反応
		 */
	this.pressed_time= 0;
};

IDSwitch.prototype.clone = function clone () {
	var ret = new IDSwitch();
	ret.istyped		= this.istyped;
	ret.ispressed	= this.ispressed;
	ret.isreleased	= this.isreleased;
	ret.pressed_time= this.pressed_time;
	return ret;
};

/**
	 * キーを押した情報
	 */
IDSwitch.prototype.keyPressed = function keyPressed () {
	if(!this.ispressed) {
		this.istyped = true;
	}
	this.ispressed = true;
	this.pressed_time++;
};

/**
	 * キーを離した情報
	 */
IDSwitch.prototype.keyReleased = function keyReleased () {
	this.ispressed  = false;
	this.isreleased = true;
	this.pressed_time = 0;
};

/**
	 * フォーカスが消えたとき
	 */
IDSwitch.prototype.focusLost = function focusLost () {
	this.keyReleased();
};

/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
IDSwitch.prototype.pickInput = function pickInput (c) {
	if(!(c instanceof IDSwitch)) {
		throw "IllegalArgumentException";
	}
	c.ispressed		= this.ispressed;
	c.istyped		= this.istyped;
	c.isreleased	= this.isreleased;
	c.pressed_time	= this.pressed_time;
	this.isreleased	= false;
	this.istyped	= false;
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

var IDPosition = function IDPosition(x, y) {
	this._initIDPosition(x, y);
};

IDPosition.prototype._initIDPosition = function _initIDPosition (x, y) {
	if(x instanceof IDPosition) {
		var position = x;
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
};
	
IDPosition.prototype.clone = function clone () {
	var ret = new IDPosition(this);
	return ret;
};
	
IDPosition.prototype.set = function set (x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x = position.x; this.y = position.y;
	}
	else {
		this.x = x; this.y = y;
	}
};
	
IDPosition.prototype.add = function add (x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x += position.x; this.y += position.y;
	}
	else {
		this.x += x; this.y += y;
	}
};
	
IDPosition.prototype.sub = function sub (x, y) {
	if(x instanceof IDPosition) {
		var position = x;
		this.x -= position.x; this.y -= position.y;
	}
	else {
		this.x -= x; this.y -= y;
	}
};
	
IDPosition.norm = function norm (p1, p2) {
	var x = p1.x - p2.x;
	var y = p1.y - p2.y;
	return Math.sqrt(x * x + y * y);
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

var IDDraggableSwitch = function IDDraggableSwitch(mask) {
	this._initIDDraggableSwitch(mask);
};

IDDraggableSwitch.prototype._initIDDraggableSwitch = function _initIDDraggableSwitch (mask) {
	this.mask		= mask;
	this.switch		= new IDSwitch();
	this.client		= new IDPosition();
	this.deltaBase	= new IDPosition();
	this.dragged	= new IDPosition();
};

IDDraggableSwitch.prototype.clone = function clone () {
	var ret = new IDDraggableSwitch();
	ret.mask		= this.mask;
	ret.switch		= this.switch.clone();
	ret.client		= this.client.clone();
	ret.deltaBase	= this.deltaBase.clone();
	ret.dragged		= this.dragged.clone();
	return ret;
};

IDDraggableSwitch.prototype.correctionForDOM = function correctionForDOM (event) {
	// イベントが発生したノードの取得
	var node = event.target;
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
};

IDDraggableSwitch.prototype.setPosition = function setPosition (event) {
	// 強制的にその位置に全ての値をセットする
	var position = this.correctionForDOM(event);
	this.client.set(position);
	this.deltaBase.set(position);
	this.dragged._initIDPosition();
};

IDDraggableSwitch.prototype.mousePressed = function mousePressed (event) {
	var position = this.correctionForDOM(event);
	var state= event.button;
	if(state === this.mask) {
		if(!this.switch.ispressed) {
			this.dragged._initIDPosition();
		}
		this.switch.keyPressed();
		this.client.set(position);
		this.deltaBase.set(position);
	}
};

IDDraggableSwitch.prototype.mouseReleased = function mouseReleased (event) {
	var state= event.button;
	if(state === this.mask) {
		if(this.switch.ispressed) {
			this.switch.keyReleased();
		}
	}
};

IDDraggableSwitch.prototype.mouseMoved = function mouseMoved (event) {
	var position = this.correctionForDOM(event);
	if(this.switch.ispressed) {
		var delta = new IDPosition(position);
		delta.sub(this.deltaBase);
		this.dragged.add(delta);
	}
	this.client.set(position.x ,position.y);
	this.deltaBase.set(position.x ,position.y);
};

IDDraggableSwitch.prototype.focusLost = function focusLost () {
	this.switch.focusLost();
};

/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
IDDraggableSwitch.prototype.pickInput = function pickInput (c) {
	if(!(c instanceof IDDraggableSwitch)) {
		throw "IllegalArgumentException";
	}
	this.switch.pickInput(c.switch);
	c.client.set(this.client);
	c.dragged.set(this.dragged);
	this.dragged._initIDPosition();
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

var IDMouse = function IDMouse() {
	this._initIDMouse();
};
	
IDMouse.prototype._initIDMouse = function _initIDMouse () {
	this.left   = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON1_MASK);
	this.center = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON2_MASK);
	this.right  = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON3_MASK);
	this.position = new IDPosition();
	this.wheelrotation = 0;
};

IDMouse.prototype.clone = function clone () {
	var ret = new IDMouse();
	ret.left	= this.left.clone();
	ret.center	= this.center.clone();
	ret.right	= this.right.clone();
	ret.position= this.position.clone();
	ret.wheelrotation = this.wheelrotation;
	return ret;
};

IDMouse.prototype.mousePressed = function mousePressed (mouseevent) {
	this.left.mousePressed(mouseevent);
	this.center.mousePressed(mouseevent);
	this.right.mousePressed(mouseevent);
};

IDMouse.prototype.mouseReleased = function mouseReleased (mouseevent) {
	this.left.mouseReleased(mouseevent);
	this.center.mouseReleased(mouseevent);
	this.right.mouseReleased(mouseevent);
};

IDMouse.prototype.mouseMoved = function mouseMoved (mouseevent) {
	this.left.mouseMoved(mouseevent);
	this.center.mouseMoved(mouseevent);
	this.right.mouseMoved(mouseevent);
	this.position.x = this.left.client.x;
	this.position.y = this.left.client.y;
};

IDMouse.prototype.mouseWheelMoved = function mouseWheelMoved (event) {
	if(event.wheelDelta !== 0) {
		this.wheelrotation += event.deltaY > 0 ? -1 : 1;
	}
};

IDMouse.prototype.focusLost = function focusLost () {
	this.left.focusLost();
	this.center.focusLost();
	this.right.focusLost();
};

IDMouse.prototype.pickInput = function pickInput (c) {
	if(!(c instanceof IDMouse)) {
		throw "IllegalArgumentException";
	}
	this.left.pickInput(c.left);
	this.center.pickInput(c.center);
	this.right.pickInput(c.right);
	c.position.set(this.position);
	c.wheelrotation = this.wheelrotation;
	this.wheelrotation = 0;
};

IDMouse.prototype.setListenerOnElement = function setListenerOnElement (element) {
	var that = this;
	var mousePressed = function(e) {
		that.mousePressed(e);
	};
	var mouseReleased = function(e) {
		that.mouseReleased(e);
	};
	var mouseMoved = function(e) {
		that.mouseMoved(e);
	};
	var focusLost = function() {
		that.focusLost();
	};
	var mouseWheelMoved = function(e) {
		that.mouseWheelMoved(e);
		e.preventDefault();
	};
	var contextMenu  = function(e) {
		e.preventDefault();
	};
	element.style.cursor = "crosshair";
	// 非選択化
	element.style.mozUserSelect		= "none";
	element.style.webkitUserSelect	= "none";
	element.style.msUserSelect		= "none";
	// メニュー非表示化
	element.style.webkitTouchCallout= "none";
	// タップのハイライトカラーを消す
	element.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

	element.addEventListener("mousedown",mousePressed, false );
	element.addEventListener("mouseup",	mouseReleased, false );
	element.addEventListener("mousemove",mouseMoved, false );
	element.addEventListener("mouseout",focusLost, false );
	element.addEventListener("wheel",	mouseWheelMoved, false );
	element.addEventListener("contextmenu",contextMenu, false );
};

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

var IDTouch = /*@__PURE__*/(function (IDMouse$$1) {
	function IDTouch() {
		IDMouse$$1.call(this);
		this._initIDTouch();
	}

	if ( IDMouse$$1 ) IDTouch.__proto__ = IDMouse$$1;
	IDTouch.prototype = Object.create( IDMouse$$1 && IDMouse$$1.prototype );
	IDTouch.prototype.constructor = IDTouch;
	
	IDTouch.prototype._initIDTouch = function _initIDTouch () {
		this.touchcount_to_mask = {
			1 : IDMouse$$1.MOUSE_EVENTS.BUTTON1_MASK,
			2 : IDMouse$$1.MOUSE_EVENTS.BUTTON3_MASK,
			3 : IDMouse$$1.MOUSE_EVENTS.BUTTON2_MASK
		};
		var that = this;
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
	};

	IDTouch.prototype._initPosition = function _initPosition (mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	};

	IDTouch.prototype._MultiTouchToMouse = function _MultiTouchToMouse (touchevent) {
		var x = 0, y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for(var i = 0;i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		var event = {};
		if(touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button  = this.touchcount_to_mask[touchevent.touches.length];
			var touch = touchevent.touches[0];
			event.target  = touch.target ? touch.target : touch.currentTarget;
		}
		else {
			event.clientX = 0;
			event.clientY = 0;
			event.button  = 0;
		}
		event.touchcount = touchevent.touches.length;
		return event;
	};

	IDTouch.prototype._MoveMultiTouch = function _MoveMultiTouch (touchevent) {
		if(touchevent.touches.length === 2) {
			var p1 = touchevent.touches[0];
			var p2 = touchevent.touches[1];
			if(this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this.doubleposition = [];
				this.doubleposition[0] = new IDPosition(p1.clientX, p1.clientY);
				this.doubleposition[1] = new IDPosition(p2.clientX, p2.clientY);
			}
			else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				var newp1 = new IDPosition(p1.clientX, p1.clientY);
				var newp2 = new IDPosition(p2.clientX, p2.clientY);
				var x = IDPosition.norm(this.doubleposition[0], this.doubleposition[1]) - IDPosition.norm(newp1, newp2);
				this.doubleposition[0] = newp1;
				this.doubleposition[1] = newp2;
				// そんなにずれていなかったら無視する
				var r = (Math.abs(x) < 10) ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		}
		else {
			this.isdoubletouch === false;
		}
	};

	IDTouch.prototype._actFuncMask = function _actFuncMask (mouseevent, funcOn, funcOff, target) {
		for(var key in IDMouse$$1.MOUSE_EVENTS) {
			mouseevent.button = IDMouse$$1.MOUSE_EVENTS[key];
			if(IDMouse$$1.MOUSE_EVENTS[key] === target) {
				funcOn(mouseevent);
			}
			else {
				funcOff(mouseevent);
			}
		}
	};

	IDTouch.prototype.touchStart = function touchStart (touchevent) {
		var mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(
			mouseevent,
			this._mousePressed,
			this._mouseReleased,
			mouseevent.button
		);
	};
	
	IDTouch.prototype.touchEnd = function touchEnd (touchevent) {
		var mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseReleased,
			this._mouseReleased,
			mouseevent.button
		);
	};
	
	IDTouch.prototype.touchMove = function touchMove (touchevent) {
		this._MoveMultiTouch(touchevent);
		var mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseMoved,
			this._mouseMoved,
			mouseevent.button
		);
	};

	IDTouch.prototype.setListenerOnElement = function setListenerOnElement (element) {
		IDMouse$$1.prototype.setListenerOnElement.call(this, element);

		var that = this;
		var touchStart = function(touchevent) {
			that.touchStart(touchevent);
		};
		var touchEnd = function(touchevent) {
			that.touchEnd(touchevent);
		};
		var touchMove = function(touchevent) {
			that.touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart",	touchStart, false );
		element.addEventListener("touchend",	touchEnd, false );
		element.addEventListener("touchmove",	touchMove, false );
		element.addEventListener("touchcancel",	touchEnd, false );
	};

	return IDTouch;
}(IDMouse));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var IDTools = {
	
	/**
	 * 縦のスクロールバーを削除
	 */
	noScroll : function() {
		// 縦のスクロールバーを削除
		var main = function() {
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

var Device = {
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

var BlendFunctions = {
	
	ipLerp : function(v0, v1, x) {
		var delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	brendNone : function(x, y, alpha) {
		return y;
	},
	
	brendAlpha : function(x, y, alpha) {
		var x_alpha = x.getBlendAlpha();
		var y_alpha = y.getBlendAlpha() * alpha;
		x = BlendFunctions.ipLerp(x, y, y_alpha);
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendAdd : function(x, y, alpha) {
		var x_alpha = x.getBlendAlpha();
		var y_alpha = y.getBlendAlpha() * alpha;
		x = x.addColor(y.mul(y_alpha));
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendSub : function(x, y, alpha) {
		var new_alpha = x.getBlendAlpha();
		var y_alpha = y.getBlendAlpha() * alpha;
		x = x.subColor(y.mul(y_alpha));
		return x.setBlendAlpha(new_alpha);
	},
	
	brendRevSub : function(x, y, alpha) {
		var new_alpha = y.getBlendAlpha();
		var x_alpha = x.getBlendAlpha() * alpha;
		y = y.subColor(x.mul(x_alpha));
		return y.setBlendAlpha(new_alpha);
	},
	
	brendMul : function(x, y, alpha) {
		var new_alpha = x.getBlendAlpha();
		var y_alpha = y.getBlendAlpha() * alpha;
		x = x.mulColor(y.mul(y_alpha).div(255.0));
		return x.setBlendAlpha(new_alpha);
	}
};

var ImgBlend = function ImgBlend(mode) {
	this.blendfunc = BlendFunctions.brendNone;
	if(arguments.length === 1) {
		this.setBlendMode(mode);
	}
};
	
ImgBlend.prototype.clone = function clone () {
	return new ImgBlend(this.blendmode);
};
	
/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.brendtype} _blendtype
	 * @returns {undefined}
	 */
ImgBlend.prototype.setBlendMode = function setBlendMode (mode) {
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
};
	
ImgBlend.prototype.blend = function blend (color1, color2, alpha) {
	return this.blendfunc(color1, color2, alpha);
};

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

var ImgColor = function ImgColor() {	
};

ImgColor.prototype.getColor = function getColor () {
	return null;
};
	
ImgColor.prototype.clone = function clone () {
	return null;
};
	
ImgColor.prototype.zero = function zero () {
	return null;
};
	
ImgColor.prototype.one = function one () {
	return null;
};
	
ImgColor.prototype.add = function add () {
	return null;
};
	
ImgColor.prototype.sub = function sub () {
	return null;
};
	
ImgColor.prototype.mul = function mul () {
	return null;
};
	
ImgColor.prototype.div = function div () {
	return null;
};
	
ImgColor.prototype.exp = function exp () {
	return null;
};
	
ImgColor.prototype.log = function log () {
	return null;
};
	
ImgColor.prototype.pow = function pow () {
	return null;
};
	
ImgColor.prototype.baselog = function baselog () {
	return null;
};
	
ImgColor.prototype.table = function table () {
	return null;
};
	
ImgColor.prototype.random = function random () {
	return null;
};
	
ImgColor.prototype.luminance = function luminance () {
	return null;
};
	
ImgColor.prototype.addColor = function addColor () {
	return null;
};
	
ImgColor.prototype.subColor = function subColor () {
	return null;
};
	
ImgColor.prototype.mulColor = function mulColor () {
	return null;
};
	
ImgColor.prototype.divColor = function divColor () {
	return null;
};
	
ImgColor.prototype.maxColor = function maxColor () {
	return null;
};
	
ImgColor.prototype.minColor = function minColor () {
	return null;
};
	
ImgColor.prototype.norm = function norm () {
	return null;
};
	
ImgColor.prototype.normFast = function normFast () {
	return null;
};
	
ImgColor.prototype.normColor = function normColor (c, normType) {
	return this.subColor(c).norm(normType);
};
	
ImgColor.prototype.normColorFast = function normColorFast (c, normType) {
	return this.subColor(c).normFast(normType);
};
	
ImgColor.prototype.getBlendAlpha = function getBlendAlpha () {
	return null;
};
	
ImgColor.prototype.setBlendAlpha = function setBlendAlpha () {
	return null;
};
	
ImgColor.prototype.exchangeColorAlpha = function exchangeColorAlpha () {
	return null;
};
	
ImgColor.prototype.equals = function equals () {
	return false;
};
	
/**
	 * パレットから最も近い色を2色探します。
	 * @param {Array} palettes
	 * @param {ImgColor.normType} normType
	 * @returns {object}
	 */
ImgColor.prototype.searchColor = function searchColor (palettes, normType) {
	var norm = 0;
	var c1_norm_max= 0x7fffffff;
	var c1_color= null;
	var c2_norm_max= 0x7ffffffe;
	var c2_color= null;
	for(var i = 0; i < palettes.length; i++) {
		norm = this.normColorFast(palettes[i], normType);
		if(norm < c2_norm_max) {
			if(norm < c1_norm_max) {
				c2_norm_max= c1_norm_max;
				c2_color= c1_color;
				c1_norm_max= norm;
				c1_color= palettes[i];
			}
			else {
				c2_norm_max= norm;
				c2_color= palettes[i];
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
};

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

var ImgWrapInside = function ImgWrapInside(width, height) {
	if(arguments.length === 2) {
		this.setSize(width, height);
	}
	else {
		this.setSize(0, 0);
	}
};
	
ImgWrapInside.prototype.clone = function clone () {
	return new ImgWrapInside(this.width, this.height);
};
	
ImgWrapInside.prototype.setSize = function setSize (width, height) {
	this.width  = width;
	this.height = height;
};
	
ImgWrapInside.prototype.getPixelPosition = function getPixelPosition (x, y) {
	x = ~~Math.floor(x);
	y = ~~Math.floor(y);
	if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
		return [x, y];
	}
	else {
		return null;
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

var ImgWrapClamp = /*@__PURE__*/(function (ImgWrapInside$$1) {
	function ImgWrapClamp(width, height) {
		ImgWrapInside$$1.call(this, width, height);
	}

	if ( ImgWrapInside$$1 ) ImgWrapClamp.__proto__ = ImgWrapInside$$1;
	ImgWrapClamp.prototype = Object.create( ImgWrapInside$$1 && ImgWrapInside$$1.prototype );
	ImgWrapClamp.prototype.constructor = ImgWrapClamp;
	
	ImgWrapClamp.prototype.clone = function clone () {
		return new ImgWrapClamp(this.width, this.height);
	};
	
	ImgWrapClamp.prototype.getPixelPosition = function getPixelPosition (x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		// はみ出た場合は中にむりやり収める
		x = ~~Math.floor(Math.min(Math.max(0, x), this.width  - 1));
		y = ~~Math.floor(Math.min(Math.max(0, y), this.height - 1));
		return [x, y];
	};

	return ImgWrapClamp;
}(ImgWrapInside));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ImgWrapRepeat = /*@__PURE__*/(function (ImgWrapInside$$1) {
	function ImgWrapRepeat(width, height) {
		ImgWrapInside$$1.call(this, width, height);
	}

	if ( ImgWrapInside$$1 ) ImgWrapRepeat.__proto__ = ImgWrapInside$$1;
	ImgWrapRepeat.prototype = Object.create( ImgWrapInside$$1 && ImgWrapInside$$1.prototype );
	ImgWrapRepeat.prototype.constructor = ImgWrapRepeat;
	
	ImgWrapRepeat.prototype.clone = function clone () {
		return new ImgWrapRepeat(this.width, this.height);
	};
	
	ImgWrapRepeat.prototype.getPixelPosition = function getPixelPosition (x, y) {
		x = ~~Math.floor(x);
		y = ~~Math.floor(y);
		if((x >= 0) && (y >= 0) && (x < this.width) && (y < this.height)) {
			return [x, y];
		}
		var x_times = Math.floor(x / this.width);
		var y_times = Math.floor(y / this.height);
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
	};

	return ImgWrapRepeat;
}(ImgWrapInside));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ImgWrap = function ImgWrap(mode, width, height) {
	this.width= 1;
	this.height= 1;
	if(arguments.length >= 2) {
		this.width= width;
		this.height= height;
	}
	if(arguments.length == 3) {
		this.setImgWrapMode(mode);
	}
	else {
		this.setImgWrapMode(ImgWrap.MODE.INSIDE);
	}
};
	
ImgWrap.prototype.clone = function clone () {
	return new ImgWrap(this.wrapmode, this.width, this.height);
};
	
ImgWrap.prototype.setImgWrapMode = function setImgWrapMode (mode) {
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
};
	
ImgWrap.prototype.setSize = function setSize (width, height) {
	this.width = width;
	this.height = height;
	if(this.wrap) {
		this.wrap.setSize(width, height);
	}
};
	
ImgWrap.prototype.getPixelPosition = function getPixelPosition (x, y) {
	return this.wrap.getPixelPosition(x, y);
};

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

var InterpolationFunctions = {
	
	ipLerp : function(v0, v1, x) {
		var delta = v1.subColor(v0);
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
		var P = v3.subColor(v2).subColor(v0.subColor(v1));
		var Q = v0.subColor(v1).subColor(P);
		var R = v2.subColor(v0);
		var S = v1;
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
		var w0 = InterpolationFunctions.funcInBicubic(x + 1, a);
		var w1 = InterpolationFunctions.funcInBicubic(x    , a);
		var w2 = InterpolationFunctions.funcInBicubic(1 - x, a);
		var w3 = InterpolationFunctions.funcInBicubic(2 - x, a);
		var c = v0.mul(w0).addColor(v1.mul(w1)).addColor(v2.mul(w2)).addColor(v3.mul(w3));
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
		var output = va[0][0].zero();
		var x, y, y_weight, weight, sum = 0.0;
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

var ImgInterpolation = function ImgInterpolation(mode) {
	if(arguments.length === 0) {
		mode = ImgInterpolation.MODE.NEAREST_NEIGHBOR;
	}
	this.setInterpolationMode(mode);
};
	
ImgInterpolation.prototype.clone = function clone () {
	return new ImgInterpolation(this.ipmode);
};
	
/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.filtermode} ipmode
	 * @returns {undefined}
	 */
ImgInterpolation.prototype.setInterpolationMode = function setInterpolationMode (ipmode) {
	this.ipmode= ipmode;
	if(ipmode === ImgInterpolation.MODE.NEAREST_NEIGHBOR) {
		this.ipfunc= InterpolationFunctions.ipLerp;
		this.ipn= 1;
	}
	else if(ipmode === ImgInterpolation.MODE.BILINEAR) {
		this.ipfunc = InterpolationFunctions.ipLerp;
		this.ipn= 2;
	}
	else if(ipmode === ImgInterpolation.MODE.COSINE) {
		this.ipfunc = InterpolationFunctions.ipCosine;
		this.ipn= 2;
	}
	else if(ipmode === ImgInterpolation.MODE.HERMITE4_3) {
		this.ipfunc = InterpolationFunctions.ipHermite2p3;
		this.ipn= 2;
	}
	else if(ipmode === ImgInterpolation.MODE.HERMITE4_5) {
		this.ipfunc = InterpolationFunctions.ipHermite2p5;
		this.ipn= 2;
	}
	else if(ipmode === ImgInterpolation.MODE.HERMITE16) {
		this.ipfunc = InterpolationFunctions.ipHermite4p;
		this.ipn= 4;
	}
	else if(ipmode === ImgInterpolation.MODE.BICUBIC) {
		this.ipfunc = InterpolationFunctions.ipBicubic2DNormal;
		this.ipn= 16;
	}
	else if(ipmode === ImgInterpolation.MODE.BICUBIC_SOFT) {
		this.ipfunc = InterpolationFunctions.ipBicubicSoft;
		this.ipn= 4;
	}
	else if(ipmode === ImgInterpolation.MODE.BICUBIC_NORMAL) {
		this.ipfunc = InterpolationFunctions.ipBicubicNormal;
		this.ipn= 4;
	}
	else if(ipmode === ImgInterpolation.MODE.BICUBIC_SHARP) {
		this.ipfunc = InterpolationFunctions.ipBicubicSharp;
		this.ipn= 4;
	}
};
	
/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
ImgInterpolation.prototype.getColor = function getColor (imgdata, x, y) {
	var rx = Math.floor(x);
	var ry = Math.floor(y);
	if((this.ipn === 1) ||
		((rx === x) && (ry === y))) {
		return imgdata.getPixel(rx, ry);
	}
	else if(this.ipn === 2) {
		var nx = x - rx;
		var ny = y - ry;
		var c0, c1;
		c0 = imgdata.getPixel(rx    , ry    );
		c1 = imgdata.getPixel(rx + 1, ry    );
		var n0  = this.ipfunc(c0, c1 , nx);
		c0 = imgdata.getPixel(rx    , ry + 1);
		c1 = imgdata.getPixel(rx + 1, ry + 1);
		var n1  = this.ipfunc(c0, c1 , nx);
		return this.ipfunc( n0, n1, ny );
	}
	else if(this.ipn === 4) {
		var nx$1 = x - rx;
		var ny$1 = y - ry;
		var c0$1, c1$1, c2, c3;
		c0$1 = imgdata.getPixel(rx - 1, ry - 1);
		c1$1 = imgdata.getPixel(rx    , ry - 1);
		c2 = imgdata.getPixel(rx + 1, ry - 1);
		c3 = imgdata.getPixel(rx + 2, ry - 1);
		var n0$1 = this.ipfunc(c0$1, c1$1, c2, c3, nx$1);
		c0$1 = imgdata.getPixel(rx - 1, ry    );
		c1$1 = imgdata.getPixel(rx    , ry    );
		c2 = imgdata.getPixel(rx + 1, ry    );
		c3 = imgdata.getPixel(rx + 2, ry    );
		var n1$1 = this.ipfunc(c0$1, c1$1, c2, c3, nx$1);
		c0$1 = imgdata.getPixel(rx - 1, ry + 1);
		c1$1 = imgdata.getPixel(rx    , ry + 1);
		c2 = imgdata.getPixel(rx + 1, ry + 1);
		c3 = imgdata.getPixel(rx + 2, ry + 1);
		var n2 = this.ipfunc(c0$1, c1$1, c2, c3, nx$1);
		c0$1 = imgdata.getPixel(rx - 1, ry + 2);
		c1$1 = imgdata.getPixel(rx    , ry + 2);
		c2 = imgdata.getPixel(rx + 1, ry + 2);
		c3 = imgdata.getPixel(rx + 2, ry + 2);
		var n3 = this.ipfunc(c0$1, c1$1, c2, c3, nx$1);
		return this.ipfunc( n0$1, n1$1, n2, n3, ny$1 );
	}
	else if(this.ipn === 16) {
		var nx$2 = x - rx;
		var ny$2 = y - ry;
		var ix, iy;
		var cdata = [];
		for(iy = -1; iy < 3; iy++) {
			var cx = [];
			for(ix = -1; ix < 3; ix++) {
				cx[cx.length] = imgdata.getPixel(rx + ix, ry + iy);
			}
			cdata[cdata.length] = cx;
		}
		return this.ipfunc( cdata, nx$2, ny$2 );
	}
	return null;
};

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

var ImgFIRMatrix = function ImgFIRMatrix(matrix) {
	this.height = matrix.length;
	this.width  = matrix[0].length;
	this.matrix = [];
	var i;
	for(i = 0; i < matrix.length; i++) {
		this.matrix[i] = matrix[i].slice();
	}
};
	
ImgFIRMatrix.prototype.clone = function clone () {
	return new ImgFIRMatrix(this.matrix);
};
	
ImgFIRMatrix.prototype.rotateEdge = function rotateEdge (val) {
	// 周囲の値を時計回りに回転させます。
	var m = this.clone();

	var x = [], y = [];
	var i, j;
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
};
	
ImgFIRMatrix.prototype.mul = function mul (val) {
	var m = this.clone();
	var x, y;
	for(y = 0; y < m.height; y++) {
		for(x = 0; x < m.width; x++) {
			m.matrix[y][x] *= val;
		}
	}
	return m;
};
	
ImgFIRMatrix.prototype.sum = function sum () {
	var sum = 0;
	var x, y;
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			sum += this.matrix[y][x];
		}
	}
	return sum;
};
	
ImgFIRMatrix.prototype.normalize = function normalize () {
	return this.clone().mul(1.0 / this.sum());
};
	
ImgFIRMatrix.prototype.addCenter = function addCenter (val) {
	var m = this.clone();
	m.matrix[m.height >> 1][m.width >> 1] += val;
	return m;
};
	
ImgFIRMatrix.makeLaplacianFilter = function makeLaplacianFilter () {
	return new ImgFIRMatrix([
		[ 0.0, -1.0, 0.0],
		[-1.0,  4.0,-1.0],
		[ 0.0, -1.0, 0.0]
	]);
};
	
ImgFIRMatrix.makeSharpenFilter = function makeSharpenFilter (power) {
	var m = ImgFIRMatrix.makeLaplacianFilter();
	return m.mul(power).addCenter(1.0);
};
	
ImgFIRMatrix.makeBlur = function makeBlur (width, height) {
	var m = [];
	var value = 1.0 / (width * height);
	var x, y;
	for(y = 0; y < height; y++) {
		m[y] = [];
		for(x = 0; x < width; x++) {
			m[y][x] = value;
		}
	}
	return new ImgFIRMatrix(m);
};
	
ImgFIRMatrix.makeGaussianFilter = function makeGaussianFilter (width, height, sd) {
	if(sd === undefined) {
		sd = 1.0;
	}
	var m = [];
	var i, x, y;
	var v = [];
	var n = Math.max(width, height);
	var s = - Math.floor(n / 2);
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
};

ImgFIRMatrix.makeCircle = function makeCircle (r) {
	var m = [];
	var radius= r * 0.5;
	var center= r >> 1;
	var x, y;
	for(y = 0; y < r; y++) {
		m[y] = [];
		for(x = 0; x < r; x++) {
			if (Math.sqrt((center - x) * (center - x) +
							(center - y) * (center - y)) < radius) {
				m[y][x] = 1.0;
			}
			else {
				m[y][x] = 0.0;
			}
		}
	}
	return new ImgFIRMatrix(m).normalize();
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

var ImgData = function ImgData() {
	this.width  = 1;
	this.height = 1;
	this.globalAlpha = 1.0;
	this.data= null;
	this.blend  = new ImgBlend(ImgBlend.MODE.NONE);
	this.wrap   = new ImgWrap(ImgWrap.MODE.INSIDE, this.width, this.height);
	this.ip     = new ImgInterpolation(ImgInterpolation.MODE.NEAREST_NEIGHBOR);
	if(arguments.length === 1) {
		var image = arguments[0];
		this.putImageData(image);
	}
	else if(arguments.length === 2) {
		var width  = arguments[0];
		var height = arguments[1];
		this.setSize(width, height);
	}
};
	
ImgData.prototype.putImageData = function putImageData (imagedata) {
};
	
/**
	 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
	 * 以前と同一の画像の場合は初期化されません。
	 * @param {type} width
	 * @param {type} height
	 * @returns {undefined}
	 */
ImgData.prototype.setSize = function setSize (width, height) {
	if((this.width === width) && (this.height === height)) {
		return;
	}
	this.width= width;
	this.height= height;
	this.wrap.setSize(width, height);
};
	
/**
	 * 内部の情報をxにコピーする
	 * @param {type} x
	 * @returns {undefined}
	 */
ImgData.prototype._copyData = function _copyData (x) {
	x.blend  = this.blend.clone();
	x.wrap   = this.wrap.clone();
	x.ip     = this.ip.clone();
	x.setSize(this.width, this.height);
	x.data.set(this.data);
	x.globalAlpha = this.globalAlpha;
};
	
ImgData.prototype.clone = function clone () {
	var x = new ImgData();
	this._copyData(x);
	return x;
};

/**
	 * 画面外の色を選択する方法を選ぶ
	 * @param {ImgData.MODE_WRAP} _wrapmode
	 * @returns {undefined}
	 */
ImgData.prototype.setWrapMode = function setWrapMode (wrapmode) {
	this.wrap.setImgWrapMode(wrapmode);
};
	
/**
	 * 画面外の色を選択する方法を取得する
	 * @returns {ImgData.MODE_WRAP}
	 */
ImgData.prototype.getWrapMode = function getWrapMode () {
	return this.wrap.wrapmode;
};
	
/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.MODE_IP} ipmode
	 * @returns {undefined}
	 */
ImgData.prototype.setInterpolationMode = function setInterpolationMode (ipmode) {
	this.ip.setInterpolationMode(ipmode);
};

/**
	 * 実数で色を選択した場合に、どのように色を補完するか取得する
	 * @returns {ImgData.MODE_IP}
	 */
ImgData.prototype.getInterpolationMode = function getInterpolationMode () {
	return this.ip.ipmode;
};

/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.MODE_BLEND} blendmode
	 * @returns {undefined}
	 */
ImgData.prototype.setBlendType = function setBlendType (blendmode) {
	this.blend.setBlendMode(blendmode);
};

/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
	 * @returns {ImgData.MODE_BLEND}
	 */
ImgData.prototype.getBlendType = function getBlendType () {
	return this.blend.blendmode;
};
	
/**
	 * 中身をクリアします。
	 * @returns {undefined}
	 */
ImgData.prototype.clear = function clear () {
	if(this.data) {
		this.data.fill(0);
	}
};

/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {number} x
	 * @param {number} y
	 * @returns {ImgColorRGBA}
	 */
ImgData.prototype.getPixelInside = function getPixelInside (x, y) {
	return null;
};

/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
ImgData.prototype.setPixelInside = function setPixelInside (x, y, color) {
};

/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
ImgData.prototype.getPixel = function getPixel (x, y) {
	var p = this.wrap.getPixelPosition(x, y);
	if(p) {
		return this.getPixelInside(p[0], p[1]);
	}
	return this.getPixelInside(0, 0).zero();
};

/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
ImgData.prototype.setPixel = function setPixel (x, y, color) {
	var p = this.wrap.getPixelPosition(x, y);
	if(p) {
		if(this._blendtype === ImgData.MODE_BLEND.NONE) {
			this.setPixelInside(p[0], p[1], color);
		}
		else {
			var mycolor = this.getPixelInside(p[0], p[1]);
			var newcolor = this.blend.blend(mycolor, color, this.globalAlpha);
			this.setPixelInside(p[0], p[1], newcolor);
		}
	}
};
	
/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
ImgData.prototype.getColor = function getColor (x, y) {
	return this.ip.getColor(this, x, y);
};

/**
	 * 座標系は、0-1を使用して、テクスチャとみたてて色を取得します。
	 * @param {type} u
	 * @param {type} v
	 * @returns {ImgColor}
	 */
ImgData.prototype.getColorUV = function getColorUV (u, v) {
	return this.getColor(u * this.width, v * this.height);
};

/**
	 * x と y の座標にある色を設定する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
ImgData.prototype.setColor = function setColor (x, y, color) {
	this.setPixel(Math.floor(x), Math.floor(y), color);
};
	
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
ImgData.prototype.drawImgData = function drawImgData (image, sx, sy, sw, sh, dx, dy, dw, dh) {
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
	var delta_w = sw / dw;
	var delta_h = sh / dh;
	var src_x, src_y;
	var dst_x, dst_y;

	src_y = sy;
	for(dst_y = dy; dst_y < (dy + dh); dst_y++) {
		src_x = sx;
		for(dst_x = dx; dst_x < (dx + dw); dst_x++) {
			var color = image.getColor(src_x, src_y);
			if(color) {
				this.setColor(dst_x, dst_y, color);
			}
			src_x += delta_w;
		}
		src_y += delta_h;
	}
};

/**
	 * 全画素に指定した関数の操作を行う
	 * @param {function} callback callback(color, x, y, this) 実行したいコールバック関数
	 * @returns {undefined}
	 */
ImgData.prototype.forEach = function forEach (callback) {
	var x = 0, y = 0;
	for(; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			callback(this.getPixelInside(x, y), x, y, this);
		}
	}
};
	
/**
	 * ImgFIRMatrix を使用して畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @returns {undefined}
	 */
ImgData.prototype.convolution = function convolution (matrix) {
	if(!(matrix instanceof ImgFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	var x, y, fx, fy, mx, my;
	var fx_offset= - (matrix.width  >> 1);
	var fy_offset= - (matrix.height >> 1);
	var m		= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = zero_color;
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var color = bufferimage.getPixel(fx, fy);
					if(color) {
						newcolor = newcolor.addColor(color.mul(m[my][mx]));
					}
				}
			}
			this.setPixelInside(x, y, newcolor);
		}
	}
};

/**
	 * ImgFIRMatrix を使用してバイラテラルフィルタ的な畳込みを行う
	 * 対象の色に近いほど、フィルタをかける処理となる
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
ImgData.prototype.convolutionBilateral = function convolutionBilateral (matrix, p) {
	if(!(matrix instanceof ImgFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	if(p === undefined) {
		p = 0.8;
	}
	var x, y, fx, fy, mx, my;
	var fx_offset= - (matrix.width  >> 1);
	var fy_offset= - (matrix.height >> 1);
	var m		= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	// -0.010 - -0.001
	var rate = - (1.0 - p) * 0.01 - 0.001;
	var exptable = [];
	for(x = 0; x < 256 * 3; x++) {
		exptable[x] = Math.exp(x * x * rate);
	}
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var thiscolor = bufferimage.getPixel(x, y);
			var thisalpha = thiscolor.getBlendAlpha();
			var sumfilter = 0;
			var newcolor  = zero_color;
			var m2 = [];
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				m2[my] = [];
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var tgtcolor = bufferimage.getPixel(fx, fy);
					if(!tgtcolor) {
						continue;
					}
					var newfilter = exptable[Math.floor(tgtcolor.normColor(thiscolor, ImgColor.NORM_MODE.EUGRID))] * m[my][mx];
					newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
					sumfilter += newfilter;
				}
			}
			newcolor = newcolor.div(sumfilter).setBlendAlpha(thisalpha);
			this.setPixelInside(x, y, newcolor);
		}
	}
};

/**
	 * ImgFIRMatrix を使用して指数関数空間で畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
ImgData.prototype.convolutionExp = function convolutionExp (matrix, e) {
	if(!(matrix instanceof ImgFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	if(e === undefined) {
		e = 1.2;
	}
	var x, y, fx, fy, mx, my;
	var fx_offset= - (matrix.width  >> 1);
	var fy_offset= - (matrix.height >> 1);
	var m		= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	var exptable = [];
	for(x = 0; x < 256; x++) {
		exptable[x] = Math.pow(e, x);
	}
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = zero_color;
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var color = bufferimage.getPixel(fx, fy);
					if(color) {
						newcolor = newcolor.addColor(color.table(exptable).mul(m[my][mx]));
					}
				}
			}
			this.setPixelInside(x, y, newcolor.baselog(e));
		}
	}
};

/**
	 * ImgFIRMatrix を使用してアンシャープ畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {type} rate
	 * @returns {undefined}
	 */
ImgData.prototype.convolutionUnSharp = function convolutionUnSharp (matrix, rate) {
	if(!(matrix instanceof ImgFIRMatrix)) {
		throw "IllegalArgumentException";
	}
	var x, y, fx, fy, mx, my;
	var fx_offset= - (matrix.width  >> 1);
	var fy_offset= - (matrix.height >> 1);
	var m		= matrix.matrix;
	var zero_color  = this.getPixelInside(0, 0).zero();
	var bufferimage = this.clone();
	for(y = 0; y < this.height; y++) {
		for(x = 0; x < this.width; x++) {
			var newcolor = zero_color;
			fy = y + fy_offset;
			for(my = 0; my < matrix.height; my++, fy++) {
				fx = x + fx_offset;
				for(mx = 0; mx < matrix.width; mx++, fx++) {
					var color = bufferimage.getPixel(fx, fy);
					if(color) {
						newcolor = newcolor.addColor(color.mul(m[my][mx]));
					}
				}
			}
			var thiscolor = bufferimage.getPixel(x, y);
			var deltaColor = thiscolor.subColor(newcolor).mul(rate);
			this.setPixelInside(x, y, thiscolor.addColor(deltaColor));
		}
	}
};

/**
	 * シャープフィルタ
	 * @param {number} power 強度
	 * @returns {undefined}
	 */
ImgData.prototype.filterSharp = function filterSharp (power) {
	var m = ImgFIRMatrix.makeSharpenFilter(power);
	this.convolution(m);
};

/**
	 * ブラーフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
ImgData.prototype.filterBlur = function filterBlur (n) {
	var m;
	m = ImgFIRMatrix.makeBlur(n, 1);
	this.convolution(m);
	m = ImgFIRMatrix.makeBlur(1, n);
	this.convolution(m);
};

/**
	 * ガウシアンフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
ImgData.prototype.filterGaussian = function filterGaussian (n) {
	var m;
	m = ImgFIRMatrix.makeGaussianFilter(n, 1);
	this.convolution(m);
	m = ImgFIRMatrix.makeGaussianFilter(1, n);
	this.convolution(m);
};

/**
	 * アンシャープ
	 * @param {number} n 口径
	 * @param {number} rate
	 * @returns {undefined}
	 */
ImgData.prototype.filterUnSharp = function filterUnSharp (n, rate) {
	var m = ImgFIRMatrix.makeGaussianFilter(n, n);
	this.convolutionUnSharp(m, rate);
};

/**
	 * バイラテラルフィルタ
	 * @param {number} n 口径
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
ImgData.prototype.filterBilateral = function filterBilateral (n, p) {
	var m = ImgFIRMatrix.makeGaussianFilter(n, n);
	this.convolutionBilateral(m, p);
};

/**
	 * レンズフィルタ
	 * @param {type} n 口径
	 * @param {type} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
ImgData.prototype.filterSoftLens = function filterSoftLens (n, e) {
	var m = ImgFIRMatrix.makeCircle(n);
	this.convolutionExp(m, e);
};

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

var ImgVector = function ImgVector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
	
/**
	 * クロス積
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
ImgVector.prototype.cross = function cross (tgt) {
	return new ImgVector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x
	);
};

/**
	 * ターゲットへのベクトル
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
ImgVector.prototype.getDirection = function getDirection (tgt) {
	return new ImgVector(
		tgt.x - this.x,
		tgt.y - this.y,
		tgt.z - this.z
	);
};

/**
	 * ターゲットへの方向ベクトル
	 * @returns {ImgVector}
	 */
ImgVector.prototype.normalize = function normalize () {
	var b = this.x * this.x + this.y * this.y + this.z * this.z;
	b = Math.sqrt(1.0 / b);
	return new ImgVector(
		this.x * b,
		this.y * b,
		this.z * b
	);
};

/**
	 * 方向ベクトルから、RGBの画素へ変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgColorRGBA}
	 */
ImgVector.prototype.getNormalMapColor = function getNormalMapColor () {
	return new ImgColorRGBA([
		Math.round((1.0 + this.x) * 127.5),
		Math.round((1.0 - this.y) * 127.5),
		Math.round((1.0 + this.z) * 127.5),
		255
	]);
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

var ImgColorRGBA = /*@__PURE__*/(function (ImgColor$$1) {
	function ImgColorRGBA(color) {
		ImgColor$$1.call(this);
		// ディープコピー
		this.rgba = [color[0], color[1], color[2], color[3]];
	}

	if ( ImgColor$$1 ) ImgColorRGBA.__proto__ = ImgColor$$1;
	ImgColorRGBA.prototype = Object.create( ImgColor$$1 && ImgColor$$1.prototype );
	ImgColorRGBA.prototype.constructor = ImgColorRGBA;

	ImgColorRGBA.prototype.getColor = function getColor () {
		return this.rgba;
	};
	
	ImgColorRGBA.prototype.clone = function clone () {
		return new ImgColorRGBA(this.rgba);
	};
	
	ImgColorRGBA.prototype.zero = function zero () {
		return new ImgColorRGBA([0.0, 0.0, 0.0, 0.0]);
	};
	
	ImgColorRGBA.prototype.one = function one () {
		return new ImgColorRGBA([1.0, 1.0, 1.0, 1.0]);
	};
	
	ImgColorRGBA.prototype.add = function add (x) {
		return new ImgColorRGBA([
			this.rgba[0] + x,	this.rgba[1] + x,
			this.rgba[2] + x,	this.rgba[3] + x ]);
	};
	
	ImgColorRGBA.prototype.sub = function sub (x) {
		return new ImgColorRGBA([
			this.rgba[0] - x,	this.rgba[1] - x,
			this.rgba[2] - x,	this.rgba[3] - x ]);
	};
	
	ImgColorRGBA.prototype.mul = function mul (x) {
		return new ImgColorRGBA([
			this.rgba[0] * x,	this.rgba[1] * x,
			this.rgba[2] * x,	this.rgba[3] * x ]);
	};
	
	ImgColorRGBA.prototype.div = function div (x) {
		return new ImgColorRGBA([
			this.rgba[0] / x,	this.rgba[1] / x,
			this.rgba[2] / x,	this.rgba[3] / x ]);
	};
	
	ImgColorRGBA.prototype.exp = function exp () {
		return new ImgColorRGBA([
			Math.exp(this.rgba[0]),	Math.exp(this.rgba[1]),
			Math.exp(this.rgba[2]),	Math.exp(this.rgba[3]) ]);
	};
	
	ImgColorRGBA.prototype.log = function log () {
		return new ImgColorRGBA([
			Math.log(this.rgba[0]),	Math.log(this.rgba[1]),
			Math.log(this.rgba[2]),	Math.log(this.rgba[3]) ]);
	};
	
	ImgColorRGBA.prototype.pow = function pow (base) {
		return new ImgColorRGBA([
			Math.pow(base, this.rgba[0]),	Math.pow(base, this.rgba[1]),
			Math.pow(base, this.rgba[2]),	Math.pow(base, this.rgba[3]) ]);
	};
	
	ImgColorRGBA.prototype.baselog = function baselog (base) {
		var x = 1.0 / Math.log(base);
		return new ImgColorRGBA([
			Math.log(this.rgba[0]) * x,	Math.log(this.rgba[1]) * x,
			Math.log(this.rgba[2]) * x,	Math.log(this.rgba[3]) * x ]);
	};
	
	ImgColorRGBA.prototype.table = function table (table$1) {
		return new ImgColorRGBA([
			table$1[Math.round(this.rgba[0])], table$1[Math.round(this.rgba[1])],
			table$1[Math.round(this.rgba[2])], table$1[Math.round(this.rgba[3])] ]);
	};
	
	ImgColorRGBA.prototype.random = function random () {
		return new ImgColorRGBA([
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
	};
	
	ImgColorRGBA.prototype.luminance = function luminance () {
		return 0.2126 * this.rgba[0] + 0.7152 * this.rgba[1] + 0.0722 * this.rgba[2];
	};
	
	ImgColorRGBA.prototype.addColor = function addColor (c) {
		return new ImgColorRGBA([
			this.rgba[0] + c.rgba[0],	this.rgba[1] + c.rgba[1],
			this.rgba[2] + c.rgba[2],	this.rgba[3] + c.rgba[3] ]);
	};
	
	ImgColorRGBA.prototype.subColor = function subColor (c) {
		return new ImgColorRGBA([
			this.rgba[0] - c.rgba[0],	this.rgba[1] - c.rgba[1],
			this.rgba[2] - c.rgba[2],	this.rgba[3] - c.rgba[3] ]);
	};
	
	ImgColorRGBA.prototype.mulColor = function mulColor (c) {
		return new ImgColorRGBA([
			this.rgba[0] * c.rgba[0],	this.rgba[1] * c.rgba[1],
			this.rgba[2] * c.rgba[2],	this.rgba[3] * c.rgba[3] ]);
	};
	
	ImgColorRGBA.prototype.divColor = function divColor (c) {
		return new ImgColorRGBA([
			this.rgba[0] / c.rgba[0],	this.rgba[1] / c.rgba[1],
			this.rgba[2] / c.rgba[2],	this.rgba[3] / c.rgba[3] ]);
	};
	
	ImgColorRGBA.prototype.maxColor = function maxColor (c) {
		return new ImgColorRGBA([
			Math.max(c.rgba[0], this.rgba[0]),Math.max(c.rgba[1], this.rgba[1]),
			Math.max(c.rgba[2], this.rgba[2]),Math.max(c.rgba[3], this.rgba[3])]);
	};
	
	ImgColorRGBA.prototype.minColor = function minColor (c) {
		return new ImgColorRGBA([
			Math.min(c.rgba[0], this.rgba[0]),Math.min(c.rgba[1], this.rgba[1]),
			Math.min(c.rgba[2], this.rgba[2]),Math.min(c.rgba[3], this.rgba[3])]);
	};
	
	ImgColorRGBA.prototype.norm = function norm (normType) {
		if(normType === ImgColor$$1.NORM_MODE.MANHATTEN) {
			return (Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2])) / 3;
		}
		else if(normType === ImgColor$$1.NORM_MODE.EUGRID) {
			return Math.sqrt(this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2]) / 3;
		}
	};
	
	ImgColorRGBA.prototype.normFast = function normFast (normType) {
		if(normType === ImgColor$$1.NORM_MODE.MANHATTEN) {
			return Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2]);
		}
		else if(normType === ImgColor$$1.NORM_MODE.EUGRID) {
			return this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2];
		}
	};
	
	ImgColorRGBA.prototype.getBlendAlpha = function getBlendAlpha () {
		return this.rgba[3] / 255.0;
	};
	
	ImgColorRGBA.prototype.setBlendAlpha = function setBlendAlpha (x) {
		var color = this.clone();
		color.rgba[3] = x * 255.0;
		return color;
	};
	
	ImgColorRGBA.prototype.exchangeColorAlpha = function exchangeColorAlpha (color) {
		return new ImgColorRGBA( [ this.rgba[0], this.rgba[1], this.rgba[2], color.rgba[3] ]);
	};
	
	ImgColorRGBA.prototype.getRRGGBB = function getRRGGBB () {
		return (this.rgba[0] << 16) | (this.rgba[1] << 8) | (this.rgba[2] & 0xff);
	};
	
	ImgColorRGBA.prototype.getRed = function getRed () {
		return (this.rgba[0]);
	};
	
	ImgColorRGBA.prototype.getGreen = function getGreen () {
		return (this.rgba[1]);
	};
	
	ImgColorRGBA.prototype.getBlue = function getBlue () {
		return (this.rgba[2]);
	};
	
	ImgColorRGBA.prototype.equals = function equals (c) {
		return	(this.rgba[0] === c.rgba[0]) &&
				(this.rgba[1] === c.rgba[1]) &&
				(this.rgba[2] === c.rgba[2]) &&
				(this.rgba[3] === c.rgba[3]) ;
	};
	
	ImgColorRGBA.prototype.toString = function toString () {
		return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
	};
	
	ImgColorRGBA.prototype.mulMatrix = function mulMatrix (m) {
		var color = new ImgColorRGBA();
		color.rgba[0] =	this.rgba[0] * m[0][0] +
						this.rgba[1] * m[0][1] +
						this.rgba[2] * m[0][2] +
						this.rgba[3] * m[0][3];
		color.rgba[1] =	this.rgba[0] * m[1][0] +
						this.rgba[1] * m[1][1] +
						this.rgba[2] * m[1][2] +
						this.rgba[3] * m[1][3];
		color.rgba[2] =	this.rgba[0] * m[2][0] +
						this.rgba[1] * m[2][1] +
						this.rgba[2] * m[2][2] +
						this.rgba[3] * m[2][3];
		color.rgba[3] =	this.rgba[0] * m[3][0] +
						this.rgba[1] * m[3][1] +
						this.rgba[2] * m[3][2] +
						this.rgba[3] * m[3][3];
		return color;
	};
	
	/**
	 * RGBの画素から方向ベクトルへの変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgVector}
	 */
	ImgColorRGBA.prototype.getNormalVector = function getNormalVector () {
		return new ImgVector(
			(this.rgba[0] / 128.0) - 1.0,
			- (this.rgba[1] / 128.0) + 1.0,
			(this.rgba[2] / 128.0) - 1.0
		);
	};

	return ImgColorRGBA;
}(ImgColor));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ImgColorY = /*@__PURE__*/(function (ImgColor$$1) {
	function ImgColorY(color) {
		ImgColor$$1.call(this);
		// ディープコピー
		this.y = color;
	}

	if ( ImgColor$$1 ) ImgColorY.__proto__ = ImgColor$$1;
	ImgColorY.prototype = Object.create( ImgColor$$1 && ImgColor$$1.prototype );
	ImgColorY.prototype.constructor = ImgColorY;

	ImgColorY.prototype.getColor = function getColor () {
		return this.y;
	};
	
	ImgColorY.prototype.clone = function clone () {
		return new ImgColorY(this.y);
	};
	
	ImgColorY.prototype.zero = function zero () {
		return new ImgColorY(0.0);
	};
	
	ImgColorY.prototype.one = function one () {
		return new ImgColorY(1.0);
	};
	
	ImgColorY.prototype.add = function add (x) {
		return new ImgColorY(this.y + x);
	};
	
	ImgColorY.prototype.sub = function sub (x) {
		return new ImgColorY(this.y - x);
	};
	
	ImgColorY.prototype.mul = function mul (x) {
		return new ImgColorY(this.y * x);
	};
	
	ImgColorY.prototype.div = function div (x) {
		return new ImgColorY(this.y / x);
	};
	
	ImgColorY.prototype.exp = function exp () {
		return new ImgColorY(Math.exp(this.y));
	};
	
	ImgColorY.prototype.log = function log () {
		return new ImgColorY(Math.log(this.y));
	};
	
	ImgColorY.prototype.pow = function pow (base) {
		return new ImgColorY(Math.pow(base, this.y));
	};
	
	ImgColorY.prototype.baselog = function baselog (base) {
		return new ImgColorY(Math.log(this.y) / Math.log(base));
	};
	
	ImgColorY.prototype.table = function table (table$1) {
		return new ImgColorY(table$1[Math.floor(this.y)]);
	};
	
	ImgColorY.prototype.random = function random () {
		return new ImgColorY(Math.random() * 256);
	};
	
	ImgColorY.prototype.luminance = function luminance () {
		return this.y;
	};
	
	ImgColorY.prototype.addColor = function addColor (c) {
		return new ImgColorY(this.y + c.y);
	};
	
	ImgColorY.prototype.subColor = function subColor (c) {
		return new ImgColorY(this.y - c.y);
	};
	
	ImgColorY.prototype.mulColor = function mulColor (c) {
		return new ImgColorY(this.y * c.y);
	};
	
	ImgColorY.prototype.divColor = function divColor (c) {
		return new ImgColorY(this.y / c.y);
	};
	
	ImgColorY.prototype.maxColor = function maxColor (c) {
		return new ImgColorY(Math.max(c.y, this.y));
	};
	
	ImgColorY.prototype.minColor = function minColor (c) {
		return new ImgColorY(Math.min(c.y, this.y));
	};
	
	ImgColorY.prototype.norm = function norm () {
		return Math.abs(this.y);
	};
	
	ImgColorY.prototype.normFast = function normFast () {
		return Math.abs(this.y);
	};
	
	ImgColorY.prototype.getBlendAlpha = function getBlendAlpha () {
		return 1.0;
	};
	
	ImgColorY.prototype.setBlendAlpha = function setBlendAlpha () {
		return this;
	};
	
	ImgColorY.prototype.exchangeColorAlpha = function exchangeColorAlpha () {
		return this;
	};
	
	ImgColorY.prototype.equals = function equals (c) {
		return this.y === c.y;
	};
	
	ImgColorY.prototype.toString = function toString () {
		return "color(" + this.y + ")";
	};

	return ImgColorY;
}(ImgColor));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ImgDataY = /*@__PURE__*/(function (ImgData$$1) {
	function ImgDataY() {
		if(arguments.length === 1) {
			ImgData$$1.call(this, arguments[0]);
		}
		else if(arguments.length === 2) {
			ImgData$$1.call(this, arguments[0], arguments[1]);
		}
		else {
			ImgData$$1.call(this);
		}
	}

	if ( ImgData$$1 ) ImgDataY.__proto__ = ImgData$$1;
	ImgDataY.prototype = Object.create( ImgData$$1 && ImgData$$1.prototype );
	ImgDataY.prototype.constructor = ImgDataY;
	
	ImgDataY.prototype.clone = function clone () {
		var x = new ImgDataY(this.width, this.height);
		this._copyData(x);
		return x;
	};
	
	ImgDataY.prototype.setSize = function setSize (width, height) {
		ImgData$$1.prototype.setSize.call(this, width, height);
		this.data	= new Float32Array(this.width * this.height);
	};
	
	ImgDataY.prototype.getPixelInside = function getPixelInside (x, y) {
		var p = y * this.width + x;
		return new ImgColorY(this.data[p]);
	};
	
	ImgDataY.prototype.setPixelInside = function setPixelInside (x, y, color) {
		var p = y * this.width + x;
		this.data[p]     = color.getColor();
	};
	
	ImgDataY.prototype.putImageData = function putImageData (imagedata, n) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			if(n === undefined) {
				n = 0;
			}
			var p = 0;
			for(var i = 0; i < this.data.length; i++) {
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
	};
	
	ImgDataY.prototype.putImageDataR = function putImageDataR (imagedata) {
		this.putImageData(imagedata, 0);
	};
	
	ImgDataY.prototype.putImageDataG = function putImageDataG (imagedata) {
		this.putImageData(imagedata, 1);
	};
	
	ImgDataY.prototype.putImageDataB = function putImageDataB (imagedata) {
		this.putImageData(imagedata, 2);
	};
	
	ImgDataY.prototype.putImageDataA = function putImageDataA (imagedata) {
		this.putImageData(imagedata, 3);
	};
	
	ImgDataY.prototype.getImageData = function getImageData () {
		var canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		var context = canvas.getContext("2d");
		var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		var p = 0, i = 0;
		for(; i < this.data.length; i++) {
			var x = Math.floor(this.data[i]);
			imagedata.data[p + 0] = x;
			imagedata.data[p + 1] = x;
			imagedata.data[p + 2] = x;
			imagedata.data[p + 3] = 255;
			p += 4;
		}
		return imagedata;
	};
	
	/**
	 * ノーマルマップを作成する
	 * @returns {ImgColorRGBA}
	 */
	ImgDataY.prototype.getNormalMap = function getNormalMap () {
		if(this.getWrapMode() === ImgData$$1.MODE_WRAP.INSIDE) {
			// 端の値を取得できないのでエラー
			throw "not inside";
		}
		
		var output = new ImgDataRGBA(this.width, this.height);
		var x, y;
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				var x1 = new ImgVector(x - 1, y, this.getPixel(x - 1, y).getColor());
				var x2 = new ImgVector(x + 1, y, this.getPixel(x + 1, y).getColor());
				var x3 = x1.getDirection(x2);
				var y1 = new ImgVector(x, y - 1, this.getPixel(x, y - 1).getColor());
				var y2 = new ImgVector(x, y + 1, this.getPixel(x, y + 1).getColor());
				var y3 = y1.getDirection(y2);
				var n  = x3.cross(y3).normalize();
				output.setPixelInside(x, y, n.getNormalMapColor());
			}
		}
		return output;
	};
	
	/**
	 * ノーマルマップに対して、環境マッピングする
	 * @param {ImgColorRGBA} texture
	 * @returns {ImgColorRGBA}
	 */
	ImgDataY.prototype.filterEnvironmentMapping = function filterEnvironmentMapping (texture) {
	};

	return ImgDataY;
}(ImgData));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var ImgDataRGBA = /*@__PURE__*/(function (ImgData$$1) {
	function ImgDataRGBA() {
		if(arguments.length === 1) {
			ImgData$$1.call(this, arguments[0]);
		}
		else if(arguments.length === 2) {
			ImgData$$1.call(this, arguments[0], arguments[1]);
		}
		else {
			ImgData$$1.call(this);
		}
	}

	if ( ImgData$$1 ) ImgDataRGBA.__proto__ = ImgData$$1;
	ImgDataRGBA.prototype = Object.create( ImgData$$1 && ImgData$$1.prototype );
	ImgDataRGBA.prototype.constructor = ImgDataRGBA;
	
	ImgDataRGBA.prototype.clone = function clone () {
		var x = new ImgDataRGBA(this.width, this.height);
		this._copyData(x);
		return x;
	};
	
	ImgDataRGBA.prototype.setSize = function setSize (width, height) {
		ImgData$$1.prototype.setSize.call(this, width, height);
		this.data	= new Uint8ClampedArray(this.width * this.height * 4);
	};
	
	ImgDataRGBA.prototype.getPixelInside = function getPixelInside (x, y) {
		var p = (y * this.width + x) * 4;
		var c = new ImgColorRGBA([
			this.data[p],
			this.data[p + 1],
			this.data[p + 2],
			this.data[p + 3]
		]);
		return c;
	};

	ImgDataRGBA.prototype.setPixelInside = function setPixelInside (x, y, color) {
		var p = (y * this.width + x) * 4;
		this.data[p]     = color.getColor()[0];
		this.data[p + 1] = color.getColor()[1];
		this.data[p + 2] = color.getColor()[2];
		this.data[p + 3] = color.getColor()[3];
	};
	
	ImgDataRGBA.prototype.putDataY = function putDataY (imagedata, n) {
		if(!(imagedata instanceof ImgDataY)) {
			throw "IllegalArgumentException";
		}
		this.setSize(imagedata.width, imagedata.height);
		if(n === undefined) {
			n = 0;
		}
		var p = 0, i = 0;
		for(; i < imagedata.data.length; i++) {
			this.data[p + n] = Math.floor(imagedata.data[i]);
			p += 4;
		}
	};
	
	ImgDataRGBA.prototype.putDataYToR = function putDataYToR (imagedata) {
		this.putDataS(imagedata, 0);
	};
	
	ImgDataRGBA.prototype.putDataYToG = function putDataYToG (imagedata) {
		this.putDataS(imagedata, 1);
	};
	
	ImgDataRGBA.prototype.putDataYToB = function putDataYToB (imagedata) {
		this.putDataS(imagedata, 2);
	};
	
	ImgDataRGBA.prototype.putDataYToA = function putDataYToA (imagedata) {
		this.putDataS(imagedata, 3);
	};
	
	ImgDataRGBA.prototype.putImageData = function putImageData (imagedata) {
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
	};
	
	ImgDataRGBA.prototype.getImageData = function getImageData () {
		var canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		var context = canvas.getContext("2d");
		var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedata.data.set(this.data);
		return imagedata;
	};
	
	ImgDataRGBA.prototype.grayscale = function grayscale () {
		this.forEach(function(color, x, y, data) {
			var luminance = ~~color.luminance();
			var newcolor = new ImgColorRGBA( [luminance, luminance, luminance, color.rgba[3]] );
			data.setPixelInside(x, y, newcolor);
		});
	};
	
	/**
	 * 使用している色数を取得します
	 * ※透過色はカウントしません
	 * @returns {Number}
	 */
	ImgDataRGBA.prototype.getColorCount = function getColorCount () {
		// 色を記録する領域
		// 0x200000 = 256 * 256 * 256 / 8 = 2097152
		var sw = new Uint8ClampedArray(0x200000);
		var count = 0;
		this.forEach(function(color) {
			var rrggbb = color.getRRGGBB();
			var p1 = rrggbb >> 3; // x / 8
			var p2 = rrggbb  % 7; // x & 8
			if(((sw[p1] >> p2) & 1) === 0) {
				count++;
				sw[p1] = (sw[p1] ^ (1 << p2)) & 0xFF;
			}
		});
		return count;
	};

	/**
	 * メディアンカットで減色後のパレットを取得します。
	 * @param {Number} colors 色の数
	 * @returns {}
	 */
	ImgDataRGBA.prototype.getPalletMedianCut = function getPalletMedianCut (colors) {
		if(this.getColorCount()<=colors){
			return(null);
		}
		var i;
		var r, g, b;

		// 減色に用いる解像度
		var bit = 7;

		// 含まれる色数
		var color = new Uint32Array((1<<bit)*(1<<bit)*(1<<bit));

		// 現在の色数
		var colorcnt = 0;

		// 色から指定した解像度のrrggbb値を返す
		var RGBtoPositionForColor = function(color) {
			var r = color.getRed();
			var g = color.getGreen();
			var b = color.getBlue();
			return ((r>>(8-bit))<<(bit*2))|((g>>(8-bit))<<bit)|(b>>(8-bit));
		};

		// 0区切り目の初期値を計算する
		// それぞれの区切り幅に含まれた色数、及び区切り幅の最大値と最小値
		// R = 0, G = 1, B = 2 の位置とする
		var color_cnt = [];	
		var color_max = [[], [], []];
		var color_min = [[], [], []];
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
		var r_delta, g_delta, b_delta;
		// 色の最大幅
		var max_r_delta, max_g_delta, max_b_delta;
		// 区切った回数
		var kugiri;

		// ここからアルゴリズム頑張った……！

		colorcnt++;
		for(kugiri = 1; colorcnt < colors ;) {

			//区切る場所(R・G・Bのどれを区切るか)を大雑把に決める
			//基準は体積
			var max_volume = 0, tgt = 0;
			for(i = 0; i < kugiri; i++) {
				r_delta = color_max[0][i] - color_min[0][i];
				g_delta = color_max[1][i] - color_min[1][i];
				b_delta = color_max[2][i] - color_min[2][i];
				var this_volume = r_delta * g_delta * b_delta;
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
			var max_delta = max_g_delta; // 緑を優先して区切る
			var tgt_col = 1;
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
				var point = color_min[tgt_col][tgt] + (max_delta >> 1); //実際の中心
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
		var pallet = [];

		//パレットを作る
		for(i = 0; i < colorcnt; i++) {
			//色数 × 色
			var avr_r = 0;
			var avr_g = 0;
			var avr_b = 0;
			for(r = color_min[0][i];r <= color_max[0][i];r++) {
				for(g = color_min[1][i];g <= color_max[1][i];g++) {
					for(b = color_min[2][i];b <= color_max[2][i];b++) {
						var color_sum = color[(r<<(bit<<1))|(g<<bit)|b];
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
	};

	/**
	 * 使用されている色のパレットを取得します。
	 * 最大256色まで取得します。
	 * @returns {Array|ImgData.getPallet.pallet}
	 */
	ImgDataRGBA.prototype.getPallet = function getPallet () {
		var pallet = [];
		var rrggbb_array = new Uint32Array(256);
		var count = 0;
		var i = 0;
		this.forEach(function(color) {
			if(count > 255) {
				return;
			}
			var rrggbb = color.getRRGGBB();
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
	};

	/**
	 * グレースケールのパレットを取得します。
	 * @param {Number} colors 階調数(2~256)
	 * @returns {}
	 */
	ImgDataRGBA.prototype.getPalletGrayscale = function getPalletGrayscale (colors) {
		var n = colors < 2 ? 2 : colors > 256 ? 256 : colors;
		var pallet = [];
		var diff = 255.0 / (n - 1);
		var col = 0.0;
		var i;
		for(i = 0; i < n; i++) {
			var y = Math.round(col);
			y = y < 0 ? 0 : y > 255 ? 255 : y;
			pallet[i] = new ImgColorRGBA([y, y, y, 255]);
			col += diff;
		}
		return pallet;
	};

	/**
	 * パレットを用いて単純減色する
	 * @param {Array} palettes
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.quantizationSimple = function quantizationSimple (palettes) {
		this.forEach(function(thiscolor, x, y, data) {
			var palletcolor = thiscolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			data.setPixelInside(x, y, palletcolor.c1.color.exchangeColorAlpha(thiscolor));
		});
	};

	/**
	 * パレットから組織的ディザ法による減色を行います。(Error-diffusion dithering)
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.orderPattern} orderPattern
	 * @param {ImgColor.NORM_MODE} normType
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.quantizationOrdered = function quantizationOrdered (palettes, orderPattern, normType) {
		this.forEach(function(thiscolor, x, y, data) {
			var palletcolor = thiscolor.searchColor(palettes, normType);
			var color1 = palletcolor.c1.color;
			var norm1  = palletcolor.c1.norm;
			var color2 = palletcolor.c2.color;
			var norm2  = palletcolor.c2.norm;
			var normsum = norm1 + norm2;
			var sumdiff = 0;
			normsum = normsum === 0 ? 1 : normsum;
			var pattern = orderPattern.pattern[y % orderPattern.height][x % orderPattern.width];
			var newcolor = null;
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
	};

	/**
	 * パレットから誤差拡散法による減色を行います。
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.quantizationDiffusion = function quantizationDiffusion (palettes, diffusionPattern) {

		// 誤差拡散するにあたって、0未満や255より大きな値を使用するため
		// 一旦、下記のバッファにうつす
		var pixelcount	= this.width * this.height;
		var color_r		= new Int16Array(pixelcount);
		var color_g		= new Int16Array(pixelcount);
		var color_b		= new Int16Array(pixelcount);

		// 現在の位置
		var point		= 0;
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			color_r[point] = thiscolor.getRed();
			color_g[point] = thiscolor.getGreen();
			color_b[point] = thiscolor.getBlue();
		});

		// 誤差拡散できない右端
		var width_max = this.width - diffusionPattern.width + diffusionPattern.center;

		// パターンを正規化して合計を1にする
		var px, py;
		var pattern_sum = 0;
		for(py = 0; py < diffusionPattern.height; py++) {
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_sum += diffusionPattern.pattern[py][px];
			}
		}
		var pattern_normalize = [];
		for(py = 0; py < diffusionPattern.height; py++) {
			pattern_normalize[py] = [];
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_normalize[py][px] = diffusionPattern.pattern[py][px] / pattern_sum;
			}
		}

		// 選択処理
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			var diffcolor = new ImgColorRGBA(
				[color_r[point], color_g[point], color_b[point], 255]
			);
			// 最も近い色を探して
			var palletcolor = diffcolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			palletcolor = palletcolor.c1.color;
			// 値を設定する
			data.setPixelInside(x, y, palletcolor.exchangeColorAlpha(thiscolor));
			// 右端の近くは誤差分散させられないので拡散しない
			if(x > width_max) {
				return;
			}
			// ここから誤差を求める
			var deltacolor = diffcolor.subColor(palletcolor);
			for(py = 0; py < diffusionPattern.height; py++) {
				px = py === 0 ? diffusionPattern.center : 0;
				for(; px < diffusionPattern.width; px++) {
					var dx = x + px - diffusionPattern.center;
					var dy = y + py;
					// 画面外への拡散を防止する
					if((dx < 0) || (dy >= data.height)){
						continue;
					}
					var dp = dy * data.width + dx;
					color_r[dp] += deltacolor.getRed()   * pattern_normalize[py][px];
					color_g[dp] += deltacolor.getGreen() * pattern_normalize[py][px];
					color_b[dp] += deltacolor.getBlue()  * pattern_normalize[py][px];
				}
			}
		});
	};

	/**
	 * 単純減色
	 * @param {Array} colorcount 減色後の色数
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.filterQuantizationSimple = function filterQuantizationSimple (colorcount) {
		var count = this.getColorCount();
		if(count > colorcount) {
			var pallet = this.getPalletMedianCut(colorcount);
			this.quantizationSimple(pallet);
		}
	};

	/**
	 * 組織的ディザ法による減色
	 * @param {Array} colorcount 減色後の色数
	 * @param {ImgColor.NORM_MODE} normType 
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.filterQuantizationOrdered = function filterQuantizationOrdered (colorcount, normType) {
		if(normType === undefined) {
			normType = ImgColor.NORM_MODE.EUGRID;
		}
		var count = this.getColorCount();
		if(count > colorcount) {
			var pallet = this.getPalletMedianCut(colorcount);
			this.quantizationOrdered(
				pallet,
				ImgDataRGBA.quantization.orderPattern.patternBayer,
				normType
			);
		}
	};

	/**
	 * 誤差拡散法による減色
	 * @param {Array} colorcount
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	ImgDataRGBA.prototype.filterQuantizationDiffusion = function filterQuantizationDiffusion (colorcount, diffusionPattern) {
		if(diffusionPattern === undefined) {
			diffusionPattern = ImgDataRGBA.quantization.diffusionPattern.patternFloydSteinberg;
		}
		var count = this.getColorCount();
		if(count > colorcount) {
			var pallet = this.getPalletMedianCut(colorcount);
			this.quantizationDiffusion(
				pallet,
				diffusionPattern
			);
		}
	};

	return ImgDataRGBA;
}(ImgData));

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

var ImageProcessing = {
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
var SBase = function SBase(elementtype, title) {
	this.id			= "SComponent_" + (SBase._counter++).toString(16);
	this.wallid		= "SComponent_" + (SBase._counter++).toString(16);
	this.isshow		= false;
	this._element	= null;
	this._wall		= null;
	this.elementtype= elementtype;
	this.unit		= SBase.UNIT_TYPE.EM;

	var that = this;
	var mouseevent = {
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

	this.tool		= {
		attachMouseEvent : function(element) {
			element.addEventListener("touchstart", mouseevent.over,false);
			element.addEventListener("touchend", mouseevent.up	,false);
			element.addEventListener("mouseover",mouseevent.over,false);
			element.addEventListener("mouseout",mouseevent.out	,false);
			element.addEventListener("mousedown",mouseevent.down,false);
			element.addEventListener("mouseup",mouseevent.up	,false);
		},
		removeNodeForId : function(id) {
			var element = document.getElementById(id);
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
			var node = null;
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

			var insertNext = function(newNode, referenceNode) {
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
};
	
SBase.prototype.getWidth = function getWidth () {
	var width = this.getElement().style.width;
	if(width === null) {
		return null;
	}
	width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(width);
};

SBase.prototype.getHeight = function getHeight () {
	var height = this.getElement().style.height;
	if(height === null) {
		return null;
	}
	height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
	return parseFloat(height);
};

SBase.prototype.getSize = function getSize () {
	return {
		width : this.getWidth(),
		height : this.getHeight()
	};
};

SBase.prototype.setWidth = function setWidth (width) {
	if(typeof width !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.getElement().style.width = width.toString() + this.unit;
};

SBase.prototype.setHeight = function setHeight (height) {
	if(typeof height !== "number") {
		throw "IllegalArgumentException not number";
	}
	this.getElement().style.height = height.toString() + this.unit;
};

SBase.prototype.setSize = function setSize (width, height) {
	this.setWidth(width);
	this.setHeight(height);
};

SBase.prototype.removeMe = function removeMe () {
	this.tool.removeNodeForId(this.id);
	this.tool.removeNodeForId(this.space_id);
};

SBase.prototype.onAdded = function onAdded () {
};

SBase.prototype.getWall = function getWall (type) {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._wall) {
		return this._wall;
	}
	var wall = document.createElement("span");
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
};

SBase.prototype.isContainer = function isContainer () {
	return this.getContainerElement() !== null;
};

SBase.prototype.getContainerElement = function getContainerElement () {
	return null;
};

SBase.prototype.getElement = function getElement () {
	// すでに作成済みならそれを返して、作っていないければ作る
	if(this._element) {
		return this._element;
	}
	var element = document.createElement(this.elementtype);
	element.id = this.id;
	element.className = SBase.CLASS_NAME.COMPONENT;
	element.style.display = "inline-block";
	this._element = element;
	this.tool.attachMouseEvent(element);
	return element;
};

SBase.prototype.put = function put (targetComponent, type) {
	this.tool.AputB(this, targetComponent, type);
	return;
};

SBase.prototype.putMe = function putMe (target, type) {
	this.tool.AputB(target, this, type);
	return;
};

SBase.prototype.isVisible = function isVisible () {
	if(this.getElement().style.visibility === null) {
		return true;
	}
	return this.getElement().style.visibility !== "hidden";
};

SBase.prototype.setVisible = function setVisible (isvisible) {
	if(isvisible) {
		this.getElement().style.visibility= "visible";
		this.getWall().style.visibility	= "visible";
	}
	else {
		this.getElement().style.visibility= "hidden";
		this.getWall().style.visibility	= "hidden";
	}
	return;
};
	
SBase.prototype.getTextNode = function getTextNode () {
	var element = this.getElement();
	// childNodes でテキストノードまで取得する
	var childnodes = element.childNodes;
	var textnode = null;
	var i = 0;
	for(i = 0; i < childnodes.length; i++) {
		if(childnodes[i] instanceof Text) {
			textnode = childnodes[i];
			break;
		}
	}
	// テキストノードがない場合は null をかえす
	return textnode;
};

SBase.prototype.getElementNode = function getElementNode () {
	var element = this.getElement();
	// children でテキストノード意外を取得する
	var childnodes = element.children;
	var node = null;
	var i = 0;
	for(i = 0; i < childnodes.length; i++) {
		if(!(childnodes[i] instanceof Text)) {
			node = childnodes[i];
			break;
		}
	}
	return node;
};

SBase.prototype.getEditableNodeForValue = function getEditableNodeForValue () {
	// Value要素をもつもの
	return null;
};

SBase.prototype.getEditableNodeForNodeValue = function getEditableNodeForNodeValue () {
	// Value要素をもつなら、このメソッドは利用不可とする
	if(this.getEditableNodeForValue()) {
		return null;
	}
	// nodeValue 要素をもつもの
	var textnode = this.getTextNode();
	// 見つからなかったら作成する
	if(textnode === null) {
		var element = this.getElement();
		textnode = document.createTextNode("");
		element.appendChild(textnode);
	}
	return textnode;
};

SBase.prototype.setText = function setText (title) {
	if(!title) {
		return;
	}
	var node = null;
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
};

SBase.prototype.getText = function getText () {
	var title = null;
	var node = null;
	node = this.getEditableNodeForValue();
	if(node) {
		title = node.value;
	}
	node = this.getEditableNodeForNodeValue();
	if(node) {
		title = node.nodeValue.trim();
	}
	return (title === null) ? "" : title;
};

SBase.prototype.getEnabledElement = function getEnabledElement () {
	return null;
};

SBase.prototype.setEnabled = function setEnabled (isenabled) {
	if(isenabled) {
		SBase.node_tool.removeClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
	}
	else {
		SBase.node_tool.addClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
	}
	var element = this.getEnabledElement();
	// disabled属性が利用可能ならつける
	if(element !== null) {
		SBase.node_tool.setBooleanAttribute(element, "disabled", isenabled);
	}
};
	
SBase.prototype.isEnabled = function isEnabled () {
	return !SBase.node_tool.isSetClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
};

SBase.prototype.getId = function getId () {
	return this.id;
};

SBase.prototype.getUnit = function getUnit () {
	return this.unit;
};

SBase.prototype.setUnit = function setUnit (UNIT_TYPE) {
	this.unit = UNIT_TYPE;
};

SBase.prototype.addClass = function addClass (classname) {
	return SBase.node_tool.addClass(this.getElement(), classname);
};

SBase.prototype.toString = function toString () {
	return this._elementtype + "(" + this.id + ")";
};

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
		var checked = element.getAttribute(attribute);
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
		var child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		return;
	},

	isSetClass : function(element, classname) {
		var classdata = element.className;
		if(classdata === null) {
			return false;
		}
		var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		return pattern.test(classdata);
	},

	addClass : function(element, classname) {
		var classdata = element.className;
		if(classdata === null) {
			element.className = classname;
			return;
		}
		var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(pattern.test(classdata)) {
			return;
		}
		element.className = classdata + " " + classname;
	},

	removeClass : function(element, classname) {
		var classdata = element.className;
		if(classdata === null) {
			return;
		}
		var pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
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

var SButton = /*@__PURE__*/(function (SBase$$1) {
	function SButton(title) {
		SBase$$1.call(this, "input", title);
		this.addClass(SBase$$1.CLASS_NAME.BUTTON);
		this.getElement().type = "button";
	}

	if ( SBase$$1 ) SButton.__proto__ = SBase$$1;
	SButton.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SButton.prototype.constructor = SButton;
	
	SButton.prototype.getEditableNodeForValue = function getEditableNodeForValue () {
		return this.getElement();
	};
	
	SButton.prototype.getEnabledElement = function getEnabledElement () {
		return this.getElement();
	};
	
	SButton.prototype.addListener = function addListener (func) {
		this.getElement().addEventListener("click", func, false);
	};

	return SButton;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SCanvas = /*@__PURE__*/(function (SBase$$1) {
	function SCanvas() {
		SBase$$1.call(this, "canvas");
		this.addClass(SBase$$1.CLASS_NAME.CANVAS);
		this.canvas = SBase$$1.prototype.getElement.call(this);
		this.glmode = false;
		this.setPixelSize(300, 150);	// canvas のデフォルト値を設定する
	}

	if ( SBase$$1 ) SCanvas.__proto__ = SBase$$1;
	SCanvas.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SCanvas.prototype.constructor = SCanvas;
	
	SCanvas.prototype.getPixelSize = function getPixelSize () {
		return {
			width: this.canvas.width,
			height: this.canvas.height
		};
	};

	SCanvas.prototype.getCanvas = function getCanvas () {
		return this.canvas;
	};

	SCanvas.prototype.setPixelSize = function setPixelSize (width, height) {
		if(	(arguments.length !== 2) || 
			((typeof width !== "number") || (typeof height !== "number")) ||
			((width < 0) || (height < 0))) {
			throw "IllegalArgumentException";
		}
		width  = ~~Math.floor(width);
		height = ~~Math.floor(height);
		this.canvas.width = width;
		this.canvas.height = height;
	};

	SCanvas.prototype.getContext = function getContext () {
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
	};

	SCanvas.prototype.clear = function clear () {
		if(this.glmode) {
			this.getContext().clear(this.gl.COLOR_BUFFER_BIT);
		}
		else {
			this.getContext().clearRect(0, 0,  this.canvas.width, this.canvas.height);
		}
	};

	SCanvas.prototype.getImageData = function getImageData () {
		if(this.glmode) {
			return;
		}
		return this.getContext().getImageData(0, 0, this.canvas.width, this.canvas.height);
	};

	SCanvas.prototype.putImageData = function putImageData (imagedata) {
		if(this.glmode) {
			return;
		}
		this.getContext().putImageData(imagedata, 0, 0);
	};

	SCanvas.prototype._putImage = function _putImage (image, isresizecanvas, drawsize) {
		var pixelsize = this.canvas;
		var dx = 0, dy = 0;
		var width  = pixelsize.width;
		var height = pixelsize.height;
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
			this.setUnit(SBase$$1.UNIT_TYPE.PX);
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
	};

	SCanvas.prototype.putImage = function putImage (data, drawcallback, drawsize, isresizecanvas) {
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
			var _this = this;
			var image = new Image();
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
			var _this$1 = this;
			var reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this$1.putImage(reader.result, isresizecanvas, drawsize, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	};

	SCanvas.prototype.toDataURL = function toDataURL (type) {
		if(!type) {
			type = "image/png";
		}
		return this.canvas.toDataURL(type);
	};

	return SCanvas;
}(SBase));

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

var SCheckBox = /*@__PURE__*/(function (SBase$$1) {
	function SCheckBox(title) {
		SBase$$1.call(this, "label");
		this.addClass(SBase$$1.CLASS_NAME.LABEL);
		this.addClass(SBase$$1.CLASS_NAME.CHECKBOX);
		
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase$$1.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;
		this.textnode = document.createTextNode( title ? title : "");
		var element   = this.getElement();
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	if ( SBase$$1 ) SCheckBox.__proto__ = SBase$$1;
	SCheckBox.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SCheckBox.prototype.constructor = SCheckBox;

	SCheckBox.prototype.getEnabledElement = function getEnabledElement () {
		return this.checkbox;
	};
	
	SCheckBox.prototype.getTextNode = function getTextNode () {
		return this.textnode;
	};
	
	SCheckBox.prototype.getElementNode = function getElementNode () {
		return this.checkbox;
	};
	
	SCheckBox.prototype.setLabelPosition = function setLabelPosition (LABEL_POSITION) {
		// ラベルかどうか確認
		var element = this.getElement();
		var textnode = this.getTextNode();
		var elementnode = this.getElementNode();
		// 中身を一旦消去する
		this.node_tool.removeChildNodes(element);
		// 配置を設定する
		if(LABEL_POSITION === SBase$$1.LABEL_POSITION.LEFT) {
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
	};
	
	SCheckBox.prototype.setCheckBoxImageSize = function setCheckBoxImageSize (size) {
		if(typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width  = size.toString() + this.unit;
	};
	
	SCheckBox.prototype.addListener = function addListener (func) {
		this.checkbox.addEventListener("change", func, false);
	};
	
	SCheckBox.prototype.setChecked = function setChecked (ischecked) {
		this.checkbox.checked = ischecked;
	};
	
	SCheckBox.prototype.isChecked = function isChecked () {
		return this.checkbox.checked;
	};

	return SCheckBox;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SColorPicker = /*@__PURE__*/(function (SBase$$1) {
	function SColorPicker() {
		
		SBase$$1.call(this, "div");
		this.addClass(SBase$$1.CLASS_NAME.COLORPICKER);
		
		var element	= this.getElement();
		var that = this;
		var hls = {
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

		for(var i = 0; i <= hls.H.split; i++) {
			var x = 1.0 / hls.H.split * i;
			hls.H.color_data.push(Color.newColorNormalizedHSL([x, 1.0, 0.5]).getCSSHex());
		}

		// イベントをどこで発生させたか分かるように、
		// 関数を戻り値としてもどし、戻り値として戻した関数を
		// イベント発生時に呼び出すようにしています。

		// 押したときにマウスの位置を取得して更新する
		var pushevent = function(name) {
			return function(event) {
				if(event.length) { event = event[0]; }
				if(hls[name].is_press) {
					var node = event.target;
					node = node ? node : event.currentTarget;
					hls[name].value = event.offsetX / node.clientWidth;
					that.redraw();
				}
			};
		};

		// 押した・離したの管理
		var pressevent = function(name, is_press) {
			return function(event) {
				if(event.length) { event = event[0]; }
				var node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].is_press = is_press;
				if(is_press) {
					pushevent(name)(event);
				}
			};
		};

		// インプットボックスの変更
		var inputevent = function(name) {
			return function(event) {
				// イベントが発生したノードの取得
				var node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].value = node.value / 100.0;
				that.redraw();
			};
		};

		// 内部のカラーバーを作成
		var createSelectBar = function(target, name) {
			var element_cover	= document.createElement("div");	// クリック検出
			var element_gauge	= document.createElement("div");	// ゲージ表示用
			var element_gradient= document.createElement("div");	// グラデーション作成用

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
			var split = hls[name].split;
			element_gradient.style.width			= "100%";
			element_gradient.style.height			= "100%";
			element_gradient.style.overflow		= "hidden";
			for(var i = 0; i < split; i++) {
				var element_color = document.createElement("div");
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
		var createColorBar = function(name) {
			var element_text		= document.createElement("span");
			var element_colorbar	= document.createElement("div");
			var element_inputbox	= document.createElement("input");

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
			var target = hls[name].div;
			target.style.height				= "1.2em";
			target.style.margin				= "0.5em 0px 0.5em 0px";

			element_text.appendChild(document.createTextNode(name));
			target.appendChild(element_text);
			target.appendChild(element_colorbar);
			target.appendChild(element_inputbox);
		};

		// HSLの3つを作成する
		for(var key in hls) {
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

	if ( SBase$$1 ) SColorPicker.__proto__ = SBase$$1;
	SColorPicker.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SColorPicker.prototype.constructor = SColorPicker;
	
	SColorPicker.prototype.setColor = function setColor (color) {
		if(!(color instanceof Color)) {
			throw "ArithmeticException";
		}
		var hls = this.hls;
		var c = color.getNormalizedHSL();
		hls.H.value = c.h;
		hls.S.value = c.s; 
		hls.L.value = c.l; 
		this.redraw();
	};
	
	SColorPicker.prototype.getColor = function getColor () {
		var hls = this.hls;
		var h = hls.H.value;
		var s = hls.S.value;
		var l = hls.L.value;
		return Color.newColorNormalizedHSL([h, s, l]);
	};
	
	SColorPicker.prototype.redraw = function redraw () {
		var hls = this.hls;
		var h = hls.H.value;
		var s = hls.S.value;
		var l = hls.L.value;
		hls.S.color_data = [
			Color.newColorNormalizedHSL([h, 0.0, l]).getCSSHex(),
			Color.newColorNormalizedHSL([h, 1.0, l]).getCSSHex()
		];
		hls.L.color_data = [
			Color.newColorNormalizedHSL([h, s, 0.0]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 0.5]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 1.0]).getCSSHex()
		];
		for(var key in hls) {
			var data = hls[key].color_data;
			var node = hls[key].color_node;
			for(var i = 0; i < node.length; i++) {
				node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
			}
			var value = Math.round(100.0 * hls[key].value);
			hls[key].gauge.style.width = value + "%";
			hls[key].input.value = value;
		}
		for(var i$1 = 0;i$1 < this.listener.length; i$1++) {
			this.listener[i$1]();
		}
	};

	SColorPicker.prototype.addListener = function addListener (func) {
		this.listener.push(func);
	};

	return SColorPicker;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SComboBox = /*@__PURE__*/(function (SBase$$1) {
	function SComboBox(item) {
		SBase$$1.call(this, "select", item);
		this.addClass(SBase$$1.CLASS_NAME.SELECT);
		this.addClass(SBase$$1.CLASS_NAME.COMBOBOX);
	}

	if ( SBase$$1 ) SComboBox.__proto__ = SBase$$1;
	SComboBox.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SComboBox.prototype.constructor = SComboBox;
	
	SComboBox.prototype.getEnabledElement = function getEnabledElement () {
		return this.getElement();
	};
	
	SComboBox.prototype.addListener = function addListener (func) {
		this.getElement().addEventListener("change", func, false);
	};
	
	SComboBox.prototype.setText = function setText (title) {
		if(!title) {
			return;
		}
		var element = this.getElement();
		// 1つの文字列のみならば、配列化する
		if	((typeof title === "string") &&
			(title instanceof String)) {
			title = [title];
		}
		// 内部の要素を全部消去する
		var child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		var i = 0;
		// 追加していく
		for(i = 0; i < title.length; i++) {
			var option_node = document.createElement("option");
			option_node.text = title[i].toString();
			option_node.value = title[i].toString();
			element.appendChild(option_node);
		}
	};
	
	SComboBox.prototype.getText = function getText () {
		var element = this.getElement();
		// select要素なら option を取得
		var child = element.children;
		var i = 0;
		var output = [];
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				output[output.length] = child[i].text;
			}
		}
		return output;
	};
	
	SComboBox.prototype.setSelectedItem = function setSelectedItem (text) {
		var child = this.getElement().children;
		var i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(child[i].value === text.toString()) {
					this.getElement().selectedIndex = j;
					break;
				}
				j++;
			}
		}
	};
	
	SComboBox.prototype.getSelectedItem = function getSelectedItem () {
		var child = this.getElement().children;
		var selectindex = this.getElement().selectedIndex;
		var i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(selectindex === j) {
					return child[i].value;
				}
				j++;
			}
		}
		return "";
	};

	return SComboBox;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SFileLoadButton = /*@__PURE__*/(function (SBase$$1) {
	function SFileLoadButton(title) {
		SBase$$1.call(this, "label", title);
		this.addClass(SBase$$1.CLASS_NAME.BUTTON);
		this.addClass(SBase$$1.CLASS_NAME.FILELOAD);
		
		// CSS有効化のために、label 内に input(file) を入れる
		// Edge のバグがあるので Edgeで使用できない
		// https://github.com/facebook/react/issues/7683
		var element   = SBase$$1.prototype.getElement.call(this);
		var file = document.createElement("input");
		element.style.textAlign =  "center";  
		file.setAttribute("type", "file");
		file.id = this.getId() + "_file";
		file.style.display = "none";
		this.file = file;
		element.appendChild(file);
	}

	if ( SBase$$1 ) SFileLoadButton.__proto__ = SBase$$1;
	SFileLoadButton.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SFileLoadButton.prototype.constructor = SFileLoadButton;
	
	SFileLoadButton.prototype.getEnabledElement = function getEnabledElement () {
		return this.file;
	};
	
	SFileLoadButton.prototype.getFileAccept = function getFileAccept () {
		var accept = this.file.getAttribute("accept");
		return (accept === null) ? "" : accept;
	};
	
	SFileLoadButton.prototype.setFileAccept = function setFileAccept (filter) {
		if(filter === SFileLoadButton.FILE_ACCEPT.DEFAULT) {
			if(this.file.getAttribute("accept") !== null) {
				this.file.removeAttribute("accept");
			}
		}
		else {
			this.file.accept = filter;
		}
	};
	
	SFileLoadButton.prototype.addListener = function addListener (func) {
		this.file.addEventListener("change",
			function(event){
				func(event.target.files);
			}, false );
	};

	return SFileLoadButton;
}(SBase));

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

var SFileSaveButton = /*@__PURE__*/(function (SBase$$1) {
	function SFileSaveButton(title) {
		SBase$$1.call(this, "a", title);
		this.addClass(SBase$$1.CLASS_NAME.BUTTON);
		this.addClass(SBase$$1.CLASS_NAME.FILESAVE);
		this.filename = "";
		this.url      = "";
		this.getElement().setAttribute("download", this.filename);
	}

	if ( SBase$$1 ) SFileSaveButton.__proto__ = SBase$$1;
	SFileSaveButton.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SFileSaveButton.prototype.constructor = SFileSaveButton;
	
	SFileSaveButton.prototype.getFileName = function getFileName () {
		return this.filename;
	};
	
	SFileSaveButton.prototype.setFileName = function setFileName (filename) {
		this.filename = filename;
		this.getElement().setAttribute("download", this.filenam);
	};
	
	SFileSaveButton.prototype.setURL = function setURL (url) {
		this.getElement().href = url;
		this.url               = url;
	};
	
	SFileSaveButton.prototype.setEnabled = function setEnabled (isenabled) {
		if(this.isEnabled() !== isenabled) {
			if(isenabled) {
				this.getElement().href = this.url;
			}
			else {
				this.getElement().removeAttribute("href");
			}
		}
		SBase$$1.prototype.setEnabled.call(this, isenabled);
	};

	return SFileSaveButton;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SGroupBox = /*@__PURE__*/(function (SBase$$1) {
	function SGroupBox(title) {
		SBase$$1.call(this, "fieldset");
		this.addClass(SBase$$1.CLASS_NAME.GROUPBOX);
		this.legend = document.createElement("legend");
		SBase$$1.node_tool.addClass(this.legend, SBase$$1.CLASS_NAME.GROUPBOX_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.textContent = title;
		this.body = document.createElement("div");
		SBase$$1.node_tool.addClass(this.body, SBase$$1.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		var element   = this.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}

	if ( SBase$$1 ) SGroupBox.__proto__ = SBase$$1;
	SGroupBox.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SGroupBox.prototype.constructor = SGroupBox;
	
	SGroupBox.prototype.getEnabledElement = function getEnabledElement () {
		return this.getElement();
	};
	
	SGroupBox.prototype.getContainerElement = function getContainerElement () {
		return this.body;
	};
	
	SGroupBox.prototype.clear = function clear () {
		SBase$$1.node_tool.removeChildNodes(this.body);
	};

	return SGroupBox;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SImagePanel = /*@__PURE__*/(function (SBase$$1) {
	function SImagePanel() {
		SBase$$1.call(this, "div");
		this.addClass(SBase$$1.CLASS_NAME.IMAGEPANEL);
		var image = document.createElement("img");
		image.id = this.id + "_img";
		this.image = image;
		this.getElement().appendChild(this.image);
	}

	if ( SBase$$1 ) SImagePanel.__proto__ = SBase$$1;
	SImagePanel.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SImagePanel.prototype.constructor = SImagePanel;
	
	SImagePanel.prototype.clear = function clear () {
		// 未作成
		this.node_tool.removeChildNodes(this.getElement());
	};
	
	SImagePanel.prototype.toDataURL = function toDataURL () {
		return this.image.src;
	};
	
	SImagePanel.prototype.putImageData = function putImageData (imagedata) {
		this.putImage(imagedata);
	};
	
	SImagePanel.prototype.putImage = function putImage (data, drawcallback) {
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
			var canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			var context = canvas.getContext("2d");
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
			var _this = this;
			var reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	};

	return SImagePanel;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SLabel = /*@__PURE__*/(function (SBase$$1) {
	function SLabel(title) {
		SBase$$1.call(this, "div", title);
		this.addClass(SBase$$1.CLASS_NAME.LABEL);
	}

	if ( SBase$$1 ) SLabel.__proto__ = SBase$$1;
	SLabel.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SLabel.prototype.constructor = SLabel;
	
	SLabel.prototype.getContainerElement = function getContainerElement () {
		return this.getElement();
	};

	return SLabel;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SPanel = /*@__PURE__*/(function (SBase$$1) {
	function SPanel(title) {
		SBase$$1.call(this, "div", null);
		this.addClass(SBase$$1.CLASS_NAME.PANEL);
		var element = this.getElement();
		this.legend = document.createElement("span");
		SBase$$1.node_tool.addClass(this.legend, SBase$$1.CLASS_NAME.PANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.body = document.createElement("div");
		SBase$$1.node_tool.addClass(this.body, SBase$$1.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		var that = this;
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

	if ( SBase$$1 ) SPanel.__proto__ = SBase$$1;
	SPanel.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SPanel.prototype.constructor = SPanel;
	
	SPanel.prototype.setText = function setText (title) {
		if(this.paneltool) {
			this.paneltool.setText(title);
		}
	};

	SPanel.prototype.getContainerElement = function getContainerElement () {
		return this.body;
	};

	SPanel.prototype.clear = function clear () {
		SBase$$1.node_tool.removeChildNodes(this.body);
	};

	return SPanel;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SProgressBar = /*@__PURE__*/(function (SBase$$1) {
	function SProgressBar(min, max) {
		SBase$$1.call(this, "label");
		this.addClass(SBase$$1.CLASS_NAME.LABEL);
		this.addClass(SBase$$1.CLASS_NAME.PROGRESSBAR);
		
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
		this.progress.className = SBase$$1.CLASS_NAME.PROGRESSBAR;
		// 内部の目盛りは0-1を使用する
		this.progress.value	= 0.0;
		this.progress.max	= 1.0;
	}

	if ( SBase$$1 ) SProgressBar.__proto__ = SBase$$1;
	SProgressBar.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SProgressBar.prototype.constructor = SProgressBar;
	
	SProgressBar.prototype.setMaximum = function setMaximum (max) {
		this.max = max;
	};
	
	SProgressBar.prototype.setMinimum = function setMinimum (min) {
		this.min = min;
	};
	
	SProgressBar.prototype.getMaximum = function getMaximum () {
		return this.max;
	};
	
	SProgressBar.prototype.getMinimum = function getMinimum () {
		return this.min;
	};
	
	SProgressBar.prototype.setValue = function setValue (value) {
		this.value = value;
		this.progress.value = this.getPercentComplete();
	};
	
	SProgressBar.prototype.getValue = function getValue () {
		return this.value;
	};
	
	SProgressBar.prototype.setIndeterminate = function setIndeterminate (newValue) {
		this.is_indeterminate = newValue;
		if(this.is_indeterminate) {
			this.progress.removeAttribute("value");
		}
		else {
			this.setValue(this.value);
		}
	};
	
	SProgressBar.prototype.isIndeterminate = function isIndeterminate () {
		return this.is_indeterminate;
	};
	
	SProgressBar.prototype.getPercentComplete = function getPercentComplete () {
		var delta = this.max - this.min;
		return (this.value - this.min) / delta;
	};

	return SProgressBar;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SSlidePanel = /*@__PURE__*/(function (SBase$$1) {
	function SSlidePanel(title) {
		SBase$$1.call(this, "div");
		this.addClass(SBase$$1.CLASS_NAME.SLIDEPANEL);
		this.textnode = document.createTextNode( title ? title : "");
		this.legend = document.createElement("span");
		SBase$$1.node_tool.addClass(this.legend, SBase$$1.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);
		this.slide = document.createElement("div");
		SBase$$1.node_tool.addClass(this.slide, SBase$$1.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";
		this.body = document.createElement("div");
		SBase$$1.node_tool.addClass(this.body, SBase$$1.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		var that = this;
		var clickfunc = function() {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);
		this.setOpen(false);
		this.slide.appendChild(this.body);
		var element   = SBase$$1.prototype.getElement.call(this);
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}

	if ( SBase$$1 ) SSlidePanel.__proto__ = SBase$$1;
	SSlidePanel.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SSlidePanel.prototype.constructor = SSlidePanel;
	
	SSlidePanel.prototype.setOpen = function setOpen (is_open) {
		this.is_open = is_open;
		if (this.is_open){
			this.slide.style.maxHeight	= this.body.scrollHeight + "px";
			SBase$$1.node_tool.addClass(this.legend, SBase$$1.CLASS_NAME.OPEN);
			SBase$$1.node_tool.removeClass(this.legend, SBase$$1.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight	= null;
			SBase$$1.node_tool.addClass(this.legend, SBase$$1.CLASS_NAME.CLOSE);
			SBase$$1.node_tool.removeClass(this.legend, SBase$$1.CLASS_NAME.OPEN);
		} 
	};
	
	SSlidePanel.prototype.isOpen = function isOpen () {
		return this.is_open;
	};
	
	SSlidePanel.prototype.getTextNode = function getTextNode () {
		return this.textnode;
	};
	
	SSlidePanel.prototype.getContainerElement = function getContainerElement () {
		return this.body;
	};
	
	SSlidePanel.prototype.clear = function clear () {
		SBase$$1.node_tool.removeChildNodes(this.body);
	};

	return SSlidePanel;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SSlider = /*@__PURE__*/(function (SBase$$1) {
	function SSlider(min, max) {
		SBase$$1.call(this, "label");
		this.addClass(SBase$$1.CLASS_NAME.LABEL);
		this.addClass(SBase$$1.CLASS_NAME.SLIDER);
		
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
		this.slider.className = SBase$$1.CLASS_NAME.SLIDER;
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

	if ( SBase$$1 ) SSlider.__proto__ = SBase$$1;
	SSlider.prototype = Object.create( SBase$$1 && SBase$$1.prototype );
	SSlider.prototype.constructor = SSlider;
	
	SSlider.prototype.getEnabledElement = function getEnabledElement () {
		return this.slider;
	};
	
	SSlider.prototype.setMaximum = function setMaximum (max) {
		this.slider.max = max;
	};
	
	SSlider.prototype.setMinimum = function setMinimum (min) {
		this.slider.min = min;
	};
	
	SSlider.prototype.getMaximum = function getMaximum () {
		return parseFloat(this.slider.max);
	};
	
	SSlider.prototype.getMinimum = function getMinimum () {
		return parseFloat(this.slider.min);
	};
	
	SSlider.prototype.setValue = function setValue (value) {
		this.slider.value = value;
	};
	
	SSlider.prototype.getValue = function getValue () {
		return parseFloat(this.slider.value);
	};
	
	SSlider.prototype.setMinorTickSpacing = function setMinorTickSpacing (step) {
		this.slider.step = step;
	};
	
	SSlider.prototype.getMinorTickSpacing = function getMinorTickSpacing () {
		return parseFloat(this.slider.step);
	};
	
	SSlider.prototype.setMajorTickSpacing = function setMajorTickSpacing (step) {
		this.majortick = step;
		this.removeMajorTickSpacing();
		var i;
		var min = this.getMinimum();
		var max = this.getMaximum();
		for(i = min; i <= max; i+= step) {
			var option_node = document.createElement("option");
			option_node.value = i.toString();
			this.datalist.appendChild(option_node);
		}
	};
	
	SSlider.prototype.getMajorTickSpacing = function getMajorTickSpacing () {
		return this.majortick;
	};
	
	SSlider.prototype.removeMajorTickSpacing = function removeMajorTickSpacing () {
		var element = this.datalist;
		var child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
	};
	
	SSlider.prototype.addListener = function addListener (func) {
		var isDown = false;
		var _this = this;
		var setDown = function() {
			isDown = true;
		};
		var setUp = function() {
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
	};

	SSlider.prototype.getWidth = function getWidth () {
		var width = this.slider.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	};
	
	SSlider.prototype.getHeight = function getHeight () {
		var height = this.slider.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	};
	
	SSlider.prototype.setWidth = function setWidth (width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		SBase$$1.prototype.setWidth.call(this, width);
		this.slider.style.width = width.toString() + this.unit;
	};
	
	SSlider.prototype.setHeight = function setHeight (height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		SBase$$1.prototype.setHeight.call(this, height);
		this.slider.style.height = height.toString() + this.unit;
	};

	return SSlider;
}(SBase));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var SComponent = {
	
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

// 「M系列乱数」
// 比較的長い 2^521 - 1通りを出力します。
// 詳細は、奥村晴彦 著『C言語によるアルゴリズム辞典』を参照
// 乱数はCでの動作と同じ値が出ることを確認。(seed = 1として1000番目の値が等しいことを確認)
//
// Javaの仕様に基づく48ビット線形合同法を実装仕様と思いましたが
// 「キャリー付き乗算」、「XorShift」、「線形合同法」などは
// 2つを組にしてプロットするといった使い方をすると、模様が見える可能性があるようで止めました。
// 有名で超高性能な「メルセンヌツイスタ」は、MITライセンスのため組み込みませんでした。

var Random = function Random() {
	this.x = [];
	for(var i = 0;i < 521;i++) {
		this.x[i] = 0;
	}
	if(arguments.length >= 1) {
		this.setSeed(arguments[0]);
	}
	else {
		// 線形合同法で適当に乱数を作成する
		var seed = ((new Date()).getTime() + Random.seedUniquifier) & 0xFFFFFFFF;
		Random.seedUniquifier = (Random.seedUniquifier + 1) & 0xFFFFFFFF;
		this.setSeed(seed);
	}
};

Random._unsigned32 = function _unsigned32 (x) {
	return ((x < 0) ? ((x & 0x7FFFFFFF) + 0x80000000) : x);
};
	
Random.prototype._multiplication32 = function _multiplication32 (x1, x2) {
	var b = (x1 & 0xFFFF) * (x2 & 0xFFFF);
	var y = Random._unsigned32(b);
	b = (x1 & 0xFFFF) * (x2 >>> 16);
	y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
	b = (x1 >>> 16) * (x2 & 0xFFFF);
	y = Random._unsigned32(y + ((b & 0xFFFF) << 16));
	return (y & 0xFFFFFFFF);
};

Random.prototype._rnd521 = function _rnd521 () {
	var x = this.x;
	for(var i = 0; i < 32; i++) {
		x[i] ^= x[i + 489];
	}
	for(var i$1 = 32; i$1 < 521; i$1++) {
		x[i$1] ^= x[i$1 - 32];
	}
};

Random.prototype.setSeed = function setSeed (seed) {
	// 伏見「乱数」東京大学出版会,1989 の方法により初期値を設定
	var u = 0;
	var x = this.x;
	// seedを使用して線形合同法でx[0-16]まで初期値を設定
	for(var i = 0; i <= 16; i++) {
		for(var j = 0; j < 32; j++) {
			seed = this._multiplication32(seed, 0x5D588B65) + 1;
			u = (u >>> 1) + ((seed < 0) ? 0x80000000 : 0);
		}
		x[i] = u;
	}
	// 残りのビットはx[i] = x[i-32] ^ x[i-521]で生成
	for(var i$1 = 16; i$1 < 521; i$1++) {
		u = (i$1 === 16) ? i$1 : (i$1 - 17);
		x[i$1] = ((x[u] << 23) & 0xFFFFFFFF) ^ (x[i$1 - 16] >>> 9) ^ x[i$1 - 1];
	}
	// ビットをシャッフル
	for(var i$2 = 0; i$2 < 4; i$2++) {
		this._rnd521();
	}
	this.xi = 0;
	this.haveNextNextGaussian = false;
	this.nextNextGaussian = 0;
};

Random.prototype.genrand_int32 = function genrand_int32 () {
	// 全て使用したら、再び混ぜる
	if(this.xi === 521) {
		this._rnd521();
		this.xi = 0;
	}
	var y = Random._unsigned32(this.x[this.xi]);
	this.xi = this.xi + 1;
	return y;
};

Random.prototype.next = function next (bits) {
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
};

Random.prototype.nextBytes = function nextBytes (y) {
	// 配列yに乱数を入れる
	// 8ビットのために、32ビット乱数を1回回すのはもったいない
	for(var i = 0;i < y.length; i++) {
		y[i] = this.next(8);
	}
	return;
};

Random.prototype.nextInt = function nextInt () {
	if(arguments.length === 1) {
		var r, y;
		var a = arguments[0];
		do {
			r = Random._unsigned32(this.genrand_int32());
			y = r % a;
		} while((r - y + a) > 0x100000000 );
		return y;
	}
	return (this.next(32) & 0xFFFFFFFF);
};

Random.prototype.nextLong = function nextLong () {
	return this.next(64);
};

Random.prototype.nextBoolean = function nextBoolean () {
	// 1ビットのために、32ビット乱数を1回回すのはもったいない
	return (this.next(1) !== 0);
};

Random.prototype.nextFloat = function nextFloat () {
	return (this.next(24) / 0x1000000);
};

Random.prototype.nextDouble = function nextDouble () {
	var a1 = this.next(26) * 0x8000000 + this.next(27);
	var a2 = 0x8000000 * 0x4000000;
	return (a1 / a2);
};

Random.prototype.nextGaussian = function nextGaussian () {
	if(this.haveNextNextGaussian) {
		this.haveNextNextGaussian = false;
		return this.nextNextGaussian;
	}
	var a = Math.sqrt( -2 * Math.log( this.nextDouble() ) );
	var b = 2 * Math.PI * this.nextDouble();
	var y = a * Math.sin(b);
	this.nextNextGaussian = a * Math.cos(b);
	this.haveNextNextGaussian = true;
	return y;
};

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

var BigInteger = function BigInteger() {
	var arguments$1 = arguments;

	this.element     = [];
	this.sign        = 0;
	if((arguments.length === 2) && (typeof Random !== "undefined") && (arguments[1] instanceof Random)) {
		this.sign = 1;
		var len = arguments[0];
		var random = arguments[1];
		var size = ((len - 1) >> 4) + 1;
		var r;
		if(len === 0) {
			return;
		}
		for(var i = 0, j = 0; i < size; i++) {
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
			var x = new BigInteger(arguments$1[0], arguments$1[2]);
			if(x.isProbablePrime(arguments$1[1])) {
				this.element = x.element;
				this.sign = x.sign;
				break;
			}
		}
	}
	else if(arguments.length >= 1) {
		this.sign = 1;
		var obj = arguments[0];
		if(obj instanceof BigInteger) {
			for(var i$1 = 0; i$1 < arguments[0].element.length; i$1++) {
				this.element[i$1] = arguments$1[0].element[i$1];
			}
			this.sign = arguments[0].sign;
		}
		else if((typeof obj === "number")||(obj instanceof Number)) {
			var x$1 = arguments[0];
			if(x$1 < 0) {
				this.sign = -1;
				x$1 = -x$1;
			}
			this.element = this._number_to_binary_number(x$1);
		}
		else if((typeof obj === "string")||(obj instanceof String)) {
			var x$2 = arguments[0].replace(/\s/g, "").toLowerCase();
			var buff = x$2.match(/^[-+]+/);
			if(buff !==  null) {
				buff = buff[0];
				x$2 = x$2.substring(buff.length, x$2.length);
				if(buff.indexOf("-") !==  -1) {
					this.sign = -1;
				}
			}
			if(arguments.length === 2) {
				this.element = this._string_to_binary_number(x$2, arguments[1]);
			}
			else if(/^0x/.test(x$2)) {
				this.element = this._string_to_binary_number(x$2.substring(2, x$2.length), 16);
			}
			else if(/^0b/.test(x$2)) {
				this.element = this._string_to_binary_number(x$2.substring(2, x$2.length), 2);
			}
			else if(/^0/.test(x$2)) {
				this.element = this._string_to_binary_number(x$2.substring(1, x$2.length), 8);
			}
			else {
				this.element = this._string_to_binary_number(x$2, 10);
			}
			// "0"の場合がある為
			if((this.element.length === 1)&&(this.element[0] === 0)) {
				this.element = [];
			}
		}
	}
};

BigInteger.prototype.equals = function equals (x) {
	if(!(x instanceof BigInteger)) {
		x = new BigInteger(x);
	}
	if(this.signum() !==  x.signum()) {
		return false;
	}
	if(this.element.length !==  x.element.length) {
		return false;
	}
	for(var i = 0;i < x.element.length; i++) {
		if(this.element[i] !==  x.element[i]) {
			return false;
		}
	}
	return true;
};

BigInteger.prototype.toString = function toString (radix) {
	if(arguments.length === 0) {
		radix = 10;
	}
	// int型で扱える数値で toString が可能なので、
	// せっかくだからより大きな進数で計算していけば、あとでtoStringする回数が減るテクニック
	// 2進数であれば、2^n乗で計算しても問題がない 4進数や8進数で計算して、2進数に戻せば巡回少数なし
	// v0.03 出来る限りまとめてn進数変換する
	var max_num = 0x3FFFFFFF;
	//                        max_num > radix^x
	// floor(log max_num / log radix) = x
	var keta = Math.floor( Math.log(max_num) / Math.log(radix) );
	var calcradix = Math.round(Math.pow(radix, keta));
	// zeros = "00000000...."
	var zeros = [];
	var i;
	for(i = 0; i < keta; i++) {
		zeros[i] = "0";
	}
	zeros = zeros.join("");
	// v0.03ここまで
	var x = this._binary_number_to_string(this.element, calcradix);
	var y = [];
	var z = "";
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
};

// 内部計算用
BigInteger.prototype.getShort = function getShort (n) {
	if((n < 0) || (this.element.length <= n)) {
		return 0;
	}
	return this.element[n];
};

BigInteger.prototype.byteValue = function byteValue () {
	var x = this.getShort(0);
	x &= 0xFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return x;
};

BigInteger.prototype.shortValue = function shortValue () {
	var x = this.getShort(0);
	x &= 0xFFFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return x;
};

BigInteger.prototype.intValue = function intValue () {
	var x = this.getShort(0) + (this.getShort(1) << 16);
	x &= 0xFFFFFFFF;
	if((x > 0)&&(this.sign < 0)) {
		x = -x;
	}
	return x;
};

BigInteger.prototype.longValue = function longValue () {
	var x = 0;
	for(var i = 3; i >= 0; i--) {
		x *= 65536;
		x += this.getShort(i);
	}
	if(this.sign < 0) {
		x = -x;
	}
	return x;
};

BigInteger.prototype.floatValue = function floatValue () {
	return parseFloat(this.toString());
};

BigInteger.prototype.doubleValue = function doubleValue () {
	return parseFloat(this.toString());
};

BigInteger.prototype.clone = function clone () {
	var y = new BigInteger();
	y.element = this.element.slice(0);
	y.sign    = this.sign;
	return y;
};

BigInteger.prototype.getLowestSetBit = function getLowestSetBit () {
	for(var i = 0;i < this.element.length;i++) {
		if(this.element[i] !==  0) {
			var x = this.element[i];
			for(var j = 0; j < 16; j++) {
				if(((x >>> j) & 1) !==  0) {
					return i * 16 + j;
				}
			}
		}
	}
	return -1;
};

BigInteger.prototype.bitLength = function bitLength () {
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !==  0) {
			var x = this.element[i];
			for(var j = 15; j >= 0; j--) {
				if(((x >>> j) & 1) !==  0) {
					return i * 16 + j + 1;
				}
			}
		}
	}
	return 0;
};

BigInteger.prototype.bitCount = function bitCount () {
	var target;
	if(this.sign >= 0) {
		target = this;
	}
	else {
		target = this.add(new BigInteger(1));
	}
	var len = target.bitLength();
	var bit = 0;
	var count = 0;
	for(var i = 0;bit < len;i++) {
		var x = target.element[i];
		for(var j = 0;((j < 16) && (bit < len));j++, bit++) {
			if(((x >>> j) & 1) !==  0) {
				count = count + 1;
			}
		}
	}
	return count;
};

// 内部計算用
// 負の場合は、2の補数表現を作成します
BigInteger.prototype.getTwosComplement = function getTwosComplement (len) {
	var y = this.clone();
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
		var e = y.element;
		// ビット反転後
		for(var i = 0; i < e.length; i++) {
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
};

BigInteger.prototype._and = function _and (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
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
};

BigInteger.prototype.and = function and (val) {
	return this.clone()._and(val);
};

BigInteger.prototype._or = function _or (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
		this.element[i] = x1 | x2;
	}
	this.sign = ((s1 === -1)||(s2 === -1)) ? -1 : Math.max(s1, s2);
	// 出力が負の場合は、2の補数
	if(this.sign === -1) {
		this.element = this.getTwosComplement(len).element;
	}
	return this;
};

BigInteger.prototype.or = function or (val) {
	return this.clone()._or(val);
};

BigInteger.prototype._xor = function _xor (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var e1  = this, e2 = val;
	var s1  = e1.signum(), s2 = e2.signum();
	var len = Math.max(e1.bitLength(), e2.bitLength());
	// 引数が負の場合は、2の補数
	e1 = e1.getTwosComplement(len).element;
	e2 = e2.getTwosComplement(len).element;
	var size = Math.max(e1.length, e2.length);
	this.element = [];
	for(var i = 0;i < size;i++) {
		var x1 = (i >= e1.length) ? 0 : e1[i];
		var x2 = (i >= e2.length) ? 0 : e2[i];
		this.element[i] = x1 ^ x2;
	}
	this.sign = ((s1 !== 0)&&(s1 !== s2)) ? -1 : 1;
	// 出力が負の場合は、2の補数
	if(this.sign === -1) {
		this.element = this.getTwosComplement(len).element;
	}
	return this;
};

BigInteger.prototype.xor = function xor (val) {
	return(this.clone()._xor(val));
};

BigInteger.prototype._not = function _not () {
	return(this._add(new BigInteger(1))._negate());
};

BigInteger.prototype.not = function not () {
	return(this.clone()._not());
};

BigInteger.prototype._andNot = function _andNot (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	return(this._and(val.not()));
};

BigInteger.prototype.andNot = function andNot (val) {
	return(this.clone()._andNot(val));
};

BigInteger.prototype._number_to_binary_number = function _number_to_binary_number (x) {
	if(x > 0xFFFFFFFF) {
		return(this._string_to_binary_number(x.toFixed(), 10));
	}
	var y = [];
	while(x !==  0) {
		y[y.length] = x & 1;
		x >>>= 1;
	}
	x = [];
	for(var i = 0; i < y.length; i++) {
		x[i >>> 4] |= y[i] << (i & 0xF);
	}
	return x;
};

BigInteger.prototype._string_to_binary_number = function _string_to_binary_number (text, radix) {
	// 下の変換をすることで、2進数での変換時に内部のforの繰り返す回数が減る
	// v0.03 出来る限りまとめてn進数変換する
	var max_num = 0x3FFFFFFF;
	var keta = Math.floor( Math.log(max_num) / Math.log(radix) );
	var calcradix = Math.round(Math.pow(radix, keta));
	var x = [];
	var y = [];
	var len = Math.ceil(text.length / keta);
	var offset = text.length;
	for(var i = 0; i < len; i++ ) {
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
		var carry = 0;
		for(var i$1 = x.length - 1; i$1 >= 0; i$1--) {
			var a = x[i$1] + carry * radix;
			x[i$1]  = a >>> 1;
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
	for(var i$2 = 0; i$2 < y.length; i$2++) {
		x[i$2 >>> 4] |= y[i$2] << (i$2 & 0xF);
	}
	return x;
};

BigInteger.prototype._binary_number_to_string = function _binary_number_to_string (binary, radix) {
	var add = function(x1, x2, y) {
		var size = x1.length;
		var carry = 0;
		for(var i = 0; i < size; i++) {
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
	var y = [0];
	var t = [1];
	for(var i = 0;i < binary.length;i++) {
		for(var j = 0; j < 16; j++) {
			if((binary[i] >>> j) & 1) {
				add(t, y, y);
			}
			add(t, t, t);
		}
	}
	return y;
};

BigInteger.prototype._memory_allocation = function _memory_allocation (n) {
	var elementsize = this.element.length << 4;
	if(elementsize < n) {
		var addsize = (((n - elementsize - 1) & 0xFFFFFFF0) >>> 4) + 1;
		for(var i = 0;i < addsize;i++) {
			this.element[this.element.length] = 0;
		}
	}
};

BigInteger.prototype._memory_reduction = function _memory_reduction () {
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !==  0) {
			if(i < this.element.length - 1) {
				this.element.splice(i + 1, this.element.length - i - 1);
			}
			return;
		}
	}
	this.sign = 0;
	this.element = [];
};

// ユークリッド互除法（非再帰）
// x = this, y = val としたとき gcd(x,y)を返す
BigInteger.prototype.gcd = function gcd (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var x = this, y = val, z;
	while(y.signum() !== 0) {
		z = x.remainder(y);
		x = y;
		y = z;
	}
	return x;
};

// 拡張ユークリッド互除法（非再帰）
// x = this, y = valとしたとき、 a*x + b*y = c = gcd(x, y) の[a, b, c]を返す
BigInteger.prototype.extgcd = function extgcd (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var ONE  = new BigInteger(1);
	var ZERO = new BigInteger(0);
	var r0 = this, r1 = val, r2, q1;
	var a0 = ONE,  a1 = ZERO, a2;
	var b0 = ZERO, b1 = ONE,  b2;
	while(r1.signum() !== 0) {
		var y = r0.divideAndRemainder(r1);
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
};

BigInteger.prototype._abs = function _abs () {
	// -1 -> 1, 0 -> 0, 1 -> 1
	this.sign *= this.sign;
	return this;
};

BigInteger.prototype.abs = function abs () {
	return this.clone()._abs();
};


BigInteger.prototype._negate = function _negate () {
	this.sign *= -1;
	return this;
};

BigInteger.prototype.negate = function negate () {
	return this.clone()._negate();
};

BigInteger.prototype.signum = function signum () {
	if(this.element.length === 0) {
		return 0;
	}
	return this.sign;
};

BigInteger.prototype.compareToAbs = function compareToAbs (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	if(this.element.length < val.element.length) {
		return -1;
	}
	else if(this.element.length > val.element.length) {
		return 1;
	}
	for(var i = this.element.length - 1;i >= 0;i--) {
		if(this.element[i] !== val.element[i]) {
			var x = this.element[i] - val.element[i];
			return ( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
		}
	}
	return 0;
};

BigInteger.prototype.compareTo = function compareTo (val) {
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
};

BigInteger.prototype.max = function max (val) {
	if(this.compareTo(val) >= 0) {
		return this.clone();
	}
	else {
		return val.clone();
	}
};

BigInteger.prototype.min = function min (val) {
	if(this.compareTo(val) >= 0) {
		return val.clone();
	}
	else {
		return this.clone();
	}
};

BigInteger.prototype._shift = function _shift (n) {
	if(n === 0) {
		return this;
	}
	var x = this.element;
	// 1ビットなら専用コードで高速計算
	if(n === 1) {
		var i = x.length - 1;
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
		for(var i$1 = 0;i$1 < x.length;i$1++) {
			x[i$1] >>>= 1;
			if((i$1 < x.length - 1) && ((x[i$1 + 1] & 1) !==  0)) {
				x[i$1] |= 0x8000;
			}
		}
		if(x[x.length - 1] === 0) {
			x.pop();
		}
	}
	else {
		// 16ビット単位なら配列を追加削除する高速計算
		if(n >= 16) {
			var m = n >>> 4;
			for(var i$2 = x.length - 1; i$2 >= 0; i$2--) {
				x[i$2 + m] = x[i$2];
			}
			for(var i$3 = m - 1; i$3 >= 0; i$3--) {
				x[i$3] = 0;
			}
			n &= 0xF;
		}
		else if(n <= -16){
			var m$1 = (-n) >>> 4;
			x.splice(0, m$1);
			n += m$1 << 4;
		}
		if(n !== 0) {
			// 15ビット以内ならビット演算でまとめて操作
			if(0 < n) {
				var carry = 0;
				for(var i$4 = 0; i$4 < x.length; i$4++) {
					x[i$4] = (x[i$4] << n) + carry;
					if(x[i$4] > 0xFFFF) {
						carry = x[i$4] >>> 16;
						x[i$4] &= 0xFFFF;
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
				for(var i$5 = 0; i$5 < x.length; i$5++) {
					if(i$5 !== x.length - 1) {
						x[i$5] += x[i$5 + 1] << 16;
						x[i$5] >>>= n;
						x[i$5] &= 0xFFFF;
					}
					else {
						x[i$5] >>>= n;
					}
				}
				if(x[x.length - 1] === 0) {
					x.pop();
				}
			}
		}
	}
	return this;
};

BigInteger.prototype.shift = function shift (n) {
	return this.clone()._shift(n);
};

BigInteger.prototype.shiftLeft = function shiftLeft (n) {
	return this.shift(n);
};

BigInteger.prototype.shiftRight = function shiftRight (n) {
	return this.shift(-n);
};

BigInteger.prototype._add = function _add (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var o1 = this;
	var o2 = val;
	var x1 = o1.element;
	var x2 = o2.element;
	if(o1.sign === o2.sign) {
		//足し算
		this._memory_allocation(x2.length << 4);
		var carry = 0;
		for(var i = 0; i < x1.length; i++) {
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
		var compare = o1.compareToAbs(o2);
		if(compare === 0) {
			this.element = [];
			this.sign = 1;
			return this;
		}
		else if(compare === -1) {
			this.sign = o2.sign;
			var swap = x1;
			x1 = x2.slice(0);
			x2 = swap;
		}
		var carry$1 = 0;
		for(var i$1 = 0; i$1 < x1.length; i$1++) {
			x1[i$1] -= ((x2.length >= (i$1 + 1)) ? x2[i$1] : 0) + carry$1;
			if(x1[i$1] < 0) {
				x1[i$1] += 0x10000;
				carry$1  = 1;
			}
			else {
				carry$1  = 0;
			}
		}
		this.element = x1;
		this._memory_reduction();
	}
	return this;
};

BigInteger.prototype.add = function add (val) {
	return this.clone()._add(val);
};

BigInteger.prototype._subtract = function _subtract (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var sign = val.sign;
	var out  = this._add(val._negate());
	val.sign = sign;
	return out;
};

BigInteger.prototype.subtract = function subtract (val) {
	return this.clone()._subtract(val);
};

BigInteger.prototype._multiply = function _multiply (val) {
	var x = this.multiply(val);
	this.element = x.element;
	this.sign    = x.sign;
	return this;
};

BigInteger.prototype.multiply = function multiply (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var out  = new BigInteger();
	var buff = new BigInteger();
	var o1 = this;
	var o2 = val;
	var x1 = o1.element;
	var x2 = o2.element;
	var y  = out.element;
	for(var i = 0; i < x1.length; i++) {
		buff.element = [];
		// x3 = x1[i] * x2
		var x3 = buff.element;
		var carry = 0;
		for(var j = 0; j < x2.length; j++) {
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
		for(var j$1 = x3.length - 1; j$1 >= 0; j$1--) {
			x3[j$1 + i] = x3[j$1];
		}
		for(var j$2 = i - 1; j$2 >= 0; j$2--) {
			x3[j$2] = 0;
		}
		// y = y + x3 (out._add(buff))
		//out._add(buff);
		carry = 0;
		out._memory_allocation(x3.length << 4);
		for(var j$3 = i; j$3 < y.length; j$3++) {
			y[j$3] += ((x3.length >= (j$3 + 1)) ? x3[j$3] : 0) + carry;
			if(y[j$3] > 0xFFFF) {
				carry = 1;
				y[j$3] &= 0xFFFF;
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
};

BigInteger.prototype._divideAndRemainder = function _divideAndRemainder (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	var out = [];
	if(val.signum() === 0) {
		out[0] = 1 / 0;
		out[1] = 0 / 0;
		return out;
	}
	var compare = this.compareToAbs(val);
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
	var ONE = new BigInteger(1);
	var size = this.bitLength() - val.bitLength();
	var x1 = this.clone()._abs();
	var x2 = val.shift(size)._abs();
	var y  = new BigInteger();
	for(var i = 0; i <= size; i++) {
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
};

BigInteger.prototype.divideAndRemainder = function divideAndRemainder (val) {
	return this.clone()._divideAndRemainder(val);
};

BigInteger.prototype._divide = function _divide (val) {
	return this._divideAndRemainder(val)[0];
};

BigInteger.prototype.divide = function divide (val) {
	return this.clone()._divide(val);
};

BigInteger.prototype._remainder = function _remainder (val) {
	return this._divideAndRemainder(val)[1];
};

BigInteger.prototype.remainder = function remainder (val) {
	return this.clone()._remainder(val);
};

BigInteger.prototype._mod = function _mod (val) {
	if(!(val instanceof BigInteger)) {
		val = new BigInteger(val);
	}
	if(val.signum() < 0) {
		return null;
	}
	var y = this._divideAndRemainder(val);
	if(y[1] instanceof BigInteger) {
		if(y[1].signum() >= 0) {
			return y[1];
		}
		else {
			return y[1]._add(val);
		}
	}
	return null;
};

BigInteger.prototype.mod = function mod (val) {
	return this.clone()._mod(val);
};

BigInteger.prototype._setBit = function _setBit (n) {
	this._memory_allocation(n + 1);
	this.element[n >>> 4] |= 1 << (n & 0xF);
	return this;
};

BigInteger.prototype.setBit = function setBit (n) {
	return this.clone()._setBit(n);
};

BigInteger.prototype._flipBit = function _flipBit (n) {
	this._memory_allocation(n + 1);
	this.element[n >>> 4] ^= 1 << (n & 0xF);
	return this;
};

BigInteger.prototype.flipBit = function flipBit (n) {
	return this.clone()._flipBit(n);
};

BigInteger.prototype.clearBit = function clearBit (n) {
	var y = this.clone();
	y.element[n >>> 4] &= ~(1 << (n & 0xF));
	y._memory_reduction();
	return y;
};

BigInteger.prototype.testBit = function testBit (n) {
	return ((this.element[n >>> 4] >>> (n & 0xF)) & 1);
};

BigInteger.prototype.pow = function pow (n) {
	var x, y;
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
};

BigInteger.prototype.modPow = function modPow (exponent, m) {
	m = new BigInteger(m);
	var x = new BigInteger(this);
	var y = new BigInteger(1);
	var e = new BigInteger(exponent);
	while(e.element.length !== 0) {
		if((e.element[0] & 1) !== 0) {
			y = y.multiply(x).mod(m);
		}
		x = x.multiply(x).mod(m);
		e._shift(-1);
	}
	return y;
};

BigInteger.prototype.modInverse = function modInverse (m) {
	m = new BigInteger(m);
	var y = this.extgcd(m);
	var ONE  = new BigInteger(1);
	if(y[2].compareTo(ONE) !== 0) {
		return null;
	}
	// 正にするため remainder ではなく mod を使用する
	return y[0]._add(m)._mod(m);
};

BigInteger.prototype.isProbablePrime = function isProbablePrime (certainty) {
	var e = this.element;
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
	certainty= certainty >> 1;
	var ZERO= new BigInteger(0);
	var ONE= new BigInteger(1);
	var n	= this;
	var LEN= n.bitLength();
	var n_1= n.subtract(ONE);
	var s = n_1.getLowestSetBit();
	var d = n_1.shift(-s);
	var random = new Random();
	var a;
	var isComposite;
	for(var i = 0; i < certainty; i++ ) {
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
		for(var j = 0; j <= s; j++) {
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
};

BigInteger.prototype.nextProbablePrime = function nextProbablePrime () {
	if(typeof Random === "undefined") {
		return(new BigInteger(0));
	}
	var x = this.clone();
	var ONE= new BigInteger(1);
	while(true) {
		x._add(ONE);
		if(x.isProbablePrime(100)) {
			break;
		}
	}
	return x;
};
	
BigInteger.valueOf = function valueOf (x) {
	return new BigInteger(x);
};
	
BigInteger.probablePrime = function probablePrime (bitLength, rnd) {
	return new BigInteger(bitLength ,100 ,rnd);
};

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

var BigDecimal = function BigDecimal() {
	this.integer = 0;
	this._scale = 0;
	var p1 = 0;
	var p2 = 0;
	var p3 = null;
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
		this.integer= p1.integer.clone();
		this._scale	= p1._scale;
		this.int_string= p1.int_string;
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
		var buff;
		// 正規化
		var text = p1.replace(/\s/g, "").toLowerCase();
		// +-の符号があるか
		var number_text = "";
		buff = text.match(/^[-+]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			if(buff.indexOf("-") !== -1) {
				number_text += "-";
			}
		}
		// 整数部があるか
		buff = text.match(/^[0-9]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			number_text += buff;
		}
		// 小数部があるか
		buff = text.match(/^\.[0-9]+/);
		if(buff !== null) {
			buff = buff[0];
			text = text.substring(buff.length, text.length);
			buff = buff.substring(1, buff.length);
			this._scale   = this._scale + buff.length;
			number_text += buff;
		}
		// 指数表記があるか
		buff = text.match(/^e(\+|-)?[0-9]+/);
		if(buff !== null) {
			buff = buff[0].substring(1, buff[0].length);
			this._scale   = this._scale - parseInt(buff, 10);
		}
		this.integer = new BigInteger(number_text, 10);
	}
	if(p3 instanceof MathContext) {
		var newbigdecimal = this.round(p3);
		this.integer= newbigdecimal.integer;
		this._scale	= newbigdecimal._scale;
	}
	//Senko.println(p1 + "\t\n->\t[" + this.integer + "," + this._scale +"]\n\t"+ this.toEngineeringString() );
};

BigDecimal.prototype._getUnsignedIntegerString = function _getUnsignedIntegerString () {
	// キャッシュする
	if(typeof this.int_string === "undefined") {
		this.int_string = this.integer.toString(10).replace(/^-/, "");
	}
	return this.int_string;
};

BigDecimal.prototype.clone = function clone () {
	return new BigDecimal(this);
};

BigDecimal.prototype.scale = function scale () {
	return this._scale;
};

BigDecimal.prototype.signum = function signum () {
	return this.integer.signum();
};

BigDecimal.prototype.precision = function precision () {
	return this._getUnsignedIntegerString().length;
};

BigDecimal.prototype.unscaledValue = function unscaledValue () {
	return new BigInteger(this.integer);
};

BigDecimal.prototype.toScientificNotation = function toScientificNotation (e) {
	var text= this._getUnsignedIntegerString();
	var s	= this.scale();
	var x	= [];
	var i, k;
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
};

BigDecimal.prototype.toString = function toString () {
	// 「調整された指数」
	var x = - this.scale() + (this.precision() - 1);
	// スケールが 0 以上で、「調整された指数」が -6 以上
	if((this.scale() >= 0) && (x >= -6)) {
		return this.toPlainString();
	}
	else {
		return this.toScientificNotation(x);
	}
};

BigDecimal.prototype.toEngineeringString = function toEngineeringString () {
	// 「調整された指数」
	var x = - this.scale() + (this.precision() - 1);
	// スケールが 0 以上で、「調整された指数」が -6 以上
	if((this.scale() >= 0) && (x >= -6)) {
		return this.toPlainString();
	}
	else {
		// 0 でない値の整数部が 1 〜 999 の範囲に収まるように調整
		return this.toScientificNotation(Math.floor(x / 3) * 3);
	}
};

BigDecimal.prototype.toPlainString = function toPlainString () {
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
	var text = this.toScientificNotation(0);
	return text.match(/^[^E]*/)[0];
};

BigDecimal.prototype.ulp = function ulp () {
	return new BigDecimal(BigInteger.ONE, this.scale());
};

BigDecimal.prototype.setScale = function setScale (newScale, roundingMode) {
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
	var text	= this._getUnsignedIntegerString();
	var sign	= this.signum();
	var sign_text= sign >= 0 ? "" : "-";
	// scale の誤差
	// 0 以上なら 0 を加えればいい。0未満なら0を削るか、四捨五入など丸めを行う
	var delta	= newScale - this.scale();// この桁分増やすといい
	if(0 <= delta) {
		// 0を加える
		var i;
		for(i = 0; i < delta; i++) {
			text = text + "0";
		}
		return new BigDecimal(new BigInteger(sign_text + text), newScale);
	}
	var keta		= text.length + delta;	// 最終的な桁数
	var keta_marume	= keta + 1;
	if(keta <= 0) {
		// 指定した scale では設定できない場合
		// 例えば "0.1".setScale(-2), "10".setScale(-3) としても表すことは不可能であるため、
		// sign（-1, 0, +1）のどれかの数値を使用して丸める
		var outdata = (sign + roundingMode.getAddNumber(sign)) / 10;
		// 上記の式は、CEILINGなら必ず1、正でCEILINGなら1、負でFLOORなら1、それ以外は0となり、
		// さらに元々の数値が 0 なら 0、切り捨て不能なら例外が返る計算式である。
		// これは Java の動作をまねています。
		return new BigDecimal(new BigInteger(outdata), newScale);
	}
	{
		// 0を削るだけで解決する場合
		// 単純な切捨て(0を削るのみ)
		var zeros		= text.match(/0+$/);
		var zero_length	= (zeros !== null) ? zeros[0].length : 0;
		if(( (zero_length + delta) >= 0 ) || (roundingMode === RoundingMode.DOWN)) {
			return new BigDecimal(new BigInteger(sign_text + text.substring(0, keta)), newScale);
		}
	}
	{
		// 丸め計算で解決する場合
		// 12345 -> '123'45
		text = text.substring(0, keta_marume);
		// 丸め計算に必要な切り取る桁数(後ろの1～2桁を取得)
		var cutsize = text.length > 1 ? 2 : 1;
		// '123'45 -> 1'23'4
		var number = parseInt(text.substring(text.length - cutsize, text.length)) * sign;
		// 「元の数」と「丸めに必要な数」を足す
		var x1 = new BigInteger(sign_text + text);
		var x2 = new BigInteger(roundingMode.getAddNumber(number));
		text = x1.add(x2).toString();
		// 丸め後の桁数に戻して
		return new BigDecimal(new BigInteger(text.substring(0, text.length - 1)), newScale);
	}
};

BigDecimal.prototype.round = function round (mc) {
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var newPrecision= mc.getPrecision();
	var delta		= newPrecision - this.precision();
	if((delta === 0)||(newPrecision === 0)) {
		return this.clone();
	}
	var newBigDecimal = this.setScale( this.scale() + delta, mc.getRoundingMode());
	/* 精度を上げる必要があるため、0を加えた場合 */
	if(delta > 0) {
		return newBigDecimal;
	}
	/* 精度を下げる必要があるため、丸めた場合は、桁の数が正しいか調べる */
	if(newBigDecimal.precision() === mc.getPrecision()) {
		return newBigDecimal;
	}
	/* 切り上げなどで桁数が１つ増えた場合 */
	var sign_text= newBigDecimal.integer.signum() >= 0 ? "" : "-";
	var abs_text= newBigDecimal._getUnsignedIntegerString();
	var inte_text= sign_text + abs_text.substring(0, abs_text.length - 1);
	return new BigDecimal(new BigInteger(inte_text), newBigDecimal.scale() - 1);
};

BigDecimal.prototype.abs = function abs (mc) {
	var output = this.clone();
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
};

BigDecimal.prototype.plus = function plus (mc) {
	var output = this.clone();
	if(arguments.length === 1) {
		return output;
	}
	else {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		return output.round(mc);
	}
};

BigDecimal.prototype.negate = function negate (mc) {
	var output = this.clone();
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
};

BigDecimal.prototype.compareTo = function compareTo (val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	var src		= this;
	var tgt		= val;
	// 簡易計算
	{
		var src_sign= src.signum();
		var tgt_sign= tgt.signum();
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
		var newdst = tgt.setScale(src._scale);
		return src.integer.compareTo(newdst.integer);
	}
	else {
		var newsrc = src.setScale(tgt._scale);
		return newsrc.integer.compareTo(tgt.integer);
	}
};

BigDecimal.prototype.equals = function equals (x) {
	if(!(x instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	return ((this._scale === x._scale) && (this.integer.equals(x.integer)));
};

BigDecimal.prototype.min = function min (val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(this.compareTo(val) <= 0) {
		return this.clone();
	}
	else {
		return val.clone();
	}
};

BigDecimal.prototype.max = function max (val) {
	if(!(val instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(this.compareTo(val) >= 0) {
		return this.clone();
	}
	else {
		return val.clone();
	}
};

BigDecimal.prototype.movePointLeft = function movePointLeft (n) {
	var output = this.scaleByPowerOfTen( -n );
	output = output.setScale(Math.max(this.scale() + n, 0));
	return output;
};

BigDecimal.prototype.movePointRight = function movePointRight (n) {
	var output = this.scaleByPowerOfTen( n );
	output = output.setScale(Math.max(this.scale() - n, 0));
	return output;
};

BigDecimal.prototype.scaleByPowerOfTen = function scaleByPowerOfTen (n) {
	var output = this.clone();
	output._scale = this.scale() - n;
	return output;
};

BigDecimal.prototype.stripTrailingZeros = function stripTrailingZeros () {
	// 0をできる限り取り除く
	var sign	= this.signum();
	var sign_text= sign >= 0 ? "" : "-";
	var text	= this.integer.toString(10).replace(/^-/, "");
	var zeros	= text.match(/0+$/);
	var zero_length= (zeros !== null) ? zeros[0].length : 0;
	if(zero_length === text.length) {
		// 全て 0 なら 1 ケタ残す
		zero_length = text.length - 1;
	}
	var newScale= this.scale() - zero_length;
	return new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), newScale);
};

BigDecimal.prototype.add = function add (augend, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(augend instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src		= this;
	var tgt		= augend;
	var newscale= Math.max(src._scale, tgt._scale);
	if(src._scale === tgt._scale) {
		// 1 e1 + 1 e1 = 1
		return new BigDecimal(src.integer.add(tgt.integer), newscale, mc);
	}
	else if(src._scale > tgt._scale) {
		// 1 e-2 + 1 e-1
		var newdst = tgt.setScale(src._scale);
		// 0.01 + 0.10 = 0.11 = 11 e-2
		return new BigDecimal(src.integer.add(newdst.integer), newscale, mc);
	}
	else {
		// 1 e-1 + 1 e-2
		var newsrc = src.setScale(tgt._scale);
		// 0.1 + 0.01 = 0.11 = 11 e-2
		return new BigDecimal(newsrc.integer.add(tgt.integer), newscale, mc);
	}
};

BigDecimal.prototype.subtract = function subtract (subtrahend, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(subtrahend instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src		= this;
	var tgt		= subtrahend;
	var newscale= Math.max(src._scale, tgt._scale);
	if(src._scale === tgt._scale) {
		return new BigDecimal(src.integer.subtract(tgt.integer), newscale, mc);
	}
	else if(src._scale > tgt._scale) {
		var newdst = tgt.setScale(src._scale);
		return new BigDecimal(src.integer.subtract(newdst.integer), newscale, mc);
	}
	else {
		var newsrc = src.setScale(tgt._scale);
		return new BigDecimal(newsrc.integer.subtract(tgt.integer), newscale, mc);
	}
};

BigDecimal.prototype.multiply = function multiply (multiplicand, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(multiplicand instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var src		= this;
	var tgt		= multiplicand;
	var newinteger= src.integer.multiply(tgt.integer);
	// 0.1 * 0.01 = 0.001
	var newscale= src._scale + tgt._scale;
	return new BigDecimal(newinteger, newscale, mc);
};

BigDecimal.prototype.divideToIntegralValue = function divideToIntegralValue (divisor, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}
	var getDigit  = function( num ) {
		var i;
		var text = "1";
		for(i = 0; i < num; i++) {
			text = text + "0";
		}
		return new BigInteger(text);
	};
	if(divisor.compareTo(BigDecimal.ZERO) === 0) {
		throw "ArithmeticException";
	}

	// 1000e0	/1e2			=1000e-2
	// 1000e0	/10e1		=100e-1
	// 1000e0	/100e0		=10e0
	// 1000e0	/1000e-1		=1e1
	// 1000e0	/10000e-2	=1e1
	// 1000e0	/100000e-3	=1e1

	// 10e2		/100e0		=1e1
	// 100e1	/100e0		=1e1
	// 1000e0	/100e0		=10e0
	// 10000e-1	/100e0		=100e-1	
	// 100000e-2/100e0		=1000e-2

	var src	= this;
	var tgt	= divisor;
	var src_integer= src.integer;
	var tgt_integer= tgt.integer;
	var newScale= src._scale - tgt._scale;

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
	var new_integer= src_integer.divide(tgt_integer);
	var sign		= new_integer.signum();
	if(sign !== 0) {
		var text= new_integer.toString(10).replace(/^-/, "");
		// 指定した桁では表すことができない
		if((mc.getPrecision() !== 0) && (text.length > mc.getPrecision())) {
			throw "ArithmeticException";
		}
		// 結果の優先スケール に合わせる (this.scale() - divisor.scale())
		if(text.length <= (-newScale)) {
			// 合わせることができないので、0をできる限り削る = stripTrailingZerosメソッド
			var zeros		= text.match(/0+$/);
			var zero_length= (zeros !== null) ? zeros[0].length : 0;
			var sign_text	= sign >= 0 ? "" : "-";
			return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), -zero_length));
		}
	}

	var output = new BigDecimal(new_integer);
	output = output.setScale(newScale, RoundingMode.UP);
	output = output.round(mc);
	return output;
};

BigDecimal.prototype.divideAndRemainder = function divideAndRemainder (divisor, mc) {
	if(arguments.length === 1) {
		mc = MathContext.UNLIMITED;
	}
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	if(!(mc instanceof MathContext)) {
		throw "not MathContext";
	}

	// 1000e0	/1e2			=1000e-2... 0e0
	// 1000e0	/10e1		=100e-1... 0e0
	// 1000e0	/100e0		=10e0... 0e0
	// 1000e0	/1000e-1		=1e1	... 0e0
	// 1000e0	/10000e-2	=1e1	... 0e-1
	// 1000e0	/100000e-3	=1e1	... 0e-2

	// 10e2		/100e0		=1e1	... 0e1
	// 100e1	/100e0		=1e1	... 0e1
	// 1000e0	/100e0		=10e0... 0e0
	// 10000e-1	/100e0		=100e-1... 0e-1
	// 100000e-2/100e0		=1000e-2... 0e-2

	var result_divide= this.divideToIntegralValue(divisor, mc);
	var result_remaind= this.subtract(result_divide.multiply(divisor, mc), mc);

	var output = [result_divide, result_remaind];
	return output;
};

BigDecimal.prototype.divide = function divide (divisor, p1, p2) {
	if(!(divisor instanceof BigDecimal)) {
		throw "not BigDecimal";
	}
	var src		= this;
	var tgt		= divisor;
	var roundingMode= null;
	var mc			= MathContext.UNLIMITED;
	var newScale	= 0;
	var isPriorityScale= false;
	var parm;
	if(arguments.length === 1) {
		newScale		 = src.scale() - tgt.scale();
		isPriorityScale= true;
	}
	else if(arguments.length === 2) {
		parm = p1;
		newScale	= src.scale();
		isPriorityScale= true;
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
	var i;
	var newsrc = src;
	var result_map = [];
	var result, result_divide, result_remaind, all_result;
	all_result = BigDecimal.ZERO;
	var precision = mc.getPrecision();
	var check_max = precision !== 0 ? (precision + 8) : 0x3FFFF;
	for(i = 0; i < check_max; i++) {
		result = newsrc.divideAndRemainder(tgt, MathContext.UNLIMITED);
		result_divide= result[0];
		result_remaind= result[1];
		all_result = all_result.add(result_divide.scaleByPowerOfTen(-i), MathContext.UNLIMITED);
		if(result_remaind.compareTo(BigDecimal.ZERO) !== 0) {
			if(precision === 0) {// 精度無限大の場合は、循環小数のチェックが必要
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
};

BigDecimal.prototype.toBigInteger = function toBigInteger () {
	var x = this.toPlainString().replace(/\.\d*$/, "");
	return new BigInteger(x.toPlainString());
};

BigDecimal.prototype.toBigIntegerExact = function toBigIntegerExact () {
	var x = this.setScale(0, RoundingMode.UNNECESSARY);
	return new BigInteger(x.toPlainString());
};

BigDecimal.prototype.longValue = function longValue () {
	var x = this.toBigInteger();
	x = x.longValue();
	return x;
};

BigDecimal.prototype.longValueExact = function longValueExact () {
	var x = this.toBigIntegerExact();
	x = x.longValue();
	return x;
};

BigDecimal.prototype.intValue = function intValue () {
	var x = this.toBigInteger();
	x = x.intValue();
	return x & 0xFFFFFFFF;
};

BigDecimal.prototype.intValueExact = function intValueExact () {
	var x = this.toBigIntegerExact();
	x = x.longValue();
	if((x < -2147483648) || (2147483647 < x)) {
		throw "ArithmeticException";
	}
	return x;
};

BigDecimal.prototype.floatValue = function floatValue () {
	var p = this.precision();
	if(MathContext.DECIMAL32.getPrecision() < p) {
		return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
	}
	return parseFloat(p.toEngineeringString());
};

BigDecimal.prototype.doubleValue = function doubleValue () {
	var p = this.precision();
	if(MathContext.DECIMAL64.getPrecision() < p) {
		return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
	}
	return parseFloat(p.toEngineeringString());
};

BigDecimal.prototype.pow = function pow (n, mc) {
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
	var x, y;
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
};
	
BigDecimal.valueOf = function valueOf (val, scale) {
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
};

var RoundingMode = {
	
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
			var sign = x >= 0 ? 1 : -1;
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
			var sign = x >= 0 ? 1 : -1;
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
			var sign, even;
			if(x < 0) {
				sign = -1;
				even = Math.ceil(x / 10) & 1;
			}
			else {
				sign = 1;
				even = Math.floor(x / 10) & 1;
			}
			var center;
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
		var values = RoundingMode.values;
		for(var i = 0; i < values.length; i++) {
			if(values[i].toString() === name) {
				return values[i];
			}
		}
		throw "IllegalArgumentException";
	},
	
	getRoundingMode: function(roundingMode) {
		var mode;
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

var MathContext = function MathContext() {
	this.precision = 0;
	this.roundingMode = RoundingMode.HALF_UP;
	var p1 = 0;
	var p2 = 0;
	var buff;
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
};

MathContext.prototype.getPrecision = function getPrecision () {
	return this.precision;
};

MathContext.prototype.getRoundingMode = function getRoundingMode () {
	return this.roundingMode;
};

MathContext.prototype.equals = function equals (x) {
	if(x instanceof MathContext) {
		if(x.toString() === this.toString()) {
			return true;
		}
	}
	return false;
};

MathContext.prototype.toString = function toString () {
	return ("precision=" + this.precision + " roundingMode=" + this.roundingMode.toString());
};

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

var S3Math =  {
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
		var s = x * x * (3.0 - 2.0 * x);
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

var S3Matrix = function S3Matrix(
	m00, m01, m02, m03,	// row 1
	m10, m11, m12, m13,	// row 2
	m20, m21, m22, m23,	// row 3
	m30, m31, m32, m33 ) {// row 4
	if(arguments.length === 0) {
		this.m00 = 0.0;this.m01 = 0.0;this.m02 = 0.0;this.m03 = 0.0;
		this.m10 = 0.0;this.m11 = 0.0;this.m12 = 0.0;this.m13 = 0.0;
		this.m20 = 0.0;this.m21 = 0.0;this.m22 = 0.0;this.m23 = 0.0;
		this.m30 = 0.0;this.m31 = 0.0;this.m32 = 0.0;this.m33 = 0.0;
	}
	else if(arguments.length === 9) {
		// 3x3行列
		this.m00 = m00;this.m01 = m01;this.m02 = m02;this.m03 = 0.0;
		this.m10 = m03;this.m11 = m10;this.m12 = m11;this.m13 = 0.0;
		this.m20 = m12;this.m21 = m13;this.m22 = m20;this.m23 = 0.0;
		this.m30 = 0.0;this.m31 = 0.0;this.m32 = 0.0;this.m33 = 1.0;
	}
	else if(arguments.length === 16) {
		// 4x4行列
		this.m00 = m00;this.m01 = m01;this.m02 = m02;this.m03 = m03;
		this.m10 = m10;this.m11 = m11;this.m12 = m12;this.m13 = m13;
		this.m20 = m20;this.m21 = m21;this.m22 = m22;this.m23 = m23;
		this.m30 = m30;this.m31 = m31;this.m32 = m32;this.m33 = m33;
	}
	else {
		throw "IllegalArgumentException";
	}
};
	
S3Matrix.prototype.equals = function equals (tgt) {
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
};
	
S3Matrix.prototype.clone = function clone () {
	return new S3Matrix(
		this.m00, this.m01, this.m02, this.m03,
		this.m10, this.m11, this.m12, this.m13,
		this.m20, this.m21, this.m22, this.m23,
		this.m30, this.m31, this.m32, this.m33
	);
};
	
S3Matrix.prototype.transposed = function transposed () {
	return new S3Matrix(
		this.m00, this.m10, this.m20, this.m30,
		this.m01, this.m11, this.m21, this.m31,
		this.m02, this.m12, this.m22, this.m32,
		this.m03, this.m13, this.m23, this.m33
	);
};

/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
S3Matrix.prototype.isNaN = function isNaN$1 () {
	returnisNaN(this.m00) || isNaN(this.m01) || isNaN(this.m02)  || isNaN(this.m03) ||
			isNaN(this.m10) || isNaN(this.m11) || isNaN(this.m12)  || isNaN(this.m13) ||
			isNaN(this.m20) || isNaN(this.m21) || isNaN(this.m22)  || isNaN(this.m23) ||
			isNaN(this.m30) || isNaN(this.m31) || isNaN(this.m32)  || isNaN(this.m33);
};

/**
	 * 有限の値であるか確認する
	 * @returns {Boolean}
	 */
S3Matrix.prototype.isFinite = function isFinite$1 () {
	returnisFinite(this.m00) && isFinite(this.m01) && isFinite(this.m02)  && isFinite(this.m03) ||
			isFinite(this.m10) && isFinite(this.m11) && isFinite(this.m12)  && isFinite(this.m13) ||
			isFinite(this.m20) && isFinite(this.m21) && isFinite(this.m22)  && isFinite(this.m23) ||
			isFinite(this.m30) && isFinite(this.m31) && isFinite(this.m32)  && isFinite(this.m33);
};

/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
S3Matrix.prototype.isRealNumber = function isRealNumber () {
	return !this.isNaN() && this.isFinite();
};

/**
	 * 掛け算します。
	 * @param {S3Vector|S3Matrix} tgt 行列、縦ベクトル
	 * @returns {S3Vector|S3Matrix}
	 */
S3Matrix.prototype.mul = function mul (tgt) {
	if(tgt instanceof S3Matrix) {
		var A = this;
		var B = tgt;
		var C = new S3Matrix();
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
		var A$1 = this;
		var v = tgt;
		// 行列×縦ベクトル＝縦ベクトル
		// Av = u なので、各項を行列の行ごとで掛け算する
		return new S3Vector(
			A$1.m00 * v.x + A$1.m01 * v.y + A$1.m02 * v.z + A$1.m03 * v.w,
			A$1.m10 * v.x + A$1.m11 * v.y + A$1.m12 * v.z + A$1.m13 * v.w,
			A$1.m20 * v.x + A$1.m21 * v.y + A$1.m22 * v.z + A$1.m23 * v.w,
			A$1.m30 * v.x + A$1.m31 * v.y + A$1.m32 * v.z + A$1.m33 * v.w
		);
	}
	else {
		throw "IllegalArgumentException";
	}
};
	
S3Matrix.prototype.det3 = function det3 () {
	var A = this;
	var out;
	out  = A.m00 * A.m11 * A.m22;
	out += A.m10 * A.m21 * A.m02;
	out += A.m20 * A.m01 * A.m12;
	out -= A.m00 * A.m21 * A.m12;
	out -= A.m20 * A.m11 * A.m02;
	out -= A.m10 * A.m01 * A.m22;
	return out;
};
	
S3Matrix.prototype.inverse3 = function inverse3 () {
	var A = this;
	var det = A.det3();
	if(det === 0.0) {
		return( null );
	}
	var id = 1.0 / det;
	var B = A.clone();
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
};
	
S3Matrix.prototype.det4 = function det4 () {
	var A = this;
	var out;
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
};
	
S3Matrix.prototype.inverse4 = function inverse4 () {
	var A = this;
	var det = A.det4();
	if(det === 0.0) {
		return( null );
	}
	var id = 1.0 / det;
	var B = new S3Matrix();
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
};
	
S3Matrix.prototype.toString = function toString () {
	return "[" +
	"[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n" + 
	" [" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + 
	" [" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + 
	" [" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]]";
};
	
S3Matrix.prototype.toInstanceArray = function toInstanceArray (Instance, dimension) {
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

var S3Vector = function S3Vector(x, y, z, w) {
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
};
	
S3Vector.prototype.clone = function clone () {
	return new S3Vector(this.x, this.y, this.z, this.w);
};
	
S3Vector.prototype.negate = function negate () {
	return new S3Vector(-this.x, -this.y, -this.z, this.w);
};
	
S3Vector.prototype.cross = function cross (tgt) {
	return new S3Vector(
		this.y * tgt.z - this.z * tgt.y,
		this.z * tgt.x - this.x * tgt.z,
		this.x * tgt.y - this.y * tgt.x,
		1.0
	);
};
	
S3Vector.prototype.dot = function dot (tgt) {
	return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
};
	
S3Vector.prototype.add = function add (tgt) {
	return new S3Vector(
		this.x + tgt.x,
		this.y + tgt.y,
		this.z + tgt.z,
		1.0
	);
};
	
S3Vector.prototype.sub = function sub (tgt) {
	return new S3Vector(
		this.x - tgt.x,
		this.y - tgt.y,
		this.z - tgt.z,
		1.0
	);
};
	
S3Vector.prototype.mul = function mul (tgt) {
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
		var v = this;
		var A = tgt;
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
};
	
S3Vector.prototype.setX = function setX (x) {
	return new S3Vector(x, this.y, this.z, this.w);
};
	
S3Vector.prototype.setY = function setY (y) {
	return new S3Vector(this.x, y, this.z, this.w);
};
	
S3Vector.prototype.setZ = function setZ (z) {
	return new S3Vector(this.x, this.y, z, this.w);
};
	
S3Vector.prototype.setW = function setW (w) {
	return new S3Vector(this.x, this.y, this.z, w);
};
	
S3Vector.prototype.max = function max (tgt) {
	return new S3Vector(
		Math.max(this.x, tgt.x),
		Math.max(this.y, tgt.y),
		Math.max(this.z, tgt.z),
		Math.max(this.w, tgt.w)
	);
};
	
S3Vector.prototype.min = function min (tgt) {
	return new S3Vector(
		Math.min(this.x, tgt.x),
		Math.min(this.y, tgt.y),
		Math.min(this.z, tgt.z),
		Math.min(this.w, tgt.w)
	);
};

S3Vector.prototype.equals = function equals (tgt) {
	return (
		S3Math.equals(this.x, tgt.x) &&
		S3Math.equals(this.y, tgt.y) &&
		S3Math.equals(this.z, tgt.z) &&
		S3Math.equals(this.w, tgt.w)
	);
};
	
S3Vector.prototype.mix = function mix (tgt, alpha) {
	return new S3Vector(
		S3Math.mix(this.x, tgt.x, alpha),
		S3Math.mix(this.y, tgt.y, alpha),
		S3Math.mix(this.z, tgt.z, alpha),
		S3Math.mix(this.w, tgt.w, alpha)
	);
};
	
S3Vector.prototype.norm = function norm () {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
	
S3Vector.prototype.normFast = function normFast () {
	return this.x * this.x + this.y * this.y + this.z * this.z;
};
	
S3Vector.prototype.normalize = function normalize () {
	var b = this.normFast();
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
};
	
S3Vector.prototype.toString = function toString (num) {
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
};
	
S3Vector.prototype.toHash = function toHash (num) {
	var s = 4;
	var t = 10000;
	var x = (parseFloat(this.x.toExponential(3).substring(0,5)) * 321) & 0xFFFFFFFF;
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
};
	
S3Vector.prototype.toInstanceArray = function toInstanceArray (Instance, dimension) {
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
};
	
S3Vector.prototype.pushed = function pushed (array, num) {
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
};

/**
	 * tgt への方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
S3Vector.prototype.getDirection = function getDirection (tgt) {
	return tgt.sub(this);
};

/**
	 * tgt への正規方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
S3Vector.prototype.getDirectionNormalized = function getDirectionNormalized (tgt) {
	return tgt.sub(this).normalize();
};

/**
	 * 指定した位置までの距離を取得する
	 * @param {S3Vector} tgt
	 * @returns {Number}
	 */
S3Vector.prototype.getDistance = function getDistance (tgt) {
	return this.getDirection(tgt).norm();
};

/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
S3Vector.prototype.isNaN = function isNaN$1 () {
	return isNaN(this.x) || isNaN(this.y) || isNaN(this.z)  || isNaN(this.w);
};

/**
	 * 有限の値か確認する
	 * @returns {Boolean}
	 */
S3Vector.prototype.isFinite = function isFinite$1 () {
	return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
};

/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
S3Vector.prototype.isRealNumber = function isRealNumber () {
	return !this.isNaN() && this.isFinite();
};

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
S3Vector.getNormalVector = function getNormalVector (posA, posB, posC, uvA, uvB, uvC) {
	var N;

	while(1) {
		var P0 = posA.getDirection(posB);
		var P1 = posA.getDirection(posC);
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
		var st0 = uvA.getDirection(uvB);
		var st1 = uvA.getDirection(uvC);
		var q = (void 0);
		try {
			// 接線と従法線を求める
			q = 1.0 / ((st0.cross(st1)).z);
			var T = new S3Vector(); // Tangent接線
			var B = new S3Vector(); // Binormal従法線
			T.x = q * (  st1.y * P0.x - st0.y * P1.x);
			T.y = q * (  st1.y * P0.y - st0.y * P1.y);
			T.z = q * (  st1.y * P0.z - st0.y * P1.z);
			B.x = q * ( -st1.x * P0.x + st0.x * P1.x);
			B.y = q * ( -st1.x * P0.y + st0.x * P1.y);
			B.z = q * ( -st1.x * P0.z + st0.x * P1.z);
			return {
				normal	: N,
				tangent	: T.normalize(),
				binormal: B.normalize()
			};
			/*
			// 接線と従法線は直行していない
			// 直行している方が行列として安定している。
			// 以下、Gram-Schmidtアルゴリズムで直行したベクトルを作成する場合
			const nT = T.sub(N.mul(N.dot(T))).normalize();
			const w  = N.cross(T).dot(B) < 0.0 ? -1.0 : 1.0;
			const nB = N.cross(nT).mul(w);
			return {
				normal	: N,
				tangent	: nT,
				binormal: nB
			}
			*/
		}
		catch (e) {
			break;
		}
	}
	return {
		normal	: N,
		tangent	: null,
		binormal: null
	};
};
	
/**
	 * A, B, C の3点が時計回りなら true をかえす。
	 * 時計回りでも反時計回りでもないと null を返す
	 * @param {S3Vector} A
	 * @param {S3Vector} B
	 * @param {S3Vector} C
	 * @returns {Boolean}
	 */
S3Vector.isClockwise = function isClockwise (A, B, C) {
	var v1 = A.getDirection(B).setZ(0);
	var v2 = A.getDirection(C).setZ(0);
	var type = v1.cross(v2).z;
	if(type === 0) {
		return null;
	}
	else if(type > 0) {
		return true;
	}
	else {
		return false;
	}
};

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

var S3Camera = function S3Camera(s3system) {
	this.sys = s3system;
	this.init();
};

S3Camera.prototype.dispose = function dispose () {
	this.sys	= null;
	this.fovY	= 0;
	this.eye	= null;
	this.center	= null;
	this.near	= 0;
	this.far	= 0;
};
	
S3Camera.prototype.init = function init () {
	this.fovY	= 45;
	this.eye	= new S3Vector(0, 0, 0);
	this.center	= new S3Vector(0, 0, 1);
	this.near	= 1;
	this.far	= 1000;
};
	
S3Camera.prototype.clone = function clone () {
	var camera = new S3Camera(this.sys);
	camera.fovY	= this.fovY;
	camera.eye	= this.eye;
	camera.center= this.center;
	camera.near	= this.near;
	camera.far	= this.far;
	return camera;
};
	
S3Camera.prototype.getVPSMatrix = function getVPSMatrix (canvas) {
	var x = S3System.calcAspect(canvas.width, canvas.height);
	// ビューイング変換行列を作成する
	var V = this.sys.getMatrixLookAt(this.eye, this.center);
	// 射影トランスフォーム行列
	var P = this.sys.getMatrixPerspectiveFov(this.fovY, x, this.near, this.far );
	// ビューポート行列
	var S = this.sys.getMatrixViewport(0, 0, canvas.width, canvas.height);
	return { LookAt : V, aspect : x, PerspectiveFov : P, Viewport : S };
};
	
S3Camera.prototype.setDrawRange = function setDrawRange (near, far) {
	this.near= near;
	this.far= far;
};
	
S3Camera.prototype.setFovY = function setFovY (fovY) {
	this.fovY = fovY;
};
	
S3Camera.prototype.setEye = function setEye (eye) {
	this.eye = eye.clone();
};
	
S3Camera.prototype.setCenter = function setCenter (center) {
	this.center = center.clone();
};
	
S3Camera.prototype.getDirection = function getDirection () {
	return this.eye.getDirectionNormalized(this.center);
};
	
S3Camera.prototype.getDistance = function getDistance () {
	return this.center.getDistance(this.eye);
};
	
S3Camera.prototype.setDistance = function setDistance (distance) {
	var direction = this.center.getDirectionNormalized(this.eye);
	this.eye = this.center.add(direction.mul(distance));
};
	
S3Camera.prototype.getRotateY = function getRotateY () {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2(ray.x, ray.z));
};
	
S3Camera.prototype.setRotateY = function setRotateY (deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = ray.setY(0).norm();
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	this.eye = new S3Vector(
		this.center.x + length * sin,
		this.eye.y,
		this.center.z + length * cos
	);
};
	
S3Camera.prototype.addRotateY = function addRotateY (deg) {
	this.setRotateY(this.getRotateY() + deg);
};
	
S3Camera.prototype.getRotateX = function getRotateX () {
	var ray = this.center.getDirection(this.eye);
	return S3Math.degrees(Math.atan2( ray.z, ray.y ));
};
	
S3Camera.prototype.setRotateX = function setRotateX (deg) {
	var rad = S3Math.radius(deg);
	var ray = this.center.getDirection(this.eye);
	var length = ray.setX(0).norm();
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	this.eye = new S3Vector(
		this.eye.x,
		this.center.y + length * cos,
		this.center.z + length * sin
	);
};
	
S3Camera.prototype.addRotateX = function addRotateX (deg) {
	this.setRotateX(this.getRotateX() + deg);
};
	
S3Camera.prototype.translateAbsolute = function translateAbsolute (v) {
	this.eye= this.eye.add(v);
	this.center= this.center.add(v);
};
	
S3Camera.prototype.translateRelative = function translateRelative (v) {
	var X, Y, Z;
	var up = new S3Vector(0.0, 1.0, 0.0);
	// Z ベクトルの作成
	Z = this.eye.getDirectionNormalized(this.center);
		
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
};
	
S3Camera.prototype.toString = function toString () {
	return "camera[\n" +
			"eye   :" + this.eye    + ",\n" +
			"center:" + this.center + ",\n" +
			"fovY  :" + this.fovY + "]";
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

var S3Light = function S3Light() {
	this.init();
};
	
S3Light.prototype.init = function init () {
	this.mode	= S3Light.MODE.DIRECTIONAL_LIGHT;
	this.power	= 1.0;
	this.range	= 1000.0;
	this.position= new S3Vector(0.0, 0.0, 0.0);
	this.direction= new S3Vector(0.0, 0.0, -1.0);
	this.color	= new S3Vector(1.0, 1.0, 1.0);
};
	
S3Light.prototype.clone = function clone (Instance) {
	if(!Instance) {
		Instance = S3Light;
	}
	var light = new Instance();
	light.mode	= this.mode;
	light.power	= this.power;
	light.range	= this.range;
	light.position= this.position;
	light.direction= this.direction;
	light.color	= this.color;
	return light;
};
	
S3Light.prototype.setMode = function setMode (mode) {
	this.mode = mode;
};
	
S3Light.prototype.setPower = function setPower (power) {
	this.power = power;
};
	
S3Light.prototype.setRange = function setRange (range) {
	this.range = range;
};
	
S3Light.prototype.setPosition = function setPosition (position) {
	this.position = position;
};
	
S3Light.prototype.setDirection = function setDirection (direction) {
	this.direction = direction;
};
	
S3Light.prototype.setColor = function setColor (color) {
	this.color = color;
};

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

var S3Material = function S3Material(s3system, name) {
	this.sys	= s3system;
	this.name	= "s3default";
	if(name !== undefined) {
		this.name = name;
	}
	this.color	= new S3Vector(1.0, 1.0, 1.0, 1.0);// 拡散反射の色
	this.diffuse= 0.8;							// 拡散反射の強さ
	this.emission= new S3Vector(0.0, 0.0, 0.0);	// 自己照明（輝き）
	this.specular= new S3Vector(0.0, 0.0, 0.0);	// 鏡面反射の色
	this.power	= 5.0;							// 鏡面反射の強さ
	this.ambient= new S3Vector(0.6, 0.6, 0.6);	// 光によらない初期色
	this.reflect= 0.0;							// 環境マッピングによる反射の強さ
	this.textureColor= this.sys.createTexture();
	this.textureNormal= this.sys.createTexture();
};

S3Material.prototype.dispose = function dispose () {
};
	
S3Material.prototype.setName = function setName (name) {
	this.name = name;
};
	
S3Material.prototype.setColor = function setColor (color) {
	this.color = this.sys._toVector3(color);
};
	
S3Material.prototype.setDiffuse = function setDiffuse (diffuse) {
	this.diffuse = this.sys._toValue(diffuse);
};
	
S3Material.prototype.setEmission = function setEmission (emission) {
	this.emission = this.sys._toVector3(emission);
};
	
S3Material.prototype.setSpecular = function setSpecular (specular) {
	this.specular = this.sys._toVector3(specular);
};
	
S3Material.prototype.setPower = function setPower (power) {
	this.power = this.sys._toValue(power);
};
	
S3Material.prototype.setAmbient = function setAmbient (ambient) {
	this.ambient = this.sys._toVector3(ambient);
};
	
S3Material.prototype.setReflect = function setReflect (reflect) {
	this.reflect = this.sys._toValue(reflect);
};
	
S3Material.prototype.setTextureColor = function setTextureColor (data) {
	if(this.textureColor !== null) {
		this.textureColor.dispose();
	}
	this.textureColor = this.sys.createTexture();
	this.textureColor.setImage(data);
};
	
S3Material.prototype.setTextureNormal = function setTextureNormal (data) {
	if(this.textureNormal !== null) {
		this.textureNormal.dispose();
	}
	this.textureNormal = this.sys.createTexture();
	this.textureNormal.setImage(data);
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

var S3Vertex = function S3Vertex(position) {
	this.position= position;
};
	
S3Vertex.prototype.clone = function clone (Instance) {
	if(!Instance) {
		Instance = S3Vertex;
	}
	return new Instance(this.position);
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

var S3TriangleIndex = function S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
	this._init(i1, i2, i3, indexlist, materialIndex, uvlist);
};

/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex 負の場合や未定義の場合は 0 とします。
	 * @param {Array} uvlist S3Vector Array
	 */
S3TriangleIndex.prototype._init = function _init (i1, i2, i3, indexlist, materialIndex, uvlist) {
	this.index			= null;	// 各頂点を示すインデックスリスト
	this.uv				= null;	// 各頂点のUV座標
	this.materialIndex	= null;	// 面の材質
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
};
	
S3TriangleIndex.prototype.clone = function clone (Instance) {
	if(!Instance) {
		Instance = S3TriangleIndex;
	}
	return new Instance( 0, 1, 2, this.index, this.materialIndex, this.uv );
};
	
S3TriangleIndex.prototype.inverseTriangle = function inverseTriangle (Instance) {
	if(!Instance) {
		Instance = S3TriangleIndex;
	}
	return new Instance( 2, 1, 0, this.index, this.materialIndex, this.uv );
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

var S3Mesh = function S3Mesh(sys) {
	this.sys = sys;
	this._init();
};
	
S3Mesh.prototype._init = function _init () {
	// 変数の準備
	this.src = {};
	this.src.vertex		= [];
	this.src.triangleindex= [];
	this.src.material	= [];
	this.is_complete= false;
};
	
S3Mesh.prototype.isComplete = function isComplete () {
	return this.is_complete;
};
	
S3Mesh.prototype.clone = function clone (Instance) {
	if(!Instance) {
		Instance = S3Mesh;
	}
	var mesh = new Instance(this.sys);
	mesh.addVertex(this.getVertexArray());
	mesh.addTriangleIndex(this.getTriangleIndexArray());
	mesh.addMaterial(this.getMaterialArray());
	return mesh;
};
	
S3Mesh.prototype.setComplete = function setComplete (is_complete) {
	this.is_complete = is_complete;
};
	
S3Mesh.prototype.setInverseTriangle = function setInverseTriangle (inverse) {
	this.setComplete(false);
	this.is_inverse = inverse; 
};
	
S3Mesh.prototype.getVertexArray = function getVertexArray () {
	return this.src.vertex;
};
	
S3Mesh.prototype.getTriangleIndexArray = function getTriangleIndexArray () {
	return this.src.triangleindex;
};
	
S3Mesh.prototype.getMaterialArray = function getMaterialArray () {
	return this.src.material;
};
	
S3Mesh.prototype.addVertex = function addVertex (vertex) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshvertex = this.getVertexArray(); 
	if(vertex === undefined) ;
	else if(vertex instanceof S3Vertex) {
		meshvertex[meshvertex.length] = vertex;
	}
	else {
		for(var i = 0; i < vertex.length; i++) {
			meshvertex[meshvertex.length] = vertex[i];
		}
	}
};
	
S3Mesh.prototype.addTriangleIndex = function addTriangleIndex (ti) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshtri = this.getTriangleIndexArray();
	if(ti === undefined) ;
	else if(ti instanceof S3TriangleIndex) {
		meshtri[meshtri.length] = this.is_inverse ? ti.inverseTriangle() : ti;
	}
	else {
		for(var i = 0; i < ti.length; i++) {
			meshtri[meshtri.length] = this.is_inverse ? ti[i].inverseTriangle() : ti[i];
		}
	}
};
	
S3Mesh.prototype.addMaterial = function addMaterial (material) {
	// 一応 immutable なのでそのままシャローコピー
	this.setComplete(false);
	var meshmat = this.getMaterialArray();
	if(material === undefined) ;
	else if(material instanceof S3Material) {
		meshmat[meshmat.length] = material;
	}
	else {
		for(var i = 0; i < material.length; i++) {
			meshmat[meshmat.length] = material[i];
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

var S3Angles = function S3Angles(z, x, y) {
	this.setRotateZXY(z, x, y);
};

S3Angles._toPeriodicAngle = function _toPeriodicAngle (x) {
	if(x > S3Angles.PI) {
		return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
	}
	else if(x < -S3Angles.PI) {
		return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
	}
	return x;
};

S3Angles.prototype.clone = function clone () {
	return new S3Angles(this.roll, this.pitch, this.yaw);
};

S3Angles.prototype.setRotateZXY = function setRotateZXY (z, x, y) {
	this.roll= S3Angles._toPeriodicAngle(isNaN(z) ? 0.0 : z);
	this.pitch= S3Angles._toPeriodicAngle(isNaN(x) ? 0.0 : x);
	this.yaw= S3Angles._toPeriodicAngle(isNaN(y) ? 0.0 : y);
};

S3Angles.prototype.addRotateX = function addRotateX (x) {
	return new S3Angles(this.roll, this.pitch + x, this.yaw);
};

S3Angles.prototype.addRotateY = function addRotateY (y) {
	return new S3Angles(this.roll, this.pitch, this.yaw + y);
};

S3Angles.prototype.addRotateZ = function addRotateZ (z) {
	return new S3Angles(this.roll + z, this.pitch, this.yaw);
};

S3Angles.prototype.setRotateX = function setRotateX (x) {
	return new S3Angles(this.roll, x, this.yaw);
};

S3Angles.prototype.setRotateY = function setRotateY (y) {
	return new S3Angles(this.roll, this.pitch, y);
};

S3Angles.prototype.setRotateZ = function setRotateZ (z) {
	return new S3Angles(z, this.pitch, this.yaw);
};

S3Angles.prototype.toString = function toString () {
	return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
};

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

var S3Model = function S3Model() {
	this._init();
};
		
S3Model.prototype._init = function _init () {
	this.angles		= new S3Angles();
	this.scale		= new S3Vector(1, 1, 1);
	this.position	= new S3Vector(0, 0, 0);
	this.mesh		= new S3Mesh();
};
	
S3Model.prototype.setMesh = function setMesh (mesh) {
	this.mesh		= mesh;
};
	
S3Model.prototype.getMesh = function getMesh () {
	return this.mesh;
};
	
S3Model.prototype.setScale = function setScale (x, y, z) {
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
};
	
S3Model.prototype.getScale = function getScale () {
	return this.scale;
};
	
S3Model.prototype.setPosition = function setPosition (x, y, z) {
	if((arguments.length === 1) && (x instanceof S3Vector)){
		this.position = x;
	}
	else {
		this.position = new S3Vector(x, y, z);
	}
};
	
S3Model.prototype.getPosition = function getPosition () {
	return this.position;
};
	
S3Model.prototype.getAngle = function getAngle () {
	return this.angles;
};
	
S3Model.prototype.setAngle = function setAngle (angles) {
	this.angles = angles;
};
	
S3Model.prototype.addRotateX = function addRotateX (x) {
	this.angles = this.angles.addRotateX(x);
};
	
S3Model.prototype.addRotateY = function addRotateY (y) {
	this.angles = this.angles.addRotateY(y);
};
	
S3Model.prototype.addRotateZ = function addRotateZ (z) {
	this.angles = this.angles.addRotateZ(z);
};
	
S3Model.prototype.setRotateX = function setRotateX (x) {
	this.angles = this.angles.setRotateX(x);
};
	
S3Model.prototype.setRotateY = function setRotateY (y) {
	this.angles = this.angles.setRotateY(y);
};
	
S3Model.prototype.setRotateZ = function setRotateZ (z) {
	this.angles = this.angles.addRotateZ(z);
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

var S3Scene = function S3Scene() {
	this._init();
};
	
S3Scene.prototype._init = function _init () {
	this.camera	= new S3Camera();
	this.model	= [];
	this.light	= [];
};
	
S3Scene.prototype.empty = function empty () {
	this.model	= [];
	this.light	= [];
};
	
S3Scene.prototype.setCamera = function setCamera (camera) {
	this.camera = camera.clone();
};
	
S3Scene.prototype.addModel = function addModel (model) {
	this.model[this.model.length] = model;
};
	
S3Scene.prototype.addLight = function addLight (light) {
	this.light[this.light.length] = light;
};
	
S3Scene.prototype.getCamera = function getCamera () {
	return this.camera;
};
	
S3Scene.prototype.getModels = function getModels () {
	return this.model;
};
	
S3Scene.prototype.getLights = function getLights () {
	return this.light;
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

var S3Texture = function S3Texture(s3system, data) {
	this.sys= s3system;
	this._init();
	if(data !== undefined) {
		this.setImage(data);
	}
};
	
S3Texture.prototype._init = function _init () {
	this.url		= null;
	this.image		= null;
	this.is_loadimage= false;
	this.is_dispose	= false;
};
	
S3Texture.prototype.dispose = function dispose () {
	if(!this.is_dispose) {
		this.is_dispose = true;
	}
};
	
S3Texture.prototype.setImage = function setImage (image) {
	if((image === null) || this.is_dispose){
		return;
	}
	if((image instanceof HTMLImageElement) ||
		(image instanceof HTMLCanvasElement)) {
		var original_width  = image.width;
		var original_height = image.height;
		var ceil_power_of_2 = function(x) {
			// IE には Math.log2 がない
			var a = Math.log(x) / Math.log(2);
			if ((a - Math.floor(a)) < 1e-10) {
				return x;
			}
			else {
				return 1 << Math.ceil(a);
			}
		};
		var ceil_width  = ceil_power_of_2(original_width);
		var ceil_height = ceil_power_of_2(original_height);
		if((original_width !== ceil_width) || (original_height !== ceil_height)) {
			// 2の累乗ではない場合は、2の累乗のサイズに変換
			var ceil_image = document.createElement("canvas");
			ceil_image.width= ceil_width;
			ceil_image.height= ceil_height;
			ceil_image.getContext("2d").drawImage(
				image,
				0, 0, original_width, original_height,
				0, 0, ceil_width, ceil_height
			);
			image = ceil_image;
		} 
	}
	if((image instanceof ImageData) ||
		(image instanceof HTMLImageElement) ||
		(image instanceof HTMLCanvasElement) ||
		(image instanceof HTMLVideoElement)) {
		if(this.url === null) {
			// 直接設定した場合はIDをURLとして設定する
			this.url	= this.sys._createID();
		}
		this.image		= image;
		this.is_loadimage= true;
		return;
	}
	else if((typeof image === "string")||(image instanceof String)) {
		this.url = image;
		var that = this;
		this.sys._download(this.url, function (image){
			that.setImage(image);
		});
		return;
	}
	else {
		console.log("not setImage");
		console.log(image);
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

var S3System = function S3System() {
	this._init();
};

S3System.prototype._init = function _init () {
	this.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
	this.setBackgroundColor(new S3Vector(1.0, 1.0, 1.0, 1.0));
};

S3System.prototype._createID = function _createID () {
	if(typeof this._CREATE_ID1 === "undefined") {
		this._CREATE_ID1 = 0;
		this._CREATE_ID2 = 0;
		this._CREATE_ID3 = 0;
		this._CREATE_ID4 = 0;
	}
	var id = ""+
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
};
	
S3System.prototype._download = function _download (url, callback) {
	var dotlist = url.split(".");
	var isImage = false;
	var ext = "";
	if(dotlist.length > 1) {
		var ext$1 = dotlist[dotlist.length - 1].toLocaleString();
		isImage = (ext$1 === "gif") || (ext$1 === "jpg") || (ext$1 === "png") || (ext$1 === "bmp") || (ext$1 === "svg") || (ext$1 === "jpeg");
	}
	if(isImage) {
		var image = new Image();
		image.onload = function() {
			callback(image, ext);
		};
		image.src = url;
		return;
	}
	var http = new XMLHttpRequest();
	var handleHttpResponse = function (){
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
};
	
S3System.prototype._toVector3 = function _toVector3 (x) {
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
};
	
S3System.prototype._toValue = function _toValue (x) {
	if(!isNaN(x)) {
		return x;
	}
	else {
		throw "IllegalArgumentException";
	}
};
	
S3System.prototype.setBackgroundColor = function setBackgroundColor (color) {
	this.backgroundColor = color;
};
	
S3System.prototype.getBackgroundColor = function getBackgroundColor () {
	return this.backgroundColor;
};
	
S3System.prototype.setSystemMode = function setSystemMode (mode) {
	this.systemmode = mode;
	if(this.systemmode === S3System.SYSTEM_MODE.OPEN_GL) {
		this.depthmode	= S3System.DEPTH_MODE.OPEN_GL;
		this.dimensionmode= S3System.DIMENSION_MODE.RIGHT_HAND;
		this.vectormode	= S3System.VECTOR_MODE.VECTOR4x1;
		this.frontface	= S3System.FRONT_FACE.COUNTER_CLOCKWISE;
		this.cullmode	= S3System.CULL_MODE.BACK;
	}
	else {
		this.depthmode	= S3System.DEPTH_MODE.DIRECT_X;
		this.dimensionmode= S3System.DIMENSION_MODE.LEFT_HAND;
		this.vectormode	= S3System.VECTOR_MODE.VECTOR1x4;
		this.frontface	= S3System.FRONT_FACE.CLOCKWISE;
		this.cullmode	= S3System.CULL_MODE.BACK;
	}
};
	
/**
	 * ビューポート行列を作成する際に、Z値の範囲の範囲をどうするか
	 * @param {S3System.DEPTH_MODE} depthmode
	 * @returns {undefined}
	 */
S3System.prototype.setDepthMode = function setDepthMode (depthmode) {
	this.depthmode = depthmode;
};
	
/**
	 * 座標軸について左手系か、右手系か
	 * @param {S3System.DIMENSION_MODE} dimensionmode
	 * @returns {undefined}
	 */
S3System.prototype.setDimensionMode = function setDimensionMode (dimensionmode) {
	this.dimensionmode = dimensionmode;
};
	
/**
	 * N次元の座標について、横ベクトルか、縦ベクトル、どちらで管理するか
	 * @param {S3System.VECTOR_MODE} vectormode
	 * @returns {undefined}
	 */
S3System.prototype.setVectorMode = function setVectorMode (vectormode) {
	this.vectormode = vectormode;
};
	
/**
	 * どのようなポリゴンの頂点の順序を表として定義するか
	 * @param {S3System.FRONT_FACE} frontface
	 * @returns {undefined}
	 */
S3System.prototype.setFrontMode = function setFrontMode (frontface) {
	this.frontface = frontface;
};
	
/**
	 * どの方向を描写しないかを設定する。
	 * @param {S3System.CULL_MODE} cullmode
	 * @returns {undefined}
	 */
S3System.prototype.setCullMode = function setCullMode (cullmode) {
	this.cullmode = cullmode;
};
	
S3System.prototype.setCanvas = function setCanvas (canvas) {
	var that	= this;
	var ctx		= canvas.getContext("2d");
	this.canvas	= canvas;
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
			var color = that.getBackgroundColor();
			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
			ctx.fillStyle = "rgba(" + color.x * 255 + "," + color.y * 255 + "," + color.z * 255 + "," + color.w + ")";
			ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);
		}
	};
};
	
/**
	 * カリングのテストをする
	 * @param {S3Vector} p1
	 * @param {S3Vector} p2
	 * @param {S3Vector} p3
	 * @returns {Boolean} true で描写しない
	 */
S3System.prototype.testCull = function testCull (p1, p2, p3) {
	if(this.cullmode === S3System.CULL_MODE.NONE) {
		return false;
	}
	if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
		return true;
	}
	var isclock = S3Vector.isClockwise(p1, p2, p3);
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
};
	
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
S3System.prototype.getMatrixViewport = function getMatrixViewport (x, y, Width, Height, MinZ, MaxZ) {
	if(MinZ === undefined) {
		MinZ = 0.0;
	}
	if(MaxZ === undefined) {
		MaxZ = 1.0;
	}
	// M.m11 は、DirectXだとマイナス、OpenGLだとプラスである
	// 今回は、下がプラスであるcanvasに表示させることを考えて、マイナスにしてある。
	var M = new S3Matrix();
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
};
	
/**
	 * 視体積の上下方向の視野角を求める
	 * @param {Number} zoomY
	 * @returns {Number}
	 */
S3System.calcFovY = function calcFovY (zoomY) {
	return(2.0 * Math.atan(1.0 / zoomY));
};
	
/**
	 * アスペクト比を求める
	 * @param {Number} width
	 * @param {Number} height
	 * @returns {Number}
	 */
S3System.calcAspect = function calcAspect (width, height) {
	return(width / height);
};
	
/**
	 * パースペクティブ射影行列を作成する
	 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
	 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
	 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
	 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixPerspectiveFov = function getMatrixPerspectiveFov (fovY, Aspect, Near, Far) {
	var arc = S3Math.radius(fovY);
	var zoomY = 1.0 / Math.tan(arc / 2.0);
	var zoomX = zoomY / Aspect;
	var M = new S3Matrix();
	M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
	M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 0.0;
	var Delta = Far - Near;
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
};
	
/**
	 * ビュートランスフォーム行列を作成する
	 * @param {S3Vector} eye カメラの座標の位置ベクトル
	 * @param {S3Vector} at カメラの注視点の位置ベクトル
	 * @param {S3Vector} up カメラの上への方向ベクトル
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixLookAt = function getMatrixLookAt (eye, at, up) {
	if(up === undefined) {
		up = new S3Vector(0.0, 1.0, 0.0);
	}
	// Z ベクトルの作成
	var Z = eye.getDirectionNormalized(at);
	if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
		// 右手系なら反転
		Z = Z.negate();
	}
	// X, Y ベクトルの作成
	var X = up.cross(Z).normalize();
	var Y = Z.cross(X);
	var M = new S3Matrix();
	M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
	M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
	M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
	M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};
	
/**
	 * 単位行列を作成します。
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixIdentity = function getMatrixIdentity () {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return M;
};
	
/**
	 * 平行移動行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixTranslate = function getMatrixTranslate (x, y, z) {
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};
	
/**
	 * 拡大縮小行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixScale = function getMatrixScale (x, y, z) {
	var M = new S3Matrix();
	M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};
	
/**
	 * X軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixRotateX = function getMatrixRotateX (degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};
	
/**
	 * Y軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixRotateY = function getMatrixRotateY (degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
	M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
	 * Z軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixRotateZ = function getMatrixRotateZ (degree) {
	var arc = S3Math.radius(degree);
	var cos = Math.cos(arc);
	var sin = Math.sin(arc);
	var M = new S3Matrix();
	M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
	M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
	M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
	M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
	return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
};

/**
	 * 縦型、横型を踏まえて掛け算します。
	 * @param {S3Matrix} A
	 * @param {S3Matrix|S3Vector} B
	 * @returns {S3Matrix|S3Vector}
	 */
S3System.prototype.mulMatrix = function mulMatrix (A, B) {
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
};

/**
	 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
	 * @param {Number} z
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {S3Matrix}
	 */
S3System.prototype.getMatrixRotateZXY = function getMatrixRotateZXY (z, x, y) {
	var Z = this.getMatrixRotateZ(z);
	var X = this.getMatrixRotateX(x);
	var Y = this.getMatrixRotateY(y);
	return this.mulMatrix(this.mulMatrix(Z, X), Y);
};

S3System.prototype.getMatrixWorldTransform = function getMatrixWorldTransform (model) {
	// 回転行列
	var R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
	// スケーリング
	var S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
	// 移動行列
	var T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
	// ワールド変換行列を作成する
	var W = this.mulMatrix(this.mulMatrix(S, R), T);
	return W;
};

S3System.prototype.clear = function clear () {
	this.context2d.clear();
};

S3System.prototype._calcVertexTransformation = function _calcVertexTransformation (vertexlist, MVP, Viewport) {
	var newvertexlist = [];
		
	for(var i = 0; i < vertexlist.length; i++) {
		var p = vertexlist[i].position;
			
		//console.log("1 " + p);
		//console.log("2 " + this.mulMatrix(VPS.LookAt, p));
		//console.log("3 " + this.mulMatrix(VPS.PerspectiveFov, this.mulMatrix(VPS.LookAt, p)));
		//console.log("4 " + this.mulMatrix(MVP, p));
			
		p = this.mulMatrix(MVP, p);
		var rhw = p.w;
		p = p.mul(1.0 / rhw);
		p = this.mulMatrix(Viewport, p);
		newvertexlist[i] = new S3Vertex(p);
	}
	return newvertexlist;
};

S3System.prototype.drawAxis = function drawAxis (scene) {
	var VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
	var vertexvector = [];
	vertexvector[0] = new S3Vector(0, 0, 0);
	vertexvector[1] = new S3Vector(10, 0, 0);
	vertexvector[2] = new S3Vector(0, 10, 0);
	vertexvector[3] = new S3Vector(0, 0, 10);
		
	var newvector = [];
	var M = this.mulMatrix(VPS.LookAt, VPS.PerspectiveFov);
	for(var i = 0; i < vertexvector.length; i++) {
		var p = vertexvector[i];
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
};

S3System.prototype._drawPolygon = function _drawPolygon (vetexlist, triangleindexlist) {
	for(var i = 0; i < triangleindexlist.length; i++) {
		var ti = triangleindexlist[i];
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
};

S3System.prototype.drawScene = function drawScene (scene) {
	var VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
	this.context2d.setLineWidth(1.0);
	this.context2d.setLineColor("rgb(0, 0, 0)");
		
	var models = scene.getModels();
	for(var i = 0; i < models.length; i++) {
		var model= models[i];
		var mesh= model.getMesh();
		if(mesh.isComplete() === false) {
			continue;
		}
		var M = this.getMatrixWorldTransform(model);
		var MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
		var vlist = this._calcVertexTransformation(mesh.src.vertex, MVP, VPS.Viewport);
		this._drawPolygon(vlist, mesh.src.triangleindex);
	}
};

S3System.prototype._disposeObject = function _disposeObject () {
};
	
S3System.prototype.createVertex = function createVertex (position) {
	return new S3Vertex(position);
};
	
S3System.prototype.createTriangleIndex = function createTriangleIndex (i1, i2, i3, indexlist, materialIndex, uvlist) {
	return new S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
};
	
S3System.prototype.createTexture = function createTexture (name) {
	return new S3Texture(this, name);
};
	
S3System.prototype.createScene = function createScene () {
	return new S3Scene();
};
	
S3System.prototype.createModel = function createModel () {
	return new S3Model();
};
	
S3System.prototype.createMesh = function createMesh () {
	return new S3Mesh(this);
};
	
S3System.prototype.createMaterial = function createMaterial (name) {
	return new S3Material(this, name);
};
	
S3System.prototype.createLight = function createLight () {
	return new S3Light();
};
	
S3System.prototype.createCamera = function createCamera () {
	var camera = new S3Camera(this);
	return camera;
};

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

var S3GLShader = function S3GLShader(sys, code) {
	this._init(sys, code);
};
	
S3GLShader.prototype._init = function _init (sys, code) {
	this.sys		= sys;
	this.code		= null;
	this.shader		= null;
	this.sharder_type= -1;
	this.is_error	= false;
	var that = this;
	var downloadCallback = function(code) {
		that.code = code;
	};
	if(code.indexOf("\n") === -1) {
		// 1行の場合はURLとみなす（雑）
		this.sys._download(code, downloadCallback);
	}
	else {
		this.code = code;
	}
};
	
S3GLShader.prototype.isError = function isError () {
	return this.is_error;
};
	
S3GLShader.prototype.getCode = function getCode () {
	return this.code;
};
	
S3GLShader.prototype.getShader = function getShader () {
	var gl = this.sys.getGL();
	if((gl === null) || this.is_error || (this.code === null)) {
		// まだ準備ができていないのでエラーを発生させない
		return null;
	}
	if(this.shader !== null) {
		// すでにコンパイル済みであれば返す
		return this.shader;
	}
	var code = this.code;
	// コメントを除去する
	code = code.replace(/\/\/.*/g,"");
	code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
	// コード内を判定して種別を自動判断する（雑）
	var sharder_type = 0;
	if(code.indexOf("gl_FragColor") !== -1) {
	// フラグメントシェーダである
		sharder_type = gl.FRAGMENT_SHADER;
	}
	else {
		// バーテックスシェーダである
		sharder_type = gl.VERTEX_SHADER;
	}
	var data = this.sys.glfunc.createShader(sharder_type, code);
	if(data.is_error) {
		this.is_error = true;
		return null;
	}
	this.shader		= data.shader;
	this.sharder_type= sharder_type;
	return this.shader;
		
};
	
S3GLShader.prototype.getShaderType = function getShaderType () {
	if(this.sharder_type !== -1) {
		return this.sharder_type;
	}
	if(this.getShader() !== null) {
		return this.sharder_type;
	}
	return null;
};
	
S3GLShader.prototype.dispose = function dispose () {
	var gl = this.sys.getGL();
	if(gl === null) {
		return null;
	}
	if(this.shader === null) {
		return true;
	}
	this.sys.glfunc.deleteShader(this.shader);
	this.shader= null;
	this.sharder_type = -1;
	return true;
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

var S3GLArray = function S3GLArray(data, dimension, datatype) {
	// 引数の情報(S3GLArray.datatype.instance)を用いて、
	// JS用配列を、WEBGL用配列に変換して保存する
	if(data instanceof datatype.instance) {
		this.data= data;
	}
	else if((data instanceof S3Vector) || (data instanceof S3Matrix)) {
		this.data= data.toInstanceArray(datatype.instance, dimension);
	}
	else if(data instanceof Array) {
		this.data= new datatype.instance(data);
	}
	else if(!isNaN(data)) {
		this.data= new datatype.instance([data]);
	}
	else {
		throw "IllegalArgumentException";
	}
	this.dimension= dimension;
	this.datatype= datatype;
		
	var instance = "";
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
};

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

var S3GLProgram = function S3GLProgram(sys, id) {
	this._init(sys, id);
};

S3GLProgram.prototype._init = function _init (sys, id) {
	this.id			= id;
	this.sys		= sys;
	this.vertex		= null;
	this.fragment	= null;
	this.isDLVertex	= false;
	this.isDLFragment= false;
	this.program	= null;
	this.is_linked	= false;
	this.is_error	= false;
	this.enable_vertex_number = {};
		
	var variable = {};
	variable.attribute= {};
	variable.uniform= {};
	variable.modifiers= [];
	variable.datatype= [];
	this.variable = variable;
		
	var _this = this;
	this.activeTextureId = 0;
		
	var g = {
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
			var gl = sys.getGL();
			if(gl){
				gl.activeTexture(gl.TEXTURE0 + _this.activeTextureId);
				gl.bindTexture(gl.TEXTURE_2D, value);
				gl.uniform1i(location, _this.activeTextureId);
				_this.activeTextureId++;
			}
		}
	};
		
	var info = {
		int	: {glsltype : "int",instance : Int32Array,	size : 1, btype : "INT",bind : g.uniform1iv},
		float: {glsltype : "float",instance : Float32Array,size : 1, btype : "FLOAT",bind : g.uniform1fv},
		bool: {glsltype : "bool",instance : Int32Array,	size : 1, btype : "INT",bind : g.uniform1iv},
		mat2: {glsltype : "mat2",instance : Float32Array,size : 4, btype : "FLOAT",bind : g.uniformMatrix2fv},
		mat3: {glsltype : "mat3",instance : Float32Array,size : 9, btype : "FLOAT",bind : g.uniformMatrix3fv},
		mat4: {glsltype : "mat4",instance : Float32Array,size : 16,btype : "FLOAT",bind : g.uniformMatrix4fv},
		vec2: {glsltype : "vec2",instance : Float32Array,size : 2, btype : "FLOAT",bind : g.uniform2fv},
		vec3: {glsltype : "vec3",instance : Float32Array,size : 3, btype : "FLOAT",bind : g.uniform3fv},
		vec4: {glsltype : "vec4",instance : Float32Array,size : 4, btype : "FLOAT",bind : g.uniform4fv},
		ivec2: {glsltype : "ivec2",instance : Int32Array,	size : 2, btype : "INT",bind : g.uniform2iv},
		ivec3: {glsltype : "ivec3",instance : Int32Array,	size : 3, btype : "INT",bind : g.uniform3iv},
		ivec4: {glsltype : "ivec4",instance : Int32Array,	size : 4, btype : "INT",bind : g.uniform4iv},
		bvec2: {glsltype : "bvec2",instance : Int32Array,	size : 2, btype : "INT",bind : g.uniform2iv},
		bvec3: {glsltype : "bvec3",instance : Int32Array,	size : 3, btype : "INT",bind : g.uniform3iv},
		bvec4: {glsltype : "bvec4",instance : Int32Array,	size : 4, btype : "INT",bind : g.uniform4iv},
		sampler2D	: {glsltype : "sampler2D",instance : Image, size : 1, btype : "TEXTURE",bind : g.uniformSampler2D},
		samplerCube: {glsltype : "samplerCube",instance : Image, size : 1, btype : "TEXTURE",bind : null}
	};
		
	this.analysisShader = function(code, variable) {
		// コメントを除去する
		code = code.replace(/\/\/.*/g,"");
		code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
		// 1行ずつ解析
		var codelines = code.split("\n");
		for(var i = 0; i < codelines.length; i++) {
			// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
			var data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\w+\s*\])?;/);
			if(data === null) {
				continue;
			}
			// 見つけたら変数名や、型を記録しておく
			// 配列数の調査は、定数などを使用されると簡単に調べられないため取得できない
			// そのため自動でテストできないため、bindする際に、正しい配列数の配列をbindすること
			var text_space		= data[1];
			var text_type		= data[2];
			var text_variable	= data[3];
			var text_array		= data[4];
			var is_array		= text_array !== undefined;
			// 型に応じたテンプレートを取得する
			// data[1] ... uniform, data[2] ... mat4, data[3] ... M
			var targetinfo = info[text_type];
			variable[text_variable]		= {};
			// 参照元データを書き換えないようにディープコピーする
			for(var key in targetinfo) {
				variable[text_variable][key]= targetinfo[key];// glsl, js, size, bind
			}
			// さらに情報を保存しておく
			variable[text_variable].name	= text_variable;	// M
			variable[text_variable].modifiers= text_space;		// uniform
			variable[text_variable].is_array= is_array;
			variable[text_variable].location= [];
				
		}
		return;
	};
};
	
S3GLProgram.prototype.resetActiveTextureId = function resetActiveTextureId () {
	this.activeTextureId = 0;
};
	
S3GLProgram.prototype.isLinked = function isLinked () {
	return this.is_linked;
};
	
S3GLProgram.prototype.dispose = function dispose () {
	var gl = this.sys.getGL();
	if(gl === null) {
		return false;
	}
	if(this.is_linked) {
		this.disuseProgram();
		this.sys.glfunc.deleteProgram(this.program,
			this.vertex.getShader(), this.fragment.getShader()
		);
		this.program	= null;
		this.is_linked	= false;
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
};
	
S3GLProgram.prototype.setVertexShader = function setVertexShader (shader_code) {
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
};
	
S3GLProgram.prototype.setFragmentShader = function setFragmentShader (shader_code) {
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
};

S3GLProgram.prototype.useProgram = function useProgram () {
	if(!this.isLinked()) {
		return false;
	}
	var program = this.getProgram();
	if(program && this.sys.getGL()) {
		this.sys.getGL().useProgram(program);
	}
	return true;
};
	
S3GLProgram.prototype.disuseProgram = function disuseProgram () {
	if(!this.isLinked()) {
		return false;
	}
	var gl = this.sys.getGL();
	if(gl) {
		// enable化したデータを解放する
		for(var key in this.enable_vertex_number) {
			gl.disableVertexAttribArray(key);
		}
		this.enable_vertex_number = {};
	}
	return true;
};
	
S3GLProgram.prototype.getProgram = function getProgram () {
	var gl = this.sys.getGL();
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
	var is_error_vertex	= this.vertex.isError();
	var is_error_fragment= this.fragment.isError();
	if(is_error_vertex || is_error_fragment) {
		console.log("shader compile error");
		this.is_error = true;
		return null;
	}
	var shader_vertex= this.vertex.getShader();
	var shader_fragment= this.fragment.getShader();
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
	var data = this.sys.glfunc.createProgram(shader_vertex, shader_fragment);
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
};

/**
	 * プログラムにデータを結びつける
	 * @param {String} name
	 * @param {Object} data
	 * @returns {undefined}
	 */
S3GLProgram.prototype.bindData = function bindData (name, data) {
	if(!this.isLinked()) {
		return false;
	}
	var gl= this.sys.getGL();
	var prg= this.getProgram();
	var variable= this.variable[name];
		
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
				for(var i = 0; i < data.length; i++) {
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
	var toArraydata = function(data) {
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
			if((variable.glsltype === "mat2") ||
				(variable.glsltype === "mat3") ||
				(variable.glsltype === "mat4") ){
				return data.toInstanceArray(variable.instance, variable.size);
			}
		}
		// 入力型がベクトル型であり、GLSLも数値であれば
		if(data instanceof S3Vector) {
			if((variable.glsltype === "vec2") ||
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
			if((variable.glsltype === "int") ||
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
		for(var i$1 = 0; i$1 < data.length; i$1++) {
			if(variable.location[i$1] !== -1) {
				// 配列の値が NULL になっているものは調査しない
				if(data[i$1] !== null) {
					data[i$1] = toArraydata(data[i$1]);
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
			for(var i$2 = 0; i$2 < data.length; i$2++) {
				if(variable.location[i$2] !== -1) {
					// 配列の値が NULL になっているものはbindしない
					if(data[i$2] !== null) {
						variable.bind(variable.location[i$2], data[i$2]);
					}
				}
			}
		}
	}
		
	return true;
};

/**
	 * プログラムにデータを結びつける
	 * @param {Object} s3mesh
	 * @returns {Integer} IBOのインデックス数
	 */
S3GLProgram.prototype.bindMesh = function bindMesh (s3mesh) {
	if(!this.isLinked()) {
		// programが未作成
		return 0;
	}
	var gl = this.sys.getGL();
	if(gl === null) {
		// glが用意されていない
		return 0;
	}
	var gldata = s3mesh.getGLData();
	if(gldata === null) {
		// 入力値が用意されていない
		return 0;
	}
	// インデックスをセット
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
	var index_length = gldata.ibo.array_length;
	// 頂点をセット(あらかじめコードから解析した attribute について埋める)
	for(var key in this.variable) {
			
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

var S3GLLight = /*@__PURE__*/(function (S3Light$$1) {
	function S3GLLight() {
		S3Light$$1.call(this);
	}

	if ( S3Light$$1 ) S3GLLight.__proto__ = S3Light$$1;
	S3GLLight.prototype = Object.create( S3Light$$1 && S3Light$$1.prototype );
	S3GLLight.prototype.constructor = S3GLLight;

	S3GLLight.prototype.clone = function clone () {
		return S3Light$$1.prototype.clone.call(this, S3GLLight);
	};
	
	S3GLLight.prototype.getGLHash = function getGLHash () {
		return "" + this.mode + this.power + this.range + this.position.toString(3) + this.direction.toString(3) + this.color.toString(3);
	};
	
	S3GLLight.prototype.getGLData = function getGLData () {
		var lightsColor = this.color.mul(this.power);
		var lightsVector = new S3Vector();
		// uniform 節約のためにライト用のベクトルは用途によって入れる値を変更する
		if(this.mode === S3Light$$1.MODE.DIRECTIONAL_LIGHT) {
			lightsVector = this.direction;
		}
		else if(this.mode === S3Light$$1.MODE.POINT_LIGHT) {
			lightsVector = this.position;
		}
		// uniform 節約のために最終的に渡すデータをまとめる
		return {
			lightsData1	: new S3GLArray([this.mode, this.range, lightsVector.x, lightsVector.y] , 4, S3GLArray.datatype.Float32Array),
			lightsData2	: new S3GLArray([lightsVector.z, lightsColor.x, lightsColor.y, lightsColor.z] , 4, S3GLArray.datatype.Float32Array)
		};
	};

	return S3GLLight;
}(S3Light));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLMaterial = /*@__PURE__*/(function (S3Material$$1) {
	function S3GLMaterial(s3dlsystem, name) {
		S3Material$$1.call(this, s3dlsystem, name);
	}

	if ( S3Material$$1 ) S3GLMaterial.__proto__ = S3Material$$1;
	S3GLMaterial.prototype = Object.create( S3Material$$1 && S3Material$$1.prototype );
	S3GLMaterial.prototype.constructor = S3GLMaterial;
	
	S3GLMaterial.prototype.getGLHash = function getGLHash () {
		// 名前は被らないので、ハッシュに使用する
		return this.name;
	};

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * uniform の数がハードウェア上限られているため、送る情報は選定すること
	 * @returns {頂点データ（色情報）}
	 */
	S3GLMaterial.prototype.getGLData = function getGLData () {
		// テクスチャを取得
		var tex_color	= this.textureColor.getGLData();
		var tex_normal	= this.textureNormal.getGLData();
		// テクスチャのありなしフラグを作成。ない場合はダミーデータを入れる。
		var tex_exist	= [tex_color === null?0:1, tex_normal === null?0:1];
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
	};

	return S3GLMaterial;
}(S3Material));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLTexture = /*@__PURE__*/(function (S3Texture$$1) {
	function S3GLTexture(s3glsystem, data) {
		S3Texture$$1.call(this, s3glsystem, data);
		this.gldata			= null;
	}

	if ( S3Texture$$1 ) S3GLTexture.__proto__ = S3Texture$$1;
	S3GLTexture.prototype = Object.create( S3Texture$$1 && S3Texture$$1.prototype );
	S3GLTexture.prototype.constructor = S3GLTexture;

	S3GLTexture.prototype._init = function _init () {
		S3Texture$$1.prototype._init.call(this);
		this.gldata			= null;
	};
	
	S3GLTexture.prototype.dispose = function dispose () {
		if(!this.is_dispose) {
			this.is_dispose = true;
			if(this.gldata !== null) {
				this.sys._disposeObject(this);
				this.gldata = null;
			}
		}
	};

	S3GLTexture.prototype.getGLData = function getGLData () {
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
	};

	return S3GLTexture;
}(S3Texture));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLMesh = /*@__PURE__*/(function (S3Mesh$$1) {
	function S3GLMesh(sys) {
		S3Mesh$$1.call(this, sys);
	}

	if ( S3Mesh$$1 ) S3GLMesh.__proto__ = S3Mesh$$1;
	S3GLMesh.prototype = Object.create( S3Mesh$$1 && S3Mesh$$1.prototype );
	S3GLMesh.prototype.constructor = S3GLMesh;
	
	S3GLMesh.prototype._init = function _init () {
		S3Mesh$$1.prototype._init.call(this);
		// webgl用
		this.gldata = {};
		this.is_compile_gl	= false;
	};
	
	S3GLMesh.prototype.clone = function clone () {
		return S3Mesh$$1.prototype.clone.call(this, S3GLMesh);
	};
	
	S3GLMesh.prototype.isCompileGL = function isCompileGL () {
		return this.is_compile_gl;
	};
	
	S3GLMesh.prototype.setCompileGL = function setCompileGL (is_compile_gl) {
		this.is_compile_gl = is_compile_gl;
	};
	
	/**
	 * 三角形インデックス情報（頂点ごとのYV、法線）などを求める
	 * 具体的には共有している頂点をしらべて、法線の平均値をとる
	 * @returns {S3GLTriangleIndexData}
	 */
	S3GLMesh.prototype.createTriangleIndexData = function createTriangleIndexData () {
		var vertex_list			= this.getVertexArray();
		var triangleindex_list	= this.getTriangleIndexArray();
		var tid_list = [];
		
		var normallist = {
			normal		: null,
			tangent		: null,
			binormal	: null
		};
		
		// 各面の法線、接線、従法線を調べる
		for(var i = 0; i < triangleindex_list.length; i++) {
			var triangleindex = triangleindex_list[i];
			var index	= triangleindex.index;
			var uv		= triangleindex.uv;
			tid_list[i]	= triangleindex.createGLTriangleIndexData();
			var triangledata = tid_list[i];
			var vector_list = null;
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
			for(var vector_name in normallist) {
				triangledata.face[vector_name] = vector_list[vector_name];
			}
		}
		
		// 素材ごとに、三角形の各頂点に、面の法線情報を追加する
		// 後に正規化する（平均値をとる）が、同じベクトルを加算しないようにキャッシュでチェックする
		var vertexdatalist_material = [];
		var vertexdatalist_material_cash = [];
		for(var i$1 = 0; i$1 < triangleindex_list.length; i$1++) {
			var triangleindex$1 = triangleindex_list[i$1];
			var material = triangleindex$1.materialIndex;
			var triangledata$1 = tid_list[i$1];
			// 未登録なら新規作成する
			if(vertexdatalist_material[material] === undefined) {
				vertexdatalist_material[material] = [];
				vertexdatalist_material_cash[material] = [];
			}
			var vertexdata_list = vertexdatalist_material[material];
			var vertexdata_list_cash = vertexdatalist_material_cash[material];
			// 素材ごとの三角形の各頂点に対応する法線情報に加算していく
			for(var j = 0; j < 3; j++) {
				// 未登録なら新規作成する
				var index$1 = triangleindex$1.index[j];
				if(vertexdata_list[index$1] === undefined) {
					vertexdata_list[index$1] = {
						normal		: new S3Vector(0, 0, 0),
						tangent		: new S3Vector(0, 0, 0),
						binormal	: new S3Vector(0, 0, 0)
					};
					vertexdata_list_cash[index$1] = {
						normal		: [],
						tangent		: [],
						binormal	: []
					};
				}
				var vertexdata = vertexdata_list[index$1];
				var vertexdata_cash = vertexdata_list_cash[index$1];
				
				// 加算する
				for(var vector_name$1 in normallist) {
					if(triangledata$1.face[vector_name$1] !== null) {
						// データが入っていたら加算する
						var id = triangledata$1.face[vector_name$1].toHash(3);
						if(vertexdata_cash[vector_name$1][id]) { continue; }
						vertexdata[vector_name$1] = vertexdata[vector_name$1].add(triangledata$1.face[vector_name$1]);
						vertexdata_cash[vector_name$1][id] = true;
					}
				}
			}
		}
		
		// マテリアルごとの頂点の法線を、正規化して1とする（平均値をとる）
		for(var material$1 in vertexdatalist_material) {
			var vertexdata_list$1 = vertexdatalist_material[material$1];
			for(var index$2 in vertexdata_list$1) {
				var vertexdata$1 = vertexdata_list$1[index$2];
				for(var vectorname in normallist) {
					// あまりに小さいと、0で割ることになるためチェックする
					if(vertexdata$1[vectorname].normFast() > 0.000001) {
						vertexdata$1[vectorname] = vertexdata$1[vectorname].normalize();
					}
				}
			}
		}
		
		// 面法線と、頂点（スムーズ）法線との角度の差が、下記より大きい場合は面法線を優先
		var SMOOTH = {};
		SMOOTH.normal	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.tangent	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.binormal	= Math.cos((50/360)*(2*Math.PI));
		
		// 最終的に三角形の各頂点の法線を求める
		for(var i$2 = 0; i$2 < triangleindex_list.length; i$2++) {
			var triangleindex$2 = triangleindex_list[i$2];
			var material$2 = triangleindex$2.materialIndex;
			var triangledata$2 = tid_list[i$2];
			var vertexdata_list$2 = vertexdatalist_material[material$2];
			
			// 法線ががあまりに違うのであれば、面の法線を採用する
			for(var j$1 = 0; j$1 < 3; j$1++) {
				var index$3 = triangleindex$2.index[j$1];
				var vertexdata$2 = vertexdata_list$2[index$3];
				for(var vectorname$1 in normallist) {
					var targetdata = (void 0);
					if(triangledata$2.face[vectorname$1]) {
						// 面で計算した値が入っているなら、
						// 面で計算した値と、頂点の値とを比較してどちらかを採用する
						var rate  = triangledata$2.face[vectorname$1].dot(vertexdata$2[vectorname$1]);
						// 指定した度以上傾いていたら、面の法線を採用する
						targetdata = (rate < SMOOTH[vectorname$1]) ? triangledata$2.face : vertexdata$2;
					}
					else {
						targetdata = vertexdata$2;
					}
					// コピー
					triangledata$2.vertex[vectorname$1][j$1]	= targetdata[vectorname$1];
				}
			}
		}
		
		return tid_list;
	};

	/**
	 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
	 * @returns {undefined}
	 */
	S3GLMesh.prototype._getGLArrayData = function _getGLArrayData () {
		
		var vertex_list			= this.getVertexArray();
		var triangleindex_list	= this.createTriangleIndexData();
		var hashlist = [];
		var vertex_length = 0;
		
		var triangle			= [];
		var vertextypelist	= {};
		
		// インデックスを再構築して、VBOとIBOを作る
		// 今の生データだと、頂点情報、素材情報がばらばらに保存されているので
		// 1つの頂点情報（位置、色等）を1つのセットで保存する必要がある
		// 面に素材が結びついているので、面が1つの頂点を共有していると
		// それらの面の素材情報によって、別の頂点として扱う必要がある
		// なので基本的には頂点情報を毎回作り直す必要があるが、
		// 1度作ったものと等しいものが必要であれば、キャッシュを使用する
		for(var i = 0; i < triangleindex_list.length; i++) {
			var triangleindex = triangleindex_list[i];
			var indlist = [];
			// ポリゴンの各頂点を調べる
			for(var j = 0; j < 3; j++) {
				// その頂点（面の情報（UVなど）も含めたデータ）のハッシュ値を求める
				var hash = triangleindex.getGLHash(j, vertex_list);
				// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
				var hit = hashlist[hash];
				indlist[j] = (hit !== undefined) ? hit : vertex_length;
				// 頂点がもしヒットしていなかったら
				if(hit === undefined) {
					// 頂点データを作成して
					var vertexdata = triangleindex.getGLData(j, vertex_list);
					hashlist[hash]  = vertex_length;
					// 頂点にはどういった情報があるか分からないので、in を使用する。
					// key には、position / normal / color / uv などがおそらく入っている
					for(var key in vertexdata) {
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
		
		var pt = 0;
		var ibo = {};
		{
			// IBOの結合（インデックス）
			ibo.array_length	= triangleindex_list.length * 3;
			ibo.array			= new Int16Array(ibo.array_length);
			pt = 0;
			for(var i$1 = 0; i$1 < triangleindex_list.length; i$1++) {
				for(var j$1 = 0; j$1 < 3; j$1++) {
					ibo.array[pt++] = triangle[i$1][j$1];
				}
			}
		}
		var vbo = {};
		{
			// VBOの結合（頂点）
			// 位置、法線、色などを、それぞれ1つの配列として記録する
			for(var key$1 in vertextypelist) {
				var srcdata		= vertextypelist[key$1];
				var dimension	= srcdata[0].dimension;
				var dstdata	= {};
				// 情報の名前(position / uv / normal など)
				dstdata.name			= key$1;
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
				for(var i$2 = 0; i$2 < vertex_length; i$2++) {
					for(var j$2 = 0; j$2 < dimension; j$2++) {
						dstdata.array[pt++] = srcdata[i$2].data[j$2];
					}
				}
				// VBOオブジェクトに格納
				vbo[key$1] = dstdata;
			}
		}
		
		var arraydata = {};
		arraydata.ibo		= ibo;
		arraydata.vbo		= vbo;
		return arraydata;
	};

	S3GLMesh.prototype.disposeGLData = function disposeGLData () {
		// コンパイルしていなかったら抜ける
		if(!this.isCompileGL()) {
			return;
		}
		var gldata = this.getGLData();
		if(gldata !== null) {
			if(gldata.ibo !== undefined) {
				if(gldata.ibo.data !== undefined) {
					this.sys.glfunc.deleteBuffer(gldata.ibo.data);
				}
				delete gldata.ibo;
			}
			if(gldata.vbo !== undefined) {
				for(var key in gldata.vbo) {
					if(gldata.vbo[key].data !== undefined) {
						this.sys.glfunc.deleteBuffer(gldata.vbo[key].data);
					}
				}
				delete gldata.vbo;
			}
			{
				var material_list = this.getMaterialArray();
				for(var i = 0; i < material_list.length; i++) {
					var mat = material_list[i];
					for(var key$1 in mat) {
						var obj = mat[key$1];
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
	};

	/**
	 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
	 * @returns {S3GLMesh.gldata}
	 */
	S3GLMesh.prototype.getGLData = function getGLData () {
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
		var gldata = this._getGLArrayData(); // GL用の配列データを作成
		
		// IBO / VBO 用のオブジェクトを作成
		gldata.ibo.data = this.sys.glfunc.createBufferIBO(gldata.ibo.array);
		for(var key in gldata.vbo) {
			gldata.vbo[key].data = this.sys.glfunc.createBufferVBO(gldata.vbo[key].array);
		}
		// 代入
		this.gldata = gldata;
		this.setCompileGL(true);
		return this.gldata;
	};

	return S3GLMesh;
}(S3Mesh));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLModel = /*@__PURE__*/(function (S3Model$$1) {
	function S3GLModel() {
		S3Model$$1.call(this);
	}

	if ( S3Model$$1 ) S3GLModel.__proto__ = S3Model$$1;
	S3GLModel.prototype = Object.create( S3Model$$1 && S3Model$$1.prototype );
	S3GLModel.prototype.constructor = S3GLModel;
	
	/**
	 * Uniform を作成して返す
	 */
	S3GLModel.prototype.getUniforms = function getUniforms () {
		var uniforms				= {};
		{
			var MATELIAL_MAX			= 4;
			var material_array			= this.getMesh().getMaterialArray();
			var materialLength			= Math.min(material_array.length, MATELIAL_MAX);
			for(var i = 0; i < materialLength; i++) {
				var data = material_array[i].getGLData();
				for(var key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		var ret = [];
		ret.uniforms = uniforms;
		return ret;
	};

	return S3GLModel;
}(S3Model));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLScene = /*@__PURE__*/(function (S3Scene$$1) {
	function S3GLScene() {
		S3Scene$$1.call(this);
	}

	if ( S3Scene$$1 ) S3GLScene.__proto__ = S3Scene$$1;
	S3GLScene.prototype = Object.create( S3Scene$$1 && S3Scene$$1.prototype );
	S3GLScene.prototype.constructor = S3GLScene;
	
	S3GLScene.prototype.getUniforms = function getUniforms () {
		var uniforms			= {};
		// カメラ情報もUniformで送る
		{
			uniforms.eyeWorldDirection = this.getCamera().getDirection();
		}
		// ライト情報はUniformで送る
		{
			var LIGHTS_MAX			= 4;
			var light_array			= this.getLights();
			var lightsLength		= Math.min(light_array.length, LIGHTS_MAX);
			uniforms.lightsLength	= new S3GLArray(lightsLength, 1, S3GLArray.datatype.Int32Array);
			for(var i = 0; i < lightsLength; i++) {
				var data = light_array[i].getGLData();
				for(var key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		var ret = [];
		ret.uniforms = uniforms;
		return ret;
	};

	return S3GLScene;
}(S3Scene));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLTriangleIndexData = function S3GLTriangleIndexData(triangle_index) {
	this.index			= triangle_index.index;			// 各頂点を示すインデックスリスト
	this.materialIndex	= triangle_index.materialIndex;	// 面の材質
	this.uv				= triangle_index.uv;			// 各頂点のUV座標
	this._isEnabledTexture= triangle_index.uv[0] !== null;// UV情報があるか
		
	this.face			= {};
	this.vertex			= {};
	// S3Vector.getTangentVectorの取得値を格納用
	this.face.normal	= null;						// 面の法線情報
	this.face.tangent	= null;						// 面の接線情報
	this.face.binormal	= null;						// 面の従法線情報
	this.vertex.normal	= [null, null, null];		// 頂点ごとの法線
	this.vertex.tangent	= [null, null, null];		// 頂点ごとの接線 
	this.vertex.binormal= [null, null, null];		// 頂点ごとの従法線 
};

S3GLTriangleIndexData.prototype.getGLHash = function getGLHash (number, vertexList) {
	var uvdata = this._isEnabledTexture ? this.uv[number].toString(2) + this.face.binormal.toString(2) + this.face.tangent.toString(2): "";
	var vertex   = vertexList[this.index[number]].getGLHash();
	return vertex + this.materialIndex + uvdata + this.vertex.normal[number].toString(3);
};

/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @param {Integer} number 三角形の何番目の頂点データを取得するか
	 * @param {S3Vertex[]} vertexList 頂点の配列
	 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
	 */
S3GLTriangleIndexData.prototype.getGLData = function getGLData (number, vertexList) {
	var vertex	= {};
	var vertexdata_list = vertexList[this.index[number]].getGLData();
	for(var key in vertexdata_list) {
		vertex[key]= vertexdata_list[key];
	}
	var uvdata = this._isEnabledTexture ? this.uv[number] : new S3Vector(0.0, 0.0);
	vertex.vertexTextureCoord= new S3GLArray(uvdata, 2, S3GLArray.datatype.Float32Array);
	vertex.vertexMaterialFloat= new S3GLArray(this.materialIndex, 1, S3GLArray.datatype.Float32Array);
	vertex.vertexNormal		= new S3GLArray(this.vertex.normal[number], 3, S3GLArray.datatype.Float32Array);
	vertex.vertexBinormal	= new S3GLArray(this.vertex.binormal[number], 3, S3GLArray.datatype.Float32Array);
	vertex.vertexTangent	= new S3GLArray(this.vertex.tangent[number], 3, S3GLArray.datatype.Float32Array);
	return vertex;
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

var S3GLTriangleIndex = /*@__PURE__*/(function (S3TriangleIndex$$1) {
	function S3GLTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		S3TriangleIndex$$1.call(this, i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	if ( S3TriangleIndex$$1 ) S3GLTriangleIndex.__proto__ = S3TriangleIndex$$1;
	S3GLTriangleIndex.prototype = Object.create( S3TriangleIndex$$1 && S3TriangleIndex$$1.prototype );
	S3GLTriangleIndex.prototype.constructor = S3GLTriangleIndex;

	S3GLTriangleIndex.prototype.clone = function clone () {
		return S3TriangleIndex$$1.prototype.clone.call(this, S3GLTriangleIndex);
	};
	
	S3GLTriangleIndex.prototype.inverseTriangle = function inverseTriangle () {
		return S3TriangleIndex$$1.prototype.inverseTriangle.call(this, S3GLTriangleIndex);
	};

	S3GLTriangleIndex.prototype.createGLTriangleIndexData = function createGLTriangleIndexData () {
		return new S3GLTriangleIndexData(this);
	};

	return S3GLTriangleIndex;
}(S3TriangleIndex));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLVertex = /*@__PURE__*/(function (S3Vertex$$1) {
	function S3GLVertex(position) {
		S3Vertex$$1.call(this, position);
	}

	if ( S3Vertex$$1 ) S3GLVertex.__proto__ = S3Vertex$$1;
	S3GLVertex.prototype = Object.create( S3Vertex$$1 && S3Vertex$$1.prototype );
	S3GLVertex.prototype.constructor = S3GLVertex;
	
	S3GLVertex.prototype.clone = function clone () {
		return S3Vertex$$1.prototype.clone.call(this, S3GLVertex);
	};

	S3GLVertex.prototype.getGLHash = function getGLHash () {
		return this.position.toString(3);
	};
	
	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @returns {頂点データ（座標、法線情報）}
	 */
	S3GLVertex.prototype.getGLData = function getGLData () {
		return {
			vertexPosition	: new S3GLArray(this.position, 3, S3GLArray.datatype.Float32Array)
		};
	};

	return S3GLVertex;
}(S3Vertex));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var S3GLSystem = /*@__PURE__*/(function (S3System$$1) {
	function S3GLSystem() {
		S3System$$1.call(this);
		this.program		= null;
		this.gl				= null;
		this.is_set			= false;
		this.program_list	= [];
		this.program_listId	= 0;
		var that = this;
		
		var glfunc_texture_cash = {};
		
		this.glfunc = {
			
			createBufferVBO : function(data) {
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				var vbo = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				return vbo;
			},

			createBufferIBO : function(data) {
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				var ibo = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				return ibo;
			},
			
			deleteBuffer : function(data) {
				var gl = that.getGL();
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
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				var texture = null;
				if(!glfunc_texture_cash[id]) {
					texture = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					var cash = {};
					cash.texture	= texture;
					cash.count		= 0;
					glfunc_texture_cash[id] = cash;
				}
				texture = glfunc_texture_cash[id].texture;
				glfunc_texture_cash[id].count++;
				return texture;
			},
			
			deleteTexture : function(id) {
				var gl = that.getGL();
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
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				var program		= gl.createProgram();
				var is_error	= false;
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
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.detachShader(program, shader_vertex   );
				gl.detachShader(program, shader_fragment );
				gl.deleteProgram(program);
			},
			
			createShader : function(sharder_type, code) {
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				var shader		= gl.createShader(sharder_type);
				var is_error	= false;
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
				var gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.deleteShader(shader);
			}
			
		};
	}

	if ( S3System$$1 ) S3GLSystem.__proto__ = S3System$$1;
	S3GLSystem.prototype = Object.create( S3System$$1 && S3System$$1.prototype );
	S3GLSystem.prototype.constructor = S3GLSystem;
	
	S3GLSystem.prototype.getGL = function getGL () {
		return this.gl;
	};

	S3GLSystem.prototype.isSetGL = function isSetGL () {
		return this.gl !== null;
	};
	
	S3GLSystem.prototype.setCanvas = function setCanvas (canvas) {
		// 初期化色
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.canvas = canvas;
		this.gl = gl;
	};

	S3GLSystem.prototype.createProgram = function createProgram () {
		var program = new S3GLProgram(this, this.program_listId);
		this.program_list[this.program_listId] = program;
		this.program_listId++;
		return program;
	};

	S3GLSystem.prototype.disposeProgram = function disposeProgram () {
		for(var key in this.program_list) {
			this.program_list[key].dispose();
			delete this.program_list[key];
		}
	};

	S3GLSystem.prototype.setProgram = function setProgram (glprogram) {
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
		var new_program = glprogram.getProgram();
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
	};

	S3GLSystem.prototype.clear = function clear () {
		if(this.gl === null) {
			return false;
		}
		var color = this.getBackgroundColor();
		this.gl.clearColor(color.x, color.y, color.z, color.w);
		this.gl.clearDepth(1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		return true;
	};

	S3GLSystem.prototype.drawElements = function drawElements (indexsize) {
		if(!this.is_set) {
			return;
		}
		this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
		this.gl.flush();
	};

	S3GLSystem.prototype.deleteBuffer = function deleteBuffer (data) {
		if(this.gl === null) {
			return null;
		}
		this.gl.deleteBuffer(data);
	};

	S3GLSystem.prototype._getDummyTexture = function _getDummyTexture () {
		if(this._textureDummyData === undefined) {
			var canvas = document.createElement("canvas");
			canvas.width  = 1;
			canvas.height = 1;
			var context = canvas.getContext("2d");
			var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
			this._textureDummyId = this._createID();
			this._textureDummyData = this.glfunc.createTexture(this._textureDummyId, imagedata);
		}
		return this._textureDummyData;
	};

	S3GLSystem.prototype._setDepthMode = function _setDepthMode () {
		if(this.gl === null) {
			return null;
		}
		var gl = this.gl;
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	};

	S3GLSystem.prototype._setCullMode = function _setCullMode () {
		if(this.gl === null) {
			return null;
		}
		var gl = this.gl;
		if(this.cullmode === S3System$$1.CULL_MODE.NONE) {
			gl.disable(gl.CULL_FACE);
			return;
		}
		else {
			gl.enable(gl.CULL_FACE);
		}
		if(this.frontface === S3System$$1.FRONT_FACE.CLOCKWISE) {
			gl.frontFace(gl.CW);
		}
		else {
			gl.frontFace(gl.CCW);
		}
		if(this.cullmode === S3System$$1.CULL_MODE.FRONT_AND_BACK) {
			gl.cullFace(gl.FRONT_AND_BACK);
		}
		else if(this.cullmode === S3System$$1.CULL_MODE.BACK) {
			gl.cullFace(gl.BACK);
		}
		else if(this.cullmode === S3System$$1.CULL_MODE.FRONT) {
			gl.cullFace(gl.FRONT);
		}
	};

	S3GLSystem.prototype._bindStart = function _bindStart () {
		this.program.resetActiveTextureId();
	};

	S3GLSystem.prototype._bindEnd = function _bindEnd () {
		
	};

	S3GLSystem.prototype._bind = function _bind (p1, p2) {
		if(!this.is_set) {
			return;
		}
		var prg = this.program;
		var index_lenght = 0;
		// p1が文字列、p2がデータの場合、データとして結びつける
		if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
			prg.bindData(p1, p2);
		}
		// 引数がモデルであれば、モデルとして紐づける
		else if((arguments.length === 1) && (p1 instanceof S3GLModel)) {
			var mesh = p1.getMesh();
			if(mesh instanceof S3GLMesh) {
				index_lenght = prg.bindMesh(mesh);
			}
		}
		// uniformsデータであれば、内部のデータを全て割り当てる
		else if((arguments.length === 1) && (p1.uniforms)) {
			var uniforms = p1.uniforms;
			for(var key in uniforms) {
				prg.bindData(key, uniforms[key]);
			}
		}
		return index_lenght;
	};

	S3GLSystem.prototype.drawScene = function drawScene (scene) {
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
		var VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		// モデル描写
		var models = scene.getModels();
		for(var i = 0; i < models.length; i++) {
			var model	= models[i];
			var mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			
			// モデルに関するUniform設定（材質の設定など）
			this._bind(model.getUniforms());
			
			// モデル用のBIND
			var M = this.getMatrixWorldTransform(model);
			var MV = this.mulMatrix(M, VPS.LookAt);
			var MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
			this._bind("matrixWorldToLocal4", M.inverse4());
			this._bind("matrixLocalToWorld4", M);
			this._bind("matrixLocalToWorld3", M);
			this._bind("matrixLocalToPerspective4", MVP);
			
			var indexsize = this._bind(model);
			if(indexsize) {
				this.drawElements(indexsize);
			}
		}
		
		// 描写終了
		this._bindEnd();
	};

	S3GLSystem.prototype._disposeObject = function _disposeObject (obj) {
		if(obj instanceof S3GLTexture) {
			this.glfunc.deleteTexture(this.url);
		}
	};
	
	S3GLSystem.prototype.createVertex = function createVertex (position) {
		return new S3GLVertex(position);
	};
	
	S3GLSystem.prototype.createTriangleIndex = function createTriangleIndex (i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3GLTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	};
	
	S3GLSystem.prototype.createTexture = function createTexture (name) {
		return new S3GLTexture(this, name);
	};
	
	S3GLSystem.prototype.createScene = function createScene () {
		return new S3GLScene();
	};
	
	S3GLSystem.prototype.createModel = function createModel () {
		return new S3GLModel();
	};
	
	S3GLSystem.prototype.createMesh = function createMesh () {
		return new S3GLMesh(this);
	};
	
	S3GLSystem.prototype.createMaterial = function createMaterial (name) {
		return new S3GLMaterial(this, name);
	};
	
	S3GLSystem.prototype.createLight = function createLight () {
		return new S3GLLight();
	};
	
	S3GLSystem.prototype.createCamera = function createCamera () {
		var camera = new S3Camera(this);
		return camera;
	};

	return S3GLSystem;
}(S3System));

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

var DefaultMaterial = {
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

var S3MeshLoaderJSON = {

	name : "JSON",

	input : function(sys, mesh, json) {
		var meshdata;
		if((typeof json === "string")||(json instanceof String)) {
			meshdata = eval(json);
		}
		else {
			meshdata = json;
		}
		var material = 0;
		// 材質名とインデックスを取得
		for(var materialname in meshdata.Indexes) {
			mesh.addMaterial(sys.createMaterial(materialname));
			var materialindexlist = meshdata.Indexes[materialname];
			for(var i = 0; i < materialindexlist.length; i++) {
				var list = materialindexlist[i];
				for(var j = 0; j < list.length - 2; j++) {
					// 3角形と4角形に対応
					var ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, list, material)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, list, material);
					mesh.addTriangleIndex(ti);
				}
			}
			material++;
		}
		// 頂点座標を取得
		for(var i$1 = 0; i$1 < meshdata.Vertices.length; i$1++) {
			var vector = new S3Vector(meshdata.Vertices[i$1][0], meshdata.Vertices[i$1][1], meshdata.Vertices[i$1][2]);
			var vertex = sys.createVertex(vector);
			mesh.addVertex(vertex);
		}
		return true;
	},

	output : function(mesh) {
		var vertex			= mesh.getVertexArray(); 
		var triangleindex	= mesh.getTriangleIndexArray(); 
		var material		= mesh.getMaterialArray();
		var material_vertexlist = [];
		var material_length = material.length !== 0 ? material.length : 1;
		var default_material = DefaultMaterial;
		// 材質リストを取得
		for(var i = 0; i < material_length; i++) {
			material_vertexlist[i] = {
				material: material[i] ? material[i] : default_material ,
				list:[]
			};
		}
		// 材質名に合わせて、インデックスリストを取得
		for(var i$1 = 0; i$1 < triangleindex.length; i$1++) {
			var ti = triangleindex[i$1];
			material_vertexlist[ti.materialIndex].list.push( ti.index );
		}
		var output = [];
		output.push("{");
		output.push("\tIndexes:{");
		for(var i$2 = 0; i$2 < material_vertexlist.length; i$2++) {
			var mv = material_vertexlist[i$2];
			output.push("\t\t" + mv.material.name + ":[");
			for(var j = 0; j < mv.list.length; j++) {
				var vi = mv.list[j];
				output.push("\t\t\t[" + vi[0] + " " + vi[1] + " " + vi[2] + "]" + ((j === mv.list.length - 1) ? "" : ",") );
			}
			output.push("\t\t]" + ((i$2 === material_vertexlist.length - 1) ? "" : ",") );
		}
		output.push("\t},");
		output.push("\tVertices:[");
		for(var i$3 = 0; i$3 < vertex.length; i$3++) {
			var vp = vertex[i$3].position;
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

var File$2 = function File(pathname) {
	this.pathname = pathname.replace(/\\/g, "/" );
};

File$2.prototype.getAbsolutePath = function getAbsolutePath () {
	if(/$http/.test(this.pathname)) {
		return this.pathname;
	}
	var name = window.location.toString();
	if(!(/\/$/.test(name))) {
		name = name.match(/.*\//)[0];
	}
	var namelist = this.pathname.split("/");
	for(var i = 0; i < namelist.length; i++) {
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
};

File$2.prototype.getParent = function getParent () {
	var x = this.getAbsolutePath().match(/.*\//)[0];
	return(x.substring(0 ,x.length - 1));
};

var S3MeshLoaderMQO = {

	name : "MQO",

	/**
	 * メタセコイア形式で入力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		var mqofile = null;
		var parent_dir = "./";
		if(url) {
			mqofile = new File$2(url);
			parent_dir = mqofile.getParent() + "/";
		}
		
		var lines = text.split("\n");
		var block_stack = [];
		var block_type  = "none";
		// 半角スペース区切りにの文字列数値を、数値型配列にする
		var toNumberArray = function(text) {
			var x = text.split(" "), out = [];
			for(var i = 0; i < x.length; i++) {
				out[i] = parseFloat(x[i]);
			}
			return out;
		};
		// func(XXX) のXXXの中身を抜き出す
		var getValueFromPrm = function(text, parameter) {
			var x = text.split(" " + parameter + "(");
			if(x.length === 1) {
				return [];
			}
			return x[1].split(")")[0];
		};
		// func(XXX) のXXXの中を抜き出して数値化
		var getNumberFromPrm = function(text, parameter) {
			var value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return [];
			}
			return toNumberArray(value);
		};
		// func(XXX) のXXXの中を抜き出して文字列取得
		var getURLFromPrm = function(text, parameter) {
			var value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return null;
			}
			var x = value.split("\"");
			if(x.length !== 3) {
				return null;
			}
			return x[1];
		};
		for(var i = 0;i < lines.length; i++) {
			var trim_line = lines[i].replace(/^\s+|\s+$/g, "");
			var first = trim_line.split(" ")[0];
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
				var material_name = first.replace(/"/g, "");
				var material = sys.createMaterial();
				material.setName(material_name);
				var val = (void 0);
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
				var words = toNumberArray(trim_line);
				var vector = new S3Vector(words[0], words[1], words[2]);
				var vertex = sys.createVertex(vector);
				mesh.addVertex(vertex);
			}
			else if(block_type === "face") {
				var facenum = parseInt(first);
				var v		= getNumberFromPrm(trim_line, "V");
				var uv_a	= getNumberFromPrm(trim_line, "UV");
				var uv		= [];
				var material$1= getNumberFromPrm(trim_line, "M");
				material$1 = (material$1.length === 0) ? 0 : material$1[0];
				if(uv_a.length !== 0) {
					for(var j = 0; j < facenum; j++) {
						uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
					}
				}
				for(var j$1 = 0;j$1 < facenum - 2; j$1++) {
					var ti = ((j$1 % 2) === 0) ? 
						sys.createTriangleIndex(j$1    , j$1 + 1, j$1 + 2, v, material$1, uv)
						:sys.createTriangleIndex(j$1 - 1, j$1 + 1, j$1 + 2, v, material$1, uv);
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
		var output = [];
		var vertex			= mesh.getVertexArray(); 
		var triangleindex	= mesh.getTriangleIndexArray(); 
		var material		= mesh.getMaterialArray();
		
		// 材質の出力
		output.push("Material " + material.length + " {");
		for(var i = 0; i < material.length; i++) {
			var mv = material[i];
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
			for(var i$1 = 0; i$1 < vertex.length; i$1++) {
				var vp = vertex[i$1].position;
				output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
			}
			output.push("}");

			// 面の定義
			output.push("\tface " + triangleindex.length + " {");
			for(var i$2 = 0; i$2 < triangleindex.length; i$2++) {
				var ti = triangleindex[i$2];
				var line = "\t\t3";
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

var S3MeshLoaderOBJ = {

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
		
		var trim = function(str) {
			return(str.replace(/^\s+|\s+$/g, ""));
		};
		
		// 文字列解析
		var lines = text.split("\n");
		var v_list = [];
		var face_v_list = [];
		for(var i = 0; i < lines.length; i++) {
			// コメントより前の文字を取得
			var line = trim(lines[i].split("#")[0]);
			
			if(line.length === 0) {
				// 空白なら何もしない
				continue;
			}
			
			var data = line.split(" ");
			if(data[0] === "v") {
				// vertex
				var v = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				v_list.push(v);
			}
			else if(data[1] === "vt") {
				// texture
				var vt = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				
			}
			else if(data[2] === "vn") {
				// normal
				var vn = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
			}
			else if(data[0] === "f") {
				// face
				var vcount = data.length - 3; // 繰り返す回数
				for(var j = 0;j < vcount; j++) {
					var fdata = [];
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
					var face_v = [];
					var face_vt = [];
					var face_vn = [];
					// 数字は1から始まるので、1を引く
					for(var k = 0;k < 3; k++) {
						var indexdata = fdata[k].split("/");
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
		var material = sys.createMaterial();
		mesh.addMaterial(material);
		// 頂点の保存
		for(var i$1 = 0; i$1 < v_list.length; i$1++) {
			var vertex = sys.createVertex(v_list[i$1]);
			mesh.addVertex(vertex);
		}
		// インデックスの保存
		for(var i$2 = 0; i$2 < face_v_list.length; i$2++) {
			var triangle = sys.createTriangleIndex(0, 1, 2, face_v_list[i$2], 0);
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

var S3MeshLoader = {

	// 他のファイルの読み書きの拡張用
	inputData: function(s3system, data, type) {
		var s3mesh = s3system.createMesh();
		var load = function(ldata, ltype, url) {
			s3mesh._init();
			var isLoad = S3MeshLoader._DATA_INPUT_FUNCTION[ltype](s3system, s3mesh, ldata, url);
			s3mesh.setComplete(isLoad);
		};
		if(((typeof data === "string")||(data instanceof String))&&((data.indexOf("\n") === -1))) {
			// 1行の場合はURLとみなす（雑）
			var downloadCallback = function(text) {
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

var CameraController = function CameraController() {
	this.mouse	= new Device.Touch();
	this.moveDistance= 4.0;
	this.moveRotate	= 0.5;
	this.moveTranslateRelative= 0.1;
};

CameraController.prototype.setCanvas = function setCanvas (element) {
	this.mouse.setListenerOnElement(element);
};

CameraController.prototype.setCamera = function setCamera (camera) {
	this.camera = camera.clone();
};

CameraController.prototype.getCamera = function getCamera () {
	var data = new Device.Touch();
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
		var distance = this.camera.getDistance();
		var l = data.wheelrotation;
		distance -= l * this.moveDistance * Math.log(distance);
		this.camera.setDistance(distance);
	}
	return this.camera;
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

var S3 = {
	
	System : S3System,
	GLSystem : S3GLSystem,
	Math : S3Math,
	Angles : S3Angles,
	Vector : S3Vector,
	Matrix : S3Matrix,

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

var Senko = {

	_toString: function(text_obj) {
		var text;
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
		var out = console;
		var text = Senko._printbuffer + Senko._toString(text_obj);
		Senko._printbuffer = "";
		out.log(text);
	},
	
	print: function(text_obj) {
		Senko._printbuffer += Senko._toString(text_obj);
	},
	
	printf: function() {
		var arguments$1 = arguments;

		var x = [];
		for(var i = 0 ; i < arguments.length ; i++) {
			x[i] = arguments$1[i];
		}
		Senko.println(Text$1.format.apply(this, x));
	}
};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File$1;
Senko.HashMap = HashMap;
Senko.Text = Text$1;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;
Senko.BigDecimal = BigDecimal;
Senko.BigInteger = BigInteger;
Senko.Random = Random;
Senko.S3 = S3;

export default Senko;
