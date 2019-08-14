import EUCJP from "./EUCJP.js";

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
	const text  = "ぐ園aｱ⑯";
	const eucjp	= [0xA4, 0xB0, 0xB1, 0xE0, 0x61, 0x80, 0xB1, 0xAD, 0xB0];
	test("toEUCJPBinary", () => { expect(equalsArray(EUCJP.toEUCJPBinary(text), eucjp)).toBe(true); });
	test("fromEUCJPBinary", () => { expect(EUCJP.fromEUCJPBinary(eucjp).encode_string).toBe(text); });
}

{
	const text  = "謹𪘂麵";
	const eucjp	= [0xFC, 0xB0, 0x8F, 0xFE, 0xF0, 0xFE, 0xF0];
	test("toEUCJIS2004Binary", () => { expect(equalsArray(EUCJP.toEUCJIS2004Binary(text), eucjp)).toBe(true); });
	test("fromEUCJIS2004Binary", () => { expect(EUCJP.fromEUCJIS2004Binary(eucjp).encode_string).toBe(text); });
}
