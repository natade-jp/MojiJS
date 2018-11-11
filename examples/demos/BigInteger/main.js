import Senko from "../../libs/Senko.js";

const BigInteger = Senko.BigInteger;
const Random = Senko.Random;

const main = function() {
	
	const currentTimeMillis = function() {
		const date = new Date();
		return(date.getTime());
	};

	Senko.println("BigInteger クラスのサンプル");

	let s1, s2, s3;
	
	Senko.println("四則演算");
	s1 = new BigInteger("12345678");
	s2 = new BigInteger("-1234");

	Senko.println("add");
	Senko.println(s1.add(s1));
	Senko.println(s1.add(s2));
	Senko.println(s2.add(s1));
	Senko.println(s2.add(s2));
	
	Senko.println("subtract");
	Senko.println(s1.subtract(s1));
	Senko.println(s1.subtract(s2));
	Senko.println(s2.subtract(s1));
	Senko.println(s2.subtract(s2));
	
	Senko.println("multiply");
	Senko.println(s1.multiply(s2));
	
	Senko.println("divide");
	Senko.println(s1.divide(s2));
	
	s1 = new BigInteger("-1234567890123456789012345678901234567890");
	s2 = new BigInteger("123456789012345678901");
	
	Senko.println("divideAndRemainder");
	Senko.println(s1.divideAndRemainder(s2)[0] + " ... " + s1.divideAndRemainder(s2)[1]);
	
	Senko.println("remainder");
	Senko.println(s1.divide(s2) + " ... " + s1.remainder(s2));
	
	Senko.println("mod");
	Senko.println(s1.divide(s2) + " ... " + s1.mod(s2));
	
	Senko.println("////////////////////////////////");
	
	Senko.println("ビット操作");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	
	Senko.println(s1);
	Senko.println(s2);
	Senko.println("bitCount");
	Senko.println(s1.bitCount());
	Senko.println(s2.bitCount());
	
	Senko.println("bitLength");
	Senko.println(s1.bitLength());
	Senko.println(s2.bitLength());
	
	Senko.println("getLowestSetBit");
	Senko.println(s1.getLowestSetBit());
	Senko.println(s2.getLowestSetBit());
	
	Senko.println("shiftLeft");
	s1 = BigInteger.ONE;
	for(let i = 0;i < 18; i++) {
		s1 = s1.shiftLeft(1);
		Senko.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	Senko.println("shiftRight");
	for(let i = 0;i < 18; i++) {
		s1 = s1.shiftRight(1);
		Senko.println(i + "\t" + s1.toString(2) + "\tlen " + s1.bitLength() + "\tlsb " + s1.getLowestSetBit());
	}
	
	s1 = new BigInteger("101001000100001000000", 2);
	
	Senko.println("testBit");
	Senko.println(s1.toString(2));
	s2 = s1.bitLength();
	for(let i = s2 - 1; i >= 0; i--) {
		Senko.print(s1.testBit(i) ? 1 : 0);
	}
	Senko.println("");
	
	s3 = BigInteger.ZERO;
	
	Senko.println("setBit");
	for(let i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			s3 = s3.setBit(i);
		}
	}
	Senko.println(s3.toString(2));
	
	Senko.println("clearBit");
	for(let i = 0; i < s2; i++) {
		if(s1.testBit(i)) {
			Senko.print(s3.clearBit(i).toString(2));
		}
	}
	Senko.println("");
	
	Senko.println("flipBit");
	for(let i = 0; i < s2; i++) {
		s3 = s3.flipBit(i);
		Senko.print(s3.toString(2));
	}
	Senko.println("");
	
	Senko.println("////////////////////////////////");
	
	Senko.println("ビット演算");
	
	s1 = new BigInteger("1234ffffff0000000000", 16);
	s2 = s1.negate();
	s3 = new BigInteger("8765ffffff0000000000", 16);
	const s4 = s3.negate();
	
	Senko.println("and");
	Senko.println(s1.and(s2).toString(16));
	Senko.println(s1.and(s3).toString(16));
	Senko.println(s2.and(s4).toString(16));
	
	Senko.println("or");
	Senko.println(s1.or(s2).toString(16));
	Senko.println(s1.or(s3).toString(16));
	Senko.println(s2.or(s4).toString(16));
	
	Senko.println("xor");
	Senko.println(s1.xor(s2).toString(16));
	Senko.println(s1.xor(s3).toString(16));
	Senko.println(s2.xor(s4).toString(16));
	
	Senko.println("not");
	Senko.println(s1.not().toString(16));
	Senko.println(s2.not().toString(16));
	
	Senko.println("andNot");
	Senko.println(s1.andNot(s2).toString(16));
	Senko.println(s1.andNot(s3).toString(16));
	Senko.println(s2.andNot(s4).toString(16));
	
	Senko.println("////////////////////////////////");
	
	Senko.println("数値の変換");

	s1 = new BigInteger("3334342423423", 16);
	
	Senko.println("toString()");
	Senko.println(s1.toString());
	
	Senko.println("toString(2)");
	Senko.println(s1.toString(2));
	
	Senko.println("toString(10)");
	Senko.println(s1.toString(10));
	
	Senko.println("toString(16)");
	Senko.println(s1.toString(16));
	
	Senko.println("intValue");
	Senko.println(s1.intValue().toString(16));
	
	Senko.println("longValue");
	Senko.println(s1.longValue().toString(16));
	
	Senko.println("floatValue");
	Senko.println(s1.floatValue());
	
	Senko.println("doubleValue");
	Senko.println(s1.doubleValue());
	
	Senko.println("////////////////////////////////");
	
	Senko.println("乱数");
	
	const random = new Random();
	
	Senko.println("new BigInteger(numBits, rnd)");
	for(let i = 0; i < 3; i++) {
		Senko.printf("% 50s", (new BigInteger(50, random)).toString(2) );
	}
	
	Senko.println("nextProbablePrime");
	
	s1 = new BigInteger("100000");
	for(let i = 0; i < 3; i++) {
		s1 = s1.nextProbablePrime();
		Senko.println(s1);
	}
	
	Senko.println("isProbablePrime");
	
	s1 = new BigInteger("156b14b55", 16);
	Senko.println(s1 + " は素数か？ -> " + s1.isProbablePrime(100));
	
	Senko.println("probablePrime");
	for(let i = 0; i < 3; i++) {
		Senko.println(BigInteger.probablePrime(20, random));
	}
	
	Senko.println("////////////////////////////////");
	
	Senko.println("その他の演算");
	
	Senko.println("+100 remainder & mod");
	s1 = new BigInteger("100");
	for(let i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		Senko.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(let i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		Senko.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	Senko.println("-100 remainder & mod");
	s1 = new BigInteger("-100");
	for(let i = -4;i < 0; i++) {
		s2 = BigInteger.valueOf(i);
		Senko.println(i + "\tremainder -> " + s1.remainder(s2));
	}
	for(let i = 1;i <= 4; i++) {
		s2 = BigInteger.valueOf(i);
		Senko.println(i + "\tremainder -> " + s1.remainder(s2) + "\tmod -> " + s1.mod(s2));
	}
	
	Senko.println("compareTo");
	Senko.println((new BigInteger("200000")).compareTo(new BigInteger("163840")));
	Senko.println((new BigInteger("100000")).compareTo(new BigInteger("81920")));
	
	Senko.println("gcd");
	Senko.println((new BigInteger("12")).gcd(new BigInteger("18")));
	
	Senko.println("pow");
	s1 = new BigInteger("2");
	Senko.println(s1.pow(1000));
	
	Senko.println("modPow");
	Senko.println((new BigInteger("14123999253219")).modPow(new BigInteger("70276475859277"),new BigInteger("86706662670157")));
	Senko.println(BigInteger.valueOf(-324).modPow(BigInteger.valueOf(123), BigInteger.valueOf(55)));
	
	Senko.println("modInverse");
	Senko.println((BigInteger.valueOf(15)).modInverse(BigInteger.valueOf(4)));
	Senko.println((BigInteger.valueOf(19)).modInverse(BigInteger.valueOf(41)));
	
	Senko.println("////////////////////////////////");
	
	Senko.println("計算速度の測定");
	
	let time = 0;
	let x, y;

	Senko.println("2^5000 = ");
	x = new BigInteger("2");
	
	time = currentTimeMillis();
	x = x.pow(5000);
	Senko.println("計算時間\t" + (currentTimeMillis() - time) + "ms");
	
	time = currentTimeMillis();
	y = x.toString();
	Senko.println("10進数変換\t" + (currentTimeMillis() - time) + "ms");

	time = currentTimeMillis();
	x = new BigInteger(y);
	Senko.println("内部変数変換\t" + (currentTimeMillis() - time) + "ms");
	
	Senko.println("500! = ");
	x = new BigInteger("1");
	
	time = currentTimeMillis();
	for(let i = 1;i <= 500;i++) {
		x = x.multiply(BigInteger.valueOf(i));
	}
	Senko.println("計算時間\t" + (currentTimeMillis() - time) + "ms");
	
	time = currentTimeMillis();
	y = x.toString();
	Senko.println("10進数変換\t" + (currentTimeMillis() - time) + "ms");

	time = currentTimeMillis();
	x = new BigInteger(y);
	Senko.println("内部変数変換\t" + (currentTimeMillis() - time) + "ms");
	
};

main();

