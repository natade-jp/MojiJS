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

export default class SPanel extends SBase {
	
	constructor(title) {
		super("div", null);
		this.addClass(SBase.CLASS_NAME.PANEL);
		const element = this.getElement();
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.PANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		this.paneltool = {
			setText :  function(title) {
				if(title) {
					that.legend.textContent = title;
					that.legend.style.display = "block";
				}
				else {
					that.legend.style.display = "none";
				}
			}
		};
		this.paneltool.setText(title);
		element.appendChild(this.legend);
		element.appendChild(this.body);
	}
	
	setText(title) {
		if(this.paneltool) {
			this.paneltool.setText(title);
		}
	}

	getContainerElement() {
		return this.body;
	}

	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}

}