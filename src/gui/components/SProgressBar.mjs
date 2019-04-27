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

export default class SProgressBar extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.PROGRESSBAR);
		
		this.min	= 0.0;
		this.max	= 0.0;
		this.value	= min;
		this.is_indeterminate = false;
		if(arguments.length === 0) {
			this.min = 0.0;
			this.max = 1.0;
		}
		else if(arguments.length === 2) {
			this.min = min;
			this.max = max;
		}
		else {
			throw "IllegalArgumentException";
		}
		this.progress = document.createElement("progress");
		this.getElement().appendChild(this.progress);
		this.progress.id = this.getId() + "_progress";
		this.progress.className = SBase.CLASS_NAME.PROGRESSBAR;
		// 内部の目盛りは0-1を使用する
		this.progress.value	= 0.0;
		this.progress.max	= 1.0;
	}
	
	setMaximum(max) {
		this.max = max;
	}
	
	setMinimum(min) {
		this.min = min;
	}
	
	getMaximum() {
		return this.max;
	}
	
	getMinimum() {
		return this.min;
	}
	
	setValue(value) {
		this.value = value;
		this.progress.value = this.getPercentComplete();
	}
	
	getValue() {
		return this.value;
	}
	
	setIndeterminate(newValue) {
		this.is_indeterminate = newValue;
		if(this.is_indeterminate) {
			this.progress.removeAttribute("value");
		}
		else {
			this.setValue(this.value);
		}
	}
	
	isIndeterminate() {
		return this.is_indeterminate;
	}
	
	getPercentComplete() {
		const delta = this.max - this.min;
		return (this.value - this.min) / delta;
	}
	
}
