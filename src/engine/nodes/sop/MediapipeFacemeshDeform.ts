/**
 * Creates a texture mesh representing a face from a webcam feed
 *
 * @remarks
 *
 * code inspired from https://codepen.io/mediapipe/pen/KKgVaPJ
 */

import {TypedSopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/sop/_Base';
import {NodeParamsConfig, ParamConfig} from '@polygonjs/polygonjs/dist/src/engine/nodes/utils/params/ParamsConfig';
import {NodeContext} from '@polygonjs/polygonjs/dist/src/engine/poly/NodeContext';
import {MediapipeFacemeshMeshesController} from './utils/MeshesController';
import {MediapipeFacemeshSourceController, ALLOWED_COP_TYPES} from './utils/SourceController';
import {MediapipeFacemeshStreamController} from './utils/StreamController';
import {MediapipeFacemeshController} from './utils/FacemeshController';
import {MediapipeFacemeshHooksController} from './utils/HooksController';
import {InputCloneMode} from '@polygonjs/polygonjs/dist/src/engine/poly/InputCloneMode';
import {CoreGroup} from '@polygonjs/polygonjs/dist/src/core/geometry/Group';

class MediapipeFacemeshDeformSopParamsConfig extends NodeParamsConfig {
	/** @param source can be a COP/webcam or COP/video */
	source = ParamConfig.NODE_PATH('', {
		nodeSelection: {
			context: NodeContext.COP,
			types: ALLOWED_COP_TYPES,
		},
	});
	/** @param selfie mode */
	selfieMode = ParamConfig.BOOLEAN(0, {
		separatorBefore: true,
	});
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
	/** @param scale */
	scale = ParamConfig.FLOAT(1, {
		range: [0, 2],
		rangeLocked: [true, false],
		separatorBefore: true,
	});
}
const ParamsConfig = new MediapipeFacemeshDeformSopParamsConfig();

export class MediapipeFacemeshDeformSopNode extends TypedSopNode<MediapipeFacemeshDeformSopParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'mediapipeFacemeshDeform';
	}

	public readonly facemeshController = new MediapipeFacemeshController(this);
	public readonly hooksController = new MediapipeFacemeshHooksController(this);
	public readonly meshesController = new MediapipeFacemeshMeshesController(this);
	public readonly sourceController = new MediapipeFacemeshSourceController(this);
	public readonly streamController = new MediapipeFacemeshStreamController(this);

	override initializeNode() {
		this.io.inputs.setCount(1);
		this.io.inputs.initInputsClonedState(InputCloneMode.NEVER);
	}

	override async cook(inputCoreGroups: CoreGroup[]) {
		await this.streamController.cook(inputCoreGroups);
	}
}
