import Senko from "../../libs/Senko.js";

const SComponent = Senko.SComponent;
const File = Senko.File;
const Log = Senko.Log;

const main = function() {
	
	Log.println("File クラスのサンプル");
	
	const panel = new SComponent.Panel();
	panel.putMe("test_space", SComponent.PUT_TYPE.IN);
	const slLabel = new SComponent.Label("テキスト");
	slLabel.putMe(panel, SComponent.PUT_TYPE.IN);
	const slCanvas = new SComponent.Canvas();
	slCanvas.putMe(slLabel, SComponent.PUT_TYPE.NEWLINE);
	
	Log.println("ファイルの情報");
	const file = new File("../resource/sampletext.txt");
	Log.println(file.getAbsolutePath());
	Log.println(file.getName());
	Log.println(file.getParent());
	Log.println(file.getExtensionName());
	Log.println("ファイルをロードする");
	file.download(function(file) {
		Log.println("[" + file.getName() + "] ダウンロード完了");
		Log.println(file.getText());
	});
	
	const fText = new File("../resource/sampletext.txt");
	const fImage = new File("../resource/sampleimage.png");
	File.downloadFileList([fText, fImage], function() {
		Log.println("[" + fText.getName() + "] ダウンロード完了");
		Log.println("[" + fImage.getName() + "] ダウンロード完了");
		Log.println("テキストと画像を同時に書き換えます！");
		slLabel.setText(fText.getText());
		slCanvas.putImage(fImage.getImage());
	});
	
};

main();
