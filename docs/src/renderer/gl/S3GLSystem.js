/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3System from "../basic/S3System.js";
import S3Camera from "../basic/S3Camera.js";

import S3GLProgram from "./S3GLProgram.js";

import S3GLLight from "./S3GLLight.js";
import S3GLMaterial from "./S3GLMaterial.js";
import S3GLMesh from "./S3GLMesh.js";
import S3GLModel from "./S3GLModel.js";
import S3GLScene from "./S3GLScene.js";
import S3GLTexture from "./S3GLTexture.js";
import S3GLTriangleIndex from "./S3GLTriangleIndex.js";
import S3GLVertex from "./S3GLVertex.js";

export default class S3GLSystem extends S3System {
	
	constructor() {
		super();
		this.program		= null;
		this.gl				= null;
		this.is_set			= false;
		this.program_list	= [];
		this.program_listId	= 0;
		const that = this;
		
		const glfunc_texture_cash = {};
		
		this.glfunc = {
			
			createBufferVBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const vbo = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ARRAY_BUFFER, null);
				return vbo;
			},

			createBufferIBO : function(data) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				const ibo = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				return ibo;
			},
			
			deleteBuffer : function(data) {
				const gl = that.getGL();
				if(gl !== null) {
					gl.deleteBuffer(data);
				}
			},
			
			createTexture : function(id, image) {
				if(	!(image instanceof ImageData) &&
					!(image instanceof HTMLImageElement) &&
					!(image instanceof HTMLCanvasElement) &&
					!(image instanceof HTMLVideoElement)) {
					throw "createBufferTexture";
				}
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let texture = null;
				if(!glfunc_texture_cash[id]) {
					texture = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
					const cash = {};
					cash.texture	= texture;
					cash.count		= 0;
					glfunc_texture_cash[id] = cash;
				}
				texture = glfunc_texture_cash[id].texture;
				glfunc_texture_cash[id].count++;
				return texture;
			},
			
			deleteTexture : function(id) {
				const gl = that.getGL();
				if(gl !== null) {
					if(glfunc_texture_cash[id]) {
						glfunc_texture_cash[id].count--;
						if(glfunc_texture_cash[id].count === 0) {
							gl.deleteBuffer(glfunc_texture_cash[id].texture);
							delete glfunc_texture_cash[id];
						}
					}
				}
			},
			
			createProgram : function(shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let program		= gl.createProgram();
				let is_error	= false;
				gl.attachShader(program, shader_vertex   );
				gl.attachShader(program, shader_fragment );
				gl.linkProgram(program);
				if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
					console.log("link error " + gl.getProgramInfoLog(program));
					gl.detachShader(program, shader_vertex   );
					gl.detachShader(program, shader_fragment );
					gl.deleteProgram(program);
					program		= null;
					is_error	= true;
				}
				return {
					program		: program,
					is_error	: is_error
				};
			},
			
			deleteProgram : function(program, shader_vertex, shader_fragment) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.detachShader(program, shader_vertex   );
				gl.detachShader(program, shader_fragment );
				gl.deleteProgram(program);
			},
			
			createShader : function(sharder_type, code) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				let shader		= gl.createShader(sharder_type);
				let is_error	= false;
				gl.shaderSource(shader, code);
				gl.compileShader(shader);
				if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					console.log("compile error " + gl.getShaderInfoLog(shader));
					gl.deleteShader(shader);
					shader		= null;
					is_error	= true;
				}
				return {
					shader		: shader,
					is_error	: is_error
				};
			},
			
			deleteShader : function(shader) {
				const gl = that.getGL();
				if(gl === null) {
					return null;
				}
				gl.deleteShader(shader);
			}
			
		};
	}
	
	getGL() {
		return this.gl;
	}

	isSetGL() {
		return this.gl !== null;
	}
	
	setCanvas(canvas) {
		// 初期化色
		const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.canvas = canvas;
		this.gl = gl;
	}

	createProgram() {
		const program = new S3GLProgram(this, this.program_listId);
		this.program_list[this.program_listId] = program;
		this.program_listId++;
		return program;
	}

	disposeProgram() {
		for(const key in this.program_list) {
			this.program_list[key].dispose();
			delete this.program_list[key];
		}
	}

	setProgram(glprogram) {
		// nullの場合はエラーも無視
		if(glprogram === null) {
			return false;
		}
		// 明確な入力の誤り
		if(!(glprogram instanceof S3GLProgram)) {
			throw "not S3GLProgram";
		}
		// 新規のプログラムなら保持しておく
		if(this.program === null) {
			this.program = glprogram;
		}
		// プログラムが取得できない場合は、ダウンロード中の可能性あり無視する
		const new_program = glprogram.getProgram();
		if(null === new_program) {
			return false;
		}
		// すでに動作中で、設定されているものと同一なら無視する
		if((this.program === glprogram) && this.is_set) {
			return true;
		}
		// 新しいプログラムなのでセットする
		if(this.program !== null) {
			this.program.disuseProgram();
		}
		this.program = glprogram;
		this.program.useProgram();
		this.is_set = true;
	}

	clear() {
		if(this.gl === null) {
			return false;
		}
		const color = this.getBackgroundColor();
		this.gl.clearColor(color.x, color.y, color.z, color.w);
		this.gl.clearDepth(1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		return true;
	}

	drawElements(indexsize) {
		if(!this.is_set) {
			return;
		}
		this.gl.drawElements(this.gl.TRIANGLES, indexsize, this.gl.UNSIGNED_SHORT, 0);
		this.gl.flush();
	}

	deleteBuffer(data) {
		if(this.gl === null) {
			return null;
		}
		this.gl.deleteBuffer(data);
	}

	_getDummyTexture() {
		if(this._textureDummyData === undefined) {
			const canvas = document.createElement("canvas");
			canvas.width  = 1;
			canvas.height = 1;
			const context = canvas.getContext("2d");
			const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
			this._textureDummyId = this._createID();
			this._textureDummyData = this.glfunc.createTexture(this._textureDummyId, imagedata);
		}
		return this._textureDummyData;
	}

	_setDepthMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}

	_setCullMode() {
		if(this.gl === null) {
			return null;
		}
		const gl = this.gl;
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			gl.disable(gl.CULL_FACE);
			return;
		}
		else {
			gl.enable(gl.CULL_FACE);
		}
		if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
			gl.frontFace(gl.CW);
		}
		else {
			gl.frontFace(gl.CCW);
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			gl.cullFace(gl.FRONT_AND_BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.BACK) {
			gl.cullFace(gl.BACK);
		}
		else if(this.cullmode === S3System.CULL_MODE.FRONT) {
			gl.cullFace(gl.FRONT);
		}
	}

	_bindStart() {
		this.program.resetActiveTextureId();
	}

	_bindEnd() {
		
	}

	_bind(p1, p2) {
		if(!this.is_set) {
			return;
		}
		const prg = this.program;
		let index_lenght = 0;
		// p1が文字列、p2がデータの場合、データとして結びつける
		if((arguments.length === 2) && ((typeof p1 === "string")||(p1 instanceof String))) {
			prg.bindData(p1, p2);
		}
		// 引数がモデルであれば、モデルとして紐づける
		else if((arguments.length === 1) && (p1 instanceof S3GLModel)) {
			const mesh = p1.getMesh();
			if(mesh instanceof S3GLMesh) {
				index_lenght = prg.bindMesh(mesh);
			}
		}
		// uniformsデータであれば、内部のデータを全て割り当てる
		else if((arguments.length === 1) && (p1.uniforms)) {
			const uniforms = p1.uniforms;
			for(const key in uniforms) {
				prg.bindData(key, uniforms[key]);
			}
		}
		return index_lenght;
	}

	drawScene(scene) {
		// プログラムを再設定
		this.setProgram(this.program);
		
		// まだ設定できていない場合は、この先へいかせない
		if(!this.is_set) {
			return;
		}
		
		// 画面の初期化
		this._setDepthMode();
		this._setCullMode();
		
		// 描写開始
		this._bindStart();
		
		// Sceneに関するUniform設定（カメラやライト設定など）
		this._bind(scene.getUniforms());
		
		// カメラの行列を取得する
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		// モデル描写
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			
			// モデルに関するUniform設定（材質の設定など）
			this._bind(model.getUniforms());
			
			// モデル用のBIND
			const M = this.getMatrixWorldTransform(model);
			const MV = this.mulMatrix(M, VPS.LookAt);
			const MVP = this.mulMatrix(MV, VPS.PerspectiveFov);
			this._bind("matrixWorldToLocal4", M.inverse4());
			this._bind("matrixLocalToWorld4", M);
			this._bind("matrixLocalToWorld3", M);
			this._bind("matrixLocalToPerspective4", MVP);
			
			const indexsize = this._bind(model);
			if(indexsize) {
				this.drawElements(indexsize);
			}
		}
		
		// 描写終了
		this._bindEnd();
	}

	_disposeObject(obj) {
		if(obj instanceof S3GLTexture) {
			this.glfunc.deleteTexture(this.url);
		}
	}
	
	createVertex(position) {
		return new S3GLVertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3GLTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3GLTexture(this, name);
	}
	
	createScene() {
		return new S3GLScene();
	}
	
	createModel() {
		return new S3GLModel();
	}
	
	createMesh() {
		return new S3GLMesh(this);
	}
	
	createMaterial(name) {
		return new S3GLMaterial(this, name);
	}
	
	createLight() {
		return new S3GLLight();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}
