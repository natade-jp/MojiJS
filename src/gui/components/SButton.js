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

export default class SButton extends SBase {
	
	constructor(title) {
		super("input", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.getElement().type = "button";
	}
	
	getEditableNodeForValue() {
		return this.getElement();
	}
	
	getEnabledElement () {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("click", func, false);
	}
	
}


