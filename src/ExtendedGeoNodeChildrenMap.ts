import {GeoNodeChildrenMap} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/nodes/Sop';
import {MediapipeFacemeshDeformSopNode} from './engine/nodes/sop/MediapipeFacemeshDeform';
import {MediapipeFacemeshTopologySopNode} from './engine/nodes/sop/MediapipeFacemeshTopology';

export interface ExtendedGeoNodeChildrenMap extends GeoNodeChildrenMap {
	mediapipeFacemeshTopology: MediapipeFacemeshTopologySopNode;
	mediapipeFacemeshDeform: MediapipeFacemeshDeformSopNode;
}
