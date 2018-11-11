/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import ImgColor from "./ImgColor.js";
import ImgVector from "./ImgVector.js";

export default class ImgColorRGBA extends ImgColor {
	
	constructor(color) {
		super();
		// ディープコピー
		this.rgba = [color[0], color[1], color[2], color[3]];
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
			this.rgba[0] + x,	this.rgba[1] + x,
			this.rgba[2] + x,	this.rgba[3] + x ]);
	}
	
	sub(x) {
		return new ImgColorRGBA([
			this.rgba[0] - x,	this.rgba[1] - x,
			this.rgba[2] - x,	this.rgba[3] - x ]);
	}
	
	mul(x) {
		return new ImgColorRGBA([
			this.rgba[0] * x,	this.rgba[1] * x,
			this.rgba[2] * x,	this.rgba[3] * x ]);
	}
	
	div(x) {
		return new ImgColorRGBA([
			this.rgba[0] / x,	this.rgba[1] / x,
			this.rgba[2] / x,	this.rgba[3] / x ]);
	}
	
	exp() {
		return new ImgColorRGBA([
			Math.exp(this.rgba[0]),	Math.exp(this.rgba[1]),
			Math.exp(this.rgba[2]),	Math.exp(this.rgba[3]) ]);
	}
	
	log() {
		return new ImgColorRGBA([
			Math.log(this.rgba[0]),	Math.log(this.rgba[1]),
			Math.log(this.rgba[2]),	Math.log(this.rgba[3]) ]);
	}
	
	pow(base) {
		return new ImgColorRGBA([
			Math.pow(base, this.rgba[0]),	Math.pow(base, this.rgba[1]),
			Math.pow(base, this.rgba[2]),	Math.pow(base, this.rgba[3]) ]);
	}
	
	baselog(base) {
		const x = 1.0 / Math.log(base);
		return new ImgColorRGBA([
			Math.log(this.rgba[0]) * x,	Math.log(this.rgba[1]) * x,
			Math.log(this.rgba[2]) * x,	Math.log(this.rgba[3]) * x ]);
	}
	
	table(table) {
		return new ImgColorRGBA([
			table[Math.round(this.rgba[0])], table[Math.round(this.rgba[1])],
			table[Math.round(this.rgba[2])], table[Math.round(this.rgba[3])] ]);
	}
	
	random() {
		return new ImgColorRGBA([
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256), Math.floor(Math.random() * 256) ]);
	}
	
	luminance() {
		return 0.2126 * this.rgba[0] + 0.7152 * this.rgba[1] + 0.0722 * this.rgba[2];
	}
	
	addColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] + c.rgba[0],	this.rgba[1] + c.rgba[1],
			this.rgba[2] + c.rgba[2],	this.rgba[3] + c.rgba[3] ]);
	}
	
	subColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] - c.rgba[0],	this.rgba[1] - c.rgba[1],
			this.rgba[2] - c.rgba[2],	this.rgba[3] - c.rgba[3] ]);
	}
	
	mulColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] * c.rgba[0],	this.rgba[1] * c.rgba[1],
			this.rgba[2] * c.rgba[2],	this.rgba[3] * c.rgba[3] ]);
	}
	
	divColor(c) {
		return new ImgColorRGBA([
			this.rgba[0] / c.rgba[0],	this.rgba[1] / c.rgba[1],
			this.rgba[2] / c.rgba[2],	this.rgba[3] / c.rgba[3] ]);
	}
	
	maxColor(c) {
		return new ImgColorRGBA([
			Math.max(c.rgba[0], this.rgba[0]),Math.max(c.rgba[1], this.rgba[1]),
			Math.max(c.rgba[2], this.rgba[2]),Math.max(c.rgba[3], this.rgba[3])]);
	}
	
	minColor(c) {
		return new ImgColorRGBA([
			Math.min(c.rgba[0], this.rgba[0]),Math.min(c.rgba[1], this.rgba[1]),
			Math.min(c.rgba[2], this.rgba[2]),Math.min(c.rgba[3], this.rgba[3])]);
	}
	
	norm(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return (Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2])) / 3;
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return Math.sqrt(this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2]) / 3;
		}
	}
	
	normFast(normType) {
		if(normType === ImgColor.NORM_MODE.MANHATTEN) {
			return Math.abs(this.rgba[0]) + Math.abs(this.rgba[1]) + Math.abs(this.rgba[2]);
		}
		else if(normType === ImgColor.NORM_MODE.EUGRID) {
			return this.rgba[0] * this.rgba[0] + this.rgba[1] * this.rgba[1] + this.rgba[2] * this.rgba[2];
		}
	}
	
	getBlendAlpha() {
		return this.rgba[3] / 255.0;
	}
	
	setBlendAlpha(x) {
		const color = this.clone();
		color.rgba[3] = x * 255.0;
		return color;
	}
	
	exchangeColorAlpha(color) {
		return new ImgColorRGBA( [ this.rgba[0], this.rgba[1], this.rgba[2], color.rgba[3] ]);
	}
	
	getRRGGBB() {
		return (this.rgba[0] << 16) | (this.rgba[1] << 8) | (this.rgba[2] & 0xff);
	}
	
	getRed() {
		return (this.rgba[0]);
	}
	
	getGreen() {
		return (this.rgba[1]);
	}
	
	getBlue() {
		return (this.rgba[2]);
	}
	
	equals(c) {
		return	(this.rgba[0] === c.rgba[0]) &&
				(this.rgba[1] === c.rgba[1]) &&
				(this.rgba[2] === c.rgba[2]) &&
				(this.rgba[3] === c.rgba[3]) ;
	}
	
	toString() {
		return "color(" + this.rgba[0] + "," + this.rgba[1] + "," + this.rgba[2] + "," + this.rgba[3] + ")";
	}
	
	mulMatrix(m) {
		const color = new ImgColorRGBA();
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
	}
	
	/**
	 * RGBの画素から方向ベクトルへの変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgVector}
	 */
	getNormalVector() {
		return new ImgVector(
			(this.rgba[0] / 128.0) - 1.0,
			- (this.rgba[1] / 128.0) + 1.0,
			(this.rgba[2] / 128.0) - 1.0
		);
	}
	
}
