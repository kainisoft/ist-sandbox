import { CustomForm } from '../core/form';
import { Element } from '../core/form-element';

import { TextElement } from './elements/text/text';

export const MESSAGE_ELEMENT = 'message';

export class ChatForm extends CustomForm {
  constructor() {
    super();

    const message = new TextElement(MESSAGE_ELEMENT);
    message.setPlaceHolder('Type a message');
    this.addElement(message);
  }

  getMessage(): Element {
    return this.getElement(MESSAGE_ELEMENT);
  }

}
