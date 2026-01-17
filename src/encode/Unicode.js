/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

/**
 * 制御文字マップ
 * @type {Object<number, string>}
 * @ignore
 */
let control_charcter_map = null;

/**
 * コードポイントからUnicodeのブロック名に変換する
 * @type {(codepoint: number) => (string)}
 * @ignore
 */
let toBlockNameFromUnicode = null;

/**
 * コードポイントから異体字セレクタの判定をする
 * @type {(codepoint: number, annotate?: boolean) => (string|null)}
 * @ignore
 */
let getVariationSelectorsNumberFromCodePoint = null;

/**
 * コードポイントからタグ文字の判定をする
 * @type {(codepoint: number) => (string|null)}
 * @ignore
 */
let getTagCharacterFromCodePoint = null;

/**
 * Unicode を扱うクラス
 * @ignore
 */
export default class Unicode {

	/**
	 * 初期化
	 */
	static init() {
		if(Unicode.is_initmap) {
			return;
		}
		Unicode.is_initmap = true;

		/**
		 * 制御文字、VS、タグ文字は多いため含めていない
		 */
		control_charcter_map = {
			// --- C0 control characters (ASCII 0x00–0x1F) ---
			0:  "NUL", // Null
			1:  "SOH", // Start of Heading
			2:  "STX", // Start of Text
			3:  "ETX", // End of Text
			4:  "EOT", // End of Transmission
			5:  "ENQ", // Enquiry
			6:  "ACK", // Acknowledge
			7:  "BEL", // Bell (beep)

			8:  "BS",  // Backspace
			9:  "HT",  // Horizontal Tab
			10: "LF",  // Line Feed
			11: "VT",  // Vertical Tab
			12: "FF",  // Form Feed
			13: "CR",  // Carriage Return
			14: "SO",  // Shift Out
			15: "SI",  // Shift In

			16: "DLE", // Data Link Escape
			17: "DC1", // Device Control 1 (XON)
			18: "DC2", // Device Control 2
			19: "DC3", // Device Control 3 (XOFF)
			20: "DC4", // Device Control 4
			21: "NAK", // Negative Acknowledge
			22: "SYN", // Synchronous Idle
			23: "ETB", // End of Transmission Block

			24: "CAN", // Cancel
			25: "EM",  // End of Medium
			26: "SUB", // Substitute
			27: "ESC", // Escape
			28: "FS",  // File Separator
			29: "GS",  // Group Separator
			30: "RS",  // Record Separator
			31: "US",  // Unit Separator

			// --- DEL ---
			127: "DEL", // Delete

			// --- C1 control characters (ISO/IEC 6429, 0x80–0x9F) ---
			128: "PAD", // Padding Character
			129: "HOP", // High Octet Preset
			130: "BPH", // Break Permitted Here
			131: "NBH", // No Break Here
			132: "IND", // Index
			133: "NEL", // Next Line
			134: "SSA", // Start of Selected Area
			135: "ESA", // End of Selected Area
			136: "HTS", // Horizontal Tab Set
			137: "HTJ", // Horizontal Tab with Justification
			138: "VTS", // Vertical Tab Set
			139: "PLD", // Partial Line Down
			140: "PLU", // Partial Line Up
			141: "RI",  // Reverse Index
			142: "SS2", // Single Shift 2
			143: "SS3", // Single Shift 3
			144: "DCS", // Device Control String
			145: "PU1", // Private Use 1
			146: "PU2", // Private Use 2
			147: "STS", // Set Transmit State
			148: "CCH", // Cancel Character
			149: "MW",  // Message Waiting
			150: "SPA", // Start of Protected Area
			151: "EPA", // End of Protected Area
			152: "SOS", // Start of String
			153: "SGCI",// Single Graphic Character Introducer
			154: "SCI", // Single Character Introducer
			155: "CSI", // Control Sequence Introducer
			156: "ST",  // String Terminator
			157: "OSC", // Operating System Command
			158: "PM",  // Privacy Message
			159: "APC", // Application Program Command

			// --- Unicode but制御的に扱われる文字 ---
			160: "NBSP", // No-Break Space（表示は空白だが改行不可）
			173: "SHY",  // Soft Hyphen（通常は表示されない）

			// --- Unicode Interlinear Annotation ---
			65529: "IAA", // Interlinear Annotation Anchor
			65530: "IAS", // Interlinear Annotation Separator
			65531: "IAT", // Interlinear Annotation Terminator

			// Zero Width / Joiner 系（Cf）
			0x200B: "ZWSP",   // ZERO WIDTH SPACE ゼロ幅スペース
			0x200C: "ZWNJ",   // ZERO WIDTH NON-JOINER ゼロ幅非接合子
			0x200D: "ZWJ",    // ZERO WIDTH JOINER ゼロ幅接合子
			0x2060: "WJ",     // WORD JOINER 単語結合子
			0xFEFF: "BOM",    // BYTE ORDER MARK / ZERO WIDTH NO-BREAK SPACE

			// 双方向（BiDi）制御文字
			0x202A: "LRE",    // LEFT-TO-RIGHT EMBEDDING
			0x202B: "RLE",    // RIGHT-TO-LEFT EMBEDDING
			0x202C: "PDF",    // POP DIRECTIONAL FORMATTING
			0x202D: "LRO",    // LEFT-TO-RIGHT OVERRIDE
			0x202E: "RLO",    // RIGHT-TO-LEFT OVERRIDE

			0x2066: "LRI",    // LEFT-TO-RIGHT ISOLATE
			0x2067: "RLI",    // RIGHT-TO-LEFT ISOLATE
			0x2068: "FSI",    // FIRST STRONG ISOLATE
			0x2069: "PDI" ,   // POP DIRECTIONAL ISOLATE

			// Unicode Noncharacter（検証・防御用途）
			0xFFFE: "NONCHAR_FFFE",
			0xFFFF: "NONCHAR_FFFF"
		};

		const unicode_blockname_array = [
			"Basic Latin", "Latin-1 Supplement", "Latin Extended-A", "Latin Extended-B", "IPA Extensions", "Spacing Modifier Letters", "Combining Diacritical Marks", "Greek and Coptic", 
			"Cyrillic", "Cyrillic Supplement", "Armenian", "Hebrew", "Arabic", "Syriac", "Arabic Supplement", "Thaana", 
			"NKo", "Samaritan", "Mandaic", "Syriac Supplement", "Arabic Extended-B", "Arabic Extended-A", "Devanagari", "Bengali", 
			"Gurmukhi", "Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala", 
			"Thai", "Lao", "Tibetan", "Myanmar", "Georgian", "Hangul Jamo", "Ethiopic", "Ethiopic Supplement", 
			"Cherokee", "Unified Canadian Aboriginal Syllabics", "Ogham", "Runic", "Tagalog", "Hanunoo", "Buhid", "Tagbanwa", 
			"Khmer", "Mongolian", "Unified Canadian Aboriginal Syllabics Extended", "Limbu", "Tai Le", "New Tai Lue", "Khmer Symbols", "Buginese", 
			"Tai Tham", "Combining Diacritical Marks Extended", "Balinese", "Sundanese", "Batak", "Lepcha", "Ol Chiki", "Cyrillic Extended-C", 
			"Georgian Extended", "Sundanese Supplement", "Vedic Extensions", "Phonetic Extensions", "Phonetic Extensions Supplement", "Combining Diacritical Marks Supplement", "Latin Extended Additional", "Greek Extended", 
			"General Punctuation", "Superscripts and Subscripts", "Currency Symbols", "Combining Diacritical Marks for Symbols", "Letterlike Symbols", "Number Forms", "Arrows", "Mathematical Operators", 
			"Miscellaneous Technical", "Control Pictures", "Optical Character Recognition", "Enclosed Alphanumerics", "Box Drawing", "Block Elements", "Geometric Shapes", "Miscellaneous Symbols", 
			"Dingbats", "Miscellaneous Mathematical Symbols-A", "Supplemental Arrows-A", "Braille Patterns", "Supplemental Arrows-B", "Miscellaneous Mathematical Symbols-B", "Supplemental Mathematical Operators", "Miscellaneous Symbols and Arrows", 
			"Glagolitic", "Latin Extended-C", "Coptic", "Georgian Supplement", "Tifinagh", "Ethiopic Extended", "Cyrillic Extended-A", "Supplemental Punctuation", 
			"CJK Radicals Supplement", "Kangxi Radicals", "Ideographic Description Characters", "CJK Symbols and Punctuation", "Hiragana", "Katakana", "Bopomofo", "Hangul Compatibility Jamo", 
			"Kanbun", "Bopomofo Extended", "CJK Strokes", "Katakana Phonetic Extensions", "Enclosed CJK Letters and Months", "CJK Compatibility", "CJK Unified Ideographs Extension A", "Yijing Hexagram Symbols", 
			"CJK Unified Ideographs", "Yi Syllables", "Yi Radicals", "Lisu", "Vai", "Cyrillic Extended-B", "Bamum", "Modifier Tone Letters", 
			"Latin Extended-D", "Syloti Nagri", "Common Indic Number Forms", "Phags-pa", "Saurashtra", "Devanagari Extended", "Kayah Li", "Rejang", 
			"Hangul Jamo Extended-A", "Javanese", "Myanmar Extended-B", "Cham", "Myanmar Extended-A", "Tai Viet", "Meetei Mayek Extensions", "Ethiopic Extended-A", 
			"Latin Extended-E", "Cherokee Supplement", "Meetei Mayek", "Hangul Syllables", "Hangul Jamo Extended-B", "High Surrogates", "High Private Use Surrogates", "Low Surrogates", 
			"Private Use Area", "CJK Compatibility Ideographs", "Alphabetic Presentation Forms", "Arabic Presentation Forms-A", "Variation Selectors", "Vertical Forms", "Combining Half Marks", "CJK Compatibility Forms", 
			"Small Form Variants", "Arabic Presentation Forms-B", "Halfwidth and Fullwidth Forms", "Specials", "Linear B Syllabary", "Linear B Ideograms", "Aegean Numbers", "Ancient Greek Numbers", 
			"Ancient Symbols", "Phaistos Disc", "Lycian", "Carian", "Coptic Epact Numbers", "Old Italic", "Gothic", "Old Permic", 
			"Ugaritic", "Old Persian", "Deseret", "Shavian", "Osmanya", "Osage", "Elbasan", "Caucasian Albanian", 
			"Vithkuqi", "Linear A", "Latin Extended-F", "Cypriot Syllabary", "Imperial Aramaic", "Palmyrene", "Nabataean", "Hatran", 
			"Phoenician", "Lydian", "Meroitic Hieroglyphs", "Meroitic Cursive", "Kharoshthi", "Old South Arabian", "Old North Arabian", "Manichaean", 
			"Avestan", "Inscriptional Parthian", "Inscriptional Pahlavi", "Psalter Pahlavi", "Old Turkic", "Old Hungarian", "Hanifi Rohingya", "Rumi Numeral Symbols", 
			"Yezidi", "Arabic Extended-C", "Old Sogdian", "Sogdian", "Old Uyghur", "Chorasmian", "Elymaic", "Brahmi", 
			"Kaithi", "Sora Sompeng", "Chakma", "Mahajani", "Sharada", "Sinhala Archaic Numbers", "Khojki", "Multani", 
			"Khudawadi", "Grantha", "Newa", "Tirhuta", "Siddham", "Modi", "Mongolian Supplement", "Takri", 
			"Ahom", "Dogra", "Warang Citi", "Dives Akuru", "Nandinagari", "Zanabazar Square", "Soyombo", "Unified Canadian Aboriginal Syllabics Extended-A", 
			"Pau Cin Hau", "Devanagari Extended-A", "Bhaiksuki", "Marchen", "Masaram Gondi", "Gunjala Gondi", "Makasar", "Kawi", 
			"Lisu Supplement", "Tamil Supplement", "Cuneiform", "Cuneiform Numbers and Punctuation", "Early Dynastic Cuneiform", "Cypro-Minoan", "Egyptian Hieroglyphs", "Egyptian Hieroglyph Format Controls", 
			"Anatolian Hieroglyphs", "Bamum Supplement", "Mro", "Tangsa", "Bassa Vah", "Pahawh Hmong", "Medefaidrin", "Miao", 
			"Ideographic Symbols and Punctuation", "Tangut", "Tangut Components", "Khitan Small Script", "Tangut Supplement", "Kana Extended-B", "Kana Supplement", "Kana Extended-A", 
			"Small Kana Extension", "Nushu", "Duployan", "Shorthand Format Controls", "Znamenny Musical Notation", "Byzantine Musical Symbols", "Musical Symbols", "Ancient Greek Musical Notation", 
			"Kaktovik Numerals", "Mayan Numerals", "Tai Xuan Jing Symbols", "Counting Rod Numerals", "Mathematical Alphanumeric Symbols", "Sutton SignWriting", "Latin Extended-G", "Glagolitic Supplement", 
			"Cyrillic Extended-D", "Nyiakeng Puachue Hmong", "Toto", "Wancho", "Nag Mundari", "Ethiopic Extended-B", "Mende Kikakui", "Adlam", 
			"Indic Siyaq Numbers", "Ottoman Siyaq Numbers", "Arabic Mathematical Alphabetic Symbols", "Mahjong Tiles", "Domino Tiles", "Playing Cards", "Enclosed Alphanumeric Supplement", "Enclosed Ideographic Supplement", 
			"Miscellaneous Symbols and Pictographs", "Emoticons", "Ornamental Dingbats", "Transport and Map Symbols", "Alchemical Symbols", "Geometric Shapes Extended", "Supplemental Arrows-C", "Supplemental Symbols and Pictographs", 
			"Chess Symbols", "Symbols and Pictographs Extended-A", "Symbols for Legacy Computing", "CJK Unified Ideographs Extension B", "CJK Unified Ideographs Extension C", "CJK Unified Ideographs Extension D", "CJK Unified Ideographs Extension E", "CJK Unified Ideographs Extension F", "CJK Unified Ideographs Extension I", 
			"CJK Compatibility Ideographs Supplement", "CJK Unified Ideographs Extension G", "CJK Unified Ideographs Extension H", "CJK Unified Ideographs Extension J", "Tags", "Variation Selectors Supplement", "Supplementary Private Use Area-A", "Supplementary Private Use Area-B"
		];

		const unicode_blockaddress_array = [
			0x007F, 0x00FF, 0x017F, 0x024F, 0x02AF, 0x02FF, 0x036F, 0x03FF, 0x04FF, 0x052F, 0x058F, 0x05FF, 0x06FF, 0x074F, 0x077F, 0x07BF,
			0x07FF, 0x083F, 0x085F, 0x086F, 0x089F, 0x08FF, 0x097F, 0x09FF, 0x0A7F, 0x0AFF, 0x0B7F, 0x0BFF, 0x0C7F, 0x0CFF, 0x0D7F, 0x0DFF,
			0x0E7F, 0x0EFF, 0x0FFF, 0x109F, 0x10FF, 0x11FF, 0x137F, 0x139F, 0x13FF, 0x167F, 0x169F, 0x16FF, 0x171F, 0x173F, 0x175F, 0x177F,
			0x17FF, 0x18AF, 0x18FF, 0x194F, 0x197F, 0x19DF, 0x19FF, 0x1A1F, 0x1AAF, 0x1AFF, 0x1B7F, 0x1BBF, 0x1BFF, 0x1C4F, 0x1C7F, 0x1C8F,
			0x1CBF, 0x1CCF, 0x1CFF, 0x1D7F, 0x1DBF, 0x1DFF, 0x1EFF, 0x1FFF, 0x206F, 0x209F, 0x20CF, 0x20FF, 0x214F, 0x218F, 0x21FF, 0x22FF,
			0x23FF, 0x243F, 0x245F, 0x24FF, 0x257F, 0x259F, 0x25FF, 0x26FF, 0x27BF, 0x27EF, 0x27FF, 0x28FF, 0x297F, 0x29FF, 0x2AFF, 0x2BFF,
			0x2C5F, 0x2C7F, 0x2CFF, 0x2D2F, 0x2D7F, 0x2DDF, 0x2DFF, 0x2E7F, 0x2EFF, 0x2FDF, 0x2FFF, 0x303F, 0x309F, 0x30FF, 0x312F, 0x318F,
			0x319F, 0x31BF, 0x31EF, 0x31FF, 0x32FF, 0x33FF, 0x4DBF, 0x4DFF, 0x9FFF, 0xA48F, 0xA4CF, 0xA4FF, 0xA63F, 0xA69F, 0xA6FF, 0xA71F,
			0xA7FF, 0xA82F, 0xA83F, 0xA87F, 0xA8DF, 0xA8FF, 0xA92F, 0xA95F, 0xA97F, 0xA9DF, 0xA9FF, 0xAA5F, 0xAA7F, 0xAADF, 0xAAFF, 0xAB2F,
			0xAB6F, 0xABBF, 0xABFF, 0xD7AF, 0xD7FF, 0xDB7F, 0xDBFF, 0xDFFF, 0xF8FF, 0xFAFF, 0xFB4F, 0xFDFF, 0xFE0F, 0xFE1F, 0xFE2F, 0xFE4F,
			0xFE6F, 0xFEFF, 0xFFEF, 0xFFFF, 0x1007F, 0x100FF, 0x1013F, 0x1018F, 0x101CF, 0x101FF, 0x1029F, 0x102DF, 0x102FF, 0x1032F, 0x1034F, 0x1037F,
			0x1039F, 0x103DF, 0x1044F, 0x1047F, 0x104AF, 0x104FF, 0x1052F, 0x1056F, 0x105BF, 0x1077F, 0x107BF, 0x1083F, 0x1085F, 0x1087F, 0x108AF, 0x108FF,
			0x1091F, 0x1093F, 0x1099F, 0x109FF, 0x10A5F, 0x10A7F, 0x10A9F, 0x10AFF, 0x10B3F, 0x10B5F, 0x10B7F, 0x10BAF, 0x10C4F, 0x10CFF, 0x10D3F, 0x10E7F,
			0x10EBF, 0x10EFF, 0x10F2F, 0x10F6F, 0x10FAF, 0x10FDF, 0x10FFF, 0x1107F, 0x110CF, 0x110FF, 0x1114F, 0x1117F, 0x111DF, 0x111FF, 0x1124F, 0x112AF,
			0x112FF, 0x1137F, 0x1147F, 0x114DF, 0x115FF, 0x1165F, 0x1167F, 0x116CF, 0x1174F, 0x1184F, 0x118FF, 0x1195F, 0x119FF, 0x11A4F, 0x11AAF, 0x11ABF,
			0x11AFF, 0x11B5F, 0x11C6F, 0x11CBF, 0x11D5F, 0x11DAF, 0x11EFF, 0x11F5F, 0x11FBF, 0x11FFF, 0x123FF, 0x1247F, 0x1254F, 0x12FFF, 0x1342F, 0x1345F,
			0x1467F, 0x16A3F, 0x16A6F, 0x16ACF, 0x16AFF, 0x16B8F, 0x16E9F, 0x16F9F, 0x16FFF, 0x187FF, 0x18AFF, 0x18CFF, 0x18D7F, 0x1AFFF, 0x1B0FF, 0x1B12F,
			0x1B16F, 0x1B2FF, 0x1BC9F, 0x1BCAF, 0x1CFCF, 0x1D0FF, 0x1D1FF, 0x1D24F, 0x1D2DF, 0x1D2FF, 0x1D35F, 0x1D37F, 0x1D7FF, 0x1DAAF, 0x1DFFF, 0x1E02F,
			0x1E08F, 0x1E14F, 0x1E2BF, 0x1E2FF, 0x1E4FF, 0x1E7FF, 0x1E8DF, 0x1E95F, 0x1ECBF, 0x1ED4F, 0x1EEFF, 0x1F02F, 0x1F09F, 0x1F0FF, 0x1F1FF, 0x1F2FF,
			0x1F5FF, 0x1F64F, 0x1F67F, 0x1F6FF, 0x1F77F, 0x1F7FF, 0x1F8FF, 0x1F9FF, 0x1FA6F, 0x1FAFF, 0x1FBFF, 0x2A6DF, 0x2B73F, 0x2B81F, 0x2CEAF, 0x2EBEF, 0x2EE5F,
			0x2FA1F, 0x3134F, 0x323AF, 0x3347F, 0xE007F, 0xE01EF, 0xFFFFF, 0x10FFFF
		];

		/**
		 * コードポイントからUnicodeのブロック名に変換する
		 * 変換できない場合は "-" を返す
		 * @param {Number} codepoint - コードポイント
		 * @returns {string}
		 */
		toBlockNameFromUnicode = function(codepoint) {
			for(let i = 0; i < unicode_blockname_array.length; i++) {
				if(codepoint <= unicode_blockaddress_array[i]) {
					return unicode_blockname_array[i];
				}
			}
			return "-";
		};

		/**
		 * コードポイントから異体字セレクタの判定
		 * @param {Number} codepoint - コードポイント
		 * @param {boolean} [annotate = false] - 注釈をつけるか否か
		 * @returns {string|null} 確認結果(異体字セレクタではない場合はNULLを返す)
		 */
		getVariationSelectorsNumberFromCodePoint = function(codepoint, annotate) {
			// モンゴル自由字形選択子 U+180B〜U+180D (3個)
			if((0x180B <= codepoint) && (codepoint <= 0x180D)) {
				return "FVS" + ((codepoint - 0x180B) + 1);
			}
			// SVSで利用される異体字セレクタ U+FE00〜U+FE0F (VS1～VS16) (16個)
			if((0xFE00 <= codepoint) && (codepoint <= 0xFE0F)) {
				const n = (codepoint - 0xFE00) + 1;
				if (!annotate) return "VS" + n;
				if (codepoint === 0xFE0E) return "VS15 (text)";
				if (codepoint === 0xFE0F) return "VS16 (emoji)";
				return "VS" + n;
			}
			// IVSで利用される異体字セレクタ U+E0100〜U+E01EF (VS17～VS256) (240個)
			else if((0xE0100 <= codepoint) && (codepoint <= 0xE01EF)) {
				return "VS" + ((codepoint - 0xE0100) + 17);
			}
			return null;
		};
		
		/**
		 * コードポイントからタグ文字の判定
		 * @param {Number} codepoint - コードポイント
		 * @returns {string|null} 確認結果(タグ文字ではない場合はNULLを返す)
		 */
		getTagCharacterFromCodePoint = function(codepoint) {
			// TAG characters U+E0020..U+E007F
			if((0xE0020 <= codepoint) && (codepoint <= 0xE007F)) {
				// CANCEL TAG
				if (codepoint === 0xE007F) {
					return "CANCEL_TAG";
				}
				// TAG_20..TAG_7E のように返す
				const ascii = codepoint - 0xE0000; // 0x20..0x7E
				return "TAG_" + ascii.toString(16).toUpperCase().padStart(2, "0");
			}
			return null;
		};

	}

	/**
	 * 上位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isHighSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDBFF));
	}

	/**
	 * 下位のサロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isLowSurrogateAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xDC00 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペアの判定
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Boolean} 確認結果
	 */
	static isSurrogatePairAt(text, index) {
		const ch = text.charCodeAt(index);
		return ((0xD800 <= ch) && (ch <= 0xDFFF));
	}
	
	/**
	 * サロゲートペア対応のコードポイント取得
	 * @param {String} text - 対象テキスト
	 * @param {Number} [index = 0] - インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointAt(text, index) {
		const index_ = (index !== undefined) ? index : 0;
		if(Unicode.isHighSurrogateAt(text, index_)) {
			const high = text.charCodeAt(index_);
			const low  = text.charCodeAt(index_ + 1);
			return ((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
		}
		else {
			return (text.charCodeAt(index_));
		}
	}

	/**
	 * インデックスの前にあるコードポイント
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - インデックス
	 * @returns {Number} コードポイント
	 */
	static codePointBefore(text, index) {
		if(!Unicode.isLowSurrogateAt(text, index - 1)) {
			return (text.charCodeAt(index - 1));
		}
		else {
			return (text.codePointAt(index - 2));
		}
	}

	/**
	 * コードポイント換算で文字列数をカウント
	 * @param {String} text - 対象テキスト
	 * @param {Number} [beginIndex=0] - 最初のインデックス（省略可）
	 * @param {Number} [endIndex] - 最後のインデックス（ここは含めない）（省略可）
	 * @returns {Number} 文字数
	 */
	static codePointCount(text, beginIndex, endIndex) {
		if(beginIndex === undefined) {
			beginIndex = 0;
		}
		if(endIndex === undefined) {
			endIndex = text.length;
		}
		let count = 0;
		for(;beginIndex < endIndex;beginIndex++) {
			count++;
			if(Unicode.isSurrogatePairAt(text, beginIndex)) {
				beginIndex++;
			}
		}
		return count;
	}

	/**
	 * コードポイント換算で文字列配列の位置を計算
	 * @param {String} text - 対象テキスト
	 * @param {Number} index - オフセット
	 * @param {Number} codePointOffset - ずらすコードポイント数
	 * @returns {Number} ずらしたインデックス
	 */
	static offsetByCodePoints(text, index, codePointOffset) {
		let count = 0;
		if(codePointOffset === 0) {
			return (index);
		}
		if(codePointOffset > 0) {
			for(;index < text.length;index++) {
				count++;
				if(Unicode.isHighSurrogateAt(text, index)) {
					index++;
				}
				if(count === codePointOffset) {
					return (index + 1);
				}
			}

		}
		else {
			codePointOffset = -codePointOffset;
			for(;index >= 0;index--) {
				count++;
				if(Unicode.isLowSurrogateAt(text, index - 1)) {
					index--;
				}
				if(count === codePointOffset) {
					return (index - 1);
				}
			}
		}
		throw "error offsetByCodePoints";
	}

	/**
	 * コードポイントの数値データをUTF16の配列に変換
	 * @param {...(number|Array<number>)} codepoint - 変換したいUTF-32の配列、又はコードポイントを並べた可変引数
	 * @returns {Array<number>} 変換後のテキスト
	 */
	static toUTF16ArrayFromCodePoint() {
		/**
		 * @type {Array<number>}
		 */
		const utf16_array = [];
		/**
		 * @type {Array<number>}
		 */
		let codepoint_array = [];
		if(arguments[0].length) {
			codepoint_array = arguments[0];
		}
		else {
			for(let i = 0;i < arguments.length;i++) {
				codepoint_array[i] = arguments[i];
			}
		}
		for(let i = 0;i < codepoint_array.length;i++) {
			const codepoint = codepoint_array[i];
			if(0x10000 <= codepoint) {
				const high = (( codepoint - 0x10000 ) >> 10) + 0xD800;
				const low  = (codepoint & 0x3FF) + 0xDC00;
				utf16_array.push(high);
				utf16_array.push(low);
			}
			else {
				utf16_array.push(codepoint);
			}
		}
		return utf16_array;
	}

	/**
	 * コードポイントの数値データを文字列に変換
	 * @param {...(number|Array<number>)} codepoint - 変換したいコードポイントの数値配列、又は数値を並べた可変引数
	 * @returns {String} 変換後のテキスト
	 */
	static fromCodePoint(codepoint) {
		let utf16_array = null;
		if(codepoint instanceof Array) {
			utf16_array = Unicode.toUTF16ArrayFromCodePoint(codepoint);
		}
		else {
			const codepoint_array = [];
			for(let i = 0;i < arguments.length;i++) {
				codepoint_array[i] = arguments[i];
			}
			utf16_array = Unicode.toUTF16ArrayFromCodePoint(codepoint_array);
		}
		const text = [];
		for(let i = 0;i < utf16_array.length;i++) {
			text[text.length] = String.fromCharCode(utf16_array[i]);
		}
		return(text.join(""));
	}

	/**
	 * 文字列をUTF32(コードポイント)の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF32(コードポイント)のデータが入った配列
	 */
	static toUTF32Array(text) {
		const utf32 = [];
		for(let i = 0; i < text.length; i = Unicode.offsetByCodePoints(text, i, 1)) {
			utf32.push(Unicode.codePointAt(text, i));
		}
		return utf32;
	}

	/**
	 * UTF32の配列から文字列に変換
	 * @param {Array<number>} utf32 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF32Array(utf32) {
		return Unicode.fromCodePoint(utf32);
	}

	/**
	 * 文字列をUTF16の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF16のデータが入った配列
	 */
	static toUTF16Array(text) {
		const utf16 = [];
		for(let i = 0; i < text.length; i++) {
			utf16[i] = text.charCodeAt(i);
		}
		return utf16;
	}

	/**
	 * UTF16の配列から文字列に変換
	 * @param {Array<number>} utf16 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF16Array(utf16) {
		const text = [];
		for(let i = 0; i < utf16.length; i++) {
			text[i] = String.fromCharCode(utf16[i]);
		}
		return text.join("");
	}

	/**
	 * 文字列をUTF8の配列に変換
	 * @param {String} text - 変換したいテキスト
	 * @returns {Array<number>} UTF8のデータが入った配列
	 */
	static toUTF8Array(text) {
		return Unicode.toUTFBinaryFromCodePoint(Unicode.toUTF32Array(text), "utf-8", false);
	}

	/**
	 * UTF8の配列から文字列に変換
	 * @param {Array<number>} utf8 - 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static fromUTF8Array(utf8) {
		return Unicode.fromCodePoint(Unicode.toCodePointFromUTFBinary(utf8, "utf-8"));
	}

	/**
	 * 指定したテキストを切り出す
	 * - 単位は文字数
	 * @param {String} text - 切り出したいテキスト
	 * @param {Number} offset - 切り出し位置
	 * @param {Number} size - 切り出す長さ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForCodePoint(text, offset, size) {
		const utf32 = Unicode.toUTF32Array(text);
		const cut = [];
		for(let i = 0, point = offset; ((i < size) && (point < utf32.length)); i++, point++) {
			cut.push(utf32[point]);
		}
		return Unicode.fromUTF32Array(cut);
	}

	/**
	 * UTFのバイナリ配列からバイトオーダーマーク(BOM)を調査する
	 * @param {Array<number>} utfbinary - 調査するバイナリ配列
	 * @returns {string} 符号化形式(不明時はnull)
	 */
	static getCharsetFromBOM(utfbinary) {
		if(utfbinary.length >= 4) {
			if((utfbinary[0] === 0x00) && (utfbinary[1] === 0x00) && (utfbinary[2] === 0xFE) && (utfbinary[3] === 0xFF)) {
				return "UTF-32BE";
			}
			if((utfbinary[0] === 0xFF) && (utfbinary[1] === 0xFE) && (utfbinary[2] === 0x00) && (utfbinary[3] === 0x00)) {
				return "UTF-32LE";
			}
		}
		if(utfbinary.length >= 3) {
			if((utfbinary[0] === 0xEF) && (utfbinary[1] === 0xBB) && (utfbinary[2] === 0xBF)) {
				return "UTF-8";
			}
		}
		if(utfbinary.length >= 2) {
			if((utfbinary[0] === 0xFE) && (utfbinary[1] === 0xFF)) {
				return "UTF-16BE";
			}
			if((utfbinary[0] === 0xFF) && (utfbinary[1] === 0xFE)) {
				return "UTF-16LE";
			}
		}
		return null;
	}

	/**
	 * UTFのバイナリ配列からコードポイントに変換
	 * @param {Array<number>} binary - 変換したいバイナリ配列
	 * @param {String} [charset] - UTFの種類（省略した場合はBOM付きを期待する）
	 * @returns {Array<number>} コードポイントの配列(失敗時はnull)
	 */
	static toCodePointFromUTFBinary(binary, charset) {
		const utf32_array = [];
		let check_charset = charset;
		let offset = 0;
		// バイトオーダーマーク(BOM)がある場合は BOM を優先
		const charset_for_bom = Unicode.getCharsetFromBOM(binary);
		if(charset_for_bom) {
			check_charset = charset_for_bom;
			if(/utf-?8/i.test(charset_for_bom)) {
				offset = 3;
			}
			else if(/utf-?16/i.test(charset_for_bom)) {
				offset = 2;
			}
			else if(/utf-?32/i.test(charset_for_bom)) {
				offset = 4;
			}
		}
		// BOM付きではない＋指定もしていないので変換失敗
		if(!charset_for_bom && !charset) {
			return null;
		}
		// UTF-8
		if(/utf-?8n?/i.test(check_charset)) {
			let size = 0;
			let write = 0;
			for(let i = offset; i < binary.length; i++) {
				const bin = binary[i];
				if(size === 0) {
					if(bin < 0x80) {
						utf32_array.push(bin);
					}
					else if(bin < 0xE0) {
						size = 1;
						write = bin & 0x1F; // 0001 1111
					}
					else if(bin < 0xF0) {
						size = 2;
						write = bin & 0xF; // 0000 1111
					}
					else {
						size = 3;
						write = bin & 0x7; // 0000 0111
					}
				}
				else {
					write <<= 6;
					write |= bin & 0x3F; // 0011 1111
					size--;
					if(size === 0) {
						utf32_array.push(write);
					}
				}
			}
			return utf32_array;
		}
		// UTF-16
		else if(/utf-?16/i.test(check_charset)) {
			// UTF-16 につめる
			const utf16 = [];
			// UTF-16BE
			if(/utf-?16(be)/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 2) {
					utf16.push((binary[i] << 8) | binary[i + 1]);
				}
			}
			// UTF-16LE
			else if(/utf-?16(le)?/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 2) {
					utf16.push(binary[i] | (binary[i + 1] << 8));
				}
			}
			// UTF-32 につめる
			for(let i = 0; i < utf16.length; i++) {
				if((0xD800 <= utf16[i]) && (utf16[i] <= 0xDBFF)) {
					if(i + 2 <= utf16.length) {
						const high = utf16[i];
						const low  = utf16[i + 1];
						utf32_array.push((((high - 0xD800) << 10) | (low - 0xDC00)) + 0x10000);
					}
					i++;
				}
				else {
					utf32_array.push(utf16[i]);
				}
			}
			return utf32_array;
		}
		// UTF-32
		else {
			// UTF-32BE
			if(/utf-?32(be)/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 4) {
					utf32_array.push((binary[i] << 24) | (binary[i + 1] << 16) | (binary[i + 2] << 8) | binary[i + 3]);
				}
				return utf32_array;
			}
			// UTF-32LE
			else if(/utf-?32(le)?/i.test(check_charset)) {
				for(let i = offset; i < binary.length; i += 4) {
					utf32_array.push(binary[i] | (binary[i + 1] << 8) | (binary[i + 2] << 16) | (binary[i + 3] << 24));
				}
				return utf32_array;
			}
		}
		return null;
	}

	/**
	 * UTF32配列からバイナリ配列に変換
	 * @param {Array<number>} utf32_array - 変換したいUTF-32配列
	 * @param {String} charset - UTFの種類
	 * @param {boolean} [is_with_bom=true] - BOMをつけるかどうか
	 * @returns {Array<number>} バイナリ配列(失敗時はnull)
	 */
	static toUTFBinaryFromCodePoint(utf32_array, charset, is_with_bom) {
		let is_with_bom_ = is_with_bom !== undefined ? is_with_bom : true;
		// charset に" with BOM" が入っている場合はBOM付きとする
		if(/\s+with\s+bom$/i.test(charset)) {
			is_with_bom_ = true;
		}
		/**
		 * @type {Array<number>}
		 */
		const binary = [];
		// UTF-8
		if(/utf-?8n?/i.test(charset)) {
			// bom をつける
			if(is_with_bom_) {
				binary.push(0xEF);
				binary.push(0xBB);
				binary.push(0xBF);
			}
			for(let i = 0; i < utf32_array.length; i++) {
				let codepoint = utf32_array[i];
				// 1バイト文字
				if(codepoint <= 0x7F) {
					binary.push(codepoint);
					continue;
				}
				const buffer = [];
				let size = 0;
				// 2バイト以上
				if(codepoint < 0x800) {
					size = 2;
				}
				else if(codepoint < 0x10000) {
					size = 3;
				}
				else {
					size = 4;
				}
				for(let j = 0; j < size; j++) {
					let write = codepoint & ((1 << 6) - 1);
					if(j === size - 1) {
						if(size === 2) {
							write |= 0xC0; // 1100 0000
						}
						else if(size === 3) {
							write |= 0xE0; // 1110 0000
						}
						else {
							write |= 0xF0; // 1111 0000
						}
						buffer.push(write);
						break;
					}
					buffer.push(write | 0x80); // 1000 0000
					codepoint = codepoint >> 6;
				}
				// 反転
				for(let j = buffer.length - 1; j >= 0; j--) {
					binary.push(buffer[j]);
				}
			}
			return binary;
		}
		// UTF-16
		else if(/utf-?16/i.test(charset)) {
			// UTF-16 に詰め替える
			const utf16_array = Unicode.toUTF16ArrayFromCodePoint(utf32_array);
			// UTF-16BE
			if(/utf-?16(be)/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFE);
					binary.push(0xFF);
				}
				for(let i = 0; i < utf16_array.length; i++ ) {
					binary.push(utf16_array[i] >> 8);
					binary.push(utf16_array[i] & 0xff);
				}
			}
			// UTF-16LE
			else if(/utf-?16(le)?/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFF);
					binary.push(0xFE);
				}
				for(let i = 0; i < utf16_array.length; i++ ) {
					binary.push(utf16_array[i] & 0xff);
					binary.push(utf16_array[i] >> 8);
				}
			}
			return binary;
		}
		// UTF-32
		else if(/utf-?32/i.test(charset)) {
			// UTF-32BE
			if(/utf-?32(be)/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0x00);
					binary.push(0x00);
					binary.push(0xFE);
					binary.push(0xFF);
				}
				for(let i = 0; i < utf32_array.length; i++) {
					binary.push((utf32_array[i] >> 24) & 0xff);
					binary.push((utf32_array[i] >> 16) & 0xff);
					binary.push((utf32_array[i] >> 8) & 0xff);
					binary.push(utf32_array[i] & 0xff);
				}
			}
			// UTF-32LE
			else if(/utf-?32(le)?/i.test(charset)) {
				// bom をつける
				if(is_with_bom_) {
					binary.push(0xFF);
					binary.push(0xFE);
					binary.push(0x00);
					binary.push(0x00);
				}
				for(let i = 0; i < utf32_array.length; i++) {
					binary.push(utf32_array[i] & 0xff);
					binary.push((utf32_array[i] >> 8) & 0xff);
					binary.push((utf32_array[i] >> 16) & 0xff);
					binary.push((utf32_array[i] >> 24) & 0xff);
				}
			}
			return binary;
		}
		return null;
	}

	/**
	 * コードポイントからUnicodeのブロック名に変換する
	 * 変換できない場合は "-" を返す
	 * @param {Number} codepoint - コードポイント
	 * @returns {string}
	 */
	static toBlockNameFromUnicode(codepoint) {
		Unicode.init();
		return toBlockNameFromUnicode(codepoint);
	}

	/**
	 * コードポイントから制御文字名に変換する
	 * 変換できない場合は null を返す
	 * @param {Number} codepoint - コードポイント
	 * @returns {string}
	 */
	static toControlCharcterName(codepoint) {
		Unicode.init();

		// 異体字セレクタの確認を行い、異体字セレクタ用の制御文字(FVS, VSx)を返す
		const info_variation_selectors_number = getVariationSelectorsNumberFromCodePoint(codepoint);
		if(info_variation_selectors_number !== null) {
			return info_variation_selectors_number;
		}
		// タグ文字の確認を行い、タグ文字用の制御文字(TAG_xx)を返す
		const info_tag_character = getTagCharacterFromCodePoint(codepoint);
		if(info_tag_character !== null) {
			return info_tag_character;
		}
		// その他の制御文字の確認を行う
		const name = control_charcter_map[codepoint];
		return name ? name : null;
	}

	/**
	 * コードポイントからグラフェム（見た目の1文字）を構成する文字の判定
	 * 
	 * 含まれるもの:
	 * - 結合文字 (Mn / Mc / Me ※VS除外)
	 * - 異体字セレクタ (VS / IVS / FVS)
	 * - スキントーン修飾子（EMOJI MODIFIER FITZPATRICK）
	 * - タグ文字（TAG CHARACTER）
	 * - ゼロ幅接合子
	 * 
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isGraphemeComponentFromCodePoint(codepoint) {
		return (
			Unicode.isCombiningMarkFromCodePoint(codepoint) || 	// 結合文字
			Unicode.isVariationSelectorFromCodePoint(codepoint) ||	// 異体字セレクタ
			Unicode.isEmojiModifierFromCodePoint(codepoint) ||	// スキントーン修飾子
			Unicode.isTagCharacterFromCodePoint(codepoint) ||	// タグ文字
			(codepoint === 0x200D) // ZWJ (ZERO WIDTH JOINER) ゼロ幅接合子
		);
	}

	/**
	 * コードポイントから「表示上の横幅が 0 の文字」の文字の判定
	 * 
	 * 含まれるもの:
	 * - ゼロ幅スペース, ゼロ幅非接合子, ゼロ幅接合子, 単語結合子
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isZeroWidthCharacterFromCodePoint(codepoint) {
		return (
			(codepoint === 0x200B) || // ZWSP (ZERO WIDTH SPACE) ゼロ幅スペース
			(codepoint === 0x200C) || // ZWNJ (ZERO WIDTH NON-JOINER) ゼロ幅非接合子
			(codepoint === 0x200D) || // ZWJ (ZERO WIDTH JOINER) ゼロ幅接合子
			(codepoint === 0x2060) // WJ (WORD JOINER) 単語結合子
		);
	}
	
	/**
	 * コードポイントから結合文字の判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isCombiningMarkFromCodePoint(codepoint) {
		// 異体字セレクタは除外
		if (Unicode.isVariationSelectorFromCodePoint(codepoint)) {
			return false;
		}
		try {
			return new RegExp("\\p{Mark}", "u").test(String.fromCodePoint(codepoint));
		} catch (e) {
			// フォールバック処理
			return (
				// Combining Diacritical Marks
				((0x0300 <= codepoint) && (codepoint <= 0x036F)) ||
				// Combining Diacritical Marks Extended
				((0x1AB0 <= codepoint) && (codepoint <= 0x1AFF)) ||
				// Combining Diacritical Marks Supplement
				((0x1DC0 <= codepoint) && (codepoint <= 0x1DFF)) ||
				// Combining Diacritical Marks for Symbols
				((0x20D0 <= codepoint) && (codepoint <= 0x20FF)) ||
				// 日本語に含まれる2種類の文字
				// COMBINING VOICED SOUND MARK
				// COMBINING SEMI-VOICED SOUND MARK
				((0x3099 <= codepoint) && (codepoint <= 0x309A)) ||
				// Combining Half Marks
				((0xFE20 <= codepoint) && (codepoint <= 0xFE2F))
			);
		}
	}

	/**
	 * コードポイントから異体字セレクタの判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isVariationSelectorFromCodePoint(codepoint) {
		return (
			// モンゴル自由字形選択子 U+180B〜U+180D (3個)
			((0x180B <= codepoint) && (codepoint <= 0x180D)) ||
			// SVSで利用される異体字セレクタ U+FE00〜U+FE0F (VS1～VS16) (16個)
			((0xFE00 <= codepoint) && (codepoint <= 0xFE0F)) ||
			// IVSで利用される異体字セレクタ U+E0100〜U+E01EF (VS17～VS256) (240個)
			((0xE0100 <= codepoint) && (codepoint <= 0xE01EF))
		);
	}

	/**
	 * コードポイントからスキントーン修飾子の判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isEmojiModifierFromCodePoint(codepoint) {
		return (
			// EMOJI MODIFIER FITZPATRICK
			((0x1F3FB <= codepoint) && (codepoint <= 0x1F3FF))
		);
	}

	/**
	 * コードポイントからタグ文字の判定
	 * @param {Number} codepoint - コードポイント
	 * @returns {boolean} 確認結果
	 */
	static isTagCharacterFromCodePoint(codepoint) {
		return (
			// TAG CHARACTER
			((0xE0000 <= codepoint) && (codepoint <= 0xE007F))
		);
	}

}

/**
 * マップを初期化した否か
 */
Unicode.is_initmap = false;

