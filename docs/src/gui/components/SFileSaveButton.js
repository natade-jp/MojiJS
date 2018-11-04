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

export default class SFileSaveButton extends SBase {
	
	constructor(title) {
		super("a", title);
		this.addClass(SBase.CLASS_NAME.BUTTON);
		this.addClass(SBase.CLASS_NAME.FILESAVE);
		this.filename = "";
		this.url      = "";
		this.getElement().setAttribute("download", this.filename);
	}
	
	getFileName() {
		return this.filename;
	}
	
	setFileName(filename) {
		this.filename = filename;
		this.getElement().setAttribute("download", this.filenam);
	}
	
	setURL(url) {
		this.getElement().href = url;
		this.url               = url;
	}
	
	setEnabled(isenabled) {
		if(this.isEnabled() !== isenabled) {
			if(isenabled) {
				this.getElement().href = this.url;
			}
			else {
				this.getElement().removeAttribute("href");
			}
		}
		super.setEnabled(isenabled);
	}

}
