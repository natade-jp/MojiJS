import Japanese from "./Japanese.js";

let test_count = 0;

/**
 * @param {*} operator 
 * @param {*} x 
 * @param {*} y 
 */
const testOperator1  = function(operator, x, y) {
	test_count++;
	const out = Japanese[operator](x);
	const testname = operator + " " + test_count + " (" + x + ")." + operator + "(" + x + ") = " + out + " === " + y;
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
