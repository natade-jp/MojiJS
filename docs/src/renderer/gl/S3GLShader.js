/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class S3GLShader {
	
	/**
	 * WebGLのシェーダー情報
	 * 頂点シェーダー／フラグメントシェーダ―用クラス
	 * ソースコード、コンパイル済みデータ、シェーダータイプを格納できる
	 * S3GLProgram 内部で利用するもので、一般的にこれ単体では使用しない
	 * @param {S3GLSystem} sys
	 * @param {String} code
	 * @returns {S3GLShader}
	 */
	constructor(sys, code) {
		this._init(sys, code);
	}
	
	_init(sys, code) {
		this.sys			= sys;
		this.code			= null;
		this.shader			= null;
		this.sharder_type	= -1;
		this.is_error		= false;
		const that = this;
		const downloadCallback = function(code) {
			that.code = code;
		};
		if(code.indexOf("\n") === -1) {
			// 1行の場合はURLとみなす（雑）
			this.sys._download(code, downloadCallback);
		}
		else {
			this.code = code;
		}
	}
	
	isError() {
		return this.is_error;
	}
	
	getCode() {
		return this.code;
	}
	
	getShader() {
		const gl = this.sys.getGL();
		if((gl === null) || this.is_error || (this.code === null)) {
			// まだ準備ができていないのでエラーを発生させない
			return null;
		}
		if(this.shader !== null) {
			// すでにコンパイル済みであれば返す
			return this.shader;
		}
		let code = this.code;
		// コメントを除去する
		code = code.replace(/\/\/.*/g,"");
		code = code.replace(/\/\*([^*]|\*[^/])*\*\//g,"");
		// コード内を判定して種別を自動判断する（雑）
		let sharder_type = 0;
		if(code.indexOf("gl_FragColor") !== -1) {
		// フラグメントシェーダである
			sharder_type = gl.FRAGMENT_SHADER;
		}
		else {
			// バーテックスシェーダである
			sharder_type = gl.VERTEX_SHADER;
		}
		const data = this.sys.glfunc.createShader(sharder_type, code);
		if(data.is_error) {
			this.is_error = true;
			return null;
		}
		this.shader			= data.shader;
		this.sharder_type	= sharder_type;
		return this.shader;
		
	}
	
	getShaderType() {
		if(this.sharder_type !== -1) {
			return this.sharder_type;
		}
		if(this.getShader() !== null) {
			return this.sharder_type;
		}
		return null;
	}
	
	dispose() {
		const gl = this.sys.getGL();
		if(gl === null) {
			return null;
		}
		if(this.shader === null) {
			return true;
		}
		this.sys.glfunc.deleteShader(this.shader);
		this.shader	= null;
		this.sharder_type = -1;
		return true;
	}
}