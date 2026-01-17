import Unicode from "../encode/Unicode.js";
import MojiAnalyzer from "./MojiAnalyzer.js";

let test_count = 0;

/**
 * @param {string|number} text
 * @param {string} operator
 * @param {boolean} result
 */
const testType  = function(text, operator, result) {
	test_count++;

	let text_cp = 0;
	if (typeof text === "string") {
		text_cp = Unicode.codePointAt(text);
	}
	else {
		text_cp = text;
	}
	const data = MojiAnalyzer.getMojiData(text_cp);
	// @ts-ignore
	const y = data.type[operator];
	const testname = operator + " " + test_count;
	test(testname, () => { expect(y).toBe(result); });
};

/**
 * @param {string} text
 * @param {string} kuten
 */
const testKuTen  = function(text, kuten) {
	test_count++;
	const data = MojiAnalyzer.getMojiData(Unicode.codePointAt(text));
	/**
	 * @type {boolean}
	 */
	let result;
	if(kuten) {
		result = data.encode.kuten.text === kuten;
	}
	else {
		result = data.encode.kuten === null;
	}
	const testname = "testKuTen " + test_count;
	test(testname, () => { expect(result).toBe(true); });
};

/**
 * @param {string} text
 * @param {string} menkuten
 * @param {number} [suijun]
 */
const testMenKuTen  = function(text, menkuten, suijun) {
	test_count++;
	const data = MojiAnalyzer.getMojiData(Unicode.codePointAt(text));
	/**
	 * @type {boolean}
	 */
	let result;
	if(menkuten) {
		result = data.encode.menkuten.text === menkuten;
	}
	else {
		result = data.encode.menkuten === null;
	}
	if(suijun) {
		result = result && (suijun === data.type.kanji_suijun);
	}
	const testname = "testMenKuTen " + test_count;
	test(testname, () => { expect(result).toBe(true); });
};

test_count = 0;
{

	testType("高", "is_joyo_kanji", true);
	testType("髙", "is_joyo_kanji", false);
	testType("渾", "is_jinmeiyo_kanji", true);
	testType("高", "is_IBM_extended_character", false);
	testType("髙", "is_IBM_extended_character", true);
	testType("①", "is_NEC_selection_IBM_extended_character", false);
	testType("①", "is_NEC_special_character", true);
	
	testType("​", "is_control_charcter", true);
	testType("a", "is_control_charcter", false);
	testType("高", "is_kanji", true);
	testType("あ", "is_kanji", false);
	testType("あ", "is_hiragana", true);
	testType("ア", "is_hiragana", false);
	testType("ア", "is_katakana", true);
	testType("あ", "is_katakana", false);
	testType("Ａ", "is_fullwidth_ascii", true);
	testType("A", "is_fullwidth_ascii", false);
	testType("ｱ", "is_halfwidth_katakana", true);
	testType("ア", "is_halfwidth_katakana", false);
	testType("🍞", "is_emoji", true);
	testType("😀", "is_emoji", false);
	testType("😀", "is_emoticons", true);
	testType("🍞", "is_emoticons", false);
	testType("☺︎", "is_symbol_base", true);
	testType("😀", "is_symbol_base", false);
	testType("​", "is_non_counting_character", true);
	testType("\t", "is_non_counting_character", false);
	testType(Unicode.toUTF32Array("あ゙")[1], "is_combining_mark", true);
	testType(Unicode.toUTF32Array("禰󠄀")[1], "is_combining_mark", false);
	testType(Unicode.toUTF32Array("👍🏻")[1], "is_combining_mark", false);
	testType(Unicode.toUTF32Array("🏴󠁫󠁨󠀱󠀰󠁿")[1], "is_combining_mark", false);
	testType(Unicode.toUTF32Array("あ゙")[1], "is_variation_selector", false);
	testType(Unicode.toUTF32Array("禰󠄀")[1], "is_variation_selector", true);
	testType(Unicode.toUTF32Array("👍🏻")[1], "is_variation_selector", false);
	testType(Unicode.toUTF32Array("🏴󠁫󠁨󠀱󠀰󠁿")[1], "is_variation_selector", false);
	testType(Unicode.toUTF32Array("あ゙")[1], "is_skin_tone_modifier", false);
	testType(Unicode.toUTF32Array("禰󠄀")[1], "is_skin_tone_modifier", false);
	testType(Unicode.toUTF32Array("👍🏻")[1], "is_skin_tone_modifier", true);
	testType(Unicode.toUTF32Array("🏴󠁫󠁨󠀱󠀰󠁿")[1], "is_skin_tone_modifier", false);
	testType(Unicode.toUTF32Array("あ゙")[1], "is_tag_character", false);
	testType(Unicode.toUTF32Array("禰󠄀")[1], "is_tag_character", false);
	testType(Unicode.toUTF32Array("👍🏻")[1], "is_tag_character", false);
	testType(Unicode.toUTF32Array("🏴󠁫󠁨󠀱󠀰󠁿")[1], "is_tag_character", true);
}

test_count = 0;
{
	testKuTen("A", null);
	testKuTen("あ", "4-2");
	testKuTen("鉱", "25-59");
	testKuTen("砿", "25-60");
	testKuTen("鋼", "25-61");
	testKuTen("閤", "25-62");
	testKuTen("降", "25-63");
	testKuTen("項", "25-64");
	testKuTen("①", "13-1");
	testKuTen("㈱", "13-74");
	testKuTen("髙", "118-94");
}

test_count = 0;
{
	testKuTen("A", null);
	testKuTen("あ", "4-2");
	testKuTen("鉱", "25-59");
	testKuTen("砿", "25-60");
	testKuTen("鋼", "25-61");
	testKuTen("閤", "25-62");
	testKuTen("降", "25-63");
	testKuTen("項", "25-64");
	testKuTen("①", "13-1");
	testKuTen("㈱", "13-74");
	testKuTen("髙", "118-94");
}

test_count = 0;
{
	testMenKuTen("A", null);
	testMenKuTen("あ", "1-4-2");
	testMenKuTen("鉱", "1-25-59", 1);
	testMenKuTen("砿", "1-25-60", 1);
	testMenKuTen("鋼", "1-25-61", 1);
	testMenKuTen("閤", "1-25-62", 1);
	testMenKuTen("降", "1-25-63", 1);
	testMenKuTen("項", "1-25-64", 1);
	testMenKuTen("①", "1-13-1");
	testMenKuTen("㈱", "1-13-74");
	testMenKuTen("髙", null);
	testMenKuTen("圡", "1-15-35", 3);
	testMenKuTen("唁", "2-3-93", 4);
	testMenKuTen("㖨", "2-4-6", 4);
	testMenKuTen("埦", "2-4-87", 4);
	testMenKuTen("宖", "2-8-1", 4);
	testMenKuTen("殁", "2-15-94", 4);
	testMenKuTen("殛", "2-78-1", 4);
	testMenKuTen("蜅", "2-87-48", 4);
	testMenKuTen("𪚲", "2-94-86", 4);
}

