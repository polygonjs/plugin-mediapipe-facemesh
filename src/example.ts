import {Poly} from '@polygonjs/polygonjs/dist/src/engine/Poly';
import {PolyScene} from '@polygonjs/polygonjs/dist/src/engine/scene/PolyScene';
import {ExtendedGeoObjNode} from './engine/nodes/obj/ExtendedGeo';

// register all nodes
import {AllRegister} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/All';
AllRegister.run();
// register nodes for this plugin
import {polyPluginMediapipeFacemesh} from './index';
Poly.registerPlugin(polyPluginMediapipeFacemesh);

// create a scene
const scene = new PolyScene();

// create a webcam COP node
const COP = scene.root().createNode('copNetwork');
const webCam = COP.createNode('webCam');
webCam.p.tflipY.set(true);
webCam.p.flipY.set(true);

// create a mediapipe facemesh SOP node
const geo1 = scene.root().createNode('geo') as ExtendedGeoObjNode;
const mediapipeFacemesh = geo1.createNode('mediapipeFacemesh');
// give the webcam to the mediapipe facemesh node
mediapipeFacemesh.p.webcam.set(webCam.path());

// create a box to see what the webcam shows
const geo2 = scene.root().createNode('geo');
const box = geo2.createNode('box');
box.p.center.set([2, 0, 0]);
const material = geo2.createNode('material');
material.setInput(0, box);
material.flags.display.set(true);
const MAT = scene.root().createNode('materialsNetwork');
const meshLambert = MAT.createNode('meshLambert');
meshLambert.p.useMap.set(true);
meshLambert.p.map.set(webCam.path());
material.p.material.set(meshLambert.path());

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

(window as any).capture = function capture() {
	mediapipeFacemesh.p.capture.pressButton();
};
