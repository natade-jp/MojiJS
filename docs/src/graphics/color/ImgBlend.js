/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const BlendFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	brendNone : function(x, y, alpha) {
		return y;
	},
	
	brendAlpha : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = BlendFunctions.ipLerp(x, y, y_alpha);
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendAdd : function(x, y, alpha) {
		const x_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.addColor(y.mul(y_alpha));
		return x.setBlendAlpha(Math.max(x_alpha, y_alpha));
	},
	
	brendSub : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.subColor(y.mul(y_alpha));
		return x.setBlendAlpha(new_alpha);
	},
	
	brendRevSub : function(x, y, alpha) {
		const new_alpha = y.getBlendAlpha();
		const x_alpha = x.getBlendAlpha() * alpha;
		y = y.subColor(x.mul(x_alpha));
		return y.setBlendAlpha(new_alpha);
	},
	
	brendMul : function(x, y, alpha) {
		const new_alpha = x.getBlendAlpha();
		const y_alpha = y.getBlendAlpha() * alpha;
		x = x.mulColor(y.mul(y_alpha).div(255.0));
		return x.setBlendAlpha(new_alpha);
	}
};

export default class ImgBlend {

	constructor(mode) {
		this.blendfunc = BlendFunctions.brendNone;
		if(arguments.length === 1) {
			this.setBlendMode(mode);
		}
	}
	
	clone() {
		return new ImgBlend(this.blendmode);
	}
	
	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.brendtype} _blendtype
	 * @returns {undefined}
	 */
	setBlendMode(mode) {
		this.blendmode = mode;
		if(mode === ImgBlend.MODE.NONE) {
			this.blendfunc = BlendFunctions.brendNone;
		}
		else if(mode === ImgBlend.MODE.ALPHA) {
			this.blendfunc = BlendFunctions.brendAlpha;
		}
		else if(mode === ImgBlend.MODE.ADD) {
			this.blendfunc = BlendFunctions.brendAdd;
		}
		else if(mode === ImgBlend.MODE.SUB) {
			this.blendfunc = BlendFunctions.brendSub;
		}
		else if(mode === ImgBlend.MODE.REVSUB) {
			this.blendfunc = BlendFunctions.brendRevSub;
		}
		else if(mode === ImgBlend.MODE.MUL) {
			this.blendfunc = BlendFunctions.brendMul;
		}
	}
	
	blend(color1, color2, alpha) {
		return this.blendfunc(color1, color2, alpha);
	}
	
}

ImgBlend.MODE = {
	NONE				: "NONE",
	ALPHA				: "ALPHA",
	ADD					: "ADD",
	SUB					: "SUB",
	REVSUB				: "REVSUB",
	MUL					: "MUL"
};

