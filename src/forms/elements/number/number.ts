import { Component } from '@angular/core';

import { Element, ElementTypes, FormElement } from '../../../core/form-element';

@Component({
  selector: 'number-input',
  templateUrl: 'number.html'
})
export class NumberElementComponent extends FormElement {

  constructor() {
    super();
  }

}

export class NumberElement extends Element {

  getType(): ElementTypes {
    return ElementTypes.NUMBER;
  }

}
