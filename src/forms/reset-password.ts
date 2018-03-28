import { AbstractControl } from '@angular/forms';

import { CustomError } from '../core/error';
import { CustomForm, FormControls } from '../core/form';
import { Element } from '../core/form-element';

import { EmailElement } from './elements/email/email';

export const RESET_PASSWORD_EMAIL_INPUT = 'email';

export class ResetPasswordForm extends CustomForm {

  constructor() {
    super();

    const email = new EmailElement(RESET_PASSWORD_EMAIL_INPUT);
    email.setRequired();
    email.setIcon('mail');
    email.setPlaceHolder('Please, enter your Email');
    this.addElement(email);
  }

  getEmail(): Element {
    return this.getElement(RESET_PASSWORD_EMAIL_INPUT);
  }

  getControls(): ResetPasswordFormControls {
    return {email: this.get(RESET_PASSWORD_EMAIL_INPUT)};
  }

}

export class ResetPasswordFormError extends CustomError {

  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ResetPasswordFormError.prototype);
  }

}

export interface ResetPasswordFormControls extends FormControls {
  email: AbstractControl;
}
