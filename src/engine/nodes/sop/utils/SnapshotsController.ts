import {CaptureMode, MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {CoreType, isBooleanTrue} from '@polygonjs/polygonjs/dist/src/core/Type';
import {Texture} from 'three/src/textures/Texture';
import {sRGBEncoding} from 'three/src/constants';
import {Results} from '@mediapipe/face_mesh';
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial';

type Resolve = (value: void | PromiseLike<void>) => void;
interface TextureAndImage {
	texture: Texture;
	image: HTMLImageElement;
}

export class MediapipeFacemeshSnapshotsController {
	private _currentCapturedFrame = 9999999;
	private _sourceSnapshotCanvases: HTMLCanvasElement[] = [];
	private _sourceSnapshots: TextureAndImage[] = [];
	private _onSendToFaceMeshSingleResolve: Resolve | undefined;
	constructor(private node: MediapipeFacemeshSopNode) {}

	private _updateFromCapturedFrames() {
		const captureMode = this.node.captureMode();
		const faceMeshObjects = this.node.meshesController.faceMeshObjects;
		const pv = this.node.pv;
		if (captureMode == CaptureMode.MULTIPLE_FRAMES && isBooleanTrue(pv.showAllMeshes)) {
			this.node.setObjects(faceMeshObjects);
		} else {
			const frame = this.node.scene().frame() % faceMeshObjects.length;

			const currentObject =
				captureMode == CaptureMode.MULTIPLE_FRAMES ? faceMeshObjects[frame] : faceMeshObjects[0];
			if (currentObject) {
				this.node.setObject(currentObject);
			} else {
				this.node.setObjects([]);
			}
		}
		this.node.graphSuccessors().map((n) => n.setDirty());
	}

	async capture() {
		// 1. capture video feed into images
		// so that we have the expected fps
		console.log('capture start');
		await this.node.sourceController.initActiveHTMLVideoElement();
		this._currentCapturedFrame = 0;
		await this._captureSourceSnapshots();
		console.log('capture complete');

		// 2. init face meshes
		this._initMeshes();

		// 3. send the captured images to mediapipe
		// which will then be processed to create the meshes
		this._currentCapturedFrame = 0;
		this.node.facemeshController.setOptions(this._onResultsForFrames.bind(this));
		await this._sendToFaceMeshAll();

		// register
		this.node.hooksController.registerOnBeforeTick(() => {
			this._updateFromCapturedFrames();
		});
		this._updateFromCapturedFrames();

		console.log('facemesh generation completed');

		return;
	}

	private _initMeshes() {
		this.node.meshesController.initFaceMeshObjects({material: new MeshBasicMaterial()});
	}

	private _framesCaptureAllowed() {
		const mode = this.node.captureMode();
		switch (mode) {
			case CaptureMode.SINGLE_FRAME: {
				return this._currentCapturedFrame < 1;
			}
			case CaptureMode.MULTIPLE_FRAMES: {
				return this._currentCapturedFrame < this.node.pv.framesCount;
			}
		}
	}

	private _videoSnapshotCanvas(videoElement: HTMLVideoElement) {
		const canvasElement = document.createElement('canvas');
		// videoWidth and videoHeight are more robust than .width and .height (see https://discourse.threejs.org/t/how-to-get-camera-video-texture-size-or-resolution/2879)
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
		const canvasCtx = canvasElement.getContext('2d')!;
		canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
		return canvasElement;
	}
	private static _canvasToTexture(canvasElement: HTMLCanvasElement, index: number): Promise<TextureAndImage> {
		return new Promise((resolve) => {
			const imgDataURL = canvasElement.toDataURL('image/png');
			const image = new Image();
			console.log(`start ${index}`);
			image.onload = () => {
				const texture = new Texture(image);
				texture.name = `facemesh-texture-${index}`;
				texture.encoding = sRGBEncoding;
				texture.needsUpdate = true;
				console.log(`done ${index}`);
				resolve({texture, image});
			};
			image.src = imgDataURL;
		});
	}

	private _captureSourceSnapshots(): Promise<void> {
		return new Promise((resolve) => {
			this._sourceSnapshotCanvases = [];
			this._sourceSnapshots = [];
			this._captureSingleSourceSnapshot(resolve);
		});
	}
	private async _captureSingleSourceSnapshot(resolve: Resolve) {
		const activeHTMLVideoElement = this.node.sourceController.activeHTMLVideoElement();
		if (!activeHTMLVideoElement) {
			console.warn('no video found');
			return;
		}
		if (this._framesCaptureAllowed()) {
			const canvas = this._videoSnapshotCanvas(activeHTMLVideoElement);
			this._sourceSnapshotCanvases.push(canvas);
			this._currentCapturedFrame++;
			const delay: number = 1000 / this.node.pv.fps;
			setTimeout(() => {
				this._captureSingleSourceSnapshot(resolve);
			}, delay);
		} else {
			console.log('converting snapshots to images and textures...');
			let i = 0;
			for (let snapshotCanvas of this._sourceSnapshotCanvases) {
				const snapshot = await MediapipeFacemeshSnapshotsController._canvasToTexture(snapshotCanvas, i);
				this._sourceSnapshots.push(snapshot);
				i++;
			}

			resolve();
		}
	}

	private async _sendToFaceMeshAll() {
		for (let snapshot of this._sourceSnapshots) {
			await this._sendToFaceMeshSingle(snapshot);
		}
	}
	private _sendToFaceMeshSingle(snapshot: TextureAndImage) {
		return new Promise((resolve) => {
			this._onSendToFaceMeshSingleResolve = resolve;
			this.node.facemeshController.updateFromSource(snapshot.image);
		});
	}

	private _onResultsForFrames(results: Results) {
		if (!this._framesCaptureAllowed()) {
			return;
		}
		const landmark = results.multiFaceLandmarks[0];
		if (!landmark) {
			console.error(`no landmark found (${this._currentCapturedFrame})`);
			console.log('results', results);
			return;
		}
		const meshesController = this.node.meshesController;
		const faceMeshObject = meshesController.faceMeshObjects[this._currentCapturedFrame];
		if (!faceMeshObject) {
			console.error(`no faceMeshObject found`);
			return;
		}
		console.log('update mesh', this._currentCapturedFrame);
		meshesController.updateMeshFromResults(faceMeshObject, results);

		this._updateMaterial(this._currentCapturedFrame);
		this._currentCapturedFrame++;
		if (this._onSendToFaceMeshSingleResolve) {
			this._onSendToFaceMeshSingleResolve();
		}
	}
	private _updateMaterial(currentCapturedFrame: number) {
		const faceMeshObject = this.node.meshesController.faceMeshObjects[currentCapturedFrame];
		const material = faceMeshObject.material;
		if (!CoreType.isArray(material)) {
			const meshBasicMaterial = material as MeshBasicMaterial;
			const texture = this._sourceSnapshots[currentCapturedFrame].texture;
			meshBasicMaterial.map = texture;
		}
	}
}
