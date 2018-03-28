import { Component } from '@angular/core';

import { Element, ElementTypes, FormElement } from '../../../core/form-element';

@Component({
  selector: 'text-area-input',
  templateUrl: 'text-area.html'
})
export class TextAreaElementComponent extends FormElement {

  constructor() {
    super();
  }

}

export class TextAreaElement extends Element {

  getType(): ElementTypes {
    return ElementTypes.TEXT_AREA;
  }

}
