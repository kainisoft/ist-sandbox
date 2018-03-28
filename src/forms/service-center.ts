import { CustomForm, FormValues } from '../core/form';
import { Element } from '../core/form-element';

import { TextElement } from './elements/text/text';
import { TextAreaElement } from './elements/text-area/text-area';

const NAME_ELEMENT = 'name';
const PHONE_ELEMENT = 'phone';
const DESC_ELEMENT = 'desc';

export class ServiceCenterForm extends CustomForm {

  constructor() {
    super();

    const name = new TextElement(NAME_ELEMENT);
    name.setRequired();
    name.setLabel('Name');
    this.addElement(name);

    const tel = new TextElement(PHONE_ELEMENT);
    tel.setLabel('Phone');
    this.addElement(tel);

    const desc = new TextAreaElement(DESC_ELEMENT);
    desc.setRequired();
    desc.setLabel('Description');
    this.addElement(desc);
  }

  getName(): Element {
    return this.getElement(NAME_ELEMENT);
  }

  getPhone(): Element {
    return this.getElement(PHONE_ELEMENT);
  }

  getDesc(): Element {
    return this.getElement(DESC_ELEMENT);
  }

  getValues(): ServiceCenterFormValues {
    return {
      name: this.getName().getValue(),
      phone: this.getPhone().getValue(),
      desc: this.getDesc().getValue()
    };
  }

}

export interface ServiceCenterFormValues extends FormValues {
  name: string;
  phone: string;
  desc: string;
}
