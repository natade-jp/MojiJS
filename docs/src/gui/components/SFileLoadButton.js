/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import SBase from "./SBase.js";

export default class SFileLoadButton extends SBase {
	
	constructor(title) {
		super("label", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILELOAD);
		
		// CSS有効化のために、label 内に input(file) を入れる
		// Edge のバグがあるので Edgeで使用できない
		// https://github.com/facebook/react/issues/7683
		const element   = super.getElement();
		const file = document.createElement("input");
		element.style.textAlign =  "center";  
		file.setAttribute("type", "file");
		file.id = this.getId() + "_file";
		file.style.display = "none";
		this.file = file;
		element.appendChild(file);
	}
	
	getEnabledElement() {
		return this.file;
	}
	
	getFileAccept() {
		const accept = this.file.getAttribute("accept");
		return (accept === null) ? "" : accept;
	}
	
	setFileAccept(filter) {
		if(filter === SFileLoadButton.FILE_ACCEPT.DEFAULT) {
			if(this.file.getAttribute("accept") !== null) {
				this.file.removeAttribute("accept");
			}
		}
		else {
			this.file.accept = filter;
		}
	}
	
	addListener(func) {
		this.file.addEventListener("change",
			function(event){
				func(event.target.files);
			}, false );
	}

}

SFileLoadButton.FILE_ACCEPT = {
	DEFAULT	: "",
	IMAGE	: "image/*",
	AUDIO	: "audio/*",
	VIDEO 	: "video/*",
	TEXT 	: "text/*",
	PNG 	: "image/png",
	JPEG 	: "image/jpg",
	GIF 	: "image/gif"
};
