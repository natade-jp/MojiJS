/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class IDPosition {
		
	/**
	 * 位置情報
	 * @param {Number} x 任意
	 * @param {Number} y 任意
	 * @returns {IDPosition}
	 */
	constructor(x, y) {
		this._initIDPosition(x, y);
	}

	_initIDPosition(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.set(position);
		}
		else if(x === undefined) {
			this.x = 0; this.y = 0;
		}
		else if(arguments.length === 2) {
			this.set(x, y);
		}
		else {
			this.x = 0; this.y = 0;
		}
	}
	
	clone() {
		const ret = new IDPosition(this);
		return ret;
	}
	
	set(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x = position.x; this.y = position.y;
		}
		else {
			this.x = x; this.y = y;
		}
	}
	
	add(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x += position.x; this.y += position.y;
		}
		else {
			this.x += x; this.y += y;
		}
	}
	
	sub(x, y) {
		if(x instanceof IDPosition) {
			const position = x;
			this.x -= position.x; this.y -= position.y;
		}
		else {
			this.x -= x; this.y -= y;
		}
	}
	
	static norm(p1, p2) {
		const x = p1.x - p2.x;
		const y = p1.y - p2.y;
		return Math.sqrt(x * x + y * y);
	}
	
}
