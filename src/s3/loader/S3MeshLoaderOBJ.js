/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vector from "../math/S3Vector.js";

const S3MeshLoaderOBJ = {

	name : "OBJ",

	/**
	 * Wavefront OBJ形式で入力
	 * v 頂点
	 * vt テクスチャ
	 * vn テクスチャ 
	 * f 面
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		const trim = function(str) {
			return(str.replace(/^\s+|\s+$/g, ""));
		};
		
		// 文字列解析
		const lines = text.split("\n");
		const v_list = [];
		const vt_list = [];
		const vn_list = [];
		const face_v_list = [];
		const face_vt_list = [];
		const face_vn_list = [];
		for(let i = 0; i < lines.length; i++) {
			// コメントより前の文字を取得
			const line = trim(lines[i].split("#")[0]);
			
			if(line.length === 0) {
				// 空白なら何もしない
				continue;
			}
			
			const data = line.split(" ");
			if(data[0] === "v") {
				// vertex
				const v = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				v_list.push(v);
			}
			else if(data[1] === "vt") {
				// texture
				const vt = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				vt_list.push(vt);
				
			}
			else if(data[2] === "vn") {
				// normal
				const vn = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				vn_list.push(vn);
			}
			else if(data[0] === "f") {
				// face
				const vcount = data.length - 3; // 繰り返す回数
				for(let j = 0;j < vcount; j++) {
					const fdata = [];
					if((j % 2) === 0) {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					else {
						fdata[0] = data[1 + j];
						fdata[1] = data[1 + j + 1];
						fdata[2] = data[1 + j + 2];
					}
					const face_v = [];
					const face_vt = [];
					const face_vn = [];
					// 数字は1から始まるので、1を引く
					for(let k = 0;k < 3; k++) {
						const indexdata = fdata[k].split("/");
						if(indexdata.length === 1) {
							// 頂点インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
						}
						else if(indexdata.length === 2) {
							// 頂点テクスチャ座標インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
							face_vt[k]	= parseInt(indexdata[1], 10) - 1;
						}
						else if(indexdata.length === 3) {
							if(indexdata[1].length !== 0) {
								// 頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= parseInt(indexdata[1], 10) - 1;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
							else {
								// テクスチャ座標インデックス無しの頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= null;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
						}
					}
					face_v_list.push(face_v);
					face_vt_list.push(face_vt);
					face_vn_list.push(face_vn);
				}
			}
		}
		
		// 変換
		// マテリアルの保存
		const material = sys.createMaterial();
		mesh.addMaterial(material);
		// 頂点の保存
		for(let i = 0; i < v_list.length; i++) {
			const vertex = sys.createVertex(v_list[i]);
			mesh.addVertex(vertex);
		}
		// インデックスの保存
		for(let i = 0; i < face_v_list.length; i++) {
			const triangle = sys.createTriangleIndex(0, 1, 2, face_v_list[i], 0);
			mesh.addTriangleIndex(triangle);
		}
		
		return true;
	}
};

export default S3MeshLoaderOBJ;
