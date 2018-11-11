/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class ImgWrapInside {
	
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
