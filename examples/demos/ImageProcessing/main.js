import Senko from "../../../build/Senko.js";

const SComponent = Senko.SComponent;
const ImageProcessing = Senko.ImageProcessing;

const testFileLoad = function(panel) {
	
	panel.clear();
	
	// Canvas
	const canvas = new SComponent.Canvas();
	canvas.setUnit(SComponent.UNIT_TYPE.PX);
	canvas.setPixelSize(256, 256);
	canvas.setSize(256, 256);
	panel.put(canvas, SComponent.PUT_TYPE.IN);
	
	// ボタン1
	const loadbutton = new SComponent.FileLoadButton("読み込み");
	loadbutton.setFileAccept(SComponent.FILE_ACCEPT.IMAGE);
	canvas.put(loadbutton, SComponent.PUT_TYPE.NEWLINE);
	loadbutton.addListener(function(file) {
		canvas.putImage(
			file[0],
			function() {
				Senko.println("ロード完了");
			}
		);
	});
	
	const savebutton = new SComponent.Button("IMG要素化");
	loadbutton.put(savebutton, SComponent.PUT_TYPE.RIGHT);
	savebutton.addListener(function() {
		imagepanel.putImage(
			canvas,
			function() {
				Senko.println("描写完了");
			}
		);
	});
	
	// SImagePanel
	const imagepanel = new SComponent.ImagePanel();
	savebutton.put(imagepanel, SComponent.PUT_TYPE.NEWLINE);
	
};

const testWritePixel = function(panel) {
	
	panel.clear();
	
	// Canvas
	const canvas = new SComponent.Canvas();
	canvas.setUnit(SComponent.UNIT_TYPE.PX);
	canvas.setPixelSize(256, 256);
	canvas.setSize(256, 256);
	const size = canvas.getPixelSize();
	canvas.getContext().fillStyle = "rgb(0, 0, 0)";
	canvas.getContext().fillRect(0, 0, size.width, size.height);
	
	panel.put(canvas, SComponent.PUT_TYPE.IN);
	
	// ボタン1
	const button1 = new SComponent.Button("RGBA でピクセルに書き込み");
	canvas.put(button1, SComponent.PUT_TYPE.NEWLINE);
	button1.addListener(function() {
		const data = new ImageProcessing.ImgDataRGBA(canvas.getImageData());
		let i = 0;
		for(i = 0; i < 100; i++) {
			const x = Math.floor(Math.random() * data.width);
			const y = Math.floor(Math.random() * data.height);
			const color = new ImageProcessing.ImgColorRGBA([255, 255, 255, 255]);
			data.setPixelInside(x, y, color);
		}
		canvas.putImageData(data.getImageData());
	});
	
	// ボタン2
	const button2 = new SComponent.Button("輝度値 でピクセルに書き込み");
	button1.put(button2, SComponent.PUT_TYPE.RIGHT);
	button2.addListener(function() {
		const data = new ImageProcessing.ImgDataY(canvas.getImageData());
		let i = 0;
		for(i = 0; i < 100; i++) {
			const x = Math.floor(Math.random() * data.width);
			const y = Math.floor(Math.random() * data.height);
			const color = new ImageProcessing.ImgColorY(255);
			data.setPixelInside(x, y, color);
		}
		canvas.putImageData(data.getImageData());
	});
	
};

const testInterpolation = function(panel) {
	
	panel.clear();
	
	const srcWidth  = 16;
	const srcHeight = 16;
	const dstWidth  = 256;
	const dstHeight = 256;
	
	// Button
	const gene = new SComponent.Button("画像作成");
	const genefunc = function() {
		const data = new ImageProcessing.ImgDataY();
		data.putImageData(inputcanvas.getImageData());
		data.forEach(function(color, x, y) {
			data.setPixelInside(x, y, color.random());
		});
		inputcanvas.putImageData(data.getImageData());
	};
	gene.addListener(genefunc);
	panel.put(gene, SComponent.PUT_TYPE.IN);
	
	// Canvas
	const inputcanvas = new SComponent.Canvas();
	const outputcanvas = new SComponent.Canvas();
	
	inputcanvas.setPixelSize(srcWidth, srcHeight);
	inputcanvas.setUnit(SComponent.UNIT_TYPE.PX);
	inputcanvas.setSize(srcWidth, srcHeight);
	genefunc();
	gene.put(inputcanvas, SComponent.PUT_TYPE.NEWLINE);
	
	const wrapmode = [
		ImageProcessing.MODE_WRAP.REPEAT,
		ImageProcessing.MODE_WRAP.CLAMP
	];
	const filtermode = [
		ImageProcessing.MODE_IP.NEAREST_NEIGHBOR,
		ImageProcessing.MODE_IP.BILINEAR,
		ImageProcessing.MODE_IP.COSINE,
		ImageProcessing.MODE_IP.HERMITE4_3,
		ImageProcessing.MODE_IP.HERMITE4_5,
		ImageProcessing.MODE_IP.HERMITE16,
		ImageProcessing.MODE_IP.BICUBIC,
		ImageProcessing.MODE_IP.BICUBIC_SOFT,
		ImageProcessing.MODE_IP.BICUBIC_NORMAL,
		ImageProcessing.MODE_IP.BICUBIC_SHARP
	];
	
	const cb_selectertype = new SComponent.ComboBox(wrapmode);
	inputcanvas.put(cb_selectertype, SComponent.PUT_TYPE.NEWLINE);
	cb_selectertype.setWidth(16);
	
	const cb_interpolationtype = new SComponent.ComboBox(filtermode);
	cb_selectertype.put(cb_interpolationtype, SComponent.PUT_TYPE.NEWLINE);
	cb_interpolationtype.setWidth(16);
	
	// Button
	const button = new SComponent.Button("拡大");
	cb_interpolationtype.put(button, SComponent.PUT_TYPE.NEWLINE);
	button.addListener(function() {
		const srcdata = new ImageProcessing.ImgDataY(inputcanvas.getImageData());
		srcdata.setWrapMode(cb_selectertype.getSelectedItem());
		srcdata.setInterpolationMode(cb_interpolationtype.getSelectedItem());
		const dstdata = new ImageProcessing.ImgDataY(dstWidth, dstHeight);
		dstdata.drawImgData(srcdata, 0, 0, dstWidth, dstHeight);
		outputcanvas.putImageData(dstdata.getImageData());
	});
	
	outputcanvas.setUnit(SComponent.UNIT_TYPE.PX);
	outputcanvas.setPixelSize(dstWidth, dstHeight);
	outputcanvas.setSize(dstWidth, dstHeight);
	button.put(outputcanvas, SComponent.PUT_TYPE.NEWLINE);
	outputcanvas.getContext().fillStyle = "rgb(0, 0, 0)";
	const size = outputcanvas.getPixelSize();
	outputcanvas.getContext().fillRect(0, 0, size.width, size.height);
	
};


const testBlending = function(panel) {
	
	panel.clear();
	
	const canvasWidth  = 128;
	const canvasHeight = 128;
	
	// Canvas
	const canvas_src1	= new SComponent.Canvas();
	const canvas_src2	= new SComponent.Canvas();
	const canvas_dst	= new SComponent.Canvas();
	
	canvas_src1.setPixelSize(canvasWidth, canvasHeight);
	canvas_src1.setUnit(SComponent.UNIT_TYPE.PX);
	canvas_src1.setSize(canvasWidth, canvasHeight);
	canvas_src1.putImage("../resource/image_x.png");
	canvas_src2.setPixelSize(canvasWidth, canvasHeight);
	canvas_src2.setUnit(SComponent.UNIT_TYPE.PX);
	canvas_src2.setSize(canvasWidth, canvasHeight);
	canvas_src2.putImage("../resource/image_y.png");
	canvas_dst.setPixelSize(canvasWidth, canvasHeight);
	canvas_dst.setUnit(SComponent.UNIT_TYPE.PX);
	canvas_dst.setSize(canvasWidth, canvasHeight);
	
	const label1 = new SComponent.Label("ベース画像");
	panel.put(label1, SComponent.PUT_TYPE.IN);
	label1.put(canvas_src1, SComponent.PUT_TYPE.RIGHT);
	
	const label2 = new SComponent.Label("上書き画像");
	canvas_src1.put(label2, SComponent.PUT_TYPE.NEWLINE);
	label2.put(canvas_src2, SComponent.PUT_TYPE.RIGHT);
	
	const brendtype = [
		ImageProcessing.MODE_BLEND.NONE,
		ImageProcessing.MODE_BLEND.ALPHA,
		ImageProcessing.MODE_BLEND.ADD,
		ImageProcessing.MODE_BLEND.SUB,
		ImageProcessing.MODE_BLEND.REVSUB,
		ImageProcessing.MODE_BLEND.MUL
	];
	const cb_brendtype = new SComponent.ComboBox(brendtype);
	cb_brendtype.setWidth(8);
	canvas_src2.put(cb_brendtype, SComponent.PUT_TYPE.NEWLINE);
	
	const globalalpha = [
		"1.0",
		"0.8",
		"0.5"
	];
	const cb_globalalpha = new SComponent.ComboBox(globalalpha);
	cb_globalalpha.setWidth(8);
	cb_brendtype.put(cb_globalalpha, SComponent.PUT_TYPE.RIGHT);
	
	const button = new SComponent.Button("blend");
	cb_globalalpha.put(button, SComponent.PUT_TYPE.RIGHT);
	button.addListener(function() {
		const src1 = new ImageProcessing.ImgDataRGBA(canvas_src1.getImageData());
		const src2 = new ImageProcessing.ImgDataRGBA(canvas_src2.getImageData());
		src1.setBlendType(cb_brendtype.getSelectedItem());
		src1.globalAlpha = parseFloat(cb_globalalpha.getSelectedItem());
		src1.drawImgData(src2, 0, 0);
		canvas_dst.putImageData(src1.getImageData());
	});
	
	const label3 = new SComponent.Label("結果画像");
	button.put(label3, SComponent.PUT_TYPE.NEWLINE);
	label3.put(canvas_dst, SComponent.PUT_TYPE.RIGHT);	
};


function testEtc(panel) {
	
	panel.clear();
	
	const canvasWidth  = 320;
	const canvasHeight = 240;
	
	// Canvas
	const canvas_src	= new SComponent.Canvas();
	const canvas_dst	= new SComponent.Canvas();
	
	canvas_src.setPixelSize(canvasWidth, canvasHeight);
	canvas_src.setUnit(SComponent.UNIT_TYPE.PX);
	canvas_src.setSize(canvasWidth, canvasHeight);
	canvas_dst.setPixelSize(canvasWidth, canvasHeight);
	canvas_dst.setUnit(SComponent.UNIT_TYPE.PX);
	canvas_dst.setSize(canvasWidth, canvasHeight);
	
	//-------------------------
	
	const label1 = new SComponent.Label("使用画像");
	panel.put(label1, SComponent.PUT_TYPE.IN);
	const picturetype = [
		"../resource/image_parrots.jpg",
		"../resource/image_mandrill.jpg",
		"../resource/image_girl.jpg",
		"../resource/image_lenna.jpg",
		"../resource/image_test1.jpg",
		"../resource/sampleimage.png",
		"../resource/image_wg.png"
	];
	const cb_picturetype = new SComponent.ComboBox(picturetype);
	cb_picturetype.setWidth(32);
	label1.put(cb_picturetype, SComponent.PUT_TYPE.RIGHT);
	cb_picturetype.addListener(function () {
		canvas_src.putImage(cb_picturetype.getSelectedItem());
	});
	canvas_src.putImage(picturetype[0]);
	
	//-------------------------
	
	const label2 = new SComponent.Label("入力画像");
	cb_picturetype.put(label2, SComponent.PUT_TYPE.NEWLINE);
	label2.put(canvas_src, SComponent.PUT_TYPE.RIGHT);
	
	//-------------------------
	
	const label3 = new SComponent.Label("処理の種類");
	canvas_src.put(label3, SComponent.PUT_TYPE.NEWLINE);
	const filtertype = [
		"ソフト",
		"シャープ",
		"グレースケール",
		"ノーマルマップ",
		"ガウシアンフィルタ",
		"バイラテラルフィルタ",
		"レンズフィルタ",
		"アンシャープ",
		"単純減色",
		"組織的ディザ法による減色",
		"誤差拡散法による減色"
	];
	const cb_filtertype = new SComponent.ComboBox(filtertype);
	cb_filtertype.setWidth(32);
	label3.put(cb_filtertype, SComponent.PUT_TYPE.RIGHT);
	
	//-------------------------
	
	const button = new SComponent.Button("実行");
	cb_filtertype.put(button, SComponent.PUT_TYPE.RIGHT);
	button.addListener(function() {
		const src = new ImageProcessing.ImgDataRGBA(canvas_src.getImageData());
		if(cb_filtertype.getSelectedItem() === filtertype[0]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterBlur(7);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[1]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterSharp(0.5);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[2]) {
			src.grayscale();
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[3]) {
			src.grayscale();
			const height = new ImageProcessing.ImgDataY(src);
			height.setWrapMode(ImageProcessing.MODE_WRAP.REPEAT);
			height.filterGaussian(5);
			canvas_dst.putImageData(height.getNormalMap().getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[4]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterGaussian(7);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[5]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterBilateral(5, 0.8);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[6]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterSoftLens(5, 1.2);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[7]) {
			src.setWrapMode(ImageProcessing.MODE_WRAP.CLAMP);
			src.filterUnSharp(7, 1);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[8]) {
			src.filterQuantizationSimple(64);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[9]) {
			src.filterQuantizationOrdered(64);
			canvas_dst.putImageData(src.getImageData());
		}
		else if(cb_filtertype.getSelectedItem() === filtertype[10]) {
			src.filterQuantizationDiffusion(64);
			canvas_dst.putImageData(src.getImageData());
		}
	});
	
	//-------------------------
	
	const label4 = new SComponent.Label("結果画像");
	button.put(label4, SComponent.PUT_TYPE.NEWLINE);
	label4.put(canvas_dst, SComponent.PUT_TYPE.RIGHT);
}

const main = function() {
	
	Senko.println("ImageProcessing クラスのサンプル");
	
	// パネルを作って、指定した ID の要素内に入れる。
	const mainpanel = new SComponent.Panel();
	mainpanel.putMe("scomponent", SComponent.PUT_TYPE.IN);
	
	const label = new SComponent.Label("ImageProcessing のテストです");
	mainpanel.put(label, SComponent.PUT_TYPE.IN);
	
	const combobox_type = [
		"画像ファイルの読み込み",
		"データの読み書き",
		"画像補間",
		"ブレンド",
		"そのほかいろいろ"
	];
	const combobox = new SComponent.ComboBox(combobox_type);
	combobox.setWidth(20);
	label.put(combobox, SComponent.PUT_TYPE.NEWLINE);
	
	combobox.addListener(function () {
		const item = combobox.getSelectedItem();
		
		if(item === combobox_type[0]) {
			testFileLoad(testpanel);
		}
		else if(item === combobox_type[1]) {
			testWritePixel(testpanel);
		}
		else if(item === combobox_type[2]) {
			testInterpolation(testpanel);
		}
		else if(item === combobox_type[3]) {
			testBlending(testpanel);
		}
		else if(item === combobox_type[4]) {
			testEtc(testpanel);
		}
	});
	
	const testpanel = new SComponent.Panel();
	mainpanel.put(testpanel, SComponent.PUT_TYPE.NEWLINE);
	
	combobox.setSelectedItem(combobox_type[4]);
	testEtc(testpanel);
};

main();

