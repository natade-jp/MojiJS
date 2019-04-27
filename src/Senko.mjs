/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ArrayList from "./basic/ArrayList.mjs";
import Color from "./basic/Color.mjs";
import File from "./basic/File.mjs";
import HashMap from "./basic/HashMap.mjs";
import Format from "./basic/Format.mjs";
import Log from "./basic/Log.mjs";

import Device from "./device/Device.mjs";
import ImageProcessing from "./graphics/ImageProcessing.mjs";
import SComponent from "./gui/SComponent.mjs";

const Senko = {};

Senko._printbuffer = "";
Senko.ArrayList = ArrayList;
Senko.Color = Color;
Senko.File = File;
Senko.HashMap = HashMap;
Senko.format = Format.format;
Senko.Log = Log;
Senko.Device = Device;
Senko.ImageProcessing = ImageProcessing;
Senko.SComponent = SComponent;

export default Senko;
