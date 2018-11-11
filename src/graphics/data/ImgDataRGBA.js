/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import ImgColor from "../color/ImgColor.js";
import ImgColorRGBA from "../color/ImgColorRGBA.js";
import ImgData from "./ImgData.js";
import ImgDataY from "./ImgDataY.js";

export default class ImgDataRGBA extends ImgData {
		
	constructor() {
		if(arguments.length === 1) {
			super(arguments[0]);
		}
		else if(arguments.length === 2) {
			super(arguments[0], arguments[1]);
		}
		else {
			super();
		}
	}
	
	clone() {
		const x = new ImgDataRGBA(this.width, this.height);
		this._copyData(x);
		return x;
	}
	
	setSize(width, height) {
		super.setSize(width, height);
		this.data	= new Uint8ClampedArray(this.width * this.height * 4);
	}
	
	getPixelInside(x, y) {
		const p = (y * this.width + x) * 4;
		const c = new ImgColorRGBA([
			this.data[p],
			this.data[p + 1],
			this.data[p + 2],
			this.data[p + 3]
		]);
		return c;
	}

	setPixelInside(x, y, color) {
		const p = (y * this.width + x) * 4;
		this.data[p]     = color.getColor()[0];
		this.data[p + 1] = color.getColor()[1];
		this.data[p + 2] = color.getColor()[2];
		this.data[p + 3] = color.getColor()[3];
	}
	
	putDataY(imagedata, n) {
		if(!(imagedata instanceof ImgDataY)) {
			throw "IllegalArgumentException";
		}
		this.setSize(imagedata.width, imagedata.height);
		if(n === undefined) {
			n = 0;
		}
		let p = 0, i = 0;
		for(; i < imagedata.data.length; i++) {
			this.data[p + n] = Math.floor(imagedata.data[i]);
			p += 4;
		}
	}
	
	putDataYToR(imagedata) {
		this.putDataS(imagedata, 0);
	}
	
	putDataYToG(imagedata) {
		this.putDataS(imagedata, 1);
	}
	
	putDataYToB(imagedata) {
		this.putDataS(imagedata, 2);
	}
	
	putDataYToA(imagedata) {
		this.putDataS(imagedata, 3);
	}
	
	putImageData(imagedata) {
		if(	(imagedata instanceof ImageData) ||
			(imagedata instanceof ImgDataRGBA)) {
			this.setSize(imagedata.width, imagedata.height);
			this.data.set(imagedata.data);
		}
		else if(imagedata instanceof ImgDataY) {
			this.putImageData(imagedata.getImageData());
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	getImageData() {
		const canvas = document.createElement("canvas");
		canvas.width  = this.width;
		canvas.height = this.height;
		const context = canvas.getContext("2d");
		const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
		imagedata.data.set(this.data);
		return imagedata;
	}
	
	grayscale() {
		this.forEach(function(color, x, y, data) {
			const luminance = ~~color.luminance();
			const newcolor = new ImgColorRGBA( [luminance, luminance, luminance, color.rgba[3]] );
			data.setPixelInside(x, y, newcolor);
		});
	}
	
	/**
	 * 使用している色数を取得します
	 * ※透過色はカウントしません
	 * @returns {Number}
	 */
	getColorCount() {
		// 色を記録する領域
		// 0x200000 = 256 * 256 * 256 / 8 = 2097152
		const sw = new Uint8ClampedArray(0x200000);
		let count = 0;
		this.forEach(function(color) {
			const rrggbb = color.getRRGGBB();
			const p1 = rrggbb >> 3; // x / 8
			const p2 = rrggbb  % 7; // x & 8
			if(((sw[p1] >> p2) & 1) === 0) {
				count++;
				sw[p1] = (sw[p1] ^ (1 << p2)) & 0xFF;
			}
		});
		return count;
	}

	/**
	 * メディアンカットで減色後のパレットを取得します。
	 * @param {Number} colors 色の数
	 * @returns {}
	 */
	getPalletMedianCut(colors) {
		if(this.getColorCount()<=colors){
			return(null);
		}
		let i;
		let r, g, b;

		// 減色に用いる解像度
		const bit = 7;

		// 含まれる色数
		const color = new Uint32Array((1<<bit)*(1<<bit)*(1<<bit));

		// 現在の色数
		let colorcnt = 0;

		// 色から指定した解像度のrrggbb値を返す
		const RGBtoPositionForColor = function(color) {
			const r = color.getRed();
			const g = color.getGreen();
			const b = color.getBlue();
			return ((r>>(8-bit))<<(bit*2))|((g>>(8-bit))<<bit)|(b>>(8-bit));
		};

		// 0区切り目の初期値を計算する
		// それぞれの区切り幅に含まれた色数、及び区切り幅の最大値と最小値
		// R = 0, G = 1, B = 2 の位置とする
		const color_cnt = [];	
		const color_max = [[], [], []];
		const color_min = [[], [], []];
		// 色数は全画素
		color_cnt[0] = this.width * this.height;
		// 色の幅も最小から最大までとる
		for(i = 0; i < 3; i++) {
			color_min[i][colorcnt] = 0;					//bit最小値
			color_max[i][colorcnt] = (1 << bit) - 1;	//bit最大値
		}

		// あらかじめ各色が何画素含まれているかを調査する
		this.forEach(function(targetcolor) {
			color[RGBtoPositionForColor(targetcolor)]++;
		});

		// 色の幅
		let r_delta, g_delta, b_delta;
		// 色の最大幅
		let max_r_delta, max_g_delta, max_b_delta;
		// 区切った回数
		let kugiri;

		// ここからアルゴリズム頑張った……！

		colorcnt++;
		for(kugiri = 1; colorcnt < colors ;) {

			//区切る場所(R・G・Bのどれを区切るか)を大雑把に決める
			//基準は体積
			let max_volume = 0, tgt = 0;
			for(i = 0; i < kugiri; i++) {
				r_delta = color_max[0][i] - color_min[0][i];
				g_delta = color_max[1][i] - color_min[1][i];
				b_delta = color_max[2][i] - color_min[2][i];
				const this_volume = r_delta * g_delta * b_delta;
				if(max_volume < this_volume) {
					max_volume = this_volume;
					max_r_delta = r_delta;
					max_g_delta = g_delta;
					max_b_delta = b_delta;
					tgt = i;
				}
			}

			//その立方体のうちどの次元を区切るか大雑把に決める
			//基準は幅
			let max_delta = max_g_delta; // 緑を優先して区切る
			let tgt_col = 1;
			if(max_delta < max_r_delta) {
				max_delta = max_r_delta;
				tgt_col = 0;
			}
			if(max_delta < max_b_delta) {
				max_delta = max_b_delta;
				tgt_col = 2;
			}

			// それ以上区切れなかった場合は終了
			if(max_delta === 0) {
				break;
			}

			// tgt の範囲を
			// tgt_col  の次元の中央で区切る
			{
				//区切る位置を調べる(色数の中心)
				const point = color_min[tgt_col][tgt] + (max_delta >> 1); //実際の中心
				//
				//新しく区切った範囲を作成
				if(point === color_max[tgt_col][tgt]) {
					color_min[tgt_col][kugiri] = point;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point - 1;
				}
				else {
					color_min[tgt_col][kugiri] = point + 1;
					color_max[tgt_col][kugiri] = color_max[tgt_col][tgt];
					color_max[tgt_col][tgt]   = point;
				}

				//その他の範囲は受け継ぐ
				for( i=0;i < 3;i++){
					if(i === tgt_col) {
						continue;
					}
					color_min[i][kugiri] = color_min[i][tgt];
					color_max[i][kugiri] = color_max[i][tgt];
				}
			}

			// 新しく区切った範囲に対して、含まれる色の画素数を計算しなおす
			color_cnt[kugiri] = 0;
			for( r = color_min[0][kugiri];r <= color_max[0][kugiri];r++) {
				for( g = color_min[1][kugiri];g <= color_max[1][kugiri];g++) {
					for( b = color_min[2][kugiri];b <= color_max[2][kugiri];b++) {
						color_cnt[kugiri] += color[(r<<(bit<<1))|(g<<bit)|b];
					}
				}
			}
			color_cnt[tgt] -= color_cnt[kugiri];

			// 新しく区切った先に画素が入って、区切り元の画素数がなくなった場合
			if(color_cnt[tgt] === 0) {
				// 区切った先のデータを、区切り元にコピーして、
				// 区切ったことをなかったことにする
				color_cnt[tgt] = color_cnt[kugiri];
				for(i = 0; i < 3; i++){
					color_min[i][tgt] = color_min[i][kugiri];
					color_max[i][tgt] = color_max[i][kugiri];
				}
			}
			// せっかく区切ったが、区切った先の画素数が0だった
			else if(color_cnt[kugiri] === 0) {
				// falls through
			}
			//色が両方とも分別できた場合
			else {
				kugiri++;
				colorcnt++;
			}
		}

		// 作成するパレット
		const pallet = [];

		//パレットを作る
		for(i = 0; i < colorcnt; i++) {
			//色数 × 色
			let avr_r = 0;
			let avr_g = 0;
			let avr_b = 0;
			for(r = color_min[0][i];r <= color_max[0][i];r++) {
				for(g = color_min[1][i];g <= color_max[1][i];g++) {
					for(b = color_min[2][i];b <= color_max[2][i];b++) {
						const color_sum = color[(r<<(bit<<1))|(g<<bit)|b];
						avr_r += color_sum * (r << (8-bit));
						avr_g += color_sum * (g << (8-bit));
						avr_b += color_sum * (b << (8-bit));
					}
				}
			}
			//平均を取る
			r = Math.round(avr_r / color_cnt[i]);
			g = Math.round(avr_g / color_cnt[i]);
			b = Math.round(avr_b / color_cnt[i]);
			r = r < 0 ? 0 : r > 255 ? 255 : r;
			g = g < 0 ? 0 : g > 255 ? 255 : g;
			b = b < 0 ? 0 : b > 255 ? 255 : b;

			//COLORREF 型で代入
			pallet[i] = new ImgColorRGBA([r, g, b, 255]);
		}

		return pallet;
	}

	/**
	 * 使用されている色のパレットを取得します。
	 * 最大256色まで取得します。
	 * @returns {Array|ImgData.getPallet.pallet}
	 */
	getPallet() {
		const pallet = [];
		const rrggbb_array = new Uint32Array(256);
		let count = 0;
		let i = 0;
		this.forEach(function(color) {
			if(count > 255) {
				return;
			}
			const rrggbb = color.getRRGGBB();
			for(i = 0; i < count; i++) {
				if(rrggbb_array[i] === rrggbb) {
					return;
				}
			}
			rrggbb_array[count] = rrggbb;
			pallet[count] = color;
			count++;
		});
		return pallet;
	}

	/**
	 * グレースケールのパレットを取得します。
	 * @param {Number} colors 階調数(2~256)
	 * @returns {}
	 */
	getPalletGrayscale(colors) {
		const n = colors < 2 ? 2 : colors > 256 ? 256 : colors;
		const pallet = [];
		const diff = 255.0 / (n - 1);
		let col = 0.0;
		let i;
		for(i = 0; i < n; i++) {
			let y = Math.round(col);
			y = y < 0 ? 0 : y > 255 ? 255 : y;
			pallet[i] = new ImgColorRGBA([y, y, y, 255]);
			col += diff;
		}
		return pallet;
	}

	/**
	 * パレットを用いて単純減色する
	 * @param {Array} palettes
	 * @returns {undefined}
	 */
	quantizationSimple(palettes) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			data.setPixelInside(x, y, palletcolor.c1.color.exchangeColorAlpha(thiscolor));
		});
	}

	/**
	 * パレットから組織的ディザ法による減色を行います。(Error-diffusion dithering)
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.orderPattern} orderPattern
	 * @param {ImgColor.NORM_MODE} normType
	 * @returns {undefined}
	 */
	quantizationOrdered(palettes, orderPattern, normType) {
		this.forEach(function(thiscolor, x, y, data) {
			const palletcolor = thiscolor.searchColor(palettes, normType);
			const color1 = palletcolor.c1.color;
			const norm1  = palletcolor.c1.norm;
			const color2 = palletcolor.c2.color;
			const norm2  = palletcolor.c2.norm;
			let normsum = norm1 + norm2;
			let sumdiff = 0;
			normsum = normsum === 0 ? 1 : normsum;
			const pattern = orderPattern.pattern[y % orderPattern.height][x % orderPattern.width];
			let newcolor = null;
			if(color1.luminance > color2.luminance) {
				sumdiff = Math.floor((norm2 * orderPattern.maxnumber) / normsum);
				if (pattern <= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			else {
				sumdiff = Math.floor((norm1 * orderPattern.maxnumber) / normsum);
				if (pattern >= sumdiff) {
					newcolor = color1.exchangeColorAlpha(thiscolor); // 1番目に似ている色
				}
				else {
					newcolor = color2.exchangeColorAlpha(thiscolor); // 2番目に似ている色
				}
			}
			data.setPixelInside(x, y, newcolor);
		});
	}

	/**
	 * パレットから誤差拡散法による減色を行います。
	 * @param {Array} palettes
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	quantizationDiffusion(palettes, diffusionPattern) {

		// 誤差拡散するにあたって、0未満や255より大きな値を使用するため
		// 一旦、下記のバッファにうつす
		const pixelcount	= this.width * this.height;
		const color_r		= new Int16Array(pixelcount);
		const color_g		= new Int16Array(pixelcount);
		const color_b		= new Int16Array(pixelcount);

		// 現在の位置
		let point		= 0;
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			color_r[point] = thiscolor.getRed();
			color_g[point] = thiscolor.getGreen();
			color_b[point] = thiscolor.getBlue();
		});

		// 誤差拡散できない右端
		const width_max = this.width - diffusionPattern.width + diffusionPattern.center;

		// パターンを正規化して合計を1にする
		let px, py;
		let pattern_sum = 0;
		for(py = 0; py < diffusionPattern.height; py++) {
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_sum += diffusionPattern.pattern[py][px];
			}
		}
		const pattern_normalize = [];
		for(py = 0; py < diffusionPattern.height; py++) {
			pattern_normalize[py] = [];
			for(px = 0; px < diffusionPattern.width; px++) {
				pattern_normalize[py][px] = diffusionPattern.pattern[py][px] / pattern_sum;
			}
		}

		// 選択処理
		this.forEach(function(thiscolor, x, y, data) {
			point = y * data.width + x;
			const diffcolor = new ImgColorRGBA(
				[color_r[point], color_g[point], color_b[point], 255]
			);
			// 最も近い色を探して
			let palletcolor = diffcolor.searchColor(palettes, ImgColor.NORM_MODE.EUGRID);
			palletcolor = palletcolor.c1.color;
			// 値を設定する
			data.setPixelInside(x, y, palletcolor.exchangeColorAlpha(thiscolor));
			// 右端の近くは誤差分散させられないので拡散しない
			if(x > width_max) {
				return;
			}
			// ここから誤差を求める
			const deltacolor = diffcolor.subColor(palletcolor);
			for(py = 0; py < diffusionPattern.height; py++) {
				px = py === 0 ? diffusionPattern.center : 0;
				for(; px < diffusionPattern.width; px++) {
					const dx = x + px - diffusionPattern.center;
					const dy = y + py;
					// 画面外への拡散を防止する
					if((dx < 0) || (dy >= data.height)){
						continue;
					}
					const dp = dy * data.width + dx;
					color_r[dp] += deltacolor.getRed()   * pattern_normalize[py][px];
					color_g[dp] += deltacolor.getGreen() * pattern_normalize[py][px];
					color_b[dp] += deltacolor.getBlue()  * pattern_normalize[py][px];
				}
			}
		});
	}

	/**
	 * 単純減色
	 * @param {Array} colorcount 減色後の色数
	 * @returns {undefined}
	 */
	filterQuantizationSimple(colorcount) {
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationSimple(pallet);
		}
	}

	/**
	 * 組織的ディザ法による減色
	 * @param {Array} colorcount 減色後の色数
	 * @param {ImgColor.NORM_MODE} normType 
	 * @returns {undefined}
	 */
	filterQuantizationOrdered(colorcount, normType) {
		if(normType === undefined) {
			normType = ImgColor.NORM_MODE.EUGRID;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationOrdered(
				pallet,
				ImgDataRGBA.quantization.orderPattern.patternBayer,
				normType
			);
		}
	}

	/**
	 * 誤差拡散法による減色
	 * @param {Array} colorcount
	 * @param {ImgColorQuantization.diffusionPattern} diffusionPattern
	 * @returns {undefined}
	 */
	filterQuantizationDiffusion(colorcount, diffusionPattern) {
		if(diffusionPattern === undefined) {
			diffusionPattern = ImgDataRGBA.quantization.diffusionPattern.patternFloydSteinberg;
		}
		const count = this.getColorCount();
		if(count > colorcount) {
			const pallet = this.getPalletMedianCut(colorcount);
			this.quantizationDiffusion(
				pallet,
				diffusionPattern
			);
		}
	}
}

ImgDataRGBA.quantization = {
	
	diffusionPattern : {

		/**
		 * 誤差拡散法に用いるFloyd & Steinbergのパターン
		 */
		patternFloydSteinberg : {
			width	: 3,
			height	: 2,
			center	: 1,
			pattern	: [
				[0, 0, 7],
				[3, 5, 1]
			]
		},

		/**
		 * 誤差拡散法に用いるJarvis,Judice & Ninkeのパターン
		 */
		patternJarvisJudiceNinke : {
			width	: 5,
			height	: 3,
			center	: 2,
			pattern	: [
				[0, 0, 0, 7, 5],
				[3, 5, 7, 5, 3],
				[1, 3, 5, 3, 1]
			]
		}
	},

	orderPattern : {
		/**
		 * 組織的ディザ法に用いるBayerのパターン
		 */
		patternBayer : {
			width	: 4,
			height	: 4,
			maxnumber : 16,
			pattern	: [
				[ 0, 8, 2,10],
				[12, 4,14, 6],
				[ 3,11, 1, 9],
				[15, 7,13, 5]
			]
		}
	}
};
