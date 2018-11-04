/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class HashMap {
	
	constructor() {
		this.map = [];
		this.size_ = 0;
		if(arguments.length === 1) {
			for(const key in arguments[0].map) {
				this.map[key] =arguments[0].map[key];
			}
			this.size_ = arguments[0].size_;
		}
	}

	each(func) {
		let out = true;
		for(const key in this.map) {
			const x = this.map[key];
			if(func.call(x, key, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		let output = "";
		let i = 0;
		for(const key in this.map) {
			output += key + "=>" + this.map[key];
			i++;
			if(i !== this.size_) {
				output += "\n";
			}
		}
		return output;
	}
	
	containsKey(key) {
		return (typeof this.map[key] !== "undefined");
	}
	
	containsValue(value) {
		for(const key in this.map) {
			if(this.map[key] === value) {
				return true;
			}
		}
		return false;
	}
	
	isEmpty() {
		return (this.size_ === 0);
	}
	
	clear() {
		this.map   = [];
		this.size_ = 0;
	}
	
	clone() {
		const out = new HashMap();
		for(const key in this.map) {
			out.map[key] = this.map[key];
		}
		out.size_ = this.size_;
		return out;
	}
	
	size() {
		return this.size_;
	}
	
	get(key) {
		return this.map[key];
	}
	
	put(key, value) {
		if(this.containsKey(key) === false) {
			this.map[key] = value;
			this.size_ = this.size_ + 1;
			return null;
		}
		else {
			const output = this.map[key];
			this.map[key] = value;
			return output;
		}
	}
	
	putAll(hashmap) {
		for(const key in hashmap.map) {
			if(typeof this.map[key] === "undefined") {
				this.map[key] = hashmap.map[key];
				this.size_ = this.size_ + 1;
			}
		}
	}
	
	remove(key) {
		if(this.containsKey(key) === false) {
			return null;
		}
		else {
			const output = this.map[key];
			delete this.map[key];
			this.size_ = this.size_ - 1;
			return output;
		}
	}
}