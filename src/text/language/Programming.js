/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class Programming {

	/**
	 * コメントを除去します。
	 * @param {String} text 変換したいテキスト
	 * @returns {String} 変換後のテキスト
	 */
	static removeComment(text) {
		let istextA  = false;
		let isescape = false;
		let commentA1 = false;
		let commentA2 = false;
		let commentB2 = false;
		let commentB3 = false;
		const output = [];

		for(let i = 0;i < text.length;i++) {
			const character = text.charAt(i);

			//文字列（ダブルクォーテーション）は除去しない
			if(istextA) {
				if(isescape) {
					isescape = false;
				}
				else if(character === "\\") {
					isescape = true;
				}
				else if(character === "\"") {
					istextA = false;
				}
				output[output.length] = character;
				continue;
			}

			//複数行コメント
			if(commentB2) {
				//前回複数行コメントが終了の可能性があった場合
				if(commentB3){
					commentB3 = false;
					//コメント終了
					if(character === "/") {
						commentB2 = false;
					}
				}
				//ここにelseをつけると、**/ が抜ける
				if(character === "*") {
					commentB3 = true;
				}
				else if(character === "\n"){
					output[output.length] = character;
				}
				continue;
			}

			//１行コメントである
			if(commentA2) {
				//改行でコメント修了
				if(character === "\n"){
					commentA2 = false;
					output[output.length] = character;
				}
				continue;
			}

			//前回コメントの開始点だと思われている場合
			if(commentA1){
				commentA1 = false;
				//1行コメントの場合
				if(character === "/") {
					commentA2 = true;
					output[output.length - 1] = "";
					continue;
				}
				//複数行コメントの場合
				else if(character === "*") {
					commentB2 = true;
					output[output.length - 1] = "";
					continue;
				}
			}

			//文字列開始点
			if(character === "\"") {
				istextA = true;
			}
			//コメントの開始点だと追われる場合
			if(character === "/") {
				commentA1 = true;
			}
			output[output.length] = character;
		}
		return (output.join(""));
	}
	
}
