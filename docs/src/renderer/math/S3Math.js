﻿/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

const S3Math =  {
	EPSILON: 2.2204460492503130808472633361816E-8,
	
	clamp: function(x, min, max) {
		return (x < min) ? min : (x > max) ? max : x;
	},
	
	step: function(edge, x) {
		return edge > x ? 1 : 0;
	},
	
	mix: function(v0, v1, x) {
		return v0 + (v1 - v0) * x;
	},
	
	smoothstep: function(v0, v1, x) {
		const s = x * x * (3.0 - 2.0 * x);
		return v0 + (v1 - v0) * s;
	},
	
	equals: function(x1, x2) {
		return Math.abs(x1 - x2) < S3Math.EPSILON;
	},
	
	mod: function(x, y) {
		return x - y * parseInt(x / y);
	},
	
	sign: function(x) {
		return x >= 0.0 ? 1.0 : -1.0;
	},
	
	fract: function(x) {
		return x - Math.floor(x);
	},
	
	rsqrt: function(x) {
		return Math.sqrt(1.0 / x);
	},
	
	radius: function(degree) {
		return (degree / 360.0) * (2.0 * Math.PI);
	},
	
	degrees: function(rad) {
		return rad / (2.0 * Math.PI) * 360.0;
	}
};

export default S3Math;
