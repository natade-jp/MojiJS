/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import IDMouse from "./IDMouse.mjs";
import IDPosition from "./IDPosition.mjs";

export default class IDTouch extends IDMouse {

	/**
	 * 指3本まで対応するタッチデバイス
	 * 1本目は左クリックに相当
	 * 2本目は右クリックに相当
	 * 3本目は中央クリックに相当
	 * @returns {IDTouch}
	 */
	constructor() {
		super();
		this._initIDTouch();
	}
	
	_initIDTouch() {
		this.touchcount_to_mask = {
			1 : IDMouse.MOUSE_EVENTS.BUTTON1_MASK,
			2 : IDMouse.MOUSE_EVENTS.BUTTON3_MASK,
			3 : IDMouse.MOUSE_EVENTS.BUTTON2_MASK
		};
		const that = this;
		this._mousePressed = function(e) {
			that.mousePressed(e);
		};
		this._mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		this._mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		this.isdoubletouch	= false;
	}

	_initPosition(mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	}

	_MultiTouchToMouse(touchevent) {
		let x = 0, y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for(let i = 0;i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		const event = {};
		if(touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button  = this.touchcount_to_mask[touchevent.touches.length];
			const touch = touchevent.touches[0];
			event.target  = touch.target ? touch.target : touch.currentTarget;
		}
		else {
			event.clientX = 0;
			event.clientY = 0;
			event.button  = 0;
		}
		event.touchcount = touchevent.touches.length;
		return event;
	}

	_MoveMultiTouch(touchevent) {
		if(touchevent.touches.length === 2) {
			const p1 = touchevent.touches[0];
			const p2 = touchevent.touches[1];
			if(this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this.doubleposition = [];
				this.doubleposition[0] = new IDPosition(p1.clientX, p1.clientY);
				this.doubleposition[1] = new IDPosition(p2.clientX, p2.clientY);
			}
			else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				const newp1 = new IDPosition(p1.clientX, p1.clientY);
				const newp2 = new IDPosition(p2.clientX, p2.clientY);
				const x = IDPosition.norm(this.doubleposition[0], this.doubleposition[1]) - IDPosition.norm(newp1, newp2);
				this.doubleposition[0] = newp1;
				this.doubleposition[1] = newp2;
				// そんなにずれていなかったら無視する
				const r = (Math.abs(x) < 10) ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		}
		else {
			this.isdoubletouch === false;
		}
	}

	_actFuncMask(mouseevent, funcOn, funcOff, target) {
		for(const key in IDMouse.MOUSE_EVENTS) {
			mouseevent.button = IDMouse.MOUSE_EVENTS[key];
			if(IDMouse.MOUSE_EVENTS[key] === target) {
				funcOn(mouseevent);
			}
			else {
				funcOff(mouseevent);
			}
		}
	}

	touchStart(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(
			mouseevent,
			this._mousePressed,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchEnd(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseReleased,
			this._mouseReleased,
			mouseevent.button
		);
	}
	
	touchMove(touchevent) {
		this._MoveMultiTouch(touchevent);
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(
			mouseevent,
			this._mouseMoved,
			this._mouseMoved,
			mouseevent.button
		);
	}

	setListenerOnElement(element) {
		super.setListenerOnElement(element);

		const that = this;
		const touchStart = function(touchevent) {
			that.touchStart(touchevent);
		};
		const touchEnd = function(touchevent) {
			that.touchEnd(touchevent);
		};
		const touchMove = function(touchevent) {
			that.touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart",	touchStart, false );
		element.addEventListener("touchend",	touchEnd, false );
		element.addEventListener("touchmove",	touchMove, false );
		element.addEventListener("touchcancel",	touchEnd, false );
	}

}
