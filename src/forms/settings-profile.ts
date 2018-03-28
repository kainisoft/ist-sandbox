import { CustomForm } from '../core/form';
import { Element } from '../core/form-element';

import { TextElement } from './elements/text/text';
import { DateTimeElement } from './elements/date-time/date-time';
import { EmailElement } from './elements/email/email';

const FIRST_NAME_ELEMENT = 'firstName';
const LAST_NAME_ELEMENT = 'lastName';
const BIRTH_DAY_ELEMENT = 'birthDay';
const EMAIL_ELEMENT = 'email';

export class SettingsProfileForm extends CustomForm {

  constructor() {
    super();

    const firstName = new TextElement(FIRST_NAME_ELEMENT);
    firstName.setRequired();
    firstName.setLabel('First Name');
    this.addElement(firstName);

    const lastName = new TextElement(LAST_NAME_ELEMENT);
    lastName.setRequired();
    lastName.setLabel('Last Name');
    this.addElement(lastName);

    const birthDay = new DateTimeElement(BIRTH_DAY_ELEMENT);
    birthDay.setLabel('Birth Day');
    this.addElement(birthDay);

    const email = new EmailElement(EMAIL_ELEMENT);
    email.setRequired();
    email.setLabel('E-mail');
    this.addElement(email);
  }

  getFirstName(): Element {
    return this.getElement(FIRST_NAME_ELEMENT);
  }

  getLastName(): Element {
    return this.getElement(LAST_NAME_ELEMENT);
  }

  getBirthDay(): Element {
    return this.getElement(BIRTH_DAY_ELEMENT);
  }

  getEmail(): Element {
    return this.getElement(EMAIL_ELEMENT);
  }

}
