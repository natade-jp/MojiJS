/* global WSH, WScript */

/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Format from "./Format.mjs";
const format = Format.format;

const toStringFromObj = function(text_obj) {
	let text;
	if((typeof text_obj === "string")||(text_obj instanceof String)) {
		if(text_obj.length === 0) {
			// Edge だと console.log("") でエラー表示になるため
			text = " ";
		}
		else {
			text = text_obj;
		}
	}
	else if(typeof text_obj === "undefined") {
		text = typeof text_obj;
	}
	else if(text_obj === null) {
		text = "null";
	}
	else if(typeof text_obj.toString === "function") {
		text = text_obj.toString();
	}
	else if(text_obj instanceof Object) {
		text = "Object";
	}
	else {
		text = "null";
	}
	return text;
};

class CUIConsole {
	
	constructor() {
		this.output = CUIConsole._getOutput();
	}

	static _getOutput() {
		const getConsole = function() {
			if(typeof WSH !== "undefined") {
				return(null);
			}
			else if(typeof console !== "undefined") {
				return(console);
			}
			else if(typeof window !== "undefined") {
				if(typeof window.console !== "undefined") {
					return(window.console);
				}
			}
			return(null);
		};
		const isJScript = function() {
			return(typeof WSH !== "undefined");
		};
		const isConsole = function() {
			return(getConsole() !== null);
		};
		let output = null;
		// JScript 用
		if(isJScript()) {
			if(/cscript\.exe$/i.test(WSH.FullName)) {
				output = function(text) {
					if(/\n$/.test(text)) {
						WSH.StdOut.Write(text);
					}
					else {
						WSH.StdOut.Write(text + "\n");
					}
				};
			}
			else {
				output = WScript.Echo;
			}
		}
		// HTMLで表示する場合
		else if(isConsole()) {
			const console = getConsole();
			output = console.log;
		}
		// 最終的には alert IE10用
		else if(typeof alert !== "undefined") {
			output = alert;
		}
		return output;
	}

	getOutput() {
		return this.output;
	}
}

class HtmlConsole {

	constructor() {
		this.root		= null;
		this.element	= null;
		this.isshow		= false;
		this.loglength	= 250;
		this.linelength	= 0;
	}

	_getElement() {
		if(this.element !== null) {
			return this.element;
		}
		const element = document.createElement("div");
		element.style.backgroundColor = "black";
		element.style.color = "white";
		element.style.display = "block";
		element.style.margin = "0px";
		element.style.padding = "5px";
		element.style.fontFamily = "Consolas, Courier New, Courier, Monaco, monospace";
		element.style.whiteSpace = "pre";
		this.element = element;
		return this.element;
	}

	_initHTML() {
		if(this.root !== null) {
			return;
		}
		let root;
		root = document.getElementById("senko_console");
		if(root) {
			let child = root.lastChild;
			while (child) {
				root.removeChild(child);
				child = root.lastChild;
			}
		}
		else {
			root = document.body;
		}
		root.style.backgroundColor = "black";
		root.style.margin = "0px";
		root.style.padding = "0px";
		root.style.overflowY = "scroll";
		root.appendChild(this._getElement());
		this.root = root;
	}

	isShow() {
		return this.isshow;
	}

	setShow(isshow) {
		if(typeof isshow !== "boolean") {
			throw "not boolean";
		}
		this._initHTML();
		const element = this._getElement();
		if(this.isshow !== isshow) {
			this.isshow = isshow;
			if(element) {
				element.style.display = this.isshow ? "block" : "none";
			}
		}
	}

	_autoScroll() {
		if((this.element === null) || (this.root === null)) {
			return;
		}
		const parentheight	= this.root.clientHeight;
		const childheight		= this.element.clientHeight;
		// スクロールしないと見えない領域とマージン
		const hideheight		= childheight - parentheight;
		const margin			= parentheight * 1.0;
		// スクロールしないと見えない領域が見えている状態ならオートスクロール
		if(hideheight - margin <= this.root.scrollTop) {
			this.root.scrollTop = childheight;
		}
	}

	_addNewLine() {
		this._initHTML();
		const element = this._getElement();
		// 次の行を作成する
		const p = document.createElement("p");
		p.innerText = "> ";
		p.style.margin = "0.2em 0px 0.2em 0px";
		p.style.padding = "0px";
		element.appendChild(p);
		this.linelength++;
		this._cleaningLog();
	}

	_appendText(text) {
		this._initHTML();
		const element = this._getElement();
		const p = element.lastElementChild;
		p.innerText = p.innerText + text;
	}

	_cleaningLog() {
		if(this.element === null) {
			return;
		}
		while(this.linelength > this.loglength) {
			this.element.removeChild(this.element.firstElementChild);
			this.linelength--;
		}
	}

	setLogLength(loglength) {
		this.loglength = loglength;
	}

	println(text) {
		this._initHTML();
		const element = this._getElement();
		if(element) {
			// 最終行に文字を追加する
			if(!element.lastElementChild) {
				this._addNewLine();
			}
			this._appendText(text);
			// 次の行を作成する
			this._addNewLine();
		}
		this._autoScroll();
	}
}

const cui = (new CUIConsole()).getOutput();
let gui_obj = null;
let gui = null;
if (console || (window && window.console)) {
	gui_obj = new HtmlConsole();
	gui = function(text) {
		gui_obj.println(text);
	};
}

let show_gui = false;
let printbuffer = "";

class Log {

	static setGUI() {
		if(gui) {
			show_gui = true;
		}
	}
	
	static setCUI() {
		show_gui = false;
	}

	static println(text_obj) {
		const text = printbuffer + toStringFromObj(text_obj);
		printbuffer = "";
		if(show_gui) {
			gui(text);
		}
		else {
			cui(text);
		}
	}
	
	static print(text_obj) {
		printbuffer += toStringFromObj(text_obj);
	}
	
	static printf() {
		const x = [];
		for(let i = 0 ; i < arguments.length ; i++) {
			x.push(arguments[i]);
		}
		Log.print(format.apply(this, x));
	}

}

export default Log;