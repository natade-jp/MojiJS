/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

const IDTools = {
	
	/**
	 * 縦のスクロールバーを削除
	 */
	noScroll : function() {
		// 縦のスクロールバーを削除
		const main = function() {
			// body
			document.body.style.height			= "100%";
			document.body.style.overflow		= "hidden";
			// html
			document.documentElement.height		= "100%";
			document.documentElement.overflow	= "hidden";
		};
		window.addEventListener("load", main, false);
	}
	
};

export default IDTools;