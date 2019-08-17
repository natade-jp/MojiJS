// @ts-check

import Log from "../../libs/Log.module.js";
import MojiJS from "../../libs/MojiJS.js";

const testJapanese = function() {

	let x;
	Log.println("");
	Log.println("◆◆変換のサンプル");

	Log.println("◆半角、全角で変換します。");
	x = "１２３456　ＡＢＣdef ";
	Log.println(x);
	Log.println(MojiJS.toFullWidthAsciiCode(x));
	Log.println(MojiJS.toHalfWidthAsciiCode(x));
	Log.println(MojiJS.toFullWidthAlphabet(x));
	Log.println(MojiJS.toHalfWidthAlphabet(x));
	Log.println(MojiJS.toFullWidthNumber(x));
	Log.println(MojiJS.toHalfWidthNumber(x));

	Log.println("◆ひらがなとカタカナ、半角カタカナ、全角カタカナで変換します。");
	x = "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ";
	Log.println(x);
	Log.println(MojiJS.toKatakana(x));
	Log.println(MojiJS.toHiragana(x));
	Log.println(MojiJS.toFullWidthKana(x));
	Log.println(MojiJS.toHalfWidthKana(x));

	Log.println("◆半角と全角で変換します。");
	x = "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！";
	Log.println(x);
	Log.println(MojiJS.toFullWidth(x));
	Log.println(MojiJS.toHalfWidth(x));

	Log.println("◆ローマ字からひらがなに変換します。");
	x = "aiueo!konnnichiwa-!waha-!jaja-n!";
	Log.println(x);
	Log.println(MojiJS.toHiraganaFromRomaji(x));
	Log.println(MojiJS.toKatakanaFromRomaji(x));

	x = "kyapi-nn!shi!chi!tsu!tha!xtsu!ltu!xxa!";
	Log.println(x);
	Log.println(MojiJS.toHiraganaFromRomaji(x));
	Log.println(MojiJS.toKatakanaFromRomaji(x));
};

const testUnicode = function() {

	Log.println("");
	Log.println("◆◆Unicode対応のサンプル");

	const x = MojiJS.fromCodePoint(134071, 37326, 23478 );
	Log.println("サロゲートペア対応 " + x);

	Log.println("「" + x + "」");
	Log.println("lengthは " + x.length);
	Log.println("文字数は " + MojiJS.codePointCount(x));

	Log.println("◆UTF8の配列");
	const utf8array = MojiJS.toUTF8Array(x);
	for(let i = 0; i < utf8array.length; i++) {
		Log.printf("%02X ", utf8array[i]);
	}
	Log.println(MojiJS.fromUTF8Array(utf8array));

	Log.println("◆UTF16の配列");
	const utf16array = MojiJS.toUTF16Array(x);
	for(let i = 0; i < utf16array.length; i++) {
		Log.printf("%04X ", utf16array[i]);
	}
	Log.println(MojiJS.fromUTF16Array(utf16array));

	Log.println("◆UTF32の配列");
	const utf32array = MojiJS.toUTF32Array(x);
	for(let i = 0; i < utf32array.length; i++) {
		Log.printf("%08X ", utf32array[i]);
	}
	Log.println(MojiJS.fromUTF32Array(utf32array));

	const text = "1圡土2圡土3圡土";
	Log.println("◆サロゲートペアを一部含んだ文字列をカットします。");
	Log.println(MojiJS.cutTextForCodePoint(text, 3, 3));

};

const testCP932 = function() {

	Log.println("");
	Log.println("◆◆日本語文字コード対応のサンプル");

	const x = "ABCあいう高髙①";

	Log.println("「" + x + "」");
	Log.println("lengthは " + x.length);
	Log.println("文字の横幅は " + MojiJS.getWidth(x));

	Log.println("◆Windows-31J の符号化コードで1バイトごと表示します。");
	const cp932arraybin = MojiJS.encode(x, "Windows-31J");
	for(let i = 0; i < cp932arraybin.length; i++) {
		Log.printf("%02X ", cp932arraybin[i]);
	}
	Log.println(MojiJS.decode(cp932arraybin));
	
	Log.println("◆文字の横幅換算で文字列をカットします。");
	
	Log.println("\"" + MojiJS.cutTextForWidth(x, 0, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 1, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 2, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 3, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 4, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 5, 5) + "\"");
	Log.println("\"" + MojiJS.cutTextForWidth(x, 6, 5) + "\"");
};

const testCharacterAnalyser = function() {

	Log.println("");
	Log.println("◆◆文字解析のサンプル");

	const analysis = function(moji) {
		return MojiJS.getMojiData(MojiJS.codePointAt(moji));
	};

	Log.println("◆漢字のチェック1");
	Log.println("高は常用漢字か？" + analysis("高").type.is_joyo_kanji );
	Log.println("髙は常用漢字か？" + analysis("髙").type.is_joyo_kanji );
	Log.println("渾は人名用漢字か？" + analysis("渾").type.is_jinmeiyo_kanji );

	Log.println("◆区点番号のチェック");
	const kuten = function(text) {
		const kuten = analysis(text).encode.kuten;
		if(!kuten) {
			Log.printf("「%s」の変換に失敗しました\n", text);
			return;
		}
		Log.printf("「%s」の区点番号は %s\n", text, kuten.text);
	};
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
	Log.println("");

	Log.println("◆漢字のチェック2");
	Log.println("高はIBM拡張漢字か？" + analysis("高").type.is_IBM_extended_character);
	Log.println("髙はIBM拡張漢字か？" + analysis("髙").type.is_IBM_extended_character);
	Log.println("①はNEC特殊文字か？" + analysis("①").type.is_NEC_selection_IBM_extended_character);

	Log.println("◆面区点番号のチェック");
	const menkuten = function(text) {
		const menkuten = analysis(text).encode.menkuten;
		const suijun = analysis(text).type.kanji_suijun;
		if(!menkuten) {
			Log.printf("「%s」の変換に失敗しました\n", text);
			return;
		}
		if(suijun) {
			Log.printf("「%s」の面区点番号は %s で、第%d水準漢字\n", text, menkuten.text, suijun);
		}
		else {
			Log.printf("「%s」の面区点番号は %s\n", text, menkuten.text);
		}
	};
	menkuten("A");
	menkuten("あ");
	menkuten("鉱");
	menkuten("砿");
	menkuten("鋼");
	menkuten("閤");
	menkuten("降");
	menkuten("項");
	menkuten("①");
	menkuten("㈱");
	menkuten("髙");
	menkuten("圡");
	menkuten("唁");
	menkuten("㖨");
	menkuten("埦");
	menkuten("宖");
	menkuten("殁");
	menkuten("殛");
	menkuten("蜅");
	menkuten("𪚲");

	Log.println("");
};

const testStringComparator = function() {
	const a = ["3", "2", "10", "4", "2-4", "0-1", "テスト", "てすと２", "てスと01"];
	Log.println("");
	Log.println("◆◆文字列比較のサンプル");

	Log.println("標準ソート");
	a.sort();
	Log.println(a.join(", "));
	Log.println("通常文字列ソート");
	a.sort(MojiJS.COMPARE_DEFAULT);
	Log.println(a.join(", "));
	Log.println("自然順ソート (Natural Sort)");
	a.sort(MojiJS.COMPARE_NATURAL);
	Log.println(a.join(", "));

};

const main = function() {
	
	Log.println("MojiJS クラスのサンプル");

	testJapanese();
	testUnicode();
	testCP932();
	testCharacterAnalyser();
	testStringComparator();

};

main();
