import {PolyEngine} from '@polygonjs/polygonjs/dist/src/engine/Poly';

import {MediapipeFacemeshTopologySopNode} from './engine/nodes/sop/MediapipeFacemeshTopology';
import {MediapipeFacemeshDeformSopNode} from './engine/nodes/sop/MediapipeFacemeshDeform';
import {PolyPlugin} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/plugins/Plugin';
function PolygonjsPluginMediapipeFacemesh(poly: PolyEngine) {
	poly.registerNode(MediapipeFacemeshTopologySopNode, 'mediapipe');
	poly.registerNode(MediapipeFacemeshDeformSopNode, 'mediapipe');
}
export const polyPluginMediapipeFacemesh = new PolyPlugin('mediapipeFacemesh', PolygonjsPluginMediapipeFacemesh, {
	libraryName: '@polygonjs/plugin-mediapipe-facemesh',
	libraryImportPath: '@polygonjs/plugin-mediapipe-facemesh/dist',
});
