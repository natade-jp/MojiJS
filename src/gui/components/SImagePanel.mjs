/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import SBase from "./SBase.mjs";
import SCanvas from "./SCanvas.mjs";

export default class SImagePanel extends SBase {
	
	constructor() {
		super("div");
		this.addClass(SBase.CLASS_NAME.IMAGEPANEL);
		const image = document.createElement("img");
		image.id = this.id + "_img";
		this.image = image;
		this.getElement().appendChild(this.image);
	}
	
	clear() {
		// 未作成
		this.node_tool.removeChildNodes(this.getElement());
	}
	
	toDataURL() {
		return this.image.src;
	}
	
	putImageData(imagedata) {
		this.putImage(imagedata);
	}
	
	putImage(data, drawcallback) {
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
			const canvas = document.createElement("canvas");
			canvas.width = data.width;
			canvas.height = data.height;
			const context = canvas.getContext("2d");
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
			const _this = this;
			const reader = new FileReader();
			// Blob, File -> URL(string)
			reader.onload = function() {
				_this.putImage(reader.result, drawcallback);
			};
			reader.readAsDataURL(data);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

}
