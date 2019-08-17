import CP932 from "./CP932.js";

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
	const text = "ABCあいう高髙①";
	const cp932array = [0x0041, 0x0042, 0x0043, 0x82A0, 0x82A2, 0x82A4, 0x8D82, 0xFBFC, 0x8740];
	test("toCP932Array", () => { expect(equalsArray( CP932.toCP932Array(text), cp932array)).toBe(true); });
	test("fromCP932Array", () => { expect(CP932.fromCP932Array(cp932array)).toBe(text); });
}

{
	const text = "ABCあいう高髙①";
	const cp932binary = [0x41, 0x42, 0x43, 0x82, 0xA0, 0x82, 0xA2, 0x82, 0xA4, 0x8D, 0x82, 0xFB, 0xFC, 0x87, 0x40];
	test("toCP932ArrayBinary", () => { expect(equalsArray(CP932.toCP932Binary(text), cp932binary)).toBe(true); });
	test("fromCP932Array (binary)", () => { expect(CP932.fromCP932Array(cp932binary)).toBe(text); });
}
