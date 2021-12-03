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
// (window as any).capture = function capture() {
// 	mediapipeFacemesh.p.capture.pressButton();
// };
