/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

class FFT {

	static bit_reverse_32(x) {
		let y = x & 0xffffffff;
		// 1,2,4,8,16ビット単位で交換
		y = ((y & 0x55555555) << 1) | ((y >> 1) & 0x55555555);
		y = ((y & 0x33333333) << 2) | ((y >> 2) & 0x33333333);
		y = ((y & 0x0f0f0f0f) << 4) | ((y >> 4) & 0x0f0f0f0f);
		y = ((y & 0x00ff00ff) << 8) | ((y >> 8) & 0x00ff00ff);
		y = ((y & 0x0000ffff) << 16) | ((y >> 16) & 0x0000ffff);
		return y;
	}
	
	static create_bit_reverse_table(bit) {
		const size = 1 << bit;
		const bitrv = [];
		for(let i = 0; i < size; i++) {
			bitrv[i] = FFT.bit_reverse_32(i) >>> (32 - bit);
		}
		return bitrv;
	}

	/**
	 * 初期化する
	 * @param {Number} size 長さ
	 */
	constructor(size) {
		this.size = size;
		this.inv_size = 1.0 / this.size;
		this.bit_size = Math.round(Math.log(this.size)/Math.log(2));
		this.is_fast = (1 << this.bit_size) === this.size;
		this.bitrv = null;
		this.fft_re = new Array(this.size);
		this.fft_im = new Array(this.size);
		{
			const delta = - 2.0 * Math.PI / this.size;
			let err = 0.0;
			for(let n = 0, x = 0; n < this.size; n++) {
				this.fft_re[n] = Math.cos(x);
				this.fft_im[n] = Math.sin(x);
				// カハンの加算アルゴリズム
				const y = delta + err;
				const t = x + y;
				err = t - x - y;
				x = t;
			}
		}
		if(this.is_fast) {
			this.bitrv = FFT.create_bit_reverse_table(this.bit_size);
		}
	}

	/**
	 * 中のデータを消去する
	 */
	delete() {
		delete this.size;
		delete this.inv_size;
		delete this.bit_size;
		delete this.is_fast;
		delete this.bitrv;
		delete this.fft_re;
		delete this.fft_im;
	}
	
	/**
	 * 離散フーリエ変換
	 * @param {Array} real 実数部
	 * @param {Array} imag 虚数部
	 * @returns {Object}
	 */
	fft(real, imag) {
		const f_re = new Array(this.size);
		const f_im = new Array(this.size);
		if(this.is_fast) {
			for(let i = 0; i < this.size; i++) {
				f_re[i] = real[this.bitrv[i]];
				f_im[i] = imag[this.bitrv[i]];
			}
			{
				// Fast Fourier Transform 時間間引き(前処理にビットリバース)
				// 段々ブロックが大きくなっていくタイプ。
				let center = 1;
				let blocklength = this.size / 2;
				let pointlength = 2;
				for(let delta = 1 << (this.bit_size - 1); delta > 0; delta >>= 1) {
					for(let blocks = 0; blocks < blocklength; blocks++) {
						let i = blocks * pointlength;
						for(let point = 0, n = 0; point < center; point++, i++, n += delta) {
							const re = f_re[i + center] * this.fft_re[n] - f_im[i + center] * this.fft_im[n];
							const im = f_im[i + center] * this.fft_re[n] + f_re[i + center] * this.fft_im[n];
							f_re[i + center] = f_re[i] - re;
							f_im[i + center] = f_im[i] - im;
							f_re[i] += re;
							f_im[i] += im;
						}
					}
					blocklength /= 2;
					pointlength *= 2;
					center *= 2;
				}
			}
		}
		else {
			for(let t = 0; t < this.size; t++) {
				f_re[t] = 0.0;
				f_im[t] = 0.0;
				for(let x = 0, n = 0; x < this.size; x++, n = (x * t) % this.size) {
					f_re[t] += real[x] * this.fft_re[n] - imag[x] * this.fft_im[n];
					f_im[t] += real[x] * this.fft_im[n] + imag[x] * this.fft_re[n];
				}
			}
		}
		return {
			real : f_re,
			imag : f_im
		};
	}

	/**
	 * 逆離散フーリエ変換
	 * @param {Array} real 実数部
	 * @param {Array} imag 虚数部
	 * @returns {Object}
	 */
	ifft(real, imag) {
		const f_re = new Array(this.size);
		const f_im = new Array(this.size);
		if(this.is_fast) {
			for(let i = 0; i < this.size; i++) {
				f_re[i] = real[this.bitrv[i]];
				f_im[i] = imag[this.bitrv[i]];
			}
			{
				// Inverse Fast Fourier Transform 時間間引き(前処理にビットリバース)
				// 段々ブロックが大きくなっていくタイプ。
				let center = 1;
				let blocklength = this.size / 2;
				let pointlength = 2;
				let re, im;
				for(let delta = 1 << (this.bit_size - 1); delta > 0; delta >>= 1) {
					for(let blocks = 0; blocks < blocklength; blocks++) {
						let i = blocks * pointlength;
						for(let point = 0, n = 0; point < center; point++, i++, n += delta) {
							re = f_re[i + center] * this.fft_re[n] + f_im[i + center] * this.fft_im[n];
							im = f_im[i + center] * this.fft_re[n] - f_re[i + center] * this.fft_im[n];
							f_re[i + center] = f_re[i] - re;
							f_im[i + center] = f_im[i] - im;
							f_re[i] += re;
							f_im[i] += im;
						}
					}
					blocklength /= 2;
					pointlength *= 2;
					center *= 2;
				}
			}
		}
		else {
			for(let x = 0; x < this.size; x++) {
				f_re[x] = 0.0;
				f_im[x] = 0.0;
				for(let t = 0, n = 0; t < this.size; t++, n = (x * t) % this.size) {
					f_re[x] +=   real[t] * this.fft_re[n] + imag[t] * this.fft_im[n];
					f_im[x] += - real[t] * this.fft_im[n] + imag[t] * this.fft_re[n];
				}
			}
		}
		for(let i = 0; i < this.size; i++) {
			f_re[i] *= this.inv_size;
			f_im[i] *= this.inv_size;
		}
		return {
			real : f_re,
			imag : f_im
		};
	}
}

class Chash {
	
	/**
	 * 簡易キャッシュ
	 * @param {Number} chash_size キャッシュの最大サイズ
	 * @param {Object} object 作成するオブジェクト
	 * @returns {Object}
	 */
	constructor(chash_size, object) {
		this.object = object;
		this.table_max = chash_size;
		this.table_size = 0;
		this.table = [];
	}

	/**
	 * 指定した長さのデータを作成する。キャッシュに存在すればキャッシュから使用する。
	 * @param {Number} size 作成するオブジェクトのサイズ
	 * @returns {Object}
	 */
	get(size) {
		for(let index = 0; index < this.table_size; index++) {
			if(this.table[index].size === size) {
				// 先頭にもってくる
				const object = this.table.splice(index, 1);
				this.table.unshift(object);
				return object;
			}
		}
		const new_object = new this.object(size);
		if(this.table_size === this.table_max) {
			// 後ろのデータを消去
			const delete_object = this.table.pop();
			delete_object.delete();
		}
		// 前方に追加
		this.table.unshift(new_object);
		return new_object;
	}

}

const fft_chash = new Chash(4, FFT);

export default class Signal {
	
	/**
	 * 離散フーリエ変換
	 * @param {Array} real 実数部
	 * @param {Array} imag 虚数部
	 * @returns {Object}
	 */
	static fft(real, imag) {
		const obj = fft_chash.get(real.length);	
		return obj.fft(real, imag);
	}

	/**
	 * 逆離散フーリエ変換
	 * @param {Array} real 実数部
	 * @param {Array} imag 虚数部
	 * @returns {Object}
	 */
	static ifft(real, imag) {
		const obj = fft_chash.get(real.length);	
		return obj.ifft(real, imag);
	}

}

/*
{
	const X1 = [1];
	const Y1 = [j];
	const A = Signal.fft(X1, Y1);
	const B = Signal.ifft(A.real, A.imag);

	console.log(X1);
	console.log(Y1);
	console.log(A.real);
	console.log(A.imag);
	console.log(B.real);
	console.log(B.imag);
}
*/

/*
{
	const X1 = [1,-2,3,-4];
	const Y1 = [-100,20,-300,40];
	const A = Signal.fft(X1, Y1);
	const B = Signal.ifft(A.real, A.imag);

	console.log(X1);
	console.log(Y1);
	console.log(A.real);
	console.log(A.imag);
	console.log(B.real);
	console.log(B.imag);
}
*/

/*
{
	const fft = new FFT(8);
	const X1 = [1,-2,3,-4,32,16,64,-40];
	const Y1 = [-100,20,-300,40,1,2,1,2];
	const A = fft.fft(X1, Y1);
	const B = fft.ifft(A.real, A.imag);

	console.log(X1);
	console.log(Y1);
	console.log(A.real);
	console.log(A.imag);
	console.log(B.real);
	console.log(B.imag);
}
*/

/*
{
	const fft = new FFT(5);
	const X1 = [1,-2,-3,-32,40];
	const Y1 = [-100,20,-300,-40,40];
	const A = fft.fft(X1, Y1);
	const B = fft.ifft(A.real, A.imag);

	console.log(X1);
	console.log(Y1);
	console.log(A.real);
	console.log(A.imag);
	console.log(B.real);
	console.log(B.imag);
}
*/