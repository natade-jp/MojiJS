/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import SBase from "./SBase.js";

export default class SCanvas extends SBase {
	
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
		let isresize = true;
		if(SCanvas.drawtype.ORIGINAL === drawsize) {
			width  = image.width;
			height = image.height;
		}
		else if(SCanvas.drawtype.STRETCH === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
			isresize = false;
		}
		else if(SCanvas.drawtype.FILL_ASPECT_RATIO === drawsize) {
			width  = pixelsize.width;
			height = pixelsize.height;
			isresize = false;
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
