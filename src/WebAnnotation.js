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
      if (target.selector) {
        // add fragment selector
        target.selector = [
          {
            type: 'FragmentSelector',
            value: `xywh=${this.xywh}`
          },
          target.selector
        ]
      } else {
        // just target with fragment
        target += `#xywh=${this.xywh}`;
      }
    }
    return target;
  }
}
