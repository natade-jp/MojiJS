import Senko from "../../../build/Senko.js";

const SComponent = Senko.SComponent;
const File = Senko.File;

const main = function() {
	
	Senko.println("File クラスのサンプル");
	
	const panel = new SComponent.Panel();
	panel.putMe("test_space", SComponent.PUT_TYPE.IN);
	const slLabel = new SComponent.Label("テキスト");
	slLabel.putMe(panel, SComponent.PUT_TYPE.IN);
	const slCanvas = new SComponent.Canvas();
	slCanvas.putMe(slLabel, SComponent.PUT_TYPE.NEWLINE);
	
	Senko.println("ファイルの情報");
	const file = new File("../resource/sampletext.txt");
	Senko.println(file.getAbsolutePath());
	Senko.println(file.getName());
	Senko.println(file.getParent());
	Senko.println(file.getExtensionName());
	Senko.println("ファイルをロードする");
	file.download(function(file) {
		Senko.println("[" + file.getName() + "] ダウンロード完了");
		Senko.println(file.getText());
	});
	
	const fText = new File("../resource/sampletext.txt");
	const fImage = new File("../resource/sampleimage.png");
	File.downloadFileList([fText, fImage], function() {
		Senko.println("[" + fText.getName() + "] ダウンロード完了");
		Senko.println("[" + fImage.getName() + "] ダウンロード完了");
		Senko.println("テキストと画像を同時に書き換えます！");
		slLabel.setText(fText.getText());
		slCanvas.putImage(fImage.getImage());
	});
	
};

main();
