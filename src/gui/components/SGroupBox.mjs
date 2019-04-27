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

export default class SGroupBox extends SBase {
	
	constructor(title) {
		super("fieldset");
		this.addClass(SBase.CLASS_NAME.GROUPBOX);
		this.legend = document.createElement("legend");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.GROUPBOX_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.textContent = title;
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const element   = this.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
	
}
