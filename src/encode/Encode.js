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
			// 有名な文字コードで試していく
			// UTF-8
			{
				const text = Unicode.fromUTF32Array(Unicode.toCodePointFromUTFBinary(binary, "utf-8"));
				if(CP932.toCP932Array(text).ng_count === 0) {
					return text;
				}
			}
			// UTF-16LE
			{
				const text = Unicode.fromUTF32Array(Unicode.toCodePointFromUTFBinary(binary, "utf-16"));
				if(CP932.toCP932Array(text).ng_count === 0) {
					return text;
				}
			}
			// Shift_JIS
			{
				const text = CP932.fromCP932Array(binary);
				if(text.ng_count === 0) {
					return text.decode;
				}
			}
		}
		return null;
	}

}
