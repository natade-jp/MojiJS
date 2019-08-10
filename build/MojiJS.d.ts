/**
 * 面区点情報
 * @typedef {Object} _MenKuTen_
 * @property {string} text 面-区-点
 * @property {number} [men=1] 面
 * @property {number} ku 区
 * @property {number} ten 点
 */
declare type _MenKuTen_ = {
    text: string;
    men?: number;
    ku: number;
    ten: number;
};

/**
 * 日本語を扱うための様々な機能を提供します
 */
declare class MojiJS {
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
     * 指定した Shift_JIS-2004 のコードから面区点番号に変換
     * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
     * @returns {_MenKuTen_} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toMenKuTenFromSJIS2004Code(sjis_code: number): _MenKuTen_;
    /**
     * 指定した面区点番号から Shift_JIS-2004 コードに変換
     * @param {_MenKuTen_|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
     * @returns {Number} Shift_JIS-2004 のコードポイント(存在しない場合はnullを返す)
     */
    static toSJIS2004CodeFromMenKuTen(menkuten: any): number;
    /**
     * 指定した Shift_JIS のコードから区点番号に変換
     * @param {Number} sjis_code - Shift_JIS のコードポイント
     * @returns {_MenKuTen_} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
     */
    static toKuTenFromSJISCode(sjis_code: number): _MenKuTen_;
    /**
     * 指定した区点番号から Shift_JIS コードに変換
     * @param {_MenKuTen_|string} kuten - 面区点番号
     * @returns {Number} Shift_JIS のコードポイント(存在しない場合はnullを返す)
     */
    static toSJISCodeFromKuTen(kuten: any): number;
    /**
     * Shift_JIS のコードポイントからJIS漢字水準（JIS Chinese character standard）に変換
     * @param {Number} sjis_code - Shift_JIS-2004 のコードポイント
     * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
     */
    static toJISKanjiSuijunFromSJISCode(sjis_code: number): number;
    /**
     * 指定した面区点番号から Shift_JIS の仕様上、正規な物か判定
     * @param {_MenKuTen_|string} menkuten - 面区点番号（面が省略された場合は、1とみなす）
     * @returns {Boolean} 正規なデータは true, 不正なデータは false
     */
    static isRegularMenKuten(menkuten: any): boolean;
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
     * @returns {Array<number>} _CP932_ のデータが入った配列
     */
    static toCP932Array(text: string): number[];
    /**
     * 文字列を _CP932_ のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} _CP932_ のデータが入ったバイナリ配列
     */
    static toCP932ArrayBinary(text: string): number[];
    /**
     * _CP932_ の配列から文字列に変換
     * @param {Array<number>} cp932 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromCP932Array(cp932: number[]): string;
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
     * @returns {Array<number>} Shift_JIS-2004 のデータが入った配列
     */
    static toSJIS2004Array(text: string): number[];
    /**
     * 文字列を Shift_JIS-2004 のバイナリ配列に変換
     * - 日本語文字は2バイトとして、配列も2つ分、使用します。
     * @param {String} text - 変換したいテキスト
     * @returns {Array<number>} Shift_JIS-2004 のデータが入ったバイナリ配列
     */
    static toSJIS2004ArrayBinary(text: string): number[];
    /**
     * Shift_JIS-2004 の配列から文字列に変換
     * @param {Array<number>} sjis2004 - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static fromSJIS2004Array(sjis2004: number[]): string;
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
     * 英語を半角に変換
     * @param {String} text - 変換したいテキスト
     * @returns {String} 変換後のテキスト
     */
    static toHalfWidthAlphabet(text: string): string;
    /**
     * 英語を全角に変換
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
    static COMPARE_DEFAULT: function(string, string): number;
    /**
     * 2つの文字列を自然順ソートで比較する関数
     * - sortの引数で利用できます
     * @returns {function(string, string): number}
     */
    static COMPARE_NATURAL: function(string, string): number;
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

