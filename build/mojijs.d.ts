/**
 * _CP932_, Windows-31J を扱うクラス
 */
declare class _CP932_ {
    /**
     * _Unicode_ のコードから _CP932_ のコードに変換
     * @param {Number} unicode_codepoint - _Unicode_ のコードポイント
     * @returns {Number} _CP932_ のコードポイント (存在しない場合は undefined)
     */
    static toCP932FromUnicode(unicode_codepoint: number): number;
    /**
     * _CP932_ のコードから _Unicode_ のコードに変換
     * @param {Number} cp932_codepoint - _CP932_ のコードポイント
     * @returns {Number} _Unicode_ のコードポイント (存在しない場合は undefined)
     */
    static toUnicodeFromCP932(cp932_codepoint: number): number;
    /**
     * 文字列を _CP932_ の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {{encode : Array<number>, ng_count : number}} _CP932_ のデータが入った配列
     */
    static toCP932Array(text: string): {encode : Array<number>, ng_count : number};
    /**
     * 文字列を _CP932_ のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} _CP932_ のデータが入ったバイナリ配列
     */
    static toCP932Binary(text: string): number[];
    /**
     * _CP932_ の配列から文字列に変換
     * @param {Array<number>} cp932 - 変換したいテキスト
     * @returns {{decode : String, ng_count : number}} 変換後のテキスト
     */
    static fromCP932Array(cp932: number[]): {decode : String, ng_count : number};
    /**
     * 指定したテキストの横幅を _CP932_ で換算でカウント
     * - 半角を1、全角を2としてカウント
     * - _CP932_ の範囲にない文字は2としてカウント
     * @param {String} text - カウントしたいテキスト
     * @returns {Number} 文字の横幅
     */
    static getWidthForCP932(text: string): number;
    /**
     * 指定したテキストの横幅を _CP932_ で換算した場合の切り出し
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForCP932(text: string, offset: number, size: number): string;
}

/**
 * EUC-JP を扱うクラス
 */
declare class _EUCJP_ {
    /**
     * 文字列を EUC-JP のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} EUC-JP(CP51932) のデータが入ったバイナリ配列
     */
    static toEUCJPBinary(text: string): number[];
    /**
     * EUC-JP の配列から文字列に変換
     * @param {Array<number>} eucjp - 変換したいテキスト
     * @returns {{decode : String, ng_count : number}} 変換後のテキスト
     */
    static fromEUCJPBinary(eucjp: number[]): {decode : String, ng_count : number};
    /**
     * 文字列を EUC-JIS-2004 のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} EUC-JIS-2004 のデータが入ったバイナリ配列
     */
    static toEUCJIS2004Binary(text: string): number[];
    /**
     * EUC-JIS-2004 の配列から文字列に変換
     * @param {Array<number>} eucjp - 変換したいテキスト
     * @returns {{decode : String, ng_count : number}} 変換後のテキスト
     */
    static fromEUCJIS2004Binary(eucjp: number[]): {decode : String, ng_count : number};
}

/**
 * 面区点情報
 * @typedef {Object} _MenKuTen_
 * @property {string} [text] 面-区-点
 * @property {number} [men=1] 面
 * @property {number} ku 区
 * @property {number} ten 点
 */
declare type _MenKuTen_ = {
    text?: string;
    men?: number;
    ku: number;
    ten: number;
};

/**
 * Shift_JIS を扱うクラス
 */
declare class _SJIS_ {
    /**
     * 文字列を Shift_JIS の配列に変換
     * @param {String} text - 変換したいテキスト
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {{encode : Array<number>, ng_count : number}} Shift_JIS のデータが入った配列
     */
    static toSJISArray(text: string, unicode_to_sjis: {
        [key: number]: number;
    }): any;
    /**
     * 文字列を Shift_JIS のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {Array<number>} Shift_JIS のデータが入ったバイナリ配列
     */
    static toSJISBinary(text: string, unicode_to_sjis: {
        [key: number]: number;
    }): number[];
    /**
     * _SJIS_の配列から文字列に変換
     * @param {Array<number>} sjis - 変換したいテキスト
     * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS から _Unicode_ への変換マップ
     * @returns {{decode : String, ng_count : number}} 変換後のテキスト
     */
    static fromSJISArray(sjis: number[], sjis_to_unicode: {
        [key: number]: number | number[];
    }): any;
    /**
     * 指定したテキストの横幅を Shift_JIS で換算でカウント
     * - 半角を1、全角を2としてカウント
     * - Shift_JIS の範囲にない文字は2としてカウント
     * @param {String} text - カウントしたいテキスト
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {Number} 文字の横幅
     */
    static getWidthForSJIS(text: string, unicode_to_sjis: {
        [key: number]: number;
    }): number;
    /**
     * 指定したテキストの横幅を _CP932_ で換算した場合の切り出し
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS から _Unicode_ への変換マップ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForSJIS(text: string, offset: number, size: number, unicode_to_sjis: {
        [key: number]: number;
    }, sjis_to_unicode: {
        [key: number]: number | number[];
    }): string;
    /**
     * 指定したコードポイントの文字から Shift_JIS 上の符号化数値に変換
     * @param {Number} unicode_codepoint - _Unicode_のコードポイント
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {Number} 符号化数値(変換できない場合はnullとなる)
     */
    static toSJISCodeFromUnicode(unicode_codepoint: number, unicode_to_sjis: {
        [key: number]: number;
    }): number;
    /**
     * 指定した Shift_JIS-2004 のコードから面区点番号に変換
     * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
     * @returns {_MenKuTen_} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toMenKuTenFromSJIS2004Code(sjis_code: number): _MenKuTen_;
    /**
     * 指定したコードポイントの文字から Shift_JIS-2004 上の面区点番号に変換
     * @param {Number} unicode_codepoint - _Unicode_のコードポイント
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS-2004 への変換マップ
     * @returns {_MenKuTen_} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toMenKuTenFromUnicode(unicode_codepoint: number, unicode_to_sjis: {
        [key: number]: number;
    }): _MenKuTen_;
    /**
     * 指定した面区点番号から Shift_JIS-2004 コードに変換
     * @param {_MenKuTen_|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
     * @returns {Number} Shift_JIS-2004 のコードポイント(存在しない場合はnullを返す)
     */
    static toSJIS2004CodeFromMenKuTen(menkuten: _MenKuTen_ | string): number;
    /**
     * 指定した面区点番号から _Unicode_ コードポイントに変換
     * @param {_MenKuTen_|string} menkuten - 面区点番号
     * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS-2004 から _Unicode_ への変換マップ
     * @returns {Array<number>} UTF-32の配列(存在しない場合はnullを返す)
     */
    static toUnicodeCodeFromMenKuTen(menkuten: _MenKuTen_ | string, sjis_to_unicode: {
        [key: number]: number | number[];
    }): number[];
    /**
     * 指定した Shift_JIS のコードから区点番号に変換
     * @param {Number} sjis_code - Shift_JIS のコードポイント
     * @returns {_MenKuTen_} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toKuTenFromSJISCode(sjis_code: number): _MenKuTen_;
    /**
     * 指定したコードポイントの文字から Shift_JIS 上の面区点番号に変換
     * @param {Number} unicode_codepoint - _Unicode_のコードポイント
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {Object} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toKuTenFromUnicode(unicode_codepoint: number, unicode_to_sjis: {
        [key: number]: number;
    }): any;
    /**
     * 指定した面区点番号／区点番号から Shift_JIS コードに変換
     * @param {_MenKuTen_|string} kuten - 面区点番号／区点番号
     * @returns {Number} Shift_JIS のコードポイント(存在しない場合はnullを返す)
     */
    static toSJISCodeFromKuTen(kuten: _MenKuTen_ | string): number;
    /**
     * 指定した区点番号から _Unicode_ コードポイントに変換
     * @param {_MenKuTen_|string} kuten - 区点番号
     * @param {Object<number, number|Array<number>>} sjis_to_unicode - Shift_JIS-2004 から _Unicode_ への変換マップ
     * @returns {Array<number>} UTF-32の配列(存在しない場合はnullを返す)
     */
    static toUnicodeCodeFromKuTen(kuten: _MenKuTen_ | string, sjis_to_unicode: {
        [key: number]: number | number[];
    }): number[];
    /**
     * Shift_JIS のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
     * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
     * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
     */
    static toJISKanjiSuijunFromSJISCode(sjis_code: number): number;
    /**
     * _Unicode_ のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
     * @param {Number} unicode_codepoint - _Unicode_のコードポイント
     * @param {Object<number, number>} unicode_to_sjis - _Unicode_ から Shift_JIS への変換マップ
     * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
     */
    static toJISKanjiSuijunFromUnicode(unicode_codepoint: number, unicode_to_sjis: {
        [key: number]: number;
    }): number;
    /**
     * 指定した面区点番号から Shift_JIS の仕様上、正規な物か判定
     * @param {_MenKuTen_|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
     * @returns {Boolean} 正規なデータは true, 不正なデータは false
     */
    static isRegularMenKuten(menkuten: _MenKuTen_ | string): boolean;
}

/**
 * Shift_JIS-2004 を扱うクラス
 */
declare class _SJIS2004_ {
    /**
     * _Unicode_ のコードから Shift_JIS-2004 のコードに変換
     * @param {Number} unicode_codepoint - _Unicode_ のコードポイント
     * @returns {Number} Shift_JIS-2004 のコードポイント (存在しない場合は undefined)
     */
    static toSJIS2004FromUnicode(unicode_codepoint: number): number;
    /**
     * Shift_JIS-2004 のコードから _Unicode_ のコードに変換
     * @param {Number} sjis2004_codepoint - Shift_JIS-2004 のコードポイント
     * @returns {number|Array<number>} _Unicode_ のコードポイント (存在しない場合は undefined)
     */
    static toUnicodeFromSJIS2004(sjis2004_codepoint: number): number | number[];
    /**
     * 文字列を Shift_JIS-2004 の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {{encode : Array<number>, ng_count : number}} Shift_JIS-2004 のデータが入った配列
     */
    static toSJIS2004Array(text: string): {encode : Array<number>, ng_count : number};
    /**
     * 文字列を Shift_JIS-2004 のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} Shift_JIS-2004 のデータが入ったバイナリ配列
     */
    static toSJIS2004Binary(text: string): number[];
    /**
     * Shift_JIS-2004 の配列から文字列に変換
     * @param {Array<number>} sjis2004 - 変換したいテキスト
     * @returns {{decode : String, ng_count : number}} 変換後のテキスト
     */
    static fromSJIS2004Array(sjis2004: number[]): {decode : String, ng_count : number};
    /**
     * 指定したテキストの横幅を Shift_JIS-2004 で換算でカウント
     * - 半角を1、全角を2としてカウント
     * - Shift_JIS-2004 の範囲にない文字は2としてカウント
     * @param {String} text - カウントしたいテキスト
     * @returns {Number} 文字の横幅
     */
    static getWidthForSJIS2004(text: string): number;
    /**
     * 指定したテキストの横幅を Shift_JIS-2004 で換算した場合の切り出し
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForSJIS2004(text: string, offset: number, size: number): string;
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
 * _Unicode_ を扱うクラス
 */
declare class _Unicode_ {
    /**
     * 上位のサロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {Number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isHighSurrogateAt(text: string, index: number): boolean;
    /**
     * 下位のサロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {Number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isLowSurrogateAt(text: string, index: number): boolean;
    /**
     * サロゲートペアの判定
     * @param {String} text - 対象テキスト
     * @param {Number} index - インデックス
     * @returns {Boolean} 確認結果
     */
    static isSurrogatePairAt(text: string, index: number): boolean;
    /**
     * サロゲートペア対応のコードポイント取得
     * @param {String} text - 対象テキスト
     * @param {Number} [index = 0] - インデックス
     * @returns {Number} コードポイント
     */
    static codePointAt(text: string, index?: number): number;
    /**
     * インデックスの前にあるコードポイント
     * @param {String} text - 対象テキスト
     * @param {Number} index - インデックス
     * @returns {Number} コードポイント
     */
    static codePointBefore(text: string, index: number): number;
    /**
     * コードポイント換算で文字列数をカウント
     * @param {String} text - 対象テキスト
     * @param {Number} [beginIndex=0] - 最初のインデックス（省略可）
     * @param {Number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
     * @returns {Number} 文字数
     */
    static codePointCount(text: string, beginIndex?: number, endIndex?: number): number;
    /**
     * コードポイント換算で文字列配列の位置を計算
     * @param {String} text - 対象テキスト
     * @param {Number} index - オフセット
     * @param {Number} codePointOffset - ずらすコードポイント数
     * @returns {Number} ずらしたインデックス
     */
    static offsetByCodePoints(text: string, index: number, codePointOffset: number): number;
    /**
     * コードポイントの数値データをUTF16の配列に変換
     * @param {...(number|Array<number>)} codepoint - 変換したいUTF-32の配列、又はコードポイントを並べた可変引数
     * @returns {Array<number>} 変換後のテキスト
     */
    static toUTF16ArrayfromCodePoint(...codepoint: (number | number[])[]): number[];
    /**
     * コードポイントの数値データを文字列に変換
     * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
     * @returns {String} 変換後のテキスト
     */
    static fromCodePoint(...codepoint: (number | number[])[]): string;
    /**
     * 文字列をUTF32(コードポイント)の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
     */
    static toUTF32Array(text: string): number[];
    /**
     * UTF32の配列から文字列に変換
     * @param {Array<number>} utf32 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF32Array(utf32: number[]): string;
    /**
     * 文字列をUTF16の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF16のデータが入った配列
     */
    static toUTF16Array(text: string): number[];
    /**
     * UTF16の配列から文字列に変換
     * @param {Array<number>} utf16 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF16Array(utf16: number[]): string;
    /**
     * 文字列をUTF8の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF8のデータが入った配列
     */
    static toUTF8Array(text: string): number[];
    /**
     * UTF8の配列から文字列に変換
     * @param {Array<number>} utf8 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF8Array(utf8: number[]): string;
    /**
     * 指定したテキストを切り出す
     * - 単位は文字数
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForCodePoint(text: string, offset: number, size: number): string;
    /**
     * UTFのバイナリ配列からバイトオーダーマーク(BOM)を調査する
     * @param {Array<number>} utfbinary - 調査するバイナリ配列
     * @returns {string} 符号化形式(不明時はnull)
     */
    static getCharsetFromBOM(utfbinary: number[]): string;
    /**
     * UTFのバイナリ配列からコードポイントに変換
     * @param {Array<number>} binary - 変換したいバイナリ配列
     * @param {String} [charset] - UTFの種類（省略した場合はBOM付きを期待する）
     * @returns {Array<number>} コードポイントの配列(失敗時はnull)
     */
    static toCodePointFromUTFBinary(binary: number[], charset?: string): number[];
    /**
     * UTF32配列からバイナリ配列に変換
     * @param {Array<number>} utf32_array - 変換したいUTF-32配列
     * @param {String} charset - UTFの種類
     * @param {boolean} [is_with_bom=false] - BOMをつけるかどうか
     * @returns {Array<number>} バイナリ配列(失敗時はnull)
     */
    static toUTFBinaryFromCodePoint(utf32_array: number[], charset: string, is_with_bom?: boolean): number[];
}

/**
 * 日本語を扱うための様々な機能を提供します
 */
declare class MojiJS {
    /**
     * 文字列からバイナリ配列にエンコードする
     * @param {String} text - 変換したいテキスト
     * @param {String} charset - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
     * @param {boolean} [is_with_bom=false] - BOMをつけるかどうか
     * @returns {Array<number>} バイナリ配列(失敗時はnull)
     */
    static encode(text: string, charset: string, is_with_bom?: boolean): number[];
    /**
     * バイナリ配列から文字列にデコードする
     * @param {Array<number>} binary - 変換したいバイナリ配列
     * @param {String} [charset="autodetect"] - キャラセット(UTF-8/16/32,Shift_JIS,Windows-31J,Shift_JIS-2004,EUC-JP,EUC-JP-2004)
     * @returns {String} 変換した文字列（失敗したらnull）
     */
    static decode(binary: number[], charset?: string): string;
    /**
     * サロゲートペア対応のコードポイント取得
     * @param {String} text - 対象テキスト
     * @param {Number} [index = 0] - インデックス
     * @returns {Number} コードポイント
     */
    static codePointAt(text: string, index?: number): number;
    /**
     * コードポイントの数値データを文字列に変換
     * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
     * @returns {String} 変換後のテキスト
     */
    static fromCodePoint(...codepoint: (number | number[])[]): string;
    /**
     * コードポイント換算で文字列数をカウント
     * @param {String} text - 対象テキスト
     * @param {Number} [beginIndex=0] - 最初のインデックス（省略可）
     * @param {Number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
     * @returns {Number} 文字数
     */
    static codePointCount(text: string, beginIndex?: number, endIndex?: number): number;
    /**
     * 文字列をUTF32(コードポイント)の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
     */
    static toUTF32Array(text: string): number[];
    /**
     * UTF32の配列から文字列に変換
     * @param {Array<number>} utf32 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF32Array(utf32: number[]): string;
    /**
     * 文字列をUTF16の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF16のデータが入った配列
     */
    static toUTF16Array(text: string): number[];
    /**
     * UTF16の配列から文字列に変換
     * @param {Array<number>} utf16 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF16Array(utf16: number[]): string;
    /**
     * 文字列をUTF8の配列に変換
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} UTF8のデータが入った配列
     */
    static toUTF8Array(text: string): number[];
    /**
     * UTF8の配列から文字列に変換
     * @param {Array<number>} utf8 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromUTF8Array(utf8: number[]): string;
    /**
     * 指定したテキストを切り出す
     * - 単位は文字数
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForCodePoint(text: string, offset: number, size: number): string;
    /**
     * 指定したテキストの横幅を _CP932_ で換算でカウント
     * - 半角を1、全角を2としてカウント
     * - _CP932_ の範囲にない文字は2としてカウント
     * @param {String} text - カウントしたいテキスト
     * @returns {Number} 文字の横幅
     */
    static getWidthForCP932(text: string): number;
    /**
     * 指定したテキストの横幅を _CP932_ で換算した場合の切り出し
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForCP932(text: string, offset: number, size: number): string;
    /**
     * 指定したテキストの横幅を Shift_JIS-2004 で換算でカウント
     * - 半角を1、全角を2としてカウント
     * - Shift_JIS-2004 の範囲にない文字は2としてカウント
     * @param {String} text - カウントしたいテキスト
     * @returns {Number} 文字の横幅
     */
    static getWidthForSJIS2004(text: string): number;
    /**
     * 指定したテキストの横幅を Shift_JIS-2004 で換算した場合の切り出し
     * @param {String} text - 切り出したいテキスト
     * @param {Number} offset - 切り出し位置
     * @param {Number} size - 切り出す長さ
     * @returns {String} 切り出したテキスト
     */
    static cutTextForSJIS2004(text: string, offset: number, size: number): string;
    /**
     * カタカナをひらがなに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHiragana(text: string): string;
    /**
     * ひらがなをカタカナに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toKatakana(text: string): string;
    /**
     * スペースを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthSpace(text: string): string;
    /**
     * スペースを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthSpace(text: string): string;
    /**
     * 英数記号を半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthAsciiCode(text: string): string;
    /**
     * 英数記号を全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthAsciiCode(text: string): string;
    /**
     * アルファベットを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthAlphabet(text: string): string;
    /**
     * アルファベットを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthAlphabet(text: string): string;
    /**
     * 数値を半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthNumber(text: string): string;
    /**
     * 数値を全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthNumber(text: string): string;
    /**
     * カタカナを半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthKana(text: string): string;
    /**
     * カタカナを全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidthKana(text: string): string;
    /**
     * 半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidth(text: string): string;
    /**
     * 全角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toFullWidth(text: string): string;
    /**
     * ローマ字からひらがなに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHiraganaFromRomaji(text: string): string;
    /**
     * ローマ字からカタカナに変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toKatakanaFromRomaji(text: string): string;
    /**
     * ひらがなからローマ字に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toRomajiFromHiragana(text: string): string;
    /**
     * カタカナからローマ字に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toRomajiFromKatakana(text: string): string;
    /**
     * 指定した1つの文字に関して、解析を行い情報を返します
     * @param {Number} unicode_codepoint - UTF-32 のコードポイント
     * @returns {_MojiData_} 文字の情報がつまったオブジェクト
     */
    static getMojiData(unicode_codepoint: number): _MojiData_;
    /**
     * 2つの文字列を比較する関数
     * - sortの引数で利用できます
     * @returns {function(string, string): number}
     */
    static COMPARE_DEFAULT: any;
    /**
     * 2つの文字列を自然順ソートで比較する関数
     * - sortの引数で利用できます
     * @returns {function(string, string): number}
     */
    static COMPARE_NATURAL: any;
    /**
     * _Unicode_専用の内部関数を利用する
     * @returns {typeof _Unicode_}
     */
    static Unicode: typeof _Unicode_;
    /**
     * Shift_JIS専用の内部関数を利用する
     * @returns {typeof _SJIS_}
     */
    static SJIS: typeof _SJIS_;
    /**
     * _CP932_専用の内部関数を利用する
     * @returns {typeof _CP932_}
     */
    static CP932: typeof _CP932_;
    /**
     * Shift_JIS-2004専用の内部関数を利用する
     * @returns {typeof _SJIS2004_}
     */
    static SJIS2004: typeof _SJIS2004_;
    /**
     * EUC-JP専用の内部関数を利用する
     * @returns {typeof _EUCJP_}
     */
    static EUCJP: typeof _EUCJP_;
}

/**
 * 文字のエンコード情報
 * @typedef {Object} _MojiEncodeData_
 * @property {_MenKuTen_} kuten 区点 コード
 * @property {_MenKuTen_} menkuten 面区点 コード
 * @property {number} cp932_code _CP932_(Windows-31J) コード
 * @property {number} sjis2004_code Shift_JIS-2004 コード
 * @property {Array<number>} utf8_array UTF-8 配列
 * @property {Array<number>} utf16_array UTF-16 配列
 * @property {Array<number>} utf32_array UTF-32 配列
 * @property {Array<number>} cp932_array _CP932_(Windows-31J) バイト配列
 * @property {Array<number>} sjis2004_array Shift_JIS-2004 コード バイト配列
 * @property {Array<number>} shift_jis_array Shift_JIS バイト配列
 * @property {Array<number>} iso2022jp_array ISO-2022-JP バイト配列
 * @property {Array<number>} eucjp_array EUC-JP バイト配列
 */
declare type _MojiEncodeData_ = {
    cp932_code: number;
    sjis2004_code: number;
    utf8_array: number[];
    utf16_array: number[];
    utf32_array: number[];
    cp932_array: number[];
    sjis2004_array: number[];
    shift_jis_array: number[];
    iso2022jp_array: number[];
    eucjp_array: number[];
};

/**
 * 文字の種別情報
 * @typedef {Object} _MojiTypeData_
 * @property {boolean} is_regular_sjis Shift_JIS に登録された文字
 * @property {boolean} is_regular_sjis2004 Shift_JIS-2004 に登録された文字
 * @property {boolean} is_joyo_kanji 常用漢字
 * @property {boolean} is_jinmeiyo_kanji 人名用漢字
 * @property {boolean} is_gaiji_cp932 Windows-31J(_CP932_) 外字
 * @property {boolean} is_IBM_extended_character Windows-31J(_CP932_) IBM拡張文字
 * @property {boolean} is_NEC_selection_IBM_extended_character Windows-31J(_CP932_) NEC選定IBM拡張文字
 * @property {boolean} is_NEC_special_character Windows-31J(_CP932_) NEC特殊文字
 * @property {number} kanji_suijun Shift_JIS-2004 を使用して漢字の水準調査(1未満だと水準調査失敗)
 * @property {boolean} is_surrogate_pair 要 _Unicode_ サロゲートペア
 * @property {string} control_name 制御文字名（制御文字ではない場合は null）
 * @property {boolean} is_control_charcter 制御文字
 * @property {string} blockname _Unicode_ブロック名
 * @property {boolean} is_kanji 漢字
 * @property {boolean} is_hiragana ひらがな
 * @property {boolean} is_katakana カタカナ
 * @property {boolean} is_fullwidth_ascii 全角ASCII
 * @property {boolean} is_halfwidth_katakana 半角カタカナ
 * @property {boolean} is_emoji 絵文字
 * @property {boolean} is_emoticons 顔文字
 * @property {boolean} is_gaiji 外字
 */
declare type _MojiTypeData_ = {
    is_regular_sjis: boolean;
    is_regular_sjis2004: boolean;
    is_joyo_kanji: boolean;
    is_jinmeiyo_kanji: boolean;
    is_gaiji_cp932: boolean;
    is_IBM_extended_character: boolean;
    is_NEC_selection_IBM_extended_character: boolean;
    is_NEC_special_character: boolean;
    kanji_suijun: number;
    is_surrogate_pair: boolean;
    control_name: string;
    is_control_charcter: boolean;
    blockname: string;
    is_kanji: boolean;
    is_hiragana: boolean;
    is_katakana: boolean;
    is_fullwidth_ascii: boolean;
    is_halfwidth_katakana: boolean;
    is_emoji: boolean;
    is_emoticons: boolean;
    is_gaiji: boolean;
};

/**
 * 文字の種別情報
 * @typedef {Object} _MojiData_
 * @property {_MojiEncodeData_} encode 文字のエンコード情報
 * @property {_MojiTypeData_} type 文字の種別情報
 * @property {string} character 解析した文字
 * @property {number} codepoint 解析した文字のコードポイント
 */
declare type _MojiData_ = {
    encode: _MojiEncodeData_;
    type: _MojiTypeData_;
    character: string;
    codepoint: number;
};

