import Senko from "../../libs/Senko.js";

const Log = Senko.Log;
const SMath = Senko.MathX.SMath;
const Matrix = SMath.Matrix;
const _ = Matrix.createConstMatrix;

const main = function() {

	Log.println("◆◆SMath クラスのサンプル");
	
	Log.println(_("[1 2 3; 4 5 6; 7 8 9]"));

	Log.println(_("[1 2 + j; 3 4]").mul(_("[4 5; 7 8]")));

	Log.println(_("[1 2 + j; 3 4]").mul(_(2)));

	Log.println(_("[j 1 -1; -2 0 1; 0 2 1]").inv());
	
};

main();
