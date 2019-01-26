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

export default class SLabel extends SBase {
	
	constructor(title) {
		super("div", title);
		this.addClass(SBase.CLASS_NAME.LABEL);
	}
	
	getContainerElement() {
		return this.getElement();
	}
	
}
