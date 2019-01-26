/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Random from "./Random.js";

// 内部では1変数内の中の16ビットごとに管理
// 2変数で16ビット*16ビットで32ビットを表す

export default class BigInteger {

	constructor() {
		this.element     = [];
		this.sign        = 0;
		if((arguments.length === 2) && (typeof Random !== "undefined") && (arguments[1] instanceof Random)) {
			this.sign = 1;
			const len = arguments[0];
			const random = arguments[1];
			const size = ((len - 1) >> 4) + 1;
			let r;
			if(len === 0) {
				return;
			}
			for(let i = 0, j = 0; i < size; i++) {
				if(j === 0) {
					r = random.nextInt(); // 32ビットずつ作成する
					this.element[i] = r & 0xFFFF;
					j = 1;
				}
				else {
					this.element[i] = (r >>> 16) & 0xFFFF;
					j = 0;
				}
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			if((len % 16) !== 0) {
				this.element[this.element.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 最後のビットに 0 をたくさん作成していると、
			// 0のみのデータになる可能性があるためメモリを修正
			this._memory_reduction();
		}
		else if(arguments.length === 3) {
			if(typeof Random === "undefined") {
				return;
			}
			while(true) {
				const x = new BigInteger(arguments[0], arguments[2]);
				if(x.isProbablePrime(arguments[1])) {
					this.element = x.element;
					this.sign = x.sign;
					break;
				}
			}
		}
		else if(arguments.length >= 1) {
			this.sign = 1;
			const obj = arguments[0];
			if(obj instanceof BigInteger) {
				for(let i = 0; i < arguments[0].element.length; i++) {
					this.element[i] = arguments[0].element[i];
				}
				this.sign = arguments[0].sign;
			}
			else if((typeof obj === "number")||(obj instanceof Number)) {
				let x = arguments[0];
				if(x < 0) {
					this.sign = -1;
					x = -x;
				}
				this.element = this._number_to_binary_number(x);
			}
			else if((typeof obj === "string")||(obj instanceof String)) {
				let x = arguments[0].replace(/\s/g, "").toLowerCase();
				let buff = x.match(/^[-+]+/);
				if(buff !==  null) {
					buff = buff[0];
					x = x.substring(buff.length, x.length);
					if(buff.indexOf("-") !==  -1) {
						this.sign = -1;
					}
				}
				if(arguments.length === 2) {
					this.element = this._string_to_binary_number(x, arguments[1]);
				}
				else if(/^0x/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 16);
				}
				else if(/^0b/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(2, x.length), 2);
				}
				else if(/^0/.test(x)) {
					this.element = this._string_to_binary_number(x.substring(1, x.length), 8);
				}
				else {
					this.element = this._string_to_binary_number(x, 10);
				}
				// "0"の場合がある為
				if((this.element.length === 1)&&(this.element[0] === 0)) {
					this.element = [];
				}
			}
		}
	}

	equals(x) {
		if(!(x instanceof BigInteger)) {
			x = new BigInteger(x);
		}
		if(this.signum() !==  x.signum()) {
			return false;
		}
		if(this.element.length !==  x.element.length) {
			return false;
		}
		for(let i = 0;i < x.element.length; i++) {
			if(this.element[i] !==  x.element[i]) {
				return false;
			}
		}
		return true;
	}

	toString(radix) {
		if(arguments.length === 0) {
			radix = 10;
		}
		// int型で扱える数値で toString が可能なので、
		// せっかくだからより大きな進数で計算していけば、あとでtoStringする回数が減るテクニック
		// 2進数であれば、2^n乗で計算しても問題がない 4進数や8進数で計算して、2進数に戻せば巡回少数なし
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		//                        max_num > radix^x
		// floor(log max_num / log radix) = x
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		// zeros = "00000000...."
		let zeros = [];
		let i;
		for(i = 0; i < keta; i++) {
			zeros[i] = "0";
		}
		zeros = zeros.join("");
		// v0.03ここまで
		const x = this._binary_number_to_string(this.element, calcradix);
		const y = [];
		let z = "";
		if(this.signum() < 0) {
			y[y.length] = "-";
		}
		for(i = x.length - 1;i >= 0; i--) {
			z = x[i].toString(radix);
			if(i < (x.length - 1)) {
				y[y.length] = zeros.substring(0, keta - z.length);
			}
			y[y.length] = z;
		}
		return y.join("");
	}

	// 内部計算用
	getShort(n) {
		if((n < 0) || (this.element.length <= n)) {
			return 0;
		}
		return this.element[n];
	}

	byteValue() {
		let x = this.getShort(0);
		x &= 0xFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	shortValue() {
		let x = this.getShort(0);
		x &= 0xFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	intValue() {
		let x = this.getShort(0) + (this.getShort(1) << 16);
		x &= 0xFFFFFFFF;
		if((x > 0)&&(this.sign < 0)) {
			x = -x;
		}
		return x;
	}

	longValue() {
		let x = 0;
		for(let i = 3; i >= 0; i--) {
			x *= 65536;
			x += this.getShort(i);
		}
		if(this.sign < 0) {
			x = -x;
		}
		return x;
	}

	floatValue() {
		return parseFloat(this.toString());
	}

	doubleValue() {
		return parseFloat(this.toString());
	}

	clone() {
		const y = new BigInteger();
		y.element = this.element.slice(0);
		y.sign    = this.sign;
		return y;
	}

	getLowestSetBit() {
		for(let i = 0;i < this.element.length;i++) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 0; j < 16; j++) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j;
					}
				}
			}
		}
		return -1;
	}

	bitLength() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				const x = this.element[i];
				for(let j = 15; j >= 0; j--) {
					if(((x >>> j) & 1) !==  0) {
						return i * 16 + j + 1;
					}
				}
			}
		}
		return 0;
	}

	bitCount() {
		let target;
		if(this.sign >= 0) {
			target = this;
		}
		else {
			target = this.add(new BigInteger(1));
		}
		const len = target.bitLength();
		let bit = 0;
		let count = 0;
		for(let i = 0;bit < len;i++) {
			const x = target.element[i];
			for(let j = 0;((j < 16) && (bit < len));j++, bit++) {
				if(((x >>> j) & 1) !==  0) {
					count = count + 1;
				}
			}
		}
		return count;
	}

	// 内部計算用
	// 負の場合は、2の補数表現を作成します
	getTwosComplement(len) {
		const y = this.clone();
		if(y.sign >= 0) {
			return y;
		}
		else {
			// 正にする
			y.sign = 1;
			// ビットの数が存在しない場合は数える
			if(arguments.length === 0) {
				len = y.bitLength();
			}
			const e = y.element;
			// ビット反転後
			for(let i = 0; i < e.length; i++) {
				e[i] ^= 0xFFFF;
			}
			// 1～15ビット余る場合は、16ビットずつ作成しているので削る
			// nビットのマスク（なお負の値を表す最上位ビットは削除する）
			if((len % 16) !== 0) {
				e[e.length - 1] &= (1 << (len % 16)) - 1;
			}
			// 1を加算
			y._add(new BigInteger(1));
			return y;
		}
	}

	_and(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 & x2;
		}
		if(this.bitLength() === 0) {
			this.element = [];
			this.sign = 0;
		}
		if((s1 === 1)||(s2 === 1)) {
			this.sign = 1;
		}
		// 出力が負の場合は、2の補数
		else if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	and(val) {
		return this.clone()._and(val);
	}

	_or(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 | x2;
		}
		this.sign = ((s1 === -1)||(s2 === -1)) ? -1 : Math.max(s1, s2);
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	or(val) {
		return this.clone()._or(val);
	}

	_xor(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let e1  = this, e2 = val;
		const s1  = e1.signum(), s2 = e2.signum();
		const len = Math.max(e1.bitLength(), e2.bitLength());
		// 引数が負の場合は、2の補数
		e1 = e1.getTwosComplement(len).element;
		e2 = e2.getTwosComplement(len).element;
		const size = Math.max(e1.length, e2.length);
		this.element = [];
		for(let i = 0;i < size;i++) {
			const x1 = (i >= e1.length) ? 0 : e1[i];
			const x2 = (i >= e2.length) ? 0 : e2[i];
			this.element[i] = x1 ^ x2;
		}
		this.sign = ((s1 !== 0)&&(s1 !== s2)) ? -1 : 1;
		// 出力が負の場合は、2の補数
		if(this.sign === -1) {
			this.element = this.getTwosComplement(len).element;
		}
		return this;
	}

	xor(val) {
		return(this.clone()._xor(val));
	}

	_not() {
		return(this._add(new BigInteger(1))._negate());
	}

	not() {
		return(this.clone()._not());
	}

	_andNot(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		return(this._and(val.not()));
	}

	andNot(val) {
		return(this.clone()._andNot(val));
	}

	_number_to_binary_number(x) {
		if(x > 0xFFFFFFFF) {
			return(this._string_to_binary_number(x.toFixed(), 10));
		}
		const y = [];
		while(x !==  0) {
			y[y.length] = x & 1;
			x >>>= 1;
		}
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_string_to_binary_number(text, radix) {
		// 下の変換をすることで、2進数での変換時に内部のforの繰り返す回数が減る
		// v0.03 出来る限りまとめてn進数変換する
		const max_num = 0x3FFFFFFF;
		const keta = Math.floor( Math.log(max_num) / Math.log(radix) );
		const calcradix = Math.round(Math.pow(radix, keta));
		let x = [];
		const y = [];
		const len = Math.ceil(text.length / keta);
		let offset = text.length;
		for(let i = 0; i < len; i++ ) {
			offset -= keta;
			if(offset >= 0) {
				x[i] = parseInt(text.substring(offset, offset + keta), radix);
			}
			else {
				x[i] = parseInt(text.substring(0, offset + keta), radix);
			}
		}
		radix = calcradix;
		// v0.03ここまで
		// 2で割っていくアルゴリズムで2進数に変換する
		while(x.length !==  0) {
			// 2で割っていく
			// 隣の桁でたcarryはradix進数をかけて桁上げしてる
			let carry = 0;
			for(let i = x.length - 1; i >= 0; i--) {
				const a = x[i] + carry * radix;
				x[i]  = a >>> 1;
				carry = a & 1;
			}
			// 1余るかどうかをテストする
			y[y.length] = carry;
			// xが0になっている部分は削除していく
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		// メモリ節約のため1つの変数（16ビット）に収めるだけ収めていく
		x = [];
		for(let i = 0; i < y.length; i++) {
			x[i >>> 4] |= y[i] << (i & 0xF);
		}
		return x;
	}

	_binary_number_to_string(binary, radix) {
		const add = function(x1, x2, y) {
			const size = x1.length;
			let carry = 0;
			for(let i = 0; i < size; i++) {
				y[i] = x1[i] + ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(y[i] >= radix) {
					carry = 1;
					y[i] -= radix;
				}
				else {
					carry = 0;
				}
			}
			if(carry === 1) {
				y[size] = 1;
			}
		};
		const y = [0];
		const t = [1];
		for(let i = 0;i < binary.length;i++) {
			for(let j = 0; j < 16; j++) {
				if((binary[i] >>> j) & 1) {
					add(t, y, y);
				}
				add(t, t, t);
			}
		}
		return y;
	}

	_memory_allocation(n) {
		const elementsize = this.element.length << 4;
		if(elementsize < n) {
			const addsize = (((n - elementsize - 1) & 0xFFFFFFF0) >>> 4) + 1;
			for(let i = 0;i < addsize;i++) {
				this.element[this.element.length] = 0;
			}
		}
	}

	_memory_reduction() {
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !==  0) {
				if(i < this.element.length - 1) {
					this.element.splice(i + 1, this.element.length - i - 1);
				}
				return;
			}
		}
		this.sign = 0;
		this.element = [];
	}

	// ユークリッド互除法（非再帰）
	// x = this, y = val としたとき gcd(x,y)を返す
	gcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		let x = this, y = val, z;
		while(y.signum() !== 0) {
			z = x.remainder(y);
			x = y;
			y = z;
		}
		return x;
	}

	// 拡張ユークリッド互除法（非再帰）
	// x = this, y = valとしたとき、 a*x + b*y = c = gcd(x, y) の[a, b, c]を返す
	extgcd(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const ONE  = new BigInteger(1);
		const ZERO = new BigInteger(0);
		let r0 = this, r1 = val, r2, q1;
		let a0 = ONE,  a1 = ZERO, a2;
		let b0 = ZERO, b1 = ONE,  b2;
		while(r1.signum() !== 0) {
			const y = r0.divideAndRemainder(r1);
			q1 = y[0];
			r2 = y[1];
			a2 = a0.subtract(q1.multiply(a1));
			b2 = b0.subtract(q1.multiply(b1));
			a0 = a1;
			a1 = a2;
			b0 = b1;
			b1 = b2;
			r0 = r1;
			r1 = r2;
		}
		return [a0, b0, r0];
	}

	_abs() {
		// -1 -> 1, 0 -> 0, 1 -> 1
		this.sign *= this.sign;
		return this;
	}

	abs() {
		return this.clone()._abs();
	}


	_negate() {
		this.sign *= -1;
		return this;
	}

	negate() {
		return this.clone()._negate();
	}

	signum() {
		if(this.element.length === 0) {
			return 0;
		}
		return this.sign;
	}

	compareToAbs(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.element.length < val.element.length) {
			return -1;
		}
		else if(this.element.length > val.element.length) {
			return 1;
		}
		for(let i = this.element.length - 1;i >= 0;i--) {
			if(this.element[i] !== val.element[i]) {
				const x = this.element[i] - val.element[i];
				return ( (x === 0) ? 0 : ((x > 0) ? 1 : -1) );
			}
		}
		return 0;
	}

	compareTo(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(this.signum() !== val.signum()) {
			if(this.sign > val.sign) {
				return 1;
			}
			else {
				return -1;
			}
		}
		else if(this.signum() === 0) {
			return 0;
		}
		return this.compareToAbs(val) * this.sign;
	}

	max(val) {
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	min(val) {
		if(this.compareTo(val) >= 0) {
			return val.clone();
		}
		else {
			return this.clone();
		}
	}

	_shift(n) {
		if(n === 0) {
			return this;
		}
		const x = this.element;
		// 1ビットなら専用コードで高速計算
		if(n === 1) {
			let i = x.length - 1;
			if((x[i] & 0x8000) !==  0) {
				x[x.length] = 1;
			}
			for(;i >= 0;i--) {
				x[i] <<= 1;
				x[i]  &= 0xFFFF;
				if((i > 0) && ((x[i - 1] & 0x8000) !==  0)) {
					x[i] += 1;
				}
			}
		}
		else if(n === -1) {
			for(let i = 0;i < x.length;i++) {
				x[i] >>>= 1;
				if((i < x.length - 1) && ((x[i + 1] & 1) !==  0)) {
					x[i] |= 0x8000;
				}
			}
			if(x[x.length - 1] === 0) {
				x.pop();
			}
		}
		else {
			// 16ビット単位なら配列を追加削除する高速計算
			if(n >= 16) {
				const m = n >>> 4;
				for(let i = x.length - 1; i >= 0; i--) {
					x[i + m] = x[i];
				}
				for(let i = m - 1; i >= 0; i--) {
					x[i] = 0;
				}
				n &= 0xF;
			}
			else if(n <= -16){
				const m = (-n) >>> 4;
				x.splice(0, m);
				n += m << 4;
			}
			if(n !== 0) {
				// 15ビット以内ならビット演算でまとめて操作
				if(0 < n) {
					let carry = 0;
					for(let i = 0; i < x.length; i++) {
						x[i] = (x[i] << n) + carry;
						if(x[i] > 0xFFFF) {
							carry = x[i] >>> 16;
							x[i] &= 0xFFFF;
						}
						else {
							carry = 0;
						}
					}
					if(carry !== 0) {
						x[x.length] = carry;
					}
				}
				else {
					n = -n;
					for(let i = 0; i < x.length; i++) {
						if(i !== x.length - 1) {
							x[i] += x[i + 1] << 16;
							x[i] >>>= n;
							x[i] &= 0xFFFF;
						}
						else {
							x[i] >>>= n;
						}
					}
					if(x[x.length - 1] === 0) {
						x.pop();
					}
				}
			}
		}
		return this;
	}

	shift(n) {
		return this.clone()._shift(n);
	}

	shiftLeft(n) {
		return this.shift(n);
	}

	shiftRight(n) {
		return this.shift(-n);
	}

	_add(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const o1 = this;
		const o2 = val;
		let x1 = o1.element;
		let x2 = o2.element;
		if(o1.sign === o2.sign) {
			//足し算
			this._memory_allocation(x2.length << 4);
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] += ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] > 0xFFFF) {
					carry = 1;
					x1[i] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x1[x1.length] = carry;
			}
		}
		else {
			// 引き算
			const compare = o1.compareToAbs(o2);
			if(compare === 0) {
				this.element = [];
				this.sign = 1;
				return this;
			}
			else if(compare === -1) {
				this.sign = o2.sign;
				const swap = x1;
				x1 = x2.slice(0);
				x2 = swap;
			}
			let carry = 0;
			for(let i = 0; i < x1.length; i++) {
				x1[i] -= ((x2.length >= (i + 1)) ? x2[i] : 0) + carry;
				if(x1[i] < 0) {
					x1[i] += 0x10000;
					carry  = 1;
				}
				else {
					carry  = 0;
				}
			}
			this.element = x1;
			this._memory_reduction();
		}
		return this;
	}

	add(val) {
		return this.clone()._add(val);
	}

	_subtract(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const sign = val.sign;
		const out  = this._add(val._negate());
		val.sign = sign;
		return out;
	}

	subtract(val) {
		return this.clone()._subtract(val);
	}

	_multiply(val) {
		const x = this.multiply(val);
		this.element = x.element;
		this.sign    = x.sign;
		return this;
	}

	multiply(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out  = new BigInteger();
		const buff = new BigInteger();
		const o1 = this;
		const o2 = val;
		const x1 = o1.element;
		const x2 = o2.element;
		const y  = out.element;
		for(let i = 0; i < x1.length; i++) {
			buff.element = [];
			// x3 = x1[i] * x2
			const x3 = buff.element;
			let carry = 0;
			for(let j = 0; j < x2.length; j++) {
				x3[j] = x1[i] * x2[j] + carry;
				if(x3[j] > 0xFFFF) {
					carry = x3[j] >>> 16;
					x3[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				x3[x3.length] = carry;
			}
			// x3 = x3 << (i * 16)
			//buff._shift(i << 4);
			for(let j = x3.length - 1; j >= 0; j--) {
				x3[j + i] = x3[j];
			}
			for(let j = i - 1; j >= 0; j--) {
				x3[j] = 0;
			}
			// y = y + x3 (out._add(buff))
			//out._add(buff);
			carry = 0;
			out._memory_allocation(x3.length << 4);
			for(let j = i; j < y.length; j++) {
				y[j] += ((x3.length >= (j + 1)) ? x3[j] : 0) + carry;
				if(y[j] > 0xFFFF) {
					carry = 1;
					y[j] &= 0xFFFF;
				}
				else {
					carry = 0;
				}
			}
			if(carry !== 0) {
				y[y.length] = carry;
			}
		}
		out.sign = this.sign * val.sign;
		return out;
	}

	_divideAndRemainder(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		const out = [];
		if(val.signum() === 0) {
			out[0] = 1 / 0;
			out[1] = 0 / 0;
			return out;
		}
		const compare = this.compareToAbs(val);
		if(compare < 0) {
			out[0] = new BigInteger(0);
			out[1] = this.clone();
			return out;
		}
		else if(compare === 0) {
			out[0] = new BigInteger(1);
			out[0].sign = this.sign * val.sign;
			out[1] = new BigInteger(0);
			return out;
		}
		const ONE = new BigInteger(1);
		const size = this.bitLength() - val.bitLength();
		const x1 = this.clone()._abs();
		const x2 = val.shift(size)._abs();
		const y  = new BigInteger();
		for(let i = 0; i <= size; i++) {
			if(x1.compareToAbs(x2) >= 0) {
				x1._subtract(x2);
				y._add(ONE);
			}
			if(i === size) {
				break;
			}
			x2._shift(-1);
			y._shift(1);
		}
		out[0] = y;
		out[0].sign = this.sign * val.sign;
		out[1] = x1;
		out[1].sign = this.sign;
		return out;
	}

	divideAndRemainder(val) {
		return this.clone()._divideAndRemainder(val);
	}

	_divide(val) {
		return this._divideAndRemainder(val)[0];
	}

	divide(val) {
		return this.clone()._divide(val);
	}

	_remainder(val) {
		return this._divideAndRemainder(val)[1];
	}

	remainder(val) {
		return this.clone()._remainder(val);
	}

	_mod(val) {
		if(!(val instanceof BigInteger)) {
			val = new BigInteger(val);
		}
		if(val.signum() < 0) {
			return null;
		}
		const y = this._divideAndRemainder(val);
		if(y[1] instanceof BigInteger) {
			if(y[1].signum() >= 0) {
				return y[1];
			}
			else {
				return y[1]._add(val);
			}
		}
		return null;
	}

	mod(val) {
		return this.clone()._mod(val);
	}

	_setBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] |= 1 << (n & 0xF);
		return this;
	}

	setBit(n) {
		return this.clone()._setBit(n);
	}

	_flipBit(n) {
		this._memory_allocation(n + 1);
		this.element[n >>> 4] ^= 1 << (n & 0xF);
		return this;
	}

	flipBit(n) {
		return this.clone()._flipBit(n);
	}

	clearBit(n) {
		const y = this.clone();
		y.element[n >>> 4] &= ~(1 << (n & 0xF));
		y._memory_reduction();
		return y;
	}

	testBit(n) {
		return ((this.element[n >>> 4] >>> (n & 0xF)) & 1);
	}

	pow(n) {
		let x, y;
		x = new BigInteger(this);
		y = new BigInteger(1);
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x);
			}
			x = x.multiply(x);
			n >>>= 1;
		}
		return y;
	}

	modPow(exponent, m) {
		m = new BigInteger(m);
		let x = new BigInteger(this);
		let y = new BigInteger(1);
		const e = new BigInteger(exponent);
		while(e.element.length !== 0) {
			if((e.element[0] & 1) !== 0) {
				y = y.multiply(x).mod(m);
			}
			x = x.multiply(x).mod(m);
			e._shift(-1);
		}
		return y;
	}

	modInverse(m) {
		m = new BigInteger(m);
		const y = this.extgcd(m);
		const ONE  = new BigInteger(1);
		if(y[2].compareTo(ONE) !== 0) {
			return null;
		}
		// 正にするため remainder ではなく mod を使用する
		return y[0]._add(m)._mod(m);
	}

	isProbablePrime(certainty) {
		const e = this.element;
		//0, 1, 2 -> true
		if( (e.length === 0) || ((e.length === 1)&&(e[0] <= 2)) ) {
			return true;
		}
		//even number -> false
		else if( ((e[0] & 1) === 0) || (certainty <= 0) ) {
			return false;
		}
		if(typeof Random === "undefined") {
			return false;
		}
		// ミラーラビン素数判定法
		// かなり処理が重たいです。まあお遊び程度に使用という感じで。
		certainty	= certainty >> 1;
		const ZERO	= new BigInteger(0);
		const ONE	= new BigInteger(1);
		const n		= this;
		const LEN	= n.bitLength();
		const n_1	= n.subtract(ONE);
		const s 	= n_1.getLowestSetBit();
		const d 	= n_1.shift(-s);
		const random = new Random();
		let a;
		let isComposite;
		for(let i = 0; i < certainty; i++ ) {
			//[ 1, n - 1] の範囲から a を選択
			do {
				a = new BigInteger( LEN, random );
			} while(( a.compareTo(ZERO) === 0 )||( a.compareTo(n) !== -1 ));
			// a^d != 1 mod n
			a = a.modPow(d, n);
			if( a.compareTo(ONE) === 0 ) {
				continue;
			}
			// x ^ 4 % 2 = ((x ^ 2 % 2) ^ 2 % 2) のように分解しておく
			isComposite = true;
			for(let j = 0; j <= s; j++) {
				if(a.compareTo(n_1) === 0) {
					isComposite = false;
					break;
				}
				if(j < s) {
					a = a.multiply(a)._mod(n);
				}
			}
			if(isComposite) {
				return false;
			}
		}
		return true;
	}

	nextProbablePrime() {
		if(typeof Random === "undefined") {
			return(new BigInteger(0));
		}
		const x = this.clone();
		const ONE	= new BigInteger(1);
		while(true) {
			x._add(ONE);
			if(x.isProbablePrime(100)) {
				break;
			}
		}
		return x;
	}
	
	static valueOf(x) {
		return new BigInteger(x);
	}
	
	static probablePrime(bitLength, rnd) {
		return new BigInteger(bitLength ,100 ,rnd);
	}
	
}

BigInteger.ONE = new BigInteger(1);
BigInteger.TEN = new BigInteger(10);
BigInteger.ZERO = new BigInteger(0);
