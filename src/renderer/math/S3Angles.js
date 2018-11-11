/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class S3Angles {
	
	/**
	 * 3DCG用 のオイラー角 (immutable)
	 * @param {Number} z ロール
	 * @param {Number} x ピッチ
	 * @param {Number} y ヨー
	 * @returns {S3Angle}
	 */
	constructor(z, x, y) {
		this.setRotateZXY(z, x, y);
	}

	static _toPeriodicAngle(x) {
		if(x > S3Angles.PI) {
			return x - S3Angles.PI2 * parseInt(( x + S3Angles.PI) / S3Angles.PI2);
		}
		else if(x < -S3Angles.PI) {
			return x + S3Angles.PI2 * parseInt((-x + S3Angles.PI) / S3Angles.PI2);
		}
		return x;
	}

	clone() {
		return new S3Angles(this.roll, this.pitch, this.yaw);
	}

	setRotateZXY(z, x, y) {
		this.roll	= S3Angles._toPeriodicAngle(isNaN(z) ? 0.0 : z);
		this.pitch	= S3Angles._toPeriodicAngle(isNaN(x) ? 0.0 : x);
		this.yaw	= S3Angles._toPeriodicAngle(isNaN(y) ? 0.0 : y);
	}

	addRotateX(x) {
		return new S3Angles(this.roll, this.pitch + x, this.yaw);
	}

	addRotateY(y) {
		return new S3Angles(this.roll, this.pitch, this.yaw + y);
	}

	addRotateZ(z) {
		return new S3Angles(this.roll + z, this.pitch, this.yaw);
	}

	setRotateX(x) {
		return new S3Angles(this.roll, x, this.yaw);
	}

	setRotateY(y) {
		return new S3Angles(this.roll, this.pitch, y);
	}

	setRotateZ(z) {
		return new S3Angles(z, this.pitch, this.yaw);
	}

	toString() {
		return "angles[" + this.roll + "," + this.pitch + "," + this.yaw + "]";
	}

}

S3Angles.PI		= 180.0;
S3Angles.PIOVER2= S3Angles.PI / 2.0;
S3Angles.PILOCK	= S3Angles.PIOVER2 - 0.0001;
S3Angles.PI2	= 2.0 * S3Angles.PI;

