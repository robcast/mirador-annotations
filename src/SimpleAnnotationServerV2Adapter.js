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
  async create(webanno) {
    const annotation = this.convertV3Anno(webanno);
    return fetch(`${this.endpointUrl}/create`, {
      body: JSON.stringify(annotation),
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
    return fetch(`${this.endpointUrl}/${encodeURIComponent(annotation.id)}`, {
      body: JSON.stringify({
        annotation: {
          data: JSON.stringify(annotation),
          uuid: annotation.id,
        },
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    })
      .then((response) => this.all())
      .catch(() => this.all());
  }

  /** */
  async delete(annoId) {
    return fetch(`${this.endpointUrl}/${encodeURIComponent(annoId)}`, {
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
    return (await fetch(`${this.endpointUrl}/${encodeURIComponent(annoId)}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })).json().then((anno) => this.convertV2Anno(anno));
  }

  /** */
  async all() {
    return (await fetch(this.annotationPageId)).json().then((annos) => this.convertV2AnnoList(annos));
  }
  
  convertV3Anno(v3anno) {
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

  convertV2AnnoList(v2annos) {
    if (Array.isArray(v2annos)) {
        return v2annos.forEach(this.convertV2Anno);
    }
    return v2annos;
  }

  convertV2Anno(v2anno) {
    let v3anno = {
      'type': 'Annotation',
      'motivation': 'commenting',
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
