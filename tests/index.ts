// import {AllNodesRegister} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/nodes/All';
import {Poly} from '@polygonjs/polygonjs/dist/src/engine/Poly';
// AllNodesRegister.run(Poly);
import {AllCamerasRegister} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/cameras/All';
import {AllExpressionsRegister} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/expressions/All';
AllCamerasRegister.run(Poly);
AllExpressionsRegister.run(Poly);
import {GeoObjNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/obj/Geo';
import {AddSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Add';
import {MaterialSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Material';
import {TextSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Text';
import {TransformSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Transform';
import {CopySopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Copy';
import {MaterialsNetworkObjNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/obj/MaterialsNetwork';
import {MaterialsNetworkSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/MaterialsNetwork';
import {MeshLambertMatNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/mat/MeshLambert';
import {HemisphereLightObjNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/obj/HemisphereLight';
import {CopNetworkObjNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/obj/CopNetwork';
import {WebCamCopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/cop/WebCam';
import {MeshBasicMatNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/mat/MeshBasic';
import {BoxSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/Box';
import {EventsNetworkSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/EventsNetwork';
import {PerspectiveCameraObjNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/obj/PerspectiveCamera';
import {CameraOrbitControlsEventNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/event/CameraOrbitControls';
Poly.registerNode(PerspectiveCameraObjNode);
Poly.registerNode(CameraOrbitControlsEventNode);
Poly.registerNode(EventsNetworkSopNode);
Poly.registerNode(BoxSopNode);
Poly.registerNode(MeshBasicMatNode);
Poly.registerNode(WebCamCopNode);
Poly.registerNode(CopNetworkObjNode);
Poly.registerNode(GeoObjNode);
Poly.registerNode(AddSopNode);
Poly.registerNode(MaterialSopNode);
Poly.registerNode(TextSopNode);
Poly.registerNode(TransformSopNode);
Poly.registerNode(CopySopNode);
Poly.registerNode(MaterialsNetworkObjNode);
Poly.registerNode(MaterialsNetworkSopNode);
Poly.registerNode(MeshLambertMatNode);
Poly.registerNode(HemisphereLightObjNode);
import {
	FloatToVec2GlNode,
	FloatToVec3GlNode,
	FloatToVec4GlNode,
} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/_ConversionToVec';
import {CompareGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/Compare';
import {GlobalsGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/Globals';
import {OutputGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/Output';
import {MultAddGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/MultAdd';
import {NoiseGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/Noise';
import {TwoWaySwitchGlNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/gl/TwoWaySwitch';
Poly.registerNode(FloatToVec2GlNode);
Poly.registerNode(FloatToVec3GlNode);
Poly.registerNode(FloatToVec4GlNode);
Poly.registerNode(CompareGlNode);
Poly.registerNode(GlobalsGlNode);
Poly.registerNode(OutputGlNode);
Poly.registerNode(MultAddGlNode);
Poly.registerNode(NoiseGlNode);
Poly.registerNode(TwoWaySwitchGlNode);

import {polyPluginMediapipeFacemesh} from '../src/index';
Poly.registerPlugin(polyPluginMediapipeFacemesh);

import './helpers/setup';
import './tests';

QUnit.start();
