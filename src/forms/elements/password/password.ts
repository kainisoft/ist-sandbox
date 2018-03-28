import { Component } from '@angular/core';

import { Element, ElementTypes, FormElement } from '../../../core/form-element';

@Component({
  selector: 'password-input',
  templateUrl: 'password.html'
})
export class PasswordElementComponent extends FormElement {

  constructor() {
    super();
  }

}

export class PasswordElement extends Element {

  getType(): ElementTypes {
    return ElementTypes.PASSWORD;
  }

}
