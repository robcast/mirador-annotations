
import mirador from 'mirador/dist/es/src/index';
import annotationPlugins from '../../src';
import LocalStorageAdapter from '../../src/LocalStorageAdapter';
//import AnnototAdapter from '../../src/AnnototAdapter';
import SimpleAnnotationServerV2Adapter from '../../src/SimpleAnnotationServerV2Adapter';

const endpointUrl = 'http://localhost:8080/sas/annotation';
const config = {
  annotation: {
    //adapter: (canvasId) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
    //adapter: (canvasId) => new AnnototAdapter(canvasId, endpointUrl),
    adapter: (canvasId) => new SimpleAnnotationServerV2Adapter(canvasId, endpointUrl),
  },
  id: 'demo',
  window: {
    defaultSideBarPanel: 'annotations',
    sideBarOpenByDefault: true,
  },
  windows: [{
    loadedManifest: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
  }],
};

mirador.viewer(config, [...annotationPlugins]);
