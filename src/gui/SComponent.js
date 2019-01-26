/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import SBase from "./components/SBase.js";
import SButton from "./components/SButton.js";
import SCanvas from "./components/SCanvas.js";
import SCheckBox from "./components/SCheckBox.js";
import SColorPicker from "./components/SColorPicker.js";
import SComboBox from "./components/SComboBox.js";
import SFileLoadButton from "./components/SFileLoadButton.js";
import SFileSaveButton from "./components/SFileSaveButton.js";
import SGroupBox from "./components/SGroupBox.js";
import SImagePanel from "./components/SImagePanel.js";
import SLabel from "./components/SLabel.js";
import SPanel from "./components/SPanel.js";
import SProgressBar from "./components/SProgressBar.js";
import SSlidePanel from "./components/SSlidePanel.js";
import SSlider from "./components/SSlider.js";

const SComponent = {
	
	Button : SButton,
	Canvas : SCanvas,
	CheckBox : SCheckBox,
	ColorPicker : SColorPicker,
	ComboBox : SComboBox,
	FileLoadButton : SFileLoadButton,
	FileSaveButton : SFileSaveButton,
	GroupBox : SGroupBox,
	ImagePanel : SImagePanel,
	Label : SLabel,
	Panel : SPanel,
	ProgressBar : SProgressBar,
	SlidePanel : SSlidePanel,
	Slider : SSlider,
	
	PUT_TYPE : SBase.PUT_TYPE,
	UNIT_TYPE : SBase.UNIT_TYPE,
	LABEL_POSITION : SBase.LABEL_POSITION,
	FILE_ACCEPT : SFileLoadButton.FILE_ACCEPT
	
};

export default SComponent;
