/**
 * The script is part of jptext.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Unicode from "./encode/Unicode.js";
import SJIS from "./encode/SJIS.js";
import CP932 from "./encode/CP932.js";
import SJIS2004 from "./encode/SJIS2004.js";
import Japanese from "./language/Japanese.js";
import CharacterAnalyser, { CharacterAnalysisData } from "./tools/CharacterAnalyser.js";
import StringComparator from "./tools/StringComparator.js";

/**
 * 日本語を扱うための様々な機能を提供します
 */
export default class mojijs {
	
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

	/**
	 * 指定したテキストを切り出す
	 * - 単位は文字数
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCodePoint(text, offset, size) {
		return Unicode.cutTextForCodePoint(text, offset, size);
	}

	/**
	 * 指定した Shift_JIS-2004 のコードから面区点番号に変換
	 * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
	 * @returns {import("./encode/SJIS.js").MenKuTen} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTenFromSJIS2004Code(sjis_code) {
		return SJIS.toMenKuTenFromSJIS2004Code(sjis_code);
	}
	
	/**
	 * 指定した面区点番号から Shift_JIS-2004 コードに変換
	 * @param {import("./encode/SJIS.js").MenKuTen|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Number} Shift_JIS-2004 のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJIS2004CodeFromMenKuTen(menkuten) {
		return SJIS.toSJIS2004CodeFromMenKuTen(menkuten);
	}

	/**
	 * 指定した Shift_JIS のコードから区点番号に変換
	 * @param {Number} sjis_code - Shift_JIS のコードポイント
	 * @returns {import("./encode/SJIS.js").MenKuTen} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTenFromSJISCode(sjis_code) {
		return SJIS.toKuTenFromSJISCode(sjis_code);
	}

	/**
	 * 指定した区点番号から Shift_JIS コードに変換
	 * @param {import("./encode/SJIS.js").MenKuTen|string} kuten - 面区点番号
	 * @returns {Number} Shift_JIS のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJISCodeFromKuTen(kuten) {
		return SJIS.toSJISCodeFromKuTen(kuten);
	}
	
	/**
	 * Shift_JIS のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
	 * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
	 * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
	 */
	static toJISKanjiSuijunFromSJISCode(sjis_code) {
		return SJIS.toJISKanjiSuijunFromSJISCode(sjis_code);
	}
	
	/**
	 * 指定した面区点番号から Shift_JIS の仕様上、正規な物か判定
	 * @param {import("./encode/SJIS.js").MenKuTen|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Boolean} 正規なデータは true, 不正なデータは false
	 */
	static isRegularMenKuten(menkuten) {
		return SJIS.isRegularMenKuten(menkuten);
	}
	
	/**
	 * Unicode のコードから CP932 のコードに変換
	 * @param {Number} unicode_codepoint - Unicode のコードポイント
	 * @returns {Number} CP932 のコードポイント (存在しない場合は undefined)
	 */
	static toCP932FromUnicode(unicode_codepoint) {
		return CP932.toCP932FromUnicode(unicode_codepoint);
	}

	/**
	 * CP932 のコードから Unicode のコードに変換
	 * @param {Number} cp932_codepoint - CP932 のコードポイント
	 * @returns {Number} Unicode のコードポイント (存在しない場合は undefined)
	 */
	static toUnicodeFromCP932(cp932_codepoint) {
		return CP932.toUnicodeFromCP932(cp932_codepoint);
	}
	
	/**
	 * 文字列を CP932 の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} CP932 のデータが入った配列
	 */
	static toCP932Array(text) {
		return CP932.toCP932Array(text);
	}

	/**
	 * 文字列を CP932 のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} CP932 のデータが入ったバイナリ配列
	 */
	static toCP932ArrayBinary(text) {
		return CP932.toCP932ArrayBinary(text);
	}

	/**
	 * CP932 の配列から文字列に変換
	 * @param {Array<number>} cp932 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromCP932Array(cp932) {
		return CP932.fromCP932Array(cp932);
	}

	/**
	 * 指定したテキストの横幅を CP932 で換算でカウント
	 * - 半角を1、全角を2としてカウント
	 * - CP932 の範囲にない文字は2としてカウント
	 * @param {String} text - カウントしたいテキスト
	 * @returns {Number} 文字の横幅
	 */
	static getWidthForCP932(text) {
		return CP932.getWidthForCP932(text);
	}

	/**
	 * 指定したテキストの横幅を CP932 で換算した場合の切り出し
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCP932(text, offset, size) {
		return CP932.cutTextForCP932(text, offset, size);
	}
	
	/**
	 * Unicode のコードから Shift_JIS-2004 のコードに変換
	 * @param {Number} unicode_codepoint - Unicode のコードポイント
	 * @returns {Number} Shift_JIS-2004 のコードポイント (存在しない場合は undefined)
	 */
	static toSJIS2004FromUnicode(unicode_codepoint) {
		return SJIS2004.toSJIS2004FromUnicode(unicode_codepoint);
	}

	/**
	 * Shift_JIS-2004 のコードから Unicode のコードに変換
	 * @param {Number} sjis2004_codepoint - Shift_JIS-2004 のコードポイント
	 * @returns {number|Array<number>} Unicode のコードポイント (存在しない場合は undefined)
	 */
	static toUnicodeFromSJIS2004(sjis2004_codepoint) {
		return SJIS2004.toUnicodeFromSJIS2004(sjis2004_codepoint);
	}
	
	/**
	 * 文字列を Shift_JIS-2004 の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} Shift_JIS-2004 のデータが入った配列
	 */
	static toSJIS2004Array(text) {
		return SJIS2004.toSJIS2004Array(text);
	}

	/**
	 * 文字列を Shift_JIS-2004 のバイナリ配列に変換
	 * - 日本語文字は2バイトとして、配列も2つ分、使用します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} Shift_JIS-2004 のデータが入ったバイナリ配列
	 */
	static toSJIS2004ArrayBinary(text) {
		return SJIS2004.toSJIS2004ArrayBinary(text);
	}

	/**
	 * Shift_JIS-2004 の配列から文字列に変換
	 * @param {Array<number>} sjis2004 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromSJIS2004Array(sjis2004) {
		return SJIS2004.fromSJIS2004Array(sjis2004);
	}

	/**
	 * 指定したテキストの横幅を Shift_JIS-2004 で換算でカウント
	 * - 半角を1、全角を2としてカウント
	 * - Shift_JIS-2004 の範囲にない文字は2としてカウント
	 * @param {String} text - カウントしたいテキスト
	 * @returns {Number} 文字の横幅
	 */
	static getWidthForSJIS2004(text) {
		return SJIS2004.getWidthForSJIS2004(text);
	}

	/**
	 * 指定したテキストの横幅を Shift_JIS-2004 で換算した場合の切り出し
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForSJIS2004(text, offset, size) {
		return SJIS2004.cutTextForSJIS2004(text, offset, size);
	}

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
	 * 英語を半角に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAlphabet(text) {
		return Japanese.toHalfWidthAlphabet(text);
	}
	
	/**
	 * 英語を全角に変換
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
	 * 指定した1つの文字に関して、解析を行い情報を返します
	 * @param {Number} unicode_codepoint - UTF-32 のコードポイント
	 * @returns {CharacterAnalysisData} 文字の情報がつまったオブジェクト
	 */
	static getCharacterAnalysisData(unicode_codepoint) {
		return CharacterAnalyser.getCharacterAnalysisData(unicode_codepoint);
	}

	/**
	 * 2つの文字列を比較する関数
	 * - sortの引数で利用できます
	 * @returns {function(string, string): number}
	 */
	static get COMPARE_DEFAULT() {
		return StringComparator.DEFAULT;
	}

	/**
	 * 2つの文字列を自然順ソートで比較する関数
	 * - sortの引数で利用できます
	 * @returns {function(string, string): number}
	 */
	static get COMPARE_NATURAL() {
		return StringComparator.NATURAL;
	}
	
}
