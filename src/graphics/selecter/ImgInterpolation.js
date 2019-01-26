/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

const InterpolationFunctions = {
	
	ipLerp : function(v0, v1, x) {
		const delta = v1.subColor(v0);
		return v0.addColor(delta.mul(x));
	},
	
	ipCosine : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1,((1.0 - Math.cos(Math.PI * x)) * 0.5));
	},
	
	ipHermite2p3 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * (3.0 - 2.0 * x)));
	},
	
	ipHermite2p5 : function(v0, v1, x) {
		return InterpolationFunctions.ipLerp(v0, v1, (x * x * x * (6.0 * x * x - 15.0 * x + 10.0)));
	},
	
	ipHermite4p : function(v0, v1, v2, v3, x) {
		const P = v3.subColor(v2).subColor(v0.subColor(v1));
		const Q = v0.subColor(v1).subColor(P);
		const R = v2.subColor(v0);
		const S = v1;
		return  P.mul(x * x * x).addColor(Q.mul(x * x)).addColor(R.mul(x)).addColor(S);
	},
	
	funcInBicubic : function(d, a) {
		if(d <= 1.0) {
			return 1.0 - ((a + 3.0) * d * d) + ((a + 2.0) * d * d * d);
		}
		else {
			return (-4.0 * a) + (8.0 * a * d) - (5.0 * a * d * d) + (a * d * d * d);
		}
	},
	
	ipBicubic : function(v0, v1, v2, v3, x, a) {
		const w0 = InterpolationFunctions.funcInBicubic(x + 1, a);
		const w1 = InterpolationFunctions.funcInBicubic(x    , a);
		const w2 = InterpolationFunctions.funcInBicubic(1 - x, a);
		const w3 = InterpolationFunctions.funcInBicubic(2 - x, a);
		const c = v0.mul(w0).addColor(v1.mul(w1)).addColor(v2.mul(w2)).addColor(v3.mul(w3));
		return c.mul(1.0 / (w0 + w1 + w2 + w3));
	},
	
	ipBicubicSoft : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -0.5);
	},
	
	ipBicubicNormal : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.0);
	},
	
	ipBicubicSharp : function(v0, v1, v2, v3, x) {
		return InterpolationFunctions.ipBicubic(v0, v1, v2, v3, x, -1.2);
	},
	
	ipBicubic2D : function(va, nx, ny, a) {
		let output = va[0][0].zero();
		let x, y, y_weight, weight, sum = 0.0;
		for(y = 0; y < 4; y++) {
			y_weight = InterpolationFunctions.funcInBicubic(Math.abs(- ny + y - 1), a);
			for(x = 0; x < 4; x++) {
				weight  = InterpolationFunctions.funcInBicubic(Math.abs(- nx + x - 1), a);
				weight *= y_weight;
				sum    += weight;
				output = output.addColor(va[y][x].mul(weight));
			}
		}
		output = output.mul(1.0 / sum);
		return output;
	},
	
	ipBicubic2DSoft : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -0.5);
	},
	
	ipBicubic2DNormal : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.0);
	},
	
	ipBicubic2DSharp : function(va, nx, ny) {
		return InterpolationFunctions.ipBicubic2D(va, nx, ny, -1.2);
	}
};

export default class ImgInterpolation {
		
	constructor(mode) {
		if(arguments.length === 0) {
			mode = ImgInterpolation.MODE.NEAREST_NEIGHBOR;
		}
		this.setInterpolationMode(mode);
	}
	
	clone() {
		return new ImgInterpolation(this.ipmode);
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.filtermode} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ipmode	= ipmode;
		if(ipmode === ImgInterpolation.MODE.NEAREST_NEIGHBOR) {
			this.ipfunc	= InterpolationFunctions.ipLerp;
			this.ipn	= 1;
		}
		else if(ipmode === ImgInterpolation.MODE.BILINEAR) {
			this.ipfunc = InterpolationFunctions.ipLerp;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.COSINE) {
			this.ipfunc = InterpolationFunctions.ipCosine;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_3) {
			this.ipfunc = InterpolationFunctions.ipHermite2p3;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE4_5) {
			this.ipfunc = InterpolationFunctions.ipHermite2p5;
			this.ipn	= 2;
		}
		else if(ipmode === ImgInterpolation.MODE.HERMITE16) {
			this.ipfunc = InterpolationFunctions.ipHermite4p;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC) {
			this.ipfunc = InterpolationFunctions.ipBicubic2DNormal;
			this.ipn	= 16;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SOFT) {
			this.ipfunc = InterpolationFunctions.ipBicubicSoft;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_NORMAL) {
			this.ipfunc = InterpolationFunctions.ipBicubicNormal;
			this.ipn	= 4;
		}
		else if(ipmode === ImgInterpolation.MODE.BICUBIC_SHARP) {
			this.ipfunc = InterpolationFunctions.ipBicubicSharp;
			this.ipn	= 4;
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(imgdata, x, y) {
		const rx = Math.floor(x);
		const ry = Math.floor(y);
		if(	(this.ipn === 1) ||
			((rx === x) && (ry === y))) {
			return imgdata.getPixel(rx, ry);
		}
		else if(this.ipn === 2) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1;
			c0 = imgdata.getPixel(rx    , ry    );
			c1 = imgdata.getPixel(rx + 1, ry    );
			const n0  = this.ipfunc(c0, c1 , nx);
			c0 = imgdata.getPixel(rx    , ry + 1);
			c1 = imgdata.getPixel(rx + 1, ry + 1);
			const n1  = this.ipfunc(c0, c1 , nx);
			return this.ipfunc( n0, n1, ny );
		}
		else if(this.ipn === 4) {
			const nx = x - rx;
			const ny = y - ry;
			let c0, c1, c2, c3;
			c0 = imgdata.getPixel(rx - 1, ry - 1);
			c1 = imgdata.getPixel(rx    , ry - 1);
			c2 = imgdata.getPixel(rx + 1, ry - 1);
			c3 = imgdata.getPixel(rx + 2, ry - 1);
			const n0 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry    );
			c1 = imgdata.getPixel(rx    , ry    );
			c2 = imgdata.getPixel(rx + 1, ry    );
			c3 = imgdata.getPixel(rx + 2, ry    );
			const n1 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 1);
			c1 = imgdata.getPixel(rx    , ry + 1);
			c2 = imgdata.getPixel(rx + 1, ry + 1);
			c3 = imgdata.getPixel(rx + 2, ry + 1);
			const n2 = this.ipfunc(c0, c1, c2, c3, nx);
			c0 = imgdata.getPixel(rx - 1, ry + 2);
			c1 = imgdata.getPixel(rx    , ry + 2);
			c2 = imgdata.getPixel(rx + 1, ry + 2);
			c3 = imgdata.getPixel(rx + 2, ry + 2);
			const n3 = this.ipfunc(c0, c1, c2, c3, nx);
			return this.ipfunc( n0, n1, n2, n3, ny );
		}
		else if(this.ipn === 16) {
			const nx = x - rx;
			const ny = y - ry;
			let ix, iy;
			const cdata = [];
			for(iy = -1; iy < 3; iy++) {
				const cx = [];
				for(ix = -1; ix < 3; ix++) {
					cx[cx.length] = imgdata.getPixel(rx + ix, ry + iy);
				}
				cdata[cdata.length] = cx;
			}
			return this.ipfunc( cdata, nx, ny );
		}
		return null;
	}
}

ImgInterpolation.MODE = {
	NEAREST_NEIGHBOR	: "NEAREST_NEIGHBOR",
	BILINEAR			: "BILINEAR",
	COSINE				: "COSINE",
	HERMITE4_3			: "HERMITE4_3",
	HERMITE4_5			: "HERMITE4_5",
	HERMITE16			: "HERMITE16",
	BICUBIC				: "BICUBIC",
	BICUBIC_SOFT		: "BICUBIC_SOFT",
	BICUBIC_NORMAL		: "BICUBIC_NORMAL",
	BICUBIC_SHARP		: "BICUBIC_SHARP"
};


