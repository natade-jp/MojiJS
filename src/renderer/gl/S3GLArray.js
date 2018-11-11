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
import S3Matrix from "../math/S3Matrix.js";

export default class S3GLArray {
	
	/**
	 * WebGL用の配列 (immutable)
	 * @param {Object} data 数値／配列／S3Vector/S3Matrix
	 * @param {Number} dimension 例えば3次元のベクトルなら、3
	 * @param {S3GLArray.datatype} datatype
	 * @returns {S3GLArray}
	 */
	constructor(data, dimension, datatype) {
		// 引数の情報(S3GLArray.datatype.instance)を用いて、
		// JS用配列を、WEBGL用配列に変換して保存する
		if(data instanceof datatype.instance) {
			this.data	= data;
		}
		else if((data instanceof S3Vector) || (data instanceof S3Matrix)) {
			this.data	= data.toInstanceArray(datatype.instance, dimension);
		}
		else if(data instanceof Array) {
			this.data	= new datatype.instance(data);
		}
		else if(!isNaN(data)) {
			this.data	= new datatype.instance([data]);
		}
		else {
			throw "IllegalArgumentException";
		}
		this.dimension	= dimension;
		this.datatype	= datatype;
		
		let instance = "";
		if(data instanceof S3Vector) {
			instance = "S3Vector";
		}
		else if(data instanceof S3Matrix) {
			instance = "S3Matrix";
		}
		else {
			instance = "Number";
		}
		this.glsltype = S3GLArray.gltypetable[datatype.name][instance][dimension];
	}
	
}

// Int32Array を一応定義してあるが、整数型は補間できないため、Attributeには使用できない。
S3GLArray.datatype = {
	"Float32Array"	: {
		instance	: Float32Array,
		name	: "Float32Array"
	},
	"Int32Array"	: {
		instance	: Int32Array,
		name	: "Int32Array"
	}
};

S3GLArray.gltypetable = {
	"Float32Array"	: {
		"Number"	:	{
			1	:	"float",
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Vector"	:	{
			2	:	"vec2",
			3	:	"vec3",
			4	:	"vec4"
		},
		"S3Matrix"	:	{
			4	:	"mat2",
			9	:	"mat3",
			16	:	"mat4"
		}
	},
	"Int32Array"	: {
		"Number"	:	{
			1	:	"int",
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		},
		"S3Vector"	:	{
			2	:	"ivec2",
			3	:	"ivec3",
			4	:	"ivec4"
		}
	}
};
