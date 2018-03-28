import { Component, Input, OnInit } from '@angular/core';

import { FormElement, Element, ElementTypes } from '../../../core/form-element';

export interface InnerOptions {
  value: string;
  label: string;
}

@Component({
  selector: 'select-input',
  templateUrl: 'select.html'
})
export class SelectElementComponent extends FormElement implements OnInit {
  options: InnerOptions[];

  @Input()
  element: SelectElement;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const options = this.element.getOptions();
    const innerOptions = [];

    Object.keys(options).forEach((key: string) => {
      innerOptions.push({
        value: key,
        label: options[key]
      });
    });

    this.options = innerOptions;
  }

  trackByFn(index: number, item: InnerOptions): string {
    return item.value;
  }
}

export class SelectElement extends Element {
  protected multiple: boolean = false;
  protected options: SelectElementOptions;

  getType(): ElementTypes {
    return ElementTypes.SELECT;
  }

  getMultiple(): boolean {
    return this.multiple;
  }

  setMultiple(value: boolean): void {
    this.multiple = value;
  }

  getOptions(): SelectElementOptions {
    return this.options;
  }

  setOptions(options: SelectElementOptions | string[]): void {
    if (Array.isArray(options)) {
      const opt = {};

      options.forEach(key => {
        opt[key] = key;
      });

      this.options = opt;
    } else {
      this.options = options;
    }
  }

}

export interface SelectElementOptions {
  [value: string]: string;
}
