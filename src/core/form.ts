import { AbstractControl, FormGroup } from '@angular/forms';

import { Element } from './form-element';

export abstract class CustomForm extends FormGroup {
  protected elements: FromElements = {};

  constructor() {
    super({});
  }

  addElement(element: Element): void {
    if (this.elements[element.getName()]) {
      throw new Error(`Form element ${element.getName()} already exists`);
    }

    this.elements[element.getName()] = element;
    element.setParent(this);

    this.addControl(element.getName(), element.toFormControl());
  }

  hasElement(name: string): boolean {
    return !!this.getElement(name);
  }

  getElement(name: string): Element {
    return this.elements[name] || null;
  }

  getControls(): FormControls {
    return this.controls;
  }

  getValues(): FormValues {
    const result: FormValues = {};

    Object.keys(this.elements).forEach(name => {
      result[name] = this.elements[name].getValue();
    });

    return result;
  }

  reset(): void {
    Object.keys(this.elements).forEach(name => {
      this.elements[name].setValue(null);
    });
  }

  patchValue(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    Object.keys(value).forEach(key => {
      if (this.hasElement(key)) {
        this.getElement(key).setValue(value[key]);
      }
    });

    super.patchValue(value, options);
  }
}

export interface FromElements {
  [name: string]: Element;
}

export interface FormControls {
  [name: string]: AbstractControl;
}

export interface FormValues {
  [name: string]: any;
}
