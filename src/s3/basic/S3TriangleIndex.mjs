/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vector from "../math/S3Vector.mjs";

export default class S3TriangleIndex {

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex
	 * @param {Array} uvlist S3Vector Array
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this._init(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	/**
	 * ABCの頂点を囲む3角ポリゴン (immutable)
	 * @param {Number} i1 配列の番号A
	 * @param {Number} i2 配列の番号B
	 * @param {Number} i3 配列の番号C
	 * @param {Array} indexlist Index Array
	 * @param {Number} materialIndex 負の場合や未定義の場合は 0 とします。
	 * @param {Array} uvlist S3Vector Array
	 */
	_init(i1, i2, i3, indexlist, materialIndex, uvlist) {
		this.index				= null;		// 各頂点を示すインデックスリスト
		this.uv					= null;		// 各頂点のUV座標
		this.materialIndex		= null;		// 面の材質
		if((indexlist instanceof Array) && (indexlist.length > 0)) {
			this.index = [indexlist[i1], indexlist[i2], indexlist[i3]];
		}
		else {
			throw "IllegalArgumentException";
		}
		if((uvlist !== undefined) && (uvlist instanceof Array) && (uvlist.length > 0) && (uvlist[0] instanceof S3Vector)) {
			this.uv = [uvlist[i1], uvlist[i2], uvlist[i3]];
		}
		else {
			this.uv = [null, null, null];
		}
		materialIndex = materialIndex      ? materialIndex : 0;
		materialIndex = materialIndex >= 0 ? materialIndex : 0;
		this.materialIndex = materialIndex;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 0, 1, 2, this.index, this.materialIndex, this.uv );
	}
	
	inverseTriangle(Instance) {
		if(!Instance) {
			Instance = S3TriangleIndex;
		}
		return new Instance( 2, 1, 0, this.index, this.materialIndex, this.uv );
	}

}
