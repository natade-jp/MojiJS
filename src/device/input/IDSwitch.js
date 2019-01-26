/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class IDSwitch {
	
	/**
	 * 押す、離すが可能なボタン
	 * @returns {IDSwitch}
	 */
	constructor() {
		this._initIDSwitch();
	}

	_initIDSwitch() {
		/**
		 * 押した瞬間に反応
		 */
		this.istyped		= false;

		/**
		 * 押している間に反応
		 */
		this.ispressed		= false;

		/**
		 * 離した瞬間に反応
		 */
		this.isreleased		= false;

		/**
		 * 押している時間に反応
		 */
		this.pressed_time	= 0;
	}

	clone () {
		const ret = new IDSwitch();
		ret.istyped			= this.istyped;
		ret.ispressed		= this.ispressed;
		ret.isreleased		= this.isreleased;
		ret.pressed_time	= this.pressed_time;
		return ret;
	}

	/**
	 * キーを押した情報
	 */
	keyPressed() {
		if(!this.ispressed) {
			this.istyped = true;
		}
		this.ispressed = true;
		this.pressed_time++;
	}

	/**
	 * キーを離した情報
	 */
	keyReleased() {
		this.ispressed  = false;
		this.isreleased = true;
		this.pressed_time = 0;
	}

	/**
	 * フォーカスが消えたとき
	 */
	focusLost() {
		this.keyReleased();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDSwitch)) {
			throw "IllegalArgumentException";
		}
		c.ispressed			= this.ispressed;
		c.istyped			= this.istyped;
		c.isreleased		= this.isreleased;
		c.pressed_time		= this.pressed_time;
		this.isreleased		= false;
		this.istyped		= false;
	}
	
}