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
import SJIS2004 from "./SJIS2004.js";

/**
 * EUC-JP の変換に使用するツール群
 * @ignore
 */
class EUCJPTools {

	/**
	 * SJISの配列からEUC-JPのバイナリ配列を作成する。
	 * @param {Array<number>} sjis_array - 変換したいのSJISテキスト
	 * @param {function(number): import("./SJIS.js").MenKuTen} menkuten - 面区点コード変換関数
	 * @returns {Array<number>} EUC-JPのデータが入ったバイナリ配列
	 */
	static toEUCJPBinaryFromSJISArray(sjis_array, menkuten) {
		const bin = [];
		for(let i = 0; i < sjis_array.length; i++) {
			const code = sjis_array[i];
			const kuten = menkuten(code);
			if(code < 0x80) {
				bin.push(code);
			}
			else {
				// 半角カタカナの扱い
				if(code < 0xE0) {
					bin.push(0x80);
					bin.push(code);
				}
				else {
					if(kuten.men === 2) {
						// シングルシフト SS3 で G3 を呼び出す。
						// G3 は JIS X 0213:2004 の2面を表す
						bin.push(0x8F);
					}
					bin.push(kuten.ku + 0xA0);
					bin.push(kuten.ten + 0xA0);
				}
			}
		}
		return bin;
	}

	/**
	 * EUC-JPのバイナリ配列からSJISの配列を作成する。
	 * @param {Array<number>} eucjp - 変換したいテキスト
	 * @param {function(import("./SJIS.js").MenKuTen): number} menkuten - 面区点コード変換関数
	 * @returns {Array<number>} SJISの配列
	 */
	static toSJISArrayFromEUCJPBinary(eucjp, menkuten) {
		const sjis_array = [];
		const SS3 = 0x8F; // シングルシフト SS3
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
			if(x1 === SS3) {
				// 文字が足りない
				if(i >= eucjp.length - 2) {
					break;
				}
				// シングルシフト SS3 で G3 を呼び出す。
				// G3 は JIS X 0213:2004 の2面を表す
				men = 2;
				x1 = eucjp[i + 1];
				x2 = eucjp[i + 2];
				i += 2;
			}
			else {
				x2 = eucjp[i + 1];
				i += 1;
			}
			// 半角カタカナ
			if(x1 === 0x80) {
				sjis_array.push(x2);
				continue;
			}
			// 日本語
			const kuten = {
				men : men,
				ku : x1 - 0xA0,
				ten : x2 - 0xA0
			};
			sjis_array.push(menkuten(kuten));
		}
		return sjis_array;
	}

}


/**
 * EUC-JP を扱うクラス
 * 
 * 内部処理用の関数のため変更する可能性が高く、直接利用することをお勧めしません。
 * @deprecated
 */
export default class EUCJP {

	/**
	 * 文字列を EUC-JP のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} EUC-JP(CP51932) のデータが入ったバイナリ配列
	 */
	static toEUCJPBinary(text) {
		return EUCJPTools.toEUCJPBinaryFromSJISArray(CP932.toCP932Array(text).encode, SJIS.toKuTenFromSJISCode);
	}

	/**
	 * EUC-JP の配列から文字列に変換
	 * @param {Array<number>} eucjp - 変換したいテキスト
	 * @returns {{decode : String, ng_count : number}} 変換後のテキスト
	 */
	static fromEUCJPBinary(eucjp) {
		return CP932.fromCP932Array(EUCJPTools.toSJISArrayFromEUCJPBinary(eucjp, SJIS.toSJISCodeFromKuTen));
	}

	/**
	 * 文字列を EUC-JIS-2004 のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} EUC-JIS-2004 のデータが入ったバイナリ配列
	 */
	static toEUCJIS2004Binary(text) {
		return EUCJPTools.toEUCJPBinaryFromSJISArray(SJIS2004.toSJIS2004Array(text).encode, SJIS.toMenKuTenFromSJIS2004Code);
	}

	/**
	 * EUC-JIS-2004 の配列から文字列に変換
	 * @param {Array<number>} eucjp - 変換したいテキスト
	 * @returns {{decode : String, ng_count : number}} 変換後のテキスト
	 */
	static fromEUCJIS2004Binary(eucjp) {
		return SJIS2004.fromSJIS2004Array(EUCJPTools.toSJISArrayFromEUCJPBinary(eucjp, SJIS.toSJISCodeFromKuTen));
	}

}
