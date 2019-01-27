import Senko from "../../libs/Senko.js";

const Color = Senko.Color;
const Log = Senko.Log;

const main = function() {
	
	let color;
	
	Log.println("Color クラスのサンプル");
	
	Log.println("色を設定したり取得ができる。");
	
	Log.println("正規化した値での設定と取得");
	color = Color.newColorNormalizedRGB(1.0, 1.0, 1.0).getNormalizedRGB();
	Log.println([color.r, color.g, color.b]);
	color = Color.newColorNormalizedHSV(0.1, 0.8, 0.7).getNormalizedHSV();
	Log.println([color.h, color.s, color.v]);
	color = Color.newColorNormalizedHSL(0.1, 0.8, 0.7).getNormalizedHSL();
	Log.println([color.h, color.s, color.l]);
	
	Log.println("整数での設定と取得");
	color = Color.newColorRGB(50, 100, 150).getRGB();
	Log.println([color.r, color.g, color.b]);
	color = Color.newColorHSV(50, 100, 150).getHSV();
	Log.println([color.h, color.s, color.v]);
	color = Color.newColorHSL(50, 100, 150).getHSL();
	Log.println([color.h, color.s, color.l]);
	
	Log.println("アルファチャンネルの設定も可能");
	color = Color.newColorNormalizedRGB(0.1, 0.2, 0.3, 0.4).getNormalizedRGB();
	Log.println([color.r, color.g, color.b, color.a]);
	
	Log.println("HSLとHLSの変換のテスト");
	for(let i = 0; i < 13; i++) {
		const color1 = Color.newColorHSV(30 * i, 200, 100).getHSV();
		const color2 = Color.newColorHSL(30 * i, 200, 100).getHSL();
		Log.println([color1.h, color1.s, color1.v, color2.h, color2.s, color2.l]);
	}
	
	Log.println("配列で引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB([0.2, 0.4, 0.6]).getNormalizedRGB();
	Log.println([color.r, color.g, color.b]);
	
	Log.println("オブジェクトで引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB(color).getNormalizedRGB();
	Log.println([color.r, color.g, color.b]);
	
	Log.println("JavaのColorっぽく色を取り出せます");
	color = Color.newColorRGB(50, 100, 150);
	Log.println([color.getRed(), color.getGreen(), color.getBlue()]);
	
	Log.println("16進数の設定");
	color = Color.newColorRGB(0x4080B0);
	Log.println(color);
	
	Log.println("明るめと暗め");
	color = Color.newColorRGB(50, 100, 150).brighter();
	Log.println(color);
	color = Color.newColorRGB(50, 100, 150).darker();
	Log.println(color);
	
	Log.println("色名の指定");
	Log.println(Color.RED);
	
	Log.println("加法混色");
	Log.println(Color.RED);
	Log.println(Color.BLUE.setAlpha(0.5));
	Log.println(Color.RED.addColorMixture(Color.BLUE.setAlpha(0.5)));

	Log.println("減法混色");
	Log.println(Color.CYAN);
	Log.println(Color.MAGENTA.setAlpha(0.5));
	Log.println(Color.CYAN.subColorMixture(Color.MAGENTA.setAlpha(0.5)));

};

main();
