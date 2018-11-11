/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3Vector from "../math/S3Vector.js";

export default class S3Light {
	
	constructor() {
		this.init();
	}
	
	init() {
		this.mode		= S3Light.MODE.DIRECTIONAL_LIGHT;
		this.power		= 1.0;
		this.range		= 1000.0;
		this.position	= new S3Vector(0.0, 0.0, 0.0);
		this.direction	= new S3Vector(0.0, 0.0, -1.0);
		this.color		= new S3Vector(1.0, 1.0, 1.0);
	}
	
	clone(Instance) {
		if(!Instance) {
			Instance = S3Light;
		}
		const light = new Instance();
		light.mode		= this.mode;
		light.power		= this.power;
		light.range		= this.range;
		light.position	= this.position;
		light.direction	= this.direction;
		light.color		= this.color;
		return light;
	}
	
	setMode(mode) {
		this.mode = mode;
	}
	
	setPower(power) {
		this.power = power;
	}
	
	setRange(range) {
		this.range = range;
	}
	
	setPosition(position) {
		this.position = position;
	}
	
	setDirection(direction) {
		this.direction = direction;
	}
	
	setColor(color) {
		this.color = color;
	}
}

S3Light.MODE = {
	NONE				: 0,
	AMBIENT_LIGHT		: 1,
	DIRECTIONAL_LIGHT	: 2,
	POINT_LIGHT			: 3
};
