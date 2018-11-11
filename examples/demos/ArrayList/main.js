import Senko from "../../libs/Senko.js";

const ArrayList = Senko.ArrayList;

const main = function() {
	
	Senko.println("ArrayList クラスのサンプル(多分Javaと大体同じだと思う)");
	
	const list = new ArrayList();

	Senko.println("データを追加");
	for(let i = 0;i < 10; i++) {
		list.add(Math.random());
	}

	Senko.println("一覧を表示");
	Senko.println(list);
	
	Senko.println("データ数");
	Senko.println(list.size());
	
	Senko.println("昇順ソート(内部は安定ソート使ってます)");
	list.sort();
	Senko.println(list);
	
	const compare = function(a, b) {
		if(a === b) {
			return(0);
		}
		if(typeof a === typeof b) {
			return(a < b ? 1 : -1);
		}
		return((typeof a < typeof b) ? 1 : -1);
	};
	
	Senko.println("比較関数を用意すれば降順にもできます");
	list.sort(compare);
	Senko.println(list);
	
	Senko.println("5つ追加して");
	const list2 = new ArrayList();
	for(let i = 100;i < 104; i++) {
		list2.add(i);
	}
	Senko.println(list2);
	
	Senko.println("1から2を削除");
	list2.removeRange(1, 3);
	Senko.println(list2);
	
	Senko.println("結合");
	list.addAll(0, list2);
	Senko.println(list);
	
	Senko.println("クローン1");
	const list3 = list.clone();
	Senko.println(list3);
	
	Senko.println("クローン2");
	const list4 = new ArrayList(list);
	Senko.println(list4);
	
	Senko.println("それぞれに処理");
	list.each(function(index, value) {
		Senko.println(index + " -> " + value);
	});
	
};

main();
