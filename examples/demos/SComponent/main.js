import Senko from "../../libs/Senko.js";

const SComponent = Senko.SComponent;

const main = function() {
	
	Senko.println("SComponent クラスのサンプル");
	
	Senko.println("HTML での部品用のクラスです。");
	
	// パネルを作って、指定した ID の要素内に入れる。
	const panel = new SComponent.Panel();
	panel.putMe("component_test", SComponent.PUT_TYPE.IN);
	
	// ラベルを作って、パネルの中に入れる。
	const label1 = new SComponent.Label("SComponentPutType.IN");
	panel.put(label1, SComponent.PUT_TYPE.IN);
	
	// obj2 は、 obj1 の右に配置する
	const label2 = new SComponent.Label("SComponentPutType.RIGHT");
	label1.put(label2, SComponent.PUT_TYPE.RIGHT);
	
	// obj3 は、 obj2 の下に配置する
	const label3 = new SComponent.Label("SComponentPutType.NEWLINE");
	label2.put(label3, SComponent.PUT_TYPE.NEWLINE);
	
	// obj3 のサイズを指定する
	label3.setUnit(SComponent.UNIT_TYPE.EM);
	label3.setSize(30, 2);
	Senko.println("width " + label3.getWidth() + label3.getUnit());
	Senko.println("height " + label3.getHeight() + label3.getUnit());
	
	// obj1 の内容を変更する
	label1.setText("【" + label1.getText() + "】");
	
	// タイトル付き
	const panel2 = new SComponent.Panel("タイトル付きパネル");
	panel.put(panel2, SComponent.PUT_TYPE.NEWLINE);
	panel2.put(new SComponent.Label("テスト"), SComponent.PUT_TYPE.IN);
	
	// スライドパネル
	const slidepanel = new SComponent.SlidePanel("スライドパネル");
	panel2.put(slidepanel, SComponent.PUT_TYPE.NEWLINE);
	
	const button1 = new SComponent.Button("10回押す");
	slidepanel.put(button1, SComponent.PUT_TYPE.IN);
	let pushed1 = 10;
	// クリックすると内部の関数が呼ばれる
	button1.addListener(function () {
		if(pushed1 > 0) {
			pushed1--;
		}
		progressbar.setValue(pushed1);
		if(pushed1 === 0) {
			fileloadbtn.setVisible(false);
			filesavebtn.setVisible(false);
			combobox.setVisible(false);
			checkbox.setVisible(false);
			label1.setVisible(false);
			label2.setVisible(false);
			label3.setVisible(false);
			canvas.setVisible(false);
			slider.setVisible(false);
			imagepanel.setVisible(false);
		}
		button1.setText("残り " + pushed1);
	});
	
	const progressbar = new SComponent.ProgressBar(10, 0);
	button1.put(progressbar, SComponent.PUT_TYPE.RIGHT);
	
	const button2 = new SComponent.Button("無効化");
	progressbar.put(button2, SComponent.PUT_TYPE.NEWLINE);
	let pushed2 = 0;
	button2.addListener(function () {
		pushed2++;
		button2.setText((pushed2 % 2 === 1) ? "有効化" : "無効化");
		
		// 押すたびに有効化／無効化の変更
		progressbar.setIndeterminate(!progressbar.isIndeterminate());
		button1.setEnabled(!button1.isEnabled());
		fileloadbtn.setEnabled(!fileloadbtn.isEnabled());
		filesavebtn.setEnabled(!filesavebtn.isEnabled());
		combobox.setEnabled(!combobox.isEnabled());
		checkbox.setEnabled(!checkbox.isEnabled());
		label1.setEnabled(!label1.isEnabled());
		label2.setEnabled(!label2.isEnabled());
		label3.setEnabled(!label3.isEnabled());
		canvas.setEnabled(!canvas.isEnabled());
		slider.setEnabled(!slider.isEnabled());
		imagepanel.setEnabled(!imagepanel.isEnabled());
	});
	
	// パネルを作って、指定した ID の要素内に入れる。
	const groupbox = new SComponent.GroupBox("グループボックス");
	slidepanel.put(groupbox, SComponent.PUT_TYPE.NEWLINE);
	
	// FileLoad
	const fileloadbtn = new SComponent.FileLoadButton("load");
	fileloadbtn.setFileAccept(SComponent.FILE_ACCEPT.IMAGE);
	groupbox.put(fileloadbtn, SComponent.PUT_TYPE.IN);
	fileloadbtn.addListener(function(file) {
		for(let i = 0; i < file.length; i++) {
			Senko.println(file[i].name + " " + file[i].size + "byte");
		}
	});
	
	
	// FileSave
	const filesavebtn = new SComponent.FileSaveButton("save");
	fileloadbtn.put(filesavebtn, SComponent.PUT_TYPE.RIGHT);
	
	// Canvas
	const canvas = new SComponent.Canvas();
	canvas.setPixelSize(200, 20);
	canvas.setUnit(SComponent.UNIT_TYPE.PX);
	canvas.setSize(200, 20);
	filesavebtn.put(canvas, SComponent.PUT_TYPE.NEWLINE);
	canvas.getContext().fillText("canvas", 0, 20);
	canvas.getContext().strokeText("canvas", 100, 20);
	
	filesavebtn.setURL(canvas.toDataURL());
	
	
	// ComboBox
	// 配列で内部を初期化できる
	const combobox = new SComponent.ComboBox(["test1", "test2"]);
	canvas.put(combobox, SComponent.PUT_TYPE.NEWLINE);
	combobox.setWidth(12);
	// getText は配列で取得ができる
	const selectitem = combobox.getText();
	Senko.println(selectitem[0]);
	Senko.println(selectitem[1]);
	// 2番目を選択する
	combobox.setSelectedItem("test2");
	combobox.addListener(function () {
		Senko.println("ComboBox " + combobox.getSelectedItem());
	});
	
	// CheckBox
	const checkbox = new SComponent.CheckBox("チェックボックス");
	combobox.put(checkbox, SComponent.PUT_TYPE.NEWLINE);
	checkbox.addListener(function () {
		Senko.println("CheckBox " + checkbox.isChecked());
	});
	
	// Slider
	const slider = new SComponent.Slider(0, 100);
	checkbox.put(slider, SComponent.PUT_TYPE.NEWLINE);
	slider.setMinorTickSpacing(10);
	slider.setMajorTickSpacing(50);
	slider.addListener(function () {
		Senko.println("" + slider.getValue());
	});
	
	const imagepanel = new SComponent.ImagePanel();
	slider.put(imagepanel, SComponent.PUT_TYPE.NEWLINE);
	imagepanel.putImage("../resource/image_test1.jpg");
	
	// 色の選択
	const picker = new SComponent.ColorPicker();
	imagepanel.put(picker, SComponent.PUT_TYPE.NEWLINE);
	picker.addListener(function () {
		Senko.println("ColorPicker " + picker.getColor());
	});
	
};

main();
