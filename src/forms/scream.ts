import { CustomForm, FormValues } from '../core/form';
import { Element } from '../core/form-element';

import { TextAreaElement } from './elements/text-area/text-area';
import { TextElement } from './elements/text/text';

export const TITLE_ELEMENT = 'title';
export const DESC_ELEMENT = 'desc';

export class ScreamForm extends CustomForm {

  constructor() {
    super();

    const title = new TextElement(TITLE_ELEMENT);
    title.setRequired();
    title.setLabel('Name');
    title.setPlaceHolder('Two, three words');
    this.addElement(title);

    const desc = new TextAreaElement(DESC_ELEMENT);
    desc.setPlaceHolder('Description');
    this.addElement(desc);
  }

  getTitle(): Element {
    return this.getElement(TITLE_ELEMENT);
  }

  getDesc(): Element {
    return this.getElement(DESC_ELEMENT);
  }

  getValues(): ScreamFormValues {
    return {
      title: this.getTitle().getValue(),
      desc: this.getDesc().getValue()
    };
  }

}

export interface ScreamFormValues extends FormValues {
  title: string;
  desc: string;
}
