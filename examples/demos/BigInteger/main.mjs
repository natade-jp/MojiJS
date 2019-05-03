import Senko from "../../libs/Senko.mjs";
import SenkoMath from "../../libs/SenkoMath.mjs";

const BigInteger = SenkoMath.BigInteger;
const Random = SenkoMath.Random;
const Log = Senko.Log;

const main = function() {
	
	const currentTimeMillis = function() {
		const date = new Date();
		return(date.getTime());
	};

	Log.println("BigInteger クラスのサンプル");

	let s1, s2, s3;
	
	Log.println("四則演算");
	s1 = new BigInteger("12345678");
	s2 = new BigInteger("-1234");

	Log.println("add");
	Log.println(s1.add(s1));
	Log.println(s1.add(s2));
	Log.println(s2.add(s1));
	Log.println(s2.add(s2));
	
	Log.println("subtract");
	Log.println(s1.sub(s1));
	Log.println(s1.sub(s2));
	Log.println(s2.sub(s1));
	Log.println(s2.sub(s2));
	
	Log.println("multiply");
	Log.println(s1.mul(s2));
	
	Log.println("divide");
	Log.println(s1.div(s2));
	
	s1 = new BigInteger("-1234567890123456789012345678901234567890");
	s2 = new BigInteger("123456789012345678901");
	
	Log.println("divideAndRemainder");
	Log.println(s1.divideAndRemainder(s2)[0] + " ... " + s1.divideAndRemainder(s2)[1]);
	
	Log.println("remainder");
	Log.println(s1.div(s2) + " ... " + s1.rem(s2));
	
	Log.println("mod");
	Log.println(s1.div(s2) + " ... " + s1.mod(s2));
	
	Log.println("////////////////////////////////");
	
	Log.println("ビット操作");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	
	Log.println(s1);
	Log.println(s2);
	Log.println("bitCount");
	Log.println(s1.bitCount());
	Log.println(s2.bitCount());
	
	Log.println("bitLength");
	Log.println(s1.bitLength());
	Log.println(s2.bitLength());
	
	Log.println("getLowestSetBit");
	Log.println(s1.getLowestSetBit());
	Log.println(s2.getLowestSetBit());
	
	Log.println("shiftLeft");
	s1 = BigInteger.ONE;
	for(let i = 0;i < 18; i++) {
		s1 = s1.shiftLeft(1);
		Log.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	Log.println("shiftRight");
	for(let i = 0;i < 18; i++) {
		s1 = s1.shiftRight(1);
		Log.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	s1 = new BigInteger("101001000100001000000", 2);
	
	Log.println("testBit");
	Log.println(s1.toString(2));
	s2 = s1.bitLength();
	for(let i = s2 - 1; i >= 0; i--) {
		Log.print(s1.testBit(i) ? 1 : 0);
	}
	Log.println("");
	
	s3 = BigInteger.ZERO;
	
	Log.println("setBit");
	for(let i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			s3 = s3.setBit(i);
		}
	}
	Log.println(s3.toString(2));
	
	Log.println("clearBit");
	for(let i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			Log.print(s3.clearBit(i).toString(2));
		}
	}
	Log.println("");
	
	Log.println("flipBit");
	for(let i = 0; i < s2; i++) {
		s3 = s3.flipBit(i);
		Log.print(s3.toString(2));
	}
	Log.println("");
	
	Log.println("////////////////////////////////");
	
	Log.println("ビット演算");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	s3 = new BigInteger("8765ffffff0000000000", 16);
	const s4 = s3.negate();
	
	Log.println("and");
	Log.println(s1.and(s2).toString(16));
	Log.println(s1.and(s3).toString(16));
	Log.println(s2.and(s4).toString(16));
	
	Log.println("or");
	Log.println(s1.or(s2).toString(16));
	Log.println(s1.or(s3).toString(16));
	Log.println(s2.or(s4).toString(16));
	
	Log.println("xor");
	Log.println(s1.xor(s2).toString(16));
	Log.println(s1.xor(s3).toString(16));
	Log.println(s2.xor(s4).toString(16));
	
	Log.println("not");
	Log.println(s1.not().toString(16));
	Log.println(s2.not().toString(16));
	
	Log.println("andNot");
	Log.println(s1.andNot(s2).toString(16));
	Log.println(s1.andNot(s3).toString(16));
	Log.println(s2.andNot(s4).toString(16));
	
	Log.println("////////////////////////////////");
	
	Log.println("数値の変換");

	s1 = new BigInteger("3334342423423", 16);
	
	Log.println("toString()");
	Log.println(s1.toString());
	
	Log.println("toString(2)");
	Log.println(s1.toString(2));
	
	Log.println("toString(10)");
	Log.println(s1.toString(10));
	
	Log.println("toString(16)");
	Log.println(s1.toString(16));
	
	Log.println("intValue");
	Log.println(s1.intValue().toString(16));
	
	Log.println("longValue");
	Log.println(s1.longValue().toString(16));
	
	Log.println("floatValue");
	Log.println(s1.floatValue());
	
	Log.println("doubleValue");
	Log.println(s1.doubleValue());
	
	Log.println("////////////////////////////////");
	
	Log.println("乱数");
	
	const random = new Random();
	
	Log.println("new BigInteger(numBits, rnd)");
	for(let i = 0; i < 3; i++) {
		Log.printf("% 50s\n", (new BigInteger(50, random)).toString(2) );
	}
	
	Log.println("nextProbablePrime");
	
	s1 = new BigInteger("100000");
	for(let i = 0; i < 3; i++) {
		s1 = s1.nextProbablePrime();
		Log.println(s1);
	}
	
	Log.println("isProbablePrime");
	
	s1 = new BigInteger("156b14b55", 16);
	Log.println(s1 + " は素数か？ -> " + s1.isProbablePrime(100));
	
	Log.println("probablePrime");
	for(let i = 0; i < 3; i++) {
		Log.println(BigInteger.probablePrime(20, random));
	}
	
	Log.println("////////////////////////////////");
	
	Log.println("その他の演算");
	
	Log.println("+100 remainder & mod");
	s1 = new BigInteger("100");
	for(let i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		Log.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(let i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		Log.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	Log.println("-100 remainder & mod");
	s1 = new BigInteger("-100");
	for(let i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		Log.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(let i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		Log.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	
	Log.println("compareTo");
	Log.println((new BigInteger("200000")).compareTo(new BigInteger("163840")));
	Log.println((new BigInteger("100000")).compareTo(new BigInteger("81920")));
	
	Log.println("gcd");
	Log.println((new BigInteger("12")).gcd(new BigInteger("18")));
	
	Log.println("pow");
	s1 = new BigInteger("2");
	Log.println(s1.pow(1000));
	
	Log.println("modPow");
	Log.println((new BigInteger("14123999253219")).modPow(new BigInteger("70276475859277"),new BigInteger("86706662670157")));
	Log.println(BigInteger.valueOf(-324).modPow(BigInteger.valueOf(123), BigInteger.valueOf(55)));
	
	Log.println("modInverse");
	Log.println((BigInteger.valueOf(15)).modInverse(BigInteger.valueOf(4)));
	Log.println((BigInteger.valueOf(19)).modInverse(BigInteger.valueOf(41)));
	
	Log.println("////////////////////////////////");
	
	Log.println("計算速度の測定");
	
	let time = 0;
	let x, y;

	Log.println("2^5000 = ");
	x = new BigInteger("2");
	
	time = currentTimeMillis();
	x = x.pow(5000);
	Log.println("計算時間\t" + (currentTimeMillis() - time) + "ms");
	
	time = currentTimeMillis();
	y = x.toString();
	Log.println("10進数変換\t" + (currentTimeMillis() - time) + "ms");

	time = currentTimeMillis();
	x = new BigInteger(y);
	Log.println("内部変数変換\t" + (currentTimeMillis() - time) + "ms");
	
	Log.println("500! = ");
	x = new BigInteger("1");
	
	time = currentTimeMillis();
	for(let i = 1;i <= 500;i++) {
		x = x.multiply(BigInteger.valueOf(i));
	}
	Log.println("計算時間\t" + (currentTimeMillis() - time) + "ms");
	
	time = currentTimeMillis();
	y = x.toString();
	Log.println("10進数変換\t" + (currentTimeMillis() - time) + "ms");

	time = currentTimeMillis();
	x = new BigInteger(y);
	Log.println("内部変数変換\t" + (currentTimeMillis() - time) + "ms");
	
};

main();

