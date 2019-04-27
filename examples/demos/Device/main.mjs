import Senko from "../../libs/Senko.mjs";

const Color = Senko.Color;
const SComponent = Senko.SComponent;
const Device = Senko.Device;
const Log = Senko.Log;

const main = function() {
	
	Log.println("InputDevice クラスのサンプル");
	
	// 縦スクロール防止
	Device.Tools.noScroll();
	
	const scanvas = new SComponent.Canvas();
	scanvas.putMe("scomponent", SComponent.PUT_TYPE.IN);
	scanvas.setUnit(SComponent.UNIT_TYPE.PX);
	scanvas.setPixelSize(640, 480);
	scanvas.setSize(640, 480);
	const canvas = scanvas.getCanvas();
	
	canvas.style.backgroundColor	= "black";
	const ctx = scanvas.getContext();
	
	const mouse = new Device.Touch();
	mouse.setListenerOnElement(scanvas.getElement());
	let times = 0;
	
	const checkMouse = function() {
		const data = new Device.Touch();
		mouse.pickInput(data);
		Log.println("time[" + (times++) + "]");
		Log.println("position      "		+ data.position.x + "," + data.position.y);
		Log.println("wheelrotation "		+ data.wheelrotation);
		Log.println("draggedL       "	+ data.left.dragged.x	+ "," + data.left.dragged.y);
		Log.println("draggedR       "	+ data.right.dragged.x	+ "," + data.right.dragged.y);
		Log.println("ispressed  "		+ data.left.switch.ispressed	+ "," + data.right.switch.ispressed		+ "," + data.center.switch.ispressed);
		Log.println("isreleased "		+ data.left.switch.isreleased	+ "," + data.right.switch.isreleased	+ "," + data.center.switch.isreleased);
		Log.println("istyped    "		+ data.left.switch.istyped		+ "," + data.right.switch.istyped		+ "," + data.center.switch.istyped);
		let color;
		const ispressed = data.left.switch.ispressed || data.right.switch.ispressed || data.center.switch.ispressed;
		if(data.left.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 1.0, 1.0, 0.8);
		}
		else if(data.right.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 0.1, 1.0, 0.8);
		}
		else if(data.center.switch.ispressed) {
			color = Color.newColorNormalizedHSV(times * 0.1, 1.0, 0.1, 0.8);
		}
		if(ispressed) {
			ctx.beginPath();
			ctx.fillStyle = color.getCSS255();
			ctx.arc( data.position.x, data.position.y, 50, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	//setTimeout(checkMouse, 250);
	setInterval(checkMouse, 250);
	
};

main();
