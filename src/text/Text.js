/**
 * The script is part of SenkoJS.
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
import Programming from "./language/Programming.js";
import CharacterAnalyser from "./tools/CharacterAnalyser.js";

const Text = {
	
	Unicode : Unicode,
	isHighSurrogateAt : Unicode.isHighSurrogateAt,
	isLowSurrogateAt : Unicode.isLowSurrogateAt,
	isSurrogatePairAt : Unicode.isSurrogatePairAt,
	codePointAt : Unicode.codePointAt,
	codePointBefore : Unicode.codePointBefore,
	codePointCount : Unicode.codePointCount,
	offsetByCodePoints : Unicode.offsetByCodePoints,
	fromCodePoint : Unicode.fromCodePoint,
	toUTF32Array : Unicode.toUTF32Array,
	fromUTF32Array : Unicode.fromUTF32Array,
	toUTF16Array : Unicode.toUTF16Array,
	fromUTF16Array : Unicode.fromUTF16Array,
	toUTF8Array : Unicode.toUTF8Array,
	fromUTF8Array : Unicode.fromUTF8Array,
	cutTextForCodePoint : Unicode.cutTextForCodePoint,
	
	SJIS : SJIS,
	toSJISArray : SJIS.toSJISArray,
	toSJISArrayBinary : SJIS.toSJISArrayBinary,
	fromSJISArray : SJIS.fromSJISArray,
	getWidthForSJIS : SJIS.getWidthForSJIS,
	cutTextForSJIS : SJIS.cutTextForSJIS,
	toSJISCodeFromUnicode : SJIS.toSJISCodeFromUnicode,
	toMenKuTenFromSJIS2004Code : SJIS.toMenKuTenFromSJIS2004Code,
	toMenKuTenFromUnicode : SJIS.toMenKuTenFromUnicode,
	toSJIS2004CodeFromMenKuTen : SJIS.toSJIS2004CodeFromMenKuTen,
	toUnicodeCodeFromMenKuTen : SJIS.toUnicodeCodeFromMenKuTen,
	toKuTenFromSJISCode : SJIS.toKuTenFromSJISCode,
	toKuTenFromUnicode : SJIS.toKuTenFromUnicode,
	toSJISCodeFromKuTen : SJIS.toSJISCodeFromKuTen,
	toUnicodeCodeFromKuTen : SJIS.toUnicodeCodeFromKuTen,
	toJISKanjiSuijunFromSJISCode : SJIS.toJISKanjiSuijunFromSJISCode,
	toJISKanjiSuijunFromUnicode : SJIS.toJISKanjiSuijunFromUnicode,
	isRegularMenKuten : SJIS.isRegularMenKuten,

	CP932 : CP932,
	toCP932FromUnicode : CP932.toCP932FromUnicode,
	toUnicodeFromCP932 : CP932.toUnicodeFromCP932,
	toCP932Array : CP932.toCP932Array,
	toCP932ArrayBinary : CP932.toCP932ArrayBinary,
	fromCP932Array : CP932.fromCP932Array,
	getWidthForCP932 : CP932.getWidthForCP932,
	cutTextForCP932 : CP932.cutTextForCP932,
	toKuTen : CP932.toKuTen,

	SJIS2004 : SJIS2004,
	toSJIS2004FromUnicode : SJIS2004.toSJIS2004FromUnicode,
	toUnicodeFromSJIS2004 : SJIS2004.toUnicodeFromSJIS2004,
	toSJIS2004Array : SJIS2004.toSJIS2004Array,
	toSJIS2004ArrayBinary : SJIS2004.toSJIS2004ArrayBinary,
	fromSJIS2004Array : SJIS2004.fromSJIS2004Array,
	getWidthForSJIS2004 : SJIS2004.getWidthForSJIS2004,
	cutTextForSJIS2004 : SJIS2004.cutTextForSJIS2004,

	Japanese : Japanese,
	toHiragana : Japanese.toHiragana,
	toKatakana : Japanese.toKatakana,
	toHalfWidthSpace : Japanese.toHalfWidthSpace,
	toFullWidthSpace : Japanese.toFullWidthSpace,
	toHalfWidthAsciiCode : Japanese.toHalfWidthAsciiCode,
	toFullWidthAsciiCode : Japanese.toFullWidthAsciiCode,
	toHalfWidthAlphabet : Japanese.toHalfWidthAlphabet,
	toFullWidthAlphabet : Japanese.toFullWidthAlphabet,
	toHalfWidthNumber : Japanese.toHalfWidthNumber,
	toFullWidthNumber : Japanese.toFullWidthNumber,
	toHalfWidthKana : Japanese.toHalfWidthKana,
	toFullWidthKana : Japanese.toFullWidthKana,
	toHalfWidth : Japanese.toHalfWidth,
	toFullWidth : Japanese.toFullWidth,
	toHiraganaFromRomaji : Japanese.toHiraganaFromRomaji,
	toKatakanaFromRomaji : Japanese.toKatakanaFromRomaji,

	Programming : Programming,
	removeComment : Programming.removeComment,
	
	CharacterAnalyser : CharacterAnalyser,
	getCharacterAnalysisData : CharacterAnalyser.getCharacterAnalysisData
	
};

export default Text;
