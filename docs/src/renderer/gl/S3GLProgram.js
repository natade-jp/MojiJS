/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Matrix from "../math/S3Matrix.js";
import S3Vector from "../math/S3Vector.js";
import S3GLShader from "./S3GLShader.js";
import S3GLArray from "./S3GLArray.js";

export default class S3GLProgram {
	
	/**
	 * WebGLのプログラム情報
	 * 頂点シェーダー、フラグメントシェーダーの2つを組み合わせたプログラム用のクラス
	 * 2種類のシェーダーと、リンクしたプログラムを格納できる
	 * またプログラムをセットしたり、セットした後は変数とのバインドができる。
	 * @param {S3GLSystem} sys
	 * @param {Integer} id
	 * @returns {S3GLProgram}
	 */
	constructor(sys, id) {
		this._init(sys, id);
	}

	_init(sys, id) {
		this.id				= id;
		this.sys			= sys;
		this.vertex			= null;
		this.fragment		= null;
		this.isDLVertex		= false;
		this.isDLFragment	= false;
		this.program		= null;
		this.is_linked		= false;
		this.is_error		= false;
		this.enable_vertex_number = {};
		
		const variable = {};
		variable.attribute	= {};
		variable.uniform	= {};
		variable.modifiers	= [];
		variable.datatype	= [];
		this.variable = variable;
		
		const _this = this;
		this.activeTextureId = 0;
		
		const g = {
			uniform1iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1iv(location, value); }},
			uniform2iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2iv(location, value); }},
			uniform3iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3iv(location, value); }},
			uniform4iv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4iv(location, value); }},
			uniform1fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform1fv(location, value); }},
			uniform2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform2fv(location, value); }},
			uniform3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform3fv(location, value); }},
			uniform4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniform4fv(location, value); }},
			uniformMatrix2fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix2fv(location, false, value); }},
			uniformMatrix3fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix3fv(location, false, value); }},
			uniformMatrix4fv: function(location, value) { if(sys.getGL()){ sys.getGL().uniformMatrix4fv(location, false, value); }},
			uniformSampler2D: function(location, value) {
				const gl = sys.getGL();
				if(gl){
					gl.activeTexture(gl.TEXTURE0 + _this.activeTextureId);
					gl.bindTexture(gl.TEXTURE_2D, value);
					gl.uniform1i(location, _this.activeTextureId);
					_this.activeTextureId++;
				}
			}
		};
		
		const info = {
			int		: {glsltype : "int",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			float	: {glsltype : "float",	instance : Float32Array,	size : 1, btype : "FLOAT",	bind : g.uniform1fv},
			bool	: {glsltype : "bool",	instance : Int32Array,		size : 1, btype : "INT",	bind : g.uniform1iv},
			mat2	: {glsltype : "mat2",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniformMatrix2fv},
			mat3	: {glsltype : "mat3",	instance : Float32Array,	size : 9, btype : "FLOAT",	bind : g.uniformMatrix3fv},
			mat4	: {glsltype : "mat4",	instance : Float32Array,	size : 16,btype : "FLOAT",	bind : g.uniformMatrix4fv},
			vec2	: {glsltype : "vec2",	instance : Float32Array,	size : 2, btype : "FLOAT",	bind : g.uniform2fv},
			vec3	: {glsltype : "vec3",	instance : Float32Array,	size : 3, btype : "FLOAT",	bind : g.uniform3fv},
			vec4	: {glsltype : "vec4",	instance : Float32Array,	size : 4, btype : "FLOAT",	bind : g.uniform4fv},
			ivec2	: {glsltype : "ivec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			ivec3	: {glsltype : "ivec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			ivec4	: {glsltype : "ivec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			bvec2	: {glsltype : "bvec2",	instance : Int32Array,		size : 2, btype : "INT",	bind : g.uniform2iv},
			bvec3	: {glsltype : "bvec3",	instance : Int32Array,		size : 3, btype : "INT",	bind : g.uniform3iv},
			bvec4	: {glsltype : "bvec4",	instance : Int32Array,		size : 4, btype : "INT",	bind : g.uniform4iv},
			sampler2D		: {glsltype : "sampler2D",	instance : Image, size : 1, btype : "TEXTURE",	bind : g.uniformSampler2D},
			samplerCube	: {glsltype : "samplerCube",instance : Image, size : 1, btype : "TEXTURE",	bind : null}
		};
		
		this.analysisShader = function(code, variable) {
			// コメントを除去する
			code = code.replace(/\/\/.*/g,"");
			code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
			// 1行ずつ解析
			const codelines = code.split("\n");
			for(let i = 0; i < codelines.length; i++) {
				// uniform vec4 lights[4]; とすると、 uniform,vec4,lights,[4]で区切られる
				const data = codelines[i].match( /(attribute|uniform)\s+(\w+)\s+(\w+)\s*(\[\s*\w+\s*\])?;/);
				if(data === null) {
					continue;
				}
				// 見つけたら変数名や、型を記録しておく
				// 配列数の調査は、定数などを使用されると簡単に調べられないため取得できない
				// そのため自動でテストできないため、bindする際に、正しい配列数の配列をbindすること
				const text_space			= data[1];
				const text_type			= data[2];
				const text_variable		= data[3];
				const text_array			= data[4];
				const is_array			= text_array !== undefined;
				// 型に応じたテンプレートを取得する
				// data[1] ... uniform, data[2] ... mat4, data[3] ... M
				const targetinfo = info[text_type];
				variable[text_variable]			= {};
				// 参照元データを書き換えないようにディープコピーする
				for(const key in targetinfo) {
					variable[text_variable][key]	= targetinfo[key];	// glsl, js, size, bind
				}
				// さらに情報を保存しておく
				variable[text_variable].name		= text_variable;		// M
				variable[text_variable].modifiers	= text_space;			// uniform
				variable[text_variable].is_array	= is_array;
				variable[text_variable].location	= [];
				
			}
			return;
		};
	}
	
	resetActiveTextureId() {
		this.activeTextureId = 0;
	}
	
	isLinked() {
		return this.is_linked;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return false;
		}
		if(this.is_linked) {
			this.disuseProgram();
			this.sys.glfunc.deleteProgram(this.program,
				this.vertex.getShader(), this.fragment.getShader()
			);
			this.program		= null;
			this.is_linked		= false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this._init(this.sys, this.id);
		return true;
	}
	
	setVertexShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.vertex !== null) {
			this.vertex.dispose();
			this.vertex = null;
		}
		this.vertex = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}
	
	setFragmentShader(shader_code) {
		if(this.isLinked()) {
			return false;
		}
		if(this.fragment !== null) {
			this.fragment.dispose();
			this.fragment = null;
		}
		this.fragment = new S3GLShader(this.sys, shader_code);
		this.is_error = false;
		return true;
	}

	useProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const program = this.getProgram();
		if(program && this.sys.getGL()) {
			this.sys.getGL().useProgram(program);
		}
		return true;
	}
	
	disuseProgram() {
		if(!this.isLinked()) {
			return false;
		}
		const gl = this.sys.getGL();
		if(gl) {
			// enable化したデータを解放する
			for(const key in this.enable_vertex_number) {
				gl.disableVertexAttribArray(key);
			}
			this.enable_vertex_number = {};
		}
		return true;
	}
	
	getProgram() {
		const gl = this.sys.getGL();
		// 1度でもエラーが発生したか、glキャンバスの設定をしていない場合
		if((gl === null) || this.is_error) {
			return null;
		}
		// ダウンロード中なら無視する
		if(this.isDLVertex || this.isDLFragment) {
			return null;
		}
		// すでにリンク済みのがあれば返す
		if(this.isLinked()) {
			return this.program;
		}
		// シェーダーを取得する
		if(this.vertex === null) {
			console.log("do not set VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment === null) {
			console.log("do not set FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		const is_error_vertex		= this.vertex.isError();
		const is_error_fragment	= this.fragment.isError();
		if(is_error_vertex || is_error_fragment) {
			console.log("shader compile error");
			this.is_error = true;
			return null;
		}
		const shader_vertex	= this.vertex.getShader();
		const shader_fragment	= this.fragment.getShader();
		if((shader_vertex === null) || (shader_fragment === null)) {
			// まだロードが終わってない可能性あり
			return null;
		}
		if(this.vertex.getShaderType() !== gl.VERTEX_SHADER) {
			console.log("VERTEX_SHADER is not VERTEX_SHADER");
			this.is_error = true;
			return null;
		}
		if(this.fragment.getShaderType() !== gl.FRAGMENT_SHADER) {
			console.log("FRAGMENT_SHADER is not FRAGMENT_SHADER");
			this.is_error = true;
			return null;
		}
		// 取得したシェーダーを用いてプログラムをリンクする
		const data = this.sys.glfunc.createProgram(shader_vertex, shader_fragment);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		// リンクが成功したらプログラムの解析しておく
		this.is_linked = true;
		this.program = data.program;
		this.analysisShader(this.vertex.getCode(), this.variable);
		this.analysisShader(this.fragment.getCode(), this.variable);
		return this.program;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {String} name
	 * @param {Object} data
	 * @returns {undefined}
	 */
	bindData(name, data) {
		if(!this.isLinked()) {
			return false;
		}
		const gl	= this.sys.getGL();
		const prg	= this.getProgram();
		const variable	= this.variable[name];
		
		// ---- check Location ----
		if(variable === undefined) {
			// シェーダーでは利用していないものをbindしようとした。
			return false;
		}
		// 長さが0なら位置が未調査なので調査する
		if(variable.location.length === 0) {
			if(variable.modifiers === "attribute") {
				variable.location[0] = gl.getAttribLocation(prg, name);
			}
			else {
				if(!variable.is_array) {
					variable.location[0] = gl.getUniformLocation(prg, name);
				}
				else {
					// 配列の場合は、配列の数だけlocationを調査する
					// 予め、シェーダー内の配列数と一致させておくこと
					for(let i = 0; i < data.length; i++) {
						variable.location[i] = gl.getUniformLocation(prg, name + "[" + i + "]");
					}
				}
			}
		}
		if(variable.location[0] === -1) {
			// 変数は宣言されているが、関数の中で使用していないと -1 がかえる
			return false;
		}
		// data が bind できる形になっているか調査する
		
		// ---- check Type ----
		// glslの型をチェックして自動型変換する
		const toArraydata = function(data) {
			if(data instanceof WebGLBuffer) {
				// VBO型は、無視する
				if(variable.modifiers === "attribute"){
					return data;
				}
			}
			if(data instanceof WebGLTexture) {
				// テクスチャ型なら無視する
				if(variable.glsltype === "sampler2D") {
					return data;
				}
			}
			if(data instanceof variable.instance) {
				// 型と同じインスタンスであるため問題なし
				return data;
			}
			// GL用の型
			if(data instanceof S3GLArray) {
				if(variable.glsltype === data.glsltype) {
					return data.data;
				}
			}
			// 入力型が行列型であり、GLSLも行列であれば
			if(data instanceof S3Matrix) {
				if(	(variable.glsltype === "mat2") ||
					(variable.glsltype === "mat3") ||
					(variable.glsltype === "mat4") ){
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型がベクトル型であり、GLSLも数値であれば
			if(data instanceof S3Vector) {
				if(	(variable.glsltype === "vec2") ||
					(variable.glsltype === "vec3") ||
					(variable.glsltype === "vec4") ||
					(variable.glsltype === "ivec2") ||
					(variable.glsltype === "ivec3") ||
					(variable.glsltype === "ivec4") ||
					(variable.glsltype === "bvec2") ||
					(variable.glsltype === "bvec3") ||
					(variable.glsltype === "bvec4") ) {
					return data.toInstanceArray(variable.instance, variable.size);
				}
			}
			// 入力型が数値型であり、GLSLも数値であれば
			if((typeof data === "number")||(data instanceof Number)) {
				if(	(variable.glsltype === "int") ||
					(variable.glsltype === "float") ||
					(variable.glsltype === "bool") ) {
					return new variable.instance([data]);
				}
			}
			console.log(data);
			throw "not toArraydata";
		};
		
		// 引数の値をArray型に統一化する
		if(!variable.is_array) {
			data = toArraydata(data);
		}
		else {
			for(let i = 0; i < data.length; i++) {
				if(variable.location[i] !== -1) {
					// 配列の値が NULL になっているものは調査しない
					if(data[i] !== null) {
						data[i] = toArraydata(data[i]);
					}
				}
			}
		}
		
		// ---- bind Data ----
		// 装飾子によって bind する方法を変更する
		if(variable.modifiers === "attribute") {
			// bindしたいデータ
			gl.bindBuffer(gl.ARRAY_BUFFER, data);
			// 有効化していない場合は有効化する
			if(!this.enable_vertex_number[variable.location[0]]) {
				gl.enableVertexAttribArray(variable.location[0]);
				this.enable_vertex_number[variable.location[0]] = true;
			}
			// bind。型は適当に設定
			gl.vertexAttribPointer(
				variable.location[0],
				variable.size,
				variable.btype === "FLOAT" ? gl.FLOAT : gl.SHORT,
				false, 0, 0);
		}
		else {
			// uniform の設定
			if(!variable.is_array) {
				variable.bind(variable.location[0], data);
			}
			else {
				// 配列の場合は、配列の数だけbindする
				for(let i = 0; i < data.length; i++) {
					if(variable.location[i] !== -1) {
						// 配列の値が NULL になっているものはbindしない
						if(data[i] !== null) {
							variable.bind(variable.location[i], data[i]);
						}
					}
				}
			}
		}
		
		return true;
	}

	/**
	 * プログラムにデータを結びつける
	 * @param {Object} s3mesh
	 * @returns {Integer} IBOのインデックス数
	 */
	bindMesh(s3mesh) {
		if(!this.isLinked()) {
			// programが未作成
			return 0;
		}
		const gl = this.sys.getGL();
		if(gl === null) {
			// glが用意されていない
			return 0;
		}
		const gldata = s3mesh.getGLData();
		if(gldata === null) {
			// 入力値が用意されていない
			return 0;
		}
		// インデックスをセット
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gldata.ibo.data );
		const index_length = gldata.ibo.array_length;
		// 頂点をセット(あらかじめコードから解析した attribute について埋める)
		for(const key in this.variable) {
			
			if(this.variable[key].modifiers === "uniform") {
				// uniform は共通設定なので省略
				continue;
			}
			// 例えば、vboのリストにあるが、gldata内に情報をもっていない場合がある
			// それは、カメラ用の行列などがあげられる。
			// 逆に、gldata内に情報をもっているが、vbo内に定義されていないのであれば、
			// 使用しない。
			if(gldata.vbo[key] === undefined) {
				continue;
			}
			this.bindData(key, gldata.vbo[key].data);
		}
		// 戻り値でインデックスの長さを返す
		// この長さは、drawElementsで必要のため
		return index_length;
	}
	
}
