/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import BigInteger from "./BigInteger.mjs";

export default class BigDecimal {

	constructor() {
		this.integer = 0;
		this._scale = 0;
		let p1 = 0;
		let p2 = 0;
		let p3 = null;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if(arguments.length >= 3) {
			p3 = arguments[2];
		}
		// BigDecimal(BigInteger val, MathContext mc)
		if(p2 instanceof MathContext) {
			p3 = p2;
		}
		if(p1 instanceof BigDecimal) {
			// Senko.println(p1.integer);
			this.integer	= p1.integer.clone();
			this._scale		= p1._scale;
			this.int_string	= p1.int_string;
		}
		else if(p1 instanceof BigInteger) {
			this.integer = p1.clone();
			this._scale   = p2;
		}
		else if(typeof p1 === "number") {
			// 整数か
			if(p1 === Math.floor(p1)) {
				this.integer = new BigInteger(p1);
				this._scale   = 0;
			}
			// 実数か
			else {
				this._scale = 0;
				while(true) {
					p1 = p1 * 10;
					this._scale = this._scale + 1;
					if(p1 === Math.floor(p1)) {
						break;
					}
				}
				this.integer = new BigInteger(p1);
			}
		}
		else if(typeof p1 === "string") {
			this._scale = 0;
			let buff;
			// 正規化
			let text = p1.replace(/\s/g, "").toLowerCase();
			// +-の符号があるか
			let number_text = "";
			buff = text.match(/^[+-]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				if(buff.indexOf("-") !== -1) {
					number_text += "-";
				}
			}
			// 整数部があるか
			buff = text.match(/^[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				number_text += buff;
			}
			// 小数部があるか
			buff = text.match(/^\.[0-9]+/);
			if(buff !== null) {
				buff = buff[0];
				text = text.substr(buff.length);
				buff = buff.substr(1);
				this._scale   = this._scale + buff.length;
				number_text += buff;
			}
			// 指数表記があるか
			buff = text.match(/^e[+-]?[0-9]+/);
			if(buff !== null) {
				buff = buff[0].substr(1);
				this._scale   = this._scale - parseInt(buff, 10);
			}
			this.integer = new BigInteger(number_text, 10);
		}
		if(p3 instanceof MathContext) {
			const newbigdecimal = this.round(p3);
			this.integer	= newbigdecimal.integer;
			this._scale		= newbigdecimal._scale;
		}
		//	Senko.println(p1 + "\t\n->\t[" + this.integer + "," + this._scale +"]\n\t"+ this.toEngineeringString() );
	}

	_getUnsignedIntegerString() {
		// キャッシュする
		if(typeof this.int_string === "undefined") {
			this.int_string = this.integer.toString(10).replace(/^-/, "");
		}
		return this.int_string;
	}

	clone() {
		return new BigDecimal(this);
	}

	scale() {
		return this._scale;
	}

	signum() {
		return this.integer.signum();
	}

	precision() {
		return this._getUnsignedIntegerString().length;
	}

	unscaledValue() {
		return new BigInteger(this.integer);
	}

	toScientificNotation(e) {
		const text	= this._getUnsignedIntegerString();
		let s		= this.scale();
		const x		= [];
		let i, k;
		// -
		if(this.signum() === -1) {
			x[x.length] = "-";
		}
		// 表示上の桁数
		s = - e - s;
		// 小数点が付かない
		if(s >= 0) {
			x[x.length] = text;
			for(i = 0; i < s; i++) {
				x[x.length] = "0";
			}
		}
		// 小数点が付く
		else {
			k = this.precision() + s;
			if(0 < k) {
				x[x.length] = text.substring(0, k);
				x[x.length] = ".";
				x[x.length] = text.substring(k, text.length);
			}
			else {
				k = - k;
				x[x.length] = "0.";
				for(i = 0; i < k; i++) {
					x[x.length] = "0";
				}
				x[x.length] = text;
			}
		}
		x[x.length] = "E";
		if(e >= 0) {
			x[x.length] = "+";
		}
		x[x.length] = e;
		return x.join("");
	}

	toString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			return this.toScientificNotation(x);
		}
	}

	toEngineeringString() {
		// 「調整された指数」
		const x = - this.scale() + (this.precision() - 1);
		// スケールが 0 以上で、「調整された指数」が -6 以上
		if((this.scale() >= 0) && (x >= -6)) {
			return this.toPlainString();
		}
		else {
			// 0 でない値の整数部が 1 〜 999 の範囲に収まるように調整
			return this.toScientificNotation(Math.floor(x / 3) * 3);
		}
	}

	toPlainString() {
		// スケールの変換なし
		if(this.scale() === 0) {
			if(this.signum() < 0) {
				return "-" + this._getUnsignedIntegerString();
			}
			else {
				return this._getUnsignedIntegerString();
			}
		}
		// 指数0で文字列を作成後、Eの後ろの部分をとっぱらう
		const text = this.toScientificNotation(0);
		return text.match(/^[^E]*/)[0];
	}

	ulp() {
		return new BigDecimal(BigInteger.ONE, this.scale());
	}

	setScale(newScale, roundingMode) {
		if(this.scale() === newScale) {
			// scaleが同一なので処理の必要なし
			return(this.clone());
		}
		if(arguments.length === 1) {
			roundingMode = RoundingMode.UNNECESSARY;
		}
		else {
			roundingMode = RoundingMode.getRoundingMode(roundingMode);
		}
		// 文字列を扱ううえで、符号があるとやりにくいので外しておく
		let text		= this._getUnsignedIntegerString();
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		// scale の誤差
		// 0 以上なら 0 を加えればいい。0未満なら0を削るか、四捨五入など丸めを行う
		const delta		= newScale - this.scale();	// この桁分増やすといい
		if(0 <= delta) {
			// 0を加える
			let i;
			for(i = 0; i < delta; i++) {
				text = text + "0";
			}
			return new BigDecimal(new BigInteger(sign_text + text), newScale);
		}
		const keta			= text.length + delta;		// 最終的な桁数
		const keta_marume		= keta + 1;
		if(keta <= 0) {
			// 指定した scale では設定できない場合
			// 例えば "0.1".setScale(-2), "10".setScale(-3) としても表すことは不可能であるため、
			// sign（-1, 0, +1）のどれかの数値を使用して丸める
			const outdata = (sign + roundingMode.getAddNumber(sign)) / 10;
			// 上記の式は、CEILINGなら必ず1、正でCEILINGなら1、負でFLOORなら1、それ以外は0となり、
			// さらに元々の数値が 0 なら 0、切り捨て不能なら例外が返る計算式である。
			// これは Java の動作をまねています。
			return new BigDecimal(new BigInteger(outdata), newScale);
		}
		{
			// 0を削るだけで解決する場合
			// 単純な切捨て(0を削るのみ)
			const zeros			= text.match(/0+$/);
			const zero_length		= (zeros !== null) ? zeros[0].length : 0;
			if(( (zero_length + delta) >= 0 ) || (roundingMode === RoundingMode.DOWN)) {
				return new BigDecimal(new BigInteger(sign_text + text.substring(0, keta)), newScale);
			}
		}
		{
			// 丸め計算で解決する場合
			// 12345 -> '123'45
			text = text.substring(0, keta_marume);
			// 丸め計算に必要な切り取る桁数(後ろの1～2桁を取得)
			const cutsize = text.length > 1 ? 2 : 1;
			// '123'45 -> 1'23'4
			const number = parseInt(text.substring(text.length - cutsize, text.length)) * sign;
			// 「元の数」と「丸めに必要な数」を足す
			const x1 = new BigInteger(sign_text + text);
			const x2 = new BigInteger(roundingMode.getAddNumber(number));
			text = x1.add(x2).toString();
			// 丸め後の桁数に戻して
			return new BigDecimal(new BigInteger(text.substring(0, text.length - 1)), newScale);
		}
	}

	round(mc) {
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const newPrecision	= mc.getPrecision();
		const delta			= newPrecision - this.precision();
		if((delta === 0)||(newPrecision === 0)) {
			return this.clone();
		}
		const newBigDecimal = this.setScale( this.scale() + delta, mc.getRoundingMode());
		/* 精度を上げる必要があるため、0を加えた場合 */
		if(delta > 0) {
			return newBigDecimal;
		}
		/* 精度を下げる必要があるため、丸めた場合は、桁の数が正しいか調べる */
		if(newBigDecimal.precision() === mc.getPrecision()) {
			return newBigDecimal;
		}
		/* 切り上げなどで桁数が１つ増えた場合 */
		const sign_text	= newBigDecimal.integer.signum() >= 0 ? "" : "-";
		const abs_text	= newBigDecimal._getUnsignedIntegerString();
		const inte_text	= sign_text + abs_text.substring(0, abs_text.length - 1);
		return new BigDecimal(new BigInteger(inte_text), newBigDecimal.scale() - 1);
	}

	abs(mc) {
		const output = this.clone();
		output.integer = output.integer.abs();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	plus(mc) {
		const output = this.clone();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	negate(mc) {
		const output = this.clone();
		output.integer = output.integer.negate();
		if(arguments.length === 1) {
			return output;
		}
		else {
			if(!(mc instanceof MathContext)) {
				throw "not MathContext";
			}
			return output.round(mc);
		}
	}

	compareTo(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= val;
		// 簡易計算
		{
			const src_sign	= src.signum();
			const tgt_sign	= tgt.signum();
			if((src_sign === 0) && (src_sign === tgt_sign)) {
				return 0;
			}
			else if(src_sign === 0) {
				return - tgt_sign;
			}
			else if(tgt_sign === 0) {
				return src_sign;
			}
		}
		// 実際に計算する
		if(src._scale === tgt._scale) {
			return src.integer.compareTo(tgt.integer);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return src.integer.compareTo(newdst.integer);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return newsrc.integer.compareTo(tgt.integer);
		}
	}

	equals(x) {
		if(!(x instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		return ((this._scale === x._scale) && (this.integer.equals(x.integer)));
	}

	min(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) <= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	max(val) {
		if(!(val instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(this.compareTo(val) >= 0) {
			return this.clone();
		}
		else {
			return val.clone();
		}
	}

	movePointLeft(n) {
		let output = this.scaleByPowerOfTen( -n );
		output = output.setScale(Math.max(this.scale() + n, 0));
		return output;
	}

	movePointRight(n) {
		let output = this.scaleByPowerOfTen( n );
		output = output.setScale(Math.max(this.scale() - n, 0));
		return output;
	}

	scaleByPowerOfTen(n) {
		const output = this.clone();
		output._scale = this.scale() - n;
		return output;
	}

	stripTrailingZeros() {
		// 0をできる限り取り除く
		const sign		= this.signum();
		const sign_text	= sign >= 0 ? "" : "-";
		const text		= this.integer.toString(10).replace(/^-/, "");
		const zeros		= text.match(/0+$/);
		let zero_length	= (zeros !== null) ? zeros[0].length : 0;
		if(zero_length === text.length) {
			// 全て 0 なら 1 ケタ残す
			zero_length = text.length - 1;
		}
		const newScale	= this.scale() - zero_length;
		return new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), newScale);
	}

	add(augend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(augend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= augend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			// 1 e1 + 1 e1 = 1
			return new BigDecimal(src.integer.add(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			// 1 e-2 + 1 e-1
			const newdst = tgt.setScale(src._scale);
			// 0.01 + 0.10 = 0.11 = 11 e-2
			return new BigDecimal(src.integer.add(newdst.integer), newscale, mc);
		}
		else {
			// 1 e-1 + 1 e-2
			const newsrc = src.setScale(tgt._scale);
			// 0.1 + 0.01 = 0.11 = 11 e-2
			return new BigDecimal(newsrc.integer.add(tgt.integer), newscale, mc);
		}
	}

	subtract(subtrahend, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(subtrahend instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= subtrahend;
		const newscale	= Math.max(src._scale, tgt._scale);
		if(src._scale === tgt._scale) {
			return new BigDecimal(src.integer.subtract(tgt.integer), newscale, mc);
		}
		else if(src._scale > tgt._scale) {
			const newdst = tgt.setScale(src._scale);
			return new BigDecimal(src.integer.subtract(newdst.integer), newscale, mc);
		}
		else {
			const newsrc = src.setScale(tgt._scale);
			return new BigDecimal(newsrc.integer.subtract(tgt.integer), newscale, mc);
		}
	}

	multiply(multiplicand, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(multiplicand instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const src			= this;
		const tgt			= multiplicand;
		const newinteger	= src.integer.multiply(tgt.integer);
		// 0.1 * 0.01 = 0.001
		const newscale	= src._scale + tgt._scale;
		return new BigDecimal(newinteger, newscale, mc);
	}

	divideToIntegralValue(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		const getDigit  = function( num ) {
			let i;
			let text = "1";
			for(i = 0; i < num; i++) {
				text = text + "0";
			}
			return new BigInteger(text);
		};
		if(divisor.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}

		// 1000e0		/	1e2				=	1000e-2
		// 1000e0		/	10e1			=	100e-1
		// 1000e0		/	100e0			=	10e0
		// 1000e0		/	1000e-1			=	1e1
		// 1000e0		/	10000e-2		=	1e1
		// 1000e0		/	100000e-3		=	1e1

		// 10e2			/	100e0			=	1e1
		// 100e1		/	100e0			=	1e1
		// 1000e0		/	100e0			=	10e0
		// 10000e-1		/	100e0			=	100e-1	
		// 100000e-2	/	100e0			=	1000e-2

		const src		= this;
		const tgt		= divisor;
		let src_integer	= src.integer;
		let tgt_integer	= tgt.integer;
		const newScale	= src._scale - tgt._scale;

		// 100e-2 / 3e-1 = 1 / 0.3 -> 100 / 30
		if(src._scale > tgt._scale) {
			// src._scale に合わせる
			tgt_integer = tgt_integer.multiply(getDigit(  newScale ));
		}
		// 1e-1 / 3e-2 = 0.1 / 0.03 -> 10 / 3
		else if(src._scale < tgt._scale) {
			// tgt._scale に合わせる
			src_integer = src_integer.multiply(getDigit( -newScale ));
		}

		// とりあえず計算結果だけ作ってしまう
		const new_integer	= src_integer.divide(tgt_integer);
		const sign			= new_integer.signum();
		if(sign !== 0) {
			const text	= new_integer.toString(10).replace(/^-/, "");
			// 指定した桁では表すことができない
			if((mc.getPrecision() !== 0) && (text.length > mc.getPrecision())) {
				throw "ArithmeticException";
			}
			// 結果の優先スケール に合わせる (this.scale() - divisor.scale())
			if(text.length <= (-newScale)) {
				// 合わせることができないので、0をできる限り削る = stripTrailingZerosメソッド
				const zeros			= text.match(/0+$/);
				const zero_length	= (zeros !== null) ? zeros[0].length : 0;
				const sign_text		= sign >= 0 ? "" : "-";
				return(new BigDecimal(new BigInteger(sign_text + text.substring(0, text.length - zero_length)), -zero_length));
			}
		}

		let output = new BigDecimal(new_integer);
		output = output.setScale(newScale, RoundingMode.UP);
		output = output.round(mc);
		return output;
	}

	divideAndRemainder(divisor, mc) {
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}

		// 1000e0		/	1e2				=	1000e-2	... 0e0
		// 1000e0		/	10e1			=	100e-1	... 0e0
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 1000e0		/	1000e-1			=	1e1		... 0e0
		// 1000e0		/	10000e-2		=	1e1		... 0e-1
		// 1000e0		/	100000e-3		=	1e1		... 0e-2

		// 10e2			/	100e0			=	1e1		... 0e1
		// 100e1		/	100e0			=	1e1		... 0e1
		// 1000e0		/	100e0			=	10e0	... 0e0
		// 10000e-1		/	100e0			=	100e-1	... 0e-1
		// 100000e-2	/	100e0			=	1000e-2	... 0e-2

		const result_divide	= this.divideToIntegralValue(divisor, mc);
		const result_remaind	= this.subtract(result_divide.multiply(divisor, mc), mc);

		const output = [result_divide, result_remaind];
		return output;
	}

	divide(divisor, p1, p2) {
		if(!(divisor instanceof BigDecimal)) {
			throw "not BigDecimal";
		}
		const src			= this;
		const tgt			= divisor;
		let roundingMode	= null;
		let mc				= MathContext.UNLIMITED;
		let newScale		= 0;
		let isPriorityScale	= false;
		let parm;
		if(arguments.length === 1) {
			newScale		 = src.scale() - tgt.scale();
			isPriorityScale	= true;
		}
		else if(arguments.length === 2) {
			parm = p1;
			newScale		= src.scale();
			isPriorityScale	= true;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else if(arguments.length === 3) {
			if((typeof p1 === "number")||(p1 instanceof Number)) {
				newScale = p1;
			}
			else {
				throw "scale is not Integer";
			}
			parm = p2;
			if(parm instanceof MathContext) {
				mc = parm;
				roundingMode = mc.getRoundingMode();
			}
			else {
				roundingMode = RoundingMode.getRoundingMode(arguments[0]);
			}
		}
		else {
			throw "The argument is over.";
		}
		if(tgt.compareTo(BigDecimal.ZERO) === 0) {
			throw "ArithmeticException";
		}
		let i;
		let newsrc = src;
		const result_map = [];
		let result, result_divide, result_remaind, all_result;
		all_result = BigDecimal.ZERO;
		const precision = mc.getPrecision();
		const check_max = precision !== 0 ? (precision + 8) : 0x3FFFF;
		for(i = 0; i < check_max; i++) {
			result = newsrc.divideAndRemainder(tgt, MathContext.UNLIMITED);
			result_divide	= result[0];
			result_remaind	= result[1];
			all_result = all_result.add(result_divide.scaleByPowerOfTen(-i), MathContext.UNLIMITED);
			if(result_remaind.compareTo(BigDecimal.ZERO) !== 0) {
				if(precision === 0) {	// 精度無限大の場合は、循環小数のチェックが必要
					if(result_map[result_remaind._getUnsignedIntegerString()]) {
						throw "ArithmeticException " + all_result + "[" + result_remaind._getUnsignedIntegerString() + "]";
					}
					else {
						result_map[result_remaind._getUnsignedIntegerString()] = true;
					}
				}
				newsrc = result_remaind.scaleByPowerOfTen(1);
			}
			else {
				break;
			}
		}
		if(isPriorityScale) {
			// 優先スケールの場合は、スケールの変更に失敗する可能性あり
			try {
				all_result = all_result.setScale(newScale, roundingMode);
			}
			catch(e) {
				// falls through
			}
		}
		else {
			all_result = all_result.setScale(newScale, roundingMode);
		}
		all_result = all_result.round(mc);
		return all_result;
	}

	toBigInteger() {
		const x = this.toPlainString().replace(/\.\d*$/, "");
		return new BigInteger(x.toPlainString());
	}

	toBigIntegerExact() {
		const x = this.setScale(0, RoundingMode.UNNECESSARY);
		return new BigInteger(x.toPlainString());
	}

	longValue() {
		let x = this.toBigInteger();
		x = x.longValue();
		return x;
	}

	longValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		return x;
	}

	intValue() {
		let x = this.toBigInteger();
		x = x.intValue();
		return x & 0xFFFFFFFF;
	}

	intValueExact() {
		let x = this.toBigIntegerExact();
		x = x.longValue();
		if((x < -2147483648) || (2147483647 < x)) {
			throw "ArithmeticException";
		}
		return x;
	}

	floatValue() {
		const p = this.precision();
		if(MathContext.DECIMAL32.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	doubleValue() {
		const p = this.precision();
		if(MathContext.DECIMAL64.getPrecision() < p) {
			return(this.signum() >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY);
		}
		return parseFloat(p.toEngineeringString());
	}

	pow(n, mc) {
		if(Math.abs(n) > 999999999) {
			throw "ArithmeticException";
		}
		if(arguments.length === 1) {
			mc = MathContext.UNLIMITED;
		}
		if(!(mc instanceof MathContext)) {
			throw "not MathContext";
		}
		if((mc.getPrecision() === 0) && (n < 0)) {
			throw "ArithmeticException";
		}
		if((mc.getPrecision() > 0) && (n > mc.getPrecision())) {
			throw "ArithmeticException";
		}
		let x, y;
		x = this.clone();
		y = BigDecimal.ONE;
		while(n !== 0) {
			if((n & 1) !== 0) {
				y = y.multiply(x, MathContext.UNLIMITED);
			}
			x = x.multiply(x, MathContext.UNLIMITED);
			n >>>= 1;
		}
		return y.round(mc);
	}
	
	static valueOf(val, scale) {
		if(arguments.length === 1) {
			return new BigDecimal(val);
		}
		else if(arguments.length === 2) {
			if((typeof val === "number") && (val === Math.floor(val))) {
				return new BigDecimal(new BigInteger(val), scale);
			}
			else {
				throw "IllegalArgumentException";
			}
		}
		throw "IllegalArgumentException";
	}
	
}

const RoundingMode = {
	
	// 0 から離れる
	UP: {
		toString : function() {
			return "UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return (-(10 + x));
			}
		}
	},
	
	// 0 に近づく
	DOWN: {
		toString : function() {
			return "DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			return -x;
		}
	},
	
	// 正の無限大に近づく
	CEILING: {
		toString : function() {
			return "CEILING";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return 10 - x;
			}
			else {
				return -x;
			}
		}
	},
	
	// 負の無限大に近づく
	FLOOR: {
		toString : function() {
			return "FLOOR";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else if(x > 0) {
				return -x;
			}
			else {
				return(-(10 + x));
			}
		}
	},
	
	// 四捨五入
	HALF_UP: {
		toString : function() {
			return "HALF_UP";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 5) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 五捨六入
	HALF_DOWN: {
		toString : function() {
			return "HALF_DOWN";
		},
		getAddNumber : function(x) {
			x = x % 10;
			const sign = x >= 0 ? 1 : -1;
			if(Math.abs(x) < 6) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 等間隔なら偶数側へ丸める
	HALF_EVEN: {
		toString : function() {
			return "HALF_EVEN";
		},
		getAddNumber : function(x) {
			x = x % 100;
			let sign, even;
			if(x < 0) {
				sign = -1;
				even = Math.ceil(x / 10) & 1;
			}
			else {
				sign = 1;
				even = Math.floor(x / 10) & 1;
			}
			let center;
			if(even === 1) {
				center = 5;
			}
			else {
				center = 6;
			}
			x = x % 10;
			if(Math.abs(x) < center) {
				return (x * -1);
			}
			else {
				return (sign * (10 - Math.abs(x)));
			}
		}
	},
	
	// 丸めない（丸める必要が出る場合はエラー）
	UNNECESSARY: {
		toString : function() {
			return "UNNECESSARY";
		},
		getAddNumber : function(x) {
			x = x % 10;
			if(x === 0) {
				return 0;
			}
			else {
				throw "ArithmeticException";
			}
		}
	},
	
	valueOf: function(name) {
		if(name === null) {
			throw "NullPointerException";
		}
		const values = RoundingMode.values;
		for(let i = 0; i < values.length; i++) {
			if(values[i].toString() === name) {
				return values[i];
			}
		}
		throw "IllegalArgumentException";
	},
	
	getRoundingMode: function(roundingMode) {
		let mode;
		switch(roundingMode) {
			case RoundingMode.CEILING:
			case RoundingMode.DOWN:
			case RoundingMode.FLOOR:
			case RoundingMode.HALF_DOWN:
			case RoundingMode.HALF_EVEN:
			case RoundingMode.HALF_UP:
			case RoundingMode.UNNECESSARY:
			case RoundingMode.UP:
				mode = roundingMode;
				break;
			default:
				if((typeof roundingMode === "number")||(roundingMode instanceof Number)) {
					mode = RoundingMode.values[roundingMode];
				}
				else if((typeof roundingMode === "string")||(roundingMode instanceof String)) {
					mode = RoundingMode.valueOf(roundingMode);
				}
		}
		if(!mode) {
			throw "Not RoundingMode";
		}
		return mode;
	}
};

RoundingMode.values = {
	0	:	RoundingMode.CEILING,
	1	:	RoundingMode.DOWN,
	2	:	RoundingMode.FLOOR,
	3	:	RoundingMode.HALF_DOWN,
	4	:	RoundingMode.HALF_EVEN,
	5	:	RoundingMode.HALF_UP,
	6	:	RoundingMode.UNNECESSARY,
	7	:	RoundingMode.UP
};

class MathContext {

	constructor() {
		this.precision = 0;
		this.roundingMode = RoundingMode.HALF_UP;
		let p1 = 0;
		let p2 = 0;
		let buff;
		if(arguments.length >= 1) {
			p1 = arguments[0];
		}
		if(arguments.length >= 2) {
			p2 = arguments[1];
		}
		if((typeof p1 === "string")||(p1 instanceof String)) {
			buff = p1.match(/precision=\d+/);
			if(buff !== null) {
				buff = buff[0].substring("precision=".length, buff[0].length);
				this.precision = parseInt(buff, 10);
			}
			buff = p1.match(/roundingMode=\w+/);
			if(buff !== null) {
				buff = buff[0].substring("roundingMode=".length, buff[0].length);
				this.roundingMode = RoundingMode.valueOf(buff);
			}	
		}
		else if(arguments.length === 1) {
			this.precision = p1;
		}
		else if(arguments.length === 2) {
			this.precision = p1;
			this.roundingMode = p2;
		}
		if(this.precision < 0) {
			throw "IllegalArgumentException";
		}
	}

	getPrecision() {
		return this.precision;
	}

	getRoundingMode() {
		return this.roundingMode;
	}

	equals(x) {
		if(x instanceof MathContext) {
			if(x.toString() === this.toString()) {
				return true;
			}
		}
		return false;
	}

	toString() {
		return ("precision=" + this.precision + " roundingMode=" + this.roundingMode.toString());
	}
}

MathContext.UNLIMITED	= new MathContext(0,	RoundingMode.HALF_UP);
MathContext.DECIMAL32	= new MathContext(7,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL64	= new MathContext(16,	RoundingMode.HALF_EVEN);
MathContext.DECIMAL128	= new MathContext(34,	RoundingMode.HALF_EVEN);

BigDecimal.RoundingMode			= RoundingMode;
BigDecimal.MathContext			= MathContext;

BigDecimal.ZERO					= new BigDecimal(0);
BigDecimal.ONE					= new BigDecimal(1);
BigDecimal.TEN					= new BigDecimal(10);
BigDecimal.ROUND_CEILING		= RoundingMode.CEILING;
BigDecimal.ROUND_DOWN			= RoundingMode.DOWN;
BigDecimal.ROUND_FLOOR			= RoundingMode.FLOOR;
BigDecimal.ROUND_HALF_DOWN		= RoundingMode.HALF_DOWN;
BigDecimal.ROUND_HALF_EVEN		= RoundingMode.HALF_EVEN;
BigDecimal.ROUND_HALF_UP		= RoundingMode.HALF_UP;
BigDecimal.ROUND_UNNECESSARY	= RoundingMode.UNNECESSARY;
BigDecimal.ROUND_UP				= RoundingMode.UP;
