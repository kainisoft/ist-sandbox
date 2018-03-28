import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { LocalizeService } from '../providers/localize';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(protected localizeService: LocalizeService) {

  }

  transform(value: any, pattern: string = 'longDate'): any {
    const datePipe: DatePipe = new DatePipe(this.localizeService.currentLang);

    return datePipe.transform(value, pattern);
  }

}
