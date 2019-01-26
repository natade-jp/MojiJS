/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Math from "./S3Math.js";
import S3Vector from "./S3Vector.js";

export default class S3Matrix {
	
	/**
	 * 3DCG用 の4x4行列  (immutable)
	 * 引数は、MATLAB と同じように行で順番に定義していきます。
	 * この理由は、行列を初期化する際に見た目が分かりやすいためです。
	 * 9個の引数なら3x3行列、16個の引数なら4x4行列として扱います。
	 * @param {Number} m00
	 * @param {Number} m01
	 * @param {Number} m02
	 * @param {Number} m03
	 * @param {Number} m10
	 * @param {Number} m11
	 * @param {Number} m12
	 * @param {Number} m13
	 * @param {Number} m20
	 * @param {Number} m21
	 * @param {Number} m22
	 * @param {Number} m23
	 * @param {Number} m30
	 * @param {Number} m31
	 * @param {Number} m32
	 * @param {Number} m33
	 * @returns {S3Matrix}
	 */
	constructor(
		m00, m01, m02, m03,		// row 1
		m10, m11, m12, m13,		// row 2
		m20, m21, m22, m23,		// row 3
		m30, m31, m32, m33 ) {	// row 4
		if(arguments.length === 0) {
			this.m00 = 0.0;	this.m01 = 0.0;	this.m02 = 0.0;	this.m03 = 0.0;
			this.m10 = 0.0;	this.m11 = 0.0;	this.m12 = 0.0;	this.m13 = 0.0;
			this.m20 = 0.0;	this.m21 = 0.0;	this.m22 = 0.0;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 0.0;
		}
		else if(arguments.length === 9) {
			// 3x3行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = 0.0;
			this.m10 = m03;	this.m11 = m10;	this.m12 = m11;	this.m13 = 0.0;
			this.m20 = m12;	this.m21 = m13;	this.m22 = m20;	this.m23 = 0.0;
			this.m30 = 0.0;	this.m31 = 0.0;	this.m32 = 0.0;	this.m33 = 1.0;
		}
		else if(arguments.length === 16) {
			// 4x4行列
			this.m00 = m00;	this.m01 = m01;	this.m02 = m02;	this.m03 = m03;
			this.m10 = m10;	this.m11 = m11;	this.m12 = m12;	this.m13 = m13;
			this.m20 = m20;	this.m21 = m21;	this.m22 = m22;	this.m23 = m23;
			this.m30 = m30;	this.m31 = m31;	this.m32 = m32;	this.m33 = m33;
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	equals(tgt) {
		return (
			S3Math.equals(this.m00, tgt.m00) &&
			S3Math.equals(this.m01, tgt.m01) &&
			S3Math.equals(this.m02, tgt.m02) &&
			S3Math.equals(this.m03, tgt.m03) &&
			S3Math.equals(this.m10, tgt.m10) &&
			S3Math.equals(this.m11, tgt.m11) &&
			S3Math.equals(this.m12, tgt.m12) &&
			S3Math.equals(this.m13, tgt.m13) &&
			S3Math.equals(this.m20, tgt.m20) &&
			S3Math.equals(this.m21, tgt.m21) &&
			S3Math.equals(this.m22, tgt.m22) &&
			S3Math.equals(this.m23, tgt.m23) &&
			S3Math.equals(this.m30, tgt.m30) &&
			S3Math.equals(this.m31, tgt.m31) &&
			S3Math.equals(this.m32, tgt.m32) &&
			S3Math.equals(this.m33, tgt.m33)
		);
	}
	
	clone() {
		return new S3Matrix(
			this.m00, this.m01, this.m02, this.m03,
			this.m10, this.m11, this.m12, this.m13,
			this.m20, this.m21, this.m22, this.m23,
			this.m30, this.m31, this.m32, this.m33
		);
	}
	
	transposed() {
		return new S3Matrix(
			this.m00, this.m10, this.m20, this.m30,
			this.m01, this.m11, this.m21, this.m31,
			this.m02, this.m12, this.m22, this.m32,
			this.m03, this.m13, this.m23, this.m33
		);
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return	isNaN(this.m00) || isNaN(this.m01) || isNaN(this.m02)  || isNaN(this.m03) ||
				isNaN(this.m10) || isNaN(this.m11) || isNaN(this.m12)  || isNaN(this.m13) ||
				isNaN(this.m20) || isNaN(this.m21) || isNaN(this.m22)  || isNaN(this.m23) ||
				isNaN(this.m30) || isNaN(this.m31) || isNaN(this.m32)  || isNaN(this.m33);
	}

	/**
	 * 有限の値であるか確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return	isFinite(this.m00) && isFinite(this.m01) && isFinite(this.m02)  && isFinite(this.m03) ||
				isFinite(this.m10) && isFinite(this.m11) && isFinite(this.m12)  && isFinite(this.m13) ||
				isFinite(this.m20) && isFinite(this.m21) && isFinite(this.m22)  && isFinite(this.m23) ||
				isFinite(this.m30) && isFinite(this.m31) && isFinite(this.m32)  && isFinite(this.m33);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * 掛け算します。
	 * @param {S3Vector|S3Matrix} tgt 行列、縦ベクトル
	 * @returns {S3Vector|S3Matrix}
	 */
	mul(tgt) {
		if(tgt instanceof S3Matrix) {
			const A = this;
			const B = tgt;
			const C = new S3Matrix();
			// 行列クラスのコンストラクタを変更しても問題がないように
			// 後で代入を行っております。
			C.m00 = A.m00 * B.m00 + A.m01 * B.m10 + A.m02 * B.m20 + A.m03 * B.m30;
			C.m01 = A.m00 * B.m01 + A.m01 * B.m11 + A.m02 * B.m21 + A.m03 * B.m31;
			C.m02 = A.m00 * B.m02 + A.m01 * B.m12 + A.m02 * B.m22 + A.m03 * B.m32;
			C.m03 = A.m00 * B.m03 + A.m01 * B.m13 + A.m02 * B.m23 + A.m03 * B.m33;
			C.m10 = A.m10 * B.m00 + A.m11 * B.m10 + A.m12 * B.m20 + A.m13 * B.m30;
			C.m11 = A.m10 * B.m01 + A.m11 * B.m11 + A.m12 * B.m21 + A.m13 * B.m31;
			C.m12 = A.m10 * B.m02 + A.m11 * B.m12 + A.m12 * B.m22 + A.m13 * B.m32;
			C.m13 = A.m10 * B.m03 + A.m11 * B.m13 + A.m12 * B.m23 + A.m13 * B.m33;
			C.m20 = A.m20 * B.m00 + A.m21 * B.m10 + A.m22 * B.m20 + A.m23 * B.m30;
			C.m21 = A.m20 * B.m01 + A.m21 * B.m11 + A.m22 * B.m21 + A.m23 * B.m31;
			C.m22 = A.m20 * B.m02 + A.m21 * B.m12 + A.m22 * B.m22 + A.m23 * B.m32;
			C.m23 = A.m20 * B.m03 + A.m21 * B.m13 + A.m22 * B.m23 + A.m23 * B.m33;
			C.m30 = A.m30 * B.m00 + A.m31 * B.m10 + A.m32 * B.m20 + A.m33 * B.m30;
			C.m31 = A.m30 * B.m01 + A.m31 * B.m11 + A.m32 * B.m21 + A.m33 * B.m31;
			C.m32 = A.m30 * B.m02 + A.m31 * B.m12 + A.m32 * B.m22 + A.m33 * B.m32;
			C.m33 = A.m30 * B.m03 + A.m31 * B.m13 + A.m32 * B.m23 + A.m33 * B.m33;
			return C;
		}
		else if(tgt instanceof S3Vector) {
			const A = this;
			const v = tgt;
			// 行列×縦ベクトル＝縦ベクトル
			// Av = u なので、各項を行列の行ごとで掛け算する
			return new S3Vector(
				A.m00 * v.x + A.m01 * v.y + A.m02 * v.z + A.m03 * v.w,
				A.m10 * v.x + A.m11 * v.y + A.m12 * v.z + A.m13 * v.w,
				A.m20 * v.x + A.m21 * v.y + A.m22 * v.z + A.m23 * v.w,
				A.m30 * v.x + A.m31 * v.y + A.m32 * v.z + A.m33 * v.w
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	det3() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22;
		out += A.m10 * A.m21 * A.m02;
		out += A.m20 * A.m01 * A.m12;
		out -= A.m00 * A.m21 * A.m12;
		out -= A.m20 * A.m11 * A.m02;
		out -= A.m10 * A.m01 * A.m22;
		return out;
	}
	
	inverse3() {
		const A = this;
		const det = A.det3();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = A.clone();
		B.m00 = (A.m11 * A.m22 - A.m12 * A.m21) * id;
		B.m01 = (A.m02 * A.m21 - A.m01 * A.m22) * id;
		B.m02 = (A.m01 * A.m12 - A.m02 * A.m11) * id;
		B.m10 = (A.m12 * A.m20 - A.m10 * A.m22) * id;
		B.m11 = (A.m00 * A.m22 - A.m02 * A.m20) * id;
		B.m12 = (A.m02 * A.m10 - A.m00 * A.m12) * id;
		B.m20 = (A.m10 * A.m21 - A.m11 * A.m20) * id;
		B.m21 = (A.m01 * A.m20 - A.m00 * A.m21) * id;
		B.m22 = (A.m00 * A.m11 - A.m01 * A.m10) * id;
		return B;
	}
	
	det4() {
		const A = this;
		let out;
		out  = A.m00 * A.m11 * A.m22 * A.m33;
		out += A.m00 * A.m12 * A.m23 * A.m31;
		out += A.m00 * A.m13 * A.m21 * A.m32;
		out += A.m01 * A.m10 * A.m23 * A.m32;
		out += A.m01 * A.m12 * A.m20 * A.m33;
		out += A.m01 * A.m13 * A.m22 * A.m30;
		out += A.m02 * A.m10 * A.m21 * A.m33;
		out += A.m02 * A.m11 * A.m23 * A.m30;
		out += A.m02 * A.m13 * A.m20 * A.m31;
		out += A.m03 * A.m10 * A.m22 * A.m31;
		out += A.m03 * A.m11 * A.m20 * A.m32;
		out += A.m03 * A.m12 * A.m21 * A.m30;
		out -= A.m00 * A.m11 * A.m23 * A.m32;
		out -= A.m00 * A.m12 * A.m21 * A.m33;
		out -= A.m00 * A.m13 * A.m22 * A.m31;
		out -= A.m01 * A.m10 * A.m22 * A.m33;
		out -= A.m01 * A.m12 * A.m23 * A.m30;
		out -= A.m01 * A.m13 * A.m20 * A.m32;
		out -= A.m02 * A.m10 * A.m23 * A.m31;
		out -= A.m02 * A.m11 * A.m20 * A.m33;
		out -= A.m02 * A.m13 * A.m21 * A.m30;
		out -= A.m03 * A.m10 * A.m21 * A.m32;
		out -= A.m03 * A.m11 * A.m22 * A.m30;
		out -= A.m03 * A.m12 * A.m20 * A.m31;
		return out;
	}
	
	inverse4() {
		const A = this;
		const det = A.det4();
		if(det === 0.0) {
			return( null );
		}
		const id = 1.0 / det;
		const B = new S3Matrix();
		B.m00 = (A.m11*A.m22*A.m33 + A.m12*A.m23*A.m31 + A.m13*A.m21*A.m32 - A.m11*A.m23*A.m32 - A.m12*A.m21*A.m33 - A.m13*A.m22*A.m31) * id;
		B.m01 = (A.m01*A.m23*A.m32 + A.m02*A.m21*A.m33 + A.m03*A.m22*A.m31 - A.m01*A.m22*A.m33 - A.m02*A.m23*A.m31 - A.m03*A.m21*A.m32) * id;
		B.m02 = (A.m01*A.m12*A.m33 + A.m02*A.m13*A.m31 + A.m03*A.m11*A.m32 - A.m01*A.m13*A.m32 - A.m02*A.m11*A.m33 - A.m03*A.m12*A.m31) * id;
		B.m03 = (A.m01*A.m13*A.m22 + A.m02*A.m11*A.m23 + A.m03*A.m12*A.m21 - A.m01*A.m12*A.m23 - A.m02*A.m13*A.m21 - A.m03*A.m11*A.m22) * id;
		B.m10 = (A.m10*A.m23*A.m32 + A.m12*A.m20*A.m33 + A.m13*A.m22*A.m30 - A.m10*A.m22*A.m33 - A.m12*A.m23*A.m30 - A.m13*A.m20*A.m32) * id;
		B.m11 = (A.m00*A.m22*A.m33 + A.m02*A.m23*A.m30 + A.m03*A.m20*A.m32 - A.m00*A.m23*A.m32 - A.m02*A.m20*A.m33 - A.m03*A.m22*A.m30) * id;
		B.m12 = (A.m00*A.m13*A.m32 + A.m02*A.m10*A.m33 + A.m03*A.m12*A.m30 - A.m00*A.m12*A.m33 - A.m02*A.m13*A.m30 - A.m03*A.m10*A.m32) * id;
		B.m13 = (A.m00*A.m12*A.m23 + A.m02*A.m13*A.m20 + A.m03*A.m10*A.m22 - A.m00*A.m13*A.m22 - A.m02*A.m10*A.m23 - A.m03*A.m12*A.m20) * id;
		B.m20 = (A.m10*A.m21*A.m33 + A.m11*A.m23*A.m30 + A.m13*A.m20*A.m31 - A.m10*A.m23*A.m31 - A.m11*A.m20*A.m33 - A.m13*A.m21*A.m30) * id;
		B.m21 = (A.m00*A.m23*A.m31 + A.m01*A.m20*A.m33 + A.m03*A.m21*A.m30 - A.m00*A.m21*A.m33 - A.m01*A.m23*A.m30 - A.m03*A.m20*A.m31) * id;
		B.m22 = (A.m00*A.m11*A.m33 + A.m01*A.m13*A.m30 + A.m03*A.m10*A.m31 - A.m00*A.m13*A.m31 - A.m01*A.m10*A.m33 - A.m03*A.m11*A.m30) * id;
		B.m23 = (A.m00*A.m13*A.m21 + A.m01*A.m10*A.m23 + A.m03*A.m11*A.m20 - A.m00*A.m11*A.m23 - A.m01*A.m13*A.m20 - A.m03*A.m10*A.m21) * id;
		B.m30 = (A.m10*A.m22*A.m31 + A.m11*A.m20*A.m32 + A.m12*A.m21*A.m30 - A.m10*A.m21*A.m32 - A.m11*A.m22*A.m30 - A.m12*A.m20*A.m31) * id;
		B.m31 = (A.m00*A.m21*A.m32 + A.m01*A.m22*A.m30 + A.m02*A.m20*A.m31 - A.m00*A.m22*A.m31 - A.m01*A.m20*A.m32 - A.m02*A.m21*A.m30) * id;
		B.m32 = (A.m00*A.m12*A.m31 + A.m01*A.m10*A.m32 + A.m02*A.m11*A.m30 - A.m00*A.m11*A.m32 - A.m01*A.m12*A.m30 - A.m02*A.m10*A.m31) * id;
		B.m33 = (A.m00*A.m11*A.m22 + A.m01*A.m12*A.m20 + A.m02*A.m10*A.m21 - A.m00*A.m12*A.m21 - A.m01*A.m10*A.m22 - A.m02*A.m11*A.m20) * id;
		return B;
	}
	
	toString() {
		return "[" +
		"[" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "]\n" + 
		" [" + this.m10 + " " + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + 
		" [" + this.m20 + " " + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + 
		" [" + this.m30 + " " + this.m31 + " " + this.m32 + " " + this.m33 + "]]";
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.m00]);
		}
		else if(dimension === 4) {
			return new Instance(
				[   this.m00, this.m10, 
					this.m01, this.m11]);
		}
		else if(dimension === 9) {
			return new Instance(
				[   this.m00, this.m10, this.m20,
					this.m01, this.m11, this.m21,
					this.m02, this.m12, this.m22]);
		}
		else {
			return new Instance(
				[   this.m00, this.m10, this.m20, this.m30,
					this.m01, this.m11, this.m21, this.m31,
					this.m02, this.m12, this.m22, this.m32,
					this.m03, this.m13, this.m23, this.m33]);
		}
	}
	
}


