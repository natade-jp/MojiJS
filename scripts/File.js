/*!
 * File.js
 * https://github.com/natade-jp/konpeito
 * Copyright 2013-2019 natade < https://github.com/natade-jp >
 *
 * The MIT license.
 * https://opensource.org/licenses/MIT
 */

const fs = require("fs");
const child_process = require("child_process");

/**
 * ファイルクラス
 */
class File {

	/**
	 * UTF-8 でテキストを書き込む
	 * @param {string} path 
	 * @param {string} text 
	 */
	static saveTextFile(path, text) {
		fs.writeFileSync(path, text, "utf-8");
	}

	/**
	 * UTF-8 with BOM でテキストを書き込む
	 * @param {string} path 
	 * @param {string} text 
	 */
	static saveTextFileWithBOM(path, text) {
		if (text.length > 0 && text.charAt(0) !== "\uFEFF") {
			fs.writeFileSync(path, "\uFEFF" + text, "utf-8");
		}
		else {
			fs.writeFileSync(path, text, "utf-8");
		}
	}

	/**
	 * BOMあり／なしに関わらず、UTF-8のテキストを読み込む
	 * @param {string} path
	 * @returns {string} テキストデータ 
	 */
	static loadTextFile(path) {
		const text = fs.readFileSync(path, "utf-8");
		if (text.length > 0 && text.charAt(0) === "\uFEFF") {
			return text.substr(1);
		}
		else {
			return text;
		}
	}

	/**
	 * バイナリデータを書き込む
	 * @param {string} path 
	 * @param {number[]} binary 
	 */
	static saveBinaryFile(path, binary) {
		const buffer = new Uint8Array(binary.length);
		for(let i = 0; i < buffer.length; i++) {
			buffer[i] = binary[i];
		}
		fs.writeFileSync(path, buffer);
	}

	/**
	 * バイナリデータを読み込む
	 * @param {string} path
	 * @returns {number[]} バイナリデータ 
	 */
	static loadBinaryFile(path) {
		const buffer = fs.readFileSync(path);
		const binary = new Array(buffer.length);
		for(let i = 0; i < buffer.length; i++) {
			binary[i] = buffer.readUInt8(i);
		}
		return binary;
	}

	/**
	 * 実行する
	 * @param {string} command 
	 */
	static exec(command) {
		const execSync = child_process.execSync;
		execSync(command);
	}

	/**
	 * ファイルが存在するか調べる
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isExist(path) {
		try {
			fs.statSync(path);
			return true;
		}
		catch (error) {
			if(error.code === "ENOENT") {
				return false;
			} else {
				console.log(error);
			}
		}
		return false;
	}
	
	/**
	 * ディレクトリかどうか判定する
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isFile(path) {
		if(!File.isExist(path)) {
			return false;
		}
		return fs.statSync(path).isFile();
	}

	/**
	 * ディレクトリかどうか判定する
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isDirectory(path) {
		if(!File.isExist(path)) {
			return false;
		}
		return fs.statSync(path).isDirectory();
	}

	/**
	 * ファイルをコピーする
	 * @param {string} from 
	 * @param {string} to 
	 */
	static copy(from, to) {
		const bin = fs.readFileSync(from);
		fs.writeFileSync(to, bin);
	}

	/**
	 * ファイルを削除する
	 * @param {string} path 
	 */
	static deleteFile(path) {
		if(!File.isExist(path)) {
			return;
		}
		fs.unlinkSync(path);
	}

	/**
	 * フォルダを作成する
	 * @param {string} path 
	 */
	static makeDirectory(path) {
		if(File.isExist(path)) {
			return;
		}
		fs.mkdirSync(path);
	}

	/**
	 * ディレクトリ配下のファイルのリストを作成
	 * @param {string} path 
	 * @return {Array<string>}
	 */
	static createList(path) {
		const dir_path = path.replace(/[\\/]+$/, "");
		const load_list = fs.readdirSync(dir_path);
		const list = [];
		for(let i = 0; i < load_list.length; i++) {
			list[i] = dir_path + "/" + load_list[i];
		}
		for(let i = 0; i < list.length; i++) {
			if(File.isDirectory(list[i])) {
				const new_list = fs.readdirSync(list[i]);
				for(let j = 0; j < new_list.length; j++) {
					/**
					 * @type {string}
					 */
					const add_file = list[i] + "/" + new_list[j];
					list.push(add_file);
				}
			}
		}
		return list;
	}

	/**
	 * フォルダを削除する
	 * @param {string} path 
	 */
	static deleteDirectory(path) {
		if(!File.isDirectory(path)) {
			return;
		}
		{
			// まずはファイルのみを全消去
			const list = File.createList(path);
			for(let i = 0; i < list.length; i++) {
				if(File.isFile(list[i])) {
					File.deleteFile(list[i]);
				}
			}
		}
		// フォルダの中身が0のフォルダを繰り返し削除
		for(let i = 0; i < 10; i++) {
			const list = File.createList(path);
			for(let j = 0; j < list.length; j++) {
				if(File.createList(list[j]).length === 0) {
					fs.rmdirSync(list[j]);
				}
			}
		}
		// 最後に目的のフォルダを削除
		fs.rmdirSync(path);
	}

	/**
	 * 指定した条件のファイルのリストを作成
	 * @param {{source : string, destination : string, includes : Array<string>, excludes : Array<string>}} types 
	 * @return {Array<string>}
	 */
	static createTargetList(types) {
		
		const filelist = File.createList(types.source);

		/**
		 * @type {Array<string>}
		 */
		const target_list = [];

		for(const i in filelist) {
			let is_target = false;
			if(types.includes) {
				for(const j in types.includes) {
					if(new RegExp(types.includes[j]).test(filelist[i])) {
						is_target = true;
						break;
					}
				}
			}
			if(!is_target) {
				continue;
			}
			if(types.excludes) {
				for(const j in types.excludes) {
					if(new RegExp(types.excludes[j]).test(filelist[i])) {
						is_target = false;
						break;
					}
				}
			}
			if(!is_target) {
				continue;
			}
			target_list.push(filelist[i]);
		}

		return target_list;
	}

}

module.exports = File;
