/** */
export default class SimpleAnnotationServerV2Adapter {
  /** */
  constructor(canvasId, endpointUrl) {
    this.canvasId = canvasId;
    this.endpointUrl = endpointUrl;
  }

  /** */
  get annotationPageId() {
    return `${this.endpointUrl}/search?uri=${this.canvasId}`;
  }

  /** */
  async create(annotation) {
    return fetch(`${this.endpointUrl}/create`, {
      body: JSON.stringify(this.createV2Anno(annotation)),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => this.all())
      .catch(() => this.all());
  }

  /** */
  async update(annotation) {
    return fetch(`${this.endpointUrl}/update`, {
      body: JSON.stringify(this.createV2Anno(annotation)),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => this.all())
      .catch(() => this.all());
  }

  /** */
  async delete(annoId) {
    return fetch(`${this.endpointUrl}/destroy?uri=${encodeURIComponent(annoId)}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })
      .then((response) => this.all())
      .catch(() => this.all());
  }

  /** */
  async get(annoId) {
    // SAS does not have GET for a single annotation
    const annotationPage = await this.all();
    if (annotationPage) {
      return annotationPage.items.find((item) => item.id === annoId);
    }
    return null;
  }

  /** Returns an AnnotationPage with all annotations */
  async all() {
    return (await fetch(this.annotationPageId)).json().then((annos) => this.createAnnotationPage(annos));
  }
  
  /** Creates a V2 annotation from a V3 annotation */
  createV2Anno(v3anno) {
    let v2anno = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@type': 'oa:Annotation',
      'motivation': 'oa:commenting',
      'on': {
        '@type': 'oa:SpecificResource',
        'full': v3anno.target.id
      },
      'resource': {
        '@type': 'dctypes:Text',
        'format': 'text/html',
        'chars': v3anno.body.value
      }
    };
    // copy id if it is SAS-generated
    if (v3anno.id && v3anno.id.startsWith('http')) {
        v2anno['@id'] = v3anno.id;
    }
    if (v3anno.target.selector.type === 'SvgSelector') {
      v2anno.on.selector = {
        '@type': 'oa:SvgSelector',
        'value': v3anno.target.selector.value
      }
    }
    if (v3anno.body.language) {
      v2anno.resource.language = v3anno.body.language;
    }
    return v2anno;
  }

  /** Creates an AnnotationPage from a list of V2 annotations */
  createAnnotationPage(v2annos) {
    if (Array.isArray(v2annos)) {
        let v3annos = v2annos.map(this.createV3Anno);
        return {
          'id': this.annotationPageId,
          'items': v3annos,
          'type': 'AnnotationPage',
        };
    }
    return v2annos;
  }

  /** Creates a V3 annotation from a V2 annotation */
  createV3Anno(v2anno) {
    let v3anno = {
      'type': 'Annotation',
      'motivation': 'commenting',
      'id': v2anno['@id'],
      'target': {
        'id': v2anno.on.full
      },
      'body': {
        'type': 'TextualBody',
        'value': v2anno.resource[0].chars
      }
    };
    if (v2anno.on.selector['@type'] === 'oa:SvgSelector') {
      v3anno.target.selector = {
        'type': 'SvgSelector',
        'value': v2anno.on.selector.value
      }
    }
    if (v2anno.resource[0].language) {
      v3anno.body.language = v2anno.resource[0].language;
    }
    return v3anno;
  }

}
