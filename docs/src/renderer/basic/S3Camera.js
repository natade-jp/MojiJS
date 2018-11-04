/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Math from "../math/S3Math.js";
import S3Vector from "../math/S3Vector.js";
import S3System from "./S3System.js";

export default class S3Camera {

	/**
	 * カメラ (mutable)
	 * @param {type} s3system
	 * @returns {S3Camera}
	 */
	constructor(s3system) {
		this.sys = s3system;
		this.init();
	}

	dispose() {
		this.sys		= null;
		this.fovY		= 0;
		this.eye		= null;
		this.center		= null;
		this.near		= 0;
		this.far		= 0;
	}
	
	init() {
		this.fovY		= 45;
		this.eye		= new S3Vector(0, 0, 0);
		this.center		= new S3Vector(0, 0, 1);
		this.near		= 1;
		this.far		= 1000;
	}
	
	clone() {
		const camera = new S3Camera(this.sys);
		camera.fovY		= this.fovY;
		camera.eye		= this.eye;
		camera.center	= this.center;
		camera.near		= this.near;
		camera.far		= this.far;
		return camera;
	}
	
	getVPSMatrix(canvas) {
		const x = S3System.calcAspect(canvas.width, canvas.height);
		// ビューイング変換行列を作成する
		const V = this.sys.getMatrixLookAt(this.eye, this.center);
		// 射影トランスフォーム行列
		const P = this.sys.getMatrixPerspectiveFov(this.fovY, x, this.near, this.far );
		// ビューポート行列
		const S = this.sys.getMatrixViewport(0, 0, canvas.width, canvas.height);
		return { LookAt : V, aspect : x, PerspectiveFov : P, Viewport : S };
	}
	
	setDrawRange(near, far) {
		this.near	= near;
		this.far	= far;
	}
	
	setFovY(fovY) {
		this.fovY = fovY;
	}
	
	setEye(eye) {
		this.eye = eye.clone();
	}
	
	setCenter(center) {
		this.center = center.clone();
	}
	
	getDirection() {
		return this.eye.getDirectionNormalized(this.center);
	}
	
	getDistance() {
		return this.center.getDistance(this.eye);
	}
	
	setDistance(distance) {
		const direction = this.center.getDirectionNormalized(this.eye);
		this.eye = this.center.add(direction.mul(distance));
	}
	
	getRotateY() {
		const ray = this.center.getDirection(this.eye);
		return S3Math.degrees(Math.atan2(ray.x, ray.z));
	}
	
	setRotateY(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.center.getDirection(this.eye);
		const length = ray.setY(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.center.x + length * sin,
			this.eye.y,
			this.center.z + length * cos
		);
	}
	
	addRotateY(deg) {
		this.setRotateY(this.getRotateY() + deg);
	}
	
	getRotateX() {
		const ray = this.center.getDirection(this.eye);
		return S3Math.degrees(Math.atan2( ray.z, ray.y ));
	}
	
	setRotateX(deg) {
		const rad = S3Math.radius(deg);
		const ray = this.center.getDirection(this.eye);
		const length = ray.setX(0).norm();
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		this.eye = new S3Vector(
			this.eye.x,
			this.center.y + length * cos,
			this.center.z + length * sin
		);
	}
	
	addRotateX(deg) {
		this.setRotateX(this.getRotateX() + deg);
	}
	
	translateAbsolute(v) {
		this.eye	= this.eye.add(v);
		this.center	= this.center.add(v);
	}
	
	translateRelative(v) {
		let X, Y, Z;
		const up = new S3Vector(0.0, 1.0, 0.0);
		// Z ベクトルの作成
		Z = this.eye.getDirectionNormalized(this.center);
		
		// 座標系に合わせて計算
		if(this.sys.dimensionmode === S3System.DIMENSION_MODE.RIGHT_HAND) {
			// 右手系なら反転
			Z = Z.negate();
		}
		// X, Y ベクトルの作成
		X = up.cross(Z).normalize();
		Y = Z.cross(X);
		// 移動
		X = X.mul(v.x);
		Y = Y.mul(v.y);
		Z = Z.mul(v.z);
		this.translateAbsolute(X.add(Y).add(Z));
	}
	
	toString() {
		return "camera[\n" +
				"eye   :" + this.eye    + ",\n" +
				"center:" + this.center + ",\n" +
				"fovY  :" + this.fovY + "]";
	}

}
