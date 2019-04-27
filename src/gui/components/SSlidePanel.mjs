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

export default class SSlidePanel extends SBase {
	
	constructor(title) {
		super("div");
		this.addClass(SBase.CLASS_NAME.SLIDEPANEL);
		this.textnode = document.createTextNode( title ? title : "");
		this.legend = document.createElement("span");
		SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.SLIDEPANEL_LEGEND);
		this.legend.id = this.getId() + "_legend";
		this.legend.appendChild(this.textnode);
		this.slide = document.createElement("div");
		SBase.node_tool.addClass(this.slide, SBase.CLASS_NAME.SLIDEPANEL_SLIDE);
		this.slide.id = this.getId() + "_slide";
		this.body = document.createElement("div");
		SBase.node_tool.addClass(this.body, SBase.CLASS_NAME.CONTENTSBOX);
		this.body.id = this.getId() + "_body";
		const that = this;
		const clickfunc = function() {
			that.setOpen(!that.isOpen());
		};
		this.legend.addEventListener("click", clickfunc);
		this.setOpen(false);
		this.slide.appendChild(this.body);
		const element   = super.getElement();
		element.appendChild(this.legend);
		element.appendChild(this.slide);
	}
	
	setOpen(is_open) {
		this.is_open = is_open;
		if (this.is_open){
			this.slide.style.maxHeight	= this.body.scrollHeight + "px";
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.OPEN);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.CLOSE);
		} else {
			this.slide.style.maxHeight	= null;
			SBase.node_tool.addClass(this.legend, SBase.CLASS_NAME.CLOSE);
			SBase.node_tool.removeClass(this.legend, SBase.CLASS_NAME.OPEN);
		} 
	}
	
	isOpen() {
		return this.is_open;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getContainerElement() {
		return this.body;
	}
	
	clear() {
		SBase.node_tool.removeChildNodes(this.body);
	}
}

