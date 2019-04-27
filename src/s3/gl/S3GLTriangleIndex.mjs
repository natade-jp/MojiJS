/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3TriangleIndex from "../basic/S3TriangleIndex.mjs";
import S3GLTriangleIndexData from "./S3GLTriangleIndexData.mjs";

export default class S3GLTriangleIndex extends S3TriangleIndex {
	
	/**
	 * 3つの頂点を持つポリゴン情報にデータ取得用のメソッドを拡張
	 * @param {Number} i1 
	 * @param {Number} i2 
	 * @param {Number} i3 
	 * @param {Array} indexlist 
	 * @param {Array} materialIndex 
	 * @param {Array} uvlist 
	 */
	constructor(i1, i2, i3, indexlist, materialIndex, uvlist) {
		super(i1, i2, i3, indexlist, materialIndex, uvlist);
	}

	clone() {
		return super.clone(S3GLTriangleIndex);
	}
	
	inverseTriangle() {
		return super.inverseTriangle(S3GLTriangleIndex);
	}

	createGLTriangleIndexData() {
		return new S3GLTriangleIndexData(this);
	}	
}
