import {MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {onTimeTickHook} from '@polygonjs/polygonjs/dist/src/engine/scene/utils/TimeController';

export class MediapipeFacemeshHooksController {
	constructor(private node: MediapipeFacemeshSopNode) {}

	registerOnBeforeTick(callback: onTimeTickHook) {
		const callbackName = `mediapipe:${this.node.graphNodeId()}`;
		const timeController = this.node.scene().timeController;
		timeController.unRegisterOnBeforeTick(callbackName);
		timeController.registerOnBeforeTick(callbackName, callback);
	}
}
