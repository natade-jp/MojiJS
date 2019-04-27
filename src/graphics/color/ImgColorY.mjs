/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgColor from "./ImgColor.mjs";

export default class ImgColorY extends ImgColor {
		
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
