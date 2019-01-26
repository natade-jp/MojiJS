/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import ArrayList from "./basic/ArrayList.js";
import Color from "./basic/Color.js";
import File from "./basic/File.js";
import HashMap from "./basic/HashMap.js";
import Format from "./basic/Format.js";
import MathX from "./mathx/MathX.js";

import Device from "./device/Device.js";
import ImageProcessing from "./graphics/ImageProcessing.js";
import SComponent from "./gui/SComponent.js";
import S3 from "./renderer/S3.js";

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
		Senko.print(Senko.format.apply(this, x));
	}
};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File;
Senko.HashMap = HashMap;
Senko.format = Format.format;
Senko.MathX = MathX;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;
Senko.S3 = S3;

export default Senko;
