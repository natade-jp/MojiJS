import Senko from "../../libs/Senko.js";

const ArrayList = Senko.ArrayList;
const Log = Senko.Log;

const main = function() {

	Log.println("ArrayList クラスのサンプル(多分Javaと大体同じだと思う)");
	
	const list = new ArrayList();

	Log.println("データを追加");
	for(let i = 0;i < 10; i++) {
		list.add(Math.random());
	}

	Log.println("一覧を表示");
	Log.println(list);
	
	Log.println("データ数");
	Log.println(list.size());
	
	Log.println("昇順ソート(内部は安定ソート使ってます)");
	list.sort();
	Log.println(list);
	
	const compare = function(a, b) {
		if(a === b) {
			return(0);
		}
		if(typeof a === typeof b) {
			return(a < b ? 1 : -1);
		}
		return((typeof a < typeof b) ? 1 : -1);
	};
	
	Log.println("比較関数を用意すれば降順にもできます");
	list.sort(compare);
	Log.println(list);
	
	Log.println("5つ追加して");
	const list2 = new ArrayList();
	for(let i = 100;i < 104; i++) {
		list2.add(i);
	}
	Log.println(list2);
	
	Log.println("1から2を削除");
	list2.removeRange(1, 3);
	Log.println(list2);
	
	Log.println("結合");
	list.addAll(0, list2);
	Log.println(list);
	
	Log.println("クローン1");
	const list3 = list.clone();
	Log.println(list3);
	
	Log.println("クローン2");
	const list4 = new ArrayList(list);
	Log.println(list4);
	
	Log.println("それぞれに処理");
	list.each(function(index, value) {
		Log.println(index + " -> " + value);
	});
	
};

main();
