import Senko from "../../libs/Senko.js";

const Text = Senko.Text;
const Japanese = Text.Japanese;
const JapaneseKanji = Text.JapaneseKanji;
const Unicode = Text.Unicode;
const CP932 = Text.CP932;
const SJIS2004 = Text.SJIS2004;

const testJapanese = function() {

	let x;
	Senko.println("");
	Senko.println("◆◆Japanese クラスのサンプル");

	Senko.println("◆半角、全角で変換します。");
	x = "１２３456　ＡＢＣdef ";
	Senko.println(x);
	Senko.println(Japanese.toFullWidthAsciiCode(x));
	Senko.println(Japanese.toHalfWidthAsciiCode(x));
	Senko.println(Japanese.toFullWidthAlphabet(x));
	Senko.println(Japanese.toHalfWidthAlphabet(x));
	Senko.println(Japanese.toFullWidthNumber(x));
	Senko.println(Japanese.toHalfWidthNumber(x));

	Senko.println("◆ひらがなとカタカナ、半角カタカナ、全角カタカナで変換します。");
	x = "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ";
	Senko.println(x);
	Senko.println(Japanese.toKatakana(x));
	Senko.println(Japanese.toHiragana(x));
	Senko.println(Japanese.toFullWidthKana(x));
	Senko.println(Japanese.toHalfWidthKana(x));

	Senko.println("◆半角と全角で変換します。");
	x = "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！";
	Senko.println(x);
	Senko.println(Japanese.toFullWidth(x));
	Senko.println(Japanese.toHalfWidth(x));

	Senko.println("◆ローマ字からひらがなに変換します。");
	x = "aiueo!konnnichiwa-!waha-!jaja-n!";
	Senko.println(x);
	Senko.println(Japanese.toHiraganaFromRomaji(x));
	Senko.println(Japanese.toKatakanaFromRomaji(x));

	x = "kyapi-nn!shi!chi!tsu!tha!xtsu!ltu!xxa!";
	Senko.println(x);
	Senko.println(Japanese.toHiraganaFromRomaji(x));
	Senko.println(Japanese.toKatakanaFromRomaji(x));
};

const testJapaneseKanji = function() {

	Senko.println("");
	Senko.println("◆◆JapaneseKanji クラスのサンプル");

	Senko.println("◆漢字のチェック");
	Senko.println("高は常用漢字か？" + JapaneseKanji.isJoyoKanji(Unicode.toUTF32Array("高")[0]));
	Senko.println("髙は常用漢字か？" + JapaneseKanji.isJoyoKanji(Unicode.toUTF32Array("髙")[0]));
	Senko.println("渾は人名用漢字か？" + JapaneseKanji.isJinmeiyoKanji(Unicode.toUTF32Array("渾")[0]));

};

const testUnicode = function() {

	Senko.println("");
	Senko.println("◆◆Unicode クラスのサンプル");

	const x = Unicode.fromCodePoint(134071, 37326, 23478 );
	Senko.println("サロゲートペア対応 " + x);

	Senko.println("「" + x + "」");
	Senko.println("lengthは " + x.length);
	Senko.println("文字数は " + Unicode.codePointCount(x));

	Senko.println("◆前からカットする 方法1");
	let len = x.length;
	for(let i = 0; i < len; i = Unicode.offsetByCodePoints(x, i, 1)) {
		Senko.print(i + "[" + Unicode.fromCodePoint(Unicode.codePointAt(x, i)) + "] ");
	}
	Senko.println("");

	Senko.println("◆前からカットする 方法2");
	len = Unicode.codePointCount(x);
	for(let i = 0; i < len; i++) {
		Senko.print(i + "[" + Unicode.fromCodePoint(Unicode.codePointAt(x, Unicode.offsetByCodePoints(x, 0, i))) + "] ");
	}
	Senko.println("");

	Senko.println("◆後ろからカットする");
	len = x.length;
	for(let i = len; i > 0; i = Unicode.offsetByCodePoints(x, i, -1)) {
		Senko.print(i + "[" + Unicode.fromCodePoint(Unicode.codePointBefore(x, i)) + "] ");
	}
	Senko.println("");

	Senko.println("◆UTF8の配列");
	const utf8array = Unicode.toUTF8Array(x);
	for(let i = 0; i < utf8array.length; i++) {
		Senko.printf("%02X ", utf8array[i]);
	}
	Senko.println(Unicode.fromUTF8Array(utf8array));

	Senko.println("◆UTF16の配列");
	const utf16array = Unicode.toUTF16Array(x);
	for(let i = 0; i < utf16array.length; i++) {
		Senko.printf("%04X ", utf16array[i]);
	}
	Senko.println(Unicode.fromUTF16Array(utf16array));

	Senko.println("◆UTF32の配列");
	const utf32array = Unicode.toUTF32Array(x);
	for(let i = 0; i < utf32array.length; i++) {
		Senko.printf("%08X ", utf32array[i]);
	}
	Senko.println(Unicode.fromUTF32Array(utf32array));

	const text = "1圡土2圡土3圡土";
	Senko.println("◆サロゲートペアを一部含んだ文字列をカットします。");
	Senko.println(Unicode.cutTextForCodePoint(text, 3, 3));

};

const testCP932 = function() {

	Senko.println("");
	Senko.println("◆◆CP932(Windows-31J) クラスのサンプル");

	const x = "ABCあいう高髙①";

	Senko.println("「" + x + "」");
	Senko.println("lengthは " + x.length);
	Senko.println("文字の横幅は " + CP932.getWidthForCP932(x));

	Senko.println("◆Windows-31J の符号化コードで1文字ごと表示します。");
	const cp932array = CP932.toCP932Array(x);
	for(let i = 0; i < cp932array.length; i++) {
		Senko.printf("%04X ", cp932array[i]);
	}
	Senko.println(CP932.fromCP932Array(cp932array));

	Senko.println("◆Windows-31J の符号化コードで1バイトごと表示します。");
	const cp932arraybin = CP932.toCP932ArrayBinary(x);
	for(let i = 0; i < cp932arraybin.length; i++) {
		Senko.printf("%02X ", cp932arraybin[i]);
	}
	Senko.println(CP932.fromCP932Array(cp932arraybin));
	
	Senko.println("◆文字の横幅換算で文字列をカットします。");
	Senko.println("\"" + CP932.cutTextForCP932(x, 0, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 1, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 2, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 3, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 4, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 5, 5) + "\"");
	Senko.println("\"" + CP932.cutTextForCP932(x, 6, 5) + "\"");

	const kuten = function(text) {
		const menkuten = CP932.toKuTen(Unicode.toUTF32Array(text)[0]);
		if(!menkuten) {
			Senko.printf("「%s」の変換に失敗しました\n", text);
			return;
		}
		Senko.printf("「%s」の区点番号は %s\n", text, menkuten.text);
	};

	Senko.println("◆面区点番号のチェック");
	kuten("A");
	kuten("あ");
	kuten("鉱");
	kuten("砿");
	kuten("鋼");
	kuten("閤");
	kuten("降");
	kuten("項");
	kuten("①");
	kuten("㈱");
	kuten("髙");

	Senko.println("◆漢字のチェック");
	Senko.println("高はIBM拡張漢字か？" + CP932.isCP932IBMExtendedCharacter(Unicode.toUTF32Array("高")[0]));
	Senko.println("髙はIBM拡張漢字か？" + CP932.isCP932IBMExtendedCharacter(Unicode.toUTF32Array("髙")[0]));
	Senko.println("①はNEC特殊文字か？" + CP932.isCP932NECSpecialCharacter(Unicode.toUTF32Array("①")[0]));

};

const testSJIS2004 = function() {

	Senko.println("");
	Senko.println("◆◆Shift_JIS-2004 クラスのサンプル");
	
	const checkkanji = function(text) {
		const menkuten = SJIS2004.toMenKuTen(Unicode.toUTF32Array(text)[0]);
		const suijun = SJIS2004.toJISKanjiSuijun(Unicode.toUTF32Array(text)[0]);
		if(!menkuten) {
			Senko.printf("「%s」の変換に失敗しました\n", text);
			return;
		}
		if(suijun) {
			Senko.printf("「%s」の面区点番号は %s で、第%d水準漢字\n", text, menkuten.text, suijun);
		}
		else {
			Senko.printf("「%s」の面区点番号は %s\n", text, menkuten.text);
		}
	};

	Senko.println("◆面区点番号のチェック");
	checkkanji("A");
	checkkanji("あ");
	checkkanji("鉱");
	checkkanji("砿");
	checkkanji("鋼");
	checkkanji("閤");
	checkkanji("降");
	checkkanji("項");
	checkkanji("①");
	checkkanji("㈱");
	checkkanji("髙");
	checkkanji("圡");
	checkkanji("唁");
	checkkanji("㖨");
	checkkanji("埦");
	checkkanji("宖");
	checkkanji("殁");
	checkkanji("殛");
	checkkanji("蜅");
	checkkanji("𪚲");
	Senko.println("");

};

const main = function() {
	
	let x;
	
	Senko.println("◆◆Text クラスのサンプル");
	
	Senko.println("◆コメント除去機能");
	x = "0000\"1234//5678\"1234//5678\n123456789/*1234\n1234*/56789";
	Senko.println(Text.removeComment(x));
	x = "0/*000\"1234//5678\"1234*/9";
	Senko.println(Text.removeComment(x));
	x = "0/1234/5678/9";
	Senko.println(Text.removeComment(x));

	testJapanese();
	testJapaneseKanji();
	testUnicode();
	testCP932();
	testSJIS2004();

};

main();
