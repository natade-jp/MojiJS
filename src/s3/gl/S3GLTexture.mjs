/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Texture from "../basic/S3Texture.mjs";

export default class S3GLTexture extends S3Texture {
	
	constructor(s3glsystem, data) {
		super(s3glsystem, data);
		this.gldata			= null;
	}

	_init() {
		super._init();
		this.gldata			= null;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
			if(this.gldata !== null) {
				this.sys._disposeObject(this);
				this.gldata = null;
			}
		}
	}

	getGLData() {
		if(this.is_dispose) {
			return null;
		}
		if(this.gldata !== null) {
			return this.gldata;
		}
		if(this.is_loadimage) {
			this.gldata = this.sys.glfunc.createTexture(this.url, this.image);
			return this.gldata;
		}
		return null;
	}
}