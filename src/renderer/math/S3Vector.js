﻿/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Math from "./S3Math.js";
import S3Matrix from "./S3Matrix.js";

export default class S3Vector {
	
	/**
	 * 3DCG用 のベクトルクラス (immutable)
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @param {Number} w (遠近除算用のため掛け算以外で使用されません)
	 * @returns {S3Vector}
	 */
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		if(z === undefined) {
			this.z = 0.0;
		}
		else {
			this.z = z;
		}
		if(w === undefined) {
			this.w = 1.0;
		}
		else {
			this.w = w;
		}
	}
	
	clone() {
		return new S3Vector(this.x, this.y, this.z, this.w);
	}
	
	negate() {
		return new S3Vector(-this.x, -this.y, -this.z, this.w);
	}
	
	cross(tgt) {
		return new S3Vector(
			this.y * tgt.z - this.z * tgt.y,
			this.z * tgt.x - this.x * tgt.z,
			this.x * tgt.y - this.y * tgt.x,
			1.0
		);
	}
	
	dot(tgt) {
		return this.x * tgt.x + this.y * tgt.y + this.z * tgt.z;
	}
	
	add(tgt) {
		return new S3Vector(
			this.x + tgt.x,
			this.y + tgt.y,
			this.z + tgt.z,
			1.0
		);
	}
	
	sub(tgt) {
		return new S3Vector(
			this.x - tgt.x,
			this.y - tgt.y,
			this.z - tgt.z,
			1.0
		);
	}
	
	mul(tgt) {
		if(tgt instanceof S3Vector) {
			return new S3Vector(
				this.x * tgt.x,
				this.y * tgt.y,
				this.z * tgt.z,
				1.0
			);
		}
		else if(tgt instanceof S3Matrix) {
			// 横ベクトル×行列＝横ベクトル
			const v = this;
			const A = tgt;
			// vA = u なので、各項を行列の列ごとで掛け算する
			return new S3Vector(
				v.x * A.m00 + v.y * A.m10 + v.z * A.m20 + v.w * A.m30,
				v.x * A.m01 + v.y * A.m11 + v.z * A.m21 + v.w * A.m31,
				v.x * A.m02 + v.y * A.m12 + v.z * A.m22 + v.w * A.m32,
				v.x * A.m03 + v.y * A.m13 + v.z * A.m23 + v.w * A.m33
			);
		}
		else if(typeof tgt === "number") {
			return new S3Vector(
				this.x * tgt,
				this.y * tgt,
				this.z * tgt,
				1.0
			);
		}
		else {
			throw "IllegalArgumentException";
		}
	}
	
	setX(x) {
		return new S3Vector(x, this.y, this.z, this.w);
	}
	
	setY(y) {
		return new S3Vector(this.x, y, this.z, this.w);
	}
	
	setZ(z) {
		return new S3Vector(this.x, this.y, z, this.w);
	}
	
	setW(w) {
		return new S3Vector(this.x, this.y, this.z, w);
	}
	
	max(tgt) {
		return new S3Vector(
			Math.max(this.x, tgt.x),
			Math.max(this.y, tgt.y),
			Math.max(this.z, tgt.z),
			Math.max(this.w, tgt.w)
		);
	}
	
	min(tgt) {
		return new S3Vector(
			Math.min(this.x, tgt.x),
			Math.min(this.y, tgt.y),
			Math.min(this.z, tgt.z),
			Math.min(this.w, tgt.w)
		);
	}

	equals(tgt) {
		return (
			S3Math.equals(this.x, tgt.x) &&
			S3Math.equals(this.y, tgt.y) &&
			S3Math.equals(this.z, tgt.z) &&
			S3Math.equals(this.w, tgt.w)
		);
	}
	
	mix(tgt, alpha) {
		return new S3Vector(
			S3Math.mix(this.x, tgt.x, alpha),
			S3Math.mix(this.y, tgt.y, alpha),
			S3Math.mix(this.z, tgt.z, alpha),
			S3Math.mix(this.w, tgt.w, alpha)
		);
	}
	
	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	
	normFast() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	
	normalize() {
		let b = this.normFast();
		if(b === 0.0) {
			throw "divide error";
		}
		b = Math.sqrt(1.0 / b);
		return new S3Vector(
			this.x * b,
			this.y * b,
			this.z * b,
			1.0
		);
	}
	
	toString(num) {
		if(num === 1) {
			return "[" + this.x + "]T";
		}
		else if(num === 2) {
			return "[" + this.x + "," + this.y + "]T";
		}
		else if(num === 3) {
			return "[" + this.x + "," + this.y + "," + this.z + "]T";
		}
		else {
			return "[" + this.x + "," + this.y + "," + this.z + "," + this.w + "]T";
		}
	}
	
	toHash(num) {
		const s = 4;
		const t = 10000;
		let x = (parseFloat(this.x.toExponential(3).substring(0,5)) * 321) & 0xFFFFFFFF;
		if(num >= 2) {
			x = (x * 12345 + parseFloat(this.y.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 3) {
			x = (x * 12345 + parseFloat(this.z.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		if(num >= 4) {
			x = (x * 12345 + parseFloat(this.w.toExponential(s).substring(0,s+2)) * t) & 0xFFFFFFFF;
		}
		return x;
	}
	
	toInstanceArray(Instance, dimension) {
		if(dimension === 1) {
			return new Instance([this.x]);
		}
		else if(dimension === 2) {
			return new Instance([this.x, this.y]);
		}
		else if(dimension === 3) {
			return new Instance([this.x, this.y, this.z]);
		}
		else {
			return new Instance([this.x, this.y, this.z, this.w]);
		}
	}
	
	pushed(array, num) {
		if(num === 1) {
			array.push(this.x);
		}
		else if(num === 2) {
			array.push(this.x);
			array.push(this.y);
		}
		else if(num === 3) {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
		}
		else {
			array.push(this.x);
			array.push(this.y);
			array.push(this.z);
			array.push(this.w);
		}
	}

	/**
	 * tgt への方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirection(tgt) {
		return tgt.sub(this);
	}

	/**
	 * tgt への正規方向ベクトルを取得する
	 * @param {S3Vector} tgt
	 * @returns {S3Vector}
	 */
	getDirectionNormalized(tgt) {
		return tgt.sub(this).normalize();
	}

	/**
	 * 指定した位置までの距離を取得する
	 * @param {S3Vector} tgt
	 * @returns {Number}
	 */
	getDistance(tgt) {
		return this.getDirection(tgt).norm();
	}

	/**
	 * 非数か確認する
	 * @returns {Boolean}
	 */
	isNaN() {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z)  || isNaN(this.w);
	}

	/**
	 * 有限の値か確認する
	 * @returns {Boolean}
	 */
	isFinite() {
		return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
	}

	/**
	 * 実数か確認する
	 * @returns {Boolean}
	 */
	isRealNumber() {
		return !this.isNaN() && this.isFinite();
	}

	/**
	 * A, B, C の3点を通る平面の法線と、UV座標による接線、従法線を求めます。
	 * A, B, C の3点の時計回りが表だとした場合、表方向へ延びる法線となります。
	 * @param {S3Vector} posA
	 * @param {S3Vector} posB
	 * @param {S3Vector} posC
	 * @param {S3Vector} uvA
	 * @param {S3Vector} uvB
	 * @param {S3Vector} uvC
	 * @returns {Object}
	 */
	static getNormalVector(posA, posB, posC, uvA, uvB, uvC) {
		let N;

		while(1) {
			const P0 = posA.getDirection(posB);
			const P1 = posA.getDirection(posC);
			try {
				N = (P0.cross(P1)).normalize();
			}
			catch (e) {
				// 頂点の位置が直行しているなどのエラー処理
				N = new S3Vector(0.3333, 0.3333, 0.3333);
				break;
			}
			if((uvA === null) | (uvB === null) | (uvC === null)) {
				// UV値がない場合はノーマルのみ返す
				break;
			}
			// 接線と従法線を計算するにあたり、以下のサイトを参考にしました。
			// http://sunandblackcat.com/tipFullView.php?l=eng&topicid=8
			// https://stackoverflow.com/questions/5255806/how-to-calculate-tangent-and-binormal
			// http://www.terathon.com/code/tangent.html
			const st0 = uvA.getDirection(uvB);
			const st1 = uvA.getDirection(uvC);
			let q;
			try {
				// 接線と従法線を求める
				q = 1.0 / ((st0.cross(st1)).z);
				const T = new S3Vector(); // Tangent	接線
				const B = new S3Vector(); // Binormal	従法線
				T.x = q * (  st1.y * P0.x - st0.y * P1.x);
				T.y = q * (  st1.y * P0.y - st0.y * P1.y);
				T.z = q * (  st1.y * P0.z - st0.y * P1.z);
				B.x = q * ( -st1.x * P0.x + st0.x * P1.x);
				B.y = q * ( -st1.x * P0.y + st0.x * P1.y);
				B.z = q * ( -st1.x * P0.z + st0.x * P1.z);
				return {
					normal		: N,
					tangent		: T.normalize(),
					binormal	: B.normalize()
				};
				/*
				// 接線と従法線は直行していない
				// 直行している方が行列として安定している。
				// 以下、Gram-Schmidtアルゴリズムで直行したベクトルを作成する場合
				const nT = T.sub(N.mul(N.dot(T))).normalize();
				const w  = N.cross(T).dot(B) < 0.0 ? -1.0 : 1.0;
				const nB = N.cross(nT).mul(w);
				return {
					normal		: N,
					tangent		: nT,
					binormal	: nB
				}
				*/
			}
			catch (e) {
				break;
			}
		}
		return {
			normal		: N,
			tangent		: null,
			binormal	: null
		};
	}
	
	/**
	 * A, B, C の3点が時計回りなら true をかえす。
	 * 時計回りでも反時計回りでもないと null を返す
	 * @param {S3Vector} A
	 * @param {S3Vector} B
	 * @param {S3Vector} C
	 * @returns {Boolean}
	 */
	static isClockwise(A, B, C) {
		const v1 = A.getDirection(B).setZ(0);
		const v2 = A.getDirection(C).setZ(0);
		const type = v1.cross(v2).z;
		if(type === 0) {
			return null;
		}
		else if(type > 0) {
			return true;
		}
		else {
			return false;
		}
	}

}

/**
 * 0
 * @type S3Vector
 */
S3Vector.ZERO = new S3Vector(0.0, 0.0, 0.0);





