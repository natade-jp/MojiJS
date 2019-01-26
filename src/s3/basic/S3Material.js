/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vector from "../math/S3Vector.js";

export default class S3Material {

	/**
	 * 素材 (mutable)
	 * @param {S3Material} type
	 * @param {S3Material} name
	 * @returns {S3Material}
	 */
	constructor(s3system, name) {
		this.sys		= s3system;
		this.name		= "s3default";
		if(name !== undefined) {
			this.name = name;
		}
		this.color		= new S3Vector(1.0, 1.0, 1.0, 1.0);	// 拡散反射の色
		this.diffuse	= 0.8;								// 拡散反射の強さ
		this.emission	= new S3Vector(0.0, 0.0, 0.0);		// 自己照明（輝き）
		this.specular	= new S3Vector(0.0, 0.0, 0.0);		// 鏡面反射の色
		this.power		= 5.0;								// 鏡面反射の強さ
		this.ambient	= new S3Vector(0.6, 0.6, 0.6);		// 光によらない初期色
		this.reflect	= 0.0;								// 環境マッピングによる反射の強さ
		this.textureColor	= this.sys.createTexture();
		this.textureNormal	= this.sys.createTexture();
	}

	dispose() {
	}
	
	setName(name) {
		this.name = name;
	}
	
	setColor(color) {
		this.color = this.sys._toVector3(color);
	}
	
	setDiffuse(diffuse) {
		this.diffuse = this.sys._toValue(diffuse);
	}
	
	setEmission(emission) {
		this.emission = this.sys._toVector3(emission);
	}
	
	setSpecular(specular) {
		this.specular = this.sys._toVector3(specular);
	}
	
	setPower(power) {
		this.power = this.sys._toValue(power);
	}
	
	setAmbient(ambient) {
		this.ambient = this.sys._toVector3(ambient);
	}
	
	setReflect(reflect) {
		this.reflect = this.sys._toValue(reflect);
	}
	
	setTextureColor(data) {
		if(this.textureColor !== null) {
			this.textureColor.dispose();
		}
		this.textureColor = this.sys.createTexture();
		this.textureColor.setImage(data);
	}
	
	setTextureNormal(data) {
		if(this.textureNormal !== null) {
			this.textureNormal.dispose();
		}
		this.textureNormal = this.sys.createTexture();
		this.textureNormal.setImage(data);
	}

}
