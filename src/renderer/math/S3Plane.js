﻿/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Vector from "./S3Vector.js";

export default class S3Plane {
    
	/**
     * 面を作成する。
     * @param {S3Vector} n 面の法線
     * @param {Number|S3Vector} d 原点からの距離 | 面の中のある点
     */
	constructor(n , d) {
		if(d instanceof S3Vector) {
			this.n = n;
			this.d = this.n.dot(d);
		}
		else {
			this.n = n;
			this.d = d;
		}
	}
	
	/**
	 * 任意の点から平面への距離を求めます。
	 * @param {S3Vector} position
	 * @return {Number}
	 */
	getDistance(position) {
		return (position.dot(this.n) - this.d);
	}

	/**
	 * 任意の点から一番近い平面上の点を求めます。
	 * @param {S3Vector} position
	 * @return {S3Vector}
	 */
	getNearestPoint(position) {
		return this.n.mul(- this.getDistance(position)).add(position);
	}

	/**
	 * 面の内側にあるかどうか判定する
	 * @param {S3Vector} position
	 * @return {Boolean}
	 */
	isHitPosition(position) {
		return this.getDistance(position) < 0;
	}

	/**
	 * 文字列に変換します。
	 */
	toString() {
		return "Plane("+ this.n.toString() +", ["+this.d+"])";
	}


    
}


