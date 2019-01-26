﻿/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * 基底クラス
 */
export default class SBase {
	
	constructor(elementtype, title) {
		this.id				= "SComponent_" + (SBase._counter++).toString(16);
		this.wallid			= "SComponent_" + (SBase._counter++).toString(16);
		this.isshow			= false;
		this._element		= null;
		this._wall			= null;
		this.elementtype	= elementtype;
		this.unit			= SBase.UNIT_TYPE.EM;

		const that = this;
		const mouseevent = {
			over : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
			},
			out : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEOVER);
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			down  : function(){
				SBase.node_tool.addClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			},
			up  : function(){
				SBase.node_tool.removeClass(that.getElement(), SBase.CLASS_NAME.MOUSEDOWN);
			}
		};

		this.tool			= {
			attachMouseEvent : function(element) {
				element.addEventListener("touchstart", mouseevent.over	,false);
				element.addEventListener("touchend", mouseevent.up		,false);
				element.addEventListener("mouseover",mouseevent.over	,false);
				element.addEventListener("mouseout"	,mouseevent.out		,false);
				element.addEventListener("mousedown",mouseevent.down	,false);
				element.addEventListener("mouseup"	,mouseevent.up		,false);
			},
			removeNodeForId : function(id) {
				const element = document.getElementById(id);
				SBase.node_tool.removeNode(element);
				return element;
			},
			AputB : function(target, component, type) {
				if((!target) || (!component) || (!(component instanceof SBase))) {
					throw "IllegalArgumentException";
				}
				else if(target === component) {
					throw "it referenced me";
				}
				else if((type !== SBase.PUT_TYPE.IN) &&
					(type !== SBase.PUT_TYPE.RIGHT) &&
					(type !== SBase.PUT_TYPE.NEWLINE) ) {
					throw "IllegalArgumentException";
				}
				let node = null;
				if((typeof target === "string")||(target instanceof String)) {
					node = document.getElementById(target);
				}
				else if(target instanceof SBase) {
					if(type === SBase.PUT_TYPE.IN) {
						if(target.isContainer()) {
							node = target.getContainerElement();
						}
						else {
							throw "not Container";
						}
					}
					else {
						node = target.getElement();
					}
				}
				if(node === null) {
					throw "Not Found " + target;
				}
				// この時点で
				// node は HTML要素 となる。
				// component は SBase となる。

				const insertNext = function(newNode, referenceNode) {
					if(referenceNode.nextSibling) {
						referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
					}
					else {
						referenceNode.parentNode.appendChild(newNode);
					}
				};
				// 移動前に自分を消去
				component.removeMe();
				if(type === SBase.PUT_TYPE.IN) {
					// 最後の行があるならば次の行へ
					component.onAdded();
					if(node.lastChild !== null) {
						component.getWall(SBase.PUT_TYPE.NEWLINE).style.display = "block";
						node.appendChild(component.getWall());
					}
					component.getElement().style.display = "inline-block";
					node.appendChild(component.getElement());
				}
				else {
					if(node.parentNode === null) {
						throw "not found element on the html";
					}
					component.onAdded();
					insertNext(component.getWall(type), node);
					insertNext(component.getElement(), component.getWall(type));
					if(type === SBase.PUT_TYPE.RIGHT) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "inline-block";
						component.getElement().style.display = "inline-block";
					}
					else if(type === SBase.PUT_TYPE.NEWLINE) {
						node.style.display = "inline-block";
						component.getWall(type).style.display = "block";
						component.getElement().style.display = "inline-block";
					}
				}
			}
		};

		this.setText(title);
	}
	
	getWidth() {
		let width = this.getElement().style.width;
		if(width === null) {
			return null;
		}
		width = width.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(width);
	}

	getHeight() {
		let height = this.getElement().style.height;
		if(height === null) {
			return null;
		}
		height = height.match(/[+-]?\s*[0-9]*\.?[0-9]*/)[0];
		return parseFloat(height);
	}

	getSize() {
		return {
			width : this.getWidth(),
			height : this.getHeight()
		};
	}

	setWidth(width) {
		if(typeof width !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.width = width.toString() + this.unit;
	}

	setHeight(height) {
		if(typeof height !== "number") {
			throw "IllegalArgumentException not number";
		}
		this.getElement().style.height = height.toString() + this.unit;
	}

	setSize(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	}

	removeMe() {
		this.tool.removeNodeForId(this.id);
		this.tool.removeNodeForId(this.space_id);
	}

	onAdded() {
	}

	getWall(type) {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._wall) {
			return this._wall;
		}
		const wall = document.createElement("span");
		wall.id = this.wallid;
		if(type === SBase.PUT_TYPE.RIGHT) {
			wall.className = SBase.CLASS_NAME.SPACE;
		}
		else if(type === SBase.PUT_TYPE.NEWLINE) {
			wall.className = SBase.CLASS_NAME.NEWLINE;
		}
		wall.style.display = "inline-block";
		this._wall = wall;
		return wall;
	}

	isContainer() {
		return this.getContainerElement() !== null;
	}

	getContainerElement() {
		return null;
	}

	getElement() {
		// すでに作成済みならそれを返して、作っていないければ作る
		if(this._element) {
			return this._element;
		}
		const element = document.createElement(this.elementtype);
		element.id = this.id;
		element.className = SBase.CLASS_NAME.COMPONENT;
		element.style.display = "inline-block";
		this._element = element;
		this.tool.attachMouseEvent(element);
		return element;
	}

	put(targetComponent, type) {
		this.tool.AputB(this, targetComponent, type);
		return;
	}

	putMe(target, type) {
		this.tool.AputB(target, this, type);
		return;
	}

	isVisible() {
		if(this.getElement().style.visibility === null) {
			return true;
		}
		return this.getElement().style.visibility !== "hidden";
	}

	setVisible(isvisible) {
		if(isvisible) {
			this.getElement().style.visibility	= "visible";
			this.getWall().style.visibility		= "visible";
		}
		else {
			this.getElement().style.visibility	= "hidden";
			this.getWall().style.visibility		= "hidden";
		}
		return;
	}
	
	getTextNode() {
		const element = this.getElement();
		// childNodes でテキストノードまで取得する
		const childnodes = element.childNodes;
		let textnode = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(childnodes[i] instanceof Text) {
				textnode = childnodes[i];
				break;
			}
		}
		// テキストノードがない場合は null をかえす
		return textnode;
	}

	getElementNode() {
		const element = this.getElement();
		// children でテキストノード意外を取得する
		const childnodes = element.children;
		let node = null;
		let i = 0;
		for(i = 0; i < childnodes.length; i++) {
			if(!(childnodes[i] instanceof Text)) {
				node = childnodes[i];
				break;
			}
		}
		return node;
	}

	getEditableNodeForValue() {
		// Value要素をもつもの
		return null;
	}

	getEditableNodeForNodeValue() {
		// Value要素をもつなら、このメソッドは利用不可とする
		if(this.getEditableNodeForValue()) {
			return null;
		}
		// nodeValue 要素をもつもの
		let textnode = this.getTextNode();
		// 見つからなかったら作成する
		if(textnode === null) {
			const element = this.getElement();
			textnode = document.createTextNode("");
			element.appendChild(textnode);
		}
		return textnode;
	}

	setText(title) {
		if(!title) {
			return;
		}
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			node.value = title;
			return;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			node.nodeValue = title;
			return;
		}
	}

	getText() {
		let title = null;
		let node = null;
		node = this.getEditableNodeForValue();
		if(node) {
			title = node.value;
		}
		node = this.getEditableNodeForNodeValue();
		if(node) {
			title = node.nodeValue.trim();
		}
		return (title === null) ? "" : title;
	}

	getEnabledElement() {
		return null;
	}

	setEnabled(isenabled) {
		if(isenabled) {
			SBase.node_tool.removeClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		else {
			SBase.node_tool.addClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
		}
		const element = this.getEnabledElement();
		// disabled属性が利用可能ならつける
		if(element !== null) {
			SBase.node_tool.setBooleanAttribute(element, "disabled", isenabled);
		}
	}
	
	isEnabled() {
		return !SBase.node_tool.isSetClass(this.getElement(), SBase.CLASS_NAME.DISABLED);
	}

	getId() {
		return this.id;
	}

	getUnit() {
		return this.unit;
	}

	setUnit(UNIT_TYPE) {
		this.unit = UNIT_TYPE;
	}

	addClass(classname) {
		return SBase.node_tool.addClass(this.getElement(), classname);
	}

	toString() {
		return this._elementtype + "(" + this.id + ")";
	}
}

SBase.PUT_TYPE = {
	IN		: 0,
	RIGHT	: 1,
	NEWLINE	: 2
};

SBase.UNIT_TYPE = {
	PX		: "px",
	EM		: "em",
	PERCENT	: "%"
};

SBase.LABEL_POSITION = {
	LEFT	: 0,
	RIGHT	: 1
};

SBase.CLASS_NAME = {
	MOUSEOVER		: "SCOMPONENT_MouseOver",
	MOUSEDOWN		: "SCOMPONENT_MouseDown",
	DISABLED		: "SCOMPONENT_Disabled",
	COMPONENT		: "SCOMPONENT_Component",
	NEWLINE			: "SCOMPONENT_Newline",
	CLOSE			: "SCOMPONENT_Close",
	OPEN			: "SCOMPONENT_Open",
	SPACE			: "SCOMPONENT_Space",
	CONTENTSBOX		: "SCOMPONENT_ContentsBox",
	PANEL			: "SCOMPONENT_Panel",
	PANEL_LEGEND	: "SCOMPONENT_PanelLegend",
	SLIDEPANEL		: "SCOMPONENT_SlidePanel",
	SLIDEPANEL_LEGEND: "SCOMPONENT_SlidePanelLegend",
	SLIDEPANEL_SLIDE: "SCOMPONENT_SlidePanelSlide",
	GROUPBOX		: "SCOMPONENT_GroupBox",
	GROUPBOX_LEGEND	: "SCOMPONENT_GroupBoxLegend",
	IMAGEPANEL		: "SCOMPONENT_ImagePanel",
	LABEL			: "SCOMPONENT_Label",
	SELECT			: "SCOMPONENT_Select",
	COMBOBOX		: "SCOMPONENT_ComboBox",
	CHECKBOX		: "SCOMPONENT_CheckBox",
	CHECKBOX_IMAGE	: "SCOMPONENT_CheckBoxImage",
	BUTTON			: "SCOMPONENT_Button",
	FILELOAD		: "SCOMPONENT_FileLoad",
	FILESAVE		: "SCOMPONENT_FileSave",
	CANVAS			: "SCOMPONENT_Canvas",
	PROGRESSBAR		: "SCOMPONENT_ProgressBar",
	SLIDER			: "SCOMPONENT_Slider",
	COLORPICKER		: "SCOMPONENT_ColorPicker"
};

SBase._counter			= 0;

SBase.node_tool = {
	setBooleanAttribute : function(element, attribute, isset) {
		if((	!(typeof attribute === "string") &&
				!(attribute instanceof String)) ||
				(typeof isset !== "boolean")) {
			throw "IllegalArgumentException";
		}
		const checked = element.getAttribute(attribute);
		if((!isset) && (checked === null))  {
			// falseなので無効化させる。すでにチェック済みなら何もしなくてよい
			element.setAttribute(attribute, attribute);
		}
		else if ((isset) && (checked !== null)) {
			element.removeAttribute(attribute);
		}
	},

	isBooleanAttribute : function(element, attribute) {
		if( !(typeof attribute === "string") &&
			!(attribute instanceof String)) {
			throw "IllegalArgumentException";
		}
		return (element.getAttribute(attribute) === null);
	},

	removeNode : function(element) {
		if(element) {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		}
		return element;
	},

	removeChildNodes : function(element) {
		let child = element.lastChild;
		while (child) {
			element.removeChild(child);
			child = element.lastChild;
		}
		return;
	},

	isSetClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return false;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		return pattern.test(classdata);
	},

	addClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			element.className = classname;
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(pattern.test(classdata)) {
			return;
		}
		element.className = classdata + " " + classname;
	},

	removeClass : function(element, classname) {
		const classdata = element.className;
		if(classdata === null) {
			return;
		}
		const pattern = new RegExp( "(^" + classname + "$)|( +" + classname + ")" , "g");
		if(!pattern.test(classdata)) {
			return;
		}
		element.className = classdata.replace(pattern, "");
	}
};

