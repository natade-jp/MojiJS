/**
 * The script is part of mojijs.
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

/**
 * 制御文字マップ
 * @type {Object<number, string>}
 */
let control_charcter_map = null;

/**
 * 1981年より前に常用漢字とされているか
 * @type {Object<number, number>}
 */
let joyokanji_before_1981_map = null;

/**
 * 1981年時点で追加された常用漢字か
 * @type {Object<number, number>}
 */
let joyokanji_add_1981_map = null;

/**
 * 2010年時点で追加された常用漢字か
 * @type {Object<number, number>}
 */
let joyokanji_add_2010_map = null;

/**
 * 2010年時点で削除された常用漢字か
 * @type {Object<number, number>}
 */
let joyokanji_delete_2010_map = null;

/**
 * 2017年時点で常用漢字でかつ人名用漢字か
 * @type {Object<number, number>}
 */
let jinmeiyokanji_joyokanji_isetai_2017_map = null;

/**
 * 2017年時点で常用漢字でないが人名用漢字か（異性体なし）
 * @type {Object<number, number>}
 */
let jinmeiyokanji_notjoyokanji_2017_map = null;

/**
 * 2017年時点で異性体がある人名漢字
 * @type {Object<number, number>}
 */
let jinmeiyokanji_notjoyokanji_isetai_2017_map = null;

/**
 * コードポイントからUnicodeのブロック名に変換する
 * @type {function(number): string}
 */
let to_block_name_from_unicode = null;

/**
 * 調査用マップを作成するクラス
 */
class CHAR_MAP {
	
	/**
	 * 初期化
	 */
	static init() {
		if(CHAR_MAP.is_initmap) {
			return;
		}
		CHAR_MAP.is_initmap = true;

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

		control_charcter_map = {
			0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ", 6: "ACK", 7: "BEL",
			8: "BS", 9: "HT", 10: "LF", 11: "VT", 12: "FF", 13: "CR", 14: "SO", 15: "SI",
			16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
			24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS", 30: "RS", 31: "US",
			127: "DEL", 128: "PAD", 129: "HOP", 130: "BPH", 131: "NBH", 132: "IND", 133: "NEL", 134: "SSA",
			135: "ESA", 136: "HTS", 137: "HTJ", 138: "VTS", 139: "PLD", 140: "PLU", 141: "RI", 142: "SS2",
			143: "SS3", 144: "DCS", 145: "PU1", 146: "PU2", 147: "STS", 148: "CCH", 149: "MW", 150: "SPA",
			151: "EPA", 152: "SOS", 153: "SGCI", 154: "SCI", 155: "CSI", 156: "ST", 157: "OSC", 158: "PM",
			159: "APC", 160: "NBSP", 173: "SHY", 65024: "VS1", 65025: "VS2", 65026: "VS3", 65027: "VS4", 65028: "VS5",
			65029: "VS6", 65030: "VS7", 65031: "VS8", 65032: "VS9", 65033: "VS10", 65034: "VS11", 65035: "VS12", 65036: "VS13",
			65037: "VS14", 65038: "VS15", 65039: "VS16", 65529: "IAA", 65530: "IAS", 65531: "IAT",
		};

		const unicode_blockname_array = [
			"Basic Latin", "Latin-1 Supplement", "Latin Extended-A", "Latin Extended-B", "IPA Extensions", "Spacing Modifier Letters", "Combining Diacritical Marks", "Greek and Coptic",
			"Cyrillic", "Cyrillic Supplement", "Armenian", "Hebrew", "Arabic", "Syriac", "Arabic Supplement", "Thaana",
			"NKo", "Samaritan", "Mandaic", "Syriac Supplement", "Arabic Extended-A", "Devanagari", "Bengali", "Gurmukhi",
			"Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala", "Thai",
			"Lao", "Tibetan", "Myanmar", "Georgian", "Hangul Jamo", "Ethiopic", "Ethiopic Supplement", "Cherokee",
			"Unified Canadian Aboriginal Syllabics", "Ogham", "Runic", "Tagalog", "Hanunoo", "Buhid", "Tagbanwa", "Khmer",
			"Mongolian", "Unified Canadian Aboriginal Syllabics Extended", "Limbu", "Tai Le", "New Tai Lue", "Khmer Symbols", "Buginese", "Tai Tham",
			"Combining Diacritical Marks Extended", "Balinese", "Sundanese", "Batak", "Lepcha", "Ol Chiki", "Cyrillic Extended-C", "Georgian Extended",
			"Sundanese Supplement", "Vedic Extensions", "Phonetic Extensions", "Phonetic Extensions Supplement", "Combining Diacritical Marks Supplement", "Latin Extended Additional", "Greek Extended", "General Punctuation",
			"Superscripts and Subscripts", "Currency Symbols", "Combining Diacritical Marks for Symbols", "Letterlike Symbols", "Number Forms", "Arrows", "Mathematical Operators", "Miscellaneous Technical",
			"Control Pictures", "Optical Character Recognition", "Enclosed Alphanumerics", "Box Drawing", "Block Elements", "Geometric Shapes", "Miscellaneous Symbols", "Dingbats",
			"Miscellaneous Mathematical Symbols-A", "Supplemental Arrows-A", "Braille Patterns", "Supplemental Arrows-B", "Miscellaneous Mathematical Symbols-B", "Supplemental Mathematical Operators", "Miscellaneous Symbols and Arrows", "Glagolitic",
			"Latin Extended-C", "Coptic", "Georgian Supplement", "Tifinagh", "Ethiopic Extended", "Cyrillic Extended-A", "Supplemental Punctuation", "CJK Radicals Supplement",
			"Kangxi Radicals", "Ideographic Description Characters", "CJK Symbols and Punctuation", "Hiragana", "Katakana", "Bopomofo", "Hangul Compatibility Jamo", "Kanbun",
			"Bopomofo Extended", "CJK Strokes", "Katakana Phonetic Extensions", "Enclosed CJK Letters and Months", "CJK Compatibility", "CJK Unified Ideographs Extension A", "Yijing Hexagram Symbols", "CJK Unified Ideographs",
			"Yi Syllables", "Yi Radicals", "Lisu", "Vai", "Cyrillic Extended-B", "Bamum", "Modifier Tone Letters", "Latin Extended-D",
			"Syloti Nagri", "Common Indic Number Forms", "Phags-pa", "Saurashtra", "Devanagari Extended", "Kayah Li", "Rejang", "Hangul Jamo Extended-A",
			"Javanese", "Myanmar Extended-B", "Cham", "Myanmar Extended-A", "Tai Viet", "Meetei Mayek Extensions", "Ethiopic Extended-A", "Latin Extended-E",
			"Cherokee Supplement", "Meetei Mayek", "Hangul Syllables", "Hangul Jamo Extended-B", "High Surrogates", "High Private Use Surrogates", "Low Surrogates", "Private Use Area",
			"CJK Compatibility Ideographs", "Alphabetic Presentation Forms", "Arabic Presentation Forms-A", "Variation Selectors", "Vertical Forms", "Combining Half Marks", "CJK Compatibility Forms", "Small Form Variants",
			"Arabic Presentation Forms-B", "Halfwidth and Fullwidth Forms", "Specials", "Linear B Syllabary", "Linear B Ideograms", "Aegean Numbers", "Ancient Greek Numbers", "Ancient Symbols",
			"Phaistos Disc", "Lycian", "Carian", "Coptic Epact Numbers", "Old Italic", "Gothic", "Old Permic", "Ugaritic",
			"Old Persian", "Deseret", "Shavian", "Osmanya", "Osage", "Elbasan", "Caucasian Albanian", "Linear A",
			"Cypriot Syllabary", "Imperial Aramaic", "Palmyrene", "Nabataean", "Hatran", "Phoenician", "Lydian", "Meroitic Hieroglyphs",
			"Meroitic Cursive", "Kharoshthi", "Old South Arabian", "Old North Arabian", "Manichaean", "Avestan", "Inscriptional Parthian", "Inscriptional Pahlavi",
			"Psalter Pahlavi", "Old Turkic", "Old Hungarian", "Hanifi Rohingya", "Rumi Numeral Symbols", "Old Sogdian", "Sogdian", "Brahmi",
			"Kaithi", "Sora Sompeng", "Chakma", "Mahajani", "Sharada", "Sinhala Archaic Numbers", "Khojki", "Multani",
			"Khudawadi", "Grantha", "Newa", "Tirhuta", "Siddham", "Modi", "Mongolian Supplement", "Takri",
			"Ahom", "Dogra", "Warang Citi", "Zanabazar Square", "Soyombo", "Pau Cin Hau", "Bhaiksuki", "Marchen",
			"Masaram Gondi", "Gunjala Gondi", "Makasar", "Cuneiform", "Cuneiform Numbers and Punctuation", "Early Dynastic Cuneiform", "Egyptian Hieroglyphs", "Anatolian Hieroglyphs",
			"Bamum Supplement", "Mro", "Bassa Vah", "Pahawh Hmong", "Medefaidrin", "Miao", "Ideographic Symbols and Punctuation", "Tangut",
			"Tangut Components", "Kana Supplement", "Kana Extended-A", "Nushu", "Duployan", "Shorthand Format Controls", "Byzantine Musical Symbols", "Musical Symbols",
			"Ancient Greek Musical Notation", "Mayan Numerals", "Tai Xuan Jing Symbols", "Counting Rod Numerals", "Mathematical Alphanumeric Symbols", "Sutton SignWriting", "Glagolitic Supplement", "Mende Kikakui",
			"Adlam", "Indic Siyaq Numbers", "Arabic Mathematical Alphabetic Symbols", "Mahjong Tiles", "Domino Tiles", "Playing Cards", "Enclosed Alphanumeric Supplement", "Enclosed Ideographic Supplement",
			"Miscellaneous Symbols and Pictographs", "Emoticons", "Ornamental Dingbats", "Transport and Map Symbols", "Alchemical Symbols", "Geometric Shapes Extended", "Supplemental Arrows-C", "Supplemental Symbols and Pictographs",
			"Chess Symbols", "CJK Unified Ideographs Extension B", "CJK Unified Ideographs Extension C", "CJK Unified Ideographs Extension D", "CJK Unified Ideographs Extension E", "CJK Unified Ideographs Extension F", "CJK Compatibility Ideographs Supplement"
		];

		const unicode_blockaddress_array = [
			0x007F, 0x00FF, 0x017F, 0x024F, 0x02AF, 0x02FF, 0x036F, 0x03FF, 0x04FF, 0x052F, 0x058F, 0x05FF, 0x06FF, 0x074F, 0x077F, 0x07BF,
			0x07FF, 0x083F, 0x085F, 0x086F, 0x08FF, 0x097F, 0x09FF, 0x0A7F, 0x0AFF, 0x0B7F, 0x0BFF, 0x0C7F, 0x0CFF, 0x0D7F, 0x0DFF, 0x0E7F,
			0x0EFF, 0x0FFF, 0x109F, 0x10FF, 0x11FF, 0x137F, 0x139F, 0x13FF, 0x167F, 0x169F, 0x16FF, 0x171F, 0x173F, 0x175F, 0x177F, 0x17FF,
			0x18AF, 0x18FF, 0x194F, 0x197F, 0x19DF, 0x19FF, 0x1A1F, 0x1AAF, 0x1AFF, 0x1B7F, 0x1BBF, 0x1BFF, 0x1C4F, 0x1C7F, 0x1C8F, 0x1CBF,
			0x1CCF, 0x1CFF, 0x1D7F, 0x1DBF, 0x1DFF, 0x1EFF, 0x1FFF, 0x206F, 0x209F, 0x20CF, 0x20FF, 0x214F, 0x218F, 0x21FF, 0x22FF, 0x23FF,
			0x243F, 0x245F, 0x24FF, 0x257F, 0x259F, 0x25FF, 0x26FF, 0x27BF, 0x27EF, 0x27FF, 0x28FF, 0x297F, 0x29FF, 0x2AFF, 0x2BFF, 0x2C5F,
			0x2C7F, 0x2CFF, 0x2D2F, 0x2D7F, 0x2DDF, 0x2DFF, 0x2E7F, 0x2EFF, 0x2FDF, 0x2FFF, 0x303F, 0x309F, 0x30FF, 0x312F, 0x318F, 0x319F,
			0x31BF, 0x31EF, 0x31FF, 0x32FF, 0x33FF, 0x4DBF, 0x4DFF, 0x9FFF, 0xA48F, 0xA4CF, 0xA4FF, 0xA63F, 0xA69F, 0xA6FF, 0xA71F, 0xA7FF,
			0xA82F, 0xA83F, 0xA87F, 0xA8DF, 0xA8FF, 0xA92F, 0xA95F, 0xA97F, 0xA9DF, 0xA9FF, 0xAA5F, 0xAA7F, 0xAADF, 0xAAFF, 0xAB2F, 0xAB6F,
			0xABBF, 0xABFF, 0xD7AF, 0xD7FF, 0xDB7F, 0xDBFF, 0xDFFF, 0xF8FF, 0xFAFF, 0xFB4F, 0xFDFF, 0xFE0F, 0xFE1F, 0xFE2F, 0xFE4F, 0xFE6F,
			0xFEFF, 0xFFEF, 0xFFFF,
			0x1007F, 0x100FF, 0x1013F, 0x1018F, 0x101CF, 0x101FF, 0x1029F, 0x102DF, 0x102FF, 0x1032F, 0x1034F, 0x1037F, 0x1039F, 0x103DF, 0x1044F, 0x1047F,
			0x104AF, 0x104FF, 0x1052F, 0x1056F, 0x1077F, 0x1083F, 0x1085F, 0x1087F, 0x108AF, 0x108FF, 0x1091F, 0x1093F, 0x1099F, 0x109FF, 0x10A5F, 0x10A7F,
			0x10A9F, 0x10AFF, 0x10B3F, 0x10B5F, 0x10B7F, 0x10BAF, 0x10C4F, 0x10CFF, 0x10D3F, 0x10E7F, 0x10F2F, 0x10F6F, 0x1107F, 0x110CF, 0x110FF, 0x1114F,
			0x1117F, 0x111DF, 0x111FF, 0x1124F, 0x112AF, 0x112FF, 0x1137F, 0x1147F, 0x114DF, 0x115FF, 0x1165F, 0x1167F, 0x116CF, 0x1173F, 0x1184F, 0x118FF,
			0x11A4F, 0x11AAF, 0x11AFF, 0x11C6F, 0x11CBF, 0x11D5F, 0x11DAF, 0x11EFF, 0x123FF, 0x1247F, 0x1254F, 0x1342F, 0x1467F, 0x16A3F, 0x16A6F, 0x16AFF,
			0x16B8F, 0x16E9F, 0x16F9F, 0x16FFF, 0x187FF, 0x18AFF, 0x1B0FF, 0x1B12F, 0x1B2FF, 0x1BC9F, 0x1BCAF, 0x1D0FF, 0x1D1FF, 0x1D24F, 0x1D2FF, 0x1D35F,
			0x1D37F, 0x1D7FF, 0x1DAAF, 0x1E02F, 0x1E8DF, 0x1E95F, 0x1ECBF, 0x1EEFF, 0x1F02F, 0x1F09F, 0x1F0FF, 0x1F1FF, 0x1F2FF, 0x1F5FF, 0x1F64F, 0x1F67F,
			0x1F6FF, 0x1F77F, 0x1F7FF, 0x1F8FF, 0x1F9FF, 0x1FA6F, 0x2A6DF, 0x2B73F, 0x2B81F, 0x2CEAF, 0x2EBEF, 0x2FA1F
		];

		to_block_name_from_unicode = function(unicode_codepoint) {
			for(let i = 0; i < unicode_blockname_array.length; i++) {
				if(unicode_codepoint <= unicode_blockaddress_array[i]) {
					return unicode_blockname_array[i];
				}
			}
			return "-";
		};

	}

	/**
	 * コードポイントからUnicodeのブロック名に変換する
	 * @param {number} unicode_codepoint 
	 * @returns {string}
	 */
	static toBlockNameFromUnicode(unicode_codepoint) {
		CHAR_MAP.init();
		return to_block_name_from_unicode(unicode_codepoint);
	}

	/**
	 * 変換用マップ
	 */
	static get CONTROL_CHARCTER() {
		CHAR_MAP.init();
		return control_charcter_map;
	}

	/**
	 * チェック用マップ
	 */
	static get JOYOJANJI_BEFORE_1981() {
		CHAR_MAP.init();
		return joyokanji_before_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JOYOKANJI_ADD_1981() {
		CHAR_MAP.init();
		return joyokanji_add_1981_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JOYOKANJI_ADD_2010() {
		CHAR_MAP.init();
		return joyokanji_add_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JOYOKANJI_DELETE_2010() {
		CHAR_MAP.init();
		return joyokanji_delete_2010_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JINMEIYOKANJI_JOYOKANJI_ISETAI_2017() {
		CHAR_MAP.init();
		return jinmeiyokanji_joyokanji_isetai_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JINMEIYOKANJI_NOTJOYOKANJI_2017() {
		CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_2017_map;
	}
	
	/**
	 * チェック用マップ
	 */
	static get JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017() {
		CHAR_MAP.init();
		return jinmeiyokanji_notjoyokanji_isetai_2017_map;
	}
	
}

/**
 * マップを初期化した否か
 */
CHAR_MAP.is_initmap = false;

/**
 * 文字の解析用クラス
 * @ignore
 */
class Character {
	
	/**
	 * 指定したコードポイントが制御文字であれば、制御文字の名前を返す
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {String} 制御文字名、違う場合は null 
	 */
	static getControlCharcterName(unicode_codepoint) {
		const control_charcter_map = CHAR_MAP.CONTROL_CHARCTER;
		const name = control_charcter_map[unicode_codepoint];
		return name ? name : null;
	}
	
	/**
	 * 指定したコードポイントの漢字は1981年より前に常用漢字とされているか判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanjiBefore1981(unicode_codepoint) {
		const joyokanji_before_1981_map = CHAR_MAP.JOYOJANJI_BEFORE_1981;
		return !!joyokanji_before_1981_map[unicode_codepoint];
	}

	/**
	 * 指定したコードポイントの漢字は1981年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji1981(unicode_codepoint) {
		const joyokanji_before_1981_map = CHAR_MAP.JOYOJANJI_BEFORE_1981;
		const joyokanji_add_1981_map = CHAR_MAP.JOYOKANJI_ADD_1981;
		return (!!joyokanji_before_1981_map[unicode_codepoint]) || (!!joyokanji_add_1981_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2010年時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji2010(unicode_codepoint) {
		const joyokanji_add_2010_map = CHAR_MAP.JOYOKANJI_ADD_2010;
		const joyokanji_delete_2010_map = CHAR_MAP.JOYOKANJI_DELETE_2010;
		if(joyokanji_delete_2010_map[unicode_codepoint]) {
			return false;
		}
		const x = Character.isJoyoKanji1981(unicode_codepoint);
		return x || (!!joyokanji_add_2010_map[unicode_codepoint]);
	}

	/**
	 * 指定したコードポイントの漢字は2017年時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji2017(unicode_codepoint) {
		if(Character.isJoyoKanji2010(unicode_codepoint)) {
			return false;
		}
		const jinmeiyokanji_joyokanji_isetai_map = CHAR_MAP.JINMEIYOKANJI_JOYOKANJI_ISETAI_2017;
		const jinmeiyokanji_notjoyokanji_map = CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_2017;
		const jinmeiyokanji_notjoyokanji_isetai_map = CHAR_MAP.JINMEIYOKANJI_NOTJOYOKANJI_ISETAI_2017;
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
		return Character.isJoyoKanji2010(unicode_codepoint) || Character.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で常用漢字かを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJoyoKanji(unicode_codepoint) {
		return Character.isJoyoKanji2010(unicode_codepoint);
	}
	
	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字でのみ存在するかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isOnlyJinmeiyoKanji(unicode_codepoint) {
		return Character.isOnlyJinmeiyoKanji2017(unicode_codepoint);
	}

	/**
	 * 指定したコードポイントの漢字は本ソースコードの最新の時点で人名漢字で許可されているかを判定する
	 * @param {Number} unicode_codepoint - Unicodeのコードポイント
	 * @returns {boolean} 判定結果
	 */
	static isJinmeiyoKanji(unicode_codepoint) {
		return Character.isJinmeiyoKanji2017(unicode_codepoint);
	}

}

/**
 * 文字のエンコード情報
 */
export class CharacterEncodeData {

	/**
	 * データ格納用変数の初期化
	 */
	constructor() {

		/**
		 * 区点 コード
		 * @type {import("../encode/SJIS.js").MenKuTen}
		 */
		this.kuten				= null;

		/**
		 * 面区点 コード
		 * @type {import("../encode/SJIS.js").MenKuTen}
		 */
		this.menkuten			= null;

		/**
		 * CP932(Windows-31J) コード
		 * @type {number}
		 */
		this.cp932_code		= 0;

		/**
		 * Shift_JIS-2004 コード
		 * @type {number}
		 */
		this.sjis2004_code	= 0;

		/**
		 * UTF-8 配列
		 * @type {Array<number>}
		 */
		this.utf8_array = [];
		
		/**
		 * UTF-16 配列
		 * @type {Array<number>}
		 */
		this.utf16_array = [];

		/**
		 * UTF-32 配列
		 * @type {Array<number>}
		 */
		this.utf32_array = [];

		/**
		 * CP932(Windows-31J) バイト配列
		 * @type {Array<number>}
		 */
		this.cp932_array = [];

		/**
		 * Shift_JIS-2004 コード バイト配列
		 * @type {Array<number>}
		 */
		this.sjis2004_array = [];

		/**
		 * Shift_JIS バイト配列
		 * @type {Array<number>}
		 */
		this.shift_jis_array = [];

		/**
		 * ISO-2022-JP バイト配列
		 * @type {Array<number>}
		 */
		this.iso2022jp_array = [];

		/**
		 * EUC-JP バイト配列
		 * @type {Array<number>}
		 */
		this.eucjp_array = [];
	}
}

/**
 * 文字の種別情報
 */
export class CharacterTypeData {
	
	/**
	 * データ格納用変数の初期化
	 */
	constructor() {
		/**
		 * Shift_JIS に登録された文字
		 * @type {boolean}
		 */
		this.is_regular_sjis	= false;

		/**
		 * Shift_JIS-2004 に登録された文字
		 * @type {boolean}
		 */
		this.is_regular_sjis2004 = false;

		/**
		 * 漢字が常用漢字か、人名用漢字かなど
		 * @type {boolean}
		 */
		this.is_joyo_kanji		= false;

		/**
		 * 人名用漢字
		 * @type {boolean}
		 */
		this.is_jinmeiyo_kanji	= false;

		/**
		 * Windows-31J(CP932) 外字
		 * @type {boolean}
		 */
		this.is_gaiji_cp932	= false;

		/**
		 * Windows-31J(CP932) IBM拡張文字
		 * @type {boolean}
		 */
		this.is_IBM_extended_character	= false;

		/**
		 * Windows-31J(CP932) NEC選定IBM拡張文字
		 * @type {boolean}
		 */
		this.is_NEC_selection_IBM_extended_character	= false;

		/**
		 * Windows-31J(CP932) NEC特殊文字
		 * @type {boolean}
		 */
		this.is_NEC_special_character	= false;

		/**
		 * Shift_JIS-2004 を使用して漢字の水準調査
		 * @type {number} 漢字水準, 1未満だと水準調査失敗
		 */
		this.kanji_suijun = -1;

		/**
		 * Unicode サロゲートペア
		 * @type {boolean}
		 */
		this.is_surrogate_pair	= false;

		/**
		 * 制御文字名（制御文字ではない場合は null）
		 * @type {string}
		 */
		this.control_name = null;

		/**
		 * 制御文字
		 * @type {boolean}
		 */
		this.is_control_charcter = false;

		/**
		 * Unicodeブロック名
		 * @type {string}
		 */
		this.blockname = "";

		/**
		 * 漢字
		 * @type {boolean}
		 */
		this.is_kanji = false;

		/**
		 * ひらがな
		 * @type {boolean}
		 */
		this.is_hiragana = false;

		/**
		 * カタカナ
		 * @type {boolean}
		 */
		this.is_katakana = false;

		/**
		 * 全角ASCII
		 * @type {boolean}
		 */
		this.is_fullwidth_ascii = false;

		/**
		 * 半角カタカナ
		 * @type {boolean}
		 */
		this.is_halfwidth_katakana = false;

		/**
		 * 絵文字
		 * @type {boolean}
		 */
		this.is_emoji = false;

		/**
		 * 顔文字
		 * @type {boolean}
		 */
		this.is_emoticons = false;

		/**
		 * 外字
		 * @type {boolean}
		 */
		this.is_gaiji = false;
	}
}

/**
 * 文字の解析データ情報
 */
export class CharacterAnalysisData {

	/**
	 * データ格納用変数の初期化
	 */
	constructor() {
	
		/**
		 * 文字のエンコード情報
		 * @type {CharacterEncodeData}
		 */
		this.encode = new CharacterEncodeData();

		/**
		 * 文字の種別情報
		 * @type {CharacterTypeData}
		 */
		this.type = new CharacterTypeData();

		/**
		 * 解析した文字
		 * @type {string}
		 */
		this.character = null;

		/**
		 * 解析した文字のコードポイント
		 * @type {number}
		 */
		this.codepoint = 0;
	}
}

/**
 * 文字の解析用クラス
 * @ignore
 */
export default class CharacterAnalyser {

	/**
	 * 指定した1つの文字に関して、解析を行い情報を返します
	 * @param {Number} unicode_codepoint - UTF-32 のコードポイント
	 * @returns {CharacterAnalysisData} 文字の情報がつまったオブジェクト
	 */
	static getCharacterAnalysisData(unicode_codepoint) {

		// 基本情報取得
		const cp932code = CP932.toCP932FromUnicode(unicode_codepoint);
		const sjis2004code = SJIS2004.toSJIS2004FromUnicode(unicode_codepoint);
		const kuten = SJIS.toKuTenFromSJISCode(cp932code);
		const menkuten = SJIS.toMenKuTenFromSJIS2004Code(sjis2004code);
		const is_regular_sjis = cp932code < 0x100 || SJIS.isRegularMenKuten(kuten);
		const is_regular_sjis2004 = sjis2004code < 0x100 || SJIS.isRegularMenKuten(menkuten);

		/**
		 * 出力データの箱を用意
		 * @type {CharacterAnalysisData}
		 */
		const data = new CharacterAnalysisData();
		const encode = data.encode;
		const type = data.type;
		data.character = Unicode.fromCodePoint(unicode_codepoint);
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
		type.is_joyo_kanji		= Character.isJoyoKanji(unicode_codepoint);
		type.is_jinmeiyo_kanji	= Character.isJinmeiyoKanji(unicode_codepoint);

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

		// ISO-2022-JP , EUC-JP
		if(cp932code < 0xE0 || kuten) {
			if(cp932code < 0x80) {
				encode.shift_jis_array = [cp932code];
				encode.iso2022jp_array = [];
				encode.eucjp_array = [cp932code];
			}
			else {
				// 半角カタカナの扱い
				if(cp932code < 0xE0) {
					encode.shift_jis_array = [cp932code];
					encode.iso2022jp_array = [];
					encode.eucjp_array = [0x80, cp932code];
				}
				else {
					encode.shift_jis_array = [encode.cp932_array[0], encode.cp932_array[1]];
					encode.iso2022jp_array = [kuten.ku + 0x20, kuten.ten + 0x20];
					encode.eucjp_array = [kuten.ku + 0xA0, kuten.ten + 0xA0];
				}
			}
		}
		else {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
			encode.eucjp_array = [];
		}
		// SJISとして正規でなければ強制エンコード失敗
		if(!is_regular_sjis) {
			encode.shift_jis_array = [];
			encode.iso2022jp_array = [];
			encode.eucjp_array = [];
		}

		// 制御文字かどうか
		type.control_name = Character.getControlCharcterName(unicode_codepoint);
		type.is_control_charcter = type.control_name ? true : false;

		// Unicodeのブロック名
		type.blockname = CHAR_MAP.toBlockNameFromUnicode(unicode_codepoint);
		// ブロック名から判断
		type.is_kanji = /Ideographs/.test(type.blockname);
		type.is_hiragana = /Hiragana/.test(type.blockname);
		type.is_katakana = /Katakana/.test(type.blockname);
		type.is_fullwidth_ascii = /[\u3000\uFF01-\uFF5E]/.test(data.character);
		type.is_halfwidth_katakana = /[\uFF61-\uFF9F]/.test(data.character);
		// 絵文字
		type.is_emoji = /Pictographs/.test(type.blockname);
		// 顔文字
		type.is_emoticons = /Emoticons/.test(type.blockname);
		// 外字
		type.is_gaiji = /Private Use Area/.test(type.blockname);
		// 他に外字チェック
		type.is_gaiji = type.is_gaiji || ((0xF0000 <= unicode_codepoint) && (unicode_codepoint <= 0x10FFFF));
		
		return data;
	}

}
