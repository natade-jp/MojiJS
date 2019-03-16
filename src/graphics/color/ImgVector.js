/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgColorRGBA from "./ImgColorRGBA.js";

export default class ImgVector {
		
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	/**
	 * クロス積
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	cross(tgt) {
		return new ImgVector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x
		);
	}

	/**
	 * ターゲットへのベクトル
	 * @param {ImgVector} tgt
	 * @returns {ImgVector}
	 */
	getDirection(tgt) {
		return new ImgVector(
			tgt.x - this.x,
			tgt.y - this.y,
			tgt.z - this.z
		);
	}

	/**
	 * ターゲットへの方向ベクトル
	 * @returns {ImgVector}
	 */
	normalize() {
		let b = this.x * this.x + this.y * this.y + this.z * this.z;
		b = Math.sqrt(1.0 / b);
		return new ImgVector(
			this.x * b,
			this.y * b,
			this.z * b
		);
	}

	/**
	 * 方向ベクトルから、RGBの画素へ変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @returns {ImgColorRGBA}
	 */
	getNormalMapColor() {
		return new ImgColorRGBA([
			Math.round((1.0 + this.x) * 127.5),
			Math.round((1.0 - this.y) * 127.5),
			Math.round((1.0 + this.z) * 127.5),
			255
		]);
	}
	
	/**
	 * RGBの画素から方向ベクトルへの変換
	 * 右がX+,U+、下がY+,V+としたとき、RGB＝（+X, -Y, +Z）系とします。
	 * @param {ImgColorRGBA} rgbcolor
	 * @returns {ImgVector}
	 */
	static createNormalVector(rgbcolor) {
		if(!(rgbcolor instanceof ImgColorRGBA)) {
			throw "not ImgColorRGBA";
		}
		return new ImgVector(
			(rgbcolor.r / 128.0) - 1.0,
			- (rgbcolor.g / 128.0) + 1.0,
			(rgbcolor.b / 128.0) - 1.0
		);
	}

}
