import {MediapipeFacemeshDeformSopNode} from '../MediapipeFacemeshDeform';
import {onTimeTickHook} from '@polygonjs/polygonjs/dist/src/engine/scene/utils/TimeController';

export class MediapipeFacemeshHooksController {
	constructor(private node: MediapipeFacemeshDeformSopNode) {}

	registerOnBeforeTick(callback: onTimeTickHook) {
		const callbackName = `mediapipe:${this.node.graphNodeId()}`;
		const timeController = this.node.scene().timeController;
		timeController.unRegisterOnBeforeTick(callbackName);
		timeController.registerOnBeforeTick(callbackName, callback);
	}
	setDependentsDirty() {
		this.node.graphSuccessors().map((n) => n.setDirty());
	}
}
