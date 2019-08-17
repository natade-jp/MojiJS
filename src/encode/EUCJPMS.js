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
import CP932 from "./CP932.js";

/**
 * eucJP-ms の変換マップ作成用クラス
 * @ignore
 */
class EUCJPMSMAP {

	/**
	 * 変換マップを初期化
	 */
	static init() {
		if(EUCJPMSMAP.is_initmap) {
			return;
		}
		EUCJPMSMAP.is_initmap = true;

		/**
		 * 変換マップ
		 * CP932のIBM拡張文字の一部は、eucJP-msのG3の83区から84区に配列されている。
		 * @type {Object<number, number>}
		 */
		const eucjpms_to_cp932_map = {
			0xf3f3: 0xfa40, 0xf3f4: 0xfa41, 0xf3f5: 0xfa42, 0xf3f6: 0xfa43, 0xf3f7: 0xfa44,
			0xf3f8: 0xfa45, 0xf3f9: 0xfa46, 0xf3fa: 0xfa47, 0xf3fb: 0xfa48, 0xf3fc: 0xfa49, 0xf3fd: 0x8754, 0xf3fe: 0x8755,
			0xf4a1: 0x8756, 0xf4a2: 0x8757, 0xf4a3: 0x8758, 0xf4a4: 0x8759, 0xf4a5: 0x875a, 0xf4a6: 0x875b, 0xf4a7: 0x875c,
			0xf4a8: 0x875d, 0xf4a9: 0xfa56, 0xf4aa: 0xfa57, 0xf4ab: 0x878a, 0xf4ac: 0x8782, 0xf4ad: 0x8784, 0xf4ae: 0xfa62, 0xf4af: 0xfa6a,
			0xf4b0: 0xfa7c, 0xf4b1: 0xfa83, 0xf4b2: 0xfa8a, 0xf4b3: 0xfa8b, 0xf4b4: 0xfa90, 0xf4b5: 0xfa92, 0xf4b6: 0xfa96, 0xf4b7: 0xfa9b,
			0xf4b8: 0xfa9c, 0xf4b9: 0xfa9d, 0xf4ba: 0xfaaa, 0xf4bb: 0xfaae, 0xf4bc: 0xfab0, 0xf4bd: 0xfab1, 0xf4be: 0xfaba, 0xf4bf: 0xfabd,
			0xf4c0: 0xfac1, 0xf4c1: 0xfacd, 0xf4c2: 0xfad0, 0xf4c3: 0xfad5, 0xf4c4: 0xfad8, 0xf4c5: 0xfae0, 0xf4c6: 0xfae5, 0xf4c7: 0xfae8,
			0xf4c8: 0xfaea, 0xf4c9: 0xfaee, 0xf4ca: 0xfaf2, 0xf4cb: 0xfb43, 0xf4cc: 0xfb44, 0xf4cd: 0xfb50, 0xf4ce: 0xfb58, 0xf4cf: 0xfb5e,
			0xf4d0: 0xfb6e, 0xf4d1: 0xfb70, 0xf4d2: 0xfb72, 0xf4d3: 0xfb75, 0xf4d4: 0xfb7c, 0xf4d5: 0xfb7d, 0xf4d6: 0xfb7e, 0xf4d7: 0xfb80,
			0xf4d8: 0xfb82, 0xf4d9: 0xfb85, 0xf4da: 0xfb86, 0xf4db: 0xfb89, 0xf4dc: 0xfb8d, 0xf4dd: 0xfb8e, 0xf4de: 0xfb92, 0xf4df: 0xfb94,
			0xf4e0: 0xfb9d, 0xf4e1: 0xfb9e, 0xf4e2: 0xfb9f, 0xf4e3: 0xfba0, 0xf4e4: 0xfba1, 0xf4e5: 0xfba9, 0xf4e6: 0xfbac, 0xf4e7: 0xfbae,
			0xf4e8: 0xfbb0, 0xf4e9: 0xfbb1, 0xf4ea: 0xfbb3, 0xf4eb: 0xfbb4, 0xf4ec: 0xfbb6, 0xf4ed: 0xfbb7, 0xf4ee: 0xfbb8, 0xf4ef: 0xfbd3,
			0xf4f0: 0xfbda, 0xf4f1: 0xfbe8, 0xf4f2: 0xfbe9, 0xf4f3: 0xfbea, 0xf4f4: 0xfbee, 0xf4f5: 0xfbf0, 0xf4f6: 0xfbf2, 0xf4f7: 0xfbf6,
			0xf4f8: 0xfbf7, 0xf4f9: 0xfbf9, 0xf4fa: 0xfbfa, 0xf4fb: 0xfbfc, 0xf4fc: 0xfc42, 0xf4fd: 0xfc49, 0xf4fe: 0xfc4b
		};

		/**
		 * @type {Object<number, number>}
		 */
		const cp932_to_eucjpms_map = {};
		
		for(const key in eucjpms_to_cp932_map) {
			const x = eucjpms_to_cp932_map[key];
			cp932_to_eucjpms_map[x] = parseInt(key, 10);
		}

		EUCJPMSMAP.cp932_to_eucjpms_map = cp932_to_eucjpms_map;
		EUCJPMSMAP.eucjpms_to_cp932_map = eucjpms_to_cp932_map;
	}
	
	/**
	 * @returns {Object<number, number>}
	 */
	static get CP932_TO_EUCJPMS() {
		EUCJPMSMAP.init();
		return EUCJPMSMAP.cp932_to_eucjpms_map;
	}
	
	/**
	 * @returns {Object<number, number>}
	 */
	static get EUCJPMS_TO_CP932() {
		EUCJPMSMAP.init();
		return EUCJPMSMAP.eucjpms_to_cp932_map;
	}

}

/**
 * 変換マップを初期化したかどうか
 * @type {boolean}
 */
EUCJPMSMAP.is_initmap = false;

/**
 * 変換用マップ
 * @type {Object<number, number>}
 */
EUCJPMSMAP.cp932_to_eucjpms_map = null;

/**
 * 変換用マップ
 * @type {Object<number, number>}
 */
EUCJPMSMAP.eucjpms_to_cp932_map = null;

/**
 * eucJP-ms を扱うクラス
 * 
 * 内部処理用の関数のため変更する可能性が高く、直接利用することをお勧めしません。
 * @deprecated
 */
export default class EUCJPMS {

	/**
	 * 文字列を eucJP-ms のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} eucJP-ms のデータが入ったバイナリ配列
	 */
	static toEUCJPMSBinary(text) {
		const sjis_array = CP932.toCP932Array(text);
		const bin = [];
		const map = EUCJPMSMAP.CP932_TO_EUCJPMS;
		const SS2 = 0x8E; // C1制御文字 シングルシフト2
		const SS3 = 0x8F; // C1制御文字 シングルシフト3
		for(let i = 0; i < sjis_array.length; i++) {
			const code = sjis_array[i];
			const kuten = SJIS.toKuTenFromSJISCode(code);
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
				const eucjpms_code = map[code];
				if(!eucjpms_code) {
					// G1 
					bin.push(kuten.ku + 0xA0);
					bin.push(kuten.ten + 0xA0);
				}
				else {
					// シングルシフト SS3 で G3 を呼び出す。
					// G3 は、eucJP-ms の場合 IBM拡張文字 を表す。
					bin.push(SS3);
					bin.push(eucjpms_code >> 8);
					bin.push(eucjpms_code & 0xff);
				}
			}
		}
		return bin;
	}

	/**
	 * eucJP-ms の配列から文字列に変換
	 * @param {Array<number>} eucjp - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromEUCJPMSBinary(eucjp) {
		const sjis_array = [];
		const ng = "?".charCodeAt(0);
		const map = EUCJPMSMAP.EUCJPMS_TO_CP932;
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
			{
				// 3バイト読み込み(G3)
				if(x1 === SS3) {
					// 文字が足りない
					if(i >= eucjp.length - 2) {
						break;
					}
					x1 = eucjp[i + 1];
					x2 = eucjp[i + 2];
					// シングルシフト SS3 で G3 を呼び出す。
					// G3 は、eucJP-ms の場合 IBM拡張文字 を表す。
					const nec_code = map[(x1 << 8 | x2)];
					if(nec_code) {
						sjis_array.push(nec_code);
					}
					else {
						sjis_array.push(ng);
					}
					i += 2;
					continue;
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
			// 日本語
			const kuten = {
				ku : x1 - 0xA0,
				ten : x2 - 0xA0
			};
			sjis_array.push(SJIS.toSJISCodeFromKuTen(kuten));
		}

		return CP932.fromCP932Array(sjis_array);
	}


}
