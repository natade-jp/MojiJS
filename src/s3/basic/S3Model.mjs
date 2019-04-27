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
import S3Angles from "../math/S3Angles.mjs";
import S3Mesh from "./S3Mesh.mjs";

export default class S3Model {
	
	/**
	* 色々な情報をいれたモデル (mutable)
	* @returns {S3Model}
	*/
	constructor() {
		this._init();
	}
		
	_init() {
		this.angles			= new S3Angles();
		this.scale			= new S3Vector(1, 1, 1);
		this.position		= new S3Vector(0, 0, 0);
		this.mesh			= new S3Mesh();
	}
	
	setMesh(mesh) {
		this.mesh			= mesh;
	}
	
	getMesh() {
		return this.mesh;
	}
	
	setScale(x, y, z) {
		if(arguments.length === 1) {
			if(typeof x === "number"){
				this.scale = new S3Vector(x, x, x);
			}
			else if(x instanceof S3Vector){
				this.scale = x;
			}
		}
		else {
			this.scale = new S3Vector(x, y, z);
		}
	}
	
	getScale() {
		return this.scale;
	}
	
	setPosition(x, y, z) {
		if((arguments.length === 1) && (x instanceof S3Vector)){
			this.position = x;
		}
		else {
			this.position = new S3Vector(x, y, z);
		}
	}
	
	getPosition() {
		return this.position;
	}
	
	getAngle() {
		return this.angles;
	}
	
	setAngle(angles) {
		this.angles = angles;
	}
	
	addRotateX(x) {
		this.angles = this.angles.addRotateX(x);
	}
	
	addRotateY(y) {
		this.angles = this.angles.addRotateY(y);
	}
	
	addRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
	setRotateX(x) {
		this.angles = this.angles.setRotateX(x);
	}
	
	setRotateY(y) {
		this.angles = this.angles.setRotateY(y);
	}
	
	setRotateZ(z) {
		this.angles = this.angles.addRotateZ(z);
	}
	
}