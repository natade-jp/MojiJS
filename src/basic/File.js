/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

const CSVTool = {
	
	parseCSV: function(text, separator) {
		if(arguments.length < 2) {
			separator = ",";
		}
		// 改行コードの正規化
		text = text.replace(/\r\n?|\n/g, "\n");
		const CODE_SEPARATOR = separator.charCodeAt(0);
		const CODE_CR    = 0x0D;
		const CODE_LF    = 0x0A;
		const CODE_DOUBLEQUOTES = 0x22;
		const out = [];
		const length = text.length;
		let element = "";
		let count_rows    = 0;
		let count_columns = 0;
		let isnextelement = false;
		let isnextline    = false;
		for(let i = 0; i < length; i++) {
			let code = text.charCodeAt(i);
			// 複数行なら一気に全て読み込んでしまう(1文字目がダブルクォーテーションかどうか)
			if((code === CODE_DOUBLEQUOTES)&&(element.length === 0)) {
				i++;
				for(;i < length;i++) {
					code = text.charCodeAt(i);
					if(code === CODE_DOUBLEQUOTES) {
						// フィールドの終了か？
						// 文字としてのダブルクォーテーションなのか
						if((i + 1) !== (length - 1)) {
							if(text.charCodeAt(i + 1) === CODE_DOUBLEQUOTES) {
								i++;
								element += "\""; 
							}
							else {
								break;
							}
						}
						else {
							break;
						}
					}
					else {
						element += text.charAt(i);
					}
				}
			}
			// 複数行以外なら1文字ずつ解析
			else {
				switch(code) {
					case(CODE_SEPARATOR):
						isnextelement = true;
						break;
					case(CODE_CR):
					case(CODE_LF):
						isnextline = true;
						break;
					default:
						break;
				}
				if(isnextelement) {
					isnextelement = false;
					if(out[count_rows] === undefined) {
						out[count_rows] = [];
					}
					out[count_rows][count_columns] = element;
					element = "";
					count_columns += 1;
				}
				else if(isnextline) {
					isnextline = false;
					//文字があったり、改行がある場合は処理
					//例えば CR+LF や 最後のフィールド で改行しているだけなどは無視できる
					if((element !== "")||(count_columns !== 0)) {
						if(out[count_rows] === undefined) {
							out[count_rows] = [];
						}
						out[count_rows][count_columns] = element;
						element = "";
						count_rows    += 1;
						count_columns  = 0;
					}
				}
				else {
					element += text.charAt(i);
				}
			}
			// 最終行に改行がない場合
			if(i === length - 1) {
				if(count_columns !== 0) {
					out[count_rows][count_columns] = element;
				}
			}
		}
		return out;
	},
	
	makeCSV: function(text, separator, newline) {
		if(arguments.length < 2) {
			separator = ",";
		}
		if(arguments.length < 3) {
			newline = "\r\n";
		}
		let out = "";
		const escape = /["\r\n,\t]/;
		if(text !== undefined) {
			for(let i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(let j = 0;j < text[i].length;j++) {
						let element = text[i][j];
						if(escape.test(element)) {
							element = element.replace(/"/g, "\"\"");
							element = "\"" + element + "\"";
						}
						out += element;
						if(j !== text[i].length - 1) {
							out += separator;
						}
					}
				}
				out += newline;
			}
		}
		return out;
	}
};

export default class File {
	
	constructor(pathname) {
		this.isHTML = (typeof window !== "undefined");
		this.isNode = false;
		if(arguments.length !== 1) {
			throw "IllegalArgumentException";
		}
		else if((typeof pathname === "string")||(pathname instanceof String)) {
			// \を/に置き換える
			this.pathname = pathname.replace(/\\/g, "/" );
		}
		else if(pathname instanceof File) {
			this.pathname = pathname.getAbsolutePath();
		}
		else {
			throw "IllegalArgumentException";
		}
	}

	delete_() {
		throw "IllegalMethod";
	}
	
	exists() {
		throw "IllegalMethod";
	}
	
	copy() {
		throw "IllegalMethod";
	}
	
	move() {
		throw "IllegalMethod";
	}
	
	toString() {
		return this.getAbsolutePath();
	}
	
	getName() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合は、ファイル名取得できない
			if(this.isDirectory()) {
				return "";
			}
			const slashsplit = this.pathname.split("/");
			return slashsplit[slashsplit.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	// 親フォルダの絶対パス名
	getParent() {
		const x = this.getAbsolutePath().match(/.*[/\\]/)[0];
		return x.substring(0 ,x.length - 1);
	}
	
	getParentFile() {
		return new File(this.getParent());
	}
	
	getExtensionName() {
		if(this.isHTML) {
			const dotlist = this.getName().split(".");
			return dotlist[dotlist.length - 1];
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isAbsolute() {
		if(this.isHTML) {
			return this.getAbsolutePath() === this.pathname;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isDirectory() {
		if(this.isHTML) {
			// 最後がスラッシュで終えている場合はディレクトリ
			return /\/$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	isFile() {
		if(this.isHTML) {
			// 最後がスラッシュで終えていない場合はファイル
			return /[^/]$/.test(this.pathname);
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	isHidden() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	lastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setLastModified() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	length() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getSubFolders() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getNormalizedPathName() {
		if(this.pathname === "") {
			return ".\\";
		}
		let name = this.pathname.replace(/\//g, "\\");
		if(name.slice(-1) !== "\\") {
			name += "\\";
		}
		return name;
	}
	
	getAllFiles() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	list() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getAbsolutePath() {
		if(this.isHTML) {
			let all_path = null;
			// URLを一度取得する
			if(/^http/.test(this.pathname)) {
				all_path = this.pathname;
			}
			else {
				let curdir = window.location.toString();
				// 最後がスラッシュで終えていないは、ファイル部分を削る
				if(!(/\/$/.test(curdir))) {
					curdir = curdir.match(/.*\//)[0];
				}
				all_path = curdir + this.pathname;
			}
			// ホストとファイルに分ける
			const hosttext = all_path.match(/^http[^/]+\/\/[^/]+\//)[0];
			const filetext = all_path.substr(hosttext.length);
			// パスを1つずつ解析しながら辿っていく
			let name = hosttext;
			const namelist = filetext.split("/");
			let i;
			for(i = 0; i < namelist.length; i++) {
				if((namelist[i] === "") || (namelist[i] === ".")) {
					continue;
				}
				if(namelist[i] === "..") {
					name = name.substring(0 ,name.length - 1).match(/.*\//)[0];
					continue;
				}
				name += namelist[i];
				if(i !== namelist.length - 1) {
					name += "/";
				}
			}
			return name;
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdir() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	mkdirs() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	renameTo() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	run() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	writeLine() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	download(callback) {
		if(this.isHTML) {
			const ext = this.getExtensionName().toLocaleString();
			const that = this;
			if((ext === "gif") || (ext === "jpg") || (ext === "png") || (ext === "bmp") || (ext === "svg") || (ext === "jpeg")) {
				const image = new Image();
				image.onload = function() {
					that.dataImage = image;
					callback(that);
				};
				image.src = this.pathname;
			}
			else {
				const http = File.createXMLHttpRequest();
				if(http === null) {
					return null;
				}
				const handleHttpResponse = function (){
					// readyState === 0 UNSENT
					// readyState === 1 OPENED
					// readyState === 2 HEADERS_RECEIVED
					// readyState === 3 LOADING
					if(http.readyState === 4) { // DONE
						if(http.status !== 200) {
							console.log("error downloadText " + that.pathname);
							return null;
						}
						that.dataText = http.responseText;
						callback(that);
					}
				};
				http.onreadystatechange = handleHttpResponse;
				http.open("GET", this.pathname, true);
				http.send(null);
			}
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getImage() {
		if(this.isHTML) {
			return this.dataImage;
		}
	}
	
	getText() {
		if(this.isHTML) {
			return this.dataText;
		}
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	setText() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	getCSV(separator, charset, newline) {
		if(this.isHTML) {
			return(CSVTool.parseCSV(this.dataText, separator, newline));
		}
		else if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setCSV() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	getByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}

	setByte() {
		if(this.isNode) {
			throw "IllegalMethod";
		}
	}
	
	static createTempFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not createTempFile";
		}
		const isNode = false;
		if(isNode) {
			throw "IllegalMethod";
		}
	}
	
	static getCurrentDirectory(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			const file = new File("./");
			return file.getParent();
		}
		const isNode = false;
		if(isNode) {
			throw "IllegalMethod";
		}
	}
	
	static setCurrentDirectory() {
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not setCurrentDirectory";
		}
		const isNode = false;
		if(isNode) {
			throw "IllegalMethod";
		}
	}
	
	static searchFile(){
		const isHTML = (typeof window !== "undefined");
		if(isHTML) {
			throw "not searchFile";
		}
		const isNode = false;
		if(isNode) {
			throw "IllegalMethod";
		}
	}
	
	static downloadFileList(files, lastCallback, fileCallback) {
		let downloadcount = 0;
		let i;
		const inf = function(filenumber) {
			return function() {
				downloadcount++;
				if(fileCallback && fileCallback.length && fileCallback[filenumber] ) {
					fileCallback[filenumber](files[filenumber]);
				}
				if(downloadcount === files.length) {
					if(lastCallback) {
						lastCallback(files);
					}
				}
			};
		};
		for(i = 0; i < files.length; i++ ) {
			files[i].download(inf(i));
		}
	}

	static createXMLHttpRequest() {
		return new XMLHttpRequest();
	}
	
	static getCSVTool() {
		return CSVTool;
	}
}
