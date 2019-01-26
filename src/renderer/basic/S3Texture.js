/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

export default class S3Texture {
	
	constructor(s3system, data) {
		this.sys	= s3system;
		this._init();
		if(data !== undefined) {
			this.setImage(data);
		}
	}
	
	_init() {
		this.url			= null;
		this.image			= null;
		this.is_loadimage	= false;
		this.is_dispose		= false;
	}
	
	dispose() {
		if(!this.is_dispose) {
			this.is_dispose = true;
		}
	}
	
	setImage(image) {
		if((image === null) || this.is_dispose){
			return;
		}
		if(	(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement)) {
			const original_width  = image.width;
			const original_height = image.height;
			const ceil_power_of_2 = function(x) {
				// IE には Math.log2 がない
				const a = Math.log(x) / Math.log(2);
				if ((a - Math.floor(a)) < 1e-10) {
					return x;
				}
				else {
					return 1 << Math.ceil(a);
				}
			};
			const ceil_width  = ceil_power_of_2(original_width);
			const ceil_height = ceil_power_of_2(original_height);
			if((original_width !== ceil_width) || (original_height !== ceil_height)) {
				// 2の累乗ではない場合は、2の累乗のサイズに変換
				const ceil_image = document.createElement("canvas");
				ceil_image.width	= ceil_width;
				ceil_image.height	= ceil_height;
				ceil_image.getContext("2d").drawImage(
					image,
					0, 0, original_width, original_height,
					0, 0, ceil_width, ceil_height
				);
				image = ceil_image;
			} 
		}
		if(	(image instanceof ImageData) ||
			(image instanceof HTMLImageElement) ||
			(image instanceof HTMLCanvasElement) ||
			(image instanceof HTMLVideoElement)) {
			if(this.url === null) {
				// 直接設定した場合はIDをURLとして設定する
				this.url		= this.sys._createID();
			}
			this.image			= image;
			this.is_loadimage	= true;
			return;
		}
		else if((typeof image === "string")||(image instanceof String)) {
			this.url = image;
			const that = this;
			this.sys._download(this.url, function (image){
				that.setImage(image);
			});
			return;
		}
		else {
			console.log("not setImage");
			console.log(image);
		}
	}

}
