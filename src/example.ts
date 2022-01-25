import {Poly} from '@polygonjs/polygonjs/dist/src/engine/Poly';
import {PolyScene} from '@polygonjs/polygonjs/dist/src/engine/scene/PolyScene';
import {ExtendedGeoObjNode} from './engine/nodes/obj/ExtendedGeo';
// register all nodes
import {AllRegister} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/All';
AllRegister.run();
// register nodes for this plugin
import {polyPluginMediapipeFacemesh} from './index';
import {MaterialsNetworkSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/MaterialsNetwork';
import {MeshPhysicalBuilderMatNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/mat/MeshPhysicalBuilder';
import {ParamType} from '@polygonjs/polygonjs/dist/src/engine/poly/ParamType';
import {MediapipeFacemeshDeformSopNode} from './engine/nodes/sop/MediapipeFacemeshDeform';
Poly.registerPlugin(polyPluginMediapipeFacemesh);

function applyMaterial(parentNode: ExtendedGeoObjNode, faceDeform: MediapipeFacemeshDeformSopNode) {
	function create_MAT1(parentNode: ExtendedGeoObjNode) {
		var MAT1 = parentNode.createNode('materialsNetwork');
		MAT1.setName('MAT1');
		function create_meshPhysicalBuilder1(MAT1: MaterialsNetworkSopNode) {
			var meshPhysicalBuilder1 = MAT1.createNode('meshPhysicalBuilder');
			meshPhysicalBuilder1.setName('meshPhysicalBuilder1');
			function create_compare1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var compare1 = meshPhysicalBuilder1.createNode('compare');
				compare1.setName('compare1');
				compare1.uiData.setPosition(-150, 0);
				compare1.params.get('test')!.set(2);
				compare1.addParam(ParamType.FLOAT, 'value0', 0, {spare: true});
				compare1.addParam(ParamType.FLOAT, 'value1', 0, {spare: true});
				compare1.params.postCreateSpareParams();
				compare1.params.runOnSceneLoadHooks();
				return compare1;
			}
			function create_floatToVec3_1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var floatToVec3_1 = meshPhysicalBuilder1.createNode('floatToVec3');
				floatToVec3_1.setName('floatToVec3_1');
				floatToVec3_1.uiData.setPosition(-350, 150);
				floatToVec3_1.params.postCreateSpareParams();
				floatToVec3_1.params.runOnSceneLoadHooks();
				return floatToVec3_1;
			}
			function create_globals1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var globals1 = meshPhysicalBuilder1.createNode('globals');
				globals1.setName('globals1');
				globals1.uiData.setPosition(-600, 0);
				globals1.params.postCreateSpareParams();
				globals1.params.runOnSceneLoadHooks();
				return globals1;
			}
			function create_multAdd1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var multAdd1 = meshPhysicalBuilder1.createNode('multAdd');
				multAdd1.setName('multAdd1');
				multAdd1.uiData.setPosition(-450, 150);
				multAdd1.addParam(ParamType.FLOAT, 'value', 0, {spare: true});
				multAdd1.addParam(ParamType.FLOAT, 'preAdd', 0, {spare: true});
				multAdd1.addParam(ParamType.FLOAT, 'mult', 1, {spare: true});
				multAdd1.addParam(ParamType.FLOAT, 'postAdd', 0, {spare: true});
				multAdd1.params.postCreateSpareParams();
				multAdd1.params.runOnSceneLoadHooks();
				return multAdd1;
			}
			function create_noise1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var noise1 = meshPhysicalBuilder1.createNode('noise');
				noise1.setName('noise1');
				noise1.uiData.setPosition(-300, 0);
				noise1.params.get('outputType')!.set(1);
				noise1.params.get('octaves')!.set(7);
				noise1.addParam(ParamType.FLOAT, 'amp', 1, {spare: true});
				noise1.addParam(ParamType.VECTOR3, 'position', [0, 0, 0], {spare: true});
				noise1.addParam(ParamType.VECTOR3, 'freq', [1, 1, 1], {spare: true});
				noise1.addParam(ParamType.VECTOR3, 'offset', [0, 0, 0], {spare: true});
				noise1.params.postCreateSpareParams();
				noise1.params.runOnSceneLoadHooks();
				return noise1;
			}
			function create_output1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var output1 = meshPhysicalBuilder1.createNode('output');
				output1.setName('output1');
				output1.uiData.setPosition(200, 0);
				output1.params.postCreateSpareParams();
				output1.params.runOnSceneLoadHooks();
				return output1;
			}
			function create_twoWaySwitch1(meshPhysicalBuilder1: MeshPhysicalBuilderMatNode) {
				var twoWaySwitch1 = meshPhysicalBuilder1.createNode('twoWaySwitch');
				twoWaySwitch1.setName('twoWaySwitch1');
				twoWaySwitch1.uiData.setPosition(0, 0);
				twoWaySwitch1.addParam(ParamType.BOOLEAN, 'condition', false, {spare: true});
				twoWaySwitch1.addParam(ParamType.FLOAT, 'ifTrue', 0, {spare: true});
				twoWaySwitch1.addParam(ParamType.FLOAT, 'ifFalse', 0, {spare: true});
				twoWaySwitch1.params.get('ifFalse')!.set(1);
				twoWaySwitch1.params.postCreateSpareParams();
				twoWaySwitch1.params.runOnSceneLoadHooks();
				return twoWaySwitch1;
			}
			var compare1 = create_compare1(meshPhysicalBuilder1);
			var floatToVec3_1 = create_floatToVec3_1(meshPhysicalBuilder1);
			var globals1 = create_globals1(meshPhysicalBuilder1);
			var multAdd1 = create_multAdd1(meshPhysicalBuilder1);
			var noise1 = create_noise1(meshPhysicalBuilder1);
			var output1 = create_output1(meshPhysicalBuilder1);
			var twoWaySwitch1 = create_twoWaySwitch1(meshPhysicalBuilder1);
			compare1.setInput('value0', noise1, 'noise');
			floatToVec3_1.setInput('y', multAdd1, 'val');
			multAdd1.setInput('value', globals1, 'time');
			noise1.setInput('position', globals1, 'position');
			noise1.setInput('offset', floatToVec3_1, 'vec3');
			output1.setInput('alpha', twoWaySwitch1, 'val');
			twoWaySwitch1.setInput('condition', compare1, 'val');
			meshPhysicalBuilder1.childrenController!.selection.add([noise1]);
			meshPhysicalBuilder1.uiData.setPosition(150, -100);
			meshPhysicalBuilder1.params.get('transparent')!.set(true);
			meshPhysicalBuilder1.params.get('doubleSided')!.set(true);
			meshPhysicalBuilder1.params.postCreateSpareParams();
			meshPhysicalBuilder1.params.runOnSceneLoadHooks();
			return meshPhysicalBuilder1;
		}
		var meshPhysicalBuilder1 = create_meshPhysicalBuilder1(MAT1);
		MAT1.childrenController!.selection.add([meshPhysicalBuilder1]);
		MAT1.uiData.setPosition(200, -150);
		MAT1.params.postCreateSpareParams();
		MAT1.params.runOnSceneLoadHooks();
		return {MAT1, meshPhysicalBuilder1};
	}
	function create_transform1(parentNode: ExtendedGeoObjNode) {
		var transform1 = parentNode.createNode('transform');
		transform1.setName('transform1');
		transform1.uiData.setPosition(350, -150);
		transform1.params.postCreateSpareParams();
		transform1.params.runOnSceneLoadHooks();
		return transform1;
	}
	function create_material2(parentNode: ExtendedGeoObjNode) {
		var material2 = parentNode.createNode('material');
		material2.setName('material2');
		material2.uiData.setPosition(350, -50);
		material2.flags.display.set(true);
		material2.params.get('material')!.set('../MAT1/meshPhysicalBuilder1');
		material2.params.postCreateSpareParams();
		material2.params.runOnSceneLoadHooks();
		return material2;
	}
	var {meshPhysicalBuilder1} = create_MAT1(parentNode);
	var transform1 = create_transform1(parentNode);
	var material2 = create_material2(parentNode);
	material2.p.material.setNode(meshPhysicalBuilder1);
	transform1.setInput(0, faceDeform);
	material2.setInput(0, transform1);
	transform1.p.t.x.set(-0.5);

	return material2;
}

// create a scene
const scene = new PolyScene();

// create a webcam COP node
const COP = scene.root().createNode('copNetwork');
const webCam = COP.createNode('webCam');

// create a material to use the video as a texture
const MAT = scene.root().createNode('materialsNetwork');
const meshBasic = MAT.createNode('meshBasic');
meshBasic.p.useMap.set(true);
meshBasic.p.map.set(webCam.path());

// create a mediapipe facemesh SOP node
const geo1 = scene.root().createNode('geo') as ExtendedGeoObjNode;
const mediapipeFacemeshTopology = geo1.createNode('mediapipeFacemeshTopology');
const material1 = geo1.createNode('material');
material1.p.material.set(meshBasic.path());
const mediapipeFacemeshDeform = geo1.createNode('mediapipeFacemeshDeform');
material1.setInput(0, mediapipeFacemeshTopology);
mediapipeFacemeshDeform.setInput(0, material1);
// give the webcam to the mediapipe facemesh node
mediapipeFacemeshDeform.p.source.set(webCam.path());
mediapipeFacemeshDeform.flags.display.set(true);

// apply a transform with a different material
if (0) {
	const material3 = applyMaterial(geo1, mediapipeFacemeshDeform);
	const merge1 = geo1.createNode('merge');
	merge1.setInput(0, mediapipeFacemeshDeform);
	merge1.setInput(1, material3);
}

// create a box to see what the webcam shows
const geo2 = scene.root().createNode('geo');
const box = geo2.createNode('box');
box.p.center.set([2, 0, 0]);
const material2 = geo2.createNode('material');
material2.setInput(0, box);
material2.flags.display.set(true);
material2.p.material.set(meshBasic.path());

// add a light
scene.root().createNode('hemisphereLight');

// create a camera
const perspectiveCamera1 = scene.root().createNode('perspectiveCamera');
perspectiveCamera1.p.t.set([0, 2, -5]);
perspectiveCamera1.p.r.set([0, 180, 0]);
// add orbit_controls
const events1 = perspectiveCamera1.createNode('eventsNetwork');
const orbitsControls = events1.createNode('cameraOrbitControls');
perspectiveCamera1.p.controls.setNode(orbitsControls);

// create viewer
perspectiveCamera1.createViewer(document.getElementById('app')!);

scene.play();
(window as any).startCapture = function startCapture() {
	mediapipeFacemeshDeform.flags.display.set(true);
	// mediapipeFacemesh.p.capture.pressButton();
};
