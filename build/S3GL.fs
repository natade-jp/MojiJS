// 精度
precision mediump float;

// 材質
#define MATERIALS_MAX			4
uniform vec4		materialsColorAndDiffuse[MATERIALS_MAX];
uniform vec4		materialsSpecularAndPower[MATERIALS_MAX];
uniform vec3		materialsEmission[MATERIALS_MAX];
uniform vec4		materialsAmbientAndReflect[MATERIALS_MAX];
uniform vec2		materialsTextureExist[MATERIALS_MAX];
uniform sampler2D	materialsTextureColor[MATERIALS_MAX];
uniform sampler2D	materialsTextureNormal[MATERIALS_MAX];

// 頂点移動
uniform mat4 matrixWorldToLocal4;
uniform mat3 matrixLocalToWorld3;

// ライト
#define LIGHTS_MAX				4
#define LIGHT_MODE_NONE			0
#define LIGHT_MODE_AMBIENT		1
#define LIGHT_MODE_DIRECTIONAL	2
#define LIGHT_MODE_POINT		3
uniform int		lightsLength;
uniform vec4	lightsData1[LIGHTS_MAX];
uniform vec4	lightsData2[LIGHTS_MAX];

// 視線
uniform vec3 eyeWorldDirection;

// シェーダー間情報
varying float interpolationMaterialFloat;
varying vec3 interpolationNormal;
varying vec3 interpolationBinormal;
varying vec3 interpolationTangent;
varying vec3 interpolationPosition;
varying vec2 interpolationTextureCoord;

void main(void) {

	const vec4 ZERO			= vec4(0.0, 0.0, 0.0, 0.0);
	const vec4 ONE			= vec4(1.0, 1.0, 1.0, 1.0);
	const vec4 WHITE		= ONE;
	const vec3 NORMALTOP	= vec3(0.5, 0.5, 1.0);

	// 頂点シェーダーから受け取った情報
	int		vertexMaterial		= int(interpolationMaterialFloat);
	vec3	vertexNormal		= normalize(interpolationNormal);
	vec3	vertexBinormal		= normalize(interpolationBinormal);
	vec3	vertexTangent		= normalize(interpolationTangent);

	// 材質を取得
	vec3	materialColor;
	float	materialDiffuse;
	vec3	materialSpecular;
	float	materialPower;
	vec3	materialEmission;
	vec3	materialAmbient;
	float	materialReflect;
	float	materialRoughness;
	vec4	materialTextureColor;
	vec3	materialTextureNormal;
	bool	materialIsSetNormal;

	{
		if(vertexMaterial < 4) {
			if(vertexMaterial < 2) {
				if(vertexMaterial == 0) {
					materialColor			= materialsColorAndDiffuse[0].xyz;
					materialDiffuse			= materialsColorAndDiffuse[0].z;
					materialSpecular		= materialsSpecularAndPower[0].xyz;
					materialPower			= materialsSpecularAndPower[0].w;
					materialEmission		= materialsEmission[0];
					materialAmbient			= materialsAmbientAndReflect[0].xyz;
					materialReflect			= materialsAmbientAndReflect[0].w;
					materialTextureColor	= materialsTextureExist[0].x > 0.5 ?
						texture2D(materialsTextureColor[0], interpolationTextureCoord) : WHITE;
					materialIsSetNormal		= materialsTextureExist[0].y > 0.5;
					materialTextureNormal	= materialIsSetNormal ?
						texture2D(materialsTextureNormal[0], interpolationTextureCoord).xyz : NORMALTOP;
				}
				else {
					materialColor		= materialsColorAndDiffuse[1].xyz;
					materialDiffuse		= materialsColorAndDiffuse[1].z;
					materialSpecular	= materialsSpecularAndPower[1].xyz;
					materialPower		= materialsSpecularAndPower[1].w;
					materialEmission	= materialsEmission[1];
					materialAmbient		= materialsAmbientAndReflect[1].xyz;
					materialReflect		= materialsAmbientAndReflect[1].w;
					materialTextureColor	= materialsTextureExist[1].x > 0.5 ?
						texture2D(materialsTextureColor[1], interpolationTextureCoord) : WHITE;
					materialIsSetNormal		= materialsTextureExist[1].y > 0.5;
					materialTextureNormal	= materialIsSetNormal ?
						texture2D(materialsTextureNormal[1], interpolationTextureCoord).xyz : NORMALTOP;
				}
			}
			else {
				if(vertexMaterial == 2) {
					materialColor		= materialsColorAndDiffuse[2].xyz;
					materialDiffuse		= materialsColorAndDiffuse[2].z;
					materialSpecular	= materialsSpecularAndPower[2].xyz;
					materialPower		= materialsSpecularAndPower[2].w;
					materialEmission	= materialsEmission[2];
					materialAmbient		= materialsAmbientAndReflect[2].xyz;
					materialReflect		= materialsAmbientAndReflect[2].w;
					materialTextureColor	= materialsTextureExist[2].x > 0.5 ?
						texture2D(materialsTextureColor[2], interpolationTextureCoord) : WHITE;
					materialIsSetNormal		= materialsTextureExist[2].y > 0.5;
					materialTextureNormal	= materialIsSetNormal ?
						texture2D(materialsTextureNormal[2], interpolationTextureCoord).xyz : NORMALTOP;
				}
				else {
					materialColor		= materialsColorAndDiffuse[3].xyz;
					materialDiffuse		= materialsColorAndDiffuse[3].z;
					materialSpecular	= materialsSpecularAndPower[3].xyz;
					materialPower		= materialsSpecularAndPower[3].w;
					materialEmission	= materialsEmission[3];
					materialAmbient		= materialsAmbientAndReflect[3].xyz;
					materialReflect		= materialsAmbientAndReflect[3].w;
					materialTextureColor	= materialsTextureExist[3].x > 0.5 ?
						texture2D(materialsTextureColor[3], interpolationTextureCoord) : WHITE;
					materialIsSetNormal		= materialsTextureExist[3].y > 0.5;
					materialTextureNormal	= materialIsSetNormal ?
						texture2D(materialsTextureNormal[3], interpolationTextureCoord).xyz : NORMALTOP;
				}
			}
		}
		// ラフネス値(0...1)を暫定計算(大きいほどざらざらしている)
		materialRoughness = (100.0 - materialPower) * 0.01;
	}

	{
		// カラーテクスチャ反映
		materialColor *= materialTextureColor.xyz;
		
		// ノーマルテクスチャ反映
		if(materialIsSetNormal) {
			materialTextureNormal = (materialTextureNormal * 2.0 - 1.0);
			vertexNormal = normalize(
				-materialTextureNormal.x * vertexTangent +
				materialTextureNormal.y * vertexBinormal +
				materialTextureNormal.z * vertexNormal);
		}
	}

	// 反射ベクトル
	vec3	vertexReflectVector	= reflect( eyeWorldDirection, normalize(matrixLocalToWorld3 * vertexNormal) );

	// カメラが向いている方向を取得
	vec3	eyeDirection = normalize(matrixWorldToLocal4 * vec4(eyeWorldDirection, 0.0)).xyz;
	
	// 物質の色の初期値
	vec3	destDiffuse		= materialColor * materialEmission;
	vec3	destSpecular	= ZERO.xyz;
	vec3	destAmbient		= materialAmbient * 0.2;
	
	// 光の色の平均
	vec3	averageLightsColor = ZERO.xyz;
	
	// 光による物体の色を計算
	{
		for(int i = 0; i < LIGHTS_MAX; i++) {
			// データを取り出す
			int		lightMode	= int(lightsData1[i].x);
			float	lightRange	= lightsData1[i].y;
			vec3	lightVector	= vec3(lightsData1[i].zw, lightsData2[i].x);
			vec3	lightColor	= lightsData2[i].yzw;
			// 平行光源か点光源
			if((lightMode == LIGHT_MODE_DIRECTIONAL)||(lightMode == LIGHT_MODE_POINT)) {
				bool is_direction = lightMode == LIGHT_MODE_DIRECTIONAL;
				// 光源の種類によって、ピクセルと光への方向ベクトルの計算を変える
				// lightsVector は、点光源なら位置を、平行光源なら方向を指す値
				vec3 lightDirection = is_direction ?
					normalize(matrixWorldToLocal4 * vec4(lightVector, 0.0)).xyz :
					normalize(matrixWorldToLocal4 * vec4(interpolationPosition - lightVector, 1.0)).xyz;
				float d = is_direction ? -1.0 : length(lightVector - interpolationPosition);
				if(d < lightRange) {
					// 点光源の場合は遠いほど暗くする
					float rate = is_direction ? 1.0 : pow(1.0 - (d / lightRange), 0.5);
					// 拡散反射
					float diffuse	= clamp(((dot(vertexNormal, lightDirection) * 0.9) + 0.1) * materialDiffuse, 0.0, 1.0);
					destDiffuse		+= lightColor * materialColor.xyz * diffuse * rate;
					// 鏡面反射
					vec3  halfLightEye	= normalize(lightDirection + eyeDirection);
					float specular = pow(clamp(dot(vertexNormal, halfLightEye), 0.0, 1.0), materialPower);
					destSpecular	+= lightColor * materialSpecular.xyz * specular * rate;
				}
			}
			// アンビエント光
			else if(lightMode == LIGHT_MODE_AMBIENT) {
				destDiffuse		+= lightColor * materialColor.xyz;
				destAmbient		+= lightColor * materialAmbient.xyz;
			}
			// 光の色の平均
			averageLightsColor += lightColor;
			// 光の数を繰り返したら終了
			if(i == lightsLength) {
				break;
			}
		}
		if(0 < lightsLength) {
			averageLightsColor /= vec3(lightsLength, lightsLength, lightsLength);
		}
	}
	
	// 最終的な色を計算
	vec3 destColor = ZERO.xyz;
	
	{
		// アンビエント光
		destColor += destAmbient;
		
		// 拡散反射(ただし反射が大きいほど、拡散反射は弱くなるとする)
		destColor += clamp(destDiffuse * (1.0 - materialReflect * 0.8), 0.0, 1.0);
		
		// 鏡面反射
		destColor += destSpecular;
		
		// 周囲の反射
		if(materialReflect > 0.0001) {
			// 周囲の模様を作る
			//　ラフネスが大きいほどぼんやりしている
			float x = vertexReflectVector.y;
			float x1 = mix(-0.1, -0.5, materialRoughness);
			float x2 = mix(0.01,  0.5, materialRoughness);
			float c1 = mix(-0.3,  0.5, materialRoughness);
			float c2 = mix( 0.9,  0.6, materialRoughness);
			float c3 = mix( 0.3,  0.4, materialRoughness);
			float c4 = mix( 1.2,  0.8, materialRoughness);
			float c5 = mix( 0.3,  0.5, materialRoughness);
			x = x < x1	?	mix( c1, c2,	(x + 1.0)	* (1.0 / (1.0 + x1)))	:
				x < 0.0 ?	mix( c2, c3,	(x - x1)	* (1.0 / -x1))			:
				x < x2	?	mix( c3, c4,	x			* (1.0 / x2))			:
							mix( c4, c5,	(x - x2)	* (1.0 / (1.0 - x2)))	;
			// 映り込む模様
			//  リフレクトが大きいほどはっきり強くうつりこむ
			//  映り込む模様は、周りの光の色に影響する
			vec3 reflectColor = vec3(x, x, x) * materialReflect * averageLightsColor;
			// 映り込む模様の色
			//  ラフネスが大きいほど、物体の色で映り込む
			//  ラフネスが小さいほど、スペキュラの色で映り込む
			reflectColor *= materialRoughness * materialColor + (1.0 - materialRoughness) * materialSpecular;
			destColor += reflectColor;
		}
	}
	
	gl_FragColor = vec4(destColor, 1.0);
}
