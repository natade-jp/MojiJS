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
import ImgWrapClamp from "./ImgWrapClamp.mjs";
import ImgWrapRepeat from "./ImgWrapRepeat.mjs";

export default class ImgWrap {
	
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
