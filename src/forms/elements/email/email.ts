import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import { Element, ElementTypes, FormElement } from '../../../core/form-element';

@Component({
  selector: 'email-input',
  templateUrl: 'email.html'
})
export class EmailElementComponent extends FormElement {

  constructor() {
    super();
  }

}

export class EmailElement extends Element {

  getType(): ElementTypes {
    return ElementTypes.EMAIL;
  }

  setRequired(): void {
    super.setRequired();
    this.addValidator(Validators.email);
  }

}
