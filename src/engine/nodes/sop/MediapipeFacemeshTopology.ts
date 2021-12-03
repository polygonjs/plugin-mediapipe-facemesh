/**
 * Creates a default face mesh to be used with SOP/mediapipeFacemesh
 *
 */

import {TypedSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/_Base';
import {NodeParamsConfig} from '@polygonjs/polygonjs/dist/src/engine/nodes/utils/params/ParamsConfig';
import {DEFAULT_POSITION} from '../../../core/Utils';
import {BufferGeometry} from 'three/src/core/BufferGeometry';
import {BufferAttribute} from 'three/src/core/BufferAttribute';
import {Vector2} from 'three/src/math/Vector2';
import {Attribute} from '@polygonjs/polygonjs/dist/src/core/geometry/Attribute';
import {FACEMESH_TESSELATION} from '@mediapipe/face_mesh';

class MediapipeFacemeshTopologySopParamsConfig extends NodeParamsConfig {}
const ParamsConfig = new MediapipeFacemeshTopologySopParamsConfig();

export class MediapipeFacemeshTopologySopNode extends TypedSopNode<MediapipeFacemeshTopologySopParamsConfig> {
	paramsConfig = ParamsConfig;
	static type() {
		return 'mediapipeFacemeshTopology';
	}

	private _uv = new Vector2();
	async cook() {
		const geometry = new BufferGeometry();

		// add position
		const positionArray = DEFAULT_POSITION;
		geometry.setAttribute(Attribute.POSITION, new BufferAttribute(new Float32Array(positionArray), 3));

		// add uvs
		const uvs: number[] = [];
		const pointsCount = positionArray.length / 3;
		for (let i = 0; i < pointsCount; i++) {
			this._uv.fromArray(positionArray, i * 3);
			this._uv.toArray(uvs, i * 3);
		}
		geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));

		// add indices
		const indices: number[] = [];
		const polyCount = FACEMESH_TESSELATION.length / 3;
		for (let i = 0; i < polyCount; i++) {
			indices.push(FACEMESH_TESSELATION[i * 3 + 0][0]);
			indices.push(FACEMESH_TESSELATION[i * 3 + 1][0]);
			indices.push(FACEMESH_TESSELATION[i * 3 + 2][0]);
		}
		geometry.setIndex(indices);
		geometry.computeVertexNormals();

		this.setGeometry(geometry);
	}
}
