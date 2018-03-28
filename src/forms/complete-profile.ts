import 'rxjs/add/operator/debounceTime';

import { CustomForm, FormValues } from '../core/form';
import { Element } from '../core/form-element';

import { DateTimeElement } from './elements/date-time/date-time';
import { SelectElement } from './elements/select/select';

export const YEAR_ELEMENT = 'year';
export const VOLUME_ELEMENT = 'volume';

export class CompleteProfileForm extends CustomForm {
  constructor() {
    super();

    const dateTime = new DateTimeElement(YEAR_ELEMENT);
    dateTime.setRequired();
    dateTime.setLabel('Year');
    dateTime.setDisplayFormat('YYYY');
    dateTime.setValue('');
    this.addElement(dateTime);

    const select = new SelectElement(VOLUME_ELEMENT);
    select.setRequired();
    select.setLabel('Volume');
    select.setOptions({
      '1.3': '1.3',
      '1.5': '1.5'
    });
    this.addElement(select);
  }

  getYear(): Element {
    return this.getElement(YEAR_ELEMENT);
  }

  getVolume(): Element {
    return this.getElement(VOLUME_ELEMENT);
  }

}

export interface CompleteProfileFormValues extends FormValues {
  year: number;
  volume: string;
}
