/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vertex from "../basic/S3Vertex.js";
import S3GLArray from "./S3GLArray.js";

export default class S3GLVertex extends S3Vertex {

	constructor(position) {
		super(position);
	}
	
	clone() {
		return super.clone(S3GLVertex);
	}

	getGLHash() {
		return this.position.toString(3);
	}
	
	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLVertex型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @returns {頂点データ（座標、法線情報）}
	 */
	getGLData() {
		return {
			vertexPosition	: new S3GLArray(this.position, 3, S3GLArray.datatype.Float32Array)
		};
	}
	
}