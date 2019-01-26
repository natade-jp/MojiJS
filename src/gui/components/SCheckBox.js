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

export default class SCheckBox extends SBase {
		
	constructor(title) {
		super("label");
		this.addClass(SBase.CLASS_NAME.LABEL);
		this.addClass(SBase.CLASS_NAME.CHECKBOX);
		
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = this.getId() + "_checkbox";
		checkbox.className = SBase.CLASS_NAME.CHECKBOX_IMAGE;
		this.checkbox = checkbox;
		this.textnode = document.createTextNode( title ? title : "");
		const element   = this.getElement();
		element.appendChild(this.checkbox);
		element.appendChild(this.textnode);
	}

	getEnabledElement() {
		return this.checkbox;
	}
	
	getTextNode() {
		return this.textnode;
	}
	
	getElementNode() {
		return this.checkbox;
	}
	
	setLabelPosition(LABEL_POSITION) {
		// ラベルかどうか確認
		const element = this.getElement();
		const textnode = this.getTextNode();
		const elementnode = this.getElementNode();
		// 中身を一旦消去する
		this.node_tool.removeChildNodes(element);
		// 配置を設定する
		if(LABEL_POSITION === SBase.LABEL_POSITION.LEFT) {
			// ラベル内のテキストは左側
			element.appendChild(textnode);
			element.appendChild(elementnode);
		}
		else {
			// ラベルのテキストは右側
			element.appendChild(elementnode);
			element.appendChild(textnode);
		}
		return;
	}
	
	setCheckBoxImageSize(size) {
		if(typeof size !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.checkbox.style.height = size.toString() + this.unit;
		this.checkbox.style.width  = size.toString() + this.unit;
	}
	
	addListener(func) {
		this.checkbox.addEventListener("change", func, false);
	}
	
	setChecked(ischecked) {
		this.checkbox.checked = ischecked;
	}
	
	isChecked() {
		return this.checkbox.checked;
	}
	
}

