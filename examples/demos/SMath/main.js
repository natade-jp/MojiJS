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
	
	const A = _("[1 2;3 4]").qr();
	Log.println(A.Q);
	Log.println(A.R);
	Log.println(A.Q.mul(A.R));
	
	Log.println(_("[2 3 4;1 4 2;2 1 4]").rank(1e-10));

	// 22
	Log.println(_("[6 2;1 4]").det());
	// -45
	Log.println(_("[1 2 3;0 -1 5;-2 3 4]").det());
	// -32
	Log.println(_("[3 2 1 0;1 2 3 4;2 1 0 1;2 0 2 1]").det());

	// 1, -1, 3, -2
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").linsolve("[2; 12; 4; -1]"));

	// [2 4]
	Log.println(_("[2 1 3 4;3 2 5 2]").size());
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").max());
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").min());

};

main();
