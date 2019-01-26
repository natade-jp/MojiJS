/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgBlend from "../color/ImgBlend.js";
import ImgColor from "../color/ImgColor.js";
import ImgWrap from "../selecter/ImgWrap.js";
import ImgInterpolation from "../selecter/ImgInterpolation.js";
import ImgFIRMatrix from "../fir/ImgFIRMatrix.js";

export default class ImgData {
	
	/**
	 * 画像データクラス
	 * ImgDataRGBA   32bit整数 0xRRGGBBAA で管理
	 * ImgDataY 32bit浮動小数点で管理
	 */
	constructor() {
		this.width  = 1;
		this.height = 1;
		this.globalAlpha = 1.0;
		this.data	= null;
		this.blend  = new ImgBlend(ImgBlend.MODE.NONE);
		this.wrap   = new ImgWrap(ImgWrap.MODE.INSIDE, this.width, this.height);
		this.ip     = new ImgInterpolation(ImgInterpolation.MODE.NEAREST_NEIGHBOR);
		if(arguments.length === 1) {
			const image = arguments[0];
			this.putImageData(image);
		}
		else if(arguments.length === 2) {
			const width  = arguments[0];
			const height = arguments[1];
			this.setSize(width, height);
		}
	}
	
	putImageData(imagedata) {
	}
	
	/**
	 * データのサイズを変更します。ただし、変更後が中身が初期化されます。
	 * 以前と同一の画像の場合は初期化されません。
	 * @param {type} width
	 * @param {type} height
	 * @returns {undefined}
	 */
	setSize(width, height) {
		if((this.width === width) && (this.height === height)) {
			return;
		}
		this.width	= width;
		this.height	= height;
		this.wrap.setSize(width, height);
	}
	
	/**
	 * 内部の情報をxにコピーする
	 * @param {type} x
	 * @returns {undefined}
	 */
	_copyData(x) {
		x.blend  = this.blend.clone();
		x.wrap   = this.wrap.clone();
		x.ip     = this.ip.clone();
		x.setSize(this.width, this.height);
		x.data.set(this.data);
		x.globalAlpha = this.globalAlpha;
	}
	
	clone() {
		const x = new ImgData();
		this._copyData(x);
		return x;
	}

	/**
	 * 画面外の色を選択する方法を選ぶ
	 * @param {ImgData.MODE_WRAP} _wrapmode
	 * @returns {undefined}
	 */
	setWrapMode(wrapmode) {
		this.wrap.setImgWrapMode(wrapmode);
	}
	
	/**
	 * 画面外の色を選択する方法を取得する
	 * @returns {ImgData.MODE_WRAP}
	 */
	getWrapMode() {
		return this.wrap.wrapmode;
	}
	
	/**
	 * 実数で色を選択した場合に、どのように色を補完するか選択する
	 * @param {ImgData.MODE_IP} ipmode
	 * @returns {undefined}
	 */
	setInterpolationMode(ipmode) {
		this.ip.setInterpolationMode(ipmode);
	}

	/**
	 * 実数で色を選択した場合に、どのように色を補完するか取得する
	 * @returns {ImgData.MODE_IP}
	 */
	getInterpolationMode() {
		return this.ip.ipmode;
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか設定する
	 * @param {ImgData.MODE_BLEND} blendmode
	 * @returns {undefined}
	 */
	setBlendType(blendmode) {
		this.blend.setBlendMode(blendmode);
	}

	/**
	 * このデータへ書き込む際に、書き込み値をどのようなブレンドで反映させるか取得する
	 * @returns {ImgData.MODE_BLEND}
	 */
	getBlendType() {
		return this.blend.blendmode;
	}
	
	/**
	 * 中身をクリアします。
	 * @returns {undefined}
	 */
	clear() {
		if(this.data) {
			this.data.fill(0);
		}
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {number} x
	 * @param {number} y
	 * @returns {ImgColorRGBA}
	 */
	getPixelInside(x, y) {
		return null;
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証している場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixelInside(x, y, color) {
	}

	/**
	 * x と y の座標にある色を取得する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getPixel(x, y) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			return this.getPixelInside(p[0], p[1]);
		}
		return this.getPixelInside(0, 0).zero();
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が整数かつ画像の範囲内を保証していない場合に使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setPixel(x, y, color) {
		const p = this.wrap.getPixelPosition(x, y);
		if(p) {
			if(this._blendtype === ImgData.MODE_BLEND.NONE) {
				this.setPixelInside(p[0], p[1], color);
			}
			else {
				const mycolor = this.getPixelInside(p[0], p[1]);
				const newcolor = this.blend.blend(mycolor, color, this.globalAlpha);
				this.setPixelInside(p[0], p[1], newcolor);
			}
		}
	}
	
	/**
	 * x と y の座標にある色を取得する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @returns {ImgColor}
	 */
	getColor(x, y) {
		return this.ip.getColor(this, x, y);
	}

	/**
	 * 座標系は、0-1を使用して、テクスチャとみたてて色を取得します。
	 * @param {type} u
	 * @param {type} v
	 * @returns {ImgColor}
	 */
	getColorUV(u, v) {
		return this.getColor(u * this.width, v * this.height);
	}

	/**
	 * x と y の座標にある色を設定する。
	 * x, y が実数かつ画像の範囲内を保証していない場合でも使用可能
	 * @param {type} x
	 * @param {type} y
	 * @param {type} color
	 * @returns {undefined}
	 */
	setColor(x, y, color) {
		this.setPixel(Math.floor(x), Math.floor(y), color);
	}
	
	/**
	 * Canvas型の drawImage と同じ使用方法で ImgData をドローする
	 * ImgDataRGBA データの上には、ImgDataRGBA のみ書き込み可能
	 * ImgDataY    データの上には、ImgDataY    のみ書き込み可能
	 * @param {ImgData} image
	 * @param {number} sx
	 * @param {number} sy
	 * @param {number} sw
	 * @param {number} sh
	 * @param {number} dx
	 * @param {number} dy
	 * @param {number} dw
	 * @param {number} dh
	 * @returns {undefined}
	 */
	drawImgData(image, sx, sy, sw, sh, dx, dy, dw, dh) {
		if(!(image instanceof ImgData)) {
			throw "IllegalArgumentException";
		}
		if(arguments.length === 3) {
			dx = sx;
			dy = sy;
			dw = image.width;
			dh = image.height;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 5) {
			dx = sx;
			dy = sy;
			dw = sw;
			dh = sh;
			sx = 0;
			sy = 0;
			sw = image.width;
			sh = image.height;
		}
		else if(arguments.length === 9) {
			// falls through
		}
		else {
			throw "IllegalArgumentException";
		}
		const delta_w = sw / dw;
		const delta_h = sh / dh;
		let src_x, src_y;
		let dst_x, dst_y;

		src_y = sy;
		for(dst_y = dy; dst_y < (dy + dh); dst_y++) {
			src_x = sx;
			for(dst_x = dx; dst_x < (dx + dw); dst_x++) {
				const color = image.getColor(src_x, src_y);
				if(color) {
					this.setColor(dst_x, dst_y, color);
				}
				src_x += delta_w;
			}
			src_y += delta_h;
		}
	}

	/**
	 * 全画素に指定した関数の操作を行う
	 * @param {function} callback callback(color, x, y, this) 実行したいコールバック関数
	 * @returns {undefined}
	 */
	forEach(callback) {
		let x = 0, y = 0;
		for(; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				callback(this.getPixelInside(x, y), x, y, this);
			}
		}
	}
	
	/**
	 * ImgFIRMatrix を使用して畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @returns {undefined}
	 */
	convolution(matrix) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してバイラテラルフィルタ的な畳込みを行う
	 * 対象の色に近いほど、フィルタをかける処理となる
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	convolutionBilateral(matrix, p) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(p === undefined) {
			p = 0.8;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		// -0.010 - -0.001
		const rate = - (1.0 - p) * 0.01 - 0.001;
		const exptable = [];
		for(x = 0; x < 256 * 3; x++) {
			exptable[x] = Math.exp(x * x * rate);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				const thiscolor = bufferimage.getPixel(x, y);
				const thisalpha = thiscolor.getBlendAlpha();
				let sumfilter = 0;
				let newcolor  = zero_color;
				const m2 = [];
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					m2[my] = [];
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const tgtcolor = bufferimage.getPixel(fx, fy);
						if(!tgtcolor) {
							continue;
						}
						const newfilter = exptable[Math.floor(tgtcolor.normColor(thiscolor, ImgColor.NORM_MODE.EUGRID))] * m[my][mx];
						newcolor = newcolor.addColor(tgtcolor.mul(newfilter));
						sumfilter += newfilter;
					}
				}
				newcolor = newcolor.div(sumfilter).setBlendAlpha(thisalpha);
				this.setPixelInside(x, y, newcolor);
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用して指数関数空間で畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {number} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	convolutionExp(matrix, e) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		if(e === undefined) {
			e = 1.2;
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		const exptable = [];
		for(x = 0; x < 256; x++) {
			exptable[x] = Math.pow(e, x);
		}
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.table(exptable).mul(m[my][mx]));
						}
					}
				}
				this.setPixelInside(x, y, newcolor.baselog(e));
			}
		}
	}

	/**
	 * ImgFIRMatrix を使用してアンシャープ畳込みを行う
	 * @param {ImgFIRMatrix} matrix
	 * @param {type} rate
	 * @returns {undefined}
	 */
	convolutionUnSharp(matrix, rate) {
		if(!(matrix instanceof ImgFIRMatrix)) {
			throw "IllegalArgumentException";
		}
		let x, y, fx, fy, mx, my;
		const fx_offset	= - (matrix.width  >> 1);
		const fy_offset	= - (matrix.height >> 1);
		const m			= matrix.matrix;
		const zero_color  = this.getPixelInside(0, 0).zero();
		const bufferimage = this.clone();
		for(y = 0; y < this.height; y++) {
			for(x = 0; x < this.width; x++) {
				let newcolor = zero_color;
				fy = y + fy_offset;
				for(my = 0; my < matrix.height; my++, fy++) {
					fx = x + fx_offset;
					for(mx = 0; mx < matrix.width; mx++, fx++) {
						const color = bufferimage.getPixel(fx, fy);
						if(color) {
							newcolor = newcolor.addColor(color.mul(m[my][mx]));
						}
					}
				}
				const thiscolor = bufferimage.getPixel(x, y);
				const deltaColor = thiscolor.subColor(newcolor).mul(rate);
				this.setPixelInside(x, y, thiscolor.addColor(deltaColor));
			}
		}
	}

	/**
	 * シャープフィルタ
	 * @param {number} power 強度
	 * @returns {undefined}
	 */
	filterSharp(power) {
		const m = ImgFIRMatrix.makeSharpenFilter(power);
		this.convolution(m);
	}

	/**
	 * ブラーフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterBlur(n) {
		let m;
		m = ImgFIRMatrix.makeBlur(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeBlur(1, n);
		this.convolution(m);
	}

	/**
	 * ガウシアンフィルタ
	 * @param {number} n 口径
	 * @returns {undefined}
	 */
	filterGaussian(n) {
		let m;
		m = ImgFIRMatrix.makeGaussianFilter(n, 1);
		this.convolution(m);
		m = ImgFIRMatrix.makeGaussianFilter(1, n);
		this.convolution(m);
	}

	/**
	 * アンシャープ
	 * @param {number} n 口径
	 * @param {number} rate
	 * @returns {undefined}
	 */
	filterUnSharp(n, rate) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionUnSharp(m, rate);
	}

	/**
	 * バイラテラルフィルタ
	 * @param {number} n 口径
	 * @param {number} p 0.0～1.0 強度
	 * @returns {undefined}
	 */
	filterBilateral(n, p) {
		const m = ImgFIRMatrix.makeGaussianFilter(n, n);
		this.convolutionBilateral(m, p);
	}

	/**
	 * レンズフィルタ
	 * @param {type} n 口径
	 * @param {type} e 底(1.01-1.2)
	 * @returns {undefined}
	 */
	filterSoftLens(n, e) {
		const m = ImgFIRMatrix.makeCircle(n);
		this.convolutionExp(m, e);
	}
	
}

ImgData.MODE_WRAP	= ImgWrap.MODE;
ImgData.MODE_IP		= ImgInterpolation.MODE;
ImgData.MODE_BLEND	= ImgBlend.MODE;
