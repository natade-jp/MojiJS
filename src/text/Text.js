/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import Unicode from "./encode/Unicode.js";
import CP932 from "./encode/CP932.js";
import Japanese from "./language/Japanese.js";
import Programming from "./language/Programming.js";
import Format from "./tools/Format.js";

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
	
	CP932 : CP932,
	toCP932Array : CP932.toCP932Array,
	toCP932ArrayBinary : CP932.toCP932ArrayBinary,
	fromCP932Array : CP932.fromCP932Array,
	getWidthForCP932 : CP932.getWidthForCP932,
	cutTextForCP932 : CP932.cutTextForCP932,

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

	Programming : Programming,
	removeComment : Programming.removeComment,
	
	Format : Format,
	format : Format.format
	
};

export default Text;