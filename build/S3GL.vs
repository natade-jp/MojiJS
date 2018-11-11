// 配列で渡す情報
attribute vec3 vertexNormal;
attribute vec3 vertexBinormal;
attribute vec3 vertexTangent;
attribute vec3 vertexPosition;
attribute vec2 vertexTextureCoord;
attribute float vertexMaterialFloat;

// 頂点移動
uniform mat4 matrixLocalToPerspective4;
uniform mat4 matrixLocalToWorld4;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;
varying vec3 interpolationBinormal;
varying vec3 interpolationTangent;
varying vec3 interpolationPosition;
varying vec2 interpolationTextureCoord;

void main(void) {
	
	interpolationMaterialFloat	= vertexMaterialFloat;
	interpolationNormal			= vertexNormal;
	interpolationBinormal		= vertexBinormal;
	interpolationTangent		= vertexTangent;
	interpolationPosition		= (matrixLocalToWorld4 * vec4(vertexPosition, 1.0)).xyz;
	interpolationTextureCoord	= vertexTextureCoord;
	gl_Position = matrixLocalToPerspective4 * vec4(vertexPosition, 1.0);
}