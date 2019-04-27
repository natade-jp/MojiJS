import Senko from "../../libs/Senko.mjs";
import S3 from "../../libs/SenkoS3.mjs";

const SComponent = Senko.SComponent;
const Device = Senko.Device;
const Log = Senko.Log;

const testMath = function() {
	
	Log.println("Math のサンプル");
	
	const m4 = new S3.Matrix(
		3, -2, -6, 4,
		-7, -6, 8, 21,
		-4, -7, 9, 11,
		2, -3, -5, 8
	);
	
	Log.println("行列を作成");
	Log.println(m4);
	
	Log.println("4x4行列の行列式");
	Log.println(m4.det4());
	
	Log.println("4x4行列の逆行列");
	Log.println(m4.inverse4());
	
	Log.println("行列の掛け算");
	Log.println(m4.mul(m4));
	
	const m3 = new S3.Matrix(
		1, 2, 1,
		2, 1, 0,
		1, 1, 2
	);
	
	Log.println("3x3行列の行列式");
	Log.println(m3.det3());
	
	Log.println("3x3行列の逆行列");
	Log.println(m3.inverse3());
	
};


const main = function(args) {
	
	testMath();

	Log.println("S3 クラスのサンプル");
	
	// 縦スクロール防止
	Device.Tools.noScroll();
	
	// パネルを作って、指定した ID の要素内に入れる。
	const panel = new SComponent.Canvas();
	panel.putMe("scomponent", SComponent.PUT_TYPE.IN);
	panel.setUnit(SComponent.UNIT_TYPE.PX);
	panel.setPixelSize(640, 480);
	panel.setSize(640, 480);
	
	{
		const canvas = panel.getCanvas();
		
		const sys = new S3.System();
		const controller = new S3.CameraController();
		const camera = sys.createCamera();

		sys.setCanvas(canvas);
		controller.setCanvas(canvas);

		sys.setSystemMode(S3.SYSTEM_MODE.OPEN_GL);
		// s3.setSystemMode(S3.SYSTEM_MODE.DIRECT_X);

		Log.println("json形式での読み書きのテスト");
		const meshdata = {
			Indexes:{
				body:[
					[ 0, 1, 2],
					[ 3, 1, 0],
					[ 3, 0, 2],
					[ 3, 2, 1]
				]
			},
			Vertices:[
				[  0,  0,  -5],
				[  0, 20,  -5],
				[ 10,  0,  -5],
				[  0,  0, -20]
			]
		};
		let mesh;
		Log.println(".json");
		mesh = S3.MeshLoader.inputData(sys, meshdata, S3.MESH_TYPE.JSON);
		Log.println(S3.MeshLoader.outputData(mesh, S3.MESH_TYPE.JSON));

		Log.println("MQOでの出力テスト");
		Log.println(".mqo");
		Log.println(S3.MeshLoader.outputData(mesh, S3.MESH_TYPE.MQO));

		Log.println("MQOでの入力テスト");
		mesh = S3.MeshLoader.inputData(sys, "../resource/teapot.mqo", S3.MESH_TYPE.MQO);

		const model = sys.createModel();
		model.setMesh(mesh);
		model.setScale(5);

		camera.setEye(new S3.Vector( 20,  30,  50));
		camera.setCenter(new S3.Vector( 0,  0,  0));
		controller.setCamera(camera);

		const scene = sys.createScene();
		scene.setCamera(camera);
		scene.addModel(model);

		const redraw = function() {
			scene.setCamera(controller.getCamera());
			sys.clear();
			model.addRotateY(3);
			sys.drawAxis(scene);
			sys.drawScene(scene);
		};

		console.log(model);

		//setTimeout(redraw, 50);
		setInterval(redraw, 50);
	}
};

main();

