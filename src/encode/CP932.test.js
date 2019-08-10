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
}

let test_count = 0;

{
	test("getWidthForCP932", () => { expect(CP932.getWidthForCP932("ABCあいう高髙①")).toBe(15); });
}


{
	const target_text = "ABCあいう高髙①";
	const cp932array = CP932.toCP932Array(target_text);
	const cp932array_ = [0x0041, 0x0042, 0x0043, 0x82A0, 0x82A2, 0x82A4, 0x8D82, 0xFBFC, 0x8740];
	test("toCP932Array", () => { expect(equalsArray(cp932array, cp932array_)).toBe(true); });
	test("fromCP932Array", () => { expect(CP932.fromCP932Array(cp932array_)).toBe(target_text); });
}

{
	const target_text = "ABCあいう高髙①";
	const cp932arraybin = CP932.toCP932ArrayBinary(target_text);
	const cp932arraybin_ = [0x41, 0x42, 0x43, 0x82, 0xA0, 0x82, 0xA2, 0x82, 0xA4, 0x8D, 0x82, 0xFB, 0xFC, 0x87, 0x40];
	test("toCP932ArrayBinary", () => { expect(equalsArray(cp932arraybin, cp932arraybin_)).toBe(true); });
	test("fromCP932Array (binary)", () => { expect(CP932.fromCP932Array(cp932arraybin_)).toBe(target_text); });
}

{
	const target_text = "ABCあいう高髙①";
	test("cutTextForCP932  1", () => { expect(CP932.cutTextForCP932(target_text,-1, 5)).toBe("ABC "); });
	test("cutTextForCP932  2", () => { expect(CP932.cutTextForCP932(target_text, 0, 5)).toBe("ABCあ"); });
	test("cutTextForCP932  3", () => { expect(CP932.cutTextForCP932(target_text, 1, 5)).toBe("BCあ "); });
	test("cutTextForCP932  4", () => { expect(CP932.cutTextForCP932(target_text, 2, 5)).toBe("Cあい"); });
	test("cutTextForCP932  5", () => { expect(CP932.cutTextForCP932(target_text, 3, 5)).toBe("あい "); });
	test("cutTextForCP932  6", () => { expect(CP932.cutTextForCP932(target_text, 4, 5)).toBe(" いう"); });
	test("cutTextForCP932  7", () => { expect(CP932.cutTextForCP932(target_text, 5, 5)).toBe("いう "); });
	test("cutTextForCP932  8", () => { expect(CP932.cutTextForCP932(target_text, 6, 5)).toBe(" う高"); });
	test("cutTextForCP932  9", () => { expect(CP932.cutTextForCP932(target_text, 7, 5)).toBe("う高 "); });
	test("cutTextForCP932 10", () => { expect(CP932.cutTextForCP932(target_text, 8, 5)).toBe(" 高髙"); });
	test("cutTextForCP932 11", () => { expect(CP932.cutTextForCP932(target_text, 9, 5)).toBe("高髙 "); });
	test("cutTextForCP932 12", () => { expect(CP932.cutTextForCP932(target_text,10, 5)).toBe(" 髙①"); });
	test("cutTextForCP932 13", () => { expect(CP932.cutTextForCP932(target_text,11, 5)).toBe("髙①"); });
}
