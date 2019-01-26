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
import S3System from "../basic/S3System.js";
import S3Mesh from "../basic/S3Mesh.js";
import S3GLTexture from "./S3GLTexture.js";

export default class S3GLMesh extends S3Mesh {
	
	/**
	 * 既存の部品に WebGL 用の情報を記録するための拡張
	 * 主に、描写のための VBO と IBO を記録する
	 * @param {S3System} sys 
	 */
	constructor(sys) {
		super(sys);
	}
	
	_init() {
		super._init();
		// webgl用
		this.gldata = {};
		this.is_compile_gl	= false;
	}
	
	clone() {
		return super.clone(S3GLMesh);
	}
	
	isCompileGL() {
		return this.is_compile_gl;
	}
	
	setCompileGL(is_compile_gl) {
		this.is_compile_gl = is_compile_gl;
	}
	
	/**
	 * 三角形インデックス情報（頂点ごとのYV、法線）などを求める
	 * 具体的には共有している頂点をしらべて、法線の平均値をとる
	 * @returns {S3GLTriangleIndexData}
	 */
	createTriangleIndexData() {
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.getTriangleIndexArray();
		const tid_list = [];
		
		const normallist = {
			normal		: null,
			tangent		: null,
			binormal	: null
		};
		
		// 各面の法線、接線、従法線を調べる
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const index	= triangleindex.index;
			const uv		= triangleindex.uv;
			tid_list[i]	= triangleindex.createGLTriangleIndexData();
			const triangledata = tid_list[i];
			let vector_list = null;
			// 3点を時計回りで通る平面が表のとき
			if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[0]].position, vertex_list[index[1]].position, vertex_list[index[2]].position,
					uv[0], uv[1], uv[2]
				);
			}
			else {
				vector_list = S3Vector.getNormalVector(
					vertex_list[index[2]].position, vertex_list[index[1]].position, vertex_list[index[0]].position,
					uv[2], uv[1], uv[0]
				);
			}
			for(const vector_name in normallist) {
				triangledata.face[vector_name] = vector_list[vector_name];
			}
		}
		
		// 素材ごとに、三角形の各頂点に、面の法線情報を追加する
		// 後に正規化する（平均値をとる）が、同じベクトルを加算しないようにキャッシュでチェックする
		const vertexdatalist_material = [];
		const vertexdatalist_material_cash = [];
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			// 未登録なら新規作成する
			if(vertexdatalist_material[material] === undefined) {
				vertexdatalist_material[material] = [];
				vertexdatalist_material_cash[material] = [];
			}
			const vertexdata_list = vertexdatalist_material[material];
			const vertexdata_list_cash = vertexdatalist_material_cash[material];
			// 素材ごとの三角形の各頂点に対応する法線情報に加算していく
			for(let j = 0; j < 3; j++) {
				// 未登録なら新規作成する
				const index = triangleindex.index[j];
				if(vertexdata_list[index] === undefined) {
					vertexdata_list[index] = {
						normal		: new S3Vector(0, 0, 0),
						tangent		: new S3Vector(0, 0, 0),
						binormal	: new S3Vector(0, 0, 0)
					};
					vertexdata_list_cash[index] = {
						normal		: [],
						tangent		: [],
						binormal	: []
					};
				}
				const vertexdata = vertexdata_list[index];
				const vertexdata_cash = vertexdata_list_cash[index];
				
				// 加算する
				for(const vector_name in normallist) {
					if(triangledata.face[vector_name] !== null) {
						// データが入っていたら加算する
						const id = triangledata.face[vector_name].toHash(3);
						if(vertexdata_cash[vector_name][id]) continue;
						vertexdata[vector_name] = vertexdata[vector_name].add(triangledata.face[vector_name]);
						vertexdata_cash[vector_name][id] = true;
					}
				}
			}
		}
		
		// マテリアルごとの頂点の法線を、正規化して1とする（平均値をとる）
		for(const material in vertexdatalist_material) {
			const vertexdata_list = vertexdatalist_material[material];
			for(const index in vertexdata_list) {
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					// あまりに小さいと、0で割ることになるためチェックする
					if(vertexdata[vectorname].normFast() > 0.000001) {
						vertexdata[vectorname] = vertexdata[vectorname].normalize();
					}
				}
			}
		}
		
		// 面法線と、頂点（スムーズ）法線との角度の差が、下記より大きい場合は面法線を優先
		const SMOOTH = {};
		SMOOTH.normal	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.tangent	= Math.cos((50/360)*(2*Math.PI));
		SMOOTH.binormal	= Math.cos((50/360)*(2*Math.PI));
		
		// 最終的に三角形の各頂点の法線を求める
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const material = triangleindex.materialIndex;
			const triangledata = tid_list[i];
			const vertexdata_list = vertexdatalist_material[material];
			
			// 法線ががあまりに違うのであれば、面の法線を採用する
			for(let j = 0; j < 3; j++) {
				const index = triangleindex.index[j];
				const vertexdata = vertexdata_list[index];
				for(const vectorname in normallist) {
					let targetdata;
					if(triangledata.face[vectorname]) {
						// 面で計算した値が入っているなら、
						// 面で計算した値と、頂点の値とを比較してどちらかを採用する
						const rate  = triangledata.face[vectorname].dot(vertexdata[vectorname]);
						// 指定した度以上傾いていたら、面の法線を採用する
						targetdata = (rate < SMOOTH[vectorname]) ? triangledata.face : vertexdata;
					}
					else {
						targetdata = vertexdata;
					}
					// コピー
					triangledata.vertex[vectorname][j]	= targetdata[vectorname];
				}
			}
		}
		
		return tid_list;
	}

	/**
	 * メッシュの頂点情報やインデックス情報を、WebGLで扱うIBO/VBO形式に計算して変換する
	 * @returns {undefined}
	 */
	_getGLArrayData() {
		
		const vertex_list			= this.getVertexArray();
		const triangleindex_list	= this.createTriangleIndexData();
		const hashlist = [];
		let vertex_length = 0;
		
		const triangle			= [];
		const vertextypelist	= {};
		
		// インデックスを再構築して、VBOとIBOを作る
		// 今の生データだと、頂点情報、素材情報がばらばらに保存されているので
		// 1つの頂点情報（位置、色等）を1つのセットで保存する必要がある
		// 面に素材が結びついているので、面が1つの頂点を共有していると
		// それらの面の素材情報によって、別の頂点として扱う必要がある
		// なので基本的には頂点情報を毎回作り直す必要があるが、
		// 1度作ったものと等しいものが必要であれば、キャッシュを使用する
		for(let i = 0; i < triangleindex_list.length; i++) {
			const triangleindex = triangleindex_list[i];
			const indlist = [];
			// ポリゴンの各頂点を調べる
			for(let j = 0; j < 3; j++) {
				// その頂点（面の情報（UVなど）も含めたデータ）のハッシュ値を求める
				const hash = triangleindex.getGLHash(j, vertex_list);
				// すでに以前と同一の頂点があるならば、その頂点アドレスを選択。ない場合は新しいアドレス
				const hit = hashlist[hash];
				indlist[j] = (hit !== undefined) ? hit : vertex_length;
				// 頂点がもしヒットしていなかったら
				if(hit === undefined) {
					// 頂点データを作成して
					const vertexdata = triangleindex.getGLData(j, vertex_list);
					hashlist[hash]  = vertex_length;
					// 頂点にはどういった情報があるか分からないので、in を使用する。
					// key には、position / normal / color / uv などがおそらく入っている
					for(const key in vertexdata) {
						if(vertextypelist[key] === undefined) {
							vertextypelist[key]		= [];
						}
						vertextypelist[key].push(vertexdata[key]);
					}
					vertex_length++;
				}
			}
			// 3つの頂点のインデックスを記録
			triangle[i] = new Int16Array(indlist);
		}
		
		// データ結合処理
		// これまでは複数の配列にデータが入ってしまっているので、
		// 1つの指定した型の配列に全てをまとめる必要がある
		
		let pt = 0;
		const ibo = {};
		{
			// IBOの結合（インデックス）
			ibo.array_length	= triangleindex_list.length * 3;
			ibo.array			= new Int16Array(ibo.array_length);
			pt = 0;
			for(let i = 0; i < triangleindex_list.length; i++) {
				for(let j = 0; j < 3; j++) {
					ibo.array[pt++] = triangle[i][j];
				}
			}
		}
		const vbo = {};
		{
			// VBOの結合（頂点）
			// 位置、法線、色などを、それぞれ1つの配列として記録する
			for(const key in vertextypelist) {
				const srcdata		= vertextypelist[key];
				const dimension	= srcdata[0].dimension;
				const dstdata	= {};
				// 情報の名前(position / uv / normal など)
				dstdata.name			= key;
				// 1つの頂点あたり、いくつの値が必要か。例えばUVなら2次元情報
				dstdata.dimension		= srcdata[0].dimension;
				// 型情報 Float32Array / Int32Array なのかどうか
				dstdata.datatype		= srcdata[0].datatype;
				// 配列の長さ
				dstdata.array_length	= dimension * vertex_length;
				// 型情報と、配列の長さから、メモリを確保する
				dstdata.array			= new dstdata.datatype.instance(dstdata.array_length);
				// data を1つの配列に結合する
				pt = 0;
				for(let i = 0; i < vertex_length; i++) {
					for(let j = 0; j < dimension; j++) {
						dstdata.array[pt++] = srcdata[i].data[j];
					}
				}
				// VBOオブジェクトに格納
				vbo[key] = dstdata;
			}
		}
		
		const arraydata = {};
		arraydata.ibo		= ibo;
		arraydata.vbo		= vbo;
		return arraydata;
	}

	disposeGLData() {
		// コンパイルしていなかったら抜ける
		if(!this.isCompileGL()) {
			return;
		}
		const gldata = this.getGLData();
		if(gldata !== null) {
			if(gldata.ibo !== undefined) {
				if(gldata.ibo.data !== undefined) {
					this.sys.glfunc.deleteBuffer(gldata.ibo.data);
				}
				delete gldata.ibo;
			}
			if(gldata.vbo !== undefined) {
				for(const key in gldata.vbo) {
					if(gldata.vbo[key].data !== undefined) {
						this.sys.glfunc.deleteBuffer(gldata.vbo[key].data);
					}
				}
				delete gldata.vbo;
			}
			{
				const material_list = this.getMaterialArray();
				for(let i = 0; i < material_list.length; i++) {
					const mat = material_list[i];
					for(const key in mat) {
						const obj = mat[key];
						if(obj instanceof S3GLTexture) {
							obj.dispose();
						}
					}
				}
			}
		}
		delete this.gldata;
		this.gldata = {};
		this.setCompileGL(false);
	}

	/**
	 * VBO/IBOを作成するため、使用中のWEBGL情報を設定し、データを作成する
	 * @returns {S3GLMesh.gldata}
	 */
	getGLData() {
		// すでに存在している場合は、返す
		if(this.isCompileGL()) {
			return this.gldata;
		}
		// 完成していない場合は null
		if(this.isComplete() === false) {
			return null;
		}
		// GLを取得できない場合も、この時点で終了させる
		if(!this.sys.isSetGL()) {
			return null;
		}
		const gldata = this._getGLArrayData(); // GL用の配列データを作成
		
		// IBO / VBO 用のオブジェクトを作成
		gldata.ibo.data = this.sys.glfunc.createBufferIBO(gldata.ibo.array);
		for(const key in gldata.vbo) {
			gldata.vbo[key].data = this.sys.glfunc.createBufferVBO(gldata.vbo[key].array);
		}
		// 代入
		this.gldata = gldata;
		this.setCompileGL(true);
		return this.gldata;
	}
}

