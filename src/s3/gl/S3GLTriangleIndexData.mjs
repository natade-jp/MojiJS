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
import S3GLArray from "./S3GLArray.mjs";

export default class S3GLTriangleIndexData {
	
	constructor(triangle_index) {
		this.index				= triangle_index.index;				// 各頂点を示すインデックスリスト
		this.materialIndex		= triangle_index.materialIndex;		// 面の材質
		this.uv					= triangle_index.uv;				// 各頂点のUV座標
		this._isEnabledTexture	= triangle_index.uv[0] !== null;	// UV情報があるか
		
		this.face				= {};
		this.vertex				= {};
		// S3Vector.getTangentVectorの取得値を格納用
		this.face.normal		= null;							// 面の法線情報
		this.face.tangent		= null;							// 面の接線情報
		this.face.binormal		= null;							// 面の従法線情報
		this.vertex.normal		= [null, null, null];			// 頂点ごとの法線
		this.vertex.tangent		= [null, null, null];			// 頂点ごとの接線 
		this.vertex.binormal	= [null, null, null];			// 頂点ごとの従法線 
	}

	getGLHash(number, vertexList) {
		const uvdata = this._isEnabledTexture ? this.uv[number].toString(2) + this.face.binormal.toString(2) + this.face.tangent.toString(2): "";
		const vertex   = vertexList[this.index[number]].getGLHash();
		return vertex + this.materialIndex + uvdata + this.vertex.normal[number].toString(3);
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * @param {Integer} number 三角形の何番目の頂点データを取得するか
	 * @param {S3Vertex[]} vertexList 頂点の配列
	 * @returns {頂点データ（座標、素材番号、UV値が入っている）}
	 */
	getGLData(number, vertexList) {
		const vertex		= {};
		const vertexdata_list = vertexList[this.index[number]].getGLData();
		for(const key in vertexdata_list) {
			vertex[key]	= vertexdata_list[key];
		}
		const uvdata = this._isEnabledTexture ? this.uv[number] : new S3Vector(0.0, 0.0);
		vertex.vertexTextureCoord	= new S3GLArray(uvdata, 2, S3GLArray.datatype.Float32Array);
		vertex.vertexMaterialFloat	= new S3GLArray(this.materialIndex, 1, S3GLArray.datatype.Float32Array);
		vertex.vertexNormal			= new S3GLArray(this.vertex.normal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexBinormal		= new S3GLArray(this.vertex.binormal[number], 3, S3GLArray.datatype.Float32Array);
		vertex.vertexTangent		= new S3GLArray(this.vertex.tangent[number], 3, S3GLArray.datatype.Float32Array);
		return vertex;
	}

}
