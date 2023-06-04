import Japanese from "./Japanese.js";

let test_count = 0;

/**
 * @param {*} operator 
 * @param {*} x 
 * @param {*} y 
 */
const testOperator1  = function(operator, x, y) {
	test_count++;
	// @ts-ignore
	const out = Japanese[operator](x);
	const testname = operator + " " + test_count + " " + operator + "(" + x + ") = " + out + " === " + y;
	test(testname, () => { expect(out === y).toBe(true); });
};

test_count = 0;
testOperator1("toFullWidthAsciiCode", "１２３456　ＡＢＣdef ", "１２３４５６　ＡＢＣｄｅｆ　");
testOperator1("toHalfWidthAsciiCode", "１２３456　ＡＢＣdef ", "123456 ABCdef ");
testOperator1("toFullWidthAlphabet", "１２３456　ＡＢＣdef ", "１２３456　ＡＢＣｄｅｆ ");
testOperator1("toHalfWidthAlphabet", "１２３456　ＡＢＣdef ", "１２３456　ABCdef ");
testOperator1("toFullWidthNumber", "１２３456　ＡＢＣdef ", "１２３４５６　ＡＢＣdef ");
testOperator1("toHalfWidthNumber", "１２３456　ＡＢＣdef ", "123456　ＡＢＣdef ");

testOperator1("toKatakana", "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ", "アオカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ");
testOperator1("toHiragana", "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ", "あおかこｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟばびぶべぼ");
testOperator1("toFullWidthKana", "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ", "あおカコガゴバボパポバビブベボ");
testOperator1("toHalfWidthKana", "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ", "あおｶｺｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞ");

testOperator1("toFullWidth", "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！", "０１２３ａｂｃＡＢＣアイウ！！０１２３ａｂｃＡＢＣあいうアイウ！！");
testOperator1("toHalfWidth", "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！", "0123abcABCｱｲｳ!!0123abcABCあいうｱｲｳ!!");

testOperator1("toHiraganaFromRomaji", "aiueo!konnnichiwa-!waha-!jaja-n!", "あいうえお！こんにちわー！わはー！じゃじゃーん！");
testOperator1("toKatakanaFromRomaji", "aiueo!konnnichiwa-!waha-!jaja-n!", "アイウエオ！コンニチワー！ワハー！ジャジャーン！");

testOperator1("toHiraganaFromRomaji", "kyapi-nn!shi!chi!tsu!tha!xtsu!ltu!xxa!", "きゃぴーん！し！ち！つ！ちゃ！っ！っ！っぁ！");
testOperator1("toKatakanaFromRomaji", "kyapi-nn!shi!chi!tsu!tha!xtsu!ltu!xxa!", "キャピーン！シ！チ！ツ！チャ！ッ！ッ！ッァ！");
testOperator1("toHiraganaFromRomaji", "gwagwigwugwegwo", "ぐぁぐぃぐぅぐぇぐぉ");
testOperator1("toHiraganaFromRomaji", "pyapyipyupyepyo", "ぴゃぴぃぴゅぴぇぴょ");
testOperator1("toHiraganaFromRomaji", "kakkoii", "かっこいい");
testOperator1("toHiraganaFromRomaji", "onnatsu", "おんあつ");
testOperator1("toKatakanaFromRomaji", "myougonichi", "ミョウゴニチ");
testOperator1("toKatakanaFromRomaji", "tsatwugua", "ツァトゥグア");

testOperator1("toRomajiFromHiragana", "こんにちわ", "konnichiwa");
testOperator1("toRomajiFromHiragana", "ぐぁぐぃぐぅぐぇぐぉ", "gwagwigwugwegwo");
testOperator1("toRomajiFromHiragana", "ぴゃぴぃぴゅぴぇぴょ", "pyapyipyupyepyo");
testOperator1("toRomajiFromHiragana", "かっこいい", "kakkoii");
testOperator1("toRomajiFromKatakana", "ミョウゴニチ", "myougonichi");

{
	test("getWidth", () => { expect(Japanese.getWidth("ABCあいう高髙①")).toBe(15); });
	test("getWidth", () => { expect(Japanese.getWidth("禰豆子")).toBe(6); });
	test("getWidth", () => { expect(Japanese.getWidth("襧豆子")).toBe(6); });
	test("getWidth", () => { expect(Japanese.getWidth("禰󠄀豆子")).toBe(6); });
	test("getWidth", () => { expect(Japanese.getWidth("Åström")).toBe(6); });
	test("getWidth", () => { expect(Japanese.getWidth("あ゙")).toBe(2); });
}

{
	const text = "ABCあいう高髙①";
	test("cutTextForWidth  1", () => { expect(Japanese.cutTextForWidth(text,-1, 5)).toBe("ABC "); });
	test("cutTextForWidth  2", () => { expect(Japanese.cutTextForWidth(text, 0, 5)).toBe("ABCあ"); });
	test("cutTextForWidth  3", () => { expect(Japanese.cutTextForWidth(text, 1, 5)).toBe("BCあ "); });
	test("cutTextForWidth  4", () => { expect(Japanese.cutTextForWidth(text, 2, 5)).toBe("Cあい"); });
	test("cutTextForWidth  5", () => { expect(Japanese.cutTextForWidth(text, 3, 5)).toBe("あい "); });
	test("cutTextForWidth  6", () => { expect(Japanese.cutTextForWidth(text, 4, 5)).toBe(" いう"); });
	test("cutTextForWidth  7", () => { expect(Japanese.cutTextForWidth(text, 5, 5)).toBe("いう "); });
	test("cutTextForWidth  8", () => { expect(Japanese.cutTextForWidth(text, 6, 5)).toBe(" う高"); });
	test("cutTextForWidth  9", () => { expect(Japanese.cutTextForWidth(text, 7, 5)).toBe("う高 "); });
	test("cutTextForWidth 10", () => { expect(Japanese.cutTextForWidth(text, 8, 5)).toBe(" 高髙"); });
	test("cutTextForWidth 11", () => { expect(Japanese.cutTextForWidth(text, 9, 5)).toBe("高髙 "); });
	test("cutTextForWidth 12", () => { expect(Japanese.cutTextForWidth(text,10, 5)).toBe(" 髙①"); });
	test("cutTextForWidth 13", () => { expect(Japanese.cutTextForWidth(text,11, 5)).toBe("髙①"); });
}

{
	const text = "Åあ゙禰󠄀";
	test("cutTextForWidth Ex1", () => { expect(Japanese.cutTextForWidth(text, 0, 3)).toBe("Åあ゙"); });
	test("cutTextForWidth Ex2", () => { expect(Japanese.cutTextForWidth(text, 1, 3)).toBe("あ゙ "); });
	test("cutTextForWidth Ex3", () => { expect(Japanese.cutTextForWidth(text, 2, 3)).toBe(" 禰󠄀"); });
}
