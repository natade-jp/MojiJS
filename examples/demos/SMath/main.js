import Senko from "../../libs/Senko.js";

const Log = Senko.Log;
const SMath = Senko.MathX.SMath;
const Matrix = SMath.Matrix;
const _ = Matrix.createConstMatrix;


const main = function() {

	Log.println("◆◆SMath クラスのサンプル");

	// 3.16578 + 1.9596i
	Log.println(_("1 + 2i").sin());

	// 2.03272 - 3.0519ii
	Log.println(_("1 + 2i").cos());

	// 0.0338128 + 1.01479i
	Log.println(_("1 + 2i").tan());

	// 1.33897 + 0.402359i
	Log.println(_("1 + 2i").atan());

	// -0.0151327 - 0.179867i
	Log.println(_("1 + 2i").pow("2 + 3i"));

	Log.println(Matrix.eye(3));
	Log.println(Matrix.ones(3));
	Log.println(Matrix.zeros(3));
	Log.println(Matrix.rand(3));
	Log.println(Matrix.randn(3));
	
	Log.println(_("[1 2 3; 4 5 6; 7 8 9]"));

	Log.println(_("[1 2 + j; 3 4]").mul(_("[4 5; 7 8]")));

	Log.println(_("[1 2 + j; 3 4]").mul(_(3)));

	Log.println(_("[j 1 -1; -2 0 1; 0 2 1]").inv());

	Log.println(_("[1 2;2 2]").div("[3 2;1 1]"));
	
	const QR = _("[1 2;3 4]").qr();
	Log.println(QR.Q);
	Log.println(QR.R);
	Log.println(QR.Q.mul(QR.R));
	
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

	// 3  4  5  4
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").max());

	// -1 -3  1 -1
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").min());

	// -3
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").min().min());

	// [1 2 3;4 5 6]
	Log.println(_("[1 2 3;:;4 5 6]"));

	// 6
	Log.println(_("[1 2 3 4 5 6]").length);
	Log.println(_("[1;2;3;4;5;6]").length);

	// 5
	Log.println(_("[1 2 3; 4 5 6]").get(1, 1));

	// 26 44
	Log.println(_("[1 2;3 4]").dot("[5 6;7 8]"));

	// 17; 53
	Log.println(_("[1 2;3 4]").dot("[5 6;7 8]", 2));

	const VD = _("[1 -1;-1 2]").eigForJacobiMethod();
//	const VD = _("[1 2 3 4;2 5 4 0;3 4 1 1;4 0 1 2]").eigForJacobiMethod();
	Log.println(VD.V);
	Log.println(VD.D);

	const USV = _("[1 2;3 4]").svd();
	
	Log.println(USV.U);
	Log.println(USV.S);
	Log.println(USV.V);


};

main();
