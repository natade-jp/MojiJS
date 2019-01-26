/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class ImgColor {
	
	/**
	 * ImgColor 抽象クラス
	 */
	constructor() {	
	}

	getColor() {
		return null;
	}
	
	clone() {
		return null;
	}
	
	zero() {
		return null;
	}
	
	one() {
		return null;
	}
	
	add() {
		return null;
	}
	
	sub() {
		return null;
	}
	
	mul() {
		return null;
	}
	
	div() {
		return null;
	}
	
	exp() {
		return null;
	}
	
	log() {
		return null;
	}
	
	pow() {
		return null;
	}
	
	baselog() {
		return null;
	}
	
	table() {
		return null;
	}
	
	random() {
		return null;
	}
	
	luminance() {
		return null;
	}
	
	addColor() {
		return null;
	}
	
	subColor() {
		return null;
	}
	
	mulColor() {
		return null;
	}
	
	divColor() {
		return null;
	}
	
	maxColor() {
		return null;
	}
	
	minColor() {
		return null;
	}
	
	norm() {
		return null;
	}
	
	normFast() {
		return null;
	}
	
	normColor(c, normType) {
		return this.subColor(c).norm(normType);
	}
	
	normColorFast(c, normType) {
		return this.subColor(c).normFast(normType);
	}
	
	getBlendAlpha() {
		return null;
	}
	
	setBlendAlpha() {
		return null;
	}
	
	exchangeColorAlpha() {
		return null;
	}
	
	equals() {
		return false;
	}
	
	/**
	 * パレットから最も近い色を2色探します。
	 * @param {Array} palettes
	 * @param {ImgColor.normType} normType
	 * @returns {object}
	 */
	searchColor(palettes, normType) {
		let norm = 0;
		let c1_norm_max	= 0x7fffffff;
		let c1_color	= null;
		let c2_norm_max	= 0x7ffffffe;
		let c2_color	= null;
		for(let i = 0; i < palettes.length; i++) {
			norm = this.normColorFast(palettes[i], normType);
			if(norm < c2_norm_max) {
				if(norm < c1_norm_max) {
					c2_norm_max	= c1_norm_max;
					c2_color	= c1_color;
					c1_norm_max	= norm;
					c1_color	= palettes[i];
				}
				else {
					c2_norm_max	= norm;
					c2_color	= palettes[i];
				}
			}
		}
		return {
			c1 : {
				color : c1_color,
				norm  : c1_norm_max
			},
			c2 : {
				color : c2_color,
				norm  : c2_norm_max
			}
		};
	}
	
}

ImgColor.NORM_MODE = {
	/**
	 * マンハッタン距離を使用する
	 * @type Number
	 */
	MANHATTEN : 0,

	/**
	 * ユーグリッド距離を使用する
	 * @type Number
	 */
	EUGRID : 1
};

