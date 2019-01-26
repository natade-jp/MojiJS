/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import SBase from "./SBase.js";

export default class SSlider extends SBase {
	
	constructor(min, max) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.SLIDER);
		
		if(arguments.length === 0) {
			min = 0.0;
			max = 1.0;
		}
		else if(arguments.length !== 2) {
			throw "IllegalArgumentException";
		}
		this.slider = document.createElement("input");
		this.slider.id = this.getId() + "_slider";
		this.slider.type	= "range";
		this.slider.className = SBase.CLASS_NAME.SLIDER;
		this.slider.value	= min;
		this.slider.min		= min;
		this.slider.max		= max;
		this.slider.step	= (max - min) / 100;
		this.datalist		= document.createElement("datalist");
		this.datalist.id	= this.getId() + "_datalist";
		this.slider.setAttribute("list", this.datalist.id);
		this.getElement().appendChild(this.slider);
		this.getElement().appendChild(this.datalist);
	}
	
	getEnabledElement() {
		return this.slider;
	}
	
	setMaximum(max) {
		this.slider.max = max;
	}
	
	setMinimum(min) {
		this.slider.min = min;
	}
	
	getMaximum() {
		return parseFloat(this.slider.max);
	}
	
	getMinimum() {
		return parseFloat(this.slider.min);
	}
	
	setValue(value) {
		this.slider.value = value;
	}
	
	getValue() {
		return parseFloat(this.slider.value);
	}
	
	setMinorTickSpacing(step) {
		this.slider.step = step;
	}
	
	getMinorTickSpacing() {
		return parseFloat(this.slider.step);
	}
	
	setMajorTickSpacing(step) {
		this.majortick = step;
		this.removeMajorTickSpacing();
		let i;
		const min = this.getMinimum();
		const max = this.getMaximum();
		for(i = min; i <= max; i+= step) {
			const option_node = document.createElement("option");
			option_node.value = i.toString();
			this.datalist.appendChild(option_node);
		}
	}
	
	getMajorTickSpacing() {
		return this.majortick;
	}
	
	removeMajorTickSpacing() {
		const element = this.datalist;
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
	}
	
	addListener(func) {
		let isDown = false;
		const _this = this;
		const setDown = function() {
			isDown = true;
		};
		const setUp = function() {
			if(isDown) {
				if(_this.slider.disabled !== "disabled") {
					func();
				}
				isDown = false;
			}
		};
		this.slider.addEventListener("touchstart", setDown, false );
		this.slider.addEventListener("touchend", setUp, false );
		this.slider.addEventListener("mousedown", setDown, false );
		this.slider.addEventListener("mouseup", setUp, false );
	}

	getWidth() {
		let width = this.slider.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}
	
	getHeight() {
		let height = this.slider.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}
	
	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setWidth(width);
		this.slider.style.width = width.toString() + this.unit;
	}
	
	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		super.setHeight(height);
		this.slider.style.height = height.toString() + this.unit;
	}
	
}