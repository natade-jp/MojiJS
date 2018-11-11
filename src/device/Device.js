/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import IDDraggableSwitch from "./input/IDDraggableSwitch.js";
import IDMouse from "./input/IDMouse.js";
import IDPosition from "./input/IDPosition.js";
import IDSwitch from "./input/IDSwitch.js";
import IDTouch from "./input/IDTouch.js";
import IDTools from "./input/IDTools.js";

const Device = {
	DraggableSwitch		: IDDraggableSwitch,
	Mouse				: IDMouse,
	Position			: IDPosition,
	Switch				: IDSwitch,
	Touch				: IDTouch,
	Tools				: IDTools
};

export default Device;

