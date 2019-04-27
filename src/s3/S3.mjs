/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3System from "./basic/S3System.mjs";
import S3Light from "./basic/S3Light.mjs";
import S3GLSystem from "./gl/S3GLSystem.mjs";
import S3MeshLoader from "./loader/S3MeshLoader.mjs";
import S3Math from "./math/S3Math.mjs";
import S3Angles from "./math/S3Angles.mjs";
import S3Vector from "./math/S3Vector.mjs";
import S3Matrix from "./math/S3Matrix.mjs";
import S3Plane from "./math/S3Plane.mjs";
import CameraController from "./tools/CameraController.mjs";

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
