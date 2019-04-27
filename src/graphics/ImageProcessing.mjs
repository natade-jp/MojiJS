/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import ImgData from "./data/ImgData.mjs";
import ImgDataRGBA from "./data/ImgDataRGBA.mjs";
import ImgDataY from "./data/ImgDataY.mjs";
import ImgColorRGBA from "./color/ImgColorRGBA.mjs";
import ImgColorY from "./color/ImgColorY.mjs";

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

