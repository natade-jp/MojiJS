import Senko from "../../libs/Senko.js";

const HashMap = Senko.HashMap;
const Log = Senko.Log;

const main = function() {
	
	const map = new HashMap();
	
	Log.println("HashMap クラスのサンプル(多分Javaと大体同じだと思う)");
	
	Log.println("データを追加");
	map.put("test", 3);
	
	Log.println("一覧を表示");
	Log.println(map);
	Log.println("データ数");
	Log.println(map.size());
		
	Log.println("データを3つ追加（重複あり）");
	map.put("test",  300);
	map.put("test1", 4);
	map.put("test2", 5);
	
	Log.println("一覧を表示");
	Log.println(map);
	Log.println("データ数");
	Log.println(map.size());

	Log.println("データを取得");
	Log.println(map.get("test"));
	
	Log.println("データを2つ削除（存在しないのもあり）");
	map.remove("test1");
	map.remove("test42");
	
	Log.println("データ数");
	Log.println(map.size());
	
	Log.println("クローン1");
	const x1 = map.clone();
	Log.println(x1);
	
	Log.println("クローン2");
	const x2 = new HashMap(x1);
	Log.println(x2);
	
	Log.println("キーとして含まれるか");
	Log.println(x1.containsKey("test"));
	Log.println(x1.containsKey("test1"));
	
	Log.println("値として含まれるか");
	Log.println(x1.containsValue(200));
	Log.println(x1.containsValue(300));
	
	Log.println("それぞれに処理");
	x1.each(function(key, value) {
		Log.println("[" + key + "] = " + value);
	});
	
};

main();
