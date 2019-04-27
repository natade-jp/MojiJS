/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vector from "../math/S3Vector.mjs";
import S3Light from "../basic/S3Light.mjs";
import S3GLArray from "./S3GLArray.mjs";

export default class S3GLLight extends S3Light {

	/**
	 * ライト情報にデータ取得用のメソッドを拡張している。
	 */
	constructor() {
		super();
	}

	clone() {
		return super.clone(S3GLLight);
	}
	
	getGLHash() {
		return "" + this.mode + this.power + this.range + this.position.toString(3) + this.direction.toString(3) + this.color.toString(3);
	}
	
	getGLData() {
		const lightsColor = this.color.mul(this.power);
		let lightsVector = new S3Vector();
		// uniform 節約のためにライト用のベクトルは用途によって入れる値を変更する
		if(this.mode === S3Light.MODE.DIRECTIONAL_LIGHT) {
			lightsVector = this.direction;
		}
		else if(this.mode === S3Light.MODE.POINT_LIGHT) {
			lightsVector = this.position;
		}
		// uniform 節約のために最終的に渡すデータをまとめる
		return {
			lightsData1	: new S3GLArray([this.mode, this.range, lightsVector.x, lightsVector.y] , 4, S3GLArray.datatype.Float32Array),
			lightsData2	: new S3GLArray([lightsVector.z, lightsColor.x, lightsColor.y, lightsColor.z] , 4, S3GLArray.datatype.Float32Array)
		};
	}
	
}
