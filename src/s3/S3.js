/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3System from "./basic/S3System.js";
import S3Light from "./basic/S3Light.js";
import S3GLSystem from "./gl/S3GLSystem.js";
import S3MeshLoader from "./loader/S3MeshLoader.js";
import S3Math from "./math/S3Math.js";
import S3Angles from "./math/S3Angles.js";
import S3Vector from "./math/S3Vector.js";
import S3Matrix from "./math/S3Matrix.js";
import S3Plane from "./math/S3Plane.js";
import CameraController from "./tools/CameraController.js";

const S3 = {
	
	System : S3System,
	GLSystem : S3GLSystem,
	Math : S3Math,
	Angles : S3Angles,
	Vector : S3Vector,
	Matrix : S3Matrix,
	Plane : S3Plane,

	SYSTEM_MODE : S3System.SYSTEM_MODE,
	DEPTH_MODE : S3System.DEPTH_MODE,
	DIMENSION_MODE : S3System.DIMENSION_MODE,
	VECTOR_MODE : S3System.VECTOR_MODE,
	FRONT_FACE : S3System.FRONT_FACE,
	CULL_MODE : S3System.CULL_MODE,
	LIGHT_MODE : S3Light.MODE,
	MESH_TYPE : S3MeshLoader.TYPE,
	
	MeshLoader : S3MeshLoader,
	CameraController : CameraController,
	
};

export default S3;
