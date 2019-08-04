/**
 * The script is part of mojijs.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * 日本語を扱うクラス
 */
export default class Japanese {

	/**
	 * カタカナをひらがなにします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiragana(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0x0060));
		};
		return (text.replace(/[\u30A1-\u30F6]/g, func));
	}

	/**
	 * ひらがなをカタカナにします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakana(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0x0060));
		};
		return (text.replace(/[\u3041-\u3096]/g, func));
	}
	
	/**
	 * スペースを半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthSpace(text) {
		return (text.replace(/\u3000/g, String.fromCharCode(0x0020)));
	}
	
	/**
	 * スペースを全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthSpace(text) {
		return (text.replace(/\u0020/g, String.fromCharCode(0x3000)));
	}
	
	/**
	 * 英数記号を半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u3000/g, "\u0020");				//全角スペース
		out = out.replace(/[\u2018-\u201B]/g, "\u0027");	//シングルクォーテーション
		out = out.replace(/[\u201C-\u201F]/g, "\u0022");	//ダブルクォーテーション
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			const code = ch.charCodeAt(0);
			return (String.fromCharCode(code - 0xFEE0));
		};
		return (out.replace(/[\uFF01-\uFF5E]/g, func));
	}
	
	/**
	 * 英数記号を全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAsciiCode(text) {
		let out = text;
		out = out.replace(/\u0020/g, "\u3000");	//全角スペース
		out = out.replace(/\u0022/g, "\u201D");	//ダブルクォーテーション
		out = out.replace(/\u0027/g, "\u2019");	//アポストロフィー
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			const code = ch.charCodeAt(0);
			return (String.fromCharCode(code + 0xFEE0));
		};
		return (out.replace(/[\u0020-\u007E]/g, func));
	}
	
	/**
	 * 英語を半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthAlphabet(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, func));
	}
	
	/**
	 * 英語を全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthAlphabet(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return (String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[A-Za-z]/g, func));
	}
	
	/**
	 * 数値を半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthNumber(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
		};
		return (text.replace(/[\uFF10-\uFF19]/g, func));
	}
	
	/**
	 * 数値を全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthNumber(text) {
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			return(String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
		};
		return (text.replace(/[0-9]/g, func));
	}
	
	/**
	 * カタカナを半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidthKana(text) {
		/**
		 * @type {Object<number, string>}
		 */
		const map = {
			0x3001	:	"\uFF64"	,	//	､
			0x3002	:	"\uFF61"	,	//	。	｡
			0x300C	:	"\uFF62"	,	//	「	｢
			0x300D	:	"\uFF63"	,	//	」	｣
			0x309B	:	"\uFF9E"	,	//	゛	ﾞ
			0x309C	:	"\uFF9F"	,	//	゜	ﾟ
			0x30A1	:	"\uFF67"	,	//	ァ	ｧ
			0x30A2	:	"\uFF71"	,	//	ア	ｱ
			0x30A3	:	"\uFF68"	,	//	ィ	ｨ
			0x30A4	:	"\uFF72"	,	//	イ	ｲ
			0x30A5	:	"\uFF69"	,	//	ゥ	ｩ
			0x30A6	:	"\uFF73"	,	//	ウ	ｳ
			0x30A7	:	"\uFF6A"	,	//	ェ	ｪ
			0x30A8	:	"\uFF74"	,	//	エ	ｴ
			0x30A9	:	"\uFF6B"	,	//	ォ	ｫ
			0x30AA	:	"\uFF75"	,	//	オ	ｵ
			0x30AB	:	"\uFF76"	,	//	カ	ｶ
			0x30AC	:	"\uFF76\uFF9E"	,	//	ガ	ｶﾞ
			0x30AD	:	"\uFF77"	,	//	キ	ｷ
			0x30AE	:	"\uFF77\uFF9E"	,	//	ギ	ｷﾞ
			0x30AF	:	"\uFF78"	,	//	ク	ｸ
			0x30B0	:	"\uFF78\uFF9E"	,	//	グ	ｸﾞ
			0x30B1	:	"\uFF79"	,	//	ケ	ｹ
			0x30B2	:	"\uFF79\uFF9E"	,	//	ゲ	ｹﾞ
			0x30B3	:	"\uFF7A"	,	//	コ	ｺ
			0x30B4	:	"\uFF7A\uFF9E"	,	//	ゴ	ｺﾞ
			0x30B5	:	"\uFF7B"	,	//	サ	ｻ
			0x30B6	:	"\uFF7B\uFF9E"	,	//	ザ	ｻﾞ
			0x30B7	:	"\uFF7C"	,	//	シ	ｼ
			0x30B8	:	"\uFF7C\uFF9E"	,	//	ジ	ｼﾞ
			0x30B9	:	"\uFF7D"	,	//	ス	ｽ
			0x30BA	:	"\uFF7D\uFF9E"	,	//	ズ	ｽﾞ
			0x30BB	:	"\uFF7E"	,	//	セ	ｾ
			0x30BC	:	"\uFF7E\uFF9E"	,	//	ゼ	ｾﾞ
			0x30BD	:	"\uFF7F"	,	//	ソ	ｿ
			0x30BE	:	"\uFF7F\uFF9E"	,	//	ゾ	ｿﾞ
			0x30BF	:	"\uFF80"	,	//	タ	ﾀ
			0x30C0	:	"\uFF80\uFF9E"	,	//	ダ	ﾀﾞ
			0x30C1	:	"\uFF81"	,	//	チ	ﾁ
			0x30C2	:	"\uFF81\uFF9E"	,	//	ヂ	ﾁﾞ
			0x30C3	:	"\uFF6F"	,	//	ッ	ｯ
			0x30C4	:	"\uFF82"	,	//	ツ	ﾂ
			0x30C5	:	"\uFF82\uFF9E"	,	//	ヅ	ﾂﾞ
			0x30C6	:	"\uFF83"	,	//	テ	ﾃ
			0x30C7	:	"\uFF83\uFF9E"	,	//	デ	ﾃﾞ
			0x30C8	:	"\uFF84"	,	//	ト	ﾄ
			0x30C9	:	"\uFF84\uFF9E"	,	//	ド	ﾄﾞ
			0x30CA	:	"\uFF85"	,	//	ナ	ﾅ
			0x30CB	:	"\uFF86"	,	//	ニ	ﾆ
			0x30CC	:	"\uFF87"	,	//	ヌ	ﾇ
			0x30CD	:	"\uFF88"	,	//	ネ	ﾈ
			0x30CE	:	"\uFF89"	,	//	ノ	ﾉ
			0x30CF	:	"\uFF8A"	,	//	ハ	ﾊ
			0x30D0	:	"\uFF8A\uFF9E"	,	//	バ	ﾊﾞ
			0x30D1	:	"\uFF8A\uFF9F"	,	//	パ	ﾊﾟ
			0x30D2	:	"\uFF8B"	,	//	ヒ	ﾋ
			0x30D3	:	"\uFF8B\uFF9E"	,	//	ビ	ﾋﾞ
			0x30D4	:	"\uFF8B\uFF9F"	,	//	ピ	ﾋﾟ
			0x30D5	:	"\uFF8C"	,	//	フ	ﾌ
			0x30D6	:	"\uFF8C\uFF9E"	,	//	ブ	ﾌﾞ
			0x30D7	:	"\uFF8C\uFF9F"	,	//	プ	ﾌﾟ
			0x30D8	:	"\uFF8D"	,	//	ヘ	ﾍ
			0x30D9	:	"\uFF8D\uFF9E"	,	//	ベ	ﾍﾞ
			0x30DA	:	"\uFF8D\uFF9F"	,	//	ペ	ﾍﾟ
			0x30DB	:	"\uFF8E"	,	//	ホ	ﾎ
			0x30DC	:	"\uFF8E\uFF9E"	,	//	ボ	ﾎﾞ
			0x30DD	:	"\uFF8E\uFF9F"	,	//	ポ	ﾎﾟ
			0x30DE	:	"\uFF8F"	,	//	マ	ﾏ
			0x30DF	:	"\uFF90"	,	//	ミ	ﾐ
			0x30E0	:	"\uFF91"	,	//	ム	ﾑ
			0x30E1	:	"\uFF92"	,	//	メ	ﾒ
			0x30E2	:	"\uFF93"	,	//	モ	ﾓ
			0x30E3	:	"\uFF6C"	,	//	ャ	ｬ
			0x30E4	:	"\uFF94"	,	//	ヤ	ﾔ
			0x30E5	:	"\uFF6D"	,	//	ュ	ｭ
			0x30E6	:	"\uFF95"	,	//	ユ	ﾕ
			0x30E7	:	"\uFF6E"	,	//	ョ	ｮ
			0x30E8	:	"\uFF96"	,	//	ヨ	ﾖ
			0x30E9	:	"\uFF97"	,	//	ラ	ﾗ
			0x30EA	:	"\uFF98"	,	//	リ	ﾘ
			0x30EB	:	"\uFF99"	,	//	ル	ﾙ
			0x30EC	:	"\uFF9A"	,	//	レ	ﾚ
			0x30ED	:	"\uFF9B"	,	//	ロ	ﾛ
			0x30EE	:	"\uFF9C"	,	//	ヮ	ﾜ
			0x30EF	:	"\uFF9C"	,	//	ワ	ﾜ
			0x30F0	:	"\uFF72"	,	//	ヰ	ｲ
			0x30F1	:	"\uFF74"	,	//	ヱ	ｴ
			0x30F2	:	"\uFF66"	,	//	ヲ	ｦ
			0x30F3	:	"\uFF9D"	,	//	ン	ﾝ
			0x30F4	:	"\uFF73\uFF9E"	,	//	ヴ	ｳﾞ
			0x30F5	:	"\uFF76"	,	//	ヵ	ｶ
			0x30F6	:	"\uFF79"	,	//	ヶ	ｹ
			0x30F7	:	"\uFF9C\uFF9E"	,	//	ヷ	ﾜﾞ
			0x30F8	:	"\uFF72\uFF9E"	,	//	ヸ	ｲﾞ
			0x30F9	:	"\uFF74\uFF9E"	,	//	ヹ	ｴﾞ
			0x30FA	:	"\uFF66\uFF9E"	,	//	ヺ	ｦﾞ
			0x30FB	:	"\uFF65"	,	//	・	･
			0x30FC	:	"\uFF70"		//	ー	ｰ
		};
		/**
		 * @param {string} ch 
		 */
		const func = function(ch) {
			if(ch.length === 1) {
				return(map[ch.charCodeAt(0)]);
			}
			else {
				return(map[ch.charCodeAt(0)] + map[ch.charCodeAt(1)]);
			}
		};
		return (text.replace(/[\u3001\u3002\u300C\u300D\u309B\u309C\u30A1-\u30FC][\u309B\u309C]?/g, func));
	}

	/**
	 * カタカナを全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidthKana(text) {
		/**
		 * @type {Object<number, number>}
		 */
		const map = {
			0xFF61	:	0x3002	,	//	。	｡
			0xFF62	:	0x300C	,	//	「	｢
			0xFF63	:	0x300D	,	//	」	｣
			0xFF64	:	0x3001	,	//	､
			0xFF65	:	0x30FB	,	//	・	･
			0xFF66	:	0x30F2	,	//	ヲ	ｦ
			0xFF67	:	0x30A1	,	//	ァ	ｧ
			0xFF68	:	0x30A3	,	//	ィ	ｨ
			0xFF69	:	0x30A5	,	//	ゥ	ｩ
			0xFF6A	:	0x30A7	,	//	ェ	ｪ
			0xFF6B	:	0x30A9	,	//	ォ	ｫ
			0xFF6C	:	0x30E3	,	//	ャ	ｬ
			0xFF6D	:	0x30E5	,	//	ュ	ｭ
			0xFF6E	:	0x30E7	,	//	ョ	ｮ
			0xFF6F	:	0x30C3	,	//	ッ	ｯ
			0xFF70	:	0x30FC	,	//	ー	ｰ
			0xFF71	:	0x30A2	,	//	ア	ｱ
			0xFF72	:	0x30A4	,	//	イ	ｲ
			0xFF73	:	0x30A6	,	//	ウ	ｳ
			0xFF74	:	0x30A8	,	//	エ	ｴ
			0xFF75	:	0x30AA	,	//	オ	ｵ
			0xFF76	:	0x30AB	,	//	カ	ｶ
			0xFF77	:	0x30AD	,	//	キ	ｷ
			0xFF78	:	0x30AF	,	//	ク	ｸ
			0xFF79	:	0x30B1	,	//	ケ	ｹ
			0xFF7A	:	0x30B3	,	//	コ	ｺ
			0xFF7B	:	0x30B5	,	//	サ	ｻ
			0xFF7C	:	0x30B7	,	//	シ	ｼ
			0xFF7D	:	0x30B9	,	//	ス	ｽ
			0xFF7E	:	0x30BB	,	//	セ	ｾ
			0xFF7F	:	0x30BD	,	//	ソ	ｿ
			0xFF80	:	0x30BF	,	//	タ	ﾀ
			0xFF81	:	0x30C1	,	//	チ	ﾁ
			0xFF82	:	0x30C4	,	//	ツ	ﾂ
			0xFF83	:	0x30C6	,	//	テ	ﾃ
			0xFF84	:	0x30C8	,	//	ト	ﾄ
			0xFF85	:	0x30CA	,	//	ナ	ﾅ
			0xFF86	:	0x30CB	,	//	ニ	ﾆ
			0xFF87	:	0x30CC	,	//	ヌ	ﾇ
			0xFF88	:	0x30CD	,	//	ネ	ﾈ
			0xFF89	:	0x30CE	,	//	ノ	ﾉ
			0xFF8A	:	0x30CF	,	//	ハ	ﾊ
			0xFF8B	:	0x30D2	,	//	ヒ	ﾋ
			0xFF8C	:	0x30D5	,	//	フ	ﾌ
			0xFF8D	:	0x30D8	,	//	ヘ	ﾍ
			0xFF8E	:	0x30DB	,	//	ホ	ﾎ
			0xFF8F	:	0x30DE	,	//	マ	ﾏ
			0xFF90	:	0x30DF	,	//	ミ	ﾐ
			0xFF91	:	0x30E0	,	//	ム	ﾑ
			0xFF92	:	0x30E1	,	//	メ	ﾒ
			0xFF93	:	0x30E2	,	//	モ	ﾓ
			0xFF94	:	0x30E4	,	//	ヤ	ﾔ
			0xFF95	:	0x30E6	,	//	ユ	ﾕ
			0xFF96	:	0x30E8	,	//	ヨ	ﾖ
			0xFF97	:	0x30E9	,	//	ラ	ﾗ
			0xFF98	:	0x30EA	,	//	リ	ﾘ
			0xFF99	:	0x30EB	,	//	ル	ﾙ
			0xFF9A	:	0x30EC	,	//	レ	ﾚ
			0xFF9B	:	0x30ED	,	//	ロ	ﾛ
			0xFF9C	:	0x30EF	,	//	ワ	ﾜ
			0xFF9D	:	0x30F3	,	//	ン	ﾝ
			0xFF9E	:	0x309B	,	//	゛	ﾞ
			0xFF9F	:	0x309C		//	゜	ﾟ
		};
		/**
		 * @param {string} str 
		 */
		const func = function(str) {
			if(str.length === 1) {
				return (String.fromCharCode(map[str.charCodeAt(0)]));
			}
			else {
				const next = str.charCodeAt(1);
				const ch   = str.charCodeAt(0);
				if(next === 0xFF9E) {
					// Shift-JISにない濁点は無視
					// ヴ
					if (ch === 0xFF73) {
						return (String.fromCharCode(0x3094));
					}
					// ガ-ド、バ-ボ
					else if(
						((0xFF76 <= ch) && (ch <= 0xFF84)) ||
						((0xFF8A <= ch) && (ch <= 0xFF8E))	) {
						return (String.fromCharCode(map[ch] + 1));
					}
				}
				// 半濁点
				else if(next === 0xFF9F) {
					// パ-ポ
					if((0xFF8A <= ch) && (ch <= 0xFF8E)) {
						return (String.fromCharCode(map[ch] + 2));
					}
				}
				return (String.fromCharCode(map[ch]) + String.fromCharCode(map[next]));
			}
		};
		return (text.replace(/[\uFF61-\uFF9F][\uFF9E\uFF9F]?/g, func));
	}
	
	/**
	 * 半角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHalfWidth(text) {
		return Japanese.toHalfWidthKana(Japanese.toHalfWidthAsciiCode(text));
	}
	
	/**
	 * 全角にします。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toFullWidth(text) {
		return Japanese.toFullWidthKana(Japanese.toFullWidthAsciiCode(text));
	}

	/**
	 * ローマ字からひらがなに変換します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toHiraganaFromRomaji(text) {
		/**
		 * ローマ字から変換マップ
		 * @type {Object<string, string>}
		 */
		const map = {
			"a" : "あ" ,
			"i" : "い" ,
			"u" : "う" ,
			"e" : "え" ,
			"o" : "お" ,
			"ka" : "か" ,
			"ki" : "き" ,
			"ku" : "く" ,
			"ke" : "け" ,
			"ko" : "こ" ,
			"ga" : "が" ,
			"gi" : "ぎ" ,
			"gu" : "ぐ" ,
			"ge" : "げ" ,
			"go" : "ご" ,
			"sa" : "さ" ,
			"si" : "し" ,
			"su" : "す" ,
			"se" : "せ" ,
			"so" : "そ" ,
			"za" : "ざ" ,
			"zi" : "じ" ,
			"zu" : "ず" ,
			"ze" : "ぜ" ,
			"zo" : "ぞ" ,
			"ta" : "た" ,
			"ti" : "ち" ,
			"tu" : "つ" ,
			"te" : "て" ,
			"to" : "と" ,
			"da" : "だ" ,
			"di" : "ぢ" ,
			"du" : "づ" ,
			"de" : "で" ,
			"do" : "ど" ,
			"na" : "な" ,
			"ni" : "に" ,
			"nu" : "ぬ" ,
			"ne" : "ね" ,
			"no" : "の" ,
			"ha" : "は" ,
			"hi" : "ひ" ,
			"hu" : "ふ" ,
			"he" : "へ" ,
			"ho" : "ほ" ,
			"ba" : "ば" ,
			"bi" : "び" ,
			"bu" : "ぶ" ,
			"be" : "べ" ,
			"bo" : "ぼ" ,
			"pa" : "ぱ" ,
			"pi" : "ぴ" ,
			"pu" : "ぷ" ,
			"pe" : "ぺ" ,
			"po" : "ぽ" ,
			"ma" : "ま" ,
			"mi" : "み" ,
			"mu" : "む" ,
			"me" : "め" ,
			"mo" : "も" ,
			"ya" : "や" ,
			"yi" : "い" ,
			"yu" : "ゆ" ,
			"ye" : "いぇ" ,
			"yo" : "よ" ,
			"ra" : "ら" ,
			"ri" : "り" ,
			"ru" : "る" ,
			"re" : "れ" ,
			"ro" : "ろ" ,
			"wa" : "わ" ,
			"wi" : "うぃ" ,
			"wu" : "う" ,
			"we" : "うぇ" ,
			"wo" : "を" ,
			"la" : "ぁ" ,
			"li" : "ぃ" ,
			"lu" : "ぅ" ,
			"le" : "ぇ" ,
			"lo" : "ぉ" ,
			"lya" : "ゃ" ,
			"lyi" : "ぃ" ,
			"lyu" : "ゅ" ,
			"lye" : "ぇ" ,
			"lyo" : "ょ" ,
			"ltu" : "っ" ,
			"ltsu" : "っ" ,
			"xa" : "ぁ" ,
			"xi" : "ぃ" ,
			"xu" : "ぅ" ,
			"xe" : "ぇ" ,
			"xo" : "ぉ" ,
			"xya" : "ゃ" ,
			"xyi" : "ぃ" ,
			"xyu" : "ゅ" ,
			"xye" : "ぇ" ,
			"xyo" : "ょ" ,
			"xtu" : "っ" ,
			"xtsu" : "っ" ,
			"va" : "ヴぁ" ,
			"vi" : "ヴぃ" ,
			"vu" : "ヴ" ,
			"ve" : "ヴぇ" ,
			"vo" : "ヴぉ" ,
			"qa" : "くぁ" ,
			"qi" : "くぃ" ,
			"qu" : "く" ,
			"qe" : "くぇ" ,
			"qo" : "くぉ" ,
			"fa" : "ふぁ" ,
			"fi" : "ふぃ" ,
			"fu" : "ふ" ,
			"fe" : "ふぇ" ,
			"fo" : "ふぉ" ,
			"ja" : "じゃ" ,
			"ji" : "じ" ,
			"ju" : "じゅ" ,
			"je" : "じぇ" ,
			"jo" : "じょ" ,
			"cha" : "ちゃ" ,
			"chi" : "ち" ,
			"chu" : "ちゅ" ,
			"che" : "ちぇ" ,
			"cho" : "ちょ" ,
			"sha" : "しゃ" ,
			"shi" : "し" ,
			"shu" : "しゅ" ,
			"she" : "しぇ" ,
			"sho" : "しょ" ,
			"tha" : "ちゃ" ,
			"thi" : "ち" ,
			"thu" : "てゅ" ,
			"the" : "てぇ" ,
			"tho" : "てょ" ,
			"tsa" : "つぁ" ,
			"tsi" : "つぃ" ,
			"tsu" : "つ" ,
			"tse" : "つぇ" ,
			"tso" : "つぉ" ,
			"n" : "ん" ,
			"nn" : "ん" ,
			"-" : "ー" ,
			"?" : "？" ,
			"!" : "！"
		};
		/**
		 * ya, yi, yu, ye, yo
		 * @type {Object<string, string>}
		 */
		const y_komoji_map = {
			"a" : "ゃ",
			"i" : "ぃ",
			"u" : "ゅ",
			"e" : "ぇ",
			"o" : "ょ"
		};
		/**
		 * @param {string} str 
		 */
		const func = function(str) {
			const output = [];
			let y_komoji = null;
			let romaji = str.toLowerCase();
			if(romaji.length > 2) {
				if(romaji.charCodeAt(0) === romaji.charCodeAt(1)) {
					output.push("っ");
					romaji = romaji.substr(1);
				}
			}
			if(romaji.length === 3) {
				const char_1 = romaji.substr(0, 1);
				const char_2 = romaji.substr(1, 1);
				if((char_2 === "y") && (char_1 !== "l") && (char_1 !== "x")) {
					y_komoji = y_komoji_map[romaji.substr(2)];
					romaji = romaji.substr(0, 1) + "i";
				}
			}
			const data = map[romaji];
			if(!data) {
				return str;
			}
			output.push(data);
			if(y_komoji) {
				output.push(y_komoji);
			}
			return output.join("");
		};
		return (text.replace(/([xl]?[kgsztdnhbpmyrwlxvqfj])(\1)?y?[aiuoe]|[xl]?(ch|cch|sh|ssh|ts|tts|th|tth)?[aiuoe]|nn?|[?\\!-]/gi, func));
	}

	/**
	 * ローマ字からカタカナに変換します。
	 * @param {String} text - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static toKatakanaFromRomaji(text) {
		return Japanese.toKatakana(Japanese.toHiraganaFromRomaji(text));
	}

}
