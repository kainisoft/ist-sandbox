import { CustomForm } from '../core/form';

import { TextElement } from './elements/text/text';

export const TEXT_ELEMENT = 'text';

export class CommentForm extends CustomForm {
  constructor() {
    super();

    const text = new TextElement(TEXT_ELEMENT);
    text.setPlaceHolder('Write a comment...');
    this.addElement(text);
  }

  getTextElement(): TextElement {
    return this.getElement(TEXT_ELEMENT);
  }

}
