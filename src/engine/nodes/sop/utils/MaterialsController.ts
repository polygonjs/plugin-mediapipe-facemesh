import {CaptureMode, MediapipeFacemeshSopNode} from '../MediapipeFacemesh';
import {Material} from 'three/src/materials/Material';
import {NodeContext} from '@polygonjs/polygonjs/dist/src/engine/poly/NodeContext';

export class MediapipeFacemeshMaterialsController {
	constructor(private node: MediapipeFacemeshSopNode) {}
	material() {
		if (this._assignMat()) {
			return this._foundMat;
		}
	}

	private _foundMat: Material | undefined;
	private _assignMat() {
		return this.node.captureMode() == CaptureMode.STREAM;
	}
	async getMaterial() {
		if (!this._assignMat()) {
			this._foundMat = undefined;
			return;
		}
		const node = this.node.pv.material.nodeWithContext(NodeContext.MAT);
		if (!node) {
			this.node.states.error.set(`node is not a MAT node`);
			this.node.cookController.endCook();
			return;
		}
		await node.compute();
		this._foundMat = node.material;
	}
}
