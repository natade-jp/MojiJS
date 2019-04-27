/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import IDSwitch from "./IDSwitch.mjs";
import IDPosition from "./IDPosition.mjs";

export default class IDDraggableSwitch {

	/**
	 * 動かすことが可能なクラス
	 * @param {Integer} mask
	 * @returns {IDDraggableSwitch}
	 */
	constructor(mask) {
		this._initIDDraggableSwitch(mask);
	}

	_initIDDraggableSwitch(mask) {
		this.mask			= mask;
		this.switch			= new IDSwitch();
		this.client			= new IDPosition();
		this.deltaBase		= new IDPosition();
		this.dragged		= new IDPosition();
	}

	clone() {
		const ret = new IDDraggableSwitch();
		ret.mask			= this.mask;
		ret.switch			= this.switch.clone();
		ret.client			= this.client.clone();
		ret.deltaBase		= this.deltaBase.clone();
		ret.dragged			= this.dragged.clone();
		return ret;
	}

	correctionForDOM(event) {
		// イベントが発生したノードの取得
		let node = event.target;
		if(!node) {
			// IE?
			node = event.currentTarget;
		}
		if(node === undefined) {
			return new IDPosition(
				event.clientX,
				event.clientY
			);
		}
		else {
			// ノードのサイズが変更されていることを考慮する
			// width / height が内部のサイズ
			// clientWidth / clientHeight が表示上のサイズ
			return new IDPosition(
				(event.clientX / node.clientWidth)  * node.width,
				(event.clientY / node.clientHeight) * node.height
			);
		}
	}

	setPosition(event) {
		// 強制的にその位置に全ての値をセットする
		const position = this.correctionForDOM(event);
		this.client.set(position);
		this.deltaBase.set(position);
		this.dragged._initIDPosition();
	}

	mousePressed(event) {
		const position = this.correctionForDOM(event);
		const state	= event.button;
		if(state === this.mask) {
			if(!this.switch.ispressed) {
				this.dragged._initIDPosition();
			}
			this.switch.keyPressed();
			this.client.set(position);
			this.deltaBase.set(position);
		}
	}

	mouseReleased(event) {
		const state	= event.button;
		if(state === this.mask) {
			if(this.switch.ispressed) {
				this.switch.keyReleased();
			}
		}
	}

	mouseMoved(event) {
		const position = this.correctionForDOM(event);
		if(this.switch.ispressed) {
			const delta = new IDPosition(position);
			delta.sub(this.deltaBase);
			this.dragged.add(delta);
		}
		this.client.set(position.x ,position.y);
		this.deltaBase.set(position.x ,position.y);
	}

	focusLost() {
		this.switch.focusLost();
	}

	/**
	 * 情報をうけとる。
	 * トリガータイプなど1回目の情報と2回の情報で異なる場合がある。
	 * @param {InputSwitch} c 取得用クラス
	 */
	pickInput(c) {
		if(!(c instanceof IDDraggableSwitch)) {
			throw "IllegalArgumentException";
		}
		this.switch.pickInput(c.switch);
		c.client.set(this.client);
		c.dragged.set(this.dragged);
		this.dragged._initIDPosition();
	}
	
}