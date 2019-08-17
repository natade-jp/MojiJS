import Unicode from "./Unicode.js";

/**
 * @param {Array} x 
 * @param {Array} y 
 * @returns {boolean}
 */
const equalsArray = function(x, y) {
	if(x.length !== y.length) {
		return false;
	}
	for(let i = 0; i < x.length; i++) {
		if(x[i] !== y[i]) {
			return false;
		}
	}
	return true;
};

{
	test("fromCodePoint 1", () => { expect(Unicode.fromCodePoint(134071, 37326, 23478 )).toBe("𠮷野家"); });
	test("fromCodePoint 2", () => { expect(Unicode.fromCodePoint([134071, 37326, 23478])).toBe("𠮷野家"); });
}

{
	test("codePointCount", () => { expect(Unicode.codePointCount("𠮷野家")).toBe(3); });
}

{
	/**
	 * @param {string} x 
	 * @returns {Array<string>}
	 */
	const toWord = function (x) {
		const ret = [];
		const len = x.length;
		for(let i = 0; i < len; i = Unicode.offsetByCodePoints(x, i, 1)) {
			ret.push(Unicode.fromCodePoint(Unicode.codePointAt(x, i)));
		}
		return ret;
	};
	test("codepoint 1", () => { expect(equalsArray(toWord("𠮷野家"), ["𠮷", "野", "家"])).toBe(true); });
}

{
	/**
	 * @param {string} x 
	 * @returns {Array<string>}
	 */
	const toWord = function (x) {
		const ret = [];
		const len = Unicode.codePointCount(x);
		for(let i = 0; i < len; i++) {
			ret.push(Unicode.fromCodePoint(Unicode.codePointAt(x, Unicode.offsetByCodePoints(x, 0, i))));
		}
		return ret;
	};
	test("codepoint 2", () => { expect(equalsArray(toWord("𠮷野家"), ["𠮷", "野", "家"])).toBe(true); });
}

{
	/**
	 * @param {string} x 
	 * @returns {Array<string>}
	 */
	const toWord = function (x) {
		const ret = [];
		const len = x.length;
		for(let i = len; i > 0; i = Unicode.offsetByCodePoints(x, i, -1)) {
			ret.push(Unicode.fromCodePoint(Unicode.codePointBefore(x, i)));
		}
		return ret;
	};
	test("codepoint 3", () => { expect(equalsArray(toWord("𠮷野家"), ["家", "野", "𠮷"])).toBe(true); });
}

{
	const utf8array = Unicode.toUTF8Array("𠮷野家");
	test("toUTF8Array", () => { expect(equalsArray(utf8array, [0xF0, 0xA0, 0xAE, 0xB7, 0xE9, 0x87, 0x8E, 0xE5, 0xAE, 0xB6])).toBe(true); });
	test("fromUTF8Array", () => { expect(Unicode.fromUTF8Array(utf8array)).toBe("𠮷野家"); });
}

{
	const utf16array = Unicode.toUTF16Array("𠮷野家");
	test("toUTF16Array", () => { expect(equalsArray(utf16array, [0xD842, 0xDFB7, 0x91CE, 0x5BB6])).toBe(true); });
	test("fromUTF16Array", () => { expect(Unicode.fromUTF16Array(utf16array)).toBe("𠮷野家"); });
}

{
	const utf32array = Unicode.toUTF32Array("𠮷野家");
	test("toUTF32Array", () => { expect(equalsArray(utf32array, [0x00020BB7, 0x000091CE, 0x00005BB6])).toBe(true); });
	test("fromUTF32Array", () => { expect(Unicode.fromUTF32Array(utf32array)).toBe("𠮷野家"); });
}

{
	const text = "1圡土2圡土3圡土";
	test("cutTextForCodePoint", () => { expect(Unicode.cutTextForCodePoint(text, 3, 3)).toBe("2圡土"); });
}

{
	const text = "aあ①圡0𠮷";
	const utf_32		= [0x00000061, 0x00003042, 0x00002460, 0x00005721, 0x00000030, 0x00020BB7];
	const utf_8			=                   [ 0x61, 0xE3, 0x81, 0x82, 0xE2, 0x91, 0xA0, 0xE5, 0x9C, 0xA1, 0x30, 0xF0, 0xA0, 0xAE, 0xB7];
	const utf_8_bom		= [ 0xEF, 0xBB, 0xBF, 0x61, 0xE3, 0x81, 0x82, 0xE2, 0x91, 0xA0, 0xE5, 0x9C, 0xA1, 0x30, 0xF0, 0xA0, 0xAE, 0xB7];
	const utf_16be		=             [ 0x00, 0x61, 0x30, 0x42, 0x24, 0x60, 0x57, 0x21, 0x00, 0x30, 0xD8, 0x42, 0xDF, 0xB7];
	const utf_16be_bom	= [ 0xFE, 0xFF, 0x00, 0x61, 0x30, 0x42, 0x24, 0x60, 0x57, 0x21, 0x00, 0x30, 0xD8, 0x42, 0xDF, 0xB7];
	const utf_16le		=             [ 0x61, 0x00, 0x42, 0x30, 0x60, 0x24, 0x21, 0x57, 0x30, 0x00, 0x42, 0xD8, 0xB7, 0xDF];
	const utf_16le_bom	= [ 0xFF, 0xFE, 0x61, 0x00, 0x42, 0x30, 0x60, 0x24, 0x21, 0x57, 0x30, 0x00, 0x42, 0xD8, 0xB7, 0xDF];
	const utf_32be		=                         [ 0x00, 0x00, 0x00, 0x61, 0x00, 0x00, 0x30, 0x42, 0x00, 0x00, 0x24, 0x60, 0x00, 0x00, 0x57, 0x21, 0x00, 0x00, 0x00, 0x30, 0x00, 0x02, 0x0B, 0xB7 ];
	const utf_32be_bom	= [ 0x00, 0x00, 0xFE, 0xFF, 0x00, 0x00, 0x00, 0x61, 0x00, 0x00, 0x30, 0x42, 0x00, 0x00, 0x24, 0x60, 0x00, 0x00, 0x57, 0x21, 0x00, 0x00, 0x00, 0x30, 0x00, 0x02, 0x0B, 0xB7 ];
	const utf_32le		=                         [ 0x61, 0x00, 0x00, 0x00, 0x42, 0x30, 0x00, 0x00, 0x60, 0x24, 0x00, 0x00, 0x21, 0x57, 0x00, 0x00, 0x30, 0x00, 0x00, 0x00, 0xB7, 0x0B, 0x02, 0x00 ];
	const utf_32le_bom	= [ 0xFF, 0xFE, 0x00, 0x00, 0x61, 0x00, 0x00, 0x00, 0x42, 0x30, 0x00, 0x00, 0x60, 0x24, 0x00, 0x00, 0x21, 0x57, 0x00, 0x00, 0x30, 0x00, 0x00, 0x00, 0xB7, 0x0B, 0x02, 0x00 ];
	{
		test("toCodePointFromUTFBinary 1", () => { expect(equalsArray(Unicode.toUTF32Array(text), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 2", () => { expect(Unicode.fromUTF32Array(utf_32)).toBe(text); });
		test("toCodePointFromUTFBinary 3", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_8, "utf-8n"), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 4", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_8_bom), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 5", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_16be, "utf-16be"), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 6", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_16le, "utf-16le"), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 7", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_16be_bom), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 8", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_16le_bom), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 9", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_32be, "utf-32be"), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 10", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_32le, "utf-32le"), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 11", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_32be_bom), utf_32)).toBe(true); });
		test("toCodePointFromUTFBinary 12", () => { expect(equalsArray(Unicode.toCodePointFromUTFBinary(utf_32le_bom), utf_32)).toBe(true); });
	}

	{
		test("toUTFBinaryFromCodePoint 1", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-8"), utf_8_bom)).toBe(true); });
		test("toUTFBinaryFromCodePoint 2", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-8", false), utf_8)).toBe(true); });
		test("toUTFBinaryFromCodePoint 3", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-8", true), utf_8_bom)).toBe(true); });
		test("toUTFBinaryFromCodePoint 4", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-16le", false), utf_16le)).toBe(true); });
		test("toUTFBinaryFromCodePoint 5", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-16le", true), utf_16le_bom)).toBe(true); });
		test("toUTFBinaryFromCodePoint 6", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-16be", false), utf_16be)).toBe(true); });
		test("toUTFBinaryFromCodePoint 7", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-16be", true), utf_16be_bom)).toBe(true); });
		test("toUTFBinaryFromCodePoint 8", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-32le", false), utf_32le)).toBe(true); });
		test("toUTFBinaryFromCodePoint 9", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-32le", true), utf_32le_bom)).toBe(true); });
		test("toUTFBinaryFromCodePoint 10", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-32be", false), utf_32be)).toBe(true); });
		test("toUTFBinaryFromCodePoint 11", () => { expect(equalsArray(Unicode.toUTFBinaryFromCodePoint(utf_32, "utf-32be", true), utf_32be_bom)).toBe(true); });
	}
}
