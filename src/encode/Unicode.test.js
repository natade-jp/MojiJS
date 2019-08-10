import Unicode from "./Unicode";

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
