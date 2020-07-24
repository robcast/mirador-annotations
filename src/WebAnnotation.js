/** */
export default class WebAnnotation {
  /** */
  constructor({
    canvasId, id, xywh, body, svg,
  }) {
    this.id = id;
    this.canvasId = canvasId;
    this.xywh = xywh;
    this.body = body;
    this.svg = svg;
  }

  /** */
  toJson() {
    return {
      body: {
        language: 'en',
        type: 'TextualBody',
        value: this.body,
      },
      id: this.id,
      motivation: 'commenting',
      target: this.target(),
      type: 'Annotation',
    };
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
