import Senko from "../../build/Senko.js";

const Random = Senko.Random;

const main = function() {

	Senko.println("Random クラスのサンプル(使い方はJavaと同じ)");
	
	Senko.println("int型の乱数を 10個出力する");
	for(let i = 0;i < 10; i++) {
		Senko.println((new Random()).nextInt());
	}
	
	const r = new Random();

	Senko.println("乱数 [0, 1) 10個出力する");
	for(let i = 0;i < 10; i++) {
		Senko.println(i + "\t" +r.nextDouble());
	}

	Senko.println("乱数 [0, 10) を10個出力する");
	for(let i = 0;i < 10; i++) {
		Senko.println(i + "\t" +r.nextInt(10));
	}
	
	const loop = 1 << 18;
	let sum = 0;
	for(let j = 0;j < loop; j++) {
		sum += r.nextDouble();
	}
	const average = sum / loop;
	Senko.println(loop+"回ランダム→平均値\t"+average);

	Senko.println("初期化後の1つ目の乱数について");
	let min = 1;
	let max = -1;
	for(let i = 0; i < 1000; ++i){
		r.setSeed(i);
		const x = r.nextDouble();
		if(x > max) max = x;
		if(x < min) min = x;
	}

	Senko.println("最小値 = " + min + ", 最大値 = " + max);

};

main();