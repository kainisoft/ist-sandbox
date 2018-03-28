import { AbstractControl } from '@angular/forms';

import { Element } from '../core/form-element';

import {
  LoginForm,
  LoginFormControls,
  LoginFormError,
  LoginFormValues
} from './login';

import { TextElement } from './elements/text/text';

export const JOIN_FIRST_NAME_INPUT = 'first_name';
export const JOIN_LAST_NAME_INPUT = 'last_name';

export class JoinForm extends LoginForm {
  constructor() {
    super();

    const firstName = new TextElement(JOIN_FIRST_NAME_INPUT);
    firstName.setRequired();
    firstName.setIcon('card');
    firstName.setPlaceHolder('First Name');
    this.addElement(firstName);

    const lastName = new TextElement(JOIN_LAST_NAME_INPUT);
    lastName.setRequired();
    lastName.setIcon('card');
    lastName.setPlaceHolder('Last Name');
    this.addElement(lastName);
  }

  getFirstName(): Element {
    return this.getElement(JOIN_FIRST_NAME_INPUT);
  }

  getLastName(): Element {
    return this.getElement(JOIN_LAST_NAME_INPUT);
  }

  getControls(): JoinFormControls {
    const superControls = super.getControls();

    return {
      firstName: this.get(JOIN_FIRST_NAME_INPUT),
      lastName: this.get(JOIN_LAST_NAME_INPUT),
      ...superControls
    };
  }

  getValues(): JoinFormValues {
    const superValues = super.getValues();

    return {
      firstName: this.getElement(JOIN_FIRST_NAME_INPUT).getValue(),
      lastName: this.getElement(JOIN_LAST_NAME_INPUT).getValue(),
      ...superValues
    };
  }

}

export class JoinFormError extends LoginFormError {

  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, JoinFormError.prototype);
  }

}

export interface JoinFormControls extends LoginFormControls {
  firstName: AbstractControl;
  lastName: AbstractControl;
}

export interface JoinFormValues extends LoginFormValues {
  firstName: string;
  lastName: string;
}
