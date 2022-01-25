import {MediapipeFacemeshDeformSopNode} from '../MediapipeFacemeshDeform';
import {isBooleanTrue} from '@polygonjs/polygonjs/dist/src/core/Type';
import {Results} from '@mediapipe/face_mesh';
import {Vector3} from 'three/src/math/Vector3';
import {Vector2} from 'three/src/math/Vector2';
import {Mesh} from 'three/src/objects/Mesh';
import {Attribute} from '@polygonjs/polygonjs/dist/src/core/geometry/Attribute';

export class MediapipeFacemeshMeshesController {
	public readonly faceMeshObjects: Mesh[] = [];
	public readonly faceMeshStreamObject: Mesh | undefined;

	constructor(private node: MediapipeFacemeshDeformSopNode) {}
	private _pos = new Vector3();
	private _uv = new Vector2();
	private _prevPos = new Vector3();
	updateMeshFromResults(faceMeshObject: Mesh, results: Results) {
		const pv = this.node.pv;
		const landmark = results.multiFaceLandmarks[0];
		if (!landmark) {
			return;
		}
		const geometry = faceMeshObject.geometry;
		const positionAttribute = geometry.getAttribute(Attribute.POSITION);
		const uvAttribute = geometry.getAttribute(Attribute.UV);
		const positionArray = positionAttribute.array as number[];
		const uvArray = uvAttribute.array as number[];
		const scale = pv.scale;
		let i = 0;
		const flipY = false;
		const selfie = isBooleanTrue(pv.selfieMode);
		const smoothFactor = pv.smoothFactor;
		const performSmooth = smoothFactor > 0;
		try {
			for (let pt of landmark) {
				this._pos.set(1 - pt.x, 1 - pt.y, pt.z);
				this._uv.set(selfie ? this._pos.x : 1 - this._pos.x, flipY ? this._pos.y : 1 - this._pos.y);
				this._pos.multiplyScalar(scale);

				if (performSmooth) {
					this._prevPos.fromArray(positionArray, i * 3);
					this._pos.lerp(this._prevPos, smoothFactor);
				}

				this._pos.toArray(positionArray, i * 3);
				this._uv.toArray(uvArray, i * 2);
				i++;
			}
		} catch (err) {
			console.error(err);
			console.log('landmark', landmark);
		}
		geometry.computeVertexNormals();
		geometry.computeTangents();
		positionAttribute.needsUpdate = true;
		uvAttribute.needsUpdate = true;
	}
}
