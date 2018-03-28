import { CustomForm, FormValues } from '../core/form';
import { Element } from '../core/form-element';

import { TextElement } from './elements/text/text';
import { TextAreaElement } from './elements/text-area/text-area';

const NAME_ELEMENT = 'name';
const PRICE_ELEMENT = 'price';
const DESC_ELEMENT = 'desc';

export class GoodsForm extends CustomForm {
  constructor() {
    super();

    const name = new TextElement(NAME_ELEMENT);
    name.setRequired();
    name.setLabel('Name');
    name.setPlaceHolder('Two, three words');
    this.addElement(name);

    const price = new TextElement(PRICE_ELEMENT);
    price.setRequired();
    price.setLabel('Price');
    this.addElement(price);

    const desc = new TextAreaElement(DESC_ELEMENT);
    desc.setPlaceHolder('Description');
    this.addElement(desc);
  }

  getName(): Element {
    return this.getElement(NAME_ELEMENT);
  }

  getPrice(): Element {
    return this.getElement(PRICE_ELEMENT);
  }

  getDesc(): Element {
    return this.getElement(DESC_ELEMENT);
  }

  getValues(): GoodsFormValues {
    return {
      name: this.getName().getValue(),
      price: this.getPrice().getValue(),
      desc: this.getDesc().getValue()
    };
  }

}

export interface GoodsFormValues extends FormValues {
  name: string;
  price: string;
  desc: string;
}
