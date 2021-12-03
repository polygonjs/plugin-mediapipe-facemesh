import {MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {Results} from '@mediapipe/face_mesh';

// type Resolve = (value: void | PromiseLike<void>) => void;

export class MediapipeFacemeshStreamController {
	private _faceMeshStreamObject = this.node.meshesController.createFaceMeshObject(0);
	constructor(private node: MediapipeFacemeshSopNode) {}
	async cook() {
		const {sourceController, materialsController, facemeshController, hooksController} = this.node;
		let activeHTMLVideoElement = sourceController.activeHTMLVideoElement();
		if (!activeHTMLVideoElement) {
			activeHTMLVideoElement = await sourceController.initActiveHTMLVideoElement();
		}
		await materialsController.getMaterial();
		const material = materialsController.material();
		if (material) {
			this._faceMeshStreamObject.material = material;
		}

		facemeshController.setOptions(this._onResultsForStream.bind(this));

		hooksController.registerOnBeforeTick(() => {
			if (activeHTMLVideoElement) {
				facemeshController.updateFromSource(activeHTMLVideoElement);
			}
		});

		this.node.setObject(this._faceMeshStreamObject);
	}

	private _onResultsForStream(results: Results) {
		const faceMeshObject = this._faceMeshStreamObject;
		if (!faceMeshObject) {
			console.error(`no faceMeshObject found`);
			return;
		}
		this.node.meshesController.updateMeshFromResults(faceMeshObject, results);
		this.node.graphSuccessors().map((n) => n.setDirty());
	}
}
