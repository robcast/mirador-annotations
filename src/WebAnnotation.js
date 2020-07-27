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
    let tbody = {
      language: 'en',
      type: 'TextualBody',
      value: this.body,
    };
    if (this.tags) {
      let bodies = [tbody].concat(this.tags.map((tag) => ({
        type: 'TextualBody',
        purpose: 'tagging',
        value: tag,
      })));
      return bodies;
    } else {
      return tbody;
    }
  }
  
  /** */
  target() {
    let target = this.canvasId;
    if (this.svg) {
      target = {
        id: this.canvasId,
        selector: {
          type: 'SvgSelector',
          value: this.svg,
        }
      }
    }
    if (this.xywh) {
      let fragmentselector = {
        type: 'FragmentSelector',
        value: `xywh=${this.xywh}`
      };
      if (target.selector) {
        // add fragment selector
        target.selector = [
          fragmentselector,
          target.selector
        ]
      } else {
        target = {
          id: this.canvasId,
          selector: fragmentselector
        }
      }
    }
    return target;
  }
}
