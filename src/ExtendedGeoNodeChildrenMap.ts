import {GeoNodeChildrenMap} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/nodes/Sop';
import {MediapipeFacemeshSopNode} from './engine/nodes/sop/MediapipeFacemesh';

export interface ExtendedGeoNodeChildrenMap extends GeoNodeChildrenMap {
	mediapipeFacemesh: MediapipeFacemeshSopNode;
}
