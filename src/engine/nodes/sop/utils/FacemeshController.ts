import {MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {FaceMesh, InputImage, Results, ResultsListener} from '@mediapipe/face_mesh';

export class MediapipeFacemeshController {
	public readonly faceMesh = this._createFaceMesh();
	private _inProgress = false;

	constructor(private node: MediapipeFacemeshSopNode) {}

	private _createFaceMesh() {
		const faceMesh = new FaceMesh({
			locateFile: (file: string) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`;
			},
		});

		return faceMesh;
	}
	setOptions(listener: ResultsListener) {
		const pv = this.node.pv;
		const faceMesh = this.node.facemeshController.faceMesh;
		faceMesh.setOptions({
			enableFaceGeometry: true,
			selfieMode: pv.selfieMode,
			maxNumFaces: 1,
			minDetectionConfidence: pv.minDetectionConfidence,
			minTrackingConfidence: pv.maxDetectionConfidence,
		});
		const listenerWrapper = (results: Results) => {
			listener(results);
			this._inProgress = false;
		};
		faceMesh.onResults(listenerWrapper);
	}

	updateFromSource(inputImage: InputImage) {
		if (!this._inProgress) {
			this._inProgress = true;
			this.faceMesh.send({image: inputImage});
		}
	}
}
