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

export default class SComboBox extends SBase {
	
	constructor(item) {
		super("select", item);
		this.addClass(SBase.CLASS_NAME.SELECT);
		this.addClass(SBase.CLASS_NAME.COMBOBOX);
	}
	
	getEnabledElement() {
		return this.getElement();
	}
	
	addListener(func) {
		this.getElement().addEventListener("change", func, false);
	}
	
	setText(title) {
		if(!title) {
			return;
		}
		const element = this.getElement();
		// 1つの文字列のみならば、配列化する
		if	((typeof title === "string") &&
			(title instanceof String)) {
			title = [title];
		}
		// 内部の要素を全部消去する
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		let i = 0;
		// 追加していく
		for(i = 0; i < title.length; i++) {
			const option_node = document.createElement("option");
			option_node.text = title[i].toString();
			option_node.value = title[i].toString();
			element.appendChild(option_node);
		}
	}
	
	getText() {
		const element = this.getElement();
		// select要素なら option を取得
		const child = element.children;
		let i = 0;
		const output = [];
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				output[output.length] = child[i].text;
			}
		}
		return output;
	}
	
	setSelectedItem(text) {
		const child = this.getElement().children;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(child[i].value === text.toString()) {
					this.getElement().selectedIndex = j;
					break;
				}
				j++;
			}
		}
	}
	
	getSelectedItem() {
		const child = this.getElement().children;
		const selectindex = this.getElement().selectedIndex;
		let i = 0, j = 0;
		for(i = 0; i < child.length; i++) {
			if(child[i].tagName === "OPTION") {
				if(selectindex === j) {
					return child[i].value;
				}
				j++;
			}
		}
		return "";
	}
	
}


