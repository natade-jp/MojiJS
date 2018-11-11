/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import IDDraggableSwitch from "./IDDraggableSwitch.js";
import IDPosition from "./IDPosition.js";

export default class IDMouse {

	constructor() {
		this._initIDMouse();
	}
	
	_initIDMouse() {
		this.left   = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON1_MASK);
		this.center = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON2_MASK);
		this.right  = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON3_MASK);
		this.position = new IDPosition();
		this.wheelrotation = 0;
	}

	clone() {
		const ret = new IDMouse();
		ret.left		= this.left.clone();
		ret.center		= this.center.clone();
		ret.right		= this.right.clone();
		ret.position	= this.position.clone();
		ret.wheelrotation = this.wheelrotation;
		return ret;
	}

	mousePressed(mouseevent) {
		this.left.mousePressed(mouseevent);
		this.center.mousePressed(mouseevent);
		this.right.mousePressed(mouseevent);
	}

	mouseReleased(mouseevent) {
		this.left.mouseReleased(mouseevent);
		this.center.mouseReleased(mouseevent);
		this.right.mouseReleased(mouseevent);
	}

	mouseMoved(mouseevent) {
		this.left.mouseMoved(mouseevent);
		this.center.mouseMoved(mouseevent);
		this.right.mouseMoved(mouseevent);
		this.position.x = this.left.client.x;
		this.position.y = this.left.client.y;
	}

	mouseWheelMoved(event) {
		if(event.wheelDelta !== 0) {
			this.wheelrotation += event.deltaY > 0 ? -1 : 1;
		}
	}

	focusLost() {
		this.left.focusLost();
		this.center.focusLost();
		this.right.focusLost();
	}

	pickInput(c) {
		if(!(c instanceof IDMouse)) {
			throw "IllegalArgumentException";
		}
		this.left.pickInput(c.left);
		this.center.pickInput(c.center);
		this.right.pickInput(c.right);
		c.position.set(this.position);
		c.wheelrotation = this.wheelrotation;
		this.wheelrotation = 0;
	}

	setListenerOnElement(element) {
		const that = this;
		const mousePressed = function(e) {
			that.mousePressed(e);
		};
		const mouseReleased = function(e) {
			that.mouseReleased(e);
		};
		const mouseMoved = function(e) {
			that.mouseMoved(e);
		};
		const focusLost = function() {
			that.focusLost();
		};
		const mouseWheelMoved = function(e) {
			that.mouseWheelMoved(e);
			e.preventDefault();
		};
		const contextMenu  = function(e) {
			e.preventDefault();
		};
		element.style.cursor = "crosshair";
		// 非選択化
		element.style.mozUserSelect			= "none";
		element.style.webkitUserSelect		= "none";
		element.style.msUserSelect			= "none";
		// メニュー非表示化
		element.style.webkitTouchCallout	= "none";
		// タップのハイライトカラーを消す
		element.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

		element.addEventListener("mousedown",	mousePressed, false );
		element.addEventListener("mouseup",		mouseReleased, false );
		element.addEventListener("mousemove",	mouseMoved, false );
		element.addEventListener("mouseout",	focusLost, false );
		element.addEventListener("wheel",		mouseWheelMoved, false );
		element.addEventListener("contextmenu",	contextMenu, false );
	}
}

IDMouse.MOUSE_EVENTS = {
	BUTTON1_MASK : 0,
	BUTTON2_MASK : 1,
	BUTTON3_MASK : 2
};
