/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Vertex from "./S3Vertex.js";
import S3Material from "./S3Material.js";
import S3TriangleIndex from "./S3TriangleIndex.js";

export default class S3Mesh {
	
	/**
	 * 立体物 (mutable)
	 * @param {S3System} sys
	 * @returns {S3Mesh}
	 */
	constructor(sys) {
		this.sys = sys;
		this._init();
	}
	
	_init() {
		// 変数の準備
		this.src = {};
		this.src.vertex			= [];
		this.src.triangleindex	= [];
		this.src.material		= [];
		this.is_complete	= false;
	}
	
	isComplete() {
		return this.is_complete;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Mesh;
		}
		const mesh = new Instance(this.sys);
		mesh.addVertex(this.getVertexArray());
		mesh.addTriangleIndex(this.getTriangleIndexArray());
		mesh.addMaterial(this.getMaterialArray());
		return mesh;
	}
	
	setComplete(is_complete) {
		this.is_complete = is_complete;
	}
	
	setInverseTriangle(inverse) {
		this.setComplete(false);
		this.is_inverse = inverse; 
	}
	
	getVertexArray() {
		return this.src.vertex;
	}
	
	getTriangleIndexArray() {
		return this.src.triangleindex;
	}
	
	getMaterialArray() {
		return this.src.material;
	}
	
	addVertex(vertex) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshvertex = this.getVertexArray(); 
		if(vertex === undefined) {
			// _init から呼ばれたときに引数がない場合はなにもせず終わる
		}
		else if(vertex instanceof S3Vertex) {
			meshvertex[meshvertex.length] = vertex;
		}
		else {
			for(let i = 0; i < vertex.length; i++) {
				meshvertex[meshvertex.length] = vertex[i];
			}
		}
	}
	
	addTriangleIndex(ti) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshtri = this.getTriangleIndexArray();
		if(ti === undefined) {
			// _init から呼ばれたときに引数がない場合はなにもせず終わる
		}
		else if(ti instanceof S3TriangleIndex) {
			meshtri[meshtri.length] = this.is_inverse ? ti.inverseTriangle() : ti;
		}
		else {
			for(let i = 0; i < ti.length; i++) {
				meshtri[meshtri.length] = this.is_inverse ? ti[i].inverseTriangle() : ti[i];
			}
		}
	}
	
	addMaterial(material) {
		// 一応 immutable なのでそのままシャローコピー
		this.setComplete(false);
		const meshmat = this.getMaterialArray();
		if(material === undefined) {
			// _init から呼ばれたときに引数がない場合はなにもせず終わる
		}
		else if(material instanceof S3Material) {
			meshmat[meshmat.length] = material;
		}
		else {
			for(let i = 0; i < material.length; i++) {
				meshmat[meshmat.length] = material[i];
			}
		}
	}
}
