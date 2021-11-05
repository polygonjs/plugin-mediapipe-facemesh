import {PolyEngine} from '@polygonjs/polygonjs/dist/src/engine/Poly';

import {MediapipeFacemeshSopNode} from './engine/nodes/sop/MediapipeFacemesh';
import {PolyPlugin} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/plugins/Plugin';
function PolygonjsPluginMediapipeFacemesh(poly: PolyEngine) {
	poly.registerNode(MediapipeFacemeshSopNode, 'mediapipe');
}
export const polyPluginMediapipeFacemesh = new PolyPlugin('mediapipeFacemesh', PolygonjsPluginMediapipeFacemesh, {
	libraryName: '@polygonjs/plugin-mediapipe-facemesh',
	libraryImportPath: '@polygonjs/plugin-mediapipe-facemesh/dist',
});
