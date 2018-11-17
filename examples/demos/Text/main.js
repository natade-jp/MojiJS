import Senko from "../../libs/Senko.js";

const Text = Senko.Text;

const main = function() {
	
	let x;
	
	Senko.println("Text クラスのサンプル");
	
	x = "0000\"1234//5678\"1234//5678\n123456789/*1234\n1234*/56789";
	Senko.println(Text.removeComment(x));

	x = "0/*000\"1234//5678\"1234*/9";
	Senko.println(Text.removeComment(x));

	x = "0/1234/5678/9";
	Senko.println(Text.removeComment(x));

	x = "１２３456　ＡＢＣdef ";
	Senko.println(Text.toFullWidthAsciiCode(x));
	Senko.println(Text.toHalfWidthAsciiCode(x));
	Senko.println(Text.toFullWidthAlphabet(x));
	Senko.println(Text.toHalfWidthAlphabet(x));
	Senko.println(Text.toFullWidthNumber(x));
	Senko.println(Text.toHalfWidthNumber(x));

	x = "あおカコｶﾞｺﾞﾊﾞﾎﾞﾊﾟﾎﾟバビブベボ";
	Senko.println(Text.toKatakana(x));
	Senko.println(Text.toHiragana(x));
	Senko.println(Text.toFullWidthKana(x));
	Senko.println(Text.toHalfWidthKana(x));

	x = "0123abcABCｱｲｳ!!０１２３ａｂｃＡＢＣあいうアイウ！！";
	Senko.println(Text.toFullWidth(x));
	Senko.println(Text.toHalfWidth(x));

	x = Text.fromCodePoint(134071, 37326, 23478 );
	Senko.println("サロゲートペア対応 " + x);

	Senko.println("前から 1");
	let len = x.length;
	for(let i = 0; i < len; i = Text.offsetByCodePoints(x, i, 1)) {
		Senko.print(i + "[" + Text.fromCodePoint(Text.codePointAt(x, i)) + "] ");
	}
	Senko.println("");

	Senko.println("前から 2");
	len = Text.codePointCount(x);
	for(let i = 0; i < len; i++) {
		Senko.print(i + "[" + Text.fromCodePoint(Text.codePointAt(x, Text.offsetByCodePoints(x, 0, i))) + "] ");
	}
	Senko.println("");

	Senko.println("後ろから");
	len = x.length;
	for(let i = len; i > 0; i = Text.offsetByCodePoints(x, i, -1)) {
		Senko.print(i + "[" + Text.fromCodePoint(Text.codePointBefore(x, i)) + "] ");
	}
	Senko.println("");

	Senko.println("UTF8の配列");
	const utf8array = Text.toUTF8Array(x);
	for(let i = 0; i < utf8array.length; i++) {
		Senko.printf("%02X ", utf8array[i]);
	}
	Senko.println(Text.fromUTF8Array(utf8array));
	Senko.println("");

	Senko.println("UTF16の配列");
	const utf16array = Text.toUTF16Array(x);
	for(let i = 0; i < utf16array.length; i++) {
		Senko.printf("%04X ", utf16array[i]);
	}
	Senko.println(Text.fromUTF16Array(utf16array));
	Senko.println("");

	Senko.println("UTF32の配列");
	const utf32array = Text.toUTF32Array(x);
	for(let i = 0; i < utf32array.length; i++) {
		Senko.printf("%08X ", utf32array[i]);
	}
	Senko.println(Text.fromUTF32Array(utf32array));
	Senko.println("");

};

main();
