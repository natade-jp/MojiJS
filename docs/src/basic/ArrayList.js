/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

export default class ArrayList {
	
	constructor() {
		this.element = [];
		if(arguments.length === 1) {
			for(let i = 0; i < arguments[0].element.length; i++) {
				this.element[i] = arguments[0].element[i];
			}
		}
	}

	each(func) {
		let out = true;
		for(let i = 0; i < this.element.length; i++) {
			const x = this.element[i];
			if(func.call(x, i, x) === false) {
				out = false;
				break;
			}
		}
		return out;
	}
	
	toString() {
		return this.join(", ");
	}
	
	isEmpty() {
		return this.element.length === 0;
	}
	
	contains(object) {
		return this.element.contains(object);
	}
	
	size() {
		return this.element.length;
	}
	
	clear() {
		this.element.length = 0;
	}
	
	join(separator) {
		if(arguments.length === 0) {
			separator = ",";
		}
		return this.element.join(separator);
	}
	
	clone() {
		const out = new ArrayList();
		for(let i = 0; i < this.element.length; i++) {
			out.element[i] = this.element[i];
		}
		return out;
	}
	
	indexOf(object) {
		for(let i = 0; i < this.element.length; i++) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	lastIndexOf(object) {
		for(let i = this.element.length - 1; i !== -1; i--) {
			if(this.element[i] === object) {
				return i;
			}
		}
		return -1;
	}
	
	get(index) {
		return this.element[index];
	}
	
	add() {
		if(arguments.length === 1) {
			const object = arguments[0];
			this.element.push(object);
		}
		else if(arguments.length === 2) {
			const index = arguments[0];
			const object = arguments[1];
			this.element.splice(index, 0, object);
		}
	}
	
	addAll() {
		if(arguments.length === 1) {
			const list  = arguments[0];
			let j = this.element.length;
			for(let i = 0; i < list.length; i++) {
				this.element[j++] = list.element[i];
			}
		}
		else if(arguments.length === 2) {
			let index = arguments[0];
			let list  = arguments[1].element;
			if(list === this.element) {
				list = this.element.slice(0);
			}
			let size = this.element.length - index;
			let target_i = this.element.length + list.length - 1;
			let source_i = this.element.length - 1;
			for(let i = 0; i < size ; i++ ) {
				this.element[target_i--] = this.element[source_i--];
			}
			size = list.length;
			for(let i = 0; i < size; i++) {
				this.element[index++] = list[i];
			}
		}
	}
	
	set(index, object) {
		this.element[index] = object;
	}
	
	remove(index) {
		this.element.splice(index, 1);
	}
	
	removeRange(fromIndex, toIndex) {
		this.element.splice(fromIndex, toIndex - fromIndex);
	}
	
	sort(compareFunction) {
		let compare;
		if(arguments.length === 0) {
			// 比較関数
			compare = function(a, b) {
				if(a === b) {
					return(0);
				}
				if(typeof a === typeof b) {
					return(a < b ? -1 : 1);
				}
				return ((typeof a < typeof b) ? -1 : 1);
			};
		}
		else {
			compare = compareFunction;
		}
		const temp = [];
		// ソート関数（安定マージソート）
		const sort = function(element, first, last, cmp_function) { 
			if(first < last) {
				const middle = Math.floor((first + last) / 2);
				sort(element, first, middle, cmp_function);
				sort(element, middle + 1, last, cmp_function);
				let p = 0, i, j, k;
				for(i = first; i <= middle; i++) {
					temp[p++] = element[i];
				}
				i = middle + 1;
				j = 0;
				k = first;
				while((i <= last) && (j < p)) {
					if(cmp_function(element[i], temp[j]) >= 0) {
						element[k++] = temp[j++];
					}
					else {
						element[k++] = element[i++];
					}
				}
				while(j < p) {
					element[k++] = temp[j++];
				}
			}
			return true;
		};
		sort(this.element, 0, this.element.length - 1, compare);
	}

}
