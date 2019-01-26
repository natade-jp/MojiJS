/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Model from "../basic/S3Model.js";

export default class S3GLModel extends S3Model {

	constructor() {
		super();
	}
	
	/**
	 * Uniform を作成して返す
	 */
	getUniforms() {
		const uniforms				= {};
		{
			const MATELIAL_MAX			= 4;
			const material_array			= this.getMesh().getMaterialArray();
			const materialLength			= Math.min(material_array.length, MATELIAL_MAX);
			for(let i = 0; i < materialLength; i++) {
				const data = material_array[i].getGLData();
				for(const key in data) {
					if(!uniforms[key]) {
						uniforms[key] = [];
					}
					uniforms[key].push(data[key]);
				}
			}
		}
		const ret = [];
		ret.uniforms = uniforms;
		return ret;
	}

}