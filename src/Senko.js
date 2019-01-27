/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ArrayList from "./basic/ArrayList.js";
import Color from "./basic/Color.js";
import File from "./basic/File.js";
import HashMap from "./basic/HashMap.js";
import Format from "./basic/Format.js";
import Log from "./basic/Log.js";
import MathX from "./mathx/MathX.js";

import Device from "./device/Device.js";
import ImageProcessing from "./graphics/ImageProcessing.js";
import SComponent from "./gui/SComponent.js";

const Senko = {};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File;
Senko.HashMap = HashMap;
Senko.format = Format.format;
Senko.Log = Log;
Senko.MathX = MathX;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;

export default Senko;
