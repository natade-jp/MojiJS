/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Scene from "../basic/S3Scene.js";
import S3GLArray from "./S3GLArray.js";

export default class S3GLScene extends S3Scene {
	
	constructor() {
		super();
	}
	
	getUniforms() {
		const uniforms			= {};
		// カメラ情報もUniformで送る
		{
			uniforms.eyeWorldDirection = this.getCamera().getDirection();
		}
		// ライト情報はUniformで送る
		{
			const LIGHTS_MAX			= 4;
			const light_array			= this.getLights();
			const lightsLength		= Math.min(light_array.length, LIGHTS_MAX);
			uniforms.lightsLength	= new S3GLArray(lightsLength, 1, S3GLArray.datatype.Int32Array);
			for(let i = 0; i < lightsLength; i++) {
				const data = light_array[i].getGLData();
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
