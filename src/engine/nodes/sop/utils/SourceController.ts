import {MediapipeFacemeshDeformSopNode} from '../MediapipeFacemeshDeform';
import {NodeContext} from '@polygonjs/polygonjs/dist/src/engine/poly/NodeContext';
import {CopType} from '@polygonjs/polygonjs/dist/src/engine/poly/registers/nodes/types/Cop';
import {CoreSleep} from '@polygonjs/polygonjs/dist/src/core/Sleep';
import {CoreDomUtils} from '@polygonjs/polygonjs/dist/src/core/DomUtils';
import {WebCamCopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/cop/WebCam';
import {VideoCopNode} from '@polygonjs/polygonjs/dist/src/engine/nodes/cop/Video';

export const ALLOWED_COP_TYPES = [CopType.VIDEO, CopType.WEB_CAM];
type AllowedCopType = WebCamCopNode | VideoCopNode;

export class MediapipeFacemeshSourceController {
	constructor(private node: MediapipeFacemeshDeformSopNode) {}
	private _activeHTMLVideoElement: HTMLVideoElement | undefined;

	activeHTMLVideoElement() {
		return this._activeHTMLVideoElement;
	}

	async initActiveHTMLVideoElement() {
		const data = await this._getHTMLVideoElement();
		if (!data) {
			return;
		}
		const {videoElement} = data;
		while (videoElement.paused || !CoreDomUtils.isHTMLVideoElementLoaded(videoElement)) {
			console.warn('video is paused or not ready');
			await CoreSleep.sleep(500);
		}
		console.log('video ready');
		return (this._activeHTMLVideoElement = videoElement);
	}

	private async _getHTMLVideoElement() {
		const {pv, states, cookController} = this.node;
		const node = pv.source.nodeWithContext(NodeContext.COP);
		if (!node) {
			states.error.set(`node is not a COP node`);
			cookController.endCook();
			return;
		}
		if (!ALLOWED_COP_TYPES.includes(node.type() as CopType)) {
			states.error.set(
				`node type '${node.type()}' is not accepted by MediapipeFaceMesh (${ALLOWED_COP_TYPES.join(', ')})`
			);
			cookController.endCook();
			return;
		}
		const sourceNode = node as AllowedCopType;
		const container = await sourceNode.compute();
		const videoElement = sourceNode.HTMLVideoElement();
		const texture = container.texture();
		if (!videoElement) {
			console.warn('no video element found');
			return;
		}
		return {videoElement, texture};
	}
}
