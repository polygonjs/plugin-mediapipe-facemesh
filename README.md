# DEPRECATED

This repository is not used anymore, as the nodes have been fully integrated into the [core engine](https://polygonjs.com). See [live examples scenes](https://polygonjs.com/docs/examples-category/Computer%20Vision)

# Polygonjs Mediapipe Facemesh Plugin

This adds a Mediapipe Facemesh SOP nodes to the [Polygonjs webgl engine](https://polygonjs.com).

# Install

Import the plugin:

`yarn add @polygonjs/plugin-mediapipe-facemesh`

And register the plugin in the function `configurePolygonjs` in the file `PolyConfig.js` so that the facemesh nodes can be accessible in both the editor and your exported scene:

```js
import {polyPluginMediapipeFacemesh} from '@polygonjs/plugin-mediapipe-facemesh/dist/src/index';

export function configurePolygonjs(poly) {
	poly.registerPlugin(polyPluginMediapipeFacemesh);
}
```
