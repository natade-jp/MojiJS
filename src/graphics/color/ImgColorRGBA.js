/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgColor from "./ImgColor.js";

export default class ImgColorRGBA extends ImgColor {
	
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
	
}
