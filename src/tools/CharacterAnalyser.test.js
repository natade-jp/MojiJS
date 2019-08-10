import Unicode from "../encode/Unicode.js";
import CharacterAnalyser from "./CharacterAnalyser.js";


let test_count = 0;

/**
 * @param {string} text
 * @param {string} operator
 * @param {boolean} result
 */
const testType  = function(text, operator, result) {
	test_count++;
	const data = CharacterAnalyser.getCharacterAnalysisData(Unicode.codePointAt(text));
	const y = data.type[operator];
	const testname = operator + " " + test_count;
	test(testname, () => { expect(y).toBe(result); });
}

/**
 * @param {any} x 
 * @param {any} y 
 */
const testKuten  = function(x, y) {
	test_count++;
	const testname = "CharacterAnalysisData " + test_count;
	test(testname, () => { expect(x).toBe(y); });
}

test_count = 0;
{
	testType("高", "is_joyo_kanji", true);
	testType("髙", "is_joyo_kanji", false);
	testType("渾", "is_jinmeiyo_kanji", true);
}



