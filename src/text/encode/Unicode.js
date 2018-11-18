/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const Unicode = {

	/**
	 * サロゲートペアの上位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isHighSurrogateAt: function(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDBFF));
	},

	/**
	 * サロゲートペアの下位
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isLowSurrogateAt: function(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xDC00 <= ch) && (ch <= 0xDFFF));
	},
	
	/**
	 * サロゲートペアか
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Boolean} 確認結果
	 */
	isSurrogatePairAt: function(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDFFF));
	},
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	codePointAt: function(text, index) {
		if(Unicode.isHighSurrogateAt(text, index)) {
			const high = text.charCodeAt(index);
			const low  = text.charCodeAt(index + 1);
			return ((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
		}
		else {
			return (text.charCodeAt(index));
		}
	},

	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text 対象テキスト
	 * @param {Number} index インデックス
	 * @returns {Number} コードポイント
	 */
	codePointBefore: function(text, index) {
		if(!Unicode.isLowSurrogateAt(text, index - 1)) {
			return (text.charCodeAt(index - 1));
		}
		else {
			return (text.codePointAt(index - 2));
		}
	},

	/**
	 * コードポイント換算で文字列数を調査する
	 * @param {String} text 対象テキスト
	 * @param {Number} beginIndex 最初のインデックス（省略可）
	 * @param {Number} endIndex 最後のインデックス（ここは含めない）（省略可）
	 * @returns {Number} 文字数
	 */
	codePointCount: function(text, beginIndex, endIndex) {
		if(arguments.length < 2) {
			beginIndex = 0;
		}
		if(arguments.length < 3) {
			endIndex = text.length;
		}
		let count = 0;
		for(;beginIndex < endIndex;beginIndex++) {
			count++;
			if(Unicode.isSurrogatePairAt(text, beginIndex)) {
				beginIndex++;
			}
		}
		return count;
	},

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {String} text 対象テキスト
	 * @param {Number} index オフセット
	 * @param {Number} codePointOffset ずらすコードポイント数
	 * @returns {Number} ずらしたインデックス
	 */
	offsetByCodePoints: function(text, index, codePointOffset) {
		let count = 0;
		if(codePointOffset === 0) {
			return (index);
		}
		if(codePointOffset > 0) {
			for(;index < text.length;index++) {
				count++;
				if(Unicode.isHighSurrogateAt(text, index)) {
					index++;
				}
				if(count === codePointOffset) {
					return (index + 1);
				}
			}

		}
		else {
			codePointOffset = -codePointOffset;
			for(;index >= 0;index--) {
				count++;
				if(Unicode.isLowSurrogateAt(text, index - 1)) {
					index--;
				}
				if(count === codePointOffset) {
					return (index - 1);
				}
			}
		}
		return false;
	},

	/**
	 * コードポイントの数値データを文字列へ変換します
	 * @param {Array} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	fromCodePoint: function() {
		let codepoint_array = [];
		if(arguments[0].length) {
			codepoint_array = arguments[0];
		}
		else {
			codepoint_array = arguments;
		}
		const text = [];
		for(let i = 0;i < codepoint_array.length;i++) {
			const codepoint = codepoint_array[i];
			if(0x10000 <= codepoint) {
				const high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
				const low  = (codepoint & 0x3FF) + 0xDC00;
				text[text.length] = String.fromCharCode(high);
				text[text.length] = String.fromCharCode(low);
			}
			else {
				text[text.length] = String.fromCharCode(codepoint);
			}
		}
		return(text.join(""));
	},

	/**
	 * 文字列をUTF32(コードポイント)の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF32(コードポイント)のデータが入った配列
	 */
	toUTF32Array: function(text) {
		const utf32 = [];
		for(let i = 0; i < text.length; i = Unicode.offsetByCodePoints(text, i, 1)) {
			utf32.push(Unicode.codePointAt(text, i));
		}
		return utf32;
	},

	/**
	 * UTF32の配列から文字列へ戻します。
	 * @param {Array} utf32 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	fromUTF32Array: function(utf32) {
		return Unicode.fromCodePoint(utf32);
	},

	/**
	 * 文字列をUTF16の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF16のデータが入った配列
	 */
	toUTF16Array: function(text) {
		const utf16 = [];
		for(let i = 0; i < text.length; i++) {
			utf16[i] = text.charCodeAt(i);
		}
		return utf16;
	},

	/**
	 * UTF16の配列から文字列へ戻します。
	 * @param {Array} utf16 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	fromUTF16Array: function(utf16) {
		const text = [];
		for(let i = 0; i < utf16.length; i++) {
			text[i] = String.fromCharCode(utf16[i]);
		}
		return text.join("");
	},

	/**
	 * 文字列をUTF8の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @returns {Array} UTF8のデータが入った配列
	 */
	toUTF8Array: function(text) {
		const utf32 = Unicode.toUTF32Array(text);
		const utf8 = [];
		for(let i = 0; i < utf32.length; i++) {
			let codepoint = utf32[i];
			// 1バイト文字
			if(codepoint <= 0x7F) {
				utf8.push(codepoint);
				continue;
			}
			const buffer = [];
			let size = 0;
			// 2バイト以上
			if(codepoint < 0x800) {
				size = 2;
			}
			else if(codepoint < 0x10000) {
				size = 3;
			}
			else {
				size = 4;
			}
			for(let j = 0; j < size; j++) {
				let write = codepoint & ((1 << 6) - 1);
				if(j === size - 1) {
					if(size === 2) {
						write |= 0xC0; // 1100 0000
					}
					else if(size === 3) {
						write |= 0xE0; // 1110 0000
					}
					else {
						write |= 0xF0; // 1111 0000
					}
					buffer.push(write);
					break;
				}
				buffer.push(write | 0x80); // 1000 0000
				codepoint = codepoint >> 6;
			}
			// 反転
			for(let j = buffer.length - 1; j >= 0; j--) {
				utf8.push(buffer[j]);
			}
		}
		return utf8;
	},

	/**
	 * UTF8の配列から文字列へ戻します。
	 * @param {Array} utf8 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	fromUTF8Array: function(utf8) {
		const utf32 = [];
		let size = 0;
		let write = 0;
		for(let i = 0; i < utf8.length; i++) {
			const bin = utf8[i];
			if(bin < 0x80) {
				utf32.push(bin);
			}
			if(size === 0) {
				if(bin < 0xE0) {
					size = 1;
					write = bin & 0x1F; // 0001 1111
				}
				else if(bin < 0xF0) {
					size = 2;
					write = bin & 0xF; // 0000 1111
				}
				else {
					size = 3;
					write = bin & 0x7; // 0000 0111
				}
			}
			else {
				write <<= 6;
				write |= bin & 0x3F; // 0011 1111
				size--;
				if(size === 0) {
					utf32.push(write);
				}
			}
		}
		return Unicode.fromCodePoint(utf32);
	},

	/**
	 * 指定したテキストを切り出します。
	 * 単位は文字数となります。
	 * @param {String} text 切り出したいテキスト
	 * @param {Number} offset 切り出し位置
	 * @param {Number} size 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	cutTextForCodePoint: function(text, offset, size) {
		const utf32 = Unicode.toUTF32Array(text);
		const cut = [];
		for(let i = 0, point = offset; ((i < size) && (point < utf32.length)); i++, point++) {
			cut.push(utf32[point]);
		}
		return Unicode.fromUTF32Array(cut);
	}

};

export default Unicode;