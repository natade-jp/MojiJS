/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Device from "../../device/Device.mjs";
import S3Vector from "../math/S3Vector.mjs";

export default class CameraController {

	constructor() {
		this.mouse		= new Device.Touch();
		this.moveDistance	= 4.0;
		this.moveRotate		= 0.5;
		this.moveTranslateRelative	= 0.1;
	}

	setCanvas(element) {
		this.mouse.setListenerOnElement(element);
	}

	setCamera(camera) {
		this.camera = camera.clone();
	}

	getCamera() {
		const data = new Device.Touch();
		this.mouse.pickInput(data);
		{
			this.camera.translateRelative(
				new S3Vector(
					- data.left.dragged.x * this.moveTranslateRelative,
					data.left.dragged.y * this.moveTranslateRelative,
					0
				)
			);
		}
		{
			this.camera.addRotateY(   data.right.dragged.x * this.moveRotate );
			this.camera.addRotateX( - data.right.dragged.y * this.moveRotate );
		}
		{
			let distance = this.camera.getDistance();
			const l = data.wheelrotation;
			distance -= l * this.moveDistance * Math.log(distance);
			this.camera.setDistance(distance);
		}
		return this.camera;
	}

}

