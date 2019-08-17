import EUCJIS2004 from "./EUCJIS2004.js";

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
	const text  = "謹𪘂麵";
	const eucjis2004 = [0xFC, 0xB0, 0x8F, 0xFE, 0xF0, 0xFE, 0xF0];
	test("toEUCJIS2004Binary", () => { expect(equalsArray(EUCJIS2004.toEUCJIS2004Binary(text), eucjis2004)).toBe(true); });
	test("fromEUCJIS2004Binary", () => { expect(EUCJIS2004.fromEUCJIS2004Binary(eucjis2004)).toBe(text); });
}
