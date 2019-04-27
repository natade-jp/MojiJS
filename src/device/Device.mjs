/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import IDDraggableSwitch from "./input/IDDraggableSwitch.mjs";
import IDMouse from "./input/IDMouse.mjs";
import IDPosition from "./input/IDPosition.mjs";
import IDSwitch from "./input/IDSwitch.mjs";
import IDTouch from "./input/IDTouch.mjs";
import IDTools from "./input/IDTools.mjs";

const Device = {
	DraggableSwitch		: IDDraggableSwitch,
	Mouse				: IDMouse,
	Position			: IDPosition,
	Switch				: IDSwitch,
	Touch				: IDTouch,
	Tools				: IDTools
};

export default Device;

