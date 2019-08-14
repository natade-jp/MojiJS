import SJIS2004 from "./SJIS2004.js";

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
	const text		= "圡①靁";
	const sjis2004	= [0x8862, 0x8740, 0xFB9A];
	test("toSJIS2004Array 1", () => { expect(equalsArray(SJIS2004.toSJIS2004Array(text).encode, sjis2004)).toBe(true); });
	test("fromSJIS2004Array 1", () => { expect(SJIS2004.fromSJIS2004Array(sjis2004).decode).toBe(text); });
}
{
	const text		= "謹𪘂麵";
	const sjis2004	= [0xEEAE, 0xFCEE, 0xEFEE];
	test("toSJIS2004Array 2", () => { expect(equalsArray(SJIS2004.toSJIS2004Array(text).encode, sjis2004)).toBe(true); });
	test("fromSJIS2004Array 2", () => { expect(SJIS2004.fromSJIS2004Array(sjis2004).decode).toBe(text); });
}
