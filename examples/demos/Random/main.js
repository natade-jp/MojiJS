import Senko from "../../libs/Senko.js";

const Random = Senko.MathX.Random;
const Log = Senko.Log;

const main = function() {

	Log.println("Random クラスのサンプル(使い方はJavaと同じ)");
	
	Log.println("int型の乱数を 10個出力する");
	for(let i = 0;i < 10; i++) {
		Log.println((new Random()).nextInt());
	}
	
	const r = new Random();

	Log.println("乱数 [0, 1) 10個出力する");
	for(let i = 0;i < 10; i++) {
		Log.println(i + "\t" +r.nextDouble());
	}

	Log.println("乱数 [0, 10) を10個出力する");
	for(let i = 0;i < 10; i++) {
		Log.println(i + "\t" +r.nextInt(10));
	}
	
	const loop = 1 << 18;
	let sum = 0;
	for(let j = 0;j < loop; j++) {
		sum += r.nextDouble();
	}
	const average = sum / loop;
	Log.println(loop+"回ランダム→平均値\t"+average);

	Log.println("初期化後の1つ目の乱数について");
	let min = 1;
	let max = -1;
	for(let i = 0; i < 1000; ++i){
		r.setSeed(i);
		const x = r.nextDouble();
		if(x > max) max = x;
		if(x < min) min = x;
	}

	Log.println("最小値 = " + min + ", 最大値 = " + max);

};

main();