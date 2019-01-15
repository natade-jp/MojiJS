/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Vector from "../math/S3Vector.js";

const DefaultMaterial = {
	name : "s3default",
	color		:new S3Vector(1.0, 1.0, 1.0, 1.0),	// 拡散反射の色
	diffuse	: 0.8,									// 拡散反射の強さ
	emission	: new S3Vector(0.0, 0.0, 0.0),		// 自己照明（輝き）
	specular	: new S3Vector(0.0, 0.0, 0.0),		// 鏡面反射の色
	power		: 5.0,								// 鏡面反射の強さ
	ambient	: new S3Vector(0.6, 0.6, 0.6),			// 光によらない初期色
	reflect	: 0.0,									// 環境マッピングによる反射の強さ
	textureColor	: null,
	textureNormal	: null
};

/*
	次のようなデータを入出力できます。
	const sample = {
		Indexes:{
			body:[
				[ 0, 1, 2],
				[ 3, 1, 0],
				[ 3, 0, 2],
				[ 3, 2, 1]
			]
		},
		Vertices:[
			[  0,  0,  -5],
			[  0, 20,  -5],
			[ 10,  0,  -5],
			[  0,  0, -20]
		]
	};
*/

const S3MeshLoaderJSON = {

	name : "JSON",

	input : function(sys, mesh, json) {
		let meshdata;
		if((typeof json === "string")||(json instanceof String)) {
			meshdata = JSON.parse(json);
		}
		else {
			meshdata = json;
		}
		let material = 0;
		// 材質名とインデックスを取得
		for(const materialname in meshdata.Indexes) {
			mesh.addMaterial(sys.createMaterial(materialname));
			const materialindexlist = meshdata.Indexes[materialname];
			for(let i = 0; i < materialindexlist.length; i++) {
				const list = materialindexlist[i];
				for(let j = 0; j < list.length - 2; j++) {
					// 3角形と4角形に対応
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, list, material)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, list, material);
					mesh.addTriangleIndex(ti);
				}
			}
			material++;
		}
		// 頂点座標を取得
		for(let i = 0; i < meshdata.Vertices.length; i++) {
			const vector = new S3Vector(meshdata.Vertices[i][0], meshdata.Vertices[i][1], meshdata.Vertices[i][2]);
			const vertex = sys.createVertex(vector);
			mesh.addVertex(vertex);
		}
		return true;
	},

	output : function(mesh) {
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		const material_vertexlist = [];
		const material_length = material.length !== 0 ? material.length : 1;
		const default_material = DefaultMaterial;
		// 材質リストを取得
		for(let i = 0; i < material_length; i++) {
			material_vertexlist[i] = {
				material: material[i] ? material[i] : default_material ,
				list:[]
			};
		}
		// 材質名に合わせて、インデックスリストを取得
		for(let i = 0; i < triangleindex.length; i++) {
			const ti = triangleindex[i];
			material_vertexlist[ti.materialIndex].list.push( ti.index );
		}
		const output = [];
		output.push("{");
		output.push("\tIndexes:{");
		for(let i = 0; i < material_vertexlist.length; i++) {
			const mv = material_vertexlist[i];
			output.push("\t\t" + mv.material.name + ":[");
			for(let j = 0; j < mv.list.length; j++) {
				const vi = mv.list[j];
				output.push("\t\t\t[" + vi[0] + " " + vi[1] + " " + vi[2] + "]" + ((j === mv.list.length - 1) ? "" : ",") );
			}
			output.push("\t\t]" + ((i === material_vertexlist.length - 1) ? "" : ",") );
		}
		output.push("\t},");
		output.push("\tVertices:[");
		for(let i = 0; i < vertex.length; i++) {
			const vp = vertex[i].position;
			output.push("\t\t[" + vp.x + " " + vp.y + " " + vp.z + "]" + ((vp === vertex.length - 1) ? "" : ",") );
		}
		output.push("\t]");
		output.push("}");
		return(output.join("\n"));
	}
};

export default S3MeshLoaderJSON;
