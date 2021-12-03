import {CaptureMode, MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {isBooleanTrue} from '@polygonjs/polygonjs/dist/src/core/Type';
import {FACEMESH_TESSELATION, Results} from '@mediapipe/face_mesh';
import {BufferGeometry} from 'three/src/core/BufferGeometry';
import {BufferAttribute} from 'three/src/core/BufferAttribute';
import {ObjectType} from '@polygonjs/polygonjs/dist/src/core/geometry/Constant';
import {Vector3} from 'three/src/math/Vector3';
import {Vector2} from 'three/src/math/Vector2';
import {Mesh} from 'three/src/objects/Mesh';
import {Material} from 'three/src/materials/Material';

const FACEMESH_POINTS_COUNT = 468;

interface InitOptions {
	material: Material;
}

export class MediapipeFacemeshMeshesController {
	public readonly faceMeshObjects: Mesh[] = [];
	public readonly faceMeshStreamObject: Mesh | undefined;

	constructor(private node: MediapipeFacemeshSopNode) {}
	initFaceMeshObjects(options?: InitOptions) {
		this.faceMeshObjects.splice(0, this.faceMeshObjects.length);
		const count = this.node.captureMode() == CaptureMode.MULTIPLE_FRAMES ? this.node.pv.framesCount : 1;
		for (let i = 0; i < count; i++) {
			const object = this.createFaceMeshObject(i, options);
			this.faceMeshObjects.push(object);
		}
	}
	private _pos = new Vector3();
	private _uv = new Vector2();
	private _prevPos = new Vector3();
	updateMeshFromResults(faceMeshObject: Mesh, results: Results) {
		const pv = this.node.pv;
		const landmark = results.multiFaceLandmarks[0];
		const geometry = faceMeshObject.geometry;
		const positionAttribute = geometry.getAttribute('position');
		const uvAttribute = geometry.getAttribute('uv');
		const positionArray = positionAttribute.array as number[];
		const uvArray = uvAttribute.array as number[];
		const scale = pv.scale;
		let i = 0;
		const flipY = this.node.captureMode() != CaptureMode.STREAM;
		const selfie = isBooleanTrue(pv.selfieMode);
		const smoothFactor = pv.smoothFactor;
		try {
			for (let pt of landmark) {
				this._pos.set(1 - pt.x, 1 - pt.y, pt.z);
				this._uv.set(selfie ? this._pos.x : 1 - this._pos.x, flipY ? this._pos.y : 1 - this._pos.y);

				if (smoothFactor > 0) {
					this._prevPos.fromArray(positionArray, i * 3);
					this._pos.lerp(this._prevPos, 1 - smoothFactor);
				}

				this._pos.multiplyScalar(scale);
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
	createFaceMeshObject(index: number, options?: InitOptions) {
		const geometry = new BufferGeometry();
		const positions: number[] = [];
		const uvs: number[] = [];

		this._pos.set(0, 0, 0);
		this._uv.set(0, 0);
		for (let i = 0; i < FACEMESH_POINTS_COUNT; i++) {
			this._pos.toArray(positions, i * 3);
			this._uv.toArray(uvs, i * 3);
		}
		const indices: number[] = [];
		const polyCount = FACEMESH_TESSELATION.length / 3;
		for (let i = 0; i < polyCount; i++) {
			indices.push(FACEMESH_TESSELATION[i * 3 + 0][0]);
			indices.push(FACEMESH_TESSELATION[i * 3 + 1][0]);
			indices.push(FACEMESH_TESSELATION[i * 3 + 2][0]);
		}
		geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
		geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
		geometry.setIndex(indices);
		const material = options?.material?.clone() || this.node.materialsController.material();
		const object = this.node.createObject(geometry, ObjectType.MESH, material);
		object.name = `${this.node.path()}-${index}`;
		return object;
	}
}
