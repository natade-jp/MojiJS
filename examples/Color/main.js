import Senko from "../../build/Senko.js";

const Color = Senko.Color;

const main = function() {
	
	let color;
	
	Senko.println("Color クラスのサンプル");
	
	Senko.println("色を設定したり取得ができる。");
	
	Senko.println("正規化した値での設定と取得");
	color = Color.newColorNormalizedRGB(1.0, 1.0, 1.0).getNormalizedRGB();
	Senko.println([color.r, color.g, color.b]);
	color = Color.newColorNormalizedHSV(0.1, 0.8, 0.7).getNormalizedHSV();
	Senko.println([color.h, color.s, color.v]);
	color = Color.newColorNormalizedHSL(0.1, 0.8, 0.7).getNormalizedHSL();
	Senko.println([color.h, color.s, color.l]);
	
	Senko.println("整数での設定と取得");
	color = Color.newColorRGB(50, 100, 150).getRGB();
	Senko.println([color.r, color.g, color.b]);
	color = Color.newColorHSV(50, 100, 150).getHSV();
	Senko.println([color.h, color.s, color.v]);
	color = Color.newColorHSL(50, 100, 150).getHSL();
	Senko.println([color.h, color.s, color.l]);
	
	Senko.println("アルファチャンネルの設定も可能");
	color = Color.newColorNormalizedRGB(0.1, 0.2, 0.3, 0.4).getNormalizedRGB();
	Senko.println([color.r, color.g, color.b, color.a]);
	
	Senko.println("HSLとHLSの変換のテスト");
	for(let i = 0; i < 13; i++) {
		const color1 = Color.newColorHSV(30 * i, 200, 100).getHSV();
		const color2 = Color.newColorHSL(30 * i, 200, 100).getHSL();
		Senko.println([color1.h, color1.s, color1.v, color2.h, color2.s, color2.l]);
	}
	
	Senko.println("配列で引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB([0.2, 0.4, 0.6]).getNormalizedRGB();
	Senko.println([color.r, color.g, color.b]);
	
	Senko.println("オブジェクトで引数を渡すことも可能です");
	color = Color.newColorNormalizedRGB(color).getNormalizedRGB();
	Senko.println([color.r, color.g, color.b]);
	
	Senko.println("JavaのColorっぽく色を取り出せます");
	color = Color.newColorRGB(50, 100, 150);
	Senko.println([color.getRed(), color.getGreen(), color.getBlue()]);
	
	Senko.println("16進数の設定");
	color = Color.newColorRGB(0x4080B0);
	Senko.println(color);
	
	Senko.println("明るめと暗め");
	color = Color.newColorRGB(50, 100, 150).brighter();
	Senko.println(color);
	color = Color.newColorRGB(50, 100, 150).darker();
	Senko.println(color);
	
	Senko.println("色名の指定");
	Senko.println(Color.RED);
	
};

main();
