import Senko from "../../build/Senko.js";

const SComponent = Senko.SComponent;
const Device = Senko.Device;
const S3 = Senko.S3;

class S3DGLTest {

	constructor() {
		this.s3			= new S3.GLSystem();
		this.controller	= new S3.CameraController();
		this.camera		= null;
		this.mesh		= null;
		this.model		= null;
	}

	initCanvas(canvas) {
		const s3 = this.s3;
		s3.setBackgroundColor(new S3.Vector(0, 0, 0));
		s3.setCanvas(canvas);
		this.controller.setCanvas(canvas);
		this.camera	= s3.createCamera();
		const program = s3.createProgram();
		program.setFragmentShader("../../src/renderer/gl/S3GL.fs");
		program.setVertexShader("../../src/renderer/gl/S3GL.vs");
		s3.setProgram(program);
		s3.setSystemMode(S3.SYSTEM_MODE.OPEN_GL);
		s3.setFrontMode(S3.FRONT_FACE.CLOCKWISE);
		this.camera.setEye(new S3.Vector( 20,  30,  50));
		this.camera.setCenter(new S3.Vector( 0,  0,  0));
		this.controller.setCamera(this.camera);
	}

	clearModel() {
		if(this.model) {
			this.model = null;
		}
		if(this.mesh) {
			this.mesh.disposeGLData();
			this.mesh = null;
		}
	}

	setModel(url) {
		const s3 = this.s3;
		const newmodel = s3.createModel();
		const newmesh = S3.MeshLoader.inputData(s3, url, S3.MESH_TYPE.MQO);
		newmodel.setMesh(newmesh);
		this.clearModel();
		this.model = newmodel;
		this.mesh = newmesh;
	}

	draw() {
		const s3 = this.s3;
		
		const scene = s3.createScene();
		scene.setCamera(this.controller.getCamera());
		if(this.model !== null) {
			scene.addModel(this.model);
			this.model.setScale(5);
			this.model.addRotateY(3);
		}
		
		const light_down = s3.createLight();
		light_down.setMode(S3.LIGHT_MODE.DIRECTIONAL_LIGHT);
		light_down.setColor(new S3.Vector( 0.6,  0.6,  1.0));
		light_down.setDirection(new S3.Vector( 0,  -1,  0));
		scene.addLight(light_down);

		const light_ambient = s3.createLight();
		light_ambient.setMode(S3.LIGHT_MODE.AMBIENT_LIGHT);
		light_ambient.setColor(new S3.Vector( 0.0,  0.1,  0.05));
		scene.addLight(light_ambient);

		const light_point = s3.createLight();
		light_point.setMode(S3.LIGHT_MODE.POINT_LIGHT);
		light_point.setColor(new S3.Vector( 0.9,  0.9,  1.0));
		light_point.setPosition(new S3.Vector( 100,  0,  0));
		light_point.setRange(200);
		scene.addLight(light_point);

		s3.clear();
		s3.drawScene(scene);
	}

}

const gl = new S3DGLTest();

const createWebGLPanel2 = function() {
	
	const panel = new SComponent.Canvas();
	panel.putMe("webglpanel", SComponent.PUT_TYPE.IN);
	panel.setUnit(SComponent.UNIT_TYPE.PX);
	panel.setPixelSize(1280, 720);
	
	const canvas = panel.getCanvas();
	
	gl.initCanvas(canvas);
	gl.setModel("../resource/teapot.mqo");
	
	const redraw = function() {
		gl.draw();
	};

	//setTimeout(redraw, 50);
	setInterval(redraw, 50);
};

const createOperationPanel = function() {
	
	const filepanel = new SComponent.Panel("ファイル");
	filepanel.putMe("operationpanel", SComponent.PUT_TYPE.IN);
	
	const filebox = new SComponent.ComboBox(
		[	"../resource/teapot.mqo",
			"../resource/bumptest.mqo"
		]);
	filebox.putMe(filepanel, SComponent.PUT_TYPE.IN);
	
	const loadbutton = new SComponent.Button("load");
	loadbutton.putMe(filebox, SComponent.PUT_TYPE.NEWLINE);
	loadbutton.addListener(function () {
		const filename = filebox.getSelectedItem();
		Senko.println(filename);
		gl.setModel(filename);
	});
};

const main = function() {
	
	Senko.println("S3DGL クラスのサンプル");
	
	// 縦スクロール防止
	Device.Tools.noScroll();
	
	createWebGLPanel2();
	createOperationPanel();
};

main();