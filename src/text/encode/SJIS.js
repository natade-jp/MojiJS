/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Unicode from "./Unicode.js";

export default class SJIS {

	/**
	 * 文字列を Shift_JIS の配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Array} Shift_JIS のデータが入った配列
	 */
	static toSJISArray(text, unicode_to_sjis) {
		const map = unicode_to_sjis;
		const utf32 = Unicode.toUTF32Array(text);
		const sjis = [];
		const ng = "?".charCodeAt(0);
		for(let i = 0; i < utf32.length; i++) {
			const map_bin = map[utf32[i]];
			if(map_bin) {
				sjis.push(map_bin);
			}
			else {
				sjis.push(ng);
			}
		}
		return sjis;
	}

	/**
	 * 文字列を Shift_JIS のバイナリ配列へ変換します。
	 * @param {String} text 変換したいテキスト
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Array} Shift_JIS のデータが入ったバイナリ配列
	 */
	static toSJISArrayBinary(text, unicode_to_sjis) {
		const sjis = SJIS.toSJISArray(text, unicode_to_sjis);
		const sjisbin = [];
		for(let i = 0; i < sjis.length; i++) {
			if(sjis[i] < 0x100) {
				sjisbin.push(sjis[i]);
			}
			else {
				sjisbin.push(sjis[i] >> 8);
				sjisbin.push(sjis[i] & 0xFF);
			}

		}
		return sjisbin;
	}

	/**
	 * SJISの配列から文字列へ戻します。
	 * @param {Array} sjis 変換したいテキスト
	 * @param {Array} sjis_to_unicode Shift_JIS から Unicode への変換マップ
	 * @returns {String} 変換後のテキスト
	 */
	static fromSJISArray(sjis, sjis_to_unicode) {
		const map = sjis_to_unicode;
		const utf16 = [];
		const ng = "?".charCodeAt(0);
		for(let i = 0; i < sjis.length; i++) {
			let x = sjis[i];
			let y = -1;
			if(x >= 0x100) {
				// すでに1つの変数にまとめられている
				y = map[x];
			}
			else {
				// 2バイト文字かのチェック
				if( ((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)) ) {
					x <<= 8;
					i++;
					x |= sjis[i];
					y = map[x];
				}
				else {
					y = map[x];
				}
			}
			if(y) {
				// 配列なら配列を結合
				// ※ Unicodeの結合文字の可能性があるため
				if(y instanceof Array) {
					for(let j = 0; j < y.length; j++) {
						utf16.push(y[j]);
					}
				}
				// 値しかない場合は値を結合
				else {
					utf16.push(y);
				}
			}
			else {
				utf16.push(ng);
			}
		}
		return Unicode.fromUTF16Array(utf16);
	}

	/**
	 * 指定したテキストの横幅を Shift_JIS の換算で計算します。
	 * つまり半角を1、全角を2としてカウントします。
	 * なお、 Shift_JIS の範囲にない文字は2としてカウントします。
	 * @param {String} text カウントしたいテキスト
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Number} 文字の横幅
	 */
	static getWidthForSJIS(text, unicode_to_sjis) {
		return SJIS.toSJISArrayBinary(text, unicode_to_sjis).length;
	}

	/**
	 * 指定したテキストの横幅を Shift_JIS の換算した場合に、
	 * 単位は見た目の位置となります。
	 * @param {String} text 切り出したいテキスト
	 * @param {Number} offset 切り出し位置
	 * @param {Number} size 切り出す長さ
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @param {Array} sjis_to_unicode Shift_JIS から Unicode への変換マップ
	 * @returns {String} 切り出したテキスト
	 */
	static cutTextForSJIS(text, offset, size, unicode_to_sjis, sjis_to_unicode) {
		const sjisbin = SJIS.toSJISArrayBinary(text, unicode_to_sjis);
		const cut = [];
		const SPACE = 0x20 ; // ' '

		if(offset > 0) {
			// offset が1文字以降の場合、
			// その位置が、2バイト文字の途中かどうか判定が必要である。
			// そのため、1つ前の文字をしらべる。
			// もし2バイト文字であれば、1バイト飛ばす。
			const x = sjisbin[offset - 1];
			if( ((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)) ) {
				cut.push(SPACE);
				offset++;
				size--;
			}
		}
		
		let is_2byte = false;

		for(let i = 0, point = offset; ((i < size) && (point < sjisbin.length)); i++, point++) {
			const x = sjisbin[point];
			if(!is_2byte && (((0x81 <= x) && (x <= 0x9F)) || ((0xE0 <= x) && (x <= 0xFC)))) {
				is_2byte = true;
			}
			else {
				is_2byte = false;
			}
			// 最後の文字が2バイト文字の1バイト目かどうかの判定
			if((i === size - 1) && is_2byte) {
				cut.push(SPACE);
			}
			else {
				cut.push(x);
			}
		}
		return SJIS.fromSJISArray(cut, sjis_to_unicode);
	}

	/**
	 * 指定したコードポイントの文字から Shift_JIS 上の符号化数値に変換する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Number} 符号化数値(変換できない場合はnullとなる)
	 */
	static toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const utf16_text = Unicode.fromUTF32Array([unicode_codepoint]);
		const sjis_array = SJIS.toSJISArray(utf16_text, unicode_to_sjis);
		return sjis_array[0];
	}

	/**
	 * 指定した Shift_JIS-2004 のコードから面区点番号を取得する
	 * @param {Number} sjis_code Shift_JIS-2004 のコードポイント
	 * @returns {Object} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTenFromSJIS2004Code(sjis_code) {
		if(!sjis_code) {
			return null;
		}
		const x = sjis_code;
		if(x < 0x100) {
			return null;
		}
		// アルゴリズムは面区点番号表からリバースエンジニアリング

		let s1 = x >> 8;
		let s2 = x & 0xFF;
		let men = 0;
		let ku = 0;
		let ten = 0;

		// 面情報の位置判定
		if(s1 < 0xF0) {
			men = 1;
			// 区の計算方法の切り替え
			// 63区から、0x9F→0xE0に飛ぶ
			if(s1 < 0xE0) {
				s1 = s1 - 0x81;
			}
			else {
				s1 = s1 - 0xC1;
			}
		}
		else {
			// ※2面は第4水準のみ
			men = 2;
			// 2面1区 ～ 2面8区
			if((((s1 === 0xF0) || (s1 === 0xF2)) && (s2 < 0x9F)) || (s1 === 0xF1)) {
				s1 = s1 - 0xF0;
			}
			// 2面12区 ～ 2面15区
			else if(((s1 === 0xF4) && (s2 < 0x9F)) || (s1 < 0xF4)) {
				s1 = s1 - 0xED;
			}
			// 2面78区 ～ 2面94区
			else {
				s1 = s1 - 0xCE;
			}
		}

		// 区情報の位置判定
		if(s2 < 0x9f) {
			ku = s1 * 2 + 1;
			// 点情報の計算方法の切り替え
			// 0x7Fが欠番のため「+1」を除去
			if(s2 < 0x80) {
				s2 = s2 - 0x40 + 1;
			}
			else {
				s2 = s2 - 0x40;
			}
		}
		else {
			ku = s1 * 2 + 2;
			s2 = s2 - 0x9f + 1;
		}

		// 点情報の位置判定
		ten = s2;

		return {
			text : "" + men + "-" + ku + "-" + ten,
			men : men,
			ku : ku,
			ten : ten
		};
	}

	/**
	 * 指定したコードポイントの文字から Shift_JIS-2004 上の面区点番号を取得する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS-2004 への変換マップ
	 * @returns {Object} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toMenKuTenFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toMenKuTenFromSJIS2004Code(x);
	}
	
	/**
	 * 指定した面区点番号から Shift_JIS-2004 コードを取得する
	 * @param {Object} menkuten 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Number} Shift_JIS-2004 のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJIS2004CodeFromMenKuTen(menkuten) {
		let m, k, t;
		if(menkuten instanceof Object) {
			m = menkuten.men ? menkuten.men : 1;
			k = menkuten.ku;
			t = menkuten.ten;
		}
		else if((typeof menkuten === "string")||(menkuten instanceof String)) {
			const strmkt = menkuten.split("-");
			if(strmkt.length === 3) {
				m = parseInt(strmkt[0], 10);
				k = parseInt(strmkt[1], 10);
				t = parseInt(strmkt[2], 10);
			}
			else if(strmkt.length === 2) {
				m = 1;
				k = parseInt(strmkt[0], 10);
				t = parseInt(strmkt[1], 10);
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		else {		
			throw "IllegalArgumentException";
		}

		let s1 = -1;
		let s2 = -1;
		const kmap = {1:1,3:1,4:1,5:1,8:1,12:1,13:1,14:1,15:1};

		// 参考
		// 2019/1/1 Shift JIS - Wikipedia
		// https://en.wikipedia.org/wiki/Shift_JIS
		//
		// 区や点の判定部分は、通常94までであるため、正確にはkやtは <=94 とするべき。
		// しかし、Shift_JIS範囲外（IBM拡張漢字）でも利用されるため制限を取り払っている。

		if(m === 1) {
			if((1 <= k) && (k <= 62)) {
				s1 = Math.floor((k + 257) / 2);
			}
			else if(63 <= k) {
				s1 = Math.floor((k + 385) / 2);
			}
		}
		else if(m === 2) {
			if(kmap[k]) {
				s1 = Math.floor((k + 479) / 2) - (Math.floor(k / 8) * 3);
			}
			else if(78 <= k) {
				s1 = Math.floor((k + 411) / 2);
			}
		}

		if((k % 2) === 1) {
			if((1 <= t) && (t <= 63)) {
				s2 = t + 63;
			}
			else if(64 <= t) {
				s2 = t + 64;
			}
		}
		else {
			s2 = t + 158;
		}

		if((s1 === -1) || (s2 === -1)) {
			return null;
		}
		return (s1 << 8) | s2;
	}
	
	/**
	 * 指定した面区点番号から Unicode コードポイントを取得する
	 * @param {Object} menkuten 面区点番号
	 * @param {Array} sjis_to_unicode Shift_JIS-2004 から Unicode への変換マップ
	 * @returns {Array} UTF-32の配列(存在しない場合はnullを返す)
	 */
	static toUnicodeCodeFromMenKuTen(menkuten, sjis_to_unicode) {
		const sjis_code = SJIS.toSJIS2004CodeFromMenKuTen(menkuten);
		if(!sjis_code) {
			return null;
		}
		const unicode = sjis_to_unicode[sjis_code];
		if(!unicode) {
			return null;
		}
		if(unicode instanceof Array) {
			return unicode;
		}
		else {
			return [unicode];
		}
	}

	/**
	 * 指定した Shift_JIS のコードから区点番号を取得する
	 * @param {Number} sjis_code Shift_JIS のコードポイント
	 * @returns {Object} 区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTenFromSJISCode(sjis_code) {
		if(!sjis_code) {
			return null;
		}
		const x = sjis_code;
		if(x < 0x100) {
			return null;
		}
		// アルゴリズムは区点番号表からリバースエンジニアリング

		let s1 = x >> 8;
		let s2 = x & 0xFF;
		let ku = 0;
		let ten = 0;

		// 区の計算方法の切り替え
		// 63区から、0x9F→0xE0に飛ぶ
		if(s1 < 0xE0) {
			s1 = s1 - 0x81;
		}
		else {
			s1 = s1 - 0xC1;
		}

		// 区情報の位置判定
		if(s2 < 0x9f) {
			ku = s1 * 2 + 1;
			// 点情報の計算方法の切り替え
			// 0x7Fが欠番のため「+1」を除去
			if(s2 < 0x80) {
				s2 = s2 - 0x40 + 1;
			}
			else {
				s2 = s2 - 0x40;
			}
		}
		else {
			ku = s1 * 2 + 2;
			s2 = s2 - 0x9f + 1;
		}

		// 点情報の位置判定
		ten = s2;

		return {
			text : ku + "-" + ten,
			ku : ku,
			ten : ten
		};
	}
	
	/**
	 * 指定したコードポイントの文字から Shift_JIS 上の面区点番号を取得する
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Object} 面区点番号(存在しない場合（1バイトのJISコードなど）はnullを返す)
	 */
	static toKuTenFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return null;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toKuTenFromSJISCode(x);
	}

	/**
	 * 指定した区点番号から Shift_JIS コードを取得する
	 * @param {Object} kuten 面区点番号
	 * @returns {Number} Shift_JIS のコードポイント(存在しない場合はnullを返す)
	 */
	static toSJISCodeFromKuTen(kuten) {
		// 1～94区まで存在しているため面句点変換用で流用可能。
		// ただ、CP932の場合、範囲外の区、115区〜119区にIBM拡張文字が存在している。
		// 今回、toSJIS2004CodeFromMenKuTenでは区の範囲チェックをしないため問題なし。
		return SJIS.toSJIS2004CodeFromMenKuTen(kuten);
	}
	
	/**
	 * 指定した区点番号から Unicode コードポイントを取得する
	 * @param {Object} kuten 区点番号
	 * @param {Array} sjis_to_unicode Shift_JIS-2004 から Unicode への変換マップ
	 * @returns {Array} UTF-32の配列(存在しない場合はnullを返す)
	 */
	static toUnicodeCodeFromKuTen(menkuten, sjis_to_unicode) {
		const sjis_code = SJIS.toSJISCodeFromKuTen(menkuten);
		if(!sjis_code) {
			return null;
		}
		const unicode = sjis_to_unicode[sjis_code];
		if(!unicode) {
			return null;
		}
		if(unicode instanceof Array) {
			return unicode;
		}
		else {
			return [unicode];
		}
	}

	/**
	 * JIS漢字水準（JIS Chinese character standard）を調べる
	 * @param {Number} sjis_code Shift_JIS-2004 のコードポイント
	 * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
	 */
	static toJISKanjiSuijunFromSJISCode(sjis_code) {
		if(!sjis_code) {
			return 0;
		}
		const menkuten = SJIS.toMenKuTenFromSJIS2004Code(sjis_code);
		// アルゴリズムはJIS漢字一覧表からリバースエンジニアリング
		if(!menkuten) {
			return 0;
		}
		// 2面は第4水準
		if(menkuten.men > 1) {
			return 4;
		}
		// 1面は第1～3水準
		if(menkuten.ku < 14) {
			// 14区より小さいと非漢字
			return 0;
		}
		if(menkuten.ku < 16) {
			// 14区と15区は第3水準
			return 3;
		}
		if(menkuten.ku < 47) {
			return 1;
		}
		// 47区には、第1水準と第3水準が混じる
		if(menkuten.ku === 47) {
			if(menkuten.ten < 52) {
				return 1;
			}
			else {
				return 3;
			}
		}
		if(menkuten.ku < 84) {
			return 2;
		}
		// 84区には、第2水準と第3水準が混じる
		if(menkuten.ku === 84) {
			if(menkuten.ten < 7) {
				return 2;
			}
			else {
				return 3;
			}
		}
		// 残り94区まで第3水準
		if(menkuten.ku < 95) {
			return 3;
		}
		return 0;
	}

	/**
	 * JIS漢字水準（JIS Chinese character standard）を調べる
	 * @param {Number} unicode_codepoint Unicodeのコードポイント
	 * @param {Array} unicode_to_sjis Unicode から Shift_JIS への変換マップ
	 * @returns {Number} -1...変換不可, 0...水準なし, 1...第1水準, ...
	 */
	static toJISKanjiSuijunFromUnicode(unicode_codepoint, unicode_to_sjis) {
		if(!unicode_to_sjis[unicode_codepoint]) {
			return -1;
		}
		const x = SJIS.toSJISCodeFromUnicode(unicode_codepoint, unicode_to_sjis);
		return SJIS.toJISKanjiSuijunFromSJISCode(x);
	}

	/**
	 * 指定した面区点番号から Shift_JIS の仕様上、正規な物かチェックする
	 * @param {Object} menkuten 面区点番号（面が省略された場合は、1とみなす）
	 * @returns {Boolean} 正規なデータは true, 不正なデータは false
	 */
	static isRegularMenKuten(menkuten) {
		let m, k, t;
		if(menkuten instanceof Object) {
			m = menkuten.men ? menkuten.men : 1;
			k = menkuten.ku;
			t = menkuten.ten;
		}
		else if((typeof menkuten === "string")||(menkuten instanceof String)) {
			const strmkt = menkuten.split("-");
			if(strmkt.length === 3) {
				m = parseInt(strmkt[0], 10);
				k = parseInt(strmkt[1], 10);
				t = parseInt(strmkt[2], 10);
			}
			else if(strmkt.length === 2) {
				m = 1;
				k = parseInt(strmkt[0], 10);
				t = parseInt(strmkt[1], 10);
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
		const kmap = {1:1,3:1,4:1,5:1,8:1,12:1,13:1,14:1,15:1};
		if(m === 1) {
			if(!((1 <= k) && (k <= 94))) {
				return false;
			}
		}
		else if(m === 2) {
			if(!((kmap[k]) || ((78 <= k) && (k <= 94)))) {
				return false;
			}
		}
		else {
			return false;
		}
		if(!((1 <= t) && (t <= 94))) {
			return false;
		}
		return true;
	}

}
