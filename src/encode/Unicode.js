/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * Unicode を扱うクラス
 * @ignore
 */
export default class Unicode {

	/**
	 * 上位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isHighSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDBFF));
	}

	/**
	 * 下位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isLowSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xDC00 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isSurrogatePairAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text - 対象テキスト
	 * @param {Number} [index = 0] - インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointAt(text, index) {
		const index_ = (index !== undefined) ? index : 0;
		if(Unicode.isHighSurrogateAt(text, index_)) {
			const high = text.charCodeAt(index_);
			const low  = text.charCodeAt(index_ + 1);
			return ((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
		}
		else {
			return (text.charCodeAt(index_));
		}
	}

	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointBefore(text, index) {
		if(!Unicode.isLowSurrogateAt(text, index - 1)) {
			return (text.charCodeAt(index - 1));
		}
		else {
			return (text.codePointAt(index - 2));
		}
	}

	/**
	 * コードポイント換算で文字列数をカウント
	 * @param {String} text - 対象テキスト
	 * @param {Number} [beginIndex=0] - 最初のインデックス（省略可）
	 * @param {Number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
	 * @returns {Number} 文字数
	 */
	static codePointCount(text, beginIndex, endIndex) {
		if(beginIndex === undefined) {
			beginIndex = 0;
		}
		if(endIndex === undefined) {
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
	}

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - オフセット
	 * @param {Number} codePointOffset - ずらすコードポイント数
	 * @returns {Number} ずらしたインデックス
	 */
	static offsetByCodePoints(text, index, codePointOffset) {
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
		throw "error offsetByCodePoints";
	}

	/**
	 * コードポイントの数値データをUTF16の配列に変換
	 * @param {...(number|Array<number>)} codepoint - 変換したいUTF-32の配列、又はコードポイントを並べた可変引数
	 * @returns {Array<number>} 変換後のテキスト
	 */
	static toUTF16ArrayFromCodePoint() {
		/**
		 * @type {Array<number>}
		 */
		const utf16_array = [];
		/**
		 * @type {Array<number>}
		 */
		let codepoint_array = [];
		if(arguments[0].length) {
			codepoint_array = arguments[0];
		}
		else {
			for(let i = 0;i < arguments.length;i++) {
				codepoint_array[i] = arguments[i];
			}
		}
		for(let i = 0;i < codepoint_array.length;i++) {
			const codepoint = codepoint_array[i];
			if(0x10000 <= codepoint) {
				const high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
				const low  = (codepoint & 0x3FF) + 0xDC00;
				utf16_array.push(high);
				utf16_array.push(low);
			}
			else {
				utf16_array.push(codepoint);
			}
		}
		return utf16_array;
	}

	/**
	 * コードポイントの数値データを文字列に変換
	 * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
	 * @returns {String} 変換後のテキスト
	 */
	static fromCodePoint(codepoint) {
		let utf16_array = null;
		if(codepoint instanceof Array) {
			utf16_array = Unicode.toUTF16ArrayFromCodePoint(codepoint);
		}
		else {
			const codepoint_array = [];
			for(let i = 0;i < arguments.length;i++) {
				codepoint_array[i] = arguments[i];
			}
			utf16_array = Unicode.toUTF16ArrayFromCodePoint(codepoint_array);
		}
		const text = [];
		for(let i = 0;i < utf16_array.length;i++) {
			text[text.length] = String.fromCharCode(utf16_array[i]);
		}
		return(text.join(""));
	}

	/**
	 * 文字列をUTF32(コードポイント)の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
	 */
	static toUTF32Array(text) {
		const utf32 = [];
		for(let i = 0; i < text.length; i = Unicode.offsetByCodePoints(text, i, 1)) {
			utf32.push(Unicode.codePointAt(text, i));
		}
		return utf32;
	}

	/**
	 * UTF32の配列から文字列に変換
	 * @param {Array<number>} utf32 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF32Array(utf32) {
		return Unicode.fromCodePoint(utf32);
	}

	/**
	 * 文字列をUTF16の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF16のデータが入った配列
	 */
	static toUTF16Array(text) {
		const utf16 = [];
		for(let i = 0; i < text.length; i++) {
			utf16[i] = text.charCodeAt(i);
		}
		return utf16;
	}

	/**
	 * UTF16の配列から文字列に変換
	 * @param {Array<number>} utf16 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF16Array(utf16) {
		const text = [];
		for(let i = 0; i < utf16.length; i++) {
			text[i] = String.fromCharCode(utf16[i]);
		}
		return text.join("");
	}

	/**
	 * 文字列をUTF8の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF8のデータが入った配列
	 */
	static toUTF8Array(text) {
		return Unicode.toUTFBinaryFromCodePoint(Unicode.toUTF32Array(text), "utf-8", false);
	}

	/**
	 * UTF8の配列から文字列に変換
	 * @param {Array<number>} utf8 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF8Array(utf8) {
		return Unicode.fromCodePoint(Unicode.toCodePointFromUTFBinary(utf8, "utf-8"));
	}

	/**
	 * 指定したテキストを切り出す
	 * - 単位は文字数
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCodePoint(text, offset, size) {
		const utf32 = Unicode.toUTF32Array(text);
		const cut = [];
		for(let i = 0, point = offset; ((i < size) && (point < utf32.length)); i++, point++) {
			cut.push(utf32[point]);
		}
		return Unicode.fromUTF32Array(cut);
	}

	/**
	 * UTFのバイナリ配列からバイトオーダーマーク(BOM)を調査する
	 * @param {Array<number>} utfbinary - 調査するバイナリ配列
	 * @returns {string} 符号化形式(不明時はnull)
	 */
	static getCharsetFromBOM(utfbinary) {
		if(utfbinary.length >= 4) {
			if((utfbinary[0] === 0x00) && (utfbinary[1] === 0x00) && (utfbinary[2] === 0xFE) && (utfbinary[3] === 0xFF)) {
				return "UTF-32BE";
			}
			if((utfbinary[0] === 0xFF) && (utfbinary[1] === 0xFE) && (utfbinary[2] === 0x00) && (utfbinary[3] === 0x00)) {
				return "UTF-32LE";
			}
		}
		if(utfbinary.length >= 3) {
			if((utfbinary[0] === 0xEF) && (utfbinary[1] === 0xBB) && (utfbinary[2] === 0xBF)) {
				return "UTF-8";
			}
		}
		if(utfbinary.length >= 2) {
			if((utfbinary[0] === 0xFE) && (utfbinary[1] === 0xFF)) {
				return "UTF-16BE";
			}
			if((utfbinary[0] === 0xFF) && (utfbinary[1] === 0xFE)) {
				return "UTF-16LE";
			}
		}
		return null;
	}

	/**
	 * UTFのバイナリ配列からコードポイントに変換
	 * @param {Array<number>} binary - 変換したいバイナリ配列
	 * @param {String} [charset] - UTFの種類（省略した場合はBOM付きを期待する）
	 * @returns {Array<number>} コードポイントの配列(失敗時はnull)
	 */
	static toCodePointFromUTFBinary(binary, charset) {
		const utf32_array = [];
		let check_charset = charset;
		let offset = 0;
		// バイトオーダーマーク(BOM)がある場合は BOM を優先
		const charset_for_bom = Unicode.getCharsetFromBOM(binary);
		if(charset_for_bom) {
			check_charset = charset_for_bom;
			if(/utf-?8/i.test(charset_for_bom)) {
				offset = 3;
			}
			else if(/utf-?16/i.test(charset_for_bom)) {
				offset = 2;
			}
			else if(/utf-?32/i.test(charset_for_bom)) {
				offset = 4;
			}
		}
		// BOM付きではない＋指定もしていないので変換失敗
		if(!charset_for_bom && !charset) {
			return null;
		}
		// UTF-8
		if(/utf-?8n?/i.test(check_charset)) {
			let size = 0;
			let write = 0;
			for(let i = offset; i < binary.length; i++) {
				const bin = binary[i];
				if(size === 0) {
					if(bin < 0x80) {
						utf32_array.push(bin);
					}
					else if(bin < 0xE0) {
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
						utf32_array.push(write);
					}
				}
			}
			return utf32_array;
		}
		// UTF-16
		else if(/utf-?16/i.test(check_charset)) {
			// UTF-16 につめる
			const utf16 = [];
			// UTF-16BE
			if(/utf-?16(be)/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 2) {
					utf16.push((binary[i] << 8) | binary[i + 1]);
				}
			}
			// UTF-16LE
			else if(/utf-?16(le)?/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 2) {
					utf16.push(binary[i] | (binary[i + 1] << 8));
				}
			}
			// UTF-32 につめる
			for(let i = 0; i < utf16.length; i++) {
				if((0xD800 <= utf16[i]) && (utf16[i] <= 0xDBFF)) {
					if(i + 2 <= utf16.length) {
						const high = utf16[i];
						const low  = utf16[i + 1];
						utf32_array.push((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
					}
					i++;
				}
				else {
					utf32_array.push(utf16[i]);
				}
			}
			return utf32_array;
		}
		// UTF-32
		else {
			// UTF-32BE
			if(/utf-?32(be)/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 4) {
					utf32_array.push((binary[i] << 24) | (binary[i + 1] << 16) | (binary[i + 2] << 8) | binary[i + 3]);
				}
				return utf32_array;
			}
			// UTF-32LE
			else if(/utf-?32(le)?/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 4) {
					utf32_array.push(binary[i] | (binary[i + 1] << 8) | (binary[i + 2] << 16) | (binary[i + 3] << 24));
				}
				return utf32_array;
			}
		}
		return null;
	}

	/**
	 * UTF32配列からバイナリ配列に変換
	 * @param {Array<number>} utf32_array - 変換したいUTF-32配列
	 * @param {String} charset - UTFの種類
	 * @param {boolean} [is_with_bom=true] - BOMをつけるかどうか
	 * @returns {Array<number>} バイナリ配列(失敗時はnull)
	 */
	static toUTFBinaryFromCodePoint(utf32_array, charset, is_with_bom) {
		let is_with_bom_ = is_with_bom !== undefined ? is_with_bom : true;
		// charset に" with BOM" が入っている場合はBOM付きとする
		if(/\s+with\s+bom$/i.test(charset)) {
			is_with_bom_ = true;
		}
		/**
		 * @type {Array<number>}
		 */
		const binary = [];
		// UTF-8
		if(/utf-?8n?/i.test(charset)) {
			// bom をつける
			if(is_with_bom_) {
				binary.push(0xEF);
				binary.push(0xBB);
				binary.push(0xBF);
			}
			for(let i = 0; i < utf32_array.length; i++) {
				let codepoint = utf32_array[i];
				// 1バイト文字
				if(codepoint <= 0x7F) {
					binary.push(codepoint);
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
					binary.push(buffer[j]);
				}
			}
			return binary;
		}
		// UTF-16
		else if(/utf-?16/i.test(charset)) {
			// UTF-16 に詰め替える
			const utf16_array = Unicode.toUTF16ArrayFromCodePoint(utf32_array);
			// UTF-16BE
			if(/utf-?16(be)/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFE);
					binary.push(0xFF);
				}
				for(let i = 0; i < utf16_array.length; i++ ) {
					binary.push(utf16_array[i] >> 8);
					binary.push(utf16_array[i] & 0xff);
				}
			}
			// UTF-16LE
			else if(/utf-?16(le)?/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFF);
					binary.push(0xFE);
				}
				for(let i = 0; i < utf16_array.length; i++ ) {
					binary.push(utf16_array[i] & 0xff);
					binary.push(utf16_array[i] >> 8);
				}
			}
			return binary;
		}
		// UTF-32
		else if(/utf-?32/i.test(charset)) {
			// UTF-32BE
			if(/utf-?32(be)/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0x00);
					binary.push(0x00);
					binary.push(0xFE);
					binary.push(0xFF);
				}
				for(let i = 0; i < utf32_array.length; i++) {
					binary.push((utf32_array[i] >> 24) & 0xff);
					binary.push((utf32_array[i] >> 16) & 0xff);
					binary.push((utf32_array[i] >> 8) & 0xff);
					binary.push(utf32_array[i] & 0xff);
				}
			}
			// UTF-32LE
			else if(/utf-?32(le)?/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFF);
					binary.push(0xFE);
					binary.push(0x00);
					binary.push(0x00);
				}
				for(let i = 0; i < utf32_array.length; i++) {
					binary.push(utf32_array[i] & 0xff);
					binary.push((utf32_array[i] >> 8) & 0xff);
					binary.push((utf32_array[i] >> 16) & 0xff);
					binary.push((utf32_array[i] >> 24) & 0xff);
				}
			}
			return binary;
		}
		return null;
	}

	/**
	 * コードポイントから異体字セレクタの判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isVariationSelectorFromCodePoint(codepoint) {
		return (
			// モンゴル自由字形選択子 U+180B〜U+180D (3個)
			((0x180B <= codepoint) && (codepoint <= 0x180D)) ||
			// SVSで利用される異体字セレクタ U+FE00〜U+FE0F (VS1～VS16) (16個)
			((0xFE00 <= codepoint) && (codepoint <= 0xFE0F)) ||
			// IVSで利用される異体字セレクタ U+E0100〜U+E01EF (VS17～VS256) (240個)
			((0xE0100 <= codepoint) && (codepoint <= 0xE01EF))
		);
	}

	/**
	 * コードポイントから結合文字の判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isCombiningMarkFromCodePoint(codepoint) {
		try {
			new RegExp("\\p{Mark}", "u");
			return /\p{Mark}/u.test(String.fromCodePoint(codepoint));
		} catch (e) {
			// フォールバック処理
			return (
				// Combining Diacritical Marks
				((0x0300 <= codepoint) && (codepoint <= 0x036F)) ||
				// Combining Diacritical Marks Extended
				((0x1AB0 <= codepoint) && (codepoint <= 0x1AFF)) ||
				// Combining Diacritical Marks Supplement
				((0x1DC0 <= codepoint) && (codepoint <= 0x1DFF)) ||
				// Combining Diacritical Marks for Symbols
				((0x20D0 <= codepoint) && (codepoint <= 0x20FF)) ||
				// 日本語に含まれる2種類の文字
				// COMBINING VOICED SOUND MARK
				// COMBINING SEMI-VOICED SOUND MARK
				((0x3099 <= codepoint) && (codepoint <= 0x309A)) ||
				// Combining Half Marks
				((0xFE20 <= codepoint) && (codepoint <= 0xFE2F))
			);
		}
	}



}
