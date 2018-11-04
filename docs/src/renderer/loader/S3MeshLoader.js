/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The zlib/libpng License https://opensource.org/licenses/Zlib
 */

import S3MeshLoaderJSON from "./S3MeshLoaderJSON.js";
import S3MeshLoaderMQO from "./S3MeshLoaderMQO.js";
import S3MeshLoaderOBJ from "./S3MeshLoaderOBJ.js";

const S3MeshLoader = {

	// 他のファイルの読み書きの拡張用
	inputData: function(s3system, data, type) {
		const s3mesh = s3system.createMesh();
		const load = function(ldata, ltype, url) {
			s3mesh._init();
			const isLoad = S3MeshLoader._DATA_INPUT_FUNCTION[ltype](s3system, s3mesh, ldata, url);
			s3mesh.setComplete(isLoad);
		};
		if(((typeof data === "string")||(data instanceof String))&&((data.indexOf("\n") === -1))) {
			// 1行の場合はURLとみなす（雑）
			const downloadCallback = function(text) {
				load(text, type, data);
			};
			s3system._download(data, downloadCallback);
		}
		else {
			load(data, type, "");
		}
		return s3mesh;
	},
	
	outputData: function(s3mesh, type) {
		return S3MeshLoader._DATA_OUTPUT_FUNCTION[type](s3mesh);
	}

};

S3MeshLoader.TYPE = {
	JSON : S3MeshLoaderJSON.name,
	MQO : S3MeshLoaderMQO.name,
	OBJ : S3MeshLoaderOBJ.name
};

S3MeshLoader._DATA_INPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION	= {};
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderJSON.name] = S3MeshLoaderJSON.input;
S3MeshLoader._DATA_OUTPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.output;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderMQO.name] = S3MeshLoaderMQO.input;
S3MeshLoader._DATA_INPUT_FUNCTION[S3MeshLoaderOBJ.name] = S3MeshLoaderOBJ.input;

export default S3MeshLoader;
