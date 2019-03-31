import Senko from "../../libs/Senko.js";
import SenkoMath from "../../libs/SenkoMath.js";

const Log = Senko.Log;
const SMath = SenkoMath.SMath;
const Matrix = SMath.Matrix;
const _ = Matrix.createConstMatrix;

const testLUP = function(text) {
	Log.println("lup");
	const A = _(text);
	Log.println(A);
	const LUP = A.lup();
	Log.println(LUP.L);
	Log.println(LUP.U);
	Log.println(LUP.P);
	Log.println(LUP.P.T().mul(LUP.L).mul(LUP.U));
};

const testQR = function(text) {
	Log.println("qr");
	const A = _(text);
	Log.println(A);
	const QR = A.qr();
	Log.println(QR.Q);
	Log.println(QR.R);
	Log.println(QR.Q.mul(QR.R));
};

const testTRI = function(text) {
	Log.println("tridiagonalize");
	const A = _(text);
	Log.println(A);
	const VD = A.tridiagonalize();
	Log.println(VD.P);
	Log.println(VD.H);
	Log.println(VD.P.mul(VD.H).mul(VD.P.T()));
};

const testEIG = function(text) {
	Log.println("eig");
	const A = _(text);
	Log.println(A);
	const VD = A.eig();
	Log.println(VD.V);
	Log.println(VD.D);
	Log.println(VD.V.mul(VD.D).mul(VD.V.T()));
};

const testSVD = function(text) {
	Log.println("svd");
	const A = _(text);
	Log.println(A);
	const USV = A.svd();
	Log.println(USV.U);
	Log.println(USV.S);
	Log.println(USV.V);
	Log.println(USV.U.mul(USV.S).mul(USV.V.T()));
};

const main = function() {

	Log.println("◆◆SMath クラスのサンプル");

	// 3.16578 + 1.9596i
	Log.println("sin");
	Log.println(_("1 + 2i").sin());

	// 2.03272 - 3.0519i
	Log.println("cos");
	Log.println(_("1 + 2i").cos());

	// 0.0338128 + 1.01479i
	Log.println("tan");
	Log.println(_("1 + 2i").tan());

	// 1.33897 + 0.402359i
	Log.println("atan");
	Log.println(_("1 + 2i").atan());

	// -0.0151327 - 0.179867i
	Log.println("pow");
	Log.println(_("1 + 2i").pow("2 + 3i"));

	Log.println("eye");
	Log.println(Matrix.eye(3));
	Log.println("ones");
	Log.println(Matrix.ones(3));
	Log.println("zeros");
	Log.println(Matrix.zeros(3));
	Log.println("rand");
	Log.println(Matrix.rand(3));
	Log.println("randn");
	Log.println(Matrix.randn(3));

	// 1  2  3
	// 4  5  6
	// 7  8  9
	Log.println(_("[1 2 3; 4 5 6; 7 8 9]"));

	// 18 +  7i  21 +  8i
	// 40 +  0i  47 +  0i
	Log.println("mul");
	Log.println(_("[1 2 + j; 3 4]").mul(_("[4 5; 7 8]")));

	// 3 +  0i   6 +  3i
	// 9 +  0i  12 +  0i
	Log.println("mul");
	Log.println(_("[1 2 + j; 3 4]").mul(_(3)));

	// -0.5000 -0.7500  0.2500
	//  0.5000  0.2500  0.2500
	// -1.0000 -0.5000  0.5000
	Log.println("inv");
	Log.println(_("[1 1 -1; -2 0 1; 0 2 1]").inv());
	
	// -1.3333 -0.3333  0.6667
	// 1.0833  0.3333 -0.4167
	Log.println("pinv");
	Log.println(_("[1 2;3 4;5 6]").pinv());
	
	//-1.0000  4.0000
	// 0.0000  2.0000
	Log.println("div");
	Log.println(_("[1 2;2 2]").div("[3 2;1 1]"));

	// 0 1 1 2 1 1 2 2 1
	Log.println("rank");
	Log.println(_("[0]").rank());
	Log.println(_("[3]").rank());
	Log.println(_("[0 0 0;0 1 0;0 0 0]").rank());
	Log.println(_("[2 3 4;1 4 2;2 1 4]").rank());
	Log.println(_("[1 2 1]").rank());
	Log.println(_("[1;2;3]").rank());
	Log.println(_("[1 2 3 -1;0 -1 -1 1;2 3 5 -1]").rank());
	Log.println(_("[1 2 3;0 -1 -1;2 3 5]").rank());
	Log.println(_("[0 0 0;0 0 0;0 0 1]").rank());
	
	// 22
	// -45
	// -32
	Log.println("det");
	Log.println(_("[6 2;1 4]").det());
	Log.println(_("[1 2 3;0 -1 5;-2 3 4]").det());
	Log.println(_("[3 2 1 0;1 2 3 4;2 1 0 1;2 0 2 1]").det());

	// 1, -1, 3, -2
	Log.println("linsolve");
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").linsolve("[2; 12; 4; -1]"));

	// [2 4]
	Log.println("size");
	Log.println(_("[2 1 3 4;3 2 5 2]").size());

	// 3  4  5  4
	Log.println("max");
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").max());

	// -1 -3  1 -1
	Log.println("min");
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").min());

	// -3
	Log.println("min.min");
	Log.println(_("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]").min().min());

	// [1 2 3;4 5 6]
	Log.println(_("[1 2 3;:;4 5 6]"));

	// 6
	Log.println("length");
	Log.println(_("[1 2 3 4 5 6]").length);
	Log.println(_("[1;2;3;4;5;6]").length);

	// 5
	Log.println("get");
	Log.println(_("[1 2 3; 4 5 6]").get(1, 1));

	// -4 - 7i
	Log.println("inner");
	Log.println(_("1 + 2j").inner("2 - 3j"));

	// 21 +  5i  12 + 32i
	// 12 +  5i; 21 + 32i
	Log.println("inner");
	Log.println(_("[1 2;3j 4]").inner("[5j 6;7j 8j]"));
	Log.println(_("[1 2;3j 4]").inner("[5j 6;7j 8j]", 2));

	// QR分解
	testQR("[1 2 3;4 5 6;7 8 9]");
	testQR("[0 0 0;1 2 3;4 5 6]");
	testQR("[1 2 3;4 5 6;0 0 0]");
	testQR("[1 2; 3 4; 5 6]");
	testQR("[1 2 3;4 5 6]");
	
	// LUP分解
	testLUP("[1 2 3 3;4 5 6 6;7 8 9 2]");
	testLUP("[1 4 2;3 5 1;2 4 2;1 0 9]");
	testLUP("[1 4 2;3 5 1;0 0 0;1 0 9]");
	testLUP("[1 2 3;4 5 6;7 8 9]");
	testLUP("[1 2;3 4;5 6]");

	// 対称行列の三重対角化
	testTRI("[1 1 1 1;1 2 2 2;1 2 3 3;1 2 3 4]");
		
	// 対称行列の固有値分解
	testEIG("[1 1 1 1;1 2 2 2;1 2 3 3;1 2 3 4]");

	// 特異値分解
	testSVD("[2 1 3 4;3 2 5 2; 3 4 1 -1; -1 -3 1 3]");
	testSVD("[1 2 3;4 5 6;7 8 9]");
	testSVD("[1 2 3;4 5 6]");
	testSVD("[1 2;3 4;5 6]");
	
};

main();