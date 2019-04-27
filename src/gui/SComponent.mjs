/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import SBase from "./components/SBase.mjs";
import SButton from "./components/SButton.mjs";
import SCanvas from "./components/SCanvas.mjs";
import SCheckBox from "./components/SCheckBox.mjs";
import SColorPicker from "./components/SColorPicker.mjs";
import SComboBox from "./components/SComboBox.mjs";
import SFileLoadButton from "./components/SFileLoadButton.mjs";
import SFileSaveButton from "./components/SFileSaveButton.mjs";
import SGroupBox from "./components/SGroupBox.mjs";
import SImagePanel from "./components/SImagePanel.mjs";
import SLabel from "./components/SLabel.mjs";
import SPanel from "./components/SPanel.mjs";
import SProgressBar from "./components/SProgressBar.mjs";
import SSlidePanel from "./components/SSlidePanel.mjs";
import SSlider from "./components/SSlider.mjs";

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
