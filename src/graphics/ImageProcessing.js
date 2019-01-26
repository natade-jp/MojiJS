/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgData from "./data/ImgData.js";
import ImgDataRGBA from "./data/ImgDataRGBA.js";
import ImgDataY from "./data/ImgDataY.js";
import ImgColorRGBA from "./color/ImgColorRGBA.js";
import ImgColorY from "./color/ImgColorY.js";

const ImageProcessing = {
	ImgDataRGBA		: ImgDataRGBA,
	ImgColorRGBA	: ImgColorRGBA,
	ImgDataY		: ImgDataY,
	ImgColorY		: ImgColorY,
	MODE_WRAP		: ImgData.MODE_WRAP,
	MODE_IP			: ImgData.MODE_IP,
	MODE_BLEND		: ImgData.MODE_BLEND
};

export default ImageProcessing;

