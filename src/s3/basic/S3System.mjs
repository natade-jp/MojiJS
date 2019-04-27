/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Math from "../math/S3Math.mjs";
import S3Vector from "../math/S3Vector.mjs";
import S3Matrix from "../math/S3Matrix.mjs";

import S3Camera from "./S3Camera.mjs";
import S3Light from "./S3Light.mjs";
import S3Material from "./S3Material.mjs";
import S3Mesh from "./S3Mesh.mjs";
import S3Model from "./S3Model.mjs";
import S3Scene from "./S3Scene.mjs";
import S3Texture from "./S3Texture.mjs";
import S3TriangleIndex from "./S3TriangleIndex.mjs";
import S3Vertex from "./S3Vertex.mjs";


/**
 * /////////////////////////////////////////////////////////
 * 描写に使用するシーンを構成するクラス群
 * 
 * ポリゴン情報を構成部品
 * S3Vertex			頂点
 * S3Material		素材
 * S3TriangleIndex	インデックス
 * S3Mesh			頂点とインデックス情報と素材からなるメッシュ
 * 
 * ポリゴンの描写用構成部品
 * S3Model			どの座標にどのように表示するかモデル
 * S3Camera			映像をどのように映すか
 * S3Scene			モデルとカメラを使用してシーン
 * 
 * /////////////////////////////////////////////////////////
 */

export default class S3System {
	
	/**
	 * S3System
	 * 3DCGを作成するための行列を準備したり、シーンの描写をしたりする
	 * 
	 * 3DCGを作るうえで必要最小限の機能を提供する
	 * ・それらを構成する頂点、材質、面（全てimmutable）
	 * ・モデル (mutable)
	 * ・カメラ (mutable)
	 * ・シーン (mutable)
	 * ・描写用の行列作成
	 * ・描写のための必要最低限の計算
	 */
	constructor() {
		this._init();
	}

	_init() {
		this.setSystemMode(S3System.SYSTEM_MODE.OPEN_GL);
		this.setBackgroundColor(new S3Vector(1.0, 1.0, 1.0, 1.0));
	}

	_createID() {
		if(typeof this._CREATE_ID1 === "undefined") {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2 = 0;
			this._CREATE_ID3 = 0;
			this._CREATE_ID4 = 0;
		}
		const id = ""+
			this._CREATE_ID4.toString(16)+":"+
			this._CREATE_ID3.toString(16)+":"+
			this._CREATE_ID2.toString(16)+":"+
			this._CREATE_ID1.toString(16);
		this._CREATE_ID1++;
		if(this._CREATE_ID1 === 0x100000000) {
			this._CREATE_ID1 = 0;
			this._CREATE_ID2++;
			if(this._CREATE_ID2 === 0x100000000) {
				this._CREATE_ID2 = 0;
				this._CREATE_ID3++;
				if(this._CREATE_ID3 === 0x100000000) {
					this._CREATE_ID3 = 0;
					this._CREATE_ID4++;
					if(this._CREATE_ID4 === 0x100000000) {
						this._CREATE_ID4 = 0;
						throw "createID";
					}
				}
			}
		}
		return id;
	}
	
	_download(url, callback) {
		const dotlist = url.split(".");
		let isImage = false;
		const ext = "";
		if(dotlist.length > 1) {
			const ext = dotlist[dotlist.length - 1].toLocaleString();
			isImage = (ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg");
		}
		if(isImage) {
			const image = new Image();
			image.onload = function() {
				callback(image, ext);
			};
			image.src = url;
			return;
		}
		const http = new XMLHttpRequest();
		const handleHttpResponse = function (){
			if(http.readyState === 4) { // DONE
				if(http.status !== 200) {
					console.log("error download [" + url + "]");
					return(null);
				}
				callback(http.responseText, ext);
			}
		};
		http.onreadystatechange = handleHttpResponse;
		http.open("GET", url, true);
		http.send(null);
	}
	
	_toVector3(x) {
		if(x instanceof S3Vector) {
			return x;
		}
		else if(!isNaN(x)) {
			return new S3Vector(x, x, x);
		}
		else if(x instanceof Array) {
			return new S3Vector(x[0], x[1], x[2]);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	_toValue(x) {
		if(!isNaN(x)) {
			return x;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setBackgroundColor(color) {
		this.backgroundColor = color;
	}
	
	getBackgroundColor() {
		return this.backgroundColor;
	}
	
	setSystemMode(mode) {
		this.systemmode = mode;
		if(this.systemmode === S3System.SYSTEM_MODE.OPEN_GL) {
			this.depthmode		= S3System.DEPTH_MODE.OPEN_GL;
			this.dimensionmode	= S3System.DIMENSION_MODE.RIGHT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR4x1;
			this.frontface		= S3System.FRONT_FACE.COUNTER_CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
		else {
			this.depthmode		= S3System.DEPTH_MODE.DIRECT_X;
			this.dimensionmode	= S3System.DIMENSION_MODE.LEFT_HAND;
			this.vectormode		= S3System.VECTOR_MODE.VECTOR1x4;
			this.frontface		= S3System.FRONT_FACE.CLOCKWISE;
			this.cullmode		= S3System.CULL_MODE.BACK;
		}
	}
	
	/**
	 * ビューポート行列を作成する際に、Z値の範囲の範囲をどうするか
	 * @param {S3System.DEPTH_MODE} depthmode
	 * @returns {undefined}
	 */
	setDepthMode(depthmode) {
		this.depthmode = depthmode;
	}
	
	/**
	 * 座標軸について左手系か、右手系か
	 * @param {S3System.DIMENSION_MODE} dimensionmode
	 * @returns {undefined}
	 */
	setDimensionMode(dimensionmode) {
		this.dimensionmode = dimensionmode;
	}
	
	/**
	 * N次元の座標について、横ベクトルか、縦ベクトル、どちらで管理するか
	 * @param {S3System.VECTOR_MODE} vectormode
	 * @returns {undefined}
	 */
	setVectorMode(vectormode) {
		this.vectormode = vectormode;
	}
	
	/**
	 * どのようなポリゴンの頂点の順序を表として定義するか
	 * @param {S3System.FRONT_FACE} frontface
	 * @returns {undefined}
	 */
	setFrontMode(frontface) {
		this.frontface = frontface;
	}
	
	/**
	 * どの方向を描写しないかを設定する。
	 * @param {S3System.CULL_MODE} cullmode
	 * @returns {undefined}
	 */
	setCullMode(cullmode) {
		this.cullmode = cullmode;
	}
	
	setCanvas(canvas) {
		const that		= this;
		const ctx			= canvas.getContext("2d");
		this.canvas		= canvas;
		this.context2d = {
			context : ctx,
			drawLine : function(v0, v1) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.stroke();
			},
			drawLinePolygon : function(v0, v1, v2) {
				ctx.beginPath();
				ctx.moveTo( v0.x, v0.y );
				ctx.lineTo( v1.x, v1.y );
				ctx.lineTo( v2.x, v2.y );
				ctx.closePath();
				ctx.stroke();
			},
			setLineWidth : function(width) {
				ctx.lineWidth = width;
			},
			setLineColor : function(color) {
				ctx.strokeStyle = color;
			},
			clear : function() {
				const color = that.getBackgroundColor();
				ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
				ctx.fillStyle = "rgba(" + color.x * 255 + "," + color.y * 255 + "," + color.z * 255 + "," + color.w + ")";
				ctx.fillRect(0, 0, that.canvas.width, that.canvas.height);
			}
		};
	}
	
	/**
	 * カリングのテストをする
	 * @param {S3Vector} p1
	 * @param {S3Vector} p2
	 * @param {S3Vector} p3
	 * @returns {Boolean} true で描写しない
	 */
	testCull(p1, p2, p3) {
		if(this.cullmode === S3System.CULL_MODE.NONE) {
			return false;
		}
		if(this.cullmode === S3System.CULL_MODE.FRONT_AND_BACK) {
			return true;
		}
		const isclock = S3Vector.isClockwise(p1, p2, p3);
		if(isclock === null) {
			return true;
		}
		else if(!isclock) {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode !== S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode !== S3System.CULL_MODE.FRONT;
			}
		}
		else {
			if(this.frontface === S3System.FRONT_FACE.CLOCKWISE) {
				return this.cullmode === S3System.CULL_MODE.BACK;
			}
			else {
				return this.cullmode === S3System.CULL_MODE.FRONT;
			}
		}
	}
	
	/**
	 * ビューポート行列を作成する
	 * @param {Number} x 描写する左上の座標X
	 * @param {Number} y 描写する左上の座標Y
	 * @param {Number} Width 描写幅
	 * @param {Number} Height 描写幅
	 * @param {Number} MinZ 深度値の変換
	 * @param {Number} MaxZ 深度値の変換
	 * @returns {S3Matrix}
	 */
	getMatrixViewport(x, y, Width, Height, MinZ, MaxZ) {
		if(MinZ === undefined) {
			MinZ = 0.0;
		}
		if(MaxZ === undefined) {
			MaxZ = 1.0;
		}
		// M.m11 は、DirectXだとマイナス、OpenGLだとプラスである
		// 今回は、下がプラスであるcanvasに表示させることを考えて、マイナスにしてある。
		const M = new S3Matrix();
		M.m00 =  Width/2; M.m01 =       0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =      0.0; M.m11 = -Height/2; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =      0.0; M.m21 =       0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =x+Width/2; M.m31 =y+Height/2; M.m32 = 0.0; M.m33 = 1.0;
		
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = MinZ - MaxZ;
			M.m32 = MinZ;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (MinZ - MaxZ) / 2;
			M.m32 = (MinZ + MaxZ) / 2;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 視体積の上下方向の視野角を求める
	 * @param {Number} zoomY
	 * @returns {Number}
	 */
	static calcFovY(zoomY) {
		return(2.0 * Math.atan(1.0 / zoomY));
	}
	
	/**
	 * アスペクト比を求める
	 * @param {Number} width
	 * @param {Number} height
	 * @returns {Number}
	 */
	static calcAspect(width, height) {
		return(width / height);
	}
	
	/**
	 * パースペクティブ射影行列を作成する
	 * @param {Number} fovY 視体積の上下方向の視野角（0度から180度）
	 * @param {Number} Aspect 近平面、遠平面のアスペクト比（Width / Height）
	 * @param {Number} Near カメラから近平面までの距離（ニアークリッピング平面）
	 * @param {Number} Far カメラから遠平面までの距離（ファークリッピング平面）
	 * @returns {S3Matrix}
	 */
	getMatrixPerspectiveFov(fovY, Aspect, Near, Far) {
		const arc = S3Math.radius(fovY);
		const zoomY = 1.0 / Math.tan(arc / 2.0);
		const zoomX = zoomY / Aspect;
		const M = new S3Matrix();
		M.m00 =zoomX; M.m01 =  0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =  0.0; M.m11 =zoomY; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 =  0.0; M.m21 =  0.0; M.m22 = 1.0; M.m23 = 1.0;
		M.m30 =  0.0; M.m31 =  0.0; M.m32 = 0.0; M.m33 = 0.0;
		const Delta = Far - Near;
		if(Near > Far) {
			throw "Near > Far error";
		}
		else if(Delta === 0.0) {
			throw "divide error";
		}
		if(this.depthmode === S3System.DEPTH_MODE.DIRECT_X) {
			M.m22 = Far / Delta;
			M.m32 = - Far * Near / Delta;
		}
		else if(this.depthmode === S3System.DEPTH_MODE.OPEN_GL) {
			M.m22 = (Far + Near) / Delta;
			M.m32 = - 2.0 * Far * Near / Delta;
		}
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			M.m22 = - M.m22;
			M.m23 = - M.m23;
		}
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * ビュートランスフォーム行列を作成する
	 * @param {S3Vector} eye カメラの座標の位置ベクトル
	 * @param {S3Vector} at カメラの注視点の位置ベクトル
	 * @param {S3Vector} up カメラの上への方向ベクトル
	 * @returns {S3Matrix}
	 */
	getMatrixLookAt(eye, at, up) {
		if(up === undefined) {
			up = new S3Vector(0.0, 1.0, 0.0);
		}
		// Z ベクトルの作成
		let Z = eye.getDirectionNormalized(at);
		if(this.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		const X = up.cross(Z).normalize();
		const Y = Z.cross(X);
		const M = new S3Matrix();
		M.m00 = X.x; M.m01 = Y.x; M.m02 = Z.x; M.m03 = 0.0;
		M.m10 = X.y; M.m11 = Y.y; M.m12 = Z.y; M.m13 = 0.0;
		M.m20 = X.z; M.m21 = Y.z; M.m22 = Z.z; M.m23 = 0.0;
		M.m30 = -X.dot(eye); M.m31 = -Y.dot(eye); M.m32 = -Z.dot(eye); M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 単位行列を作成します。
	 * @returns {S3Matrix}
	 */
	getMatrixIdentity() {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return M;
	}
	
	/**
	 * 平行移動行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixTranslate(x, y, z) {
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 =   x; M.m31 =   y; M.m32 =   z; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * 拡大縮小行列を作成します。
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @returns {S3Matrix}
	 */
	getMatrixScale(x, y, z) {
		const M = new S3Matrix();
		M.m00 =   x; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 =   y; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 =   z; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * X軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateX(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = 1.0; M.m01 = 0.0; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = cos; M.m12 = sin; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 =-sin; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}
	
	/**
	 * Y軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateY(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = 0.0; M.m02 =-sin; M.m03 = 0.0;
		M.m10 = 0.0; M.m11 = 1.0; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = sin; M.m21 = 0.0; M.m22 = cos; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * Z軸周りの回転行列を作成します。
	 * @param {Number} degree 角度を度数法で指定
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZ(degree) {
		const arc = S3Math.radius(degree);
		const cos = Math.cos(arc);
		const sin = Math.sin(arc);
		const M = new S3Matrix();
		M.m00 = cos; M.m01 = sin; M.m02 = 0.0; M.m03 = 0.0;
		M.m10 =-sin; M.m11 = cos; M.m12 = 0.0; M.m13 = 0.0;
		M.m20 = 0.0; M.m21 = 0.0; M.m22 = 1.0; M.m23 = 0.0;
		M.m30 = 0.0; M.m31 = 0.0; M.m32 = 0.0; M.m33 = 1.0;
		return this.vectormode === S3System.VECTOR_MODE.VECTOR4x1 ? M.transposed() : M;
	}

	/**
	 * 縦型、横型を踏まえて掛け算します。
	 * @param {S3Matrix} A
	 * @param {S3Matrix|S3Vector} B
	 * @returns {S3Matrix|S3Vector}
	 */
	mulMatrix(A, B) {
		if(B instanceof S3Matrix) {
			// 横型の場合は、v[AB]=u
			// 縦型の場合は、[BA]v=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? B.mul(A) : A.mul(B);
		}
		else if(B instanceof S3Vector) {
			// 横型の場合は、[vA]=u
			// 縦型の場合は、[Av]=u
			return (this.vectormode === S3System.VECTOR_MODE.VECTOR4x1) ? A.mul(B) : B.mul(A);
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	/**
	 * 航空機の姿勢制御（ロール・ピッチ・ヨー）の順序で回転
	 * @param {Number} z
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {S3Matrix}
	 */
	getMatrixRotateZXY(z, x, y) {
		const Z = this.getMatrixRotateZ(z);
		const X = this.getMatrixRotateX(x);
		const Y = this.getMatrixRotateY(y);
		return this.mulMatrix(this.mulMatrix(Z, X), Y);
	}

	getMatrixWorldTransform(model) {
		// 回転行列
		const R = this.getMatrixRotateZXY(model.angles.roll, model.angles.pitch, model.angles.yaw);
		// スケーリング
		const S = this.getMatrixScale(model.scale.x, model.scale.y, model.scale.z);
		// 移動行列
		const T = this.getMatrixTranslate(model.position.x, model.position.y, model.position.z);
		// ワールド変換行列を作成する
		const W = this.mulMatrix(this.mulMatrix(S, R), T);
		return W;
	}

	clear() {
		this.context2d.clear();
	}

	_calcVertexTransformation(vertexlist, MVP, Viewport) {
		const newvertexlist = [];
		
		for(let i = 0; i < vertexlist.length; i++) {
			let p = vertexlist[i].position;
			
			//	console.log("1 " + p);
			//	console.log("2 " + this.mulMatrix(VPS.LookAt, p));
			//	console.log("3 " + this.mulMatrix(VPS.PerspectiveFov, this.mulMatrix(VPS.LookAt, p)));
			//	console.log("4 " + this.mulMatrix(MVP, p));
			
			p = this.mulMatrix(MVP, p);
			const rhw = p.w;
			p = p.mul(1.0 / rhw);
			p = this.mulMatrix(Viewport, p);
			newvertexlist[i] = new S3Vertex(p);
		}
		return newvertexlist;
	}

	drawAxis(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		const vertexvector = [];
		vertexvector[0] = new S3Vector(0, 0, 0);
		vertexvector[1] = new S3Vector(10, 0, 0);
		vertexvector[2] = new S3Vector(0, 10, 0);
		vertexvector[3] = new S3Vector(0, 0, 10);
		
		const newvector = [];
		const M = this.mulMatrix(VPS.LookAt, VPS.PerspectiveFov);
		for(let i = 0; i < vertexvector.length; i++) {
			let p = vertexvector[i];
			p = this.mulMatrix(M, p);
			p = p.mul(1.0 / p.w);
			p = this.mulMatrix(VPS.Viewport, p);
			newvector[i] = p;
		}
		
		this.context2d.setLineWidth(3.0);
		this.context2d.setLineColor("rgb(255, 0, 0)");
		this.context2d.drawLine(newvector[0], newvector[1]);
		this.context2d.setLineColor("rgb(0, 255, 0)");
		this.context2d.drawLine(newvector[0], newvector[2]);
		this.context2d.setLineColor("rgb(0, 0, 255)");
		this.context2d.drawLine(newvector[0], newvector[3]);
	}

	_drawPolygon(vetexlist, triangleindexlist) {
		for(let i = 0; i < triangleindexlist.length; i++) {
			const ti = triangleindexlist[i];
			if(this.testCull(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position )) {
				continue;
			}
			this.context2d.drawLinePolygon(
				vetexlist[ti.index[0]].position,
				vetexlist[ti.index[1]].position,
				vetexlist[ti.index[2]].position
			);
		}
	}

	drawScene(scene) {
		const VPS = scene.getCamera().getVPSMatrix(this.canvas);
		
		this.context2d.setLineWidth(1.0);
		this.context2d.setLineColor("rgb(0, 0, 0)");
		
		const models = scene.getModels();
		for(let i = 0; i < models.length; i++) {
			const model	= models[i];
			const mesh	= model.getMesh();
			if(mesh.isComplete() === false) {
				continue;
			}
			const M = this.getMatrixWorldTransform(model);
			const MVP = this.mulMatrix(this.mulMatrix(M, VPS.LookAt), VPS.PerspectiveFov);
			const vlist = this._calcVertexTransformation(mesh.src.vertex, MVP, VPS.Viewport);
			this._drawPolygon(vlist, mesh.src.triangleindex);
		}
	}

	_disposeObject() {
	}
	
	createVertex(position) {
		return new S3Vertex(position);
	}
	
	createTriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist) {
		return new S3TriangleIndex(i1, i2, i3, indexlist, materialIndex, uvlist);
	}
	
	createTexture(name) {
		return new S3Texture(this, name);
	}
	
	createScene() {
		return new S3Scene();
	}
	
	createModel() {
		return new S3Model();
	}
	
	createMesh() {
		return new S3Mesh(this);
	}
	
	createMaterial(name) {
		return new S3Material(this, name);
	}
	
	createLight() {
		return new S3Light();
	}
	
	createCamera() {
		const camera = new S3Camera(this);
		return camera;
	}

}

S3System.SYSTEM_MODE = {
	OPEN_GL		: 0,
	DIRECT_X	: 1
};

S3System.DEPTH_MODE = {
	/**
	 * Z値の範囲などの依存関係をOpenGL準拠
	 * @type Number
	 */
	OPEN_GL		: 0,
	/**
	 * Z値の範囲などの依存関係をDirecX準拠
	 * @type Number
	 */
	DIRECT_X	: 1
};

S3System.DIMENSION_MODE = {
	/**
	 * 右手系
	 * @type Number
	 */
	RIGHT_HAND	: 0,
	/**
	 * 左手系
	 * @type Number
	 */
	LEFT_HAND	: 1
};

S3System.VECTOR_MODE = {
	/**
	 * 値を保持するベクトルを縦ベクトルとみなす
	 * @type Number
	 */
	VECTOR4x1	: 0,
	/**
	 * 値を保持するベクトルを横ベクトルとみなす
	 * @type Number
	 */
	VECTOR1x4	: 1
};

S3System.FRONT_FACE = {
	/**
	 * 反時計回りを前面とする
	 * @type Number
	 */
	COUNTER_CLOCKWISE : 0,
	
	/**
	 * 時計回りを前面とする
	 * @type Number
	 */
	CLOCKWISE : 1
};

S3System.CULL_MODE = {
	
	/**
	 * 常にすべての三角形を描画します。
	 * @type Number
	 */
	NONE : 0,
	
	/**
	 * 前向きの三角形を描写しません。
	 * @type Number
	 */
	FRONT : 1,
	
	/**
	 * 後ろ向きの三角形を描写しません。
	 * @type Number
	 */
	BACK : 2,
	
	/**
	 * 常に描写しない。
	 * @type Number
	 */
	FRONT_AND_BACK : 3
};

