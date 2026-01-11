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
class Unicode {

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
 * 面区点情報
 * @typedef {Object} MenKuTen
 * @property {string} [text] 面-区-点
 * @property {number} [men=1] 面
 * @property {number} ku 区
 * @property {number} ten 点
 */

/**
 * Shift_JIS を扱うクラス
 * @ignore
 */
class SJIS {

	/**
	 * 文字列を Shift_JIS の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS への変換マップ
	 * @returns {Array<number>} Shift_JIS のデータが入った配列
	 * @ignore
	 */
	static toSJISArray(text, unicode_to_sjis) {
		const map = unicode_to_sjis;
		const utf32 = Unicode.toUTF32Array(text);
		const sjis = [];
		const ng = "?".charCodeAt(0);
		for(let i = 0; i < utf32.length; i++) {
			const map_bin = map[utf32[i]];
			if(map_bin) {
				sjis.push(map_bin);
			}
			else {
				sjis.push(ng);
			}
		}
		return sjis;
	}

	/**
	 * 文字列を Shift_JIS のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS への変換マップ
	 * @returns {Array<number>} Shift_JIS のデータが入ったバイナリ配列
	 * @ignore
	 */
	static toSJISBinary(text, unicode_to_sjis) {
		const sjis = SJIS.toSJISArray(text, unicode_to_sjis);
		const sjisbin = [];
		for(let i = 0; i < sjis.length; i++) {
			if(sjis[i] < 0x100) {
				sjisbin.push(sjis[i]);
			}
			else {
				sjisbin.push(sjis[i] >> 8);
				sjisbin.push(sjis[i] & 0xFF);
			}
		}
		return sjisbin;
	}

	/**
	 * SJISの配列から文字列に変換
	 * @param {Array<number>} sjis - 変換したいテキスト
	 * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS から Unicode への変換マップ
	 * @returns {String} 変換後のテキスト
	 * @ignore
	 */
	static fromSJISArray(sjis, sjis_to_unicode) {
		const map = sjis_to_unicode;
		const utf16 = [];
		const ng = "?".charCodeAt(0);
		for(let i = 0; i < sjis.length; i++) {
			let x = sjis[i];
			/**
			 * @type {number|Array<number>}
			 */
			let y = [];
			if(x >= 0x100) {
				// すでに1つの変数にまとめられている
				y = map[x];
			}
			else {
				// 2バイト文字かのチェック
				if( ((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)) ) {
					x <<= 8;
					i++;
					x |= sjis[i];
					y = map[x];
				}
				else {
					y = map[x];
				}
			}
			if(y) {
				// 配列なら配列を結合
				// ※ Unicodeの結合文字の可能性があるため
				if(y instanceof Array) {
					for(let j = 0; j < y.length; j++) {
						utf16.push(y[j]);
					}
				}
				// 値しかない場合は値を結合
				else {
					utf16.push(y);
				}
			}
			else {
				utf16.push(ng);
			}
		}
		return Unicode.fromUTF32Array(utf16);
	}

	/**
	 * 指定したコードポイントの文字から Shift_JIS 上の符号化数値に変換
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS への変換マップ
	 * @returns {Number} 符号化数値(変換できない場合はnullとなる)
	 * @ignore
	 */
	static toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = SJIS.toSJISArray(utf16_text, unicode_to_sjis);
		return sjis_array[0];
	}

	/**
	 * 指定した Shift_JIS-2004 のコードから面区点番号に変換
	 * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
	 * @returns {MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTenFromSJIS2004Code(sjis_code) {
		if(!sjis_code) {
			return null;
		}
		const x = sjis_code;
		if(x < 0x100) {
			return null;
		}
		// アルゴリズムは面区点番号表からリバースエンジニアリング

		let s1 = x >> 8;
		let s2 = x & 0xFF;
		let men = 0;
		let ku = 0;
		let ten = 0;

		// 面情報の位置判定
		if(s1 < 0xF0) {
			men = 1;
			// 区の計算方法の切り替え
			// 63区から、0x9F→0xE0に飛ぶ
			if(s1 < 0xE0) {
				s1 = s1 - 0x81;
			}
			else {
				s1 = s1 - 0xC1;
			}
		}
		else {
			// ※2面は第4水準のみ
			men = 2;
			// 2面1区 ～ 2面8区
			if((((s1 === 0xF0) || (s1 === 0xF2)) && (s2 < 0x9F)) || (s1 === 0xF1)) {
				s1 = s1 - 0xF0;
			}
			// 2面12区 ～ 2面15区
			else if(((s1 === 0xF4) && (s2 < 0x9F)) || (s1 < 0xF4)) {
				s1 = s1 - 0xED;
			}
			// 2面78区 ～ 2面94区
			else {
				s1 = s1 - 0xCE;
			}
		}

		// 区情報の位置判定
		if(s2 < 0x9f) {
			ku = s1 * 2 + 1;
			// 点情報の計算方法の切り替え
			// 0x7Fが欠番のため「+1」を除去
			if(s2 < 0x80) {
				s2 = s2 - 0x40 + 1;
			}
			else {
				s2 = s2 - 0x40;
			}
		}
		else {
			ku = s1 * 2 + 2;
			s2 = s2 - 0x9f + 1;
		}

		// 点情報の位置判定
		ten = s2;

		return {
			text : "" + men + "-" + ku + "-" + ten,
			men : men,
			ku : ku,
			ten : ten
		};
	}

	/**
	 * 指定したコードポイントの文字から Shift_JIS-2004 上の面区点番号に変換
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS-2004 への変換マップ
	 * @returns {MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 * @ignore
	 */
	static toMenKuTenFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toMenKuTenFromSJIS2004Code(x);
	}
	
	/**
	 * 指定した面区点番号から Shift_JIS-2004 コードに変換
	 * @param {MenKuTen|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Number} Shift_JIS-2004 のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJIS2004CodeFromMenKuTen(menkuten) {
		let m = null, k = null, t = null;
		let text = null;
		if(menkuten instanceof Object) {
			if(menkuten.text && (typeof menkuten.text === "string")) {
				text = menkuten.text;
			}
			else if((menkuten.ku) && (menkuten.ten)) {
				m = menkuten.men ? menkuten.men : 1;
				k = menkuten.ku;
				t = menkuten.ten;
			}
		}
		else  if((typeof menkuten === "string")) {
			text = menkuten;
		}
		if(text) {
			const strmkt = text.split("-");
			if(strmkt.length === 3) {
				m = parseInt(strmkt[0], 10);
				k = parseInt(strmkt[1], 10);
				t = parseInt(strmkt[2], 10);
			}
			else if(strmkt.length === 2) {
				m = 1;
				k = parseInt(strmkt[0], 10);
				t = parseInt(strmkt[1], 10);
			}
		}
		if(!m || !k || !t) {
			throw "IllegalArgumentException";
		}

		let s1 = -1;
		let s2 = -1;

		/**
		 * @type {Object<number, number>}
		 */
		const kmap = {1:1,3:1,4:1,5:1,8:1,12:1,13:1,14:1,15:1};

		// 参考
		// 2019/1/1 Shift JIS - Wikipedia
		// https://en.wikipedia.org/wiki/Shift_JIS
		//
		// 区や点の判定部分は、通常94までであるため、正確にはkやtは <=94 とするべき。
		// しかし、Shift_JIS範囲外（IBM拡張漢字）でも利用されるため制限を取り払っている。

		if(m === 1) {
			if((1 <= k) && (k <= 62)) {
				s1 = Math.floor((k + 257) / 2);
			}
			else if(63 <= k) {
				s1 = Math.floor((k + 385) / 2);
			}
		}
		else if(m === 2) {
			if(kmap[k]) {
				s1 = Math.floor((k + 479) / 2) - (Math.floor(k / 8) * 3);
			}
			else if(78 <= k) {
				s1 = Math.floor((k + 411) / 2);
			}
		}

		if((k % 2) === 1) {
			if((1 <= t) && (t <= 63)) {
				s2 = t + 63;
			}
			else if(64 <= t) {
				s2 = t + 64;
			}
		}
		else {
			s2 = t + 158;
		}

		if((s1 === -1) || (s2 === -1)) {
			return null;
		}
		return (s1 << 8) | s2;
	}
	
	/**
	 * 指定した面区点番号から Unicode コードポイントに変換
	 * @param {MenKuTen|string} menkuten - 面区点番号
	 * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS-2004 から Unicode への変換マップ
	 * @returns {Array<number>} UTF-32の配列(存在しない場合はnullを返す)
	 * @ignore
	 */
	static toUnicodeCodeFromMenKuTen(menkuten, sjis_to_unicode) {
		const sjis_code = SJIS.toSJIS2004CodeFromMenKuTen(menkuten);
		if(!sjis_code) {
			return null;
		}
		const unicode = sjis_to_unicode[sjis_code];
		if(!unicode) {
			return null;
		}
		if(unicode instanceof Array) {
			return unicode;
		}
		else {
			return [unicode];
		}
	}

	/**
	 * 指定した Shift_JIS のコードから区点番号に変換
	 * @param {Number} sjis_code - Shift_JIS のコードポイント
	 * @returns {MenKuTen} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTenFromSJISCode(sjis_code) {
		if(!sjis_code) {
			return null;
		}
		const x = sjis_code;
		if(x < 0x100) {
			return null;
		}
		// アルゴリズムは区点番号表からリバースエンジニアリング

		let s1 = x >> 8;
		let s2 = x & 0xFF;
		let ku = 0;
		let ten = 0;

		// 区の計算方法の切り替え
		// 63区から、0x9F→0xE0に飛ぶ
		if(s1 < 0xE0) {
			s1 = s1 - 0x81;
		}
		else {
			s1 = s1 - 0xC1;
		}

		// 区情報の位置判定
		if(s2 < 0x9f) {
			ku = s1 * 2 + 1;
			// 点情報の計算方法の切り替え
			// 0x7Fが欠番のため「+1」を除去
			if(s2 < 0x80) {
				s2 = s2 - 0x40 + 1;
			}
			else {
				s2 = s2 - 0x40;
			}
		}
		else {
			ku = s1 * 2 + 2;
			s2 = s2 - 0x9f + 1;
		}

		// 点情報の位置判定
		ten = s2;

		return {
			text : ku + "-" + ten,
			men : 1,
			ku : ku,
			ten : ten
		};
	}
	
	/**
	 * 指定したコードポイントの文字から Shift_JIS 上の面区点番号に変換
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS への変換マップ
	 * @returns {MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 * @ignore
	 */
	static toKuTenFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toKuTenFromSJISCode(x);
	}

	/**
	 * 指定した面区点番号／区点番号から Shift_JIS コードに変換
	 * @param {MenKuTen|string} kuten - 面区点番号／区点番号
	 * @returns {Number} Shift_JIS のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJISCodeFromKuTen(kuten) {
		// 1～94区まで存在しているため面句点変換用で流用可能。
		// ただ、CP932の場合、範囲外の区、115区〜119区にIBM拡張文字が存在している。
		// 今回、toSJIS2004CodeFromMenKuTenでは区の範囲チェックをしないため問題なし。
		return SJIS.toSJIS2004CodeFromMenKuTen(kuten);
	}
	
	/**
	 * 指定した区点番号から Unicode コードポイントに変換
	 * @param {MenKuTen|string} kuten - 区点番号
	 * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS から Unicode への変換マップ
	 * @returns {Array<number>} UTF-32の配列(存在しない場合はnullを返す)
	 * @ignore
	 */
	static toUnicodeCodeFromKuTen(kuten, sjis_to_unicode) {
		const sjis_code = SJIS.toSJISCodeFromKuTen(kuten);
		if(!sjis_code) {
			return null;
		}
		const unicode = sjis_to_unicode[sjis_code];
		if(!unicode) {
			return null;
		}
		if(unicode instanceof Array) {
			return unicode;
		}
		else {
			return [unicode];
		}
	}

	/**
	 * Shift_JIS のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
	 * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
	 * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
	 */
	static toJISKanjiSuijunFromSJISCode(sjis_code) {
		if(!sjis_code) {
			return 0;
		}
		const menkuten = SJIS.toMenKuTenFromSJIS2004Code(sjis_code);
		// アルゴリズムはJIS漢字一覧表からリバースエンジニアリング
		if(!menkuten) {
			return 0;
		}
		// 2面は第4水準
		if(menkuten.men > 1) {
			return 4;
		}
		// 1面は第1～3水準
		if(menkuten.ku < 14) {
			// 14区より小さいと非漢字
			return 0;
		}
		if(menkuten.ku < 16) {
			// 14区と15区は第3水準
			return 3;
		}
		if(menkuten.ku < 47) {
			return 1;
		}
		// 47区には、第1水準と第3水準が混じる
		if(menkuten.ku === 47) {
			if(menkuten.ten < 52) {
				return 1;
			}
			else {
				return 3;
			}
		}
		if(menkuten.ku < 84) {
			return 2;
		}
		// 84区には、第2水準と第3水準が混じる
		if(menkuten.ku === 84) {
			if(menkuten.ten < 7) {
				return 2;
			}
			else {
				return 3;
			}
		}
		// 残り94区まで第3水準
		if(menkuten.ku < 95) {
			return 3;
		}
		return 0;
	}

	/**
	 * Unicode のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @param {Object<number, number>} unicode_to_sjis - Unicode から Shift_JIS への変換マップ
	 * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
	 * @ignore
	 */
	static toJISKanjiSuijunFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return -1;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toJISKanjiSuijunFromSJISCode(x);
	}

	/**
	 * 指定した面区点番号から Shift_JIS の仕様上、正規な物か判定
	 * @param {MenKuTen|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Boolean} 正規なデータは true, 不正なデータは false
	 */
	static isRegularMenKuten(menkuten) {
		let m, k, t;

		// 引数のテスト
		if(menkuten instanceof Object) {
			m = menkuten.men ? menkuten.men : 1;
			k = menkuten.ku;
			t = menkuten.ten;
		}
		else if(typeof menkuten === "string") {
			const strmkt = menkuten.split("-");
			if(strmkt.length === 3) {
				m = parseInt(strmkt[0], 10);
				k = parseInt(strmkt[1], 10);
				t = parseInt(strmkt[2], 10);
			}
			else if(strmkt.length === 2) {
				m = 1;
				k = parseInt(strmkt[0], 10);
				t = parseInt(strmkt[1], 10);
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}

		/**
		 * @type {Object<number, number>}
		 */
		const kmap = {1:1,3:1,4:1,5:1,8:1,12:1,13:1,14:1,15:1};
		if(m === 1) {
			// 1面は1-94区まで存在
			if(!((1 <= k) && (k <= 94))) {
				return false;
			}
		}
		else if(m === 2) {
			// 2面は、1,3,4,5,8,12,13,14,15,78-94区まで存在
			if(!((kmap[k]) || ((78 <= k) && (k <= 94)))) {
				return false;
			}
		}
		else {
			// 面が不正
			return false;
		}
		// 点は1-94点まで存在
		if(!((1 <= t) && (t <= 94))) {
			return false;
		}
		return true;
	}

}

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
 * CP932, Windows-31J の変換マップ作成用クラス
 * @ignore
 */
class CP932MAP {

	/**
	 * 変換マップを初期化
	 */
	static init() {
		if(CP932MAP.is_initmap) {
			return;
		}
		CP932MAP.is_initmap = true;
		
		/**
		 * @returns {Object<number, number>}
		 */
		const getCp932ToUnicodeMap = function() {

			/**
			 * 1バイトの変換マップ
			 * 
			 * 
			 * 参考：WideCharToMultiByte
			 * メモ：今回は使っていないが、以下の文献も参考になるかもしれません。
			 * ftp://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0208.TXT
			 * @type {Object<number, number>}
			 */
			let cp932_to_unicode_map = {
				0x01: 0x01, 0x02: 0x02, 0x03: 0x03, 0x04: 0x04, 0x05: 0x05, 0x06: 0x06, 0x07: 0x07, 0x08: 0x08,
				0x09: 0x09, 0x0a: 0x0a, 0x0b: 0x0b, 0x0c: 0x0c, 0x0d: 0x0d, 0x0e: 0x0e, 0x0f: 0x0f, 0x10: 0x10,
				0x11: 0x11, 0x12: 0x12, 0x13: 0x13, 0x14: 0x14, 0x15: 0x15, 0x16: 0x16, 0x17: 0x17, 0x18: 0x18,
				0x19: 0x19, 0x1a: 0x1a, 0x1b: 0x1b, 0x1c: 0x1c, 0x1d: 0x1d, 0x1e: 0x1e, 0x1f: 0x1f, 0x20: 0x20,
				0x21: 0x21, 0x22: 0x22, 0x23: 0x23, 0x24: 0x24, 0x25: 0x25, 0x26: 0x26, 0x27: 0x27, 0x28: 0x28,
				0x29: 0x29, 0x2a: 0x2a, 0x2b: 0x2b, 0x2c: 0x2c, 0x2d: 0x2d, 0x2e: 0x2e, 0x2f: 0x2f, 0x30: 0x30,
				0x31: 0x31, 0x32: 0x32, 0x33: 0x33, 0x34: 0x34, 0x35: 0x35, 0x36: 0x36, 0x37: 0x37, 0x38: 0x38,
				0x39: 0x39, 0x3a: 0x3a, 0x3b: 0x3b, 0x3c: 0x3c, 0x3d: 0x3d, 0x3e: 0x3e, 0x3f: 0x3f, 0x40: 0x40,
				0x41: 0x41, 0x42: 0x42, 0x43: 0x43, 0x44: 0x44, 0x45: 0x45, 0x46: 0x46, 0x47: 0x47, 0x48: 0x48,
				0x49: 0x49, 0x4a: 0x4a, 0x4b: 0x4b, 0x4c: 0x4c, 0x4d: 0x4d, 0x4e: 0x4e, 0x4f: 0x4f, 0x50: 0x50,
				0x51: 0x51, 0x52: 0x52, 0x53: 0x53, 0x54: 0x54, 0x55: 0x55, 0x56: 0x56, 0x57: 0x57, 0x58: 0x58,
				0x59: 0x59, 0x5a: 0x5a, 0x5b: 0x5b, 0x5c: 0x5c, 0x5d: 0x5d, 0x5e: 0x5e, 0x5f: 0x5f, 0x60: 0x60,
				0x61: 0x61, 0x62: 0x62, 0x63: 0x63, 0x64: 0x64, 0x65: 0x65, 0x66: 0x66, 0x67: 0x67, 0x68: 0x68,
				0x69: 0x69, 0x6a: 0x6a, 0x6b: 0x6b, 0x6c: 0x6c, 0x6d: 0x6d, 0x6e: 0x6e, 0x6f: 0x6f, 0x70: 0x70,
				0x71: 0x71, 0x72: 0x72, 0x73: 0x73, 0x74: 0x74, 0x75: 0x75, 0x76: 0x76, 0x77: 0x77, 0x78: 0x78,
				0x79: 0x79, 0x7a: 0x7a, 0x7b: 0x7b, 0x7c: 0x7c, 0x7d: 0x7d, 0x7e: 0x7e, 0x7f: 0x7f, 0x80: 0x80,
				0xa0: 0xf8f0, 0xa1: 0xff61, 0xa2: 0xff62, 0xa3: 0xff63, 0xa4: 0xff64, 0xa5: 0xff65, 0xa6: 0xff66, 0xa7: 0xff67,
				0xa8: 0xff68, 0xa9: 0xff69, 0xaa: 0xff6a, 0xab: 0xff6b, 0xac: 0xff6c, 0xad: 0xff6d, 0xae: 0xff6e, 0xaf: 0xff6f,
				0xb0: 0xff70, 0xb1: 0xff71, 0xb2: 0xff72, 0xb3: 0xff73, 0xb4: 0xff74, 0xb5: 0xff75, 0xb6: 0xff76, 0xb7: 0xff77,
				0xb8: 0xff78, 0xb9: 0xff79, 0xba: 0xff7a, 0xbb: 0xff7b, 0xbc: 0xff7c, 0xbd: 0xff7d, 0xbe: 0xff7e, 0xbf: 0xff7f,
				0xc0: 0xff80, 0xc1: 0xff81, 0xc2: 0xff82, 0xc3: 0xff83, 0xc4: 0xff84, 0xc5: 0xff85, 0xc6: 0xff86, 0xc7: 0xff87,
				0xc8: 0xff88, 0xc9: 0xff89, 0xca: 0xff8a, 0xcb: 0xff8b, 0xcc: 0xff8c, 0xcd: 0xff8d, 0xce: 0xff8e, 0xcf: 0xff8f,
				0xd0: 0xff90, 0xd1: 0xff91, 0xd2: 0xff92, 0xd3: 0xff93, 0xd4: 0xff94, 0xd5: 0xff95, 0xd6: 0xff96, 0xd7: 0xff97,
				0xd8: 0xff98, 0xd9: 0xff99, 0xda: 0xff9a, 0xdb: 0xff9b, 0xdc: 0xff9c, 0xdd: 0xff9d, 0xde: 0xff9e, 0xdf: 0xff9f,
				0xfd: 0xf8f1, 0xfe: 0xf8f2, 0xff: 0xf8f3
			};

			/**
			 * 2バイト文字（0x8140-0xffff）の変換マップ作成用の文字列
			 * @type {string}
			 */
			let map = "　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【】＋－±×1÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓11∈∋⊆⊇⊂⊃∪∩8∧∨￢⇒⇔∀∃11∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬7Å‰♯♭♪†‡¶4◯82";
			map += "０１２３４５６７８９7ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ7ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ4ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん78";
			map += "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミ1ムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ8ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ8αβγδεζηθικλμνξοπρστυφχψω105АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ15абвгдеёжзийклмн1опрстуфхцчшщъыьэюя13─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂641";
			map += "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ1㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡8㍻1〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪258";
			map += "亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭67";
			map += "院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円1園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改67";
			map += "魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫1橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄67";
			map += "機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救1朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈67";
			map += "掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨1劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向67";
			map += "后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降1項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷67";
			map += "察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止1死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周67";
			map += "宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳1準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾67";
			map += "拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨1逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線67";
			map += "繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻1操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只67";
			map += "叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄1逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓67";
			map += "邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬1凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入67";
			map += "如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅1楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美67";
			map += "鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷1斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋67";
			map += "法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆1摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒67";
			map += "諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲1沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯67";
			map += "蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕44弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲67";
			map += "僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭1凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨67";
			map += "咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸1噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩67";
			map += "奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀1它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏67";
			map += "廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠1怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛67";
			map += "戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫1捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼67";
			map += "曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎1梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣67";
			map += "檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯1麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌16451";
			map += "漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝1烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱67";
			map += "瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿1痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬67";
			map += "磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰1窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆67";
			map += "紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷1縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋67";
			map += "隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤1艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈67";
			map += "蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬1蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞67";
			map += "襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧1諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊67";
			map += "蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜1轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮67";
			map += "錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙1閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰67";
			map += "顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃1騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈67";
			map += "鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯1黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙667";
			map += "纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏1塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱67";
			map += "犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙1蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑2ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ￢￤＇＂323";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "167";
			map += "ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊1兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯67";
			map += "涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神1祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙67";
			map += "髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑";

			/*
			上の変換マップ作成用の文字列は数値が入った変換マップのコードから作成している
			let output = "";
			let nul_count = 0;
			for(i = 0x8140; i <= 0xffff; i++) {
				if(map[i]) {
					if(nul_count !== 0){
						output += nul_count;
						nul_count = 0;
					}
					output += MojiJS.fromCodePoint(map[i]);
				}
				else {
					nul_count++;
				}
			}
			*/

			/**
			 * UTF16へ変換
			 */
			const utf16_array = Unicode.toUTF16Array(map);

			// マップ展開
			let is_num = false;
			let num_array = [];
			let key = 0x8140;
			for(let i = 0; i < utf16_array.length; i++) {
				const x = utf16_array[i];
				if((0x30 <= x) && (x <= 0x39)) {
					if(!is_num) {
						is_num = true;
						num_array = [];
					}
					num_array.push(x);
				}
				else {
					if(is_num) {
						key += parseFloat(Unicode.fromUTF16Array(num_array));
						is_num = false;
					}
					cp932_to_unicode_map[key] = x;
					key++;
				}
			}

			return cp932_to_unicode_map;
		};

		/**
		 * CP932 変換マップ
		 * @type {Object<number, number>}
		 */
		const cp932_to_unicode_map = getCp932ToUnicodeMap();

		/**
		 * 重複された CP932 のコード
		 * @type {Array<number>}
		 */
		const duplicate_map_array = [
			0x8790, 0x8791, 0x8792, 0x8795, 0x8796, 0x8797, 0x879a, 0x879b, 0x879c, 0xed40, 0xed41, 0xed42, 0xed43, 0xed44, 0xed45, 0xed46,
			0xed47, 0xed48, 0xed49, 0xed4a, 0xed4b, 0xed4c, 0xed4d, 0xed4e, 0xed4f, 0xed50, 0xed51, 0xed52, 0xed53, 0xed54, 0xed55, 0xed56,
			0xed57, 0xed58, 0xed59, 0xed5a, 0xed5b, 0xed5c, 0xed5d, 0xed5e, 0xed5f, 0xed60, 0xed61, 0xed62, 0xed63, 0xed64, 0xed65, 0xed66,
			0xed67, 0xed68, 0xed69, 0xed6a, 0xed6b, 0xed6c, 0xed6d, 0xed6e, 0xed6f, 0xed70, 0xed71, 0xed72, 0xed73, 0xed74, 0xed75, 0xed76,
			0xed77, 0xed78, 0xed79, 0xed7a, 0xed7b, 0xed7c, 0xed7d, 0xed7e, 0xed80, 0xed81, 0xed82, 0xed83, 0xed84, 0xed85, 0xed86, 0xed87,
			0xed88, 0xed89, 0xed8a, 0xed8b, 0xed8c, 0xed8d, 0xed8e, 0xed8f, 0xed90, 0xed91, 0xed92, 0xed93, 0xed94, 0xed95, 0xed96, 0xed97,
			0xed98, 0xed99, 0xed9a, 0xed9b, 0xed9c, 0xed9d, 0xed9e, 0xed9f, 0xeda0, 0xeda1, 0xeda2, 0xeda3, 0xeda4, 0xeda5, 0xeda6, 0xeda7,
			0xeda8, 0xeda9, 0xedaa, 0xedab, 0xedac, 0xedad, 0xedae, 0xedaf, 0xedb0, 0xedb1, 0xedb2, 0xedb3, 0xedb4, 0xedb5, 0xedb6, 0xedb7,
			0xedb8, 0xedb9, 0xedba, 0xedbb, 0xedbc, 0xedbd, 0xedbe, 0xedbf, 0xedc0, 0xedc1, 0xedc2, 0xedc3, 0xedc4, 0xedc5, 0xedc6, 0xedc7,
			0xedc8, 0xedc9, 0xedca, 0xedcb, 0xedcc, 0xedcd, 0xedce, 0xedcf, 0xedd0, 0xedd1, 0xedd2, 0xedd3, 0xedd4, 0xedd5, 0xedd6, 0xedd7,
			0xedd8, 0xedd9, 0xedda, 0xeddb, 0xeddc, 0xeddd, 0xedde, 0xeddf, 0xede0, 0xede1, 0xede2, 0xede3, 0xede4, 0xede5, 0xede6, 0xede7,
			0xede8, 0xede9, 0xedea, 0xedeb, 0xedec, 0xeded, 0xedee, 0xedef, 0xedf0, 0xedf1, 0xedf2, 0xedf3, 0xedf4, 0xedf5, 0xedf6, 0xedf7,
			0xedf8, 0xedf9, 0xedfa, 0xedfb, 0xedfc, 0xee40, 0xee41, 0xee42, 0xee43, 0xee44, 0xee45, 0xee46, 0xee47, 0xee48, 0xee49, 0xee4a,
			0xee4b, 0xee4c, 0xee4d, 0xee4e, 0xee4f, 0xee50, 0xee51, 0xee52, 0xee53, 0xee54, 0xee55, 0xee56, 0xee57, 0xee58, 0xee59, 0xee5a,
			0xee5b, 0xee5c, 0xee5d, 0xee5e, 0xee5f, 0xee60, 0xee61, 0xee62, 0xee63, 0xee64, 0xee65, 0xee66, 0xee67, 0xee68, 0xee69, 0xee6a,
			0xee6b, 0xee6c, 0xee6d, 0xee6e, 0xee6f, 0xee70, 0xee71, 0xee72, 0xee73, 0xee74, 0xee75, 0xee76, 0xee77, 0xee78, 0xee79, 0xee7a,
			0xee7b, 0xee7c, 0xee7d, 0xee7e, 0xee80, 0xee81, 0xee82, 0xee83, 0xee84, 0xee85, 0xee86, 0xee87, 0xee88, 0xee89, 0xee8a, 0xee8b,
			0xee8c, 0xee8d, 0xee8e, 0xee8f, 0xee90, 0xee91, 0xee92, 0xee93, 0xee94, 0xee95, 0xee96, 0xee97, 0xee98, 0xee99, 0xee9a, 0xee9b,
			0xee9c, 0xee9d, 0xee9e, 0xee9f, 0xeea0, 0xeea1, 0xeea2, 0xeea3, 0xeea4, 0xeea5, 0xeea6, 0xeea7, 0xeea8, 0xeea9, 0xeeaa, 0xeeab,
			0xeeac, 0xeead, 0xeeae, 0xeeaf, 0xeeb0, 0xeeb1, 0xeeb2, 0xeeb3, 0xeeb4, 0xeeb5, 0xeeb6, 0xeeb7, 0xeeb8, 0xeeb9, 0xeeba, 0xeebb,
			0xeebc, 0xeebd, 0xeebe, 0xeebf, 0xeec0, 0xeec1, 0xeec2, 0xeec3, 0xeec4, 0xeec5, 0xeec6, 0xeec7, 0xeec8, 0xeec9, 0xeeca, 0xeecb,
			0xeecc, 0xeecd, 0xeece, 0xeecf, 0xeed0, 0xeed1, 0xeed2, 0xeed3, 0xeed4, 0xeed5, 0xeed6, 0xeed7, 0xeed8, 0xeed9, 0xeeda, 0xeedb,
			0xeedc, 0xeedd, 0xeede, 0xeedf, 0xeee0, 0xeee1, 0xeee2, 0xeee3, 0xeee4, 0xeee5, 0xeee6, 0xeee7, 0xeee8, 0xeee9, 0xeeea, 0xeeeb,
			0xeeec, 0xeeef, 0xeef0, 0xeef1, 0xeef2, 0xeef3, 0xeef4, 0xeef5, 0xeef6, 0xeef7, 0xeef8, 0xeef9, 0xeefa, 0xeefb, 0xeefc, 0xfa4a,
			0xfa4b, 0xfa4c, 0xfa4d, 0xfa4e, 0xfa4f, 0xfa50, 0xfa51, 0xfa52, 0xfa53, 0xfa54, 0xfa58, 0xfa59, 0xfa5a, 0xfa5b
		];

		/**
		 * @type {Object<number, number>}
		 */
		const duplicate_map = {};
		
		/**
		 * @type {Object<number, number>}
		 */
		const unicode_to_cp932_map = {};

		for(const key in duplicate_map_array) {
			duplicate_map[duplicate_map_array[key]] = 1;
		}
		for(const key in cp932_to_unicode_map) {
			// 重複登録された文字
			// IBM拡張文字 と NEC特殊文字 と NEC選定IBM拡張文字 で
			// マッピング先が一部重複している。
			// WideCharToMultiByte の仕様に基づき、登録しない。
			if(duplicate_map[key]) {
				continue;
			}
			const x = cp932_to_unicode_map[key];
			unicode_to_cp932_map[x] = parseInt(key, 10);
		}

		// 逆引きの注意点

		// 半角￥マーク問題
		// 半角￥マークは、Shift_JISの「5c 0xReverse Solidus 逆斜線」にする
		// Unicode '¥' 0x00a5 Yen Sign 半角円マーク
		unicode_to_cp932_map[0xa5] = 0x5c;

		// 波線問題
		// SJIS2004上は 0x8160 と 0x81B0 とで区別されている。
		// Shift_JISは 0x301c を 0x8160 に統一
		// Unicode '〜' 0x301c Shift_JIS-2004 0x8160 Wave Dash 波ダッシュ
		// Unicode '～' 0xff5e Shift_JIS-2004 0x81B0 Fullwidth Tilde 全角チルダ
		unicode_to_cp932_map[0x301c] = 0x8160;

		// マイナス問題
		// SJIS2004上は 0x817c と 0x81af とで区別されている。
		// Shift_JISは、0x2212 を全角負記号 0x817c へ変更
		// Unicode `−` 0x2212 Shift_JIS-2004 0x817c 負符号/減算記号
		// Unicode `－` 0xff0d Shift_JIS-2004 0x81af ハイフンマイナス
		unicode_to_cp932_map[0x2212] = 0x817c;

		CP932MAP.cp932_to_unicode_map = cp932_to_unicode_map;
		CP932MAP.unicode_to_cp932_map = unicode_to_cp932_map;
	}

	/**
	 * @returns {Object<number, number>}
	 */
	static CP932_TO_UNICODE() {
		CP932MAP.init();
		return CP932MAP.cp932_to_unicode_map;
	}
	
	/**
	 * @returns {Object<number, number>}
	 */
	static UNICODE_TO_CP932() {
		CP932MAP.init();
		return CP932MAP.unicode_to_cp932_map;
	}
}

/**
 * 変換マップを初期化したかどうか
 * @type {boolean}
 */
CP932MAP.is_initmap = false;

/**
 * 変換用マップ
 * @type {Object<number, number>}
 */
CP932MAP.cp932_to_unicode_map = null;

/**
 * 変換用マップ
 * @type {Object<number, number>}
 */
CP932MAP.unicode_to_cp932_map = null;

/**
 * CP932, Windows-31J を扱うクラス
 * @ignore
 */
class CP932 {

	/**
	 * Unicode のコードから CP932 のコードに変換
	 * @param {Number} unicode_codepoint - Unicode のコードポイント
	 * @returns {Number} CP932 のコードポイント (存在しない場合は undefined)
	 */
	static toCP932FromUnicode(unicode_codepoint) {
		return CP932MAP.UNICODE_TO_CP932()[unicode_codepoint];
	}

	/**
	 * CP932 のコードから Unicode のコードに変換
	 * @param {Number} cp932_codepoint - CP932 のコードポイント
	 * @returns {Number} Unicode のコードポイント (存在しない場合は undefined)
	 */
	static toUnicodeFromCP932(cp932_codepoint) {
		return CP932MAP.CP932_TO_UNICODE()[cp932_codepoint];
	}
	
	/**
	 * 文字列を CP932 の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} CP932 のデータが入った配列
	 */
	static toCP932Array(text) {
		return SJIS.toSJISArray(text, CP932MAP.UNICODE_TO_CP932());
	}

	/**
	 * 文字列を CP932 のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} CP932 のデータが入ったバイナリ配列
	 */
	static toCP932Binary(text) {
		return SJIS.toSJISBinary(text, CP932MAP.UNICODE_TO_CP932());
	}

	/**
	 * CP932 の配列から文字列に変換
	 * @param {Array<number>} cp932 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromCP932Array(cp932) {
		return SJIS.fromSJISArray(cp932, CP932MAP.CP932_TO_UNICODE());
	}

	/**
	 * 指定した文字から Windows-31J 上の区点番号に変換
	 * - 2文字以上を指定した場合は、1文字目のみを変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {import("./SJIS.js").MenKuTen} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTen(text) {
		if(text.length === 0) {
			return null;
		}
		const cp932_code = CP932.toCP932FromUnicode(Unicode.toUTF32Array(text)[0]);
		return cp932_code ? SJIS.toKuTenFromSJISCode(cp932_code) : null;
	}
	
	/**
	 * Windows-31J 上の区点番号から文字列に変換
	 * @param {import("./SJIS.js").MenKuTen|string} kuten - 区点番号
	 * @returns {String} 変換後のテキスト
	 */
	static fromKuTen(kuten) {
		const code = SJIS.toUnicodeCodeFromKuTen(kuten, CP932MAP.CP932_TO_UNICODE());
		return code ? Unicode.fromUTF32Array(code) : "";
	}

}

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
 * Shift_JIS-2004 の変換マップ作成用クラス
 * @ignore
 */
class SJIS2004MAP {

	/**
	 * 変換マップを初期化
	 */
	static init() {
		if(SJIS2004MAP.is_initmap) {
			return;
		}
		SJIS2004MAP.is_initmap = true;

		/**
		 * 変換マップを作成
		 * 
		 * 
		 * @returns {Object<number, number|Array<number>>}
		 */
		 const getSJIS2004ToUnicodeMap = function() {

			/**
			 * 変換マップ
			 * - 2文字に変換される場合もあるので注意
			 * 
			 * 
			 * 参考：JIS X 0213 - Wikipedia (2019/1/1)
			 * https://ja.wikipedia.org/wiki/JIS_X_0213
			 * @type {Object<number, number|Array<number>>}
			 */
			let sjis2004_to_unicode_map = {
				// ASCII コード部分は CP932 を参考
				0x00: 0x00, 
				0x01: 0x01, 0x02: 0x02, 0x03: 0x03, 0x04: 0x04, 0x05: 0x05, 0x06: 0x06, 0x07: 0x07, 0x08: 0x08,
				0x09: 0x09, 0x0a: 0x0a, 0x0b: 0x0b, 0x0c: 0x0c, 0x0d: 0x0d, 0x0e: 0x0e, 0x0f: 0x0f, 0x10: 0x10,
				0x11: 0x11, 0x12: 0x12, 0x13: 0x13, 0x14: 0x14, 0x15: 0x15, 0x16: 0x16, 0x17: 0x17, 0x18: 0x18,
				0x19: 0x19, 0x1a: 0x1a, 0x1b: 0x1b, 0x1c: 0x1c, 0x1d: 0x1d, 0x1e: 0x1e, 0x1f: 0x1f, 0x20: 0x20,
				0x21: 0x21, 0x22: 0x22, 0x23: 0x23, 0x24: 0x24, 0x25: 0x25, 0x26: 0x26, 0x27: 0x27, 0x28: 0x28,
				0x29: 0x29, 0x2a: 0x2a, 0x2b: 0x2b, 0x2c: 0x2c, 0x2d: 0x2d, 0x2e: 0x2e, 0x2f: 0x2f, 0x30: 0x30,
				0x31: 0x31, 0x32: 0x32, 0x33: 0x33, 0x34: 0x34, 0x35: 0x35, 0x36: 0x36, 0x37: 0x37, 0x38: 0x38,
				0x39: 0x39, 0x3a: 0x3a, 0x3b: 0x3b, 0x3c: 0x3c, 0x3d: 0x3d, 0x3e: 0x3e, 0x3f: 0x3f, 0x40: 0x40,
				0x41: 0x41, 0x42: 0x42, 0x43: 0x43, 0x44: 0x44, 0x45: 0x45, 0x46: 0x46, 0x47: 0x47, 0x48: 0x48,
				0x49: 0x49, 0x4a: 0x4a, 0x4b: 0x4b, 0x4c: 0x4c, 0x4d: 0x4d, 0x4e: 0x4e, 0x4f: 0x4f, 0x50: 0x50,
				0x51: 0x51, 0x52: 0x52, 0x53: 0x53, 0x54: 0x54, 0x55: 0x55, 0x56: 0x56, 0x57: 0x57, 0x58: 0x58,
				0x59: 0x59, 0x5a: 0x5a, 0x5b: 0x5b, 0x5c: 0x5c, 0x5d: 0x5d, 0x5e: 0x5e, 0x5f: 0x5f, 0x60: 0x60,
				0x61: 0x61, 0x62: 0x62, 0x63: 0x63, 0x64: 0x64, 0x65: 0x65, 0x66: 0x66, 0x67: 0x67, 0x68: 0x68,
				0x69: 0x69, 0x6a: 0x6a, 0x6b: 0x6b, 0x6c: 0x6c, 0x6d: 0x6d, 0x6e: 0x6e, 0x6f: 0x6f, 0x70: 0x70,
				0x71: 0x71, 0x72: 0x72, 0x73: 0x73, 0x74: 0x74, 0x75: 0x75, 0x76: 0x76, 0x77: 0x77, 0x78: 0x78,
				0x79: 0x79, 0x7a: 0x7a, 0x7b: 0x7b, 0x7c: 0x7c, 0x7d: 0x7d, 0x7e: 0x7e, 0x7f: 0x7f, 0x80: 0x80,
				0xa0: 0xf8f0, 0xa1: 0xff61, 0xa2: 0xff62, 0xa3: 0xff63, 0xa4: 0xff64, 0xa5: 0xff65, 0xa6: 0xff66, 0xa7: 0xff67,
				0xa8: 0xff68, 0xa9: 0xff69, 0xaa: 0xff6a, 0xab: 0xff6b, 0xac: 0xff6c, 0xad: 0xff6d, 0xae: 0xff6e, 0xaf: 0xff6f,
				0xb0: 0xff70, 0xb1: 0xff71, 0xb2: 0xff72, 0xb3: 0xff73, 0xb4: 0xff74, 0xb5: 0xff75, 0xb6: 0xff76, 0xb7: 0xff77,
				0xb8: 0xff78, 0xb9: 0xff79, 0xba: 0xff7a, 0xbb: 0xff7b, 0xbc: 0xff7c, 0xbd: 0xff7d, 0xbe: 0xff7e, 0xbf: 0xff7f,
				0xc0: 0xff80, 0xc1: 0xff81, 0xc2: 0xff82, 0xc3: 0xff83, 0xc4: 0xff84, 0xc5: 0xff85, 0xc6: 0xff86, 0xc7: 0xff87,
				0xc8: 0xff88, 0xc9: 0xff89, 0xca: 0xff8a, 0xcb: 0xff8b, 0xcc: 0xff8c, 0xcd: 0xff8d, 0xce: 0xff8e, 0xcf: 0xff8f,
				0xd0: 0xff90, 0xd1: 0xff91, 0xd2: 0xff92, 0xd3: 0xff93, 0xd4: 0xff94, 0xd5: 0xff95, 0xd6: 0xff96, 0xd7: 0xff97,
				0xd8: 0xff98, 0xd9: 0xff99, 0xda: 0xff9a, 0xdb: 0xff9b, 0xdc: 0xff9c, 0xdd: 0xff9d, 0xde: 0xff9e, 0xdf: 0xff9f,
				0xfd: 0xf8f1, 0xfe: 0xf8f2, 0xff: 0xf8f3,
				// 以下、数字記号部分の変換マップ
				0x8140: 0x3000, 0x8141: 0x3001, 0x8142: 0x3002, 0x8143: 0x002c, 0x8144: 0x002e, 0x8145: 0x30fb, 0x8146: 0x003a, 0x8147: 0x003b,
				0x8148: 0x003f, 0x8149: 0x0021, 0x814a: 0x309b, 0x814b: 0x309c, 0x814c: 0x00b4, 0x814d: 0x0060, 0x814e: 0x00a8, 0x814f: 0x005e,
				0x8150: 0x203e, 0x8151: 0x005f, 0x8152: 0x30fd, 0x8153: 0x30fe, 0x8154: 0x309d, 0x8155: 0x309e, 0x8156: 0x3003, 0x8157: 0x4edd,
				0x8158: 0x3005, 0x8159: 0x3006, 0x815a: 0x3007, 0x815b: 0x30fc, 0x815c: 0x2014, 0x815d: 0x2010, 0x815e: 0x002f, 0x815f: 0x005c,
				0x8160: 0x301c, 0x8161: 0x2016, 0x8162: 0x007c, 0x8163: 0x2026, 0x8164: 0x2025, 0x8165: 0x2018, 0x8166: 0x2019, 0x8167: 0x201c,
				0x8168: 0x201d, 0x8169: 0x0028, 0x816a: 0x0029, 0x816b: 0x3014, 0x816c: 0x3015, 0x816d: 0x005b, 0x816e: 0x005d, 0x816f: 0x007b,
				0x8170: 0x007d, 0x8171: 0x3008, 0x8172: 0x3009, 0x8173: 0x300a, 0x8174: 0x300b, 0x8175: 0x300c, 0x8176: 0x300d, 0x8177: 0x300e,
				0x8178: 0x300f, 0x8179: 0x3010, 0x817a: 0x3011, 0x817b: 0x002b, 0x817c: 0x2212, 0x817d: 0x00b1, 0x817e: 0x00d7, 0x8180: 0x00f7,
				0x8181: 0x003d, 0x8182: 0x2260, 0x8183: 0x003c, 0x8184: 0x003e, 0x8185: 0x2266, 0x8186: 0x2267, 0x8187: 0x221e, 0x8188: 0x2234,
				0x8189: 0x2642, 0x818a: 0x2640, 0x818b: 0x00b0, 0x818c: 0x2032, 0x818d: 0x2033, 0x818e: 0x2103, 0x818f: 0x00a5, 0x8190: 0x0024,
				0x8191: 0x00a2, 0x8192: 0x00a3, 0x8193: 0x0025, 0x8194: 0x0023, 0x8195: 0x0026, 0x8196: 0x002a, 0x8197: 0x0040, 0x8198: 0x00a7,
				0x8199: 0x2606, 0x819a: 0x2605, 0x819b: 0x25cb, 0x819c: 0x25cf, 0x819d: 0x25ce, 0x819e: 0x25c7, 0x819f: 0x25c6, 0x81a0: 0x25a1,
				0x81a1: 0x25a0, 0x81a2: 0x25b3, 0x81a3: 0x25b2, 0x81a4: 0x25bd, 0x81a5: 0x25bc, 0x81a6: 0x203b, 0x81a7: 0x3012, 0x81a8: 0x2192,
				0x81a9: 0x2190, 0x81aa: 0x2191, 0x81ab: 0x2193, 0x81ac: 0x3013, 0x81ad: 0x0027, 0x81ae: 0x0022, 0x81af: 0x002d, 0x81b0: 0x007e,
				0x81b1: 0x3033, 0x81b2: 0x3034, 0x81b3: 0x3035, 0x81b4: 0x303b, 0x81b5: 0x303c, 0x81b6: 0x30ff, 0x81b7: 0x309f, 0x81b8: 0x2208,
				0x81b9: 0x220b, 0x81ba: 0x2286, 0x81bb: 0x2287, 0x81bc: 0x2282, 0x81bd: 0x2283, 0x81be: 0x222a, 0x81bf: 0x2229, 0x81c0: 0x2284,
				0x81c1: 0x2285, 0x81c2: 0x228a, 0x81c3: 0x228b, 0x81c4: 0x2209, 0x81c5: 0x2205, 0x81c6: 0x2305, 0x81c7: 0x2306, 0x81c8: 0x2227,
				0x81c9: 0x2228, 0x81ca: 0x00ac, 0x81cb: 0x21d2, 0x81cc: 0x21d4, 0x81cd: 0x2200, 0x81ce: 0x2203, 0x81cf: 0x2295, 0x81d0: 0x2296,
				0x81d1: 0x2297, 0x81d2: 0x2225, 0x81d3: 0x2226, 0x81d4: 0xff5f, 0x81d5: 0xff60, 0x81d6: 0x3018, 0x81d7: 0x3019, 0x81d8: 0x3016,
				0x81d9: 0x3017, 0x81da: 0x2220, 0x81db: 0x22a5, 0x81dc: 0x2312, 0x81dd: 0x2202, 0x81de: 0x2207, 0x81df: 0x2261, 0x81e0: 0x2252,
				0x81e1: 0x226a, 0x81e2: 0x226b, 0x81e3: 0x221a, 0x81e4: 0x223d, 0x81e5: 0x221d, 0x81e6: 0x2235, 0x81e7: 0x222b, 0x81e8: 0x222c,
				0x81e9: 0x2262, 0x81ea: 0x2243, 0x81eb: 0x2245, 0x81ec: 0x2248, 0x81ed: 0x2276, 0x81ee: 0x2277, 0x81ef: 0x2194, 0x81f0: 0x212b,
				0x81f1: 0x2030, 0x81f2: 0x266f, 0x81f3: 0x266d, 0x81f4: 0x266a, 0x81f5: 0x2020, 0x81f6: 0x2021, 0x81f7: 0x00b6, 0x81f8: 0x266e,
				0x81f9: 0x266b, 0x81fa: 0x266c, 0x81fb: 0x2669, 0x81fc: 0x25ef, 0x8240: 0x25b7, 0x8241: 0x25b6, 0x8242: 0x25c1, 0x8243: 0x25c0,
				0x8244: 0x2197, 0x8245: 0x2198, 0x8246: 0x2196, 0x8247: 0x2199, 0x8248: 0x21c4, 0x8249: 0x21e8, 0x824a: 0x21e6, 0x824b: 0x21e7,
				0x824c: 0x21e9, 0x824d: 0x2934, 0x824e: 0x2935, 0x824f: 0x0030, 0x8250: 0x0031, 0x8251: 0x0032, 0x8252: 0x0033, 0x8253: 0x0034,
				0x8254: 0x0035, 0x8255: 0x0036, 0x8256: 0x0037, 0x8257: 0x0038, 0x8258: 0x0039, 0x8259: 0x29bf, 0x825a: 0x25c9, 0x825b: 0x303d,
				0x825c: 0xfe46, 0x825d: 0xfe45, 0x825e: 0x25e6, 0x825f: 0x2022, 0x8260: 0x0041, 0x8261: 0x0042, 0x8262: 0x0043, 0x8263: 0x0044,
				0x8264: 0x0045, 0x8265: 0x0046, 0x8266: 0x0047, 0x8267: 0x0048, 0x8268: 0x0049, 0x8269: 0x004a, 0x826a: 0x004b, 0x826b: 0x004c,
				0x826c: 0x004d, 0x826d: 0x004e, 0x826e: 0x004f, 0x826f: 0x0050, 0x8270: 0x0051, 0x8271: 0x0052, 0x8272: 0x0053, 0x8273: 0x0054,
				0x8274: 0x0055, 0x8275: 0x0056, 0x8276: 0x0057, 0x8277: 0x0058, 0x8278: 0x0059, 0x8279: 0x005a, 0x827a: 0x2213, 0x827b: 0x2135,
				0x827c: 0x210f, 0x827d: 0x33cb, 0x827e: 0x2113, 0x8280: 0x2127, 0x8281: 0x0061, 0x8282: 0x0062, 0x8283: 0x0063, 0x8284: 0x0064,
				0x8285: 0x0065, 0x8286: 0x0066, 0x8287: 0x0067, 0x8288: 0x0068, 0x8289: 0x0069, 0x828a: 0x006a, 0x828b: 0x006b, 0x828c: 0x006c,
				0x828d: 0x006d, 0x828e: 0x006e, 0x828f: 0x006f, 0x8290: 0x0070, 0x8291: 0x0071, 0x8292: 0x0072, 0x8293: 0x0073, 0x8294: 0x0074,
				0x8295: 0x0075, 0x8296: 0x0076, 0x8297: 0x0077, 0x8298: 0x0078, 0x8299: 0x0079, 0x829a: 0x007a, 0x829b: 0x30a0, 0x829c: 0x2013,
				0x829d: 0x29fa, 0x829e: 0x29fb, 0x829f: 0x3041, 0x82a0: 0x3042, 0x82a1: 0x3043, 0x82a2: 0x3044, 0x82a3: 0x3045, 0x82a4: 0x3046,
				0x82a5: 0x3047, 0x82a6: 0x3048, 0x82a7: 0x3049, 0x82a8: 0x304a, 0x82a9: 0x304b, 0x82aa: 0x304c, 0x82ab: 0x304d, 0x82ac: 0x304e,
				0x82ad: 0x304f, 0x82ae: 0x3050, 0x82af: 0x3051, 0x82b0: 0x3052, 0x82b1: 0x3053, 0x82b2: 0x3054, 0x82b3: 0x3055, 0x82b4: 0x3056,
				0x82b5: 0x3057, 0x82b6: 0x3058, 0x82b7: 0x3059, 0x82b8: 0x305a, 0x82b9: 0x305b, 0x82ba: 0x305c, 0x82bb: 0x305d, 0x82bc: 0x305e,
				0x82bd: 0x305f, 0x82be: 0x3060, 0x82bf: 0x3061, 0x82c0: 0x3062, 0x82c1: 0x3063, 0x82c2: 0x3064, 0x82c3: 0x3065, 0x82c4: 0x3066,
				0x82c5: 0x3067, 0x82c6: 0x3068, 0x82c7: 0x3069, 0x82c8: 0x306a, 0x82c9: 0x306b, 0x82ca: 0x306c, 0x82cb: 0x306d, 0x82cc: 0x306e,
				0x82cd: 0x306f, 0x82ce: 0x3070, 0x82cf: 0x3071, 0x82d0: 0x3072, 0x82d1: 0x3073, 0x82d2: 0x3074, 0x82d3: 0x3075, 0x82d4: 0x3076,
				0x82d5: 0x3077, 0x82d6: 0x3078, 0x82d7: 0x3079, 0x82d8: 0x307a, 0x82d9: 0x307b, 0x82da: 0x307c, 0x82db: 0x307d, 0x82dc: 0x307e,
				0x82dd: 0x307f, 0x82de: 0x3080, 0x82df: 0x3081, 0x82e0: 0x3082, 0x82e1: 0x3083, 0x82e2: 0x3084, 0x82e3: 0x3085, 0x82e4: 0x3086,
				0x82e5: 0x3087, 0x82e6: 0x3088, 0x82e7: 0x3089, 0x82e8: 0x308a, 0x82e9: 0x308b, 0x82ea: 0x308c, 0x82eb: 0x308d, 0x82ec: 0x308e,
				0x82ed: 0x308f, 0x82ee: 0x3090, 0x82ef: 0x3091, 0x82f0: 0x3092, 0x82f1: 0x3093, 0x82f2: 0x3094, 0x82f3: 0x3095, 0x82f4: 0x3096,
				0x82f5: [0x304b, 0x309a], 0x82f6: [0x304d, 0x309a], 0x82f7: [0x304f, 0x309a], 0x82f8: [0x3051, 0x309a], 0x82f9: [0x3053, 0x309a], 0x8340: 0x30a1, 0x8341: 0x30a2, 0x8342: 0x30a3,
				0x8343: 0x30a4, 0x8344: 0x30a5, 0x8345: 0x30a6, 0x8346: 0x30a7, 0x8347: 0x30a8, 0x8348: 0x30a9, 0x8349: 0x30aa, 0x834a: 0x30ab,
				0x834b: 0x30ac, 0x834c: 0x30ad, 0x834d: 0x30ae, 0x834e: 0x30af, 0x834f: 0x30b0, 0x8350: 0x30b1, 0x8351: 0x30b2, 0x8352: 0x30b3,
				0x8353: 0x30b4, 0x8354: 0x30b5, 0x8355: 0x30b6, 0x8356: 0x30b7, 0x8357: 0x30b8, 0x8358: 0x30b9, 0x8359: 0x30ba, 0x835a: 0x30bb,
				0x835b: 0x30bc, 0x835c: 0x30bd, 0x835d: 0x30be, 0x835e: 0x30bf, 0x835f: 0x30c0, 0x8360: 0x30c1, 0x8361: 0x30c2, 0x8362: 0x30c3,
				0x8363: 0x30c4, 0x8364: 0x30c5, 0x8365: 0x30c6, 0x8366: 0x30c7, 0x8367: 0x30c8, 0x8368: 0x30c9, 0x8369: 0x30ca, 0x836a: 0x30cb,
				0x836b: 0x30cc, 0x836c: 0x30cd, 0x836d: 0x30ce, 0x836e: 0x30cf, 0x836f: 0x30d0, 0x8370: 0x30d1, 0x8371: 0x30d2, 0x8372: 0x30d3,
				0x8373: 0x30d4, 0x8374: 0x30d5, 0x8375: 0x30d6, 0x8376: 0x30d7, 0x8377: 0x30d8, 0x8378: 0x30d9, 0x8379: 0x30da, 0x837a: 0x30db,
				0x837b: 0x30dc, 0x837c: 0x30dd, 0x837d: 0x30de, 0x837e: 0x30df, 0x8380: 0x30e0, 0x8381: 0x30e1, 0x8382: 0x30e2, 0x8383: 0x30e3,
				0x8384: 0x30e4, 0x8385: 0x30e5, 0x8386: 0x30e6, 0x8387: 0x30e7, 0x8388: 0x30e8, 0x8389: 0x30e9, 0x838a: 0x30ea, 0x838b: 0x30eb,
				0x838c: 0x30ec, 0x838d: 0x30ed, 0x838e: 0x30ee, 0x838f: 0x30ef, 0x8390: 0x30f0, 0x8391: 0x30f1, 0x8392: 0x30f2, 0x8393: 0x30f3,
				0x8394: 0x30f4, 0x8395: 0x30f5, 0x8396: 0x30f6, 0x8397: [0x30ab, 0x309a], 0x8398: [0x30ad, 0x309a], 0x8399: [0x30af, 0x309a], 0x839a: [0x30b1, 0x309a], 0x839b: [0x30b3, 0x309a],
				0x839c: [0x30bb, 0x309a], 0x839d: [0x30c4, 0x309a], 0x839e: [0x30c8, 0x309a], 0x839f: 0x0391, 0x83a0: 0x0392, 0x83a1: 0x0393, 0x83a2: 0x0394, 0x83a3: 0x0395,
				0x83a4: 0x0396, 0x83a5: 0x0397, 0x83a6: 0x0398, 0x83a7: 0x0399, 0x83a8: 0x039a, 0x83a9: 0x039b, 0x83aa: 0x039c, 0x83ab: 0x039d,
				0x83ac: 0x039e, 0x83ad: 0x039f, 0x83ae: 0x03a0, 0x83af: 0x03a1, 0x83b0: 0x03a3, 0x83b1: 0x03a4, 0x83b2: 0x03a5, 0x83b3: 0x03a6,
				0x83b4: 0x03a7, 0x83b5: 0x03a8, 0x83b6: 0x03a9, 0x83b7: 0x2664, 0x83b8: 0x2660, 0x83b9: 0x2662, 0x83ba: 0x2666, 0x83bb: 0x2661,
				0x83bc: 0x2665, 0x83bd: 0x2667, 0x83be: 0x2663, 0x83bf: 0x03b1, 0x83c0: 0x03b2, 0x83c1: 0x03b3, 0x83c2: 0x03b4, 0x83c3: 0x03b5,
				0x83c4: 0x03b6, 0x83c5: 0x03b7, 0x83c6: 0x03b8, 0x83c7: 0x03b9, 0x83c8: 0x03ba, 0x83c9: 0x03bb, 0x83ca: 0x03bc, 0x83cb: 0x03bd,
				0x83cc: 0x03be, 0x83cd: 0x03bf, 0x83ce: 0x03c0, 0x83cf: 0x03c1, 0x83d0: 0x03c3, 0x83d1: 0x03c4, 0x83d2: 0x03c5, 0x83d3: 0x03c6,
				0x83d4: 0x03c7, 0x83d5: 0x03c8, 0x83d6: 0x03c9, 0x83d7: 0x03c2, 0x83d8: 0x24f5, 0x83d9: 0x24f6, 0x83da: 0x24f7, 0x83db: 0x24f8,
				0x83dc: 0x24f9, 0x83dd: 0x24fa, 0x83de: 0x24fb, 0x83df: 0x24fc, 0x83e0: 0x24fd, 0x83e1: 0x24fe, 0x83e2: 0x2616, 0x83e3: 0x2617,
				0x83e4: 0x3020, 0x83e5: 0x260e, 0x83e6: 0x2600, 0x83e7: 0x2601, 0x83e8: 0x2602, 0x83e9: 0x2603, 0x83ea: 0x2668, 0x83eb: 0x25b1,
				0x83ec: 0x31f0, 0x83ed: 0x31f1, 0x83ee: 0x31f2, 0x83ef: 0x31f3, 0x83f0: 0x31f4, 0x83f1: 0x31f5, 0x83f2: 0x31f6, 0x83f3: 0x31f7,
				0x83f4: 0x31f8, 0x83f5: 0x31f9, 0x83f6: [0x31f7, 0x309a], 0x83f7: 0x31fa, 0x83f8: 0x31fb, 0x83f9: 0x31fc, 0x83fa: 0x31fd, 0x83fb: 0x31fe,
				0x83fc: 0x31ff, 0x8440: 0x0410, 0x8441: 0x0411, 0x8442: 0x0412, 0x8443: 0x0413, 0x8444: 0x0414, 0x8445: 0x0415, 0x8446: 0x0401,
				0x8447: 0x0416, 0x8448: 0x0417, 0x8449: 0x0418, 0x844a: 0x0419, 0x844b: 0x041a, 0x844c: 0x041b, 0x844d: 0x041c, 0x844e: 0x041d,
				0x844f: 0x041e, 0x8450: 0x041f, 0x8451: 0x0420, 0x8452: 0x0421, 0x8453: 0x0422, 0x8454: 0x0423, 0x8455: 0x0424, 0x8456: 0x0425,
				0x8457: 0x0426, 0x8458: 0x0427, 0x8459: 0x0428, 0x845a: 0x0429, 0x845b: 0x042a, 0x845c: 0x042b, 0x845d: 0x042c, 0x845e: 0x042d,
				0x845f: 0x042e, 0x8460: 0x042f, 0x8461: 0x23be, 0x8462: 0x23bf, 0x8463: 0x23c0, 0x8464: 0x23c1, 0x8465: 0x23c2, 0x8466: 0x23c3,
				0x8467: 0x23c4, 0x8468: 0x23c5, 0x8469: 0x23c6, 0x846a: 0x23c7, 0x846b: 0x23c8, 0x846c: 0x23c9, 0x846d: 0x23ca, 0x846e: 0x23cb,
				0x846f: 0x23cc, 0x8470: 0x0430, 0x8471: 0x0431, 0x8472: 0x0432, 0x8473: 0x0433, 0x8474: 0x0434, 0x8475: 0x0435, 0x8476: 0x0451,
				0x8477: 0x0436, 0x8478: 0x0437, 0x8479: 0x0438, 0x847a: 0x0439, 0x847b: 0x043a, 0x847c: 0x043b, 0x847d: 0x043c, 0x847e: 0x043d,
				0x8480: 0x043e, 0x8481: 0x043f, 0x8482: 0x0440, 0x8483: 0x0441, 0x8484: 0x0442, 0x8485: 0x0443, 0x8486: 0x0444, 0x8487: 0x0445,
				0x8488: 0x0446, 0x8489: 0x0447, 0x848a: 0x0448, 0x848b: 0x0449, 0x848c: 0x044a, 0x848d: 0x044b, 0x848e: 0x044c, 0x848f: 0x044d,
				0x8490: 0x044e, 0x8491: 0x044f, 0x8492: 0x30f7, 0x8493: 0x30f8, 0x8494: 0x30f9, 0x8495: 0x30fa, 0x8496: 0x22da, 0x8497: 0x22db,
				0x8498: 0x2153, 0x8499: 0x2154, 0x849a: 0x2155, 0x849b: 0x2713, 0x849c: 0x2318, 0x849d: 0x2423, 0x849e: 0x23ce, 0x849f: 0x2500,
				0x84a0: 0x2502, 0x84a1: 0x250c, 0x84a2: 0x2510, 0x84a3: 0x2518, 0x84a4: 0x2514, 0x84a5: 0x251c, 0x84a6: 0x252c, 0x84a7: 0x2524,
				0x84a8: 0x2534, 0x84a9: 0x253c, 0x84aa: 0x2501, 0x84ab: 0x2503, 0x84ac: 0x250f, 0x84ad: 0x2513, 0x84ae: 0x251b, 0x84af: 0x2517,
				0x84b0: 0x2523, 0x84b1: 0x2533, 0x84b2: 0x252b, 0x84b3: 0x253b, 0x84b4: 0x254b, 0x84b5: 0x2520, 0x84b6: 0x252f, 0x84b7: 0x2528,
				0x84b8: 0x2537, 0x84b9: 0x253f, 0x84ba: 0x251d, 0x84bb: 0x2530, 0x84bc: 0x2525, 0x84bd: 0x2538, 0x84be: 0x2542, 0x84bf: 0x3251,
				0x84c0: 0x3252, 0x84c1: 0x3253, 0x84c2: 0x3254, 0x84c3: 0x3255, 0x84c4: 0x3256, 0x84c5: 0x3257, 0x84c6: 0x3258, 0x84c7: 0x3259,
				0x84c8: 0x325a, 0x84c9: 0x325b, 0x84ca: 0x325c, 0x84cb: 0x325d, 0x84cc: 0x325e, 0x84cd: 0x325f, 0x84ce: 0x32b1, 0x84cf: 0x32b2,
				0x84d0: 0x32b3, 0x84d1: 0x32b4, 0x84d2: 0x32b5, 0x84d3: 0x32b6, 0x84d4: 0x32b7, 0x84d5: 0x32b8, 0x84d6: 0x32b9, 0x84d7: 0x32ba,
				0x84d8: 0x32bb, 0x84d9: 0x32bc, 0x84da: 0x32bd, 0x84db: 0x32be, 0x84dc: 0x32bf, 0x84e5: 0x25d0, 0x84e6: 0x25d1, 0x84e7: 0x25d2,
				0x84e8: 0x25d3, 0x84e9: 0x203c, 0x84ea: 0x2047, 0x84eb: 0x2048, 0x84ec: 0x2049, 0x84ed: 0x01cd, 0x84ee: 0x01ce, 0x84ef: 0x01d0,
				0x84f0: 0x1e3e, 0x84f1: 0x1e3f, 0x84f2: 0x01f8, 0x84f3: 0x01f9, 0x84f4: 0x01d1, 0x84f5: 0x01d2, 0x84f6: 0x01d4, 0x84f7: 0x01d6,
				0x84f8: 0x01d8, 0x84f9: 0x01da, 0x84fa: 0x01dc, 0x8540: 0x20ac, 0x8541: 0x00a0, 0x8542: 0x00a1, 0x8543: 0x00a4, 0x8544: 0x00a6,
				0x8545: 0x00a9, 0x8546: 0x00aa, 0x8547: 0x00ab, 0x8548: 0x00ad, 0x8549: 0x00ae, 0x854a: 0x00af, 0x854b: 0x00b2, 0x854c: 0x00b3,
				0x854d: 0x00b7, 0x854e: 0x00b8, 0x854f: 0x00b9, 0x8550: 0x00ba, 0x8551: 0x00bb, 0x8552: 0x00bc, 0x8553: 0x00bd, 0x8554: 0x00be,
				0x8555: 0x00bf, 0x8556: 0x00c0, 0x8557: 0x00c1, 0x8558: 0x00c2, 0x8559: 0x00c3, 0x855a: 0x00c4, 0x855b: 0x00c5, 0x855c: 0x00c6,
				0x855d: 0x00c7, 0x855e: 0x00c8, 0x855f: 0x00c9, 0x8560: 0x00ca, 0x8561: 0x00cb, 0x8562: 0x00cc, 0x8563: 0x00cd, 0x8564: 0x00ce,
				0x8565: 0x00cf, 0x8566: 0x00d0, 0x8567: 0x00d1, 0x8568: 0x00d2, 0x8569: 0x00d3, 0x856a: 0x00d4, 0x856b: 0x00d5, 0x856c: 0x00d6,
				0x856d: 0x00d8, 0x856e: 0x00d9, 0x856f: 0x00da, 0x8570: 0x00db, 0x8571: 0x00dc, 0x8572: 0x00dd, 0x8573: 0x00de, 0x8574: 0x00df,
				0x8575: 0x00e0, 0x8576: 0x00e1, 0x8577: 0x00e2, 0x8578: 0x00e3, 0x8579: 0x00e4, 0x857a: 0x00e5, 0x857b: 0x00e6, 0x857c: 0x00e7,
				0x857d: 0x00e8, 0x857e: 0x00e9, 0x8580: 0x00ea, 0x8581: 0x00eb, 0x8582: 0x00ec, 0x8583: 0x00ed, 0x8584: 0x00ee, 0x8585: 0x00ef,
				0x8586: 0x00f0, 0x8587: 0x00f1, 0x8588: 0x00f2, 0x8589: 0x00f3, 0x858a: 0x00f4, 0x858b: 0x00f5, 0x858c: 0x00f6, 0x858d: 0x00f8,
				0x858e: 0x00f9, 0x858f: 0x00fa, 0x8590: 0x00fb, 0x8591: 0x00fc, 0x8592: 0x00fd, 0x8593: 0x00fe, 0x8594: 0x00ff, 0x8595: 0x0100,
				0x8596: 0x012a, 0x8597: 0x016a, 0x8598: 0x0112, 0x8599: 0x014c, 0x859a: 0x0101, 0x859b: 0x012b, 0x859c: 0x016b, 0x859d: 0x0113,
				0x859e: 0x014d, 0x859f: 0x0104, 0x85a0: 0x02d8, 0x85a1: 0x0141, 0x85a2: 0x013d, 0x85a3: 0x015a, 0x85a4: 0x0160, 0x85a5: 0x015e,
				0x85a6: 0x0164, 0x85a7: 0x0179, 0x85a8: 0x017d, 0x85a9: 0x017b, 0x85aa: 0x0105, 0x85ab: 0x02db, 0x85ac: 0x0142, 0x85ad: 0x013e,
				0x85ae: 0x015b, 0x85af: 0x02c7, 0x85b0: 0x0161, 0x85b1: 0x015f, 0x85b2: 0x0165, 0x85b3: 0x017a, 0x85b4: 0x02dd, 0x85b5: 0x017e,
				0x85b6: 0x017c, 0x85b7: 0x0154, 0x85b8: 0x0102, 0x85b9: 0x0139, 0x85ba: 0x0106, 0x85bb: 0x010c, 0x85bc: 0x0118, 0x85bd: 0x011a,
				0x85be: 0x010e, 0x85bf: 0x0143, 0x85c0: 0x0147, 0x85c1: 0x0150, 0x85c2: 0x0158, 0x85c3: 0x016e, 0x85c4: 0x0170, 0x85c5: 0x0162,
				0x85c6: 0x0155, 0x85c7: 0x0103, 0x85c8: 0x013a, 0x85c9: 0x0107, 0x85ca: 0x010d, 0x85cb: 0x0119, 0x85cc: 0x011b, 0x85cd: 0x010f,
				0x85ce: 0x0111, 0x85cf: 0x0144, 0x85d0: 0x0148, 0x85d1: 0x0151, 0x85d2: 0x0159, 0x85d3: 0x016f, 0x85d4: 0x0171, 0x85d5: 0x0163,
				0x85d6: 0x02d9, 0x85d7: 0x0108, 0x85d8: 0x011c, 0x85d9: 0x0124, 0x85da: 0x0134, 0x85db: 0x015c, 0x85dc: 0x016c, 0x85dd: 0x0109,
				0x85de: 0x011d, 0x85df: 0x0125, 0x85e0: 0x0135, 0x85e1: 0x015d, 0x85e2: 0x016d, 0x85e3: 0x0271, 0x85e4: 0x028b, 0x85e5: 0x027e,
				0x85e6: 0x0283, 0x85e7: 0x0292, 0x85e8: 0x026c, 0x85e9: 0x026e, 0x85ea: 0x0279, 0x85eb: 0x0288, 0x85ec: 0x0256, 0x85ed: 0x0273,
				0x85ee: 0x027d, 0x85ef: 0x0282, 0x85f0: 0x0290, 0x85f1: 0x027b, 0x85f2: 0x026d, 0x85f3: 0x025f, 0x85f4: 0x0272, 0x85f5: 0x029d,
				0x85f6: 0x028e, 0x85f7: 0x0261, 0x85f8: 0x014b, 0x85f9: 0x0270, 0x85fa: 0x0281, 0x85fb: 0x0127, 0x85fc: 0x0295, 0x8640: 0x0294,
				0x8641: 0x0266, 0x8642: 0x0298, 0x8643: 0x01c2, 0x8644: 0x0253, 0x8645: 0x0257, 0x8646: 0x0284, 0x8647: 0x0260, 0x8648: 0x0193,
				0x8649: 0x0153, 0x864a: 0x0152, 0x864b: 0x0268, 0x864c: 0x0289, 0x864d: 0x0258, 0x864e: 0x0275, 0x864f: 0x0259, 0x8650: 0x025c,
				0x8651: 0x025e, 0x8652: 0x0250, 0x8653: 0x026f, 0x8654: 0x028a, 0x8655: 0x0264, 0x8656: 0x028c, 0x8657: 0x0254, 0x8658: 0x0251,
				0x8659: 0x0252, 0x865a: 0x028d, 0x865b: 0x0265, 0x865c: 0x02a2, 0x865d: 0x02a1, 0x865e: 0x0255, 0x865f: 0x0291, 0x8660: 0x027a,
				0x8661: 0x0267, 0x8662: 0x025a, 0x8663: [0x00e6, 0x0300], 0x8664: 0x01fd, 0x8665: [0x0251, 0x0300], 0x8666: [0x0251, 0x0301], 0x8667: [0x0254, 0x0300], 0x8668: [0x0254, 0x0301],
				0x8669: [0x028c, 0x0300], 0x866a: [0x028c, 0x0301], 0x866b: [0x0259, 0x0300], 0x866c: [0x0259, 0x0301], 0x866d: [0x025a, 0x0300], 0x866e: [0x025a, 0x0301], 0x866f: [0x025b, 0x0300], 0x8670: [0x025b, 0x0301],
				0x8671: 0x0361, 0x8672: 0x02c8, 0x8673: 0x02cc, 0x8674: 0x02d0, 0x8675: 0x02d1, 0x8676: 0x0306, 0x8677: 0x203f, 0x8678: 0x030b,
				0x8679: 0x0301, 0x867a: 0x0304, 0x867b: 0x0300, 0x867c: 0x030f, 0x867d: 0x030c, 0x867e: 0x0302, 0x8680: 0x02e5, 0x8681: 0x02e6,
				0x8682: 0x02e7, 0x8683: 0x02e8, 0x8684: 0x02e9, 0x8685: [0x02e9, 0x02e5], 0x8686: [0x02e5, 0x02e9], 0x8687: 0x0325, 0x8688: 0x032c, 0x8689: 0x0339,
				0x868a: 0x031c, 0x868b: 0x031f, 0x868c: 0x0320, 0x868d: 0x0308, 0x868e: 0x033d, 0x868f: 0x0329, 0x8690: 0x032f, 0x8691: 0x02de,
				0x8692: 0x0324, 0x8693: 0x0330, 0x8694: 0x033c, 0x8695: 0x0334, 0x8696: 0x031d, 0x8697: 0x031e, 0x8698: 0x0318, 0x8699: 0x0319,
				0x869a: 0x032a, 0x869b: 0x033a, 0x869c: 0x033b, 0x869d: 0x0303, 0x869e: 0x031a, 0x869f: 0x2776, 0x86a0: 0x2777, 0x86a1: 0x2778,
				0x86a2: 0x2779, 0x86a3: 0x277a, 0x86a4: 0x277b, 0x86a5: 0x277c, 0x86a6: 0x277d, 0x86a7: 0x277e, 0x86a8: 0x277f, 0x86a9: 0x24eb,
				0x86aa: 0x24ec, 0x86ab: 0x24ed, 0x86ac: 0x24ee, 0x86ad: 0x24ef, 0x86ae: 0x24f0, 0x86af: 0x24f1, 0x86b0: 0x24f2, 0x86b1: 0x24f3,
				0x86b2: 0x24f4, 0x86b3: 0x2170, 0x86b4: 0x2171, 0x86b5: 0x2172, 0x86b6: 0x2173, 0x86b7: 0x2174, 0x86b8: 0x2175, 0x86b9: 0x2176,
				0x86ba: 0x2177, 0x86bb: 0x2178, 0x86bc: 0x2179, 0x86bd: 0x217a, 0x86be: 0x217b, 0x86bf: 0x24d0, 0x86c0: 0x24d1, 0x86c1: 0x24d2,
				0x86c2: 0x24d3, 0x86c3: 0x24d4, 0x86c4: 0x24d5, 0x86c5: 0x24d6, 0x86c6: 0x24d7, 0x86c7: 0x24d8, 0x86c8: 0x24d9, 0x86c9: 0x24da,
				0x86ca: 0x24db, 0x86cb: 0x24dc, 0x86cc: 0x24dd, 0x86cd: 0x24de, 0x86ce: 0x24df, 0x86cf: 0x24e0, 0x86d0: 0x24e1, 0x86d1: 0x24e2,
				0x86d2: 0x24e3, 0x86d3: 0x24e4, 0x86d4: 0x24e5, 0x86d5: 0x24e6, 0x86d6: 0x24e7, 0x86d7: 0x24e8, 0x86d8: 0x24e9, 0x86d9: 0x32d0,
				0x86da: 0x32d1, 0x86db: 0x32d2, 0x86dc: 0x32d3, 0x86dd: 0x32d4, 0x86de: 0x32d5, 0x86df: 0x32d6, 0x86e0: 0x32d7, 0x86e1: 0x32d8,
				0x86e2: 0x32d9, 0x86e3: 0x32da, 0x86e4: 0x32db, 0x86e5: 0x32dc, 0x86e6: 0x32dd, 0x86e7: 0x32de, 0x86e8: 0x32df, 0x86e9: 0x32e0,
				0x86ea: 0x32e1, 0x86eb: 0x32e2, 0x86ec: 0x32e3, 0x86ed: 0x32fa, 0x86ee: 0x32e9, 0x86ef: 0x32e5, 0x86f0: 0x32ed, 0x86f1: 0x32ec,
				0x86fb: 0x2051, 0x86fc: 0x2042, 0x8740: 0x2460, 0x8741: 0x2461, 0x8742: 0x2462, 0x8743: 0x2463, 0x8744: 0x2464, 0x8745: 0x2465,
				0x8746: 0x2466, 0x8747: 0x2467, 0x8748: 0x2468, 0x8749: 0x2469, 0x874a: 0x246a, 0x874b: 0x246b, 0x874c: 0x246c, 0x874d: 0x246d,
				0x874e: 0x246e, 0x874f: 0x246f, 0x8750: 0x2470, 0x8751: 0x2471, 0x8752: 0x2472, 0x8753: 0x2473, 0x8754: 0x2160, 0x8755: 0x2161,
				0x8756: 0x2162, 0x8757: 0x2163, 0x8758: 0x2164, 0x8759: 0x2165, 0x875a: 0x2166, 0x875b: 0x2167, 0x875c: 0x2168, 0x875d: 0x2169,
				0x875e: 0x216a, 0x875f: 0x3349, 0x8760: 0x3314, 0x8761: 0x3322, 0x8762: 0x334d, 0x8763: 0x3318, 0x8764: 0x3327, 0x8765: 0x3303,
				0x8766: 0x3336, 0x8767: 0x3351, 0x8768: 0x3357, 0x8769: 0x330d, 0x876a: 0x3326, 0x876b: 0x3323, 0x876c: 0x332b, 0x876d: 0x334a,
				0x876e: 0x333b, 0x876f: 0x339c, 0x8770: 0x339d, 0x8771: 0x339e, 0x8772: 0x338e, 0x8773: 0x338f, 0x8774: 0x33c4, 0x8775: 0x33a1,
				0x8776: 0x216b, 0x877e: 0x337b, 0x8780: 0x301d, 0x8781: 0x301f, 0x8782: 0x2116, 0x8783: 0x33cd, 0x8784: 0x2121, 0x8785: 0x32a4,
				0x8786: 0x32a5, 0x8787: 0x32a6, 0x8788: 0x32a7, 0x8789: 0x32a8, 0x878a: 0x3231, 0x878b: 0x3232, 0x878c: 0x3239, 0x878d: 0x337e,
				0x878e: 0x337d, 0x878f: 0x337c, 0x8793: 0x222e, 0x8798: 0x221f, 0x8799: 0x22bf, 0x879d: 0x2756, 0x879e: 0x261e
			};

			/**
			 * 漢字の2バイト文字（0x879f-0xffff）の変換マップ作成用の文字列
			 * 
			 * @type {string}
			 */
			let map = "俱𠀋㐂丨丯丰亍仡份仿伃伋你佈佉佖佟佪佬佾侊侔侗侮俉俠倁倂倎倘倧倮偀倻偁傔僌僲僐僦僧儆儃儋儞儵兊免兕兗㒵冝凃凊凞凢凮刁㓛刓刕剉剗剡劓勈勉勌勐勖勛勤勰勻匀匇匜卑卡卣卽厓厝厲吒吧呍咜呫呴呿咈咖咡67";
			map += "咩哆哿唎唫唵啐啞喁喆喎喝喭嗎嘆嘈嘎嘻噉噶噦器噯噱噲嚙嚞嚩嚬嚳囉囊圊𡈽圡圯圳圴坰坷坼垜﨏𡌛垸埇埈埏埤埭埵埶埿堉塚塡塤塀塼墉增墨墩1𡑮壒壎壔壚壠壩夌虁奝奭妋妒妤姃姒姝娓娣婧婭婷婾媄媞媧嫄𡢽嬙嬥剝亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭67";
			map += "院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円1園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改67";
			map += "魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫1橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄67";
			map += "機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救1朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈67";
			map += "掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨1劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向67";
			map += "后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降1項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷67";
			map += "察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止1死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周67";
			map += "宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳1準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾67";
			map += "拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨1逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線67";
			map += "繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻1操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只67";
			map += "叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄1逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓67";
			map += "邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬1凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入67";
			map += "如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅1楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美67";
			map += "鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷1斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋67";
			map += "法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆1摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒67";
			map += "諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲1沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯67";
			map += "蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕𠮟孁孖孽宓寘寬尒尞尣尫㞍1屢層屮𡚴屺岏岟岣岪岺峋峐峒峴𡸴㟢崍崧﨑嵆嵇嵓嵊嵭嶁嶠嶤嶧嶸巋吞弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲67";
			map += "僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭1凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨67";
			map += "咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸1噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩67";
			map += "奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀1它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏67";
			map += "廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠1怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛67";
			map += "戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫1捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼67";
			map += "曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎1梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣67";
			map += "檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯1麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌16451";
			map += "漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝1烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱67";
			map += "瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿1痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬67";
			map += "磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰1窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆67";
			map += "紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷1縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋67";
			map += "隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤1艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈67";
			map += "蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬1蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞67";
			map += "襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧1諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊67";
			map += "蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜1轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮67";
			map += "錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙1閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰67";
			map += "顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃1騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈67";
			map += "鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯1黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙噓巢帔帘幘幞庾廊廋廹开异弇弝弣弴弶弽彀彅彔彘彤彧彽徉徜徧徯徵德忉忞忡忩怍怔怘怳怵恇悔悝悞惋惔惕惝惸愜愫愰愷慨憍憎憼憹懲戢戾扃扖扚扯抅拄拖拼挊挘挹捃捥捼揥揭揵搐搔搢摹摑摠摭擎撾撿67";
			map += "擄擊擐擷擻攢攩敏敧斝既昀昉昕昞昺昢昤昫昰昱昳曻晈晌𣇄晙晚晡晥晳晷晸暍暑暠暲暻曆曈㬢曛曨曺朓朗朳杦杇杈杻极枓枘枛枻柹柀柗柼栁桒栝1栬栱桛桲桵梅梣梥梲棈棐棨棭棰棱棼椊楉𣗄椵楂楗楣楤楨榀﨔榥榭槏㮶㯃槢槩槪槵槶樏樕𣜿樻樾橅橐橖橛橫橳𣝣檉檔檝檞檥櫤櫧㰏欄欛欞欬欵歆歖歠步歧歷殂殩殭殺每毖毗毿氅氐氳汙汜沪汴汶沅沆沘沜泻泆泔泠泫泮𣳾洄洎洮洱洹洿浘浥海涂涇涉涔涪涬涿淄淖淚淛淝淼渚渴湄湜湞溫溱滁67";
			map += "滇滎漐漚漢漪漯漳潑潙潞潡潢潾澈澌澍澔澠澧澶澼濇濊濹濰濵瀅瀆瀨灊灝灞灎灤灵炅炤炫炷烔烘烤焏焫焞焠焮焰煆煇煑煮煒煜煠煨凞熅熇熒燁熺1燄燾爀爕牕牖㸿犍犛犾狀狻𤟱猧猨猪獐獦獼玕玟玠玢玦玫珉珏珖珙珣珩琇琊琚琛琢琦琨琪琫琬琮琯琰瑄瑆瑇瑋瑗瑢瑫瑭璆璇璉璘璜璟璣璐璦璨璩璵璿瓈瓉瓚瓿甁甗甯畯畹疒㽲痎痤瘀瘂瘈瘕瘖瘙瘞瘭瘵癃癋癤癥癭癯癱皁皛皝皞皦皪皶盅盌盎盔盦盱盼眊眙眴眶睆睍睎睜睟睢睺瞀瞔瞪矠砭𥒎67";
			map += "硃硎硏硑硨确碑碰𥔎碭磤磲礀磷礜礮礱礴社祉祅祆祈祐祖祜祝神祥祹禍禎福禘禱禸秈秊𥝱秔秞秫秭稃穀稹穝穭突窅窠𥧄窳窻竎竫竽笒笭笻筇筎筠1筭筯筲箞節篗篙簁簱簞簠簳簶䉤𥶡籙籭籹粏粔粠粼糕糙糝紇紈紓紝紣紱絁絈絓絜絺綃綋綠綦緂緌緖緣練縨縈縑縕繁繇繒繡纊纍罇署羑羗羿翎翛翟翬翮翺者耔耦耵耷耼胊胗胠胳脘腊腠腧腨腭膻臊臏臗臭䑓䑛艠艴𦫿芎芡芣芤芩芮芷芾芿苆苕苽苾茀茁荢茢茭茺荃荇荑荕荽莆莒莘莧莩莿菀菇菏67";
			map += "菑菡菪萁萆萊著葈葟葰葳蒅蒞蒯蒴蒺蓀蓂𦹀蔲蔞蔣蔯蕙蕤﨟薭蕺薌薏薢薰藋藎藭蘒藿蘄蘅蘐𧃴蘘蘩蘸虗虛虜虢䖝虬虵蚘蚸蛺蛼蛽蜋蝱螇螈螬螭螵1䗪蟖蟬蠆蠊蠐蠔蠟袘袪裊裎𧚄裵褜褐褘褙褚褧褰褲褹襀覔視觔觥觶訒訕訢訷詇詎詝詡詵詹誧諐諟諴諶諸謁謹譆譔譙譩讝豉豨賓賡賴賸賾贈贒贛趯跎跑跗踠踣踽蹰蹻𨉷軀䡄軺輞輭輶轔𨏍辦辵迤迨迮逈逭逸邈邕邗邙邛邢邳邾郄郅郇郗郝郞郯郴都鄔鄕鄖鄢鄣鄧鄯鄱鄴鄽酈酛醃醞醬醱醼釗釻釤67";
			map += "釥釭釱鈇鈐鈸鈹鈺鈼鉀鉃鉏鉸銈鋂鋋鋌鋓鋠鋿錄錟錡錥鍈鍉鍊鍤鍥鍪鍰鎛鎣鎺鏆鏞鏟鐄鏽鐳鑊鑣鑫鑱鑲閎閟閦閩閬閶閽闋闐闓䦰闚闞陘隄隆隝隤1隥雒雞難雩雯霳霻靍靎靏靚靮靳鞕鞮鞺韁韉韞韛韴響頊頞頫頰頻顒顓顖顗顙顚類顥顬颺飈飧饘馞騂騃騤騭騮騸驊驎驒骶髁髃髎髖髹鬂鬈鬠䰗鬭魞魹魦魲魵鮄鮊鮏鮞鮧鯁鯎鯥鯸鯽鰀鰣鱁鱏鱐鱓鱣鱥鱷鴝鴞鵃鵇鵒鵣鵰鵼鶊鶖鷀鶬鶼鷗𪆐鷧鸇鸕鹼麞麤麬麯麴麵黃黑鼐鼹齗龐龔龗龢姸屛幷瘦繫67";
			map += "𠂉丂丏丒丩丫丮乀乇么𠂢乑㐆𠂤乚乩亝㐬㐮亹亻𠆢亼仃仈仐仫仚仱仵伀伖佤伷伾佔佘𠈓佷佸佺佽侂侅侒侚俦侲侾俅俋俏俒㑪俲倀倐倓倜倞倢㑨偂1偆偎偓偗偣偦偪偰傣傈傒傓傕傖傜傪𠌫傱傺傻僄僇僳𠎁僎𠍱僔僙僡僩㒒宖宬㝡寀㝢寎寖㝬㝫寱寽㝵尃尩尰𡱖屟屣屧屨屩屰𡴭𡵅屼𡵸𡵢岈岊㟁𡶡𡶜岠岢岦岧𡶒岭岵𡶷峉𡷠𡸳崆崐崫崝崠崤崦崱崹嵂㟨嵡嵪㟴嵰𡼞㟽嶈㠀嶒嶔嶗嶙嶰嶲嶴𡽶嶹巑巗巘巠𡿺巤巩㠯帀㠶帒帕㡀帟帮帾幉㡜幖㡡幫幬幭67";
			map += "儈𠏹儗儛𠑊兠𠔉关冃冋㒼冘冣冭㓇冼𠗖𠘨凳凴刂划刖𠝏剕剜剬剷劄劂𠠇劘𠠺劤劦劯劺劻勊㔟勑𠢹勷匊匋匤匵匾卂𠥼𠦝卧卬卺厤厴𠫓厷叀𠬝㕝㕞叕1叚㕣叴叵呕吤吨㕮呃呢呦呬咊咍咕咠咦咭咮咷咺咿哃𠵅哬哯哱哳唀唁唉唼啁㖦啇啊㖨啠啡啤𠷡啽喂喈喑㗅嗒𠺕𠹭喿嗉嗌嗑嗝㗚嗢𠹤嗩嘨𠽟嘇嘐嘰嘷㗴嘽嘿噀噇噞噠噭㘅嚈嚌嚕嚚嚝嚨嚭嚲囅囍囟囨囶囷𡈁圕圣𡉕圩𡉻坅坆坌坍𡉴坨坯坳坴坵坻𡋤𡋗垬垚垝垞垨埗𡋽埌𡌶𡍄埞埦埰㙊埸埻埽堄堞67";
			map += "堠堧堲堹𡏄塉塌塧墊墋墍墏墐墔墝墪墱𡑭壃壍壢壳壴夅夆夋复夔夤𡗗㚑夽㚙奆㚖𦰩奛奟𡙇奵奶奼妟妮妼姈姍姞姣姤姧姮𡜆𡝂㛏娌娍娗娧娭婕婥婺1媋媜媟媠媢媱媳媵媺媿嫚嫜嫠嫥嫰嫮嫵嬀嬈嬗嬴嬭孌孒孨孯孼孿宁宄𡧃幮𢅻庥庪庬庹庿廆廒廙𢌞廽弈弎弜𢎭弞彇彣彲彾徏徢徤徸忄㣺忇忋忒忓忔忢忮忯忳忼㤗怗怢怤㤚恌恿悊悕您𢛳悰悱悾惈惙惛惮惲惵愐愒愓愙愞愺㥯慁慆慠慼𢡛憒憓憗憘憥憨憭𢢫懕懝懟懵𢦏戕戣戩扆扌扑扒扡扤扻扭扳67";
			map += "抙抦拕𢪸拽挃挍挐𢭏𢭐挲挵挻挼捁捄捎𢭆捙𢰝𢮦捬掄掙𢰤掔掽揷揔揕揜揠揫揬揲搉搞搥搩搯摚摛摝摳摽撇撑撝撟擋擌擕擗𢷡擤擥擿攄㩮攏攔攖㩳1攞攲敄敔敫敺斁斄斅斊斲斵斸斿旂旉旔㫖旲旹旼昄昈昡昪晅晑晎㫪𣇃晗晛晣𣇵𣆶晪晫晬晭晻暀暐暒暙㬎暭暱暵㬚暿㬜曬㫗朁朅朒𣍲朙𣏓𣏒杌杍杔杝𣏐𣏤𣏕杴杶𣏚枒𣏟荣栐枰枲柃柈柒柙柛柰柷𣑊𣑑𣑋栘栟栭𣑥栳栻栾桄桅桉桌桕桗㭷桫桮桺桼梂梐梖㭭梘梙梚梜梪梫梴梻棻𣓤𣕚﨓棃棅棌棏棖67";
			map += "棙棤棥棬棷椃椇㮇㮈𣖔椻㮍楆楩楬楲楺楿榒㮤榖榘榦榰榷榺榼槀槑槖𣘹𣙇樰𣘸𣘺槣槮槯槳㯍槴槾樑樚樝𣜜樲樳樴樿橆橉橺橎橒橤𣜌橾檃檋㯰檑檟1檡𣝤檫檽櫆櫔櫐櫜櫝𣟿𣟧櫬櫱櫲櫳櫽𣠤欋欏欐欑𣠽欗㰦欯歊歘歬歵歺殁殛殮𣪘殽殾毇毈毉毚毦毧毮毱氂氊氎氵氶氺𣱿氿汍汛汭沄沉㳃沔沕沗沭泂泐㳒泖泚泜泩泬泭𣴀洀洊洤洦洧汧洯洼浛浞浠浰涀涁涊涍涑涘𣵀渗𣷺𣷹𣷓涫涮涴淂洴淈淎淏淐淟淩淶渶渞渢渧㴑渲渼湈湉湋湌湏湑湓湔湗湣㴞67";
			map += "溓溧溴溿滃滊滙漵滫滹滻漊漌漘漥漶漼𣽾潒潗潚潠潨澘潽澐澖澾澟澥澯㵤澵濈濉濚濞濩𤂖濼瀀瀇瀊瀣𤄃瀹瀺瀼灃灇灋㶚灔灥灩灬灮灶灾炁炆炕炗1炻𤇆炟炱𤇾烬烊烑烓烜焃焄焆焇焈焌㷀焯焱煐煊煓煞㷔熖熀熛熠熢熮熯熳𤎼燋燓燙燜爇㸅爫爫爴爸爹丬牂牓牗牣𤘩牮牯牸牿犎𤚥犭犮犰犱狁㹠狌㹦㹨狳狺猇猒猘猙㺃猹猬猱猳猽獒㺔獫獬𤢖獮獯獱獷玁玅玊玔玘玜玞玥玨玵玷玹玼玿珅珋珡珧珹琓珺琁琤琱琹瑓瑀瑃瑍瑒瑝瑱璁璅璈𤩍璒璗璙67";
			map += "璠璡璥璪璫璹璻璺瓖瓘瓞瓯瓫𤭖瓺𤭯甠甤甪㽗𤰖甽甾畀畈畎畐畒畬畲畱畺畽畾疁𤴔疌㽵疢㽷疰疷疿痀痆痏痓痝痟痠痧痬痮痱痹瘃瘘瘇瘏㾮𤸎瘓瘛1瘜𤸷瘥瘨瘼瘳𤹪㿉癁𤺋癉癕㿗癮皕皜皡皠皧皨皯𥁊盉𥁕盨盬𥄢眗眚眭眵𥆩䀹𥇥𥇍睘睠睪𥈞睲睼睽𥉌䁘瞚瞟瞢瞤瞩矞矟矤矦矪矬䂓矰矴矻𥐮砅砆砉砍砙砡砬硇硤硪𥓙碊碔碤碝碞碟碻磈磌磎磕磠磡磦磹磺磻磾𥖧礐礛礰礥礻祊祘祛䄅祧祲禔禕禖禛禡禩禴离秂秇秌种秖䅈𥞩𥞴䅏稊稑稕稛稞䅣稭67";
			map += "稸穇穌穖穙穜穟穠穧穪穵穸窂窊窐窣窬𥧔䆴窹窼窾䆿竌竑竧竨竴𥫤𥫣笇𥫱笽笧笪笮笯笱䇦䇳筿筁䇮筕筹筤筦筩筳𥮲䈇箐箑箛䈎箯箵箼篅篊𥱋𥱤篔1篖篚篪篰簃簋簎簏簦籅籊籑籗籞籡籩籮籯籰𥸮𥹖𥹥粦𥹢粶粷粿𥻘糄𥻂糈糍𥻨糗𥼣糦糫𥽜糵紃紉䋆紒紞𥿠𥿔紽紾絀絇𦀌𥿻䋖絙絚絪絰䋝絿𦀗綆綈綌綗𦁠綝綧綪綶綷緀緗緙緦緱緹䌂𦃭縉縐縗縝縠縧縬繅繳繵繾纆纇䌫纑纘纚䍃缼缻缾罃罄罏㓁𦉰罒𦊆罡罣罤罭罽罾𦍌羐养𣴎羖羜羭𦐂翃翏翣翥翯67";
			map += "翲耂耊耈耎耑耖耤耬耰聃聦聱聵聻肙肜肤肧肸𦙾胅胕胘胦𦚰脍胵胻䏮脵脖脞䏰脤脧脬𦜝脽䐈腩䐗膁䐜膄膅䐢膘膲臁臃臖臛𦣝臤𦣪臬𦥑臽臿𦥯舄𦧝1舙舡舢𦨞舲舴舼艆艉艅𦩘艋䑶艏䑺艗𦪌艜艣𦪷艹艹艹䒑艽艿芃芊芓芧芨芲芴芺芼苢苨苷茇茈茌荔茛茝茰茼荄荗䒾荿䓔䒳莍莔莕莛莝菉菐菔菝菥菹萏萑萕𦱳萗萹葊葏葑葒葙葚葜𦳝葥葶葸葼蒁䔍蓜蒗蒦蒾䔈蓎蓏蓓𦹥蓧蓪蓯蓰蓱蓺蓽蔌蔛蔤蔥蔫蔴蕏蕯䔥䕃蔾蕑蕓蕞蕡蕢𦾔蕻蕽蕿薁薆薓薝薟𦿸67";
			map += "𦿶𦿷薷薼藇藊藘藙藟藡藦藶蘀蘑蘞蘡蘤蘧𧄍蘹蘼𧄹虀蘒虓虖虯虷虺蚇蚉蚍蚑蚜蚝蚨﨡蚱蚳蛁蛃蛑蛕蛗蛣蛦䖸蜅蜇蜎蜐蜓蜙蜟蜡蜣蜱蜺蜾蝀蝃蝑蝘1蝤蝥蝲蝼𧏛𧏚螧螉螋螓螠𧏾䗥螾𧐐蟁蟎蟵蟟𧑉蟣蟥蟦蟪蟫蟭蠁蠃蠋蠓蠨蠮蠲蠼䘏衊衘衟衤𧘕𧘔衩𧘱衯袠袼袽袾裀裒𧚓裑裓裛裰裱䙁褁𧜎褷𧜣襂襅襉𧝒䙥襢覀覉覐覟覰覷觖觘觫䚡觱觳觽觿䚯訑訔𧦅訡訵訾詅詍詘誮誐誷誾諗諼𧪄謊謅謍謜謟謭譃䜌譑譞譶譿讁讋讔讕讜讞谹𧮳谽𧮾𧯇豅豇豏豔67";
			map += "豗豩豭豳𧲸貓貒貙䝤貛貤賖賕賙𧶠賰賱𧸐贉贎赬趄趕趦𧾷跆跈跙跬踌䟽跽踆𨂊踔踖踡踢踧𨂻䠖踶踹蹋蹔蹢蹬蹭蹯躘躞躮躳躵躶躻𨊂軑軔䡎軹𨋳輀1輈輗輫轀轊轘𨐌辤辴辶辶𨑕迁迆﨤迊迍迓迕迠迱迵迻适逌逷𨕫遃遄遝𨗈𨗉邅邌邐阝邡䢵邰邶郃郈𨛗郜郟𨛺郶郲鄀郫郾郿鄄鄆鄘鄜鄞鄷鄹鄺酆酇酗酙酡酤酴酹醅醎醨醮醳醶釃釄釚𨥉𨥆釬釮鈁鈊鈖鈗𨥫鈳鉂鉇鉊鉎鉑鉖鉙鉠鉡鉥鉧鉨𨦇𨦈鉼鉽鉿銉銍銗銙銟銧銫𨦺𨦻銲銿鋀鋆鋎鋐鋗鋙鋥鋧錑𨨞67";
			map += "𨨩鋷鋹鋻錂錍錕錝錞錧錩𨩱𨩃鍇鍑鍗鍚鍫鍱鍳鎡𨪙𨫍鎈鎋鎏鎞鏵𨫤𨫝鏱鏁鏇鏜鏢鏧鐉鐏鐖鐗鏻鐲鐴鐻鑅𨯁𨯯鑭鑯镸镹閆閌閍𨴐閫閴𨵱闈𨷻𨸟阬阳1阴𨸶阼陁陡𨺉隂𨻫隚𨼲䧧隩隯隳隺隽䧺𨿸雘雚雝䨄霔霣䨩霶靁靇靕靗靛靪𩊠𩊱鞖鞚鞞鞢鞱鞲鞾韌韑韔韘韙韡韱頄頍頎頔頖䪼𩒐頣頲頳頥顇顦颫颭颰𩗏颷颸颻颼颿飂飇飋飠𩙿飡飣飥飪飰飱飳餈䬻𩛰餖餗𩜙餚餛餜𩝐餱餲餳餺餻餼饀饁饆饍饎饜饟饠馣馦馹馽馿駃駉駔駙駞𩣆駰駹駼騊騑騖騚騠67";
			map += "騱騶驄驌驘䯂骯䯊骷䯒骹𩩲髆髐髒髕䯨髜髠髥髩鬃鬌鬐鬒鬖鬜鬫鬳鬽䰠魋魣魥魫魬魳魶魷鮦鮬鮱𩷛𩸽鮲鮸鮾鯇鯳鯘鯝鯧鯪鯫鯯鯮𩸕鯺𩺊鯷𩹉鰖鰘1鰙鰚鰝鰢鰧鰩鰪𩻄鰱鰶鰷鱅鱜𩻩鱉鱊𩻛鱔鱘鱛鱝鱟鱩鱪鱫鱭鱮鱰鱲鱵鱺鳦鳲鴋鴂𩿎鴑鴗鴘𪀯䳄𪀚鴲䳑鵂鵊鵟鵢𪃹鵩鵫𪂂鵳鵶鵷鵾鶄鶍鶙鶡鶿鶵鶹鶽鷃鷇鷉鷖鷚鷟鷠鷣鷴䴇鸊鸂鸍鸙鸜鸝鹻𢈘麀麅麛麨𪎌麽𪐷黟黧黮黿鼂䵷鼃鼗鼙鼯鼷鼺鼽齁齅齆齓齕齘𪗱齝𪘂齩𪘚齭齰齵𪚲";

			/*
			上の変換マップ作成用の文字列は数値が入った変換マップのコードから作成している
			let output = "";
			let nul_count = 0;
			for(i = 0x879f; i <= 0xffff; i++) {
				if(map[i]) {
					if(nul_count !== 0){
						output += nul_count;
						nul_count = 0;
					}
					output += MojiJS.fromCodePoint(map[i]);
				}
				else {
					nul_count++;
				}
			}
			*/

			/**
			 * UTF16へ変換
			 */
			const utf32_array = Unicode.toUTF32Array(map);

			// マップ展開
			let is_num = false;
			let num_array = [];
			let key = 0x879f;
			for(let i = 0; i < utf32_array.length; i++) {
				const x = utf32_array[i];
				if((0x30 <= x) && (x <= 0x39)) {
					if(!is_num) {
						is_num = true;
						num_array = [];
					}
					num_array.push(x);
				}
				else {
					if(is_num) {
						key += parseFloat(Unicode.fromUTF16Array(num_array));
						is_num = false;
					}
					sjis2004_to_unicode_map[key] = x;
					key++;
				}
			}

			return sjis2004_to_unicode_map;
		};

		/**
		 * 変換マップ
		 * - 2文字に変換される場合もあるので注意
		 * 
		 * @returns {Object<number, number|Array<number>>}
		 */
		 const sjis2004_to_unicode_map = getSJIS2004ToUnicodeMap();

		/**
		 * 全角用の文字がある場合は、全角へ変換できるようにする。
		 * 以下のリストは、上記のマッピングデータのUnicodeのコードポイントが0x100未満のデータを抜き出して、
		 * 全角になっていない部分をCP932を参考に直したものです。
		 * 
		 * メモ：今回は使っていませんが、以下の文献も参考になるかもしれません。
		 * ftp://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0208.TXT
		 * @type {Object<number, number>}
		 */
		const sjis2004_to_unicode_map_2 = {
			0x8143: 0xff0c, 0x8144: 0xff0e, 0x8146: 0xff1a, 0x8147: 0xff1b, 0x8148: 0xff1f, 0x8149: 0xff01, 0x814c: 0x00b4, 0x814d: 0xff40, 
			0x814e: 0x00a8, 0x814f: 0xff3e, 0x8151: 0xff3f, 0x815e: 0xff0f, 0x815f: 0xff3c, 0x8162: 0xff5c, 0x8169: 0xff08, 0x816a: 0xff09, 
			0x816d: 0xff3b, 0x816e: 0xff3d, 0x816f: 0xff5b, 0x8170: 0xff5d, 0x817b: 0xff0b, 0x817d: 0x00b1, 0x817e: 0x00d7, 0x8180: 0x00f7, 
			0x8181: 0xff1d, 0x8183: 0xff1c, 0x8184: 0xff1e, 0x818b: 0x00b0, 0x818f: 0xffe5, 0x8190: 0xff04, 0x8191: 0xffe0, 0x8192: 0xffe1, 
			0x8193: 0xff05, 0x8194: 0xff03, 0x8195: 0xff06, 0x8196: 0xff0a, 0x8197: 0xff20, 0x8198: 0x00a7, 0x81ad: 0xff07, 0x81ae: 0xff02, 
			0x81af: 0xff0d, 0x81b0: 0xff5e, 0x81ca: 0xffe2, 0x81f7: 0x00b6, 0x824f: 0xff10, 0x8250: 0xff11, 0x8251: 0xff12, 0x8252: 0xff13, 
			0x8253: 0xff14, 0x8254: 0xff15, 0x8255: 0xff16, 0x8256: 0xff17, 0x8257: 0xff18, 0x8258: 0xff19, 0x8260: 0xff21, 0x8261: 0xff22, 
			0x8262: 0xff23, 0x8263: 0xff24, 0x8264: 0xff25, 0x8265: 0xff26, 0x8266: 0xff27, 0x8267: 0xff28, 0x8268: 0xff29, 0x8269: 0xff2a, 
			0x826a: 0xff2b, 0x826b: 0xff2c, 0x826c: 0xff2d, 0x826d: 0xff2e, 0x826e: 0xff2f, 0x826f: 0xff30, 0x8270: 0xff31, 0x8271: 0xff32, 
			0x8272: 0xff33, 0x8273: 0xff34, 0x8274: 0xff35, 0x8275: 0xff36, 0x8276: 0xff37, 0x8277: 0xff38, 0x8278: 0xff39, 0x8279: 0xff3a, 
			0x8281: 0xff41, 0x8282: 0xff42, 0x8283: 0xff43, 0x8284: 0xff44, 0x8285: 0xff45, 0x8286: 0xff46, 0x8287: 0xff47, 0x8288: 0xff48, 
			0x8289: 0xff49, 0x828a: 0xff4a, 0x828b: 0xff4b, 0x828c: 0xff4c, 0x828d: 0xff4d, 0x828e: 0xff4e, 0x828f: 0xff4f, 0x8290: 0xff50, 
			0x8291: 0xff51, 0x8292: 0xff52, 0x8293: 0xff53, 0x8294: 0xff54, 0x8295: 0xff55, 0x8296: 0xff56, 0x8297: 0xff57, 0x8298: 0xff58, 
			0x8299: 0xff59, 0x829a: 0xff5a
		};

		// 「sjis2004_to_unicode_map_2」の中の特殊な文字について
		// 一部CP932とShift_JIS-2004とでコードが一致していない文字がある
		// 全角,CP932,Shift_JIS-2004,半角Unicode,全角Unicode
		// ＇,0xfa56,0x81ad,0x0027,0xff07 (CP932は、IBM拡張文字での定義)
		// ＂,0xfa57,0x81ae,0x0022,0xff02 (CP932は、IBM拡張文字での定義)
		// －,0x817c,0x81af,0x002d,0xff0d
		// ～,0x8160,0x81b0,0x007e,0xff5e

		// マップデータを上書きする
		for(const key in sjis2004_to_unicode_map_2) {
			sjis2004_to_unicode_map[key] = sjis2004_to_unicode_map_2[key];
		}

		/**
		 * 逆引きマップ作成。重複がある場合は、小さい数値を優先させる。
		 * @type {Object<number, number>}
		 */
		const unicode_to_sjis2004_map = {};
		for(const key in sjis2004_to_unicode_map) {
			const x = sjis2004_to_unicode_map[key];
			const key_num = parseInt(key, 10);
			if(!(x instanceof Array)) {
				if(unicode_to_sjis2004_map[x]) {
					if(x > key_num) {
						unicode_to_sjis2004_map[x] = key_num;
					}
				}
				else {
					unicode_to_sjis2004_map[x] = key_num;
				}
			}
		}

		// 逆引きの注意点についてはCP932のソースコードのコメントに記載
		unicode_to_sjis2004_map[0xa5] = 0x5c;

		SJIS2004MAP.sjis2004_to_unicode_map = sjis2004_to_unicode_map;
		SJIS2004MAP.unicode_to_sjis2004_map = unicode_to_sjis2004_map;
	}
	
	/**
	 * @returns {Object<number, number|Array<number>>}
	 */
	static SJIS2004_TO_UNICODE() {
		SJIS2004MAP.init();
		return SJIS2004MAP.sjis2004_to_unicode_map;
	}
	
	/**
	 * @returns {Object<number, number>}
	 */
	static UNICODE_TO_SJIS2004() {
		SJIS2004MAP.init();
		return SJIS2004MAP.unicode_to_sjis2004_map;
	}
}

/**
 * 変換マップを初期化したかどうか
 * @type {boolean}
 */
SJIS2004MAP.is_initmap = false;

/**
 * 変換用マップ
 * @type {Object<number, number|Array<number>>}
 */
SJIS2004MAP.sjis2004_to_unicode_map = null;

/**
 * 変換用マップ
 * @type {Object<number, number>}
 */
SJIS2004MAP.unicode_to_sjis2004_map = null;

/**
 * Shift_JIS-2004 を扱うクラス
 * @ignore
 */
class SJIS2004 {
	
	/**
	 * Unicode のコードから Shift_JIS-2004 のコードに変換
	 * @param {Number} unicode_codepoint - Unicode のコードポイント
	 * @returns {Number} Shift_JIS-2004 のコードポイント (存在しない場合は undefined)
	 */
	static toSJIS2004FromUnicode(unicode_codepoint) {
		return SJIS2004MAP.UNICODE_TO_SJIS2004()[unicode_codepoint];
	}

	/**
	 * Shift_JIS-2004 のコードから Unicode のコードに変換
	 * @param {Number} sjis2004_codepoint - Shift_JIS-2004 のコードポイント
	 * @returns {number|Array<number>} Unicode のコードポイント (存在しない場合は undefined)
	 */
	static toUnicodeFromSJIS2004(sjis2004_codepoint) {
		return SJIS2004MAP.SJIS2004_TO_UNICODE()[sjis2004_codepoint];
	}
	
	/**
	 * 文字列を Shift_JIS-2004 の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} Shift_JIS-2004 のデータが入った配列
	 */
	static toSJIS2004Array(text) {
		return SJIS.toSJISArray(text, SJIS2004MAP.UNICODE_TO_SJIS2004());
	}

	/**
	 * 文字列を Shift_JIS-2004 のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} Shift_JIS-2004 のデータが入ったバイナリ配列
	 */
	static toSJIS2004Binary(text) {
		return SJIS.toSJISBinary(text, SJIS2004MAP.UNICODE_TO_SJIS2004());
	}

	/**
	 * Shift_JIS-2004 の配列から文字列に変換
	 * @param {Array<number>} sjis2004 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromSJIS2004Array(sjis2004) {
		return SJIS.fromSJISArray(sjis2004, SJIS2004MAP.SJIS2004_TO_UNICODE());
	}

	/**
	 * 指定した文字から Shift_JIS-2004 上の面区点番号に変換
	 * - 2文字以上を指定した場合は、1文字目のみを変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {import("./SJIS.js").MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTen(text) {
		if(text.length === 0) {
			return null;
		}
		const sjis2004_code = SJIS2004.toSJIS2004FromUnicode(Unicode.toUTF32Array(text)[0]);
		return sjis2004_code ? SJIS.toMenKuTenFromSJIS2004Code(sjis2004_code) : null;
	}
	
	/**
	 * Shift_JIS-2004 上の面区点番号から文字列に変換
	 * @param {import("./SJIS.js").MenKuTen|string} menkuten - 面区点番号
	 * @returns {String} 変換後のテキスト
	 */
	static fromMenKuTen(menkuten) {
		const code = SJIS.toUnicodeCodeFromKuTen(menkuten, SJIS2004MAP.SJIS2004_TO_UNICODE());
		return code ? Unicode.fromUTF32Array(code) : "";
	}
	
}

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
	static CP932_TO_EUCJPMS() {
		EUCJPMSMAP.init();
		return EUCJPMSMAP.cp932_to_eucjpms_map;
	}
	
	/**
	 * @returns {Object<number, number>}
	 */
	static EUCJPMS_TO_CP932() {
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
 * @ignore
 */
class EUCJPMS {

	/**
	 * 文字列を eucJP-ms のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} eucJP-ms のデータが入ったバイナリ配列
	 */
	static toEUCJPMSBinary(text) {
		const sjis_array = CP932.toCP932Array(text);
		const bin = [];
		const map = EUCJPMSMAP.CP932_TO_EUCJPMS();
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
		const map = EUCJPMSMAP.EUCJPMS_TO_CP932();
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
			if((0xA1 <= x1) && (x1 <= 0xFE) && (0xA1 <= x2) && (x2 <= 0xFE)) {
				const kuten = {
					ku : x1 - 0xA0,
					ten : x2 - 0xA0
				};
				sjis_array.push(SJIS.toSJISCodeFromKuTen(kuten));
			}
			else {
				sjis_array.push(ng);
			}
		}
		return CP932.fromCP932Array(sjis_array);
	}


}

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
 * EUC-JIS-2004 を扱うクラス
 * @ignore
 */
class EUCJIS2004 {

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
		const ng = "?".charCodeAt(0);
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

			if((0xA1 <= x1) && (x1 <= 0xFE) && (0xA1 <= x2) && (x2 <= 0xFE)) {
				// EUC-JIS-2000 JIS X 0213:2004 の2面に対応
				// 日本語
				const kuten = {
					men : men,
					ku : x1 - 0xA0,
					ten : x2 - 0xA0
				};
				sjis_array.push(SJIS.toSJIS2004CodeFromMenKuTen(kuten));
			}
			else {
				sjis_array.push(ng);
			}
		}
		return SJIS2004.fromSJIS2004Array(sjis_array);
	}

}

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
		let x1, x2;
		let is_with_bom = false;
		// BOM の文字がある場合は BOM 付きとする
		if(/^bom\s+|\s+bom\s+|\s+bom$/i.test(x1)) {
			is_with_bom = true;
			x1 = charset.replace(/^bom\s+|(\s+with)?\s+bom\s+|(\s+with\s*)?\s+bom$/, "");
		}
		else {
			x1 = charset;
		}
		if(/^(unicode-1-1-utf-8|UTF[-_]?8)$/i.test(x1)) {
			x2 = "UTF-8";
		}
		else if(/^(csunicode|iso-10646-ucs-2|ucs-2|Unicode|UnicodeFEFF|UTF[-_]?16([-_]?LE)?)$/i.test(x1)) {
			x2 = "UTF-16LE";
		}
		else if(/^(UnicodeFFFE|UTF[-_]?16[-_]?BE)$/i.test(x1)) {
			x2 = "UTF-16BE";
		}
		else if(/^(utf32_littleendian|UTF[-_]?32([-_]?LE)?)$/i.test(x1)) {
			x2 = "UTF-32LE";
		}
		else if(/^(utf32_bigendian|UTF[-_]?32[-_]?BE)$/i.test(x1)) {
			x2 = "UTF-32BE";
		}
		else if(/^(csshiftjis|ms_kanji|(cp|ms)932|shift[-_]?jis|sjis|Windows[-_]?31J|x-sjis)$/i.test(x1)) {
			x2 = "Shift_JIS";
		}
		else if(/^(sjis[-_]?2004|shift[-_]?jis[-_]?2004)$/i.test(x1)) {
			x2 = "Shift_JIS-2004";
		}
		else if(/^(euc[-_]?JP[-_]?ms)$/i.test(x1)) {
			x2 = "eucJP-ms";
		}
		else if(/^(euc[-_]?jp|cseucpkdfmtjapanese|x-euc-jp)$/i.test(x1)) {
			x2 = "EUC-JP";
		}
		else if(/^(euc[-_]?jis[-_]?200|euc[-_]?jp[-_]?2004)$/i.test(x1)) {
			x2 = "EUC-JIS-2004";
		}
		else {
			x2 = x1;
		}
		if(is_with_bom) {
			x2 += " with BOM";
		}
		return x2;
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
			// 全角英字
			else if(((0xFF21 <= ch) && (ch <= 0xFF3A)) || ((0xFF41 <= ch) && (ch <= 0xFF5A))) {
				type = 5;
			}
			// 全角数値
			else if((0xFF10 <= ch) && (ch <= 0xFF19)) {
				type = 6;
			}
			// 半角カタカナ
			else if((0xFF61 <= ch) && (ch < 0xFFA0)) {
				type = 7;
			}
			// CJK統合漢字拡張A - CJK統合漢字, 追加漢字面
			else if(((0x3400 <= ch) && (ch < 0xA000)) || ((0x20000 <= ch) && (ch < 0x2FA20))) {
				type = 8;
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
class Encode {

	/**
	 * 文字列からバイナリ配列にエンコードする
	 * @param {String} text - 変換したいテキスト
	 * @param {String} charset - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
	 * @param {boolean} [is_with_bom=true] - BOMをつけるかどうか
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
		else if(/^eucJP-ms$/i.test(ncharset)) {
			return EUCJPMS.toEUCJPMSBinary(text);
		}
		else if(/^(EUC-JP|EUC-JIS-2004)$/i.test(ncharset)) {
			return EUCJIS2004.toEUCJIS2004Binary(text);
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
			return CP932.fromCP932Array(binary);
		}
		else if(/^Shift_JIS-2004$/i.test(ncharset)) {
			return SJIS2004.fromSJIS2004Array(binary);
		}
		else if(/^eucJP-ms$/i.test(ncharset)) {
			return EUCJPMS.fromEUCJPMSBinary(binary);
		}
		else if(/^(EUC-JP|EUC-JIS-2004)$/i.test(ncharset)) {
			return EUCJIS2004.fromEUCJIS2004Binary(binary);
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
				const text = CP932.fromCP932Array(binary);
				const count = EncodeTools.countWord(Unicode.toUTF32Array(text));
				if(max_count < count) {
					max_data = text;
					max_count = count;
				}
			}
			// eucJP-ms
			{
				const text = EUCJPMS.fromEUCJPMSBinary(binary);
				const count = EncodeTools.countWord(Unicode.toUTF32Array(text));
				if(max_count < count) {
					max_data = text;
					max_count = count;
				}
			}
			// EUC-JP, EUC-JP-2004
			{
				const text = EUCJIS2004.fromEUCJIS2004Binary(binary);
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
 * 日本語を扱うクラス
 * @ignore
 */
class Japanese {

	/**
	 * カタカナをひらがなに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiragana(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0x0060));
		};
		return (text.replace(/[\u30A1-\u30F6]/g, func));
	}

	/**
	 * ひらがなをカタカナに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakana(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0x0060));
		};
		return (text.replace(/[\u3041-\u3096]/g, func));
	}
	
	/**
	 * スペースを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthSpace(text) {
		return (text.replace(/\u3000/g, String.fromCharCode(0x0020)));
	}
	
	/**
	 * スペースを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthSpace(text) {
		return (text.replace(/\u0020/g, String.fromCharCode(0x3000)));
	}
	
	/**
	 * 英数記号を半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u3000/g, "\u0020");				//全角スペース
		out = out.replace(/[\u2018-\u201B]/g, "\u0027");	//シングルクォーテーション
		out = out.replace(/[\u201C-\u201F]/g, "\u0022");	//ダブルクォーテーション
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			const code = ch.charCodeAt(0);
			return (String.fromCharCode(code - 0xFEE0));
		};
		return (out.replace(/[\uFF01-\uFF5E]/g, func));
	}
	
	/**
	 * 英数記号を全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u0020/g, "\u3000");	//全角スペース
		out = out.replace(/\u0022/g, "\u201D");	//ダブルクォーテーション
		out = out.replace(/\u0027/g, "\u2019");	//アポストロフィー
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			const code = ch.charCodeAt(0);
			return (String.fromCharCode(code + 0xFEE0));
		};
		return (out.replace(/[\u0020-\u007E]/g, func));
	}
	
	/**
	 * アルファベットを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAlphabet(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, func));
	}
	
	/**
	 * アルファベットを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAlphabet(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[A-Za-z]/g, func));
	}
	
	/**
	 * 数値を半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthNumber(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF10-\uFF19]/g, func));
	}
	
	/**
	 * 数値を全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthNumber(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[0-9]/g, func));
	}
	
	/**
	 * カタカナを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthKana(text) {
		/**
		 * @type {Object<number, string>}
		 */
		const map = {
			0x3001	:	"\uFF64"	,	//	､
			0x3002	:	"\uFF61"	,	//	。	｡
			0x300C	:	"\uFF62"	,	//	「	｢
			0x300D	:	"\uFF63"	,	//	」	｣
			0x309B	:	"\uFF9E"	,	//	゛	ﾞ
			0x309C	:	"\uFF9F"	,	//	゜	ﾟ
			0x30A1	:	"\uFF67"	,	//	ァ	ｧ
			0x30A2	:	"\uFF71"	,	//	ア	ｱ
			0x30A3	:	"\uFF68"	,	//	ィ	ｨ
			0x30A4	:	"\uFF72"	,	//	イ	ｲ
			0x30A5	:	"\uFF69"	,	//	ゥ	ｩ
			0x30A6	:	"\uFF73"	,	//	ウ	ｳ
			0x30A7	:	"\uFF6A"	,	//	ェ	ｪ
			0x30A8	:	"\uFF74"	,	//	エ	ｴ
			0x30A9	:	"\uFF6B"	,	//	ォ	ｫ
			0x30AA	:	"\uFF75"	,	//	オ	ｵ
			0x30AB	:	"\uFF76"	,	//	カ	ｶ
			0x30AC	:	"\uFF76\uFF9E"	,	//	ガ	ｶﾞ
			0x30AD	:	"\uFF77"	,	//	キ	ｷ
			0x30AE	:	"\uFF77\uFF9E"	,	//	ギ	ｷﾞ
			0x30AF	:	"\uFF78"	,	//	ク	ｸ
			0x30B0	:	"\uFF78\uFF9E"	,	//	グ	ｸﾞ
			0x30B1	:	"\uFF79"	,	//	ケ	ｹ
			0x30B2	:	"\uFF79\uFF9E"	,	//	ゲ	ｹﾞ
			0x30B3	:	"\uFF7A"	,	//	コ	ｺ
			0x30B4	:	"\uFF7A\uFF9E"	,	//	ゴ	ｺﾞ
			0x30B5	:	"\uFF7B"	,	//	サ	ｻ
			0x30B6	:	"\uFF7B\uFF9E"	,	//	ザ	ｻﾞ
			0x30B7	:	"\uFF7C"	,	//	シ	ｼ
			0x30B8	:	"\uFF7C\uFF9E"	,	//	ジ	ｼﾞ
			0x30B9	:	"\uFF7D"	,	//	ス	ｽ
			0x30BA	:	"\uFF7D\uFF9E"	,	//	ズ	ｽﾞ
			0x30BB	:	"\uFF7E"	,	//	セ	ｾ
			0x30BC	:	"\uFF7E\uFF9E"	,	//	ゼ	ｾﾞ
			0x30BD	:	"\uFF7F"	,	//	ソ	ｿ
			0x30BE	:	"\uFF7F\uFF9E"	,	//	ゾ	ｿﾞ
			0x30BF	:	"\uFF80"	,	//	タ	ﾀ
			0x30C0	:	"\uFF80\uFF9E"	,	//	ダ	ﾀﾞ
			0x30C1	:	"\uFF81"	,	//	チ	ﾁ
			0x30C2	:	"\uFF81\uFF9E"	,	//	ヂ	ﾁﾞ
			0x30C3	:	"\uFF6F"	,	//	ッ	ｯ
			0x30C4	:	"\uFF82"	,	//	ツ	ﾂ
			0x30C5	:	"\uFF82\uFF9E"	,	//	ヅ	ﾂﾞ
			0x30C6	:	"\uFF83"	,	//	テ	ﾃ
			0x30C7	:	"\uFF83\uFF9E"	,	//	デ	ﾃﾞ
			0x30C8	:	"\uFF84"	,	//	ト	ﾄ
			0x30C9	:	"\uFF84\uFF9E"	,	//	ド	ﾄﾞ
			0x30CA	:	"\uFF85"	,	//	ナ	ﾅ
			0x30CB	:	"\uFF86"	,	//	ニ	ﾆ
			0x30CC	:	"\uFF87"	,	//	ヌ	ﾇ
			0x30CD	:	"\uFF88"	,	//	ネ	ﾈ
			0x30CE	:	"\uFF89"	,	//	ノ	ﾉ
			0x30CF	:	"\uFF8A"	,	//	ハ	ﾊ
			0x30D0	:	"\uFF8A\uFF9E"	,	//	バ	ﾊﾞ
			0x30D1	:	"\uFF8A\uFF9F"	,	//	パ	ﾊﾟ
			0x30D2	:	"\uFF8B"	,	//	ヒ	ﾋ
			0x30D3	:	"\uFF8B\uFF9E"	,	//	ビ	ﾋﾞ
			0x30D4	:	"\uFF8B\uFF9F"	,	//	ピ	ﾋﾟ
			0x30D5	:	"\uFF8C"	,	//	フ	ﾌ
			0x30D6	:	"\uFF8C\uFF9E"	,	//	ブ	ﾌﾞ
			0x30D7	:	"\uFF8C\uFF9F"	,	//	プ	ﾌﾟ
			0x30D8	:	"\uFF8D"	,	//	ヘ	ﾍ
			0x30D9	:	"\uFF8D\uFF9E"	,	//	ベ	ﾍﾞ
			0x30DA	:	"\uFF8D\uFF9F"	,	//	ペ	ﾍﾟ
			0x30DB	:	"\uFF8E"	,	//	ホ	ﾎ
			0x30DC	:	"\uFF8E\uFF9E"	,	//	ボ	ﾎﾞ
			0x30DD	:	"\uFF8E\uFF9F"	,	//	ポ	ﾎﾟ
			0x30DE	:	"\uFF8F"	,	//	マ	ﾏ
			0x30DF	:	"\uFF90"	,	//	ミ	ﾐ
			0x30E0	:	"\uFF91"	,	//	ム	ﾑ
			0x30E1	:	"\uFF92"	,	//	メ	ﾒ
			0x30E2	:	"\uFF93"	,	//	モ	ﾓ
			0x30E3	:	"\uFF6C"	,	//	ャ	ｬ
			0x30E4	:	"\uFF94"	,	//	ヤ	ﾔ
			0x30E5	:	"\uFF6D"	,	//	ュ	ｭ
			0x30E6	:	"\uFF95"	,	//	ユ	ﾕ
			0x30E7	:	"\uFF6E"	,	//	ョ	ｮ
			0x30E8	:	"\uFF96"	,	//	ヨ	ﾖ
			0x30E9	:	"\uFF97"	,	//	ラ	ﾗ
			0x30EA	:	"\uFF98"	,	//	リ	ﾘ
			0x30EB	:	"\uFF99"	,	//	ル	ﾙ
			0x30EC	:	"\uFF9A"	,	//	レ	ﾚ
			0x30ED	:	"\uFF9B"	,	//	ロ	ﾛ
			0x30EE	:	"\uFF9C"	,	//	ヮ	ﾜ
			0x30EF	:	"\uFF9C"	,	//	ワ	ﾜ
			0x30F0	:	"\uFF72"	,	//	ヰ	ｲ
			0x30F1	:	"\uFF74"	,	//	ヱ	ｴ
			0x30F2	:	"\uFF66"	,	//	ヲ	ｦ
			0x30F3	:	"\uFF9D"	,	//	ン	ﾝ
			0x30F4	:	"\uFF73\uFF9E"	,	//	ヴ	ｳﾞ
			0x30F5	:	"\uFF76"	,	//	ヵ	ｶ
			0x30F6	:	"\uFF79"	,	//	ヶ	ｹ
			0x30F7	:	"\uFF9C\uFF9E"	,	//	ヷ	ﾜﾞ
			0x30F8	:	"\uFF72\uFF9E"	,	//	ヸ	ｲﾞ
			0x30F9	:	"\uFF74\uFF9E"	,	//	ヹ	ｴﾞ
			0x30FA	:	"\uFF66\uFF9E"	,	//	ヺ	ｦﾞ
			0x30FB	:	"\uFF65"	,	//	・	･
			0x30FC	:	"\uFF70"		//	ー	ｰ
		};
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			if(ch.length === 1) {
				return(map[ch.charCodeAt(0)]);
			}
			else {
				return(map[ch.charCodeAt(0)] + map[ch.charCodeAt(1)]);
			}
		};
		return (text.replace(/[\u3001\u3002\u300C\u300D\u309B\u309C\u30A1-\u30FC][\u309B\u309C]?/g, func));
	}

	/**
	 * カタカナを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthKana(text) {
		/**
		 * @type {Object<number, number>}
		 */
		const map = {
			0xFF61	:	0x3002	,	//	。	｡
			0xFF62	:	0x300C	,	//	「	｢
			0xFF63	:	0x300D	,	//	」	｣
			0xFF64	:	0x3001	,	//	､
			0xFF65	:	0x30FB	,	//	・	･
			0xFF66	:	0x30F2	,	//	ヲ	ｦ
			0xFF67	:	0x30A1	,	//	ァ	ｧ
			0xFF68	:	0x30A3	,	//	ィ	ｨ
			0xFF69	:	0x30A5	,	//	ゥ	ｩ
			0xFF6A	:	0x30A7	,	//	ェ	ｪ
			0xFF6B	:	0x30A9	,	//	ォ	ｫ
			0xFF6C	:	0x30E3	,	//	ャ	ｬ
			0xFF6D	:	0x30E5	,	//	ュ	ｭ
			0xFF6E	:	0x30E7	,	//	ョ	ｮ
			0xFF6F	:	0x30C3	,	//	ッ	ｯ
			0xFF70	:	0x30FC	,	//	ー	ｰ
			0xFF71	:	0x30A2	,	//	ア	ｱ
			0xFF72	:	0x30A4	,	//	イ	ｲ
			0xFF73	:	0x30A6	,	//	ウ	ｳ
			0xFF74	:	0x30A8	,	//	エ	ｴ
			0xFF75	:	0x30AA	,	//	オ	ｵ
			0xFF76	:	0x30AB	,	//	カ	ｶ
			0xFF77	:	0x30AD	,	//	キ	ｷ
			0xFF78	:	0x30AF	,	//	ク	ｸ
			0xFF79	:	0x30B1	,	//	ケ	ｹ
			0xFF7A	:	0x30B3	,	//	コ	ｺ
			0xFF7B	:	0x30B5	,	//	サ	ｻ
			0xFF7C	:	0x30B7	,	//	シ	ｼ
			0xFF7D	:	0x30B9	,	//	ス	ｽ
			0xFF7E	:	0x30BB	,	//	セ	ｾ
			0xFF7F	:	0x30BD	,	//	ソ	ｿ
			0xFF80	:	0x30BF	,	//	タ	ﾀ
			0xFF81	:	0x30C1	,	//	チ	ﾁ
			0xFF82	:	0x30C4	,	//	ツ	ﾂ
			0xFF83	:	0x30C6	,	//	テ	ﾃ
			0xFF84	:	0x30C8	,	//	ト	ﾄ
			0xFF85	:	0x30CA	,	//	ナ	ﾅ
			0xFF86	:	0x30CB	,	//	ニ	ﾆ
			0xFF87	:	0x30CC	,	//	ヌ	ﾇ
			0xFF88	:	0x30CD	,	//	ネ	ﾈ
			0xFF89	:	0x30CE	,	//	ノ	ﾉ
			0xFF8A	:	0x30CF	,	//	ハ	ﾊ
			0xFF8B	:	0x30D2	,	//	ヒ	ﾋ
			0xFF8C	:	0x30D5	,	//	フ	ﾌ
			0xFF8D	:	0x30D8	,	//	ヘ	ﾍ
			0xFF8E	:	0x30DB	,	//	ホ	ﾎ
			0xFF8F	:	0x30DE	,	//	マ	ﾏ
			0xFF90	:	0x30DF	,	//	ミ	ﾐ
			0xFF91	:	0x30E0	,	//	ム	ﾑ
			0xFF92	:	0x30E1	,	//	メ	ﾒ
			0xFF93	:	0x30E2	,	//	モ	ﾓ
			0xFF94	:	0x30E4	,	//	ヤ	ﾔ
			0xFF95	:	0x30E6	,	//	ユ	ﾕ
			0xFF96	:	0x30E8	,	//	ヨ	ﾖ
			0xFF97	:	0x30E9	,	//	ラ	ﾗ
			0xFF98	:	0x30EA	,	//	リ	ﾘ
			0xFF99	:	0x30EB	,	//	ル	ﾙ
			0xFF9A	:	0x30EC	,	//	レ	ﾚ
			0xFF9B	:	0x30ED	,	//	ロ	ﾛ
			0xFF9C	:	0x30EF	,	//	ワ	ﾜ
			0xFF9D	:	0x30F3	,	//	ン	ﾝ
			0xFF9E	:	0x309B	,	//	゛	ﾞ
			0xFF9F	:	0x309C		//	゜	ﾟ
		};
		/**
		 * @param {string} str 
		 */
		const func = function(str) {
			if(str.length === 1) {
				return (String.fromCharCode(map[str.charCodeAt(0)]));
			}
			else {
				const next = str.charCodeAt(1);
				const ch   = str.charCodeAt(0);
				if(next === 0xFF9E) {
					// Shift-JISにない濁点（ヷ、ヸ、ヹ、ヺ）は意図的に無視
					// ヴ
					if (ch === 0xFF73) {
						return (String.fromCharCode(0x3094));
					}
					// ガ-ド、バ-ボ
					else if(
						((0xFF76 <= ch) && (ch <= 0xFF84)) ||
						((0xFF8A <= ch) && (ch <= 0xFF8E))	) {
						return (String.fromCharCode(map[ch] + 1));
					}
				}
				// 半濁点
				else if(next === 0xFF9F) {
					// パ-ポ
					if((0xFF8A <= ch) && (ch <= 0xFF8E)) {
						return (String.fromCharCode(map[ch] + 2));
					}
				}
				return (String.fromCharCode(map[ch]) + String.fromCharCode(map[next]));
			}
		};
		return (text.replace(/[\uFF61-\uFF9F][\uFF9E\uFF9F]?/g, func));
	}
	
	/**
	 * 半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidth(text) {
		return Japanese.toHalfWidthKana(Japanese.toHalfWidthAsciiCode(text));
	}
	
	/**
	 * 全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidth(text) {
		return Japanese.toFullWidthKana(Japanese.toFullWidthAsciiCode(text));
	}

	/**
	 * ローマ字からひらがなに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiraganaFromRomaji(text) {
		/**
		 * ローマ字から変換マップ
		 * .y[aiuoe] は除いている
		 * @type {Object<string, string>}
		 */
		const map = {
			"a" : "あ" ,
			"i" : "い" ,
			"u" : "う" ,
			"e" : "え" ,
			"o" : "お" ,
			"ka" : "か" ,
			"ki" : "き" ,
			"ku" : "く" ,
			"ke" : "け" ,
			"ko" : "こ" ,
			"ga" : "が" ,
			"gi" : "ぎ" ,
			"gu" : "ぐ" ,
			"ge" : "げ" ,
			"go" : "ご" ,
			"sa" : "さ" ,
			"si" : "し" ,
			"su" : "す" ,
			"se" : "せ" ,
			"so" : "そ" ,
			"za" : "ざ" ,
			"zi" : "じ" ,
			"zu" : "ず" ,
			"ze" : "ぜ" ,
			"zo" : "ぞ" ,
			"ta" : "た" ,
			"ti" : "ち" ,
			"tu" : "つ" ,
			"te" : "て" ,
			"to" : "と" ,
			"da" : "だ" ,
			"di" : "ぢ" ,
			"du" : "づ" ,
			"de" : "で" ,
			"do" : "ど" ,
			"na" : "な" ,
			"ni" : "に" ,
			"nu" : "ぬ" ,
			"ne" : "ね" ,
			"no" : "の" ,
			"ha" : "は" ,
			"hi" : "ひ" ,
			"hu" : "ふ" ,
			"he" : "へ" ,
			"ho" : "ほ" ,
			"ba" : "ば" ,
			"bi" : "び" ,
			"bu" : "ぶ" ,
			"be" : "べ" ,
			"bo" : "ぼ" ,
			"pa" : "ぱ" ,
			"pi" : "ぴ" ,
			"pu" : "ぷ" ,
			"pe" : "ぺ" ,
			"po" : "ぽ" ,
			"ma" : "ま" ,
			"mi" : "み" ,
			"mu" : "む" ,
			"me" : "め" ,
			"mo" : "も" ,
			"ya" : "や" ,
			"yi" : "い" ,
			"yu" : "ゆ" ,
			"ye" : "いぇ" ,
			"yo" : "よ" ,
			"ra" : "ら" ,
			"ri" : "り" ,
			"ru" : "る" ,
			"re" : "れ" ,
			"ro" : "ろ" ,
			"wa" : "わ" ,
			"wi" : "うぃ" ,
			"wu" : "う" ,
			"we" : "うぇ" ,
			"wo" : "を" ,
			"la" : "ぁ" ,
			"li" : "ぃ" ,
			"lu" : "ぅ" ,
			"le" : "ぇ" ,
			"lo" : "ぉ" ,
			"lya" : "ゃ" ,
			"lyi" : "ぃ" ,
			"lyu" : "ゅ" ,
			"lye" : "ぇ" ,
			"lyo" : "ょ" ,
			"ltu" : "っ" ,
			"ltsu" : "っ" ,
			"xa" : "ぁ" ,
			"xi" : "ぃ" ,
			"xu" : "ぅ" ,
			"xe" : "ぇ" ,
			"xo" : "ぉ" ,
			"xya" : "ゃ" ,
			"xyi" : "ぃ" ,
			"xyu" : "ゅ" ,
			"xye" : "ぇ" ,
			"xyo" : "ょ" ,
			"xtu" : "っ" ,
			"xtsu" : "っ" ,
			// 環境依存をなくすために、SJISにあるカタカナにしています。
			"va" : "ヴぁ" ,
			"vi" : "ヴぃ" ,
			"vu" : "ヴ" ,
			"ve" : "ヴぇ" ,
			"vo" : "ヴぉ" ,
			"qa" : "くぁ" ,
			"qi" : "くぃ" ,
			"qu" : "く" ,
			"qe" : "くぇ" ,
			"qo" : "くぉ" ,
			"qwa" : "くぁ" ,
			"qwi" : "くぃ" ,
			"qwu" : "くぅ" ,
			"qwe" : "くぇ" ,
			"qwo" : "くぉ" ,
			"gwa" : "ぐぁ" ,
			"gwi" : "ぐぃ" ,
			"gwu" : "ぐぅ" ,
			"gwe" : "ぐぇ" ,
			"gwo" : "ぐぉ" ,
			"sha" : "しゃ" ,
			"shi" : "し" ,
			"shu" : "しゅ" ,
			"she" : "しぇ" ,
			"sho" : "しょ" ,
			"swa" : "すぁ" ,
			"swi" : "すぃ" ,
			"swu" : "すぅ" ,
			"swe" : "すぇ" ,
			"swo" : "すぉ" ,
			"cha" : "ちゃ" ,
			"chi" : "ち" ,
			"chu" : "ちゅ" ,
			"che" : "ちぇ" ,
			"cho" : "ちょ" ,
			"tha" : "ちゃ" ,
			"thi" : "ち" ,
			"thu" : "てゅ" ,
			"the" : "てぇ" ,
			"tho" : "てょ" ,
			"tsa" : "つぁ" ,
			"tsi" : "つぃ" ,
			"tsu" : "つ" ,
			"tse" : "つぇ" ,
			"tso" : "つぉ" ,
			"twa" : "とぁ" ,
			"twi" : "とぃ" ,
			"twu" : "とぅ" ,
			"twe" : "とぇ" ,
			"two" : "とぉ" ,
			"fa" : "ふぁ" ,
			"fi" : "ふぃ" ,
			"fu" : "ふ" ,
			"fe" : "ふぇ" ,
			"fo" : "ふぉ" ,
			"fwa" : "ふぁ" ,
			"fwi" : "ふぃ" ,
			"fwu" : "ふぅ" ,
			"fwe" : "ふぇ" ,
			"fwo" : "ふぉ" ,
			"ja" : "じゃ" ,
			"ji" : "じ" ,
			"ju" : "じゅ" ,
			"je" : "じぇ" ,
			"jo" : "じょ" ,
			"n" : "ん" ,
			"nn" : "ん" ,
			"-" : "ー" ,
			"?" : "？" ,
			"!" : "！",
			"," : "、",
			"." : "。" 
		};
		/**
		 * ya, yi, yu, ye, yo
		 * @type {Object<string, string>}
		 */
		const y_komoji_map = {
			"a" : "ゃ",
			"i" : "ぃ",
			"u" : "ゅ",
			"e" : "ぇ",
			"o" : "ょ"
		};
		/**
		 * @param {string} str 
		 */
		const func = function(str) {
			const output = [];
			let y_komoji = null;
			let romaji = str.toLowerCase();
			if(romaji.length > 2) {
				// 同じ文字の繰り返しなら「っ」に変更
				if(romaji.charCodeAt(0) === romaji.charCodeAt(1)) {
					// ただし繰り返し文字がnの場合は「ん」として扱う
					if(romaji.substring(0, 1) === "n") {
						output.push("ん");
						romaji = romaji.substring(2);
					}
					else {
						output.push("っ");
						romaji = romaji.substring(1);
					}
				}
			}
			if(romaji.length === 3) {
				const char_1 = romaji.substring(0, 1);
				const char_2 = romaji.substring(1, 2);
				// 2文字目がyで始まる場合（ただし、lya, xya などを除く）は
				// 小文字リストから選んで、最後に小文字をつける
				// sya -> si につけかえて辞書から探す
				if((char_2 === "y") && (char_1 !== "l") && (char_1 !== "x")) {
					y_komoji = y_komoji_map[romaji.substring(2)];
					romaji = romaji.substring(0, 1) + "i";
				}
			}
			const data = map[romaji];
			if(!data) {
				return str;
			}
			output.push(data);
			if(y_komoji) {
				output.push(y_komoji);
			}
			return output.join("");
		};
		// 上から下への優先度で変換する。
		// ([xl]?[kgsztdnhbpmyrwlxvqfj])(\1)?y?[aiuoe] ... yが入り込む可能性がある文字。前の文字を繰り返して「tta -> った」にも対応。
		// [xl]?(gw|ch|cch|sh|ssh|ts|tts|th|tth)?[aiuoe] ... yを使用しない文字
		// nn? ... ん
		// [?!-] ... 記号
		return (text.replace(/([xl]?[kgsztdnhbpmyrwlxvqfj])(\1)?y?[aiuoe]|[xl]?([gqstf]w|ch|cch|sh|ssh|ts|tts|th|tth)?[aiuoe]|nn?|[?!-.,]/gi, func));
	}

	/**
	 * ローマ字からカタカナに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakanaFromRomaji(text) {
		return Japanese.toKatakana(Japanese.toHiraganaFromRomaji(text));
	}

	/**
	 * ひらがなからローマ字に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toRomajiFromHiragana(text) {
		/**
		 * ひらがなからローマ字への変換マップ
		 * @type {Object<string, string>}
		 */
		const map = {
			"あ" : "a" ,
			"い" : "i" ,
			"う" : "u" ,
			"え" : "e" ,
			"お" : "o" ,
			"か" : "ka" ,
			"き" : "ki" ,
			"く" : "ku" ,
			"け" : "ke" ,
			"こ" : "ko" ,
			"が" : "ga" ,
			"ぎ" : "gi" ,
			"ぐ" : "gu" ,
			"げ" : "ge" ,
			"ご" : "go" ,
			"さ" : "sa" ,
			"し" : "shi" ,
			"す" : "su" ,
			"せ" : "se" ,
			"そ" : "so" ,
			"ざ" : "za" ,
			"じ" : "ji" ,
			"ず" : "zu" ,
			"ぜ" : "ze" ,
			"ぞ" : "zo" ,
			"た" : "ta" ,
			"ち" : "chi" ,
			"つ" : "tsu" ,
			"て" : "te" ,
			"と" : "to" ,
			"だ" : "da" ,
			"ぢ" : "di" ,
			"づ" : "du" ,
			"で" : "de" ,
			"ど" : "do" ,
			"な" : "na" ,
			"に" : "ni" ,
			"ぬ" : "nu" ,
			"ね" : "ne" ,
			"の" : "no" ,
			"は" : "ha" ,
			"ひ" : "hi" ,
			"ふ" : "fu" ,
			"へ" : "he" ,
			"ほ" : "ho" ,
			"ば" : "ba" ,
			"び" : "bi" ,
			"ぶ" : "bu" ,
			"べ" : "be" ,
			"ぼ" : "bo" ,
			"ぱ" : "pa" ,
			"ぴ" : "pi" ,
			"ぷ" : "pu" ,
			"ぺ" : "pe" ,
			"ぽ" : "po" ,
			"ま" : "ma" ,
			"み" : "mi" ,
			"む" : "mu" ,
			"め" : "me" ,
			"も" : "mo" ,
			"や" : "ya" ,
			"ゆ" : "yu" ,
			"いぇ" : "ye" ,
			"よ" : "yo" ,
			"ら" : "ra" ,
			"り" : "ri" ,
			"る" : "ru" ,
			"れ" : "re" ,
			"ろ" : "ro" ,
			"わ" : "wa" ,
			"うぃ" : "wi" ,
			"うぇ" : "we" ,
			"うぉ" : "wo" ,
			"を" : "wo" ,
			"ゐ" : "wi" ,
			"ゑ" : "we" ,
			"ん" : "n" ,
			"ぁ" : "lya" ,
			"ぃ" : "lyi" ,
			"ぅ" : "lyu" ,
			"ぇ" : "lye" ,
			"ぉ" : "lyo" ,
			"ゃ" : "lya" ,
			"ゅ" : "lyu" ,
			"ょ" : "lyo" ,
			// 環境依存をなくすために、SJISにあるカタカナにしています。
			"ヴぁ" : "va" ,
			"ヴぃ" : "vi" ,
			"ヴ" : "vu" ,
			"ヴぇ" : "ve" ,
			"ヴぉ" : "vo" ,
			"ゔぁ" : "va" ,
			"ゔぃ" : "vi" ,
			"ゔ" : "vu" ,
			"ゔぇ" : "ve" ,
			"ゔぉ" : "vo" ,
			"きゃ" : "kya" ,
			"きぃ" : "kyi" ,
			"きゅ" : "kyu" ,
			"きぇ" : "kye" ,
			"きょ" : "kyo" ,
			"ぎゃ" : "gya" ,
			"ぎぃ" : "gyi" ,
			"ぎゅ" : "gyu" ,
			"ぎぇ" : "gye" ,
			"ぎょ" : "gyo" ,
			"くぁ" : "qa" ,
			"くぃ" : "qi" ,
			"くぅ" : "qu" ,
			"くぇ" : "qe" ,
			"くぉ" : "qo" ,
			"ぐぁ" : "gwa" ,
			"ぐぃ" : "gwi" ,
			"ぐぅ" : "gwu" ,
			"ぐぇ" : "gwe" ,
			"ぐぉ" : "gwo" ,
			"しゃ" : "sha" ,
			// "しぃ" : "shii" ,
			"しゅ" : "shu" ,
			"しぇ" : "she" ,
			"しょ" : "sho" ,
			"じゃ" : "ja" ,
			// "じぃ" : "jii" ,
			"じゅ" : "ju" ,
			"じぇ" : "je" ,
			"じょ" : "jo" ,
			"ちゃ" : "cha" ,
			// "ちぃ" : "chii"
			"ちゅ" : "chu" ,
			"ちぇ" : "che" ,
			"ちょ" : "cho" ,
			"つぁ" : "tsa" ,
			"つぃ" : "tsi" ,
			"つぇ" : "tse" ,
			"つぉ" : "tso" ,
			"てぁ" : "tha" ,
			"てぃ" : "thi" ,
			"てゅ" : "thu" ,
			"てぇ" : "the" ,
			"てょ" : "tho" ,
			"にゃ" : "nya" ,
			"にぃ" : "nyi" ,
			"にゅ" : "nyu" ,
			"にぇ" : "nye" ,
			"にょ" : "nyo" ,
			"ひゃ" : "hya" ,
			"ひぃ" : "hyi" ,
			"ひゅ" : "hyu" ,
			"ひぇ" : "hye" ,
			"ひょ" : "hyo" ,
			"びゃ" : "bya" ,
			"びぃ" : "byi" ,
			"びゅ" : "byu" ,
			"びぇ" : "bye" ,
			"びょ" : "byo" ,
			"ぴゃ" : "pya" ,
			"ぴぃ" : "pyi" ,
			"ぴゅ" : "pyu" ,
			"ぴぇ" : "pye" ,
			"ぴょ" : "pyo" ,
			"ふぁ" : "fa" ,
			"ふぃ" : "fi" ,
			"ふぇ" : "fe" ,
			"ふぉ" : "fo" ,
			"みゃ" : "mya" ,
			"みぃ" : "myi" ,
			"みゅ" : "myu" ,
			"みぇ" : "mye" ,
			"みょ" : "myo" ,
			"りゃ" : "rya" ,
			"りぃ" : "ryi" ,
			"りゅ" : "ryu" ,
			"りぇ" : "rye" ,
			"りょ" : "ryo" ,
			"ー" : "-" ,
			"？" : "?" ,
			"！" : "!" ,
			"、" : "," ,
			"。" : "." 
		};

		/**
		 * @type {Object<string, string>}
		 */
		const komoji_map = {
			"ぁ" : "la",
			"ぃ" : "li",
			"ぅ" : "lu",
			"ぇ" : "le",
			"ぉ" : "lo",
			"ゃ" : "lya",
			"ゅ" : "lyu",
			"ょ" : "lyo"
		};

		/**
		 * @param {string} str 
		 */
		const func = function(str) {
			let tgt = str;
			let is_xtu = false; 
			// 1文字目に「っ」があるか
			if(/^っ/.test(tgt)) {
				is_xtu = true;
				tgt = tgt.replace(/^っ*/, "");
			}
			// 変換
			let trans = map[tgt];
			// 変換に失敗した場合は
			if(!trans) {
				if(trans.length === 1) {
					// 1文字なのでこれ以上変換不能
					return str;
				}
				const char_1 = trans.substring(0, 1);
				const char_2 = trans.substring(1, 2);
				// 最後の文字が小文字である
				if(!komoji_map[char_2]) {
					// これ以上変換不能
					return str;
				}
				tgt = char_1;
				const last_text = komoji_map[char_2];
				// 再度変換テスト
				trans = map[tgt];
				if(!trans) {
					// これ以上変換不能
					return str;
				}
				trans += last_text;
			}
			if(is_xtu) {
				trans = trans.substring(0, 1) + trans;
			}
			return trans;
		};
		// [っ]*[あいうえおか-ぢつ-もやゆよら-ろわゐゑをんヴ][ぁぃぅぇぉゃゅょ]? ... 促音＋子音母音
		// [ぁぃぅぇぉゃゅょゎっ] ... 小文字のみ
		// [？！－。、] ... 記号
		return (text.replace(/[っ]*[あいうえおか-ぢつ-もやゆよら-ろわゐゑをんヴゔ][ぁぃぅぇぉゃゅょ]?|[ぁぃぅぇぉゃゅょゎっ]|[？！－。、]/g, func));
	}

	/**
	 * カタカナからローマ字に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toRomajiFromKatakana(text) {
		return Japanese.toRomajiFromHiragana(Japanese.toHiragana(text));
	}

	/**
	 * 指定したコードポイントの横幅を取得します
	 * - 結合文字と異体字セレクタは、0としてカウントします。
	 * - 半角は1としてカウントします。これらは、ASCII文字、半角カタカナとします。
	 * - 全角は2としてカウントします。上記以外を全角として処理します。
	 * @param {Number} cp 調査するコードポイント
	 * @returns {Number} 文字の横幅
	 */
	static getWidthFromCodePoint(cp) {
		if(Unicode.isCombiningMarkFromCodePoint(cp) || Unicode.isVariationSelectorFromCodePoint(cp)) {
			return 0;
		}
		else if((cp < 0x80) || ((0xFF61 <= cp) && (cp < 0xFFA0))) {
			return 1;
		}
		else {
			return 2;
		}
	}

	/**
	 * 指定したテキストの横幅を半角／全角でカウント
	 * - 結合文字と異体字セレクタは、0としてカウントします。
	 * - 半角は1としてカウントします。これらは、ASCII文字、半角カタカナとします。
	 * - 全角は2としてカウントします。上記以外を全角として処理します。
	 * @param {String} text - カウントしたいテキスト
	 * @returns {Number} 文字の横幅
	 */
	static getWidth(text) {
		const utf32_array = Unicode.toUTF32Array(text);
		let count = 0;
		for(let i = 0; i < utf32_array.length; i++) {
			count += Japanese.getWidthFromCodePoint(utf32_array[i]);
		}
		return count;
	}

	/**
	 * 異体字セレクタと結合文字を考慮して文字列を文字の配列に変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<Array<number>>} UTF32(コードポイント)の配列が入った配列
	 */
	static toMojiArrayFromString(text) {
		const utf32 = Unicode.toUTF32Array(text);
		/**
		 * @type {Array<Array<number>>}
		 */
		const mojiarray = [];
		let moji = [];
		for(let i = 0; i < utf32.length; i++) {
			const cp = utf32[i];
			if((i > 0) && !Unicode.isVariationSelectorFromCodePoint(cp) && !Unicode.isCombiningMarkFromCodePoint(cp)) {
				mojiarray.push(moji);
				moji = [];
			}
			moji.push(cp);
		}
		mojiarray.push(moji);
		return mojiarray;
	}

	/**
	 * 異体字セレクタと結合文字を考慮して文字列を文字の配列に変換する
	 * @param {Array<Array<number>>} mojiarray - UTF32(コードポイント)の配列が入った配列
	 * @returns {string} UTF32(コードポイント)の配列が入った配列
	 */
	static toStringFromMojiArray(mojiarray) {
		/**
		 * @type {Array<number>}
		 */
		const utf32 = [];
		for(let i = 0; i < mojiarray.length; i++) {
			for(let j = 0; j < mojiarray[i].length; j++) {
				utf32.push(mojiarray[i][j]);
			}
		}
		return Unicode.fromUTF32Array(utf32);
	}

	/**
	 * 指定したテキストの横幅を半角／全角で換算した場合の切り出し
	 * - 結合文字と異体字セレクタは、0としてカウントします。
	 * - 半角は1としてカウントします。これらは、ASCII文字、半角カタカナとします。
	 * - 全角は2としてカウントします。上記以外を全角として処理します。
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 * @ignore
	 */
	static cutTextForWidth(text, offset, size) {
		const moji_array = Japanese.toMojiArrayFromString(text);
		const SPACE = [ 0x20 ] ; // ' '
		/**
		 * @type {Array<Array<number>>}
		 */
		const output = [];
		let is_target = false;
		let position = 0;
		let cut_size = size;
		if(offset < 0) {
			cut_size += offset;
			offset = 0;
		}
		if(cut_size <= 0) {
			return "";
		}
		for(let i = 0; i < moji_array.length; i++) {
			const ch = moji_array[i][0];
			const ch_size = ((ch < 0x80) || ((0xFF61 <= ch) && (ch < 0xFFA0))) ? 1 : 2;
			if(position >= offset) {
				is_target = true;
				if(cut_size >= ch_size) {
					output.push(moji_array[i]);
				}
				else {
					output.push(SPACE);
				}
				cut_size -= ch_size;
				if(cut_size <= 0) {
					break;
				}
			}
			position += ch_size;
			// 2バイト文字の途中をoffset指定していた場合になる。
			if(((position - 1) >= offset) && !is_target) {
				cut_size--;
				output.push(SPACE);
			}
		}
		return Japanese.toStringFromMojiArray(output);
	}

}

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
 * 制御文字マップ
 * @type {Object<number, string>}
 * @ignore
 */
let control_charcter_map = null;

/**
 * 1981年より前に常用漢字とされているか
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_before_1981_map = null;

/**
 * 1981年時点で追加された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_add_1981_map = null;

/**
 * 2010年時点で追加された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_add_2010_map = null;

/**
 * 2010年時点で削除された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_delete_2010_map = null;

/**
 * 2017年時点で常用漢字でかつ人名用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_joyokanji_isetai_2017_map = null;

/**
 * 2017年時点で常用漢字でないが人名用漢字か（異性体なし）
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_notjoyokanji_2017_map = null;

/**
 * 2017年時点で異性体がある人名漢字
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_notjoyokanji_isetai_2017_map = null;

/**
 * コードポイントからUnicodeのブロック名に変換する
 * @type {function(number): string}
 * @ignore
 */
let to_block_name_from_unicode = null;

/**
 * 調査用マップを作成するクラス
 * @ignore
 */
class MOJI_CHAR_MAP {
	
	/**
	 * 初期化
	 */
	static init() {
		if(MOJI_CHAR_MAP.is_initmap) {
			return;
		}
		MOJI_CHAR_MAP.is_initmap = true;

		/**
		 * 文字列から、UTF32の存在マップを作成
		 * @param {string} string_data 
		 * @returns {Object<number, number>}
		 */
		const createMap = function(string_data) {
			const utf32_array = Unicode.toUTF32Array(string_data);
			/**
			 * @type {Object<number, number>}
			 */
			const map = {};
			for(const key in utf32_array) {
				map[utf32_array[key]] = 1;
			}
			return map;
		};

		// 参考
		// 常用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亜哀愛悪握圧扱安案暗以衣位囲医依委威為胃尉異移偉意違維慰遺緯域育一壱逸芋引印因姻";
			map += "員院陰飲隠韻右宇羽雨畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎宴援園";
			map += "煙遠鉛塩演縁汚王央応往押欧殴桜翁奥横屋億憶虞乙卸音恩温穏下化火加可仮何花佳価果河";
			map += "科架夏家荷華菓貨過嫁暇禍寡歌箇課蚊我画芽賀雅餓介回灰会快戒改怪悔海界皆械絵開階塊";
			map += "解壊懐貝外劾害街慨該概各角拡革格核郭覚較隔閣確獲嚇穫学岳楽額掛括活渇割滑轄且株刈";
			map += "干刊甘汗完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡";
			map += "観艦鑑丸含岸岩眼顔願企危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規喜幾揮期棋貴棄旗";
			map += "器輝機騎技宜偽欺義疑儀戯擬犠議菊吉喫詰却客脚逆虐九久及弓丘旧休吸朽求究泣急級糾宮";
			map += "救球給窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供協況峡狭恐恭胸脅強教郷境橋鏡競響";
			map += "驚仰暁業凝曲局極玉斤均近金菌勤琴筋禁緊謹吟銀区句苦駆具愚空偶遇屈掘繰君訓勲薫軍郡";
			map += "群兄刑形系径茎係型契計恵啓掲経敬景軽傾携継慶憩警鶏芸迎鯨劇撃激欠穴血決結傑潔月犬";
			map += "件見券肩建研県倹兼剣軒健険圏堅検献絹遣権憲賢謙繭顕験懸元幻玄言弦限原現減源厳己戸";
			map += "古呼固孤弧故枯個庫湖雇誇鼓顧五互午呉後娯悟碁語誤護口工公孔功巧広甲交光向后好江考";
			map += "行坑孝抗攻更効幸拘肯侯厚恒皇紅荒郊香候校耕航貢降高康控黄慌港硬絞項鉱構綱酵稿興衡";
			map += "鋼講購号合拷剛豪克告谷刻国黒穀酷獄骨込今困恨根婚混紺魂墾懇左佐査砂唆差詐鎖座才再";
			map += "災妻砕宰栽彩採済祭斎細菜最裁債催歳載際在材剤財罪作削昨索策酢搾錯咲冊札刷殺察撮擦";
			map += "雑三山参蚕惨産散算酸賛残暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉姿思指";
			map += "施師紙脂視紫詞歯嗣試詩資飼誌雌賜諮示字寺次耳自似児事侍治持時滋慈辞磁璽式識軸七失";
			map += "室疾執湿漆質実芝写社車舎者射捨赦斜煮謝邪勺尺借釈爵若弱寂手主守朱取狩首殊珠酒種趣";
			map += "寿受授需儒樹収囚州舟秀周宗拾秋臭修終習週就衆集愁酬醜襲十充住柔重従渋銃獣縦叔祝宿";
			map += "淑粛縮熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署緒諸女如助序叙徐除小升少";
			map += "召匠床抄肖招承昇松沼昭将消症祥笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照詳彰障衝賞";
			map += "償礁鐘上丈冗条状乗城浄剰常情場畳蒸嬢錠譲醸色食植殖飾触嘱織職辱心申伸臣身辛侵信津";
			map += "神娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅陣尋図水吹垂炊帥粋衰推酔遂睡穂錘随";
			map += "髄枢崇数寸瀬是井世正生成西声制姓征性青政星牲省清盛婿晴勢聖誠精製誓静請整税夕斥石";
			map += "赤昔析席隻惜責跡積績籍切折拙窃接設雪摂節説舌絶千川占先宣専泉浅洗染扇旋船戦践銭銑";
			map += "潜線遷選薦繊鮮全前善然禅漸繕阻祖租素措粗組疎訴塑礎双壮早争走奏相荘草送倉捜桑巣掃";
			map += "窓創喪葬装僧想層総遭操燥霜騒造像増憎蔵贈臓即束足促則息速側測俗族属賊続卒率存村孫";
			map += "尊損他多打妥堕惰太対体耐待怠胎退帯泰袋逮替貸隊滞態大代台第題滝宅択沢卓拓託諾濁但";
			map += "達脱奪丹担単炭胆探淡短嘆端誕鍛団男段断弾暖談壇地池知値恥致遅痴稚置竹畜逐蓄築秩窒";
			map += "茶着嫡中仲虫沖宙忠抽注昼柱衷鋳駐著貯丁弔庁兆町長帳張彫頂鳥朝脹超腸跳徴潮澄調聴懲";
			map += "直勅沈珍朕陳賃鎮追墜通痛坪低呈廷弟定底抵邸貞帝訂庭逓停堤提程艇締的笛摘滴適敵迭哲";
			map += "鉄徹撤天典店点展添転田伝殿電斗吐徒途都渡塗土奴努度怒刀冬灯当投豆東到逃倒凍唐島桃";
			map += "討透党悼盗陶塔湯痘登答等筒統稲踏糖頭謄闘騰同胴動堂童道働銅導峠匿特得督徳篤毒独読";
			map += "突届豚鈍曇内南軟難二尼弐肉日入乳尿任妊忍認寧熱年念粘燃悩納能脳農濃波派破馬婆拝杯";
			map += "背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫舶博薄麦縛爆箱畑八発髪伐抜罰閥反半犯帆";
			map += "伴判坂板版班畔般販飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼肥非卑飛疲秘被悲費碑罷避尾美";
			map += "備微鼻匹必泌筆姫百氷表俵票評漂標苗秒病描品浜貧賓敏不夫父付布扶府怖附負赴浮婦符富";
			map += "普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛噴墳憤奮分文聞丙平兵併並柄";
			map += "陛閉幣弊米壁癖別片辺返変偏遍編弁便勉歩保捕補舗母募墓慕暮簿方包芳邦奉宝抱放法胞倣";
			map += "峰砲崩訪報豊飽縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿暴膨謀北木牧墨撲没本奔翻凡盆";
			map += "麻摩魔毎妹枚埋幕膜又末万満慢漫未味魅密脈妙民眠矛務無夢霧娘名命明迷盟銘鳴滅免面綿";
			map += "茂模毛盲耗猛網目黙門紋問匁夜野役約訳薬躍由油愉諭輸唯友有勇幽郵猶裕遊雄誘憂融優与";
			map += "予余誉預幼用羊洋要容庸揚揺葉陽溶腰様踊窯養擁謡曜抑浴欲翌翼裸来雷頼絡落酪乱卵覧濫";
			map += "欄吏利里理痢裏履離陸立律略柳流留粒隆硫旅虜慮了両良料涼猟陵量僚領寮療糧力緑林厘倫";
			map += "輪隣臨涙累塁類令礼冷励例鈴零霊隷齢麗暦歴列劣烈裂恋連廉練錬炉路露老労郎朗浪廊楼漏";
			map += "六録論和話賄惑湾腕";
			joyokanji_before_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "猿凹渦靴稼拐涯垣殻潟喝褐缶頑挟矯襟隅渓蛍嫌洪溝昆崎皿桟傘肢遮蛇酌汁塾尚宵縄壌唇甚";
			map += "据杉斉逝仙栓挿曹槽藻駄濯棚挑眺釣塚漬亭偵泥搭棟洞凸屯把覇漠肌鉢披扉猫頻瓶雰塀泡俸";
			map += "褒朴僕堀磨抹岬妄厄癒悠羅竜戻枠";
			joyokanji_add_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "通用字体挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩";
			map += "伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶";
			map += "斬恣摯餌鹿嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴";
			map += "誰旦綻緻酎貼嘲捗椎爪鶴諦溺塡妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剝箸氾汎阪斑眉膝肘";
			map += "阜訃蔽餅璧蔑哺蜂貌頰睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇";
			joyokanji_add_2010_map = createMap(map);
		}

		{
			let map = "";
			map += "勺錘銑脹匁";
			joyokanji_delete_2010_map = createMap(map);
		}
		
		// 参考
		// 人名用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亞亜惡悪爲為逸逸榮栄衞衛謁謁圓円緣縁薗園應応櫻桜奧奥橫横溫温價価禍禍悔悔海海壞壊";
			map += "懷懐樂楽渴渇卷巻陷陥寬寛漢漢氣気祈祈器器僞偽戲戯虛虚峽峡狹狭響響曉暁勤勤謹謹駈駆";
			map += "勳勲薰薫惠恵揭掲鷄鶏藝芸擊撃縣県儉倹劍剣險険圈圏檢検顯顕驗験嚴厳廣広恆恒黃黄國国";
			map += "黑黒穀穀碎砕雜雑祉祉視視兒児濕湿實実社社者者煮煮壽寿收収臭臭從従澁渋獸獣縱縦祝祝";
			map += "暑暑署署緖緒諸諸敍叙將将祥祥涉渉燒焼奬奨條条狀状乘乗淨浄剩剰疊畳孃嬢讓譲釀醸神神";
			map += "眞真寢寝愼慎盡尽粹粋醉酔穗穂瀨瀬齊斉靜静攝摂節節專専戰戦纖繊禪禅祖祖壯壮爭争莊荘";
			map += "搜捜巢巣曾曽裝装僧僧層層瘦痩騷騒增増憎憎藏蔵贈贈臟臓卽即帶帯滯滞瀧滝單単嘆嘆團団";
			map += "彈弾晝昼鑄鋳著著廳庁徵徴聽聴懲懲鎭鎮轉転傳伝都都嶋島燈灯盜盗稻稲德徳突突難難拜拝";
			map += "盃杯賣売梅梅髮髪拔抜繁繁晚晩卑卑祕秘碑碑賓賓敏敏冨富侮侮福福拂払佛仏勉勉步歩峯峰";
			map += "墨墨飜翻每毎萬万默黙埜野彌弥藥薬與与搖揺樣様謠謡來来賴頼覽覧欄欄龍竜虜虜凉涼綠緑";
			map += "淚涙壘塁類類禮礼曆暦歷歴練練鍊錬郞郎朗朗廊廊錄録";
			jinmeiyokanji_joyokanji_isetai_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "丑丞乃之乎也云些亦亥亨亮仔伊伍伽佃佑伶侃侑俄俠俣俐倭俱倦倖偲傭儲允兎兜其冴凌凧凪";
			map += "凰凱函劉劫勁勺勿匁匡廿卜卯卿厨厩叉叡叢叶只吾吞吻哉哨啄哩喬喧喰喋嘩嘉嘗噌噂圃圭坐";
			map += "坦埴堰堺堵塙壕壬夷奄奎套娃姪姥娩嬉孟宏宋宕宥寅寓寵尖尤屑峨峻崚嵯嵩嶺巫已巳巴巷巽";
			map += "帖幌幡庄庇庚庵廟廻弘弛彗彦彪彬徠忽怜恢恰恕悌惟惚悉惇惹惺惣慧憐戊或戟托按挺挽掬捲";
			map += "捷捺捧掠揃摑摺撒撰撞播撫擢孜敦斐斡斧斯於旭昂昊昏昌昴晏晒晋晟晦晨智暉暢曙曝曳朋朔";
			map += "杏杖杜李杭杵杷枇柑柴柘柊柏柾柚栞桔桂栖桐栗梧梓梢梛梯桶梶椛梁棲椋椀楯楚楕椿楠楓椰";
			map += "楢楊榎樺榊榛槍槌樫槻樟樋橘樽橙檎檀櫂櫛櫓欣欽歎此殆毅毘毬汀汝汐汲沌沓沫洸洲洵洛浩";
			map += "浬淵淳淀淋渥渾湘湊湛溢滉溜漱漕漣澪濡瀕灘灸灼烏焰焚煌煤煉熙燕燎燦燭燿爾牒牟牡牽犀";
			map += "狼獅玖珂珈珊珀玲琉瑛琥琶琵琳瑚瑞瑶瑳瓜瓢甥甫畠畢疋疏皐皓眸瞥矩砦砥砧硯碓碗碩碧磐";
			map += "磯祇禽禾秦秤稀稔稟稜穹穿窄窪窺竣竪竺竿笈笹笙笠筈筑箕箔篇篠簞簾籾粥粟糊紘紗紐絃紬";
			map += "絆絢綺綜綴緋綾綸縞徽繫繡纂纏羚翔翠耀而耶耽聡肇肋肴胤胡脩腔脹膏臥舜舵芥芹芭芙芦苑";
			map += "茄苔苺茅茉茸茜莞荻莫莉菅菫菖萄菩萊菱葦葵萱葺萩董葡蓑蒔蒐蒼蒲蒙蓉蓮蔭蔣蔦蓬蔓蕎蕨";
			map += "蕉蕃蕪薙蕾蕗藁薩蘇蘭蝦蝶螺蟬蟹蠟衿袈袴裡裟裳襖訊訣註詢詫誼諏諄諒謂諺讃豹貰賑赳跨";
			map += "蹄蹟輔輯輿轟辰辻迂迄辿迪迦這逞逗逢遁遼邑祁郁鄭酉醇醐醍醬釉釘釧銑鋒鋸錘錐錆錫鍬鎧";
			map += "閃閏閤阿陀隈隼雀雁雛雫霞靖鞄鞍鞘鞠鞭頁頌頗顚颯饗馨馴馳駕駿驍魁魯鮎鯉鯛鰯鱒鱗鳩鳶";
			map += "鳳鴨鴻鵜鵬鷗鷲鷺鷹麒麟麿黎黛鼎";
			jinmeiyokanji_notjoyokanji_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "亙亘凛凜堯尭巖巌晄晃檜桧槇槙渚渚猪猪琢琢禰祢祐祐禱祷祿禄禎禎穰穣萠萌遙遥";
			jinmeiyokanji_notjoyokanji_isetai_2017_map = createMap(map);
		}

		// 制御文字、VSは多いため含めていない

		control_charcter_map = {
			// --- C0 control characters (ASCII 0x00–0x1F) ---
			0:  "NUL", // Null
			1:  "SOH", // Start of Heading
			2:  "STX", // Start of Text
			3:  "ETX", // End of Text
			4:  "EOT", // End of Transmission
			5:  "ENQ", // Enquiry
			6:  "ACK", // Acknowledge
			7:  "BEL", // Bell (beep)

			8:  "BS",  // Backspace
			9:  "HT",  // Horizontal Tab
			10: "LF",  // Line Feed
			11: "VT",  // Vertical Tab
			12: "FF",  // Form Feed
			13: "CR",  // Carriage Return
			14: "SO",  // Shift Out
			15: "SI",  // Shift In

			16: "DLE", // Data Link Escape
			17: "DC1", // Device Control 1 (XON)
			18: "DC2", // Device Control 2
			19: "DC3", // Device Control 3 (XOFF)
			20: "DC4", // Device Control 4
			21: "NAK", // Negative Acknowledge
			22: "SYN", // Synchronous Idle
			23: "ETB", // End of Transmission Block

			24: "CAN", // Cancel
			25: "EM",  // End of Medium
			26: "SUB", // Substitute
			27: "ESC", // Escape
			28: "FS",  // File Separator
			29: "GS",  // Group Separator
			30: "RS",  // Record Separator
			31: "US",  // Unit Separator

			// --- DEL ---
			127: "DEL", // Delete

			// --- C1 control characters (ISO/IEC 6429, 0x80–0x9F) ---
			128: "PAD", // Padding Character
			129: "HOP", // High Octet Preset
			130: "BPH", // Break Permitted Here
			131: "NBH", // No Break Here
			132: "IND", // Index
			133: "NEL", // Next Line
			134: "SSA", // Start of Selected Area
			135: "ESA", // End of Selected Area
			136: "HTS", // Horizontal Tab Set
			137: "HTJ", // Horizontal Tab with Justification
			138: "VTS", // Vertical Tab Set
			139: "PLD", // Partial Line Down
			140: "PLU", // Partial Line Up
			141: "RI",  // Reverse Index
			142: "SS2", // Single Shift 2
			143: "SS3", // Single Shift 3
			144: "DCS", // Device Control String
			145: "PU1", // Private Use 1
			146: "PU2", // Private Use 2
			147: "STS", // Set Transmit State
			148: "CCH", // Cancel Character
			149: "MW",  // Message Waiting
			150: "SPA", // Start of Protected Area
			151: "EPA", // End of Protected Area
			152: "SOS", // Start of String
			153: "SGCI",// Single Graphic Character Introducer
			154: "SCI", // Single Character Introducer
			155: "CSI", // Control Sequence Introducer
			156: "ST",  // String Terminator
			157: "OSC", // Operating System Command
			158: "PM",  // Privacy Message
			159: "APC", // Application Program Command

			// --- Unicode but制御的に扱われる文字 ---
			160: "NBSP", // No-Break Space（表示は空白だが改行不可）
			173: "SHY",  // Soft Hyphen（通常は表示されない）

			// --- Unicode Interlinear Annotation ---
			65529: "IAA", // Interlinear Annotation Anchor
			65530: "IAS", // Interlinear Annotation Separator
			65531: "IAT", // Interlinear Annotation Terminator

			// Zero Width / Joiner 系（Cf）
			0x200B: "ZWSP",   // ZERO WIDTH SPACE
			0x200C: "ZWNJ",   // ZERO WIDTH NON-JOINER
			0x200D: "ZWJ",    // ZERO WIDTH JOINER
			0x2060: "WJ",     // WORD JOINER
			0xFEFF: "BOM",    // BYTE ORDER MARK / ZERO WIDTH NO-BREAK SPACE

			// 双方向（BiDi）制御文字
			0x202A: "LRE",    // LEFT-TO-RIGHT EMBEDDING
			0x202B: "RLE",    // RIGHT-TO-LEFT EMBEDDING
			0x202C: "PDF",    // POP DIRECTIONAL FORMATTING
			0x202D: "LRO",    // LEFT-TO-RIGHT OVERRIDE
			0x202E: "RLO",    // RIGHT-TO-LEFT OVERRIDE

			0x2066: "LRI",    // LEFT-TO-RIGHT ISOLATE
			0x2067: "RLI",    // RIGHT-TO-LEFT ISOLATE
			0x2068: "FSI",    // FIRST STRONG ISOLATE
			0x2069: "PDI" ,   // POP DIRECTIONAL ISOLATE

			// Unicode Noncharacter（検証・防御用途）
			0xFFFE: "NONCHAR_FFFE",
			0xFFFF: "NONCHAR_FFFF"
		};

		const unicode_blockname_array = [
			"Basic Latin", "Latin-1 Supplement", "Latin Extended-A", "Latin Extended-B", "IPA Extensions", "Spacing Modifier Letters", "Combining Diacritical Marks", "Greek and Coptic", 
			"Cyrillic", "Cyrillic Supplement", "Armenian", "Hebrew", "Arabic", "Syriac", "Arabic Supplement", "Thaana", 
			"NKo", "Samaritan", "Mandaic", "Syriac Supplement", "Arabic Extended-B", "Arabic Extended-A", "Devanagari", "Bengali", 
			"Gurmukhi", "Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala", 
			"Thai", "Lao", "Tibetan", "Myanmar", "Georgian", "Hangul Jamo", "Ethiopic", "Ethiopic Supplement", 
			"Cherokee", "Unified Canadian Aboriginal Syllabics", "Ogham", "Runic", "Tagalog", "Hanunoo", "Buhid", "Tagbanwa", 
			"Khmer", "Mongolian", "Unified Canadian Aboriginal Syllabics Extended", "Limbu", "Tai Le", "New Tai Lue", "Khmer Symbols", "Buginese", 
			"Tai Tham", "Combining Diacritical Marks Extended", "Balinese", "Sundanese", "Batak", "Lepcha", "Ol Chiki", "Cyrillic Extended-C", 
			"Georgian Extended", "Sundanese Supplement", "Vedic Extensions", "Phonetic Extensions", "Phonetic Extensions Supplement", "Combining Diacritical Marks Supplement", "Latin Extended Additional", "Greek Extended", 
			"General Punctuation", "Superscripts and Subscripts", "Currency Symbols", "Combining Diacritical Marks for Symbols", "Letterlike Symbols", "Number Forms", "Arrows", "Mathematical Operators", 
			"Miscellaneous Technical", "Control Pictures", "Optical Character Recognition", "Enclosed Alphanumerics", "Box Drawing", "Block Elements", "Geometric Shapes", "Miscellaneous Symbols", 
			"Dingbats", "Miscellaneous Mathematical Symbols-A", "Supplemental Arrows-A", "Braille Patterns", "Supplemental Arrows-B", "Miscellaneous Mathematical Symbols-B", "Supplemental Mathematical Operators", "Miscellaneous Symbols and Arrows", 
			"Glagolitic", "Latin Extended-C", "Coptic", "Georgian Supplement", "Tifinagh", "Ethiopic Extended", "Cyrillic Extended-A", "Supplemental Punctuation", 
			"CJK Radicals Supplement", "Kangxi Radicals", "Ideographic Description Characters", "CJK Symbols and Punctuation", "Hiragana", "Katakana", "Bopomofo", "Hangul Compatibility Jamo", 
			"Kanbun", "Bopomofo Extended", "CJK Strokes", "Katakana Phonetic Extensions", "Enclosed CJK Letters and Months", "CJK Compatibility", "CJK Unified Ideographs Extension A", "Yijing Hexagram Symbols", 
			"CJK Unified Ideographs", "Yi Syllables", "Yi Radicals", "Lisu", "Vai", "Cyrillic Extended-B", "Bamum", "Modifier Tone Letters", 
			"Latin Extended-D", "Syloti Nagri", "Common Indic Number Forms", "Phags-pa", "Saurashtra", "Devanagari Extended", "Kayah Li", "Rejang", 
			"Hangul Jamo Extended-A", "Javanese", "Myanmar Extended-B", "Cham", "Myanmar Extended-A", "Tai Viet", "Meetei Mayek Extensions", "Ethiopic Extended-A", 
			"Latin Extended-E", "Cherokee Supplement", "Meetei Mayek", "Hangul Syllables", "Hangul Jamo Extended-B", "High Surrogates", "High Private Use Surrogates", "Low Surrogates", 
			"Private Use Area", "CJK Compatibility Ideographs", "Alphabetic Presentation Forms", "Arabic Presentation Forms-A", "Variation Selectors", "Vertical Forms", "Combining Half Marks", "CJK Compatibility Forms", 
			"Small Form Variants", "Arabic Presentation Forms-B", "Halfwidth and Fullwidth Forms", "Specials", "Linear B Syllabary", "Linear B Ideograms", "Aegean Numbers", "Ancient Greek Numbers", 
			"Ancient Symbols", "Phaistos Disc", "Lycian", "Carian", "Coptic Epact Numbers", "Old Italic", "Gothic", "Old Permic", 
			"Ugaritic", "Old Persian", "Deseret", "Shavian", "Osmanya", "Osage", "Elbasan", "Caucasian Albanian", 
			"Vithkuqi", "Linear A", "Latin Extended-F", "Cypriot Syllabary", "Imperial Aramaic", "Palmyrene", "Nabataean", "Hatran", 
			"Phoenician", "Lydian", "Meroitic Hieroglyphs", "Meroitic Cursive", "Kharoshthi", "Old South Arabian", "Old North Arabian", "Manichaean", 
			"Avestan", "Inscriptional Parthian", "Inscriptional Pahlavi", "Psalter Pahlavi", "Old Turkic", "Old Hungarian", "Hanifi Rohingya", "Rumi Numeral Symbols", 
			"Yezidi", "Arabic Extended-C", "Old Sogdian", "Sogdian", "Old Uyghur", "Chorasmian", "Elymaic", "Brahmi", 
			"Kaithi", "Sora Sompeng", "Chakma", "Mahajani", "Sharada", "Sinhala Archaic Numbers", "Khojki", "Multani", 
			"Khudawadi", "Grantha", "Newa", "Tirhuta", "Siddham", "Modi", "Mongolian Supplement", "Takri", 
			"Ahom", "Dogra", "Warang Citi", "Dives Akuru", "Nandinagari", "Zanabazar Square", "Soyombo", "Unified Canadian Aboriginal Syllabics Extended-A", 
			"Pau Cin Hau", "Devanagari Extended-A", "Bhaiksuki", "Marchen", "Masaram Gondi", "Gunjala Gondi", "Makasar", "Kawi", 
			"Lisu Supplement", "Tamil Supplement", "Cuneiform", "Cuneiform Numbers and Punctuation", "Early Dynastic Cuneiform", "Cypro-Minoan", "Egyptian Hieroglyphs", "Egyptian Hieroglyph Format Controls", 
			"Anatolian Hieroglyphs", "Bamum Supplement", "Mro", "Tangsa", "Bassa Vah", "Pahawh Hmong", "Medefaidrin", "Miao", 
			"Ideographic Symbols and Punctuation", "Tangut", "Tangut Components", "Khitan Small Script", "Tangut Supplement", "Kana Extended-B", "Kana Supplement", "Kana Extended-A", 
			"Small Kana Extension", "Nushu", "Duployan", "Shorthand Format Controls", "Znamenny Musical Notation", "Byzantine Musical Symbols", "Musical Symbols", "Ancient Greek Musical Notation", 
			"Kaktovik Numerals", "Mayan Numerals", "Tai Xuan Jing Symbols", "Counting Rod Numerals", "Mathematical Alphanumeric Symbols", "Sutton SignWriting", "Latin Extended-G", "Glagolitic Supplement", 
			"Cyrillic Extended-D", "Nyiakeng Puachue Hmong", "Toto", "Wancho", "Nag Mundari", "Ethiopic Extended-B", "Mende Kikakui", "Adlam", 
			"Indic Siyaq Numbers", "Ottoman Siyaq Numbers", "Arabic Mathematical Alphabetic Symbols", "Mahjong Tiles", "Domino Tiles", "Playing Cards", "Enclosed Alphanumeric Supplement", "Enclosed Ideographic Supplement", 
			"Miscellaneous Symbols and Pictographs", "Emoticons", "Ornamental Dingbats", "Transport and Map Symbols", "Alchemical Symbols", "Geometric Shapes Extended", "Supplemental Arrows-C", "Supplemental Symbols and Pictographs", 
			"Chess Symbols", "Symbols and Pictographs Extended-A", "Symbols for Legacy Computing", "CJK Unified Ideographs Extension B", "CJK Unified Ideographs Extension C", "CJK Unified Ideographs Extension D", "CJK Unified Ideographs Extension E", "CJK Unified Ideographs Extension F", "CJK Unified Ideographs Extension I", 
			"CJK Compatibility Ideographs Supplement", "CJK Unified Ideographs Extension G", "CJK Unified Ideographs Extension H", "CJK Unified Ideographs Extension J", "Tags", "Variation Selectors Supplement", "Supplementary Private Use Area-A", "Supplementary Private Use Area-B"
		];

		const unicode_blockaddress_array = [
			0x007F, 0x00FF, 0x017F, 0x024F, 0x02AF, 0x02FF, 0x036F, 0x03FF, 0x04FF, 0x052F, 0x058F, 0x05FF, 0x06FF, 0x074F, 0x077F, 0x07BF,
			0x07FF, 0x083F, 0x085F, 0x086F, 0x089F, 0x08FF, 0x097F, 0x09FF, 0x0A7F, 0x0AFF, 0x0B7F, 0x0BFF, 0x0C7F, 0x0CFF, 0x0D7F, 0x0DFF,
			0x0E7F, 0x0EFF, 0x0FFF, 0x109F, 0x10FF, 0x11FF, 0x137F, 0x139F, 0x13FF, 0x167F, 0x169F, 0x16FF, 0x171F, 0x173F, 0x175F, 0x177F,
			0x17FF, 0x18AF, 0x18FF, 0x194F, 0x197F, 0x19DF, 0x19FF, 0x1A1F, 0x1AAF, 0x1AFF, 0x1B7F, 0x1BBF, 0x1BFF, 0x1C4F, 0x1C7F, 0x1C8F,
			0x1CBF, 0x1CCF, 0x1CFF, 0x1D7F, 0x1DBF, 0x1DFF, 0x1EFF, 0x1FFF, 0x206F, 0x209F, 0x20CF, 0x20FF, 0x214F, 0x218F, 0x21FF, 0x22FF,
			0x23FF, 0x243F, 0x245F, 0x24FF, 0x257F, 0x259F, 0x25FF, 0x26FF, 0x27BF, 0x27EF, 0x27FF, 0x28FF, 0x297F, 0x29FF, 0x2AFF, 0x2BFF,
			0x2C5F, 0x2C7F, 0x2CFF, 0x2D2F, 0x2D7F, 0x2DDF, 0x2DFF, 0x2E7F, 0x2EFF, 0x2FDF, 0x2FFF, 0x303F, 0x309F, 0x30FF, 0x312F, 0x318F,
			0x319F, 0x31BF, 0x31EF, 0x31FF, 0x32FF, 0x33FF, 0x4DBF, 0x4DFF, 0x9FFF, 0xA48F, 0xA4CF, 0xA4FF, 0xA63F, 0xA69F, 0xA6FF, 0xA71F,
			0xA7FF, 0xA82F, 0xA83F, 0xA87F, 0xA8DF, 0xA8FF, 0xA92F, 0xA95F, 0xA97F, 0xA9DF, 0xA9FF, 0xAA5F, 0xAA7F, 0xAADF, 0xAAFF, 0xAB2F,
			0xAB6F, 0xABBF, 0xABFF, 0xD7AF, 0xD7FF, 0xDB7F, 0xDBFF, 0xDFFF, 0xF8FF, 0xFAFF, 0xFB4F, 0xFDFF, 0xFE0F, 0xFE1F, 0xFE2F, 0xFE4F,
			0xFE6F, 0xFEFF, 0xFFEF, 0xFFFF, 0x1007F, 0x100FF, 0x1013F, 0x1018F, 0x101CF, 0x101FF, 0x1029F, 0x102DF, 0x102FF, 0x1032F, 0x1034F, 0x1037F,
			0x1039F, 0x103DF, 0x1044F, 0x1047F, 0x104AF, 0x104FF, 0x1052F, 0x1056F, 0x105BF, 0x1077F, 0x107BF, 0x1083F, 0x1085F, 0x1087F, 0x108AF, 0x108FF,
			0x1091F, 0x1093F, 0x1099F, 0x109FF, 0x10A5F, 0x10A7F, 0x10A9F, 0x10AFF, 0x10B3F, 0x10B5F, 0x10B7F, 0x10BAF, 0x10C4F, 0x10CFF, 0x10D3F, 0x10E7F,
			0x10EBF, 0x10EFF, 0x10F2F, 0x10F6F, 0x10FAF, 0x10FDF, 0x10FFF, 0x1107F, 0x110CF, 0x110FF, 0x1114F, 0x1117F, 0x111DF, 0x111FF, 0x1124F, 0x112AF,
			0x112FF, 0x1137F, 0x1147F, 0x114DF, 0x115FF, 0x1165F, 0x1167F, 0x116CF, 0x1174F, 0x1184F, 0x118FF, 0x1195F, 0x119FF, 0x11A4F, 0x11AAF, 0x11ABF,
			0x11AFF, 0x11B5F, 0x11C6F, 0x11CBF, 0x11D5F, 0x11DAF, 0x11EFF, 0x11F5F, 0x11FBF, 0x11FFF, 0x123FF, 0x1247F, 0x1254F, 0x12FFF, 0x1342F, 0x1345F,
			0x1467F, 0x16A3F, 0x16A6F, 0x16ACF, 0x16AFF, 0x16B8F, 0x16E9F, 0x16F9F, 0x16FFF, 0x187FF, 0x18AFF, 0x18CFF, 0x18D7F, 0x1AFFF, 0x1B0FF, 0x1B12F,
			0x1B16F, 0x1B2FF, 0x1BC9F, 0x1BCAF, 0x1CFCF, 0x1D0FF, 0x1D1FF, 0x1D24F, 0x1D2DF, 0x1D2FF, 0x1D35F, 0x1D37F, 0x1D7FF, 0x1DAAF, 0x1DFFF, 0x1E02F,
			0x1E08F, 0x1E14F, 0x1E2BF, 0x1E2FF, 0x1E4FF, 0x1E7FF, 0x1E8DF, 0x1E95F, 0x1ECBF, 0x1ED4F, 0x1EEFF, 0x1F02F, 0x1F09F, 0x1F0FF, 0x1F1FF, 0x1F2FF,
			0x1F5FF, 0x1F64F, 0x1F67F, 0x1F6FF, 0x1F77F, 0x1F7FF, 0x1F8FF, 0x1F9FF, 0x1FA6F, 0x1FAFF, 0x1FBFF, 0x2A6DF, 0x2B73F, 0x2B81F, 0x2CEAF, 0x2EBEF, 0x2EE5F,
			0x2FA1F, 0x3134F, 0x323AF, 0x3347F, 0xE007F, 0xE01EF, 0xFFFFF, 0x10FFFF
		];

		to_block_name_from_unicode = function(unicode_codepoint) {
			for(let i = 0; i < unicode_blockname_array.length; i++) {
				if(unicode_codepoint <= unicode_blockaddress_array[i]) {
					return unicode_blockname_array[i];
				}
			}
			return "-";
		};

	}

	/**
	 * コードポイントからUnicodeのブロック名に変換する
	 * @param {number} unicode_codepoint 
	 * @returns {string}
	 */
	static toBlockNameFromUnicode(unicode_codepoint) {
		MOJI_CHAR_MAP.init();
		return to_block_name_from_unicode(unicode_codepoint);
	}

	/**
	 * 変換用マップ
	 */
	static CONTROL_CHARCTER() {
		MOJI_CHAR_MAP.init();
		return control_charcter_map;
	}

	/**
	 * チェック用マップ
	 */
	static JOYOJANJI_BEFORE_1981() {
		MOJI_CHAR_MAP.init();
		return joyokanji_before_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_ADD_1981() {
		MOJI_CHAR_MAP.init();
		return joyokanji_add_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_ADD_2010() {
		MOJI_CHAR_MAP.init();
		return joyokanji_add_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_DELETE_2010() {
		MOJI_CHAR_MAP.init();
		return joyokanji_delete_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_JOYOKANJI_ISETAI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_joyokanji_isetai_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_NOTJOYOKANJI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_isetai_2017_map;
	}
	
}

/**
 * マップを初期化した否か
 */
MOJI_CHAR_MAP.is_initmap = false;

/**
 * 文字の解析用クラス
 * @ignore
 */
class MojiAnalizerTools {

	/**
	 * コードポイントから異体字セレクタの判定
	 * @param {Number} codepoint - コードポイント
	 * @param {boolean} [annotate = false] - 注釈をつけるか否か
	 * @returns {string|null} 確認結果(異体字セレクタではない場合はNULLを返す)
	 */
	static getVariationSelectorsNumberFromCodePoint(codepoint, annotate) {
		// モンゴル自由字形選択子 U+180B〜U+180D (3個)
		if((0x180B <= codepoint) && (codepoint <= 0x180D)) {
			return "FVS" + ((codepoint - 0x180B) + 1);
		}
		// SVSで利用される異体字セレクタ U+FE00〜U+FE0F (VS1～VS16) (16個)
		if((0xFE00 <= codepoint) && (codepoint <= 0xFE0F)) {
			const n = (codepoint - 0xFE00) + 1;
			if (!annotate) return "VS" + n;
			if (codepoint === 0xFE0E) return "VS15 (text)";
			if (codepoint === 0xFE0F) return "VS16 (emoji)";
			return "VS" + n;
		}
		// IVSで利用される異体字セレクタ U+E0100〜U+E01EF (VS17～VS256) (240個)
		else if((0xE0100 <= codepoint) && (codepoint <= 0xE01EF)) {
			return "VS" + ((codepoint - 0xE0100) + 17);
		}
		return null;
	}
	
	/**
	 * 指定したコードポイントが制御文字であれば、制御文字の名前を返す
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {String} 制御文字名、違う場合は null 
	 */
	static getControlCharcterName(unicode_codepoint) {
		const info_variation_selectors_number = MojiAnalizerTools.getVariationSelectorsNumberFromCodePoint(unicode_codepoint);
		if(info_variation_selectors_number !== null) {
			return info_variation_selectors_number;
		}
		const control_charcter_map = MOJI_CHAR_MAP.CONTROL_CHARCTER();
		const name = control_charcter_map[unicode_codepoint];
		return name ? name : null;
	}
	
	/**
	 * 指定したコードポイントの漢字は1981年より前に常用漢字とされているか判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanjiBefore1981(unicode_codepoint) {
		const joyokanji_before_1981_map = MOJI_CHAR_MAP.JOYOJANJI_BEFORE_1981();
		return !!joyokanji_before_1981_map[unicode_codepoint];
	}

	/**
	 * 指定したコードポイントの漢字は1981年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji1981(unicode_codepoint) {
		const joyokanji_before_1981_map = MOJI_CHAR_MAP.JOYOJANJI_BEFORE_1981();
		const joyokanji_add_1981_map = MOJI_CHAR_MAP.JOYOKANJI_ADD_1981();
		return (!!joyokanji_before_1981_map[unicode_codepoint]) || (!!joyokanji_add_1981_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2010年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji2010(unicode_codepoint) {
		const joyokanji_add_2010_map = MOJI_CHAR_MAP.JOYOKANJI_ADD_2010();
		const joyokanji_delete_2010_map = MOJI_CHAR_MAP.JOYOKANJI_DELETE_2010();
		if(joyokanji_delete_2010_map[unicode_codepoint]) {
			return false;
		}
		const x = MojiAnalizerTools.isJoyoKanji1981(unicode_codepoint);
		return x || (!!joyokanji_add_2010_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji2017(unicode_codepoint) {
		if(MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint)) {
			return false;
		}
		const jinmeiyokanji_joyokanji_isetai_map = MOJI_CHAR_MAP.JINMEIYOKANJI_JOYOKANJI_ISETAI_2017();
		const jinmeiyokanji_notjoyokanji_map = MOJI_CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_2017();
		const jinmeiyokanji_notjoyokanji_isetai_map = MOJI_CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017();
		return (!!jinmeiyokanji_joyokanji_isetai_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_isetai_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJinmeiyoKanji2017(unicode_codepoint) {
		return MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint) || MojiAnalizerTools.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint);
	}
	
	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJinmeiyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isJinmeiyoKanji2017(unicode_codepoint);
	}

}

/**
 * 文字のエンコード情報
 * @typedef {Object} MojiEncodeData
 * @property {import("../encode/SJIS.js").MenKuTen} kuten 区点 コード
 * @property {import("../encode/SJIS.js").MenKuTen} menkuten 面区点 コード
 * @property {number} cp932_code CP932(Windows-31J) コード
 * @property {number} sjis2004_code Shift_JIS-2004 コード
 * @property {Array<number>} utf8_array UTF-8 配列
 * @property {Array<number>} utf16_array UTF-16 配列
 * @property {Array<number>} utf32_array UTF-32 配列
 * @property {Array<number>} cp932_array CP932(Windows-31J) バイト配列
 * @property {Array<number>} sjis2004_array Shift_JIS-2004 コード バイト配列
 * @property {Array<number>} shift_jis_array Shift_JIS バイト配列
 * @property {Array<number>} iso2022jp_array ISO-2022-JP バイト配列
 * @property {Array<number>} eucjpms_array eucJP-ms バイト配列
 * @property {Array<number>} eucjis2004_array EUC-JP-2004 バイト配列
 */

/**
 * 文字の種別情報
 * @typedef {Object} MojiTypeData
 * @property {boolean} is_regular_sjis Shift_JIS に登録された文字
 * @property {boolean} is_regular_sjis2004 Shift_JIS-2004 に登録された文字
 * @property {boolean} is_joyo_kanji 常用漢字
 * @property {boolean} is_jinmeiyo_kanji 人名用漢字
 * @property {boolean} is_gaiji_cp932 Windows-31J(CP932) 外字
 * @property {boolean} is_IBM_extended_character Windows-31J(CP932) IBM拡張文字
 * @property {boolean} is_NEC_selection_IBM_extended_character Windows-31J(CP932) NEC選定IBM拡張文字
 * @property {boolean} is_NEC_special_character Windows-31J(CP932) NEC特殊文字
 * @property {number} kanji_suijun Shift_JIS-2004 を使用して漢字の水準調査(1未満だと水準調査失敗)
 * @property {boolean} is_surrogate_pair 要 Unicode サロゲートペア
 * @property {string} control_name 制御文字名（制御文字ではない場合は null）
 * @property {boolean} is_control_charcter 制御文字
 * @property {string} blockname Unicodeブロック名
 * @property {boolean} is_kanji 漢字
 * @property {boolean} is_hiragana ひらがな
 * @property {boolean} is_katakana カタカナ
 * @property {boolean} is_fullwidth_ascii 全角ASCII
 * @property {boolean} is_halfwidth_katakana 半角カタカナ
 * @property {boolean} is_emoji 絵文字
 * @property {boolean} is_emoticons 顔文字
 * @property {boolean} is_symbol_base 記号(VS16 が付くと絵文字化)
 * @property {boolean} is_gaiji 外字
 * @property {boolean} is_combining_mark 結合文字
 * @property {boolean} is_variation_selector 異体字セレクタ
 */

/**
 * 文字の種別情報
 * @typedef {Object} MojiData
 * @property {MojiEncodeData} encode 文字のエンコード情報
 * @property {MojiTypeData} type 文字の種別情報
 * @property {string} character 解析した文字
 * @property {number} codepoint 解析した文字のコードポイント
 */

/**
 * 文字の解析用クラス
 * @ignore
 */
class MojiAnalyzer {

	/**
	 * 初期化
	 * @returns {MojiData}
	 * @ignore
	 */
	static _createMojiData() {

		/**
		 * @type {MojiEncodeData}
		 */
		const encode = {
			kuten : null,
			menkuten : null,
			cp932_code : 0,
			sjis2004_code : 0,
			utf8_array : [],
			utf16_array : [],
			utf32_array : [],
			cp932_array : [],
			sjis2004_array : [],
			shift_jis_array : [],
			iso2022jp_array : [],
			eucjpms_array : [],
			eucjis2004_array : []
		};
		
		/**
		 * @type {MojiTypeData}
		 */
		const type = {
			is_regular_sjis	: false,
			is_regular_sjis2004 : false,
			is_joyo_kanji		: false,
			is_jinmeiyo_kanji	: false,
			is_gaiji_cp932	: false,
			is_IBM_extended_character	: false,
			is_NEC_selection_IBM_extended_character	: false,
			is_NEC_special_character	: false,
			kanji_suijun : -1,
			is_surrogate_pair	: false,
			control_name : null,
			is_control_charcter : false,
			blockname : "",
			is_kanji : false,
			is_hiragana : false,
			is_katakana : false,
			is_fullwidth_ascii : false,
			is_halfwidth_katakana : false,
			is_emoji : false,
			is_emoticons : false,
			is_symbol_base : false,
			is_gaiji : false,
			is_combining_mark : false,
			is_variation_selector : false
		};

		/**
		 * @type {MojiData}
		 */
		const data = {
			encode : encode,
			type : type,
			character : null,
			codepoint : 0
		};

		return data;
	}

	/**
	 * 指定した1つの文字に関して、解析を行い情報を返します
	 * @param {Number} unicode_codepoint - UTF-32 のコードポイント
	 * @returns {MojiData} 文字の情報がつまったオブジェクト
	 */
	static getMojiData(unicode_codepoint) {

		// 基本情報取得
		const cp932code = CP932.toCP932FromUnicode(unicode_codepoint);
		const sjis2004code = SJIS2004.toSJIS2004FromUnicode(unicode_codepoint);
		const kuten = SJIS.toKuTenFromSJISCode(cp932code);
		const menkuten = SJIS.toMenKuTenFromSJIS2004Code(sjis2004code);
		const is_regular_sjis = cp932code < 0x100 || SJIS.isRegularMenKuten(kuten);
		const is_regular_sjis2004 = sjis2004code < 0x100 || SJIS.isRegularMenKuten(menkuten);

		/**
		 * 出力データの箱を用意
		 * @type {MojiData}
		 */
		const data = MojiAnalyzer._createMojiData();
		const encode = data.encode;
		const type = data.type;
		const character = Unicode.fromCodePoint(unicode_codepoint);
		data.character = character;
		data.codepoint = unicode_codepoint;

		// 句点と面区点情報(ない場合はnullになる)
		encode.kuten			= kuten;
		encode.menkuten			= menkuten;
		// コードの代入
		encode.cp932_code		= cp932code ? cp932code : -1;
		encode.sjis2004_code	= sjis2004code ? sjis2004code : -1;

		// Shift_JIS として許容されるか
		type.is_regular_sjis	= is_regular_sjis;
		type.is_regular_sjis2004 = is_regular_sjis2004;

		// 漢字が常用漢字か、人名用漢字かなど
		type.is_joyo_kanji		= MojiAnalizerTools.isJoyoKanji(unicode_codepoint);
		type.is_jinmeiyo_kanji	= MojiAnalizerTools.isJinmeiyoKanji(unicode_codepoint);

		// Windows-31J(CP932) に関しての調査 
		// 外字, IBM拡張文字, NEC選定IBM拡張文字, NEC特殊文字
		type.is_gaiji_cp932				= cp932code ? (0xf040 <= cp932code) && (cp932code <= 0xf9fc) : false;
		type.is_IBM_extended_character	= cp932code ? (0xfa40 <= cp932code) && (cp932code <= 0xfc4b) : false;
		type.is_NEC_selection_IBM_extended_character= cp932code ? (0xed40 <= cp932code) && (cp932code <= 0xeefc) : false;
		type.is_NEC_special_character	= cp932code ? (0x8740 <= cp932code) && (cp932code <= 0x879C) : false;

		// Shift_JIS-2004 を使用して漢字の水準調査(ない場合はnullになる)
		type.kanji_suijun = SJIS.toJISKanjiSuijunFromSJISCode(sjis2004code);

		// Unicodeの配列
		encode.utf8_array = Unicode.toUTF8Array(data.character);
		encode.utf16_array = Unicode.toUTF16Array(data.character);
		encode.utf32_array = [unicode_codepoint];
		type.is_surrogate_pair = encode.utf16_array.length > 1;

		// SJIS系の配列
		encode.cp932_array = cp932code ? ((cp932code >= 0x100) ? [cp932code >> 8, cp932code & 0xff] : [cp932code]) : [];
		encode.sjis2004_array = sjis2004code ? ((sjis2004code >= 0x100) ? [sjis2004code >> 8, sjis2004code & 0xff] : [sjis2004code]) : [];

		// EUC-JP系の配列
		encode.eucjpms_array = EUCJPMS.toEUCJPMSBinary(character);
		encode.eucjis2004_array = EUCJIS2004.toEUCJIS2004Binary(character);

		// ISO-2022-JP , EUC-JP
		if(cp932code < 0xE0 || is_regular_sjis) {
			if(cp932code < 0x80) {
				encode.shift_jis_array = [cp932code];
				encode.iso2022jp_array = [];
			}
			else if(cp932code < 0xE0) {
				// 半角カタカナの扱い
				encode.shift_jis_array = [cp932code];
				encode.iso2022jp_array = [];
			}
			else if(kuten.ku <= 94) {
				// 区点は94まで利用できる。
				// つまり、最大でも 94 + 0xA0 = 0xFE となり 0xFF 以上にならない
				encode.shift_jis_array = [encode.cp932_array[0], encode.cp932_array[1]];
				encode.iso2022jp_array = [kuten.ku + 0x20, kuten.ten + 0x20];
			}
		}
		else {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
		}
		// SJISとして正規でなければ強制エンコード失敗
		if(!is_regular_sjis) {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
		}

		// 制御文字かどうか
		type.control_name = MojiAnalizerTools.getControlCharcterName(unicode_codepoint);
		type.is_control_charcter = type.control_name ? true : false;

		// Unicodeのブロック名
		type.blockname = MOJI_CHAR_MAP.toBlockNameFromUnicode(unicode_codepoint);
		// ブロック名から判断
		type.is_kanji = /Ideographs/.test(type.blockname);
		type.is_hiragana = /Hiragana/.test(type.blockname);
		type.is_katakana = /Katakana/.test(type.blockname);
		type.is_fullwidth_ascii = /[\u3000\uFF01-\uFF5E]/.test(data.character);
		type.is_halfwidth_katakana = /[\uFF61-\uFF9F]/.test(data.character);
		// 絵文字
		type.is_emoji = /Pictographs|Transport and Map Symbols/.test(type.blockname);
		// 顔文字
		type.is_emoticons = /Emoticons/.test(type.blockname);
		// 記号(VS16 が付くと絵文字化)
		type.is_symbol_base = /Dingbats|Miscellaneous Symbols/.test(type.blockname);
		// 外字
		type.is_gaiji = /Private Use Area/.test(type.blockname);
		// 結合文字
		type.is_combining_mark = Unicode.isCombiningMarkFromCodePoint(unicode_codepoint);
		// 異体字セレクタ
		type.is_variation_selector = Unicode.isVariationSelectorFromCodePoint(unicode_codepoint);
		return data;
	}

}

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
 * 文字列比較関数を作成用のツールクラス
 * @ignore
 */
class ComparatorTool {

	/**
	 * 文字列の揺れを除去し正規化します。
	 * @param {String} string_data - 正規化したいテキスト
	 * @returns {String} 正規化後のテキスト
	 */
	static toNormalizeString(string_data) {
		let normalize_text = null;
		// NORM_IGNOREWIDTH 半角全角区別しない（半角英数記号と全角カタカナに統一）
		normalize_text = Japanese.toHalfWidthAsciiCode(Japanese.toHalfWidthAsciiCode(string_data));
		// LCMAP_LOWERCASE 半角に統一
		normalize_text = normalize_text.toLowerCase();
		// NORM_IGNOREKANATYPE ひらがなとカタカナを区別しない
		normalize_text = Japanese.toHiragana(normalize_text);
		// NORM_IGNORENONSPACE 簡単に場所をとらない記号を削除
		normalize_text = normalize_text.replace(/[゛゜]/g, "");
		// NORM_IGNORESYMBOLS 英文法の記号を無視
		normalize_text = normalize_text.replace(/["'-]/g, "");
		return normalize_text;
	}

	/**
	 * ASCIIコードが半角数値かどうかを判定する
	 * @param {number} string_number - ASCIIコード
	 * @returns {Boolean} 数値ならTRUE
	 */
	static isNumberAscii(string_number) {
		const ASCII_0 = 0x30;
		const ASCII_9 = 0x39;
		return (ASCII_0 <= string_number) && (string_number <= ASCII_9);
	}

	/**
	 * ASCIIコード配列の中で指定した位置から数値が何バイト続くか
	 * @param {Array<number>} string_number_array - ASCIIコードの配列
	 * @param {number} offset - どの位置から調べるか
	 * @returns {number} 数値ならTRUE
	 */
	static getNumberAsciiLength(string_number_array, offset) {
		for(let i = offset; i < string_number_array.length; i++) {
			if(!ComparatorTool.isNumberAscii(string_number_array[i])) {
				return (i - offset);
			}
		}
		return (string_number_array.length - offset);
	}

	/**
	 * ASCIIコード配列の中の指定した位置にある数値データ同士をCompareする
	 * @param {Array<number>} t1 - ASCIIコードの配列（比較元）
	 * @param {number} t1off - どの位置から調べるか
	 * @param {number} t1size - 調べるサイズ
	 * @param {Array<number>} t2 - ASCIIコードの配列（比較先）
	 * @param {number} t2off - どの位置から調べるか
	 * @param {number} t2size - 調べるサイズ
	 * @returns {number} Compare結果
	 */
	static compareNumber(t1, t1off, t1size, t2, t2off, t2size) {
		const ASCII_0 = 0x30;
		const t1end = t1off + t1size;
		const t2end = t2off + t2size;
		// 前方から調査
		let t1p = t1off;
		let t2p = t2off;
		// 先頭の0は飛ばして比較したい
		// 0以外の数値がどこに含まれているか調査
		for(;t1p < t1end;t1p++) {
			if(t1[t1p] !== ASCII_0) {
				break;
			}
		}
		for(;t2p < t2end;t2p++) {
			if(t2[t2p] !== ASCII_0) {
				break;
			}
		}
		// 0しかなかった場合
		if((t1p == t1end)||(t2p == t2end)) {
			if(t1p != t1end) { //t2pのみはみだした == 0
				return 1;
			}
			else if(t2p != t2end) {
				return -1;
			}
			else {
				return 0;
			}
		}
		// 桁数のみでどちらが大きいか比較
		const t1keta = t1size - (t1p - t1off);
		const t2keta = t2size - (t2p - t2off);
		if(t1keta > t2keta) {
			return 1;
		}
		else if(t1keta < t2keta) {
			return -1;
		}
		// 同じ桁同士の比較
		for(;t1p < t1end;) {
			if(t1[t1p] > t2[t2p]) {
				return 1;
			}
			else if(t1[t1p] < t2[t2p]) {
				return -1;
			}
			t1p++;
			t2p++;
		}
		return 0;
	}

	/**
	 * ASCIIコード配列の同士をCompareする
	 * @param {Array<number>} t1 - ASCIIコードの配列（比較元）
	 * @param {Array<number>} t2 - ASCIIコードの配列（比較先）
	 * @returns {number} Compare結果
	 */
	static compareText(t1, t2) {
		const l1 = t1.length;
		const l2 = t2.length;
		if((l1 === 0) && (l2 === 0)) {
			return 0;
		}
		if(l1 === 0) {
			return -1;
		}
		if(l2 === 0) {
			return 1;
		}
		//この地点で両方とも長さが1より大きい
		let t1off = 0;
		let t2off = 0;
		while(t1off <= l1 && t2off <= l2) {
			const t1isnum = ComparatorTool.isNumberAscii(t1[t1off]);
			const t2isnum = ComparatorTool.isNumberAscii(t2[t2off]);
			//文字目の種類が違う
			if(t1isnum !== t2isnum) {
				if(t1isnum) {
					return -1;//数値が前
				}
				else {
					return 1;//文字が後ろ
				}
			}
			//両方とも数値
			if(t1isnum) {
				const t1size = ComparatorTool.getNumberAsciiLength(t1, t1off);
				const t2size = ComparatorTool.getNumberAsciiLength(t2, t2off);
				const r = ComparatorTool.compareNumber(t1,t1off,t1size,t2,t2off,t2size);
				if(r !== 0) {
					return r;
				}
				t1off += t1size;
				t2off += t2size;
			}
			//両方とも文字列
			else {
				if(t1[t1off] > t2[t2off]) {
					return 1;
				}
				else if(t1[t1off] < t2[t2off]) {
					return -1;
				}
				t1off++;
				t2off++;
			}
			//両方ともオーバー
			if((t1off >= l1)&&(t2off >= l2)) {
				//長さも等しい
				if(l1 === l2) {
					return 0;
				}
				else if(l1 > l2) {
					return 1;
				}
				else {
					return -1;
				}
			}
			//片方のほうがサイズが大きい
			else if(t2off >= l2) { //t2の方が短い
				return 1;
			}
			else if(t1off >= l1) { //t1の方が短い
				return -1;
			}
		}
		// ※ここには達成しない
		return 0;
	}

	/**
	 * 2つの文字列を比較する
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static compareToForDefault(a, b) {
		if(a === b) {
			return 0;
		}
		if(typeof a === typeof b) {
			return (a < b ? -1 : 1);
		}
		return ((typeof a < typeof b) ? -1 : 1);
	}

	/**
	 * 2つの文字列を自然順に比較を行う（自然順ソート（Natural Sort）用）
	 * - 入力引数は文字列化して比較します
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static compareToForNatural(a, b) {
		if((a.toString === undefined) || (b.toString === undefined)) {
			return 0;
		}
		const a_str = Unicode.toUTF16Array(ComparatorTool.toNormalizeString(a.toString()));
		const b_str = Unicode.toUTF16Array(ComparatorTool.toNormalizeString(b.toString()));
		return ComparatorTool.compareText(a_str, b_str);
	}

}

/**
 * 日本語の文字列比較用の関数
 * - sortの引数で利用できます
 * @ignore
 */
const StringComparator = {

	/**
	 * 2つの文字列を比較する関数
	 * @type {function(any, any): number}
	 */
	DEFAULT : ComparatorTool.compareToForDefault,

	/**
	 * 2つの文字列を自然順ソートで比較する関数
	 * - 入力引数は文字列化して比較します
	 * 
	 * @type {function(any, any): number}
	 */
	NATURAL : ComparatorTool.compareToForNatural

};

/**
 * The script is part of jptext.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * 日本語を扱うための様々な機能を提供します
 */
class MojiJS {

	// ---------------------------------
	// 文字列のエンコードとデコードを扱う関数
	// ---------------------------------

	/**
	 * 文字列からバイナリ配列にエンコードする
	 * @param {String} text - 変換したいテキスト
	 * @param {String} charset - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
	 * @param {boolean} [is_with_bom=false] - BOMをつけるかどうか
	 * @returns {Array<number>} バイナリ配列(失敗時はnull)
	 */
	static encode(text, charset, is_with_bom) {
		return Encode.encode(text, charset, is_with_bom);
	}

	/**
	 * バイナリ配列から文字列にデコードする
	 * @param {Array<number>} binary - 変換したいバイナリ配列
	 * @param {String} [charset="autodetect"] - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
	 * @returns {String} 変換した文字列（失敗したらnull）
	 */
	static decode(binary, charset) {
		return Encode.decode(binary, charset);
	}

	// ---------------------------------
	// Unicode を扱う関数群
	// ---------------------------------
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text - 対象テキスト
	 * @param {Number} [index = 0] - インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointAt(text, index) {
		return Unicode.codePointAt(text, index);
	}

	/**
	 * コードポイントの数値データを文字列に変換
	 * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
	 * @returns {String} 変換後のテキスト
	 */
	static fromCodePoint(codepoint) {
		if(codepoint instanceof Array) {
			return Unicode.fromCodePoint(codepoint);
		}
		else {
			const codepoint_array = [];
			for(let i = 0;i < arguments.length;i++) {
				codepoint_array[i] = arguments[i];
			}
			return Unicode.fromCodePoint(codepoint_array);
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
		return Unicode.codePointCount(text, beginIndex, endIndex);
	}

	/**
	 * 文字列をUTF32(コードポイント)の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
	 */
	static toUTF32Array(text) {
		return Unicode.toUTF32Array(text);
	}

	/**
	 * UTF32の配列から文字列に変換
	 * @param {Array<number>} utf32 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF32Array(utf32) {
		return Unicode.fromUTF32Array(utf32);
	}

	/**
	 * 文字列をUTF16の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF16のデータが入った配列
	 */
	static toUTF16Array(text) {
		return Unicode.toUTF16Array(text);
	}

	/**
	 * UTF16の配列から文字列に変換
	 * @param {Array<number>} utf16 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF16Array(utf16) {
		return Unicode.fromUTF16Array(utf16);
	}

	/**
	 * 文字列をUTF8の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF8のデータが入った配列
	 */
	static toUTF8Array(text) {
		return Unicode.toUTF8Array(text);
	}

	/**
	 * UTF8の配列から文字列に変換
	 * @param {Array<number>} utf8 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF8Array(utf8) {
		return Unicode.fromUTF8Array(utf8);
	}

	// ---------------------------------
	// 文字を扱う関数群
	// ---------------------------------

	/**
	 * 異体字セレクタと結合文字を考慮して文字列を文字の配列に変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<Array<number>>} UTF32(コードポイント)の配列が入った配列
	 */
	static toMojiArrayFromString(text) {
		return Japanese.toMojiArrayFromString(text);
	}

	/**
	 * 異体字セレクタと結合文字を考慮して文字列を文字の配列に変換する
	 * @param {Array<Array<number>>} mojiarray - UTF32(コードポイント)の配列が入った配列
	 * @returns {string} UTF32(コードポイント)の配列が入った配列
	 */
	static toStringFromMojiArray(mojiarray) {
		return Japanese.toStringFromMojiArray(mojiarray);
	}

	// ---------------------------------
	// 切り出しを扱う関数群
	// ---------------------------------

	/**
	 * 指定したテキストを切り出す
	 * - 単位はコードポイントの文字数
	 * - 結合文字と異体字セレクタを区別しません
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCodePoint(text, offset, size) {
		return Unicode.cutTextForCodePoint(text, offset, size);
	}

	/**
	 * 指定したテキストの横幅を半角／全角でカウント
	 * - 結合文字と異体字セレクタは、0としてカウントします。
	 * - 半角は1としてカウントします。これらは、ASCII文字、半角カタカナとします。
	 * - 全角は2としてカウントします。上記以外を全角として処理します。
	 * @param {String} text - カウントしたいテキスト
	 * @returns {Number} 文字の横幅
	 */
	static getWidth(text) {
		return Japanese.getWidth(text);
	}

	/**
	 * 指定したテキストを切り出す
	 * - 結合文字と異体字セレクタは、0としてカウントします。
	 * - 半角は1としてカウントします。これらは、ASCII文字、半角カタカナとします。
	 * - 全角は2としてカウントします。上記以外を全角として処理します。
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForWidth(text, offset, size) {
		return Japanese.cutTextForWidth(text, offset, size);
	}

	
	// ---------------------------------
	// 面区点コードの変換用
	// ---------------------------------

	/**
	 * 指定した文字から Windows-31J 上の区点番号に変換
	 * - 2文字以上を指定した場合は、1文字目のみを変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {import("./encode/SJIS.js").MenKuTen} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTen(text) {
		return CP932.toKuTen(text);
	}
	
	/**
	 * Windows-31J 上の区点番号から文字列に変換
	 * @param {import("./encode/SJIS.js").MenKuTen|string} kuten - 区点番号
	 * @returns {String} 変換後のテキスト
	 */
	static fromKuTen(kuten) {
		return CP932.fromKuTen(kuten);
	}

	/**
	 * 指定した文字から Shift_JIS-2004 上の面区点番号に変換
	 * - 2文字以上を指定した場合は、1文字目のみを変換する
	 * @param {String} text - 変換したいテキスト
	 * @returns {import("./encode/SJIS.js").MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTen(text) {
		return SJIS2004.toMenKuTen(text);
	}
	
	/**
	 * Shift_JIS-2004 上の面区点番号から文字列に変換
	 * @param {import("./encode/SJIS.js").MenKuTen|string} menkuten - 面区点番号
	 * @returns {String} 変換後のテキスト
	 */
	static fromMenKuTen(menkuten) {
		return SJIS2004.fromMenKuTen(menkuten);
	}

	// ---------------------------------
	// 日本語の変換用の関数群
	// ---------------------------------

	/**
	 * カタカナをひらがなに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiragana(text) {
		return Japanese.toHiragana(text);
	}

	/**
	 * ひらがなをカタカナに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakana(text) {
		return Japanese.toKatakana(text);
	}
	
	/**
	 * スペースを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthSpace(text) {
		return Japanese.toHalfWidthSpace(text);
	}
	
	/**
	 * スペースを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthSpace(text) {
		return Japanese.toFullWidthSpace(text);
	}
	
	/**
	 * 英数記号を半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAsciiCode(text) {
		return Japanese.toHalfWidthAsciiCode(text);
	}
	
	/**
	 * 英数記号を全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAsciiCode(text) {
		return Japanese.toFullWidthAsciiCode(text);
	}
	
	/**
	 * アルファベットを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAlphabet(text) {
		return Japanese.toHalfWidthAlphabet(text);
	}
	
	/**
	 * アルファベットを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAlphabet(text) {
		return Japanese.toFullWidthAlphabet(text);
	}
	
	/**
	 * 数値を半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthNumber(text) {
		return Japanese.toHalfWidthNumber(text);
	}
	
	/**
	 * 数値を全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthNumber(text) {
		return Japanese.toFullWidthNumber(text);
	}
	
	/**
	 * カタカナを半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthKana(text) {
		return Japanese.toHalfWidthKana(text);
	}

	/**
	 * カタカナを全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthKana(text) {
		return Japanese.toFullWidthKana(text);
	}
	
	/**
	 * 半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidth(text) {
		return Japanese.toHalfWidth(text);
	}
	
	/**
	 * 全角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidth(text) {
		return Japanese.toFullWidth(text);
	}

	/**
	 * ローマ字からひらがなに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiraganaFromRomaji(text) {
		return Japanese.toHiraganaFromRomaji(text);
	}

	/**
	 * ローマ字からカタカナに変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakanaFromRomaji(text) {
		return Japanese.toKatakanaFromRomaji(text);
	}

	/**
	 * ひらがなからローマ字に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toRomajiFromHiragana(text) {
		return Japanese.toRomajiFromHiragana(text);
	}

	/**
	 * カタカナからローマ字に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toRomajiFromKatakana(text) {
		return Japanese.toRomajiFromKatakana(text);
	}

	// ---------------------------------
	// 1つの文字データに対して調査を行う
	// ---------------------------------

	/**
	 * 指定した1つの文字に関して、解析を行い情報を返します
	 * @param {Number} unicode_codepoint - UTF-32 のコードポイント
	 * @returns {import("./tools/MojiAnalyzer.js").MojiData} 文字の情報がつまったオブジェクト
	 */
	static getMojiData(unicode_codepoint) {
		return MojiAnalyzer.getMojiData(unicode_codepoint);
	}

	// ---------------------------------
	// 比較関数
	// ---------------------------------

	/**
	 * 2つの文字列を比較する関数
	 * - sortの引数で利用できます
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static compareToForDefault(a, b) {
		return StringComparator.DEFAULT(a, b);
	}
	
	/**
	 * 2つの文字列を自然順ソートで比較する関数
	 * - sortの引数で利用できます
	 * - 入力引数は文字列化して比較します
	 * 
	 * @param {any} a - 比較元
	 * @param {any} b - 比較先
	 * @returns {number} Compare結果
	 */
	static compareToForNatural(a, b) {
		return StringComparator.NATURAL(a, b);
	}

}

export default MojiJS;
