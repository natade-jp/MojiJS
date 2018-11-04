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

class File {

	constructor(pathname) {
		this.pathname = pathname.replace(/\\/g, "/" );
	}

	getAbsolutePath() {
		if(/$http/.test(this.pathname)) {
			return this.pathname;
		}
		let name = window.location.toString();
		if(!(/\/$/.test(name))) {
			name = name.match(/.*\//)[0];
		}
		const namelist = this.pathname.split("/");
		for(let i = 0; i < namelist.length; i++) {
			if((namelist[i] === "") || (namelist[i] === ".")) {
				continue;
			}
			if(namelist[i] === "..") {
				name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
				continue;
			}
			name += namelist[i];
			if(i !== namelist.length - 1) {
				name += "/";
			}
		}
		return name;
	}

	getParent() {
		const x = this.getAbsolutePath().match(/.*\//)[0];
		return(x.substring(0 ,x.length - 1));
	}
}

const S3MeshLoaderMQO = {

	name : "MQO",

	/**
	 * メタセコイア形式で入力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		let mqofile = null;
		let parent_dir = "./";
		if(url) {
			mqofile = new File(url);
			parent_dir = mqofile.getParent() + "/";
		}
		
		const lines = text.split("\n");
		const block_stack = [];
		let block_type  = "none";
		let block_level = 0;
		let vertex_offset	= 0;
		let vertex_point	= 0;
		let face_offset		= 0;
		let face_point		= 0;
		// 半角スペース区切りにの文字列数値を、数値型配列にする
		const toNumberArray = function(text) {
			const x = text.split(" "), out = [];
			for(let i = 0; i < x.length; i++) {
				out[i] = parseFloat(x[i]);
			}
			return out;
		};
		// func(XXX) のXXXの中身を抜き出す
		const getValueFromPrm = function(text, parameter) {
			const x = text.split(" " + parameter + "(");
			if(x.length === 1) {
				return [];
			}
			return x[1].split(")")[0];
		};
		// func(XXX) のXXXの中を抜き出して数値化
		const getNumberFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return [];
			}
			return toNumberArray(value);
		};
		// func(XXX) のXXXの中を抜き出して文字列取得
		const getURLFromPrm = function(text, parameter) {
			const value = getValueFromPrm(text, parameter);
			if(value.length === 0) {
				return null;
			}
			const x = value.split("\"");
			if(x.length !== 3) {
				return null;
			}
			return x[1];
		};
		for(let i = 0;i < lines.length; i++) {
			const trim_line = lines[i].replace(/^\s+|\s+$/g, "");
			const first = trim_line.split(" ")[0];
			if ( trim_line.indexOf("{") !== -1) {
				if(first === "Object") {
					vertex_offset	+= vertex_point;
					face_offset		+= face_point;
					vertex_point	= 0;
					face_point		= 0;
				}
				// 階層に入る前の位置を保存
				block_stack.push(block_type);
				block_type = first;
				block_level++;
				continue;
			}
			else if( trim_line.indexOf("}") !== -1) {
				block_type = block_stack.pop();
				block_level--;
				continue;
			}
			if(	(block_type === "Thumbnail") || 
				(block_type === "none")) {
				continue;
			}
			if(block_type === "Material") {
				const material_name = first.replace(/"/g, "");
				const material = sys.createMaterial();
				material.setName(material_name);
				let val;
				val = getNumberFromPrm(trim_line, "col");
				if(val.length !== 0) {
					material.setColor(new S3Vector(val[0], val[1], val[2], val[3]));
				}
				val = getNumberFromPrm(trim_line, "dif");
				if(val.length !== 0) {
					material.setDiffuse(val[0]);
				}
				val = getNumberFromPrm(trim_line, "amb");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "amb_col");
				if(val.length !== 0) {
					material.setAmbient(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "emi");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "emi_col");
				if(val.length !== 0) {
					material.setEmission(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "spc");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[0], val[0]));
				}
				val = getNumberFromPrm(trim_line, "spc_col");
				if(val.length !== 0) {
					material.setSpecular(new S3Vector(val[0], val[1], val[2]));
				}
				val = getNumberFromPrm(trim_line, "power");
				if(val.length !== 0) {
					material.setPower(val[0]);
				}
				val = getNumberFromPrm(trim_line, "reflect");
				if(val.length !== 0) {
					material.setReflect(val[0]);
				}
				val = getURLFromPrm(trim_line, "tex");
				if(val) {
					material.setTextureColor(parent_dir + val);
				}
				val = getURLFromPrm(trim_line, "bump");
				if(val) {
					material.setTextureNormal(parent_dir + val);
				}
				mesh.addMaterial(material);
			}
			else if(block_type === "vertex") {
				const words = toNumberArray(trim_line);
				const vector = new S3Vector(words[0], words[1], words[2]);
				const vertex = sys.createVertex(vector);
				mesh.addVertex(vertex);
				vertex_point++;
			}
			else if(block_type === "face") {
				const facenum = parseInt(first);
				const v		= getNumberFromPrm(trim_line, "V");
				const uv_a	= getNumberFromPrm(trim_line, "UV");
				const uv		= [];
				let material= getNumberFromPrm(trim_line, "M");
				material = (material.length === 0) ? 0 : material[0];
				if(uv_a.length !== 0) {
					for(let j = 0; j < facenum; j++) {
						uv[j] = new S3Vector( uv_a[j * 2], uv_a[j * 2 + 1], 0);
					}
				}
				for(let j = 0;j < facenum - 2; j++) {
					const ti = ((j % 2) === 0) ? 
						sys.createTriangleIndex(j    , j + 1, j + 2, v, material, uv)
						:sys.createTriangleIndex(j - 1, j + 1, j + 2, v, material, uv);
					mesh.addTriangleIndex(ti);
					face_point++;
				}
			}
		}
		return true;
	},

	/**
	 * メタセコイア形式で出力
	 * ただしある程度手動で修正しないといけません。
	 * @param {S3Mesh} mesh
	 * @returns {String}
	 */
	output : function(mesh) {
		const output = [];
		const vertex			= mesh.getVertexArray(); 
		const triangleindex	= mesh.getTriangleIndexArray(); 
		const material		= mesh.getMaterialArray();
		
		// 材質の出力
		output.push("Material " + material.length + " {");
		for(let i = 0; i < material.length; i++) {
			const mv = material[i];
			//  こんな感じにする必要がある・・・
			// "mat" shader(3) col(1.000 1.000 1.000 0.138) dif(0.213) amb(0.884) emi(0.301) spc(0.141) power(38.75) amb_col(1.000 0.996 0.000) emi_col(1.000 0.000 0.016) spc_col(0.090 0.000 1.000) reflect(0.338) refract(2.450)
			output.push("\t\"" + mv.name + "\" col(1.000 1.000 1.000 1.000) dif(0.800) amb(0.600) emi(0.000) spc(0.000) power(5.00)");
		}
		output.push("}");
		
		// オブジェクトの出力
		output.push("Object \"obj1\" {");
		{
			// 頂点の出力
			output.push("\tvertex " + vertex.length + " {");
			for(let i = 0; i < vertex.length; i++) {
				const vp = vertex[i].position;
				output.push("\t\t" + vp.x + " " + vp.y + " " + vp.z);
			}
			output.push("}");

			// 面の定義
			output.push("\tface " + triangleindex.length + " {");
			for(let i = 0; i < triangleindex.length; i++) {
				const ti = triangleindex[i];
				let line = "\t\t3";
				// 座標と材質は必ずある
				line += " V(" + ti.index[0] + " " + ti.index[1] + " " + ti.index[2] + ")";
				line += " M(" + ti.materialIndex + ")";
				// UVはないかもしれないので、条件を付ける
				if((ti.uv !== undefined) && (ti.uv[0] !== null)) {
					line += " UV(" + ti.uv[0] + " " + ti.uv[1] + " " + ti.uv[2] +")";
				}
				output.push(line);
			}
		}
		output.push("\t}");
		
		output.push("}");
		return output.join("\n");
	}

};

export default S3MeshLoaderMQO;
