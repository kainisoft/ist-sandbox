import { Validators, AbstractControl } from '@angular/forms';

import { CustomError } from '../core/error';
import { CustomForm, FormControls, FormValues } from '../core/form';
import { Element } from '../core/form-element';

import { EmailElement } from './elements/email/email';
import { PasswordElement } from './elements/password/password';

export const LOGIN_EMAIL_INPUT = 'email';
export const LOGIN_PASSWORD_INPUT = 'password';

export class LoginForm extends CustomForm {
  constructor() {
    super();

    const email = new EmailElement(LOGIN_EMAIL_INPUT);
    email.setRequired();
    email.setIcon('mail');
    email.setPlaceHolder('Please, enter your Email');
    this.addElement(email);

    const password = new PasswordElement(LOGIN_PASSWORD_INPUT);
    password.setRequired();
    password.addValidator(Validators.minLength(6));
    password.addValidator(Validators.maxLength(100));
    password.setIcon('lock');
    password.setPlaceHolder('Please, enter your password');
    this.addElement(password);
  }

  getEmail(): Element {
    return this.getElement(LOGIN_EMAIL_INPUT);
  }

  getPassword(): Element {
    return this.getElement(LOGIN_PASSWORD_INPUT);
  }

  getControls(): LoginFormControls {
    return {
      email: this.get(LOGIN_EMAIL_INPUT),
      password: this.get(LOGIN_PASSWORD_INPUT)
    };
  }

  getValues(): LoginFormValues {
    return {
      email: this.getElement(LOGIN_EMAIL_INPUT).getValue(),
      password: this.getElement(LOGIN_PASSWORD_INPUT).getValue()
    };
  }

}

export class LoginFormError extends CustomError {

  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LoginFormError.prototype);
  }

}

export interface LoginFormControls extends FormControls {
  email: AbstractControl;
  password: AbstractControl;
}

export interface LoginFormValues extends FormValues {
  email: string;
  password: string;
}
