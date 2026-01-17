/**
 * The script is part of MojiJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Unicode from "../encode/Unicode.js";
import SJIS from "../encode/SJIS.js";
import CP932 from "../encode/CP932.js";
import SJIS2004 from "../encode/SJIS2004.js";
import EUCJPMS from "../encode/EUCJPMS.js";
import EUCJIS2004 from "../encode/EUCJIS2004.js";

/**
 * 1981年より前に常用漢字とされているか
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_before_1981_map = null;

/**
 * 1981年時点で追加された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_add_1981_map = null;

/**
 * 2010年時点で追加された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_add_2010_map = null;

/**
 * 2010年時点で削除された常用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let joyokanji_delete_2010_map = null;

/**
 * 2017年時点で常用漢字でかつ人名用漢字か
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_joyokanji_isetai_2017_map = null;

/**
 * 2017年時点で常用漢字でないが人名用漢字か（異性体なし）
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_notjoyokanji_2017_map = null;

/**
 * 2017年時点で異性体がある人名漢字
 * @type {Object<number, number>}
 * @ignore
 */
let jinmeiyokanji_notjoyokanji_isetai_2017_map = null;

/**
 * 調査用マップを作成するクラス
 * @ignore
 */
class MOJI_CHAR_MAP {
	
	/**
	 * 初期化
	 */
	static init() {
		if(MOJI_CHAR_MAP.is_initmap) {
			return;
		}
		MOJI_CHAR_MAP.is_initmap = true;

		/**
		 * 文字列から、UTF32の存在マップを作成
		 * @param {string} string_data 
		 * @returns {Object<number, number>}
		 */
		const createMap = function(string_data) {
			const utf32_array = Unicode.toUTF32Array(string_data);
			/**
			 * @type {Object<number, number>}
			 */
			const map = {};
			for(const key in utf32_array) {
				map[utf32_array[key]] = 1;
			}
			return map;
		};

		// 参考
		// 常用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亜哀愛悪握圧扱安案暗以衣位囲医依委威為胃尉異移偉意違維慰遺緯域育一壱逸芋引印因姻";
			map += "員院陰飲隠韻右宇羽雨畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎宴援園";
			map += "煙遠鉛塩演縁汚王央応往押欧殴桜翁奥横屋億憶虞乙卸音恩温穏下化火加可仮何花佳価果河";
			map += "科架夏家荷華菓貨過嫁暇禍寡歌箇課蚊我画芽賀雅餓介回灰会快戒改怪悔海界皆械絵開階塊";
			map += "解壊懐貝外劾害街慨該概各角拡革格核郭覚較隔閣確獲嚇穫学岳楽額掛括活渇割滑轄且株刈";
			map += "干刊甘汗完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡";
			map += "観艦鑑丸含岸岩眼顔願企危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規喜幾揮期棋貴棄旗";
			map += "器輝機騎技宜偽欺義疑儀戯擬犠議菊吉喫詰却客脚逆虐九久及弓丘旧休吸朽求究泣急級糾宮";
			map += "救球給窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供協況峡狭恐恭胸脅強教郷境橋鏡競響";
			map += "驚仰暁業凝曲局極玉斤均近金菌勤琴筋禁緊謹吟銀区句苦駆具愚空偶遇屈掘繰君訓勲薫軍郡";
			map += "群兄刑形系径茎係型契計恵啓掲経敬景軽傾携継慶憩警鶏芸迎鯨劇撃激欠穴血決結傑潔月犬";
			map += "件見券肩建研県倹兼剣軒健険圏堅検献絹遣権憲賢謙繭顕験懸元幻玄言弦限原現減源厳己戸";
			map += "古呼固孤弧故枯個庫湖雇誇鼓顧五互午呉後娯悟碁語誤護口工公孔功巧広甲交光向后好江考";
			map += "行坑孝抗攻更効幸拘肯侯厚恒皇紅荒郊香候校耕航貢降高康控黄慌港硬絞項鉱構綱酵稿興衡";
			map += "鋼講購号合拷剛豪克告谷刻国黒穀酷獄骨込今困恨根婚混紺魂墾懇左佐査砂唆差詐鎖座才再";
			map += "災妻砕宰栽彩採済祭斎細菜最裁債催歳載際在材剤財罪作削昨索策酢搾錯咲冊札刷殺察撮擦";
			map += "雑三山参蚕惨産散算酸賛残暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉姿思指";
			map += "施師紙脂視紫詞歯嗣試詩資飼誌雌賜諮示字寺次耳自似児事侍治持時滋慈辞磁璽式識軸七失";
			map += "室疾執湿漆質実芝写社車舎者射捨赦斜煮謝邪勺尺借釈爵若弱寂手主守朱取狩首殊珠酒種趣";
			map += "寿受授需儒樹収囚州舟秀周宗拾秋臭修終習週就衆集愁酬醜襲十充住柔重従渋銃獣縦叔祝宿";
			map += "淑粛縮熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署緒諸女如助序叙徐除小升少";
			map += "召匠床抄肖招承昇松沼昭将消症祥笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照詳彰障衝賞";
			map += "償礁鐘上丈冗条状乗城浄剰常情場畳蒸嬢錠譲醸色食植殖飾触嘱織職辱心申伸臣身辛侵信津";
			map += "神娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅陣尋図水吹垂炊帥粋衰推酔遂睡穂錘随";
			map += "髄枢崇数寸瀬是井世正生成西声制姓征性青政星牲省清盛婿晴勢聖誠精製誓静請整税夕斥石";
			map += "赤昔析席隻惜責跡積績籍切折拙窃接設雪摂節説舌絶千川占先宣専泉浅洗染扇旋船戦践銭銑";
			map += "潜線遷選薦繊鮮全前善然禅漸繕阻祖租素措粗組疎訴塑礎双壮早争走奏相荘草送倉捜桑巣掃";
			map += "窓創喪葬装僧想層総遭操燥霜騒造像増憎蔵贈臓即束足促則息速側測俗族属賊続卒率存村孫";
			map += "尊損他多打妥堕惰太対体耐待怠胎退帯泰袋逮替貸隊滞態大代台第題滝宅択沢卓拓託諾濁但";
			map += "達脱奪丹担単炭胆探淡短嘆端誕鍛団男段断弾暖談壇地池知値恥致遅痴稚置竹畜逐蓄築秩窒";
			map += "茶着嫡中仲虫沖宙忠抽注昼柱衷鋳駐著貯丁弔庁兆町長帳張彫頂鳥朝脹超腸跳徴潮澄調聴懲";
			map += "直勅沈珍朕陳賃鎮追墜通痛坪低呈廷弟定底抵邸貞帝訂庭逓停堤提程艇締的笛摘滴適敵迭哲";
			map += "鉄徹撤天典店点展添転田伝殿電斗吐徒途都渡塗土奴努度怒刀冬灯当投豆東到逃倒凍唐島桃";
			map += "討透党悼盗陶塔湯痘登答等筒統稲踏糖頭謄闘騰同胴動堂童道働銅導峠匿特得督徳篤毒独読";
			map += "突届豚鈍曇内南軟難二尼弐肉日入乳尿任妊忍認寧熱年念粘燃悩納能脳農濃波派破馬婆拝杯";
			map += "背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫舶博薄麦縛爆箱畑八発髪伐抜罰閥反半犯帆";
			map += "伴判坂板版班畔般販飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼肥非卑飛疲秘被悲費碑罷避尾美";
			map += "備微鼻匹必泌筆姫百氷表俵票評漂標苗秒病描品浜貧賓敏不夫父付布扶府怖附負赴浮婦符富";
			map += "普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛噴墳憤奮分文聞丙平兵併並柄";
			map += "陛閉幣弊米壁癖別片辺返変偏遍編弁便勉歩保捕補舗母募墓慕暮簿方包芳邦奉宝抱放法胞倣";
			map += "峰砲崩訪報豊飽縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿暴膨謀北木牧墨撲没本奔翻凡盆";
			map += "麻摩魔毎妹枚埋幕膜又末万満慢漫未味魅密脈妙民眠矛務無夢霧娘名命明迷盟銘鳴滅免面綿";
			map += "茂模毛盲耗猛網目黙門紋問匁夜野役約訳薬躍由油愉諭輸唯友有勇幽郵猶裕遊雄誘憂融優与";
			map += "予余誉預幼用羊洋要容庸揚揺葉陽溶腰様踊窯養擁謡曜抑浴欲翌翼裸来雷頼絡落酪乱卵覧濫";
			map += "欄吏利里理痢裏履離陸立律略柳流留粒隆硫旅虜慮了両良料涼猟陵量僚領寮療糧力緑林厘倫";
			map += "輪隣臨涙累塁類令礼冷励例鈴零霊隷齢麗暦歴列劣烈裂恋連廉練錬炉路露老労郎朗浪廊楼漏";
			map += "六録論和話賄惑湾腕";
			joyokanji_before_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "猿凹渦靴稼拐涯垣殻潟喝褐缶頑挟矯襟隅渓蛍嫌洪溝昆崎皿桟傘肢遮蛇酌汁塾尚宵縄壌唇甚";
			map += "据杉斉逝仙栓挿曹槽藻駄濯棚挑眺釣塚漬亭偵泥搭棟洞凸屯把覇漠肌鉢披扉猫頻瓶雰塀泡俸";
			map += "褒朴僕堀磨抹岬妄厄癒悠羅竜戻枠";
			joyokanji_add_1981_map = createMap(map);
		}

		{
			let map = "";
			map += "通用字体挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩";
			map += "伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶";
			map += "斬恣摯餌鹿嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴";
			map += "誰旦綻緻酎貼嘲捗椎爪鶴諦溺塡妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剝箸氾汎阪斑眉膝肘";
			map += "阜訃蔽餅璧蔑哺蜂貌頰睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇";
			joyokanji_add_2010_map = createMap(map);
		}

		{
			let map = "";
			map += "勺錘銑脹匁";
			joyokanji_delete_2010_map = createMap(map);
		}
		
		// 参考
		// 人名用漢字一覧 - Wikipedia (2019/1/1)
		// https://ja.wikipedia.org/wiki/%E4%BA%BA%E5%90%8D%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7

		{
			let map = "";
			map += "亞亜惡悪爲為逸逸榮栄衞衛謁謁圓円緣縁薗園應応櫻桜奧奥橫横溫温價価禍禍悔悔海海壞壊";
			map += "懷懐樂楽渴渇卷巻陷陥寬寛漢漢氣気祈祈器器僞偽戲戯虛虚峽峡狹狭響響曉暁勤勤謹謹駈駆";
			map += "勳勲薰薫惠恵揭掲鷄鶏藝芸擊撃縣県儉倹劍剣險険圈圏檢検顯顕驗験嚴厳廣広恆恒黃黄國国";
			map += "黑黒穀穀碎砕雜雑祉祉視視兒児濕湿實実社社者者煮煮壽寿收収臭臭從従澁渋獸獣縱縦祝祝";
			map += "暑暑署署緖緒諸諸敍叙將将祥祥涉渉燒焼奬奨條条狀状乘乗淨浄剩剰疊畳孃嬢讓譲釀醸神神";
			map += "眞真寢寝愼慎盡尽粹粋醉酔穗穂瀨瀬齊斉靜静攝摂節節專専戰戦纖繊禪禅祖祖壯壮爭争莊荘";
			map += "搜捜巢巣曾曽裝装僧僧層層瘦痩騷騒增増憎憎藏蔵贈贈臟臓卽即帶帯滯滞瀧滝單単嘆嘆團団";
			map += "彈弾晝昼鑄鋳著著廳庁徵徴聽聴懲懲鎭鎮轉転傳伝都都嶋島燈灯盜盗稻稲德徳突突難難拜拝";
			map += "盃杯賣売梅梅髮髪拔抜繁繁晚晩卑卑祕秘碑碑賓賓敏敏冨富侮侮福福拂払佛仏勉勉步歩峯峰";
			map += "墨墨飜翻每毎萬万默黙埜野彌弥藥薬與与搖揺樣様謠謡來来賴頼覽覧欄欄龍竜虜虜凉涼綠緑";
			map += "淚涙壘塁類類禮礼曆暦歷歴練練鍊錬郞郎朗朗廊廊錄録";
			jinmeiyokanji_joyokanji_isetai_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "丑丞乃之乎也云些亦亥亨亮仔伊伍伽佃佑伶侃侑俄俠俣俐倭俱倦倖偲傭儲允兎兜其冴凌凧凪";
			map += "凰凱函劉劫勁勺勿匁匡廿卜卯卿厨厩叉叡叢叶只吾吞吻哉哨啄哩喬喧喰喋嘩嘉嘗噌噂圃圭坐";
			map += "坦埴堰堺堵塙壕壬夷奄奎套娃姪姥娩嬉孟宏宋宕宥寅寓寵尖尤屑峨峻崚嵯嵩嶺巫已巳巴巷巽";
			map += "帖幌幡庄庇庚庵廟廻弘弛彗彦彪彬徠忽怜恢恰恕悌惟惚悉惇惹惺惣慧憐戊或戟托按挺挽掬捲";
			map += "捷捺捧掠揃摑摺撒撰撞播撫擢孜敦斐斡斧斯於旭昂昊昏昌昴晏晒晋晟晦晨智暉暢曙曝曳朋朔";
			map += "杏杖杜李杭杵杷枇柑柴柘柊柏柾柚栞桔桂栖桐栗梧梓梢梛梯桶梶椛梁棲椋椀楯楚楕椿楠楓椰";
			map += "楢楊榎樺榊榛槍槌樫槻樟樋橘樽橙檎檀櫂櫛櫓欣欽歎此殆毅毘毬汀汝汐汲沌沓沫洸洲洵洛浩";
			map += "浬淵淳淀淋渥渾湘湊湛溢滉溜漱漕漣澪濡瀕灘灸灼烏焰焚煌煤煉熙燕燎燦燭燿爾牒牟牡牽犀";
			map += "狼獅玖珂珈珊珀玲琉瑛琥琶琵琳瑚瑞瑶瑳瓜瓢甥甫畠畢疋疏皐皓眸瞥矩砦砥砧硯碓碗碩碧磐";
			map += "磯祇禽禾秦秤稀稔稟稜穹穿窄窪窺竣竪竺竿笈笹笙笠筈筑箕箔篇篠簞簾籾粥粟糊紘紗紐絃紬";
			map += "絆絢綺綜綴緋綾綸縞徽繫繡纂纏羚翔翠耀而耶耽聡肇肋肴胤胡脩腔脹膏臥舜舵芥芹芭芙芦苑";
			map += "茄苔苺茅茉茸茜莞荻莫莉菅菫菖萄菩萊菱葦葵萱葺萩董葡蓑蒔蒐蒼蒲蒙蓉蓮蔭蔣蔦蓬蔓蕎蕨";
			map += "蕉蕃蕪薙蕾蕗藁薩蘇蘭蝦蝶螺蟬蟹蠟衿袈袴裡裟裳襖訊訣註詢詫誼諏諄諒謂諺讃豹貰賑赳跨";
			map += "蹄蹟輔輯輿轟辰辻迂迄辿迪迦這逞逗逢遁遼邑祁郁鄭酉醇醐醍醬釉釘釧銑鋒鋸錘錐錆錫鍬鎧";
			map += "閃閏閤阿陀隈隼雀雁雛雫霞靖鞄鞍鞘鞠鞭頁頌頗顚颯饗馨馴馳駕駿驍魁魯鮎鯉鯛鰯鱒鱗鳩鳶";
			map += "鳳鴨鴻鵜鵬鷗鷲鷺鷹麒麟麿黎黛鼎";
			jinmeiyokanji_notjoyokanji_2017_map = createMap(map);
		}

		{
			let map = "";
			map += "亙亘凛凜堯尭巖巌晄晃檜桧槇槙渚渚猪猪琢琢禰祢祐祐禱祷祿禄禎禎穰穣萠萌遙遥";
			jinmeiyokanji_notjoyokanji_isetai_2017_map = createMap(map);
		}
	}

	/**
	 * チェック用マップ
	 */
	static JOYOJANJI_BEFORE_1981() {
		MOJI_CHAR_MAP.init();
		return joyokanji_before_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_ADD_1981() {
		MOJI_CHAR_MAP.init();
		return joyokanji_add_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_ADD_2010() {
		MOJI_CHAR_MAP.init();
		return joyokanji_add_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JOYOKANJI_DELETE_2010() {
		MOJI_CHAR_MAP.init();
		return joyokanji_delete_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_JOYOKANJI_ISETAI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_joyokanji_isetai_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_NOTJOYOKANJI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017() {
		MOJI_CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_isetai_2017_map;
	}
	
}

/**
 * マップを初期化した否か
 */
MOJI_CHAR_MAP.is_initmap = false;

/**
 * 文字の解析用クラス
 * @ignore
 */
class MojiAnalizerTools {

	/**
	 * 指定したコードポイントの漢字は1981年より前に常用漢字とされているか判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanjiBefore1981(unicode_codepoint) {
		const joyokanji_before_1981_map = MOJI_CHAR_MAP.JOYOJANJI_BEFORE_1981();
		return !!joyokanji_before_1981_map[unicode_codepoint];
	}

	/**
	 * 指定したコードポイントの漢字は1981年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji1981(unicode_codepoint) {
		const joyokanji_before_1981_map = MOJI_CHAR_MAP.JOYOJANJI_BEFORE_1981();
		const joyokanji_add_1981_map = MOJI_CHAR_MAP.JOYOKANJI_ADD_1981();
		return (!!joyokanji_before_1981_map[unicode_codepoint]) || (!!joyokanji_add_1981_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2010年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji2010(unicode_codepoint) {
		const joyokanji_add_2010_map = MOJI_CHAR_MAP.JOYOKANJI_ADD_2010();
		const joyokanji_delete_2010_map = MOJI_CHAR_MAP.JOYOKANJI_DELETE_2010();
		if(joyokanji_delete_2010_map[unicode_codepoint]) {
			return false;
		}
		const x = MojiAnalizerTools.isJoyoKanji1981(unicode_codepoint);
		return x || (!!joyokanji_add_2010_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji2017(unicode_codepoint) {
		if(MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint)) {
			return false;
		}
		const jinmeiyokanji_joyokanji_isetai_map = MOJI_CHAR_MAP.JINMEIYOKANJI_JOYOKANJI_ISETAI_2017();
		const jinmeiyokanji_notjoyokanji_map = MOJI_CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_2017();
		const jinmeiyokanji_notjoyokanji_isetai_map = MOJI_CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017();
		return (!!jinmeiyokanji_joyokanji_isetai_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_map[unicode_codepoint])
				|| (!!jinmeiyokanji_notjoyokanji_isetai_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJinmeiyoKanji2017(unicode_codepoint) {
		return MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint) || MojiAnalizerTools.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isJoyoKanji2010(unicode_codepoint);
	}
	
	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJinmeiyoKanji(unicode_codepoint) {
		return MojiAnalizerTools.isJinmeiyoKanji2017(unicode_codepoint);
	}

}

/**
 * 文字のエンコード情報
 * @typedef {Object} MojiEncodeData
 * @property {import("../encode/SJIS.js").MenKuTen} kuten 区点 コード
 * @property {import("../encode/SJIS.js").MenKuTen} menkuten 面区点 コード
 * @property {number} cp932_code CP932(Windows-31J) コード
 * @property {number} sjis2004_code Shift_JIS-2004 コード
 * @property {Array<number>} utf8_array UTF-8 配列
 * @property {Array<number>} utf16_array UTF-16 配列
 * @property {Array<number>} utf32_array UTF-32 配列
 * @property {Array<number>} cp932_array CP932(Windows-31J) バイト配列
 * @property {Array<number>} sjis2004_array Shift_JIS-2004 コード バイト配列
 * @property {Array<number>} shift_jis_array Shift_JIS バイト配列
 * @property {Array<number>} iso2022jp_array ISO-2022-JP バイト配列
 * @property {Array<number>} eucjpms_array eucJP-ms バイト配列
 * @property {Array<number>} eucjis2004_array EUC-JP-2004 バイト配列
 */

/**
 * 文字の種別情報
 * @typedef {Object} MojiTypeData
 * @property {boolean} is_regular_sjis Shift_JIS に登録された文字
 * @property {boolean} is_regular_sjis2004 Shift_JIS-2004 に登録された文字
 * @property {boolean} is_joyo_kanji 常用漢字
 * @property {boolean} is_jinmeiyo_kanji 人名用漢字
 * @property {boolean} is_gaiji_cp932 Windows-31J(CP932) 外字
 * @property {boolean} is_IBM_extended_character Windows-31J(CP932) IBM拡張文字
 * @property {boolean} is_NEC_selection_IBM_extended_character Windows-31J(CP932) NEC選定IBM拡張文字
 * @property {boolean} is_NEC_special_character Windows-31J(CP932) NEC特殊文字
 * @property {number} kanji_suijun Shift_JIS-2004 を使用して漢字の水準調査(1未満だと水準調査失敗)
 * @property {boolean} is_surrogate_pair 要 Unicode サロゲートペア
 * @property {string} control_name 制御文字名（制御文字ではない場合は null）
 * @property {boolean} is_control_charcter 制御文字
 * @property {string} blockname Unicodeブロック名
 * @property {boolean} is_kanji 漢字
 * @property {boolean} is_hiragana ひらがな
 * @property {boolean} is_katakana カタカナ
 * @property {boolean} is_fullwidth_ascii 全角ASCII
 * @property {boolean} is_halfwidth_katakana 半角カタカナ
 * @property {boolean} is_emoji 絵文字
 * @property {boolean} is_emoticons 顔文字
 * @property {boolean} is_symbol_base 記号(VS16 が付くと絵文字化)
 * @property {boolean} is_gaiji 外字
 * @property {boolean} is_non_counting_character 文字数としてカウントしない文字
 * @property {boolean} is_combining_mark 結合文字
 * @property {boolean} is_variation_selector 異体字セレクタ
 * @property {boolean} is_skin_tone_modifier スキントーン修飾子
 * @property {boolean} is_tag_character タグ文字
 */

/**
 * 文字の種別情報
 * @typedef {Object} MojiData
 * @property {MojiEncodeData} encode 文字のエンコード情報
 * @property {MojiTypeData} type 文字の種別情報
 * @property {string} character 解析した文字
 * @property {number} codepoint 解析した文字のコードポイント
 */

/**
 * 文字の解析用クラス
 * @ignore
 */
export default class MojiAnalyzer {

	/**
	 * 初期化
	 * @returns {MojiData}
	 * @ignore
	 */
	static _createMojiData() {

		/**
		 * @type {MojiEncodeData}
		 */
		const encode = {
			kuten : null,
			menkuten : null,
			cp932_code : 0,
			sjis2004_code : 0,
			utf8_array : [],
			utf16_array : [],
			utf32_array : [],
			cp932_array : [],
			sjis2004_array : [],
			shift_jis_array : [],
			iso2022jp_array : [],
			eucjpms_array : [],
			eucjis2004_array : []
		};
		
		/**
		 * @type {MojiTypeData}
		 */
		const type = {
			is_regular_sjis	: false,
			is_regular_sjis2004 : false,
			is_joyo_kanji		: false,
			is_jinmeiyo_kanji	: false,
			is_gaiji_cp932	: false,
			is_IBM_extended_character	: false,
			is_NEC_selection_IBM_extended_character	: false,
			is_NEC_special_character	: false,
			kanji_suijun : -1,
			is_surrogate_pair	: false,
			control_name : null,
			is_control_charcter : false,
			blockname : "",
			is_kanji : false,
			is_hiragana : false,
			is_katakana : false,
			is_fullwidth_ascii : false,
			is_halfwidth_katakana : false,
			is_emoji : false,
			is_emoticons : false,
			is_symbol_base : false,
			is_gaiji : false,
			is_non_counting_character : false,
			is_combining_mark : false,
			is_variation_selector : false,
			is_skin_tone_modifier : false,
			is_tag_character : false
		};

		/**
		 * @type {MojiData}
		 */
		const data = {
			encode : encode,
			type : type,
			character : null,
			codepoint : 0
		};

		return data;
	}

	/**
	 * 指定した1つのUTF-32 コードポイントに関して、解析を行い情報を返します
	 * @param {Number} unicode_codepoint - UTF-32 のコードポイント
	 * @returns {MojiData} 文字の情報がつまったオブジェクト
	 */
	static getMojiData(unicode_codepoint) {

		// 基本情報取得
		const cp932code = CP932.toCP932FromUnicode(unicode_codepoint);
		const sjis2004code = SJIS2004.toSJIS2004FromUnicode(unicode_codepoint);
		const kuten = SJIS.toKuTenFromSJISCode(cp932code);
		const menkuten = SJIS.toMenKuTenFromSJIS2004Code(sjis2004code);
		const is_regular_sjis = cp932code < 0x100 || SJIS.isRegularMenKuten(kuten);
		const is_regular_sjis2004 = sjis2004code < 0x100 || SJIS.isRegularMenKuten(menkuten);

		/**
		 * 出力データの箱を用意
		 * @type {MojiData}
		 */
		const data = MojiAnalyzer._createMojiData();
		const encode = data.encode;
		const type = data.type;
		const character = Unicode.fromCodePoint(unicode_codepoint);
		data.character = character;
		data.codepoint = unicode_codepoint;

		// 句点と面区点情報(ない場合はnullになる)
		encode.kuten			= kuten;
		encode.menkuten			= menkuten;
		// コードの代入
		encode.cp932_code		= cp932code ? cp932code : -1;
		encode.sjis2004_code	= sjis2004code ? sjis2004code : -1;

		// Shift_JIS として許容されるか
		type.is_regular_sjis	= is_regular_sjis;
		type.is_regular_sjis2004 = is_regular_sjis2004;

		// 漢字が常用漢字か、人名用漢字かなど
		type.is_joyo_kanji		= MojiAnalizerTools.isJoyoKanji(unicode_codepoint);
		type.is_jinmeiyo_kanji	= MojiAnalizerTools.isJinmeiyoKanji(unicode_codepoint);

		// Windows-31J(CP932) に関しての調査 
		// 外字, IBM拡張文字, NEC選定IBM拡張文字, NEC特殊文字
		type.is_gaiji_cp932				= cp932code ? (0xf040 <= cp932code) && (cp932code <= 0xf9fc) : false;
		type.is_IBM_extended_character	= cp932code ? (0xfa40 <= cp932code) && (cp932code <= 0xfc4b) : false;
		type.is_NEC_selection_IBM_extended_character= cp932code ? (0xed40 <= cp932code) && (cp932code <= 0xeefc) : false;
		type.is_NEC_special_character	= cp932code ? (0x8740 <= cp932code) && (cp932code <= 0x879C) : false;

		// Shift_JIS-2004 を使用して漢字の水準調査(ない場合はnullになる)
		type.kanji_suijun = SJIS.toJISKanjiSuijunFromSJISCode(sjis2004code);

		// Unicodeの配列
		encode.utf8_array = Unicode.toUTF8Array(data.character);
		encode.utf16_array = Unicode.toUTF16Array(data.character);
		encode.utf32_array = [unicode_codepoint];
		type.is_surrogate_pair = encode.utf16_array.length > 1;

		// SJIS系の配列
		encode.cp932_array = cp932code ? ((cp932code >= 0x100) ? [cp932code >> 8, cp932code & 0xff] : [cp932code]) : [];
		encode.sjis2004_array = sjis2004code ? ((sjis2004code >= 0x100) ? [sjis2004code >> 8, sjis2004code & 0xff] : [sjis2004code]) : [];
		
		// EUC-JP系の配列
		encode.eucjpms_array = EUCJPMS.toEUCJPMSBinary(character);
		encode.eucjis2004_array = EUCJIS2004.toEUCJIS2004Binary(character);
		
		/**
		 * EUC-JP変換エラー確認
		 * @param {string} character 調査する文字（1文字） 
		 * @param {number[]} array 変換を終えたEUC-JPの配列
		 * @return {number[]} 修正後の配列
		 */
		const checkEUCJPError = function(character, array) {
			// 文字が "?" でないにも関わらず、エンコード後が "?"(0x3F) の場合は変換エラーとみなす
			const ng = "?".charCodeAt(0);
			if (character !== "?" && array.length === 1 && array[0] === ng) {
				return [];
			}
			else {
				return array;
			}
		};
		encode.eucjpms_array = checkEUCJPError(character, encode.eucjpms_array);
		encode.eucjis2004_array = checkEUCJPError(character, encode.eucjis2004_array);

		// ISO-2022-JP , EUC-JP
		if(cp932code < 0xE0 || is_regular_sjis) {
			if(cp932code < 0x80) {
				encode.shift_jis_array = [cp932code];
				encode.iso2022jp_array = [];
			}
			else if(cp932code < 0xE0) {
				// 半角カタカナの扱い
				encode.shift_jis_array = [cp932code];
				encode.iso2022jp_array = [];
			}
			else if(kuten.ku <= 94) {
				// 区点は94まで利用できる。
				// つまり、最大でも 94 + 0xA0 = 0xFE となり 0xFF 以上にならない
				encode.shift_jis_array = [encode.cp932_array[0], encode.cp932_array[1]];
				encode.iso2022jp_array = [kuten.ku + 0x20, kuten.ten + 0x20];
			}
		}
		else {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
		}
		// SJISとして正規でなければ強制エンコード失敗
		if(!is_regular_sjis) {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
		}

		// 制御文字かどうか
		type.control_name = Unicode.toControlCharcterName(unicode_codepoint);
		type.is_control_charcter = type.control_name ? true : false;

		// Unicodeのブロック名
		type.blockname = Unicode.toBlockNameFromUnicode(unicode_codepoint);
		// ブロック名から判断
		type.is_kanji = /Ideographs/.test(type.blockname);
		type.is_hiragana = /Hiragana/.test(type.blockname);
		type.is_katakana = /Katakana/.test(type.blockname);
		type.is_fullwidth_ascii = /[\u3000\uFF01-\uFF5E]/.test(data.character);
		type.is_halfwidth_katakana = /[\uFF61-\uFF9F]/.test(data.character);
		// 絵文字
		type.is_emoji = /Pictographs|Transport and Map Symbols/.test(type.blockname);
		// 顔文字
		type.is_emoticons = /Emoticons/.test(type.blockname);
		// 記号(VS16 が付くと絵文字化)
		type.is_symbol_base = /Dingbats|Miscellaneous Symbols/.test(type.blockname);
		// 外字
		type.is_gaiji = /Private Use Area/.test(type.blockname);
		// 文字数としてカウントしない文字
		type.is_non_counting_character = Unicode.isNonCountingCharacterFromCodePoint(unicode_codepoint);
		// 結合文字
		type.is_combining_mark = Unicode.isCombiningMarkFromCodePoint(unicode_codepoint);
		// 異体字セレクタ
		type.is_variation_selector = Unicode.isVariationSelectorFromCodePoint(unicode_codepoint);
		// スキントーン修飾子
		type.is_skin_tone_modifier = Unicode.isEmojiModifierFromCodePoint(unicode_codepoint);
		// タグ文字
		type.is_tag_character = Unicode.isTagCharacterFromCodePoint(unicode_codepoint);

		return data;
	}

}
