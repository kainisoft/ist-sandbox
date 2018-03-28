import { Component, Input, ViewChild } from '@angular/core';

import { DateTime } from 'ionic-angular';

import { FormElement, Element, ElementTypes } from '../../../core/form-element';

import { LocalizeService } from '../../../providers/localize';

@Component({
  selector: 'date-time-input',
  templateUrl: 'date-time.html'
})
export class DateTimeElementComponent extends FormElement {

  @Input()
  element: DateTimeElement;

  @ViewChild('dateTime') dateTime: DateTime;

  constructor(protected localizeService: LocalizeService) {
    super();

    localizeService.getListText(['Cancel', 'Done', 'monthNames'])
      .then(([cancelText, doneText, monthNames]) => {
        this.dateTime.cancelText = cancelText;
        this.dateTime.doneText = doneText;
        this.dateTime.monthNames = monthNames;

        this.dateTime.ngAfterContentInit();
      });
  }

}

export class DateTimeElement extends Element {
  protected displayFormat: string = 'D MMMM YYYY';

  getType(): ElementTypes {
    return ElementTypes.DATE_TIME;
  }

  getDisplayFormat(): string {
    return this.displayFormat;
  }

  setDisplayFormat(displayFormat: string): void {
    this.displayFormat = displayFormat;
  }

}
