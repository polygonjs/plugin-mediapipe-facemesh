import {MediapipeFacemeshDeformSopNode} from '../MediapipeFacemeshDeform';
import {Results} from '@mediapipe/face_mesh';
import {CoreGroup} from '@polygonjs/polygonjs/dist/src/core/geometry/Group';
import {Mesh} from 'three';

// type Resolve = (value: void | PromiseLike<void>) => void;

export class MediapipeFacemeshStreamController {
	constructor(private node: MediapipeFacemeshDeformSopNode) {}
	private _faceMeshObjects: Mesh[] = [];
	async cook(inputCoreGroups: CoreGroup[]) {
		const inputCoreGroup = inputCoreGroups[0];
		this._faceMeshObjects = inputCoreGroup.objects() as Mesh[];
		const {sourceController, facemeshController, hooksController} = this.node;
		let activeHTMLVideoElement = sourceController.activeHTMLVideoElement();
		if (!activeHTMLVideoElement) {
			activeHTMLVideoElement = await sourceController.initActiveHTMLVideoElement();
		}

		facemeshController.setOptions(this._onResultsForStream.bind(this));

		hooksController.registerOnBeforeTick(() => {
			if (activeHTMLVideoElement) {
				facemeshController.updateFromSource(activeHTMLVideoElement);
			}
		});

		this.node.setObjects(this._faceMeshObjects);
	}

	private _onResultsForStream(results: Results) {
		for (let faceMeshObject of this._faceMeshObjects) {
			this.node.meshesController.updateMeshFromResults(faceMeshObject, results);
		}
		this.node.hooksController.setDependentsDirty();
	}
}
