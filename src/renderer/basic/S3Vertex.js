/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class S3Vertex {
	
	/**
	 * 頂点 (immutable)
	 * @param {S3Vector} position 座標
	 * @returns {S3Vertex}
	 */
	constructor(position) {
		this.position	= position;
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Vertex;
		}
		return new Instance(this.position);
	}
	
}
