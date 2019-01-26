/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Camera from "./S3Camera.js";

export default class S3Scene {
	
	/**
	 * 描写するときのシーン (mutable)
	 * @returns {S3Scene}
	 */
	constructor() {
		this._init();
	}
	
	_init() {
		this.camera		= new S3Camera();
		this.model		= [];
		this.light		= [];
	}
	
	empty() {
		this.model		= [];
		this.light		= [];
	}
	
	setCamera(camera) {
		this.camera = camera.clone();
	}
	
	addModel(model) {
		this.model[this.model.length] = model;
	}
	
	addLight(light) {
		this.light[this.light.length] = light;
	}
	
	getCamera() {
		return this.camera;
	}
	
	getModels() {
		return this.model;
	}
	
	getLights() {
		return this.light;
	}
}
