/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import Color from "../../basic/Color.js";
import SBase from "./SBase.js";

export default class SColorPicker extends SBase {
	
	constructor() {
		
		super("div");
		this.addClass(SBase.CLASS_NAME.COLORPICKER);
		
		const element	= this.getElement();
		const that = this;
		const hls = {
			H : {
				div : document.createElement("div"),
				split : 6,
				value : 0.0,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			},
			S : {
				div : document.createElement("div"),
				split : 1,
				value : 0.5,
				input : null,
				gauge : null,
				color_data	: [],
				color_node	: [],
				is_press : false
			},
			L :	{
				div : document.createElement("div"),
				split : 2,
				value : 0.5,
				input : null,
				gauge : null,
				color_data : [],
				color_node : [],
				is_press : false
			}
		};

		for(let i = 0; i <= hls.H.split; i++) {
			const x = 1.0 / hls.H.split * i;
			hls.H.color_data.push(Color.newColorNormalizedHSL([x, 1.0, 0.5]).getCSSHex());
		}

		// イベントをどこで発生させたか分かるように、
		// 関数を戻り値としてもどし、戻り値として戻した関数を
		// イベント発生時に呼び出すようにしています。

		// 押したときにマウスの位置を取得して更新する
		const pushevent = function(name) {
			return function(event) {
				if(event.length) event = event[0];
				if(hls[name].is_press) {
					let node = event.target;
					node = node ? node : event.currentTarget;
					hls[name].value = event.offsetX / node.clientWidth;
					that.redraw();
				}
			};
		};

		// 押した・離したの管理
		const pressevent = function(name, is_press) {
			return function(event) {
				if(event.length) event = event[0];
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].is_press = is_press;
				if(is_press) {
					pushevent(name)(event);
				}
			};
		};

		// インプットボックスの変更
		const inputevent = function(name) {
			return function(event) {
				// イベントが発生したノードの取得
				let node = event.target;
				node = node ? node : event.currentTarget;
				hls[name].value = node.value / 100.0;
				that.redraw();
			};
		};

		// 内部のカラーバーを作成
		const createSelectBar = function(target, name) {
			const element_cover	= document.createElement("div");	// クリック検出
			const element_gauge	= document.createElement("div");	// ゲージ表示用
			const element_gradient= document.createElement("div");	// グラデーション作成用

			// レイヤーの初期設定
			target.style.position			= "relative";
			element_cover.style.position	= "absolute";
			element_gauge.style.position	= "absolute";
			element_gradient.style.position	= "absolute";
			element_cover.style.margin		= "0px";
			element_cover.style.padding		= "0px";
			element_gauge.style.margin		= "0px";
			element_gauge.style.padding		= "0px";
			element_gradient.style.margin	= "0px";
			element_gradient.style.padding	= "0px";

			// 上にかぶせるカバー
			element_cover.addEventListener("mousedown"	, pressevent(name, true), false);
			element_cover.addEventListener("mouseup"	, pressevent(name, false), false);
			element_cover.addEventListener("mouseout"	, pressevent(name, false), false);
			element_cover.addEventListener("mousemove"	, pushevent(name), false);
			element_cover.addEventListener("touchstart"	, pressevent(name, true), false);
			element_cover.addEventListener("touchend"	, pressevent(name, false), false);
			element_cover.addEventListener("touchcancel", pressevent(name, false), false);
			element_cover.dataset.name	= name;
			element_cover.style.width			= "100%";
			element_cover.style.height			= "100%";
			element_cover.style.bottom			= "0px";

			// ゲージ（横幅で｜を表す）
			element_gauge.style.width			= "33%";
			element_gauge.style.height			= "100%";
			element_gauge.style.bottom			= "0px";
			element_gauge.style.borderStyle		= "ridge";
			element_gauge.style.borderWidth		= "0px 2px 0px 0px";
			hls[name].gauge = element_gauge;

			// グラデーション部分
			const split = hls[name].split;
			element_gradient.style.width			= "100%";
			element_gradient.style.height			= "100%";
			element_gradient.style.overflow		= "hidden";
			for(let i = 0; i < split; i++) {
				const element_color = document.createElement("div");
				element_color.style.display		= "inline-block";
				element_color.style.margin		= "0px";
				element_color.style.padding		= "0px";
				element_color.style.height		= "100%";
				element_color.style.width		= 100.0 / split + "%";
				element_color.style.background	= "linear-gradient(to right, #000, #FFF)";
				hls[name].color_node.push(element_color);
				element_gradient.appendChild(element_color);
			}

			// 3つのレイヤーを結合
			target.appendChild(element_gradient);
			target.appendChild(element_gauge);
			target.appendChild(element_cover);
		};

		// 1行を作成
		const createColorBar = function(name) {
			const element_text		= document.createElement("span");
			const element_colorbar	= document.createElement("div");
			const element_inputbox	= document.createElement("input");

			// 位置の基本設定
			element_text.style.display		= "inline-block";
			element_colorbar.style.display	= "inline-block";
			element_inputbox.style.display	= "inline-block";
			element_text.style.verticalAlign		= "top";
			element_colorbar.style.verticalAlign	= "top";
			element_inputbox.style.verticalAlign	= "top";
			element_text.style.height		= "100%";
			element_colorbar.style.height	= "100%";
			element_inputbox.style.height	= "100%";

			// 文字
			element_text.style.margin		= "0px";
			element_text.style.padding		= "0px";
			element_text.style.textAlign	= "center";

			// 中央のバー
			element_colorbar.style.margin	= "0px 0.5em 0px 0.5em";
			element_colorbar.style.padding	= "0px";
			element_colorbar.style.borderStyle	= "solid";
			element_colorbar.style.borderWidth	= "1px";

			// 入力ボックス
			element_inputbox.addEventListener("input", inputevent(name), false);
			element_inputbox.type = "number";
			element_inputbox.style.margin	= "0px";
			element_inputbox.style.padding	= "0px";
			element_inputbox.style.borderStyle	= "none";
			element_inputbox.min = 0.0;
			element_inputbox.max = 100.0;
			element_inputbox.step = 1.0;
			hls[name].input = element_inputbox;

			// 横幅調整
			element_text.style.width		= "1.5em";
			element_colorbar.style.width	= "calc(100% - 6.0em)";
			element_inputbox.style.width	= "3.5em";

			// バーの内部を作成
			createSelectBar(element_colorbar, name);

			// バーのサイズ調整
			const target = hls[name].div;
			target.style.height				= "1.2em";
			target.style.margin				= "0.5em 0px 0.5em 0px";

			element_text.appendChild(document.createTextNode(name));
			target.appendChild(element_text);
			target.appendChild(element_colorbar);
			target.appendChild(element_inputbox);
		};

		// HSLの3つを作成する
		for(const key in hls) {
			createColorBar(key);
		}

		this.hls = hls;
		this.listener = [];

		// Elementを更新後にくっつける
		this.redraw();
		element.appendChild(this.hls.H.div);
		element.appendChild(this.hls.S.div);
		element.appendChild(this.hls.L.div);
	}
	
	setColor(color) {
		if(!(color instanceof Color)) {
			throw "ArithmeticException";
		}
		const hls = this.hls;
		const c = color.getNormalizedHSL();
		hls.H.value = c.h;
		hls.S.value = c.s; 
		hls.L.value = c.l; 
		this.redraw();
	}
	
	getColor() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		return Color.newColorNormalizedHSL([h, s, l]);
	}
	
	redraw() {
		const hls = this.hls;
		const h = hls.H.value;
		const s = hls.S.value;
		const l = hls.L.value;
		hls.S.color_data = [
			Color.newColorNormalizedHSL([h, 0.0, l]).getCSSHex(),
			Color.newColorNormalizedHSL([h, 1.0, l]).getCSSHex()
		];
		hls.L.color_data = [
			Color.newColorNormalizedHSL([h, s, 0.0]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 0.5]).getCSSHex(),
			Color.newColorNormalizedHSL([h, s, 1.0]).getCSSHex()
		];
		for(const key in hls) {
			const data = hls[key].color_data;
			const node = hls[key].color_node;
			for(let i = 0; i < node.length; i++) {
				node[i].style.background = "linear-gradient(to right, " + data[i] + ", " + data[i + 1] + ")";
			}
			const value = Math.round(100.0 * hls[key].value);
			hls[key].gauge.style.width = value + "%";
			hls[key].input.value = value;
		}
		for(let i = 0;i < this.listener.length; i++) {
			this.listener[i]();
		}
	}

	addListener(func) {
		this.listener.push(func);
	}
	
}
