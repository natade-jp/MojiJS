/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Material from "../basic/S3Material.js";
import S3GLArray from "./S3GLArray.js";

export default class S3GLMaterial extends S3Material {
	
	constructor(s3dlsystem, name) {
		super(s3dlsystem, name);
	}
	
	getGLHash() {
		// 名前は被らないので、ハッシュに使用する
		return this.name;
	}

	/**
	 * 頂点データを作成して取得する
	 * 頂点データ内に含まれるデータは、S3GLArray型となる。
	 * なお、ここでつけているメンバの名前は、そのままバーテックスシェーダで使用する変数名となる
	 * uniform の数がハードウェア上限られているため、送る情報は選定すること
	 * @returns {頂点データ（色情報）}
	 */
	getGLData() {
		// テクスチャを取得
		let tex_color	= this.textureColor.getGLData();
		let tex_normal	= this.textureNormal.getGLData();
		// テクスチャのありなしフラグを作成。ない場合はダミーデータを入れる。
		const tex_exist	= [tex_color === null?0:1, tex_normal === null?0:1];
		tex_color	= tex_color === null	? this.sys._getDummyTexture() : tex_color;
		tex_normal	= tex_normal === null	? this.sys._getDummyTexture() : tex_normal;
		return {
			materialsColorAndDiffuse	:
				new S3GLArray([this.color.x, this.color.y, this.color.z, this.diffuse]			, 4, S3GLArray.datatype.Float32Array),
			materialsSpecularAndPower	:
				new S3GLArray([this.specular.x, this.specular.y, this.specular.z, this.power]	, 4, S3GLArray.datatype.Float32Array),
			materialsEmission	:
				new S3GLArray(this.emission	, 3, S3GLArray.datatype.Float32Array),
			materialsAmbientAndReflect	:
				new S3GLArray([this.ambient.x, this.ambient.y, this.ambient.z, this.reflect]	, 4, S3GLArray.datatype.Float32Array),
			materialsTextureExist	:
				new S3GLArray(tex_exist	, 2, S3GLArray.datatype.Float32Array),
			materialsTextureColor	:	tex_color,
			materialsTextureNormal	:	tex_normal
		};
	}

}
