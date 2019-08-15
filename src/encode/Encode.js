/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Unicode from "./Unicode.js";
import CP932 from "./CP932.js";
import SJIS2004 from "./SJIS2004.js";
import EUCJP from "./EUCJP.js";

/**
 * Encode用のツールクラス
 * @ignore
 */
class EncodeTools {

	/**
	 * キャラセット名の正規化
	 * @param {String} charset 
	 * @returns {String} 
	 */
	static normalizeCharSetName(charset) {
		if(/^(unicode-1-1-utf-8|UTF8)$/i.test(charset)) {
			return "UTF-8";
		}
		else if(/^(csunicode|iso-10646-ucs-2|ucs-2|Unicode|UnicodeFEFF|UTF-16|UTF16|UTF16LE)$/i.test(charset)) {
			return "UTF-16LE";
		}
		else if(/^(UnicodeFFFE|UTF16BE)$/i.test(charset)) {
			return "UTF-16BE";
		}
		else if(/^(utf32_littleendian|UTF-32|UTF32|UTF32LE)$/i.test(charset)) {
			return "UTF-32LE";
		}
		else if(/^(utf32_bigendian|UTF32BE)$/i.test(charset)) {
			return "UTF-32BE";
		}
		else if(/^(csshiftjis|ms_kanji|cp932|ms932|shift-jis|sjis|Windows-31J|x-sjis)$/i.test(charset)) {
			return "Shift_JIS";
		}
		else if(/^(sjis2004|sjis-2004|sjis_2004|shift_jis2004|shift-jis2004|shift-jis-2004)$/i.test(charset)) {
			return "Shift_JIS-2004";
		}
		else if(/^(eucjp|cseucpkdfmtjapanese|x-euc-jp)$/i.test(charset)) {
			return "EUC-JP";
		}
		else if(/^(eucjis2004|euc-jis2004|eucjis-2004|eucjp2004|euc-jp2004|eucjp-2004|euc-jp-2004)$/i.test(charset)) {
			return "EUC-JIS-2004";
		}
		return charset;
	}

	/**
	 * 同一の種別の文字列の重なりをカウントする
	 * @param {Array<number>} utf32_array 
	 * @returns {number} 
	 */
	static countWord(utf32_array) {
		let count = 0;
		let type = 0;
		let old_type = -1;
		for(let i = 0; i < utf32_array.length; i++) {
			const ch = utf32_array[i];
			// a-zA-Z
			if(((0x41 <= ch) && (ch <= 0x5A)) || ((0x61 <= ch) && (ch <= 0x6A))) {
				type = 1;
			}
			// 0-9
			else if((0x30 <= ch) && (ch <= 0x39)) {
				type = 2;
			}
			// ぁ-ん
			else if((0x3041 <= ch) && (ch <= 0x3093)) {
				type = 3;
			}
			// ァ-ン
			else if((0x30A1 <= ch) && (ch <= 0x30F3)) {
				type = 4;
			}
			// CJK統合漢字拡張A - CJK統合漢字, 追加漢字面
			else if(((0x3400 <= ch) && (ch < 0xA000)) || ((0x20000 <= ch) && (ch < 0x2FA20))) {
				type = 5;
			}
			else {
				old_type = -1;
				continue;
			}
			if(type === old_type) {
				count++;
			}
			old_type = type;
		}
		return count;
	}

}

/**
 * 文字データのバイナリへのエンコード、文字列へのデコードを扱うクラス
 * @ignore
 */
export default class Encode {

	/**
	 * 文字列からバイナリ配列にエンコードする
	 * @param {String} text - 変換したいテキスト
	 * @param {String} charset - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
	 * @param {boolean} [is_with_bom=false] - BOMをつけるかどうか
	 * @returns {Array<number>} バイナリ配列(失敗時はnull)
	 */
	static encode(text, charset, is_with_bom) {
		const ncharset = charset ? EncodeTools.normalizeCharSetName(charset) : "autodetect";
		if(/^UTF-(8|16|32)/i.test(ncharset)) {
			const utf32_array = Unicode.toUTF32Array(text);
			return Unicode.toUTFBinaryFromCodePoint(utf32_array, ncharset, is_with_bom);
		}
		else if(/^Shift_JIS$/i.test(ncharset)) {
			return CP932.toCP932Binary(text);
		}
		else if(/^Shift_JIS-2004$/i.test(ncharset)) {
			return SJIS2004.toSJIS2004Binary(text);
		}
		else if(/^EUC-JP$/i.test(ncharset)) {
			return EUCJP.toEUCJPBinary(text);
		}
		else if(/^EUC-JIS-2004$/i.test(ncharset)) {
			return EUCJP.toEUCJIS2004Binary(text);
		}
		return null;
	}

	/**
	 * バイナリ配列から文字列にデコードする
	 * @param {Array<number>} binary - 変換したいバイナリ配列
	 * @param {String} [charset="autodetect"] - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
	 * @returns {String} 変換した文字列（失敗したらnull）
	 */
	static decode(binary, charset) {
		const ncharset = charset ? EncodeTools.normalizeCharSetName(charset) : "autodetect";
		if(/^UTF-(8|16|32)/i.test(ncharset)) {
			const ret = Unicode.toCodePointFromUTFBinary(binary, charset);
			if(ret) {
				return Unicode.fromUTF32Array(ret);
			}
		}
		else if(/^Shift_JIS$/i.test(ncharset)) {
			return CP932.fromCP932Array(binary).decode;
		}
		else if(/^Shift_JIS-2004$/i.test(ncharset)) {
			return SJIS2004.fromSJIS2004Array(binary).decode;
		}
		else if(/^EUC-JP$/i.test(ncharset)) {
			return EUCJP.fromEUCJPBinary(binary).decode;
		}
		else if(/^EUC-JIS-2004$/i.test(ncharset)) {
			return EUCJP.fromEUCJIS2004Binary(binary).decode;
		}
		else if(/autodetect/i.test(ncharset)) {
			// BOMが付いているか調べる
			const withbom = Unicode.getCharsetFromBOM(binary);
			if(withbom) {
				// BOM が付いている場合はUnicodeで変換する
				const ret = Unicode.toCodePointFromUTFBinary(binary, charset);
				if(ret) {
					return Unicode.fromUTF32Array(ret);
				}
			}
			// 有名な文字コードで試す
			let max_data = "";
			let max_count = -1;
			// Shift_JIS
			{
				const text = CP932.fromCP932Array(binary).decode;
				const count = EncodeTools.countWord(Unicode.toUTF32Array(text));
				if(max_count < count) {
					max_data = text;
					max_count = count;
				}
			}
			// EUC-JP-2004
			{
				const text = EUCJP.fromEUCJIS2004Binary(binary).decode;
				const count = EncodeTools.countWord(Unicode.toUTF32Array(text));
				if(max_count < count) {
					max_data = text;
					max_count = count;
				}
			}
			// UTF-8
			{
				const utf32 = Unicode.toCodePointFromUTFBinary(binary, "utf-8");
				const count = EncodeTools.countWord(utf32);
				if(max_count < count) {
					max_data = Unicode.fromUTF32Array(utf32);
					max_count = count;
				}
			}
			// UTF-16LE
			{
				const utf32 = Unicode.toCodePointFromUTFBinary(binary, "utf-16");
				const count = EncodeTools.countWord(utf32);
				if(max_count < count) {
					max_data = Unicode.fromUTF32Array(utf32);
					max_count = count;
				}
			}
			return max_data;
		}
		return null;
	}

}
