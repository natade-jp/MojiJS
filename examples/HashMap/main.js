import Senko from "../../build/Senko.js";

const HashMap = Senko.HashMap;

const main = function() {
	
	const map = new HashMap();
	
	Senko.println("HashMap クラスのサンプル(多分Javaと大体同じだと思う)");
	
	Senko.println("データを追加");
	map.put("test", 3);
	
	Senko.println("一覧を表示");
	Senko.println(map);
	Senko.println("データ数");
	Senko.println(map.size());
		
	Senko.println("データを3つ追加（重複あり）");
	map.put("test",  300);
	map.put("test1", 4);
	map.put("test2", 5);
	
	Senko.println("一覧を表示");
	Senko.println(map);
	Senko.println("データ数");
	Senko.println(map.size());

	Senko.println("データを取得");
	Senko.println(map.get("test"));
	
	Senko.println("データを2つ削除（存在しないのもあり）");
	map.remove("test1");
	map.remove("test42");
	
	Senko.println("データ数");
	Senko.println(map.size());
	
	Senko.println("クローン1");
	const x1 = map.clone();
	Senko.println(x1);
	
	Senko.println("クローン2");
	const x2 = new HashMap(x1);
	Senko.println(x2);
	
	Senko.println("キーとして含まれるか");
	Senko.println(x1.containsKey("test"));
	Senko.println(x1.containsKey("test1"));
	
	Senko.println("値として含まれるか");
	Senko.println(x1.containsValue(200));
	Senko.println(x1.containsValue(300));
	
	Senko.println("それぞれに処理");
	x1.each(function(key, value) {
		Senko.println("[" + key + "] = " + value);
	});
	
};

main();
