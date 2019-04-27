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

export default class ImgWrapClamp extends ImgWrapInside {
		
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
