import { Component } from '@angular/core';

import { Element, ElementTypes, FormElement } from '../../../core/form-element';

@Component({
  selector: 'text-input',
  templateUrl: 'text.html'
})
export class TextElementComponent extends FormElement {

  constructor() {
    super();
  }

}

export class TextElement extends Element {

  getType(): ElementTypes {
    return ElementTypes.TEXT;
  }

}
