/** */
export default class WebAnnotation {
  /** */
  constructor({
    canvasId, id, xywh, body, tags, svg,
  }) {
    this.id = id;
    this.canvasId = canvasId;
    this.xywh = xywh;
    this.body = body;
    this.tags = tags;
    this.svg = svg;
  }

  /** */
  toJson() {
    return {
      body: this.createBody(),
      id: this.id,
      motivation: 'commenting',
      target: this.target(),
      type: 'Annotation',
    };
  }

  createBody() {
    const tbody = {
      language: 'en',
      type: 'TextualBody',
      value: this.body,
    };
    if (this.tags) {
      const bodies = [tbody].concat(this.tags.map((tag) => ({
        type: 'TextualBody',
        purpose: 'tagging',
        value: tag,
      })));
      return bodies;
    }
    return tbody;
  }

  /** */
  target() {
    let target = this.canvasId;
    if (this.svg) {
      target = {
        id: this.canvasId, // should be source, see #25
        selector: {
          type: 'SvgSelector',
          value: this.svg,
        },
      };
    }
    if (this.xywh) {
      const fragmentselector = {
        type: 'FragmentSelector',
        value: `xywh=${this.xywh}`,
      };
      if (target.selector) {
        // add fragment selector
        target.selector = [
          fragmentselector,
          target.selector,
        ];
      } else {
        target = {
          id: this.canvasId, // should be source, see #25
          selector: fragmentselector,
        };
      }
    }
    return target;
  }
}
