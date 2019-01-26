/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgColorY from "../color/ImgColorY.js";
import ImgData from "./ImgData.js";
import ImgDataRGBA from "./ImgDataRGBA.js";
import ImgVector from "../color/ImgVector.js";

export default class ImgDataY extends ImgData {
	
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
