const File = require("./File.js");

// npx jsdoc -c "./scripts/.dts.json" -r "./src/"
try {
	File.exec("npx jsdoc -c \"./scripts/.dts.json\" -r \"./src/\"");
}
catch (error) {
	// {typeof XXX} という型で不正エラーが発生するが、
	// d.ts作成が目的のため影響がないと思われる。
}

// 自動生成したdtsファイルを解析
let dts_text = File.loadTextFile("./out/types.d.ts");

// 戻り値の補正
// 戻り値が any で終わっているものは解析エラーの可能性があるため、returns の情報を使用する
{
	const dts_text_line = dts_text.split("\n");
	for(let i = 0; i < dts_text_line.length; i++) {
		const line = dts_text_line[i];
		if(!line.endsWith(": any;")) {
			continue;
		}
		// 戻り値がanyで終わっているものは解析エラーの可能性がある。
		let returns = null;
		for(let j = i - 3; j < i; j++) {
			// {} の入れ子について
			// 1重 (\{[^{]*\})
			// 2重 (\{[^{]*((\{[^{]*\})*[^{]*)\})
			// 3重 (\{[^{]*((\{[^{]*((\{[^{]*\})*[^{]*)\})*[^{]*)\})
			// 3重まで対応
			if(/(\s*\*\s*@returns?\s*)(\{[^{]*((\{[^{]*((\{[^{]*\})*[^{]*)\})*[^{]*)\})/.test(dts_text_line[j])) {
				const match = dts_text_line[j].match(/(\s*\*\s*@returns?\s*)(\{[^{]*((\{[^{]*((\{[^{]*\})*[^{]*)\})*[^{]*)\})/)[0];
				const with_block = match.replace(/(\s*\*\s*@returns?\s*)/, "");
				returns = with_block.replace(/(^{)|(}$)/g, "");
				break;
			}
		}
		if(returns === null) {
			continue;
		}
		// 2行前がreturnコメントなら、returnコメントを採用
		dts_text_line[i] = line.replace(/: any;$/, ": " + returns + ";");
	}
	dts_text = dts_text_line.join("\n");
}

{
	// "import("./*/*.js")." などのimport文の除去
	dts_text = dts_text.replace(/import\([^)]*\)\./g, "");
}

// 型の補正
// 外部に見せる必要がなく、見せると衝突してしまう可能性が高いため、装飾する。
{
	const types = [
		"CP932",
		"CP932MAP",
		"SJIS",
		"SJIS2004",
		"SJIS2004MAP",
		"Unicode",
		"Japanese",
		"MojiAnalyzer",
		"MOJI_CHAR_MAP",
		"MojiAnalizerTools",
		"MojiEncodeData",
		"MojiTypeData",
		"MojiData",
		"StringComparator",
		"ComparatorTool",
		"MenKuTen"
	];
	for(let i = 0; i < types.length; i++) {
		const word = types[i];
		let reg = null;
		// 文字列を装飾する
		reg = new RegExp("([\\W])(" + word + ")([\\W])", "g");
		dts_text = dts_text.replace(reg, "$1_$2_$3");

		// 装飾が不要な箇所を元に戻す
		reg = new RegExp("(static )(_" + word + "_)(: typeof )(_" + word + "_;)", "g");
		dts_text = dts_text.replace(reg, "$1" + word + "$3$4");
	}
}

File.saveTextFile("./build/MojiJS.d.ts", dts_text);
File.deleteDirectory("./out");
