/**
 * Creates a texture mesh representing a face from a webcam feed
 *
 * @remarks
 *
 * code insired from https://codepen.io/mediapipe/pen/KKgVaPJ
 */

import {TypedSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/_Base';
import {NodeParamsConfig, ParamConfig} from '@polygonjs/polygonjs/dist/src/engine/nodes/utils/params/ParamsConfig';
import {NodeContext} from '@polygonjs/polygonjs/dist/src/engine/poly/NodeContext';
import {BaseNodeType} from '@polygonjs/polygonjs/dist/src/engine/nodes/_Base';
import {MediapipeFacemeshMaterialsController} from './utils/MaterialsController';
import {MediapipeFacemeshMeshesController} from './utils/MeshesController';
import {MediapipeFacemeshSourceController, ALLOWED_COP_TYPES} from './utils/SourceController';
import {MediapipeFacemeshSnapshotsController} from './utils/SnapshotsController';
import {MediapipeFacemeshStreamController} from './utils/StreamController';
import {MediapipeFacemeshController} from './utils/FacemeshController';
import {MediapipeFacemeshHooksController} from './utils/HooksController';

export enum CaptureMode {
	SINGLE_FRAME = 'single frame',
	MULTIPLE_FRAMES = 'multiple frames',
	STREAM = 'stream',
}
const CAPTURE_MODES: CaptureMode[] = [CaptureMode.SINGLE_FRAME, CaptureMode.MULTIPLE_FRAMES, CaptureMode.STREAM];
const STREAMING_MODE = {
	[CaptureMode.SINGLE_FRAME]: CAPTURE_MODES.indexOf(CaptureMode.SINGLE_FRAME),
	[CaptureMode.MULTIPLE_FRAMES]: CAPTURE_MODES.indexOf(CaptureMode.MULTIPLE_FRAMES),
	[CaptureMode.STREAM]: CAPTURE_MODES.indexOf(CaptureMode.STREAM),
};
class MediapipeFacemeshSopParamsConfig extends NodeParamsConfig {
	/** @param source can be a COP/webcam or COP/video */
	source = ParamConfig.NODE_PATH('', {
		nodeSelection: {
			context: NodeContext.COP,
			types: ALLOWED_COP_TYPES,
		},
	});
	/** @param capture mode */
	captureMode = ParamConfig.INTEGER(CAPTURE_MODES.indexOf(CaptureMode.STREAM), {
		menu: {
			entries: CAPTURE_MODES.map((name, value) => {
				return {value, name};
			}),
		},
	});
	/** @param capture */
	capture = ParamConfig.BUTTON(null, {
		callback: (node: BaseNodeType) => {
			MediapipeFacemeshSopNode.PARAM_CALLBACK_capture(node as MediapipeFacemeshSopNode);
		},
		visibleIf: [
			{captureMode: CAPTURE_MODES.indexOf(CaptureMode.SINGLE_FRAME)},
			{captureMode: CAPTURE_MODES.indexOf(CaptureMode.MULTIPLE_FRAMES)},
		],
	});
	/** @param number of frames that will be captured */
	framesCount = ParamConfig.INTEGER(10, {
		range: [1, 100],
		rangeLocked: [true, false],
		visibleIf: [{captureMode: CAPTURE_MODES.indexOf(CaptureMode.MULTIPLE_FRAMES)}],
	});
	/** @param frames per second */
	fps = ParamConfig.INTEGER(60, {
		range: [1, 60],
		rangeLocked: [true, false],
		visibleIf: [{captureMode: CAPTURE_MODES.indexOf(CaptureMode.MULTIPLE_FRAMES)}],
	});
	/** @param show all meshes */
	showAllMeshes = ParamConfig.BOOLEAN(1, {
		visibleIf: [{captureMode: CAPTURE_MODES.indexOf(CaptureMode.MULTIPLE_FRAMES)}],
	});

	/** @param the material node */
	material = ParamConfig.NODE_PATH('', {
		nodeSelection: {
			context: NodeContext.MAT,
		},
		dependentOnFoundNode: false,
		visibleIf: {captureMode: CAPTURE_MODES.indexOf(CaptureMode.STREAM)},
	});

	/** @param scale */
	scale = ParamConfig.FLOAT(1, {
		range: [0, 2],
		rangeLocked: [true, false],
		separatorBefore: true,
	});
	/** @param selfie mode */
	selfieMode = ParamConfig.BOOLEAN(0);
	/** @param min detection confidence */
	minDetectionConfidence = ParamConfig.FLOAT(0.5, {
		range: [0, 1],
		rangeLocked: [true, true],
	});
	/** @param max detection confidence */
	maxDetectionConfidence = ParamConfig.FLOAT(0.5, {
		range: [0, 1],
		rangeLocked: [true, true],
	});
	/** @param prevents jitter between frames */
	smoothFactor = ParamConfig.FLOAT(0, {
		range: [0, 1],
		rangeLocked: [true, false],
	});
}
const ParamsConfig = new MediapipeFacemeshSopParamsConfig();

export class MediapipeFacemeshSopNode extends TypedSopNode<MediapipeFacemeshSopParamsConfig> {
	paramsConfig = ParamsConfig;
	static type() {
		return 'mediapipeFacemesh';
	}

	public readonly facemeshController = new MediapipeFacemeshController(this);
	public readonly materialsController = new MediapipeFacemeshMaterialsController(this);
	public readonly hooksController = new MediapipeFacemeshHooksController(this);
	public readonly meshesController = new MediapipeFacemeshMeshesController(this);
	public readonly sourceController = new MediapipeFacemeshSourceController(this);
	public readonly snapshotsController = new MediapipeFacemeshSnapshotsController(this);
	public readonly streamController = new MediapipeFacemeshStreamController(this);

	async cook() {
		if (this.captureMode() == CaptureMode.STREAM) {
			await this.streamController.cook();
		} else {
			this.setObjects([]);
		}
	}

	/*

	capture modes

	*/
	setCaptureMode(mode: CaptureMode) {
		this.p.captureMode.set(STREAMING_MODE[mode]);
	}
	captureMode() {
		return CAPTURE_MODES[this.pv.captureMode];
	}

	/*

	CALLBACKS

	*/
	static PARAM_CALLBACK_capture(node: MediapipeFacemeshSopNode) {
		node._paramCallbackCapture();
	}

	private _paramCallbackCapture() {
		this.snapshotsController.capture();
	}
}
