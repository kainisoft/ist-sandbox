import { AbstractControl, ValidatorFn } from '@angular/forms';

export const noWhitespaceValidator = (): ValidatorFn => {
  return (control: AbstractControl): {[key: string]: any} => {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;

    return isValid ? null : { 'whitespace': 'value is only whitespace' };
  };
};
