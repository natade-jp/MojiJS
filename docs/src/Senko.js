/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import Text from "./basic/Text.js";

const Senko = {

	_toString: function(text_obj) {
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
			text = text_obj;
		}
		else if(typeof text_obj.toString === "function") {
			text = text_obj.toString();
		}
		return text;
	},

	println: function(text_obj) {
		const out = console;
		const text = Senko._printbuffer + Senko._toString(text_obj);
		Senko._printbuffer = "";
		out.log(text);
	},
	
	print: function(text_obj) {
		Senko._printbuffer += Senko._toString(text_obj);
	},
	
	printf: function() {
		const x = [];
		for(let i = 0 ; i < arguments.length ; i++) {
			x[i] = arguments[i];
		}
		Senko.println(Text.format.apply(this, x));
	}
};

Senko._printbuffer = "";

export default Senko;
