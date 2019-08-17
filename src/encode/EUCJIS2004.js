/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import SJIS from "./SJIS.js";
import SJIS2004 from "./SJIS2004.js";

/**
 * EUC-JIS-2004 を扱うクラス
 * 
 * 内部処理用の関数のため変更する可能性が高く、直接利用することをお勧めしません。
 * @deprecated
 */
export default class EUCJIS2004 {

	/**
	 * 文字列を EUC-JIS-2004 のバイナリ配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} EUC-JIS-2004 のデータが入ったバイナリ配列
	 */
	static toEUCJIS2004Binary(text) {
		const sjis_array = SJIS2004.toSJIS2004Array(text);
		const bin = [];
		const ng = "?".charCodeAt(0);
		const SS2 = 0x8E; // C1制御文字 シングルシフト2
		const SS3 = 0x8F; // C1制御文字 シングルシフト3
		for(let i = 0; i < sjis_array.length; i++) {
			const code = sjis_array[i];
			const kuten = SJIS.toMenKuTenFromSJIS2004Code(code);
			if(code < 0x80) {
				// G0 ASCII
				bin.push(code);
			}
			else if(code < 0xE0) {
				// G2 半角カタカナ
				bin.push(SS2);
				bin.push(code);
			}
			else {
				// G1 と G3 を切り替える 
				if(kuten.men === 2) {
					// シングルシフト SS3 で G3 を呼び出す。
					// G3 は JIS X 0213:2004 の2面を表す
					bin.push(SS3);
				}
				if(kuten.ku <= 94) {
					// 区点は94まで利用できる。
					// つまり、最大でも 94 + 0xA0 = 0xFE となり 0xFF 以上にならない
					bin.push(kuten.ku + 0xA0);
					bin.push(kuten.ten + 0xA0);
				}
				else {
					bin.push(ng);
				}
			}
		}
		return bin;
	}

	/**
	 * EUC-JIS-2004 の配列から文字列に変換
	 * @param {Array<number>} eucjp - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromEUCJIS2004Binary(eucjp) {
		const sjis_array = [];
		const SS2 = 0x8E; // C1制御文字 シングルシフト2
		const SS3 = 0x8F; // C1制御文字 シングルシフト3
		for(let i = 0; i < eucjp.length; i++) {
			let x1, x2;
			x1 = eucjp[i];
			// ASCII
			if(x1 < 0x80) {
				sjis_array.push(x1);
				continue;
			}
			if(i >= eucjp.length - 1) {
				// 文字が足りない
				break;
			}
			let men = 1;
			{
				// 3バイト読み込み(G3)
				if(x1 === SS3) {
					// 文字が足りない
					if(i >= eucjp.length - 2) {
						break;
					}
					// シングルシフト SS3 で G3 を呼び出す。
					// G3 は、EUC-JIS-2000 の場合 JIS X 0213:2004 の2面を表す
					men = 2;
					x1 = eucjp[i + 1];
					x2 = eucjp[i + 2];
					i += 2;
				}
				// 2バイト読み込み
				else {
					x2 = eucjp[i + 1];
					i += 1;
				}
			}
			// 半角カタカナ
			if(x1 === SS2) {
				sjis_array.push(x2);
				continue;
			}
			// EUC-JIS-2000 JIS X 0213:2004 の2面に対応
			// 日本語
			const kuten = {
				men : men,
				ku : x1 - 0xA0,
				ten : x2 - 0xA0
			};
			sjis_array.push(SJIS.toSJIS2004CodeFromMenKuTen(kuten));
		}
		return SJIS2004.fromSJIS2004Array(sjis_array);
	}

}
