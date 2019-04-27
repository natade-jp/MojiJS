/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgWrapInside from "./ImgWrapInside.mjs";

export default class ImgWrapRepeat extends ImgWrapInside {
		
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

