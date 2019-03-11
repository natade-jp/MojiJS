import Senko from "../../libs/Senko.js";

const Log = Senko.Log;
const SMath = Senko.MathX.SMath;
const M = SMath.Matrix;

const main = function() {

	let A, B;
	
	Log.println("◆◆SMath クラスのサンプル");
	
	A = new M("[1 2 3; 4 5 6; 7 8 9]");
	
	Log.println(A);

	A = new M("[1 2 + j; 3 4]");
	B = new M("[4 5; 7 8]");

	Log.println(A.mul(B));

};

main();
