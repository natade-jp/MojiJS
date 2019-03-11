import Senko from "../../libs/Senko.js";

const Log = Senko.Log;
const SMath = Senko.MathX.SMath;
const Matrix = SMath.Matrix;
const _ = Matrix.createConstMatrix;

const main = function() {

	Log.println("◆◆SMath クラスのサンプル");
	
	Log.println(Matrix.eye(3));

	Log.println(_("[1 2 3; 4 5 6; 7 8 9]"));

	Log.println(_("[1 2 + j; 3 4]").mul(_("[4 5; 7 8]")));

	Log.println(_("[1 2 + j; 3 4]").mul(_(3)));

	Log.println(_("[j 1 -1; -2 0 1; 0 2 1]").inv());

	Log.println(_("[1 2;2 2]").div("[3 2;1 1]"));
	
	let A = _("[1 2;3 4]").qr();
	
	Log.println(A.Q);
	Log.println(A.R);
	Log.println(A.Q.mul(A.R));
	
	Log.println(_("[2 3 4;1 4 2;2 1 4]").rank(1e-10));

};

main();
