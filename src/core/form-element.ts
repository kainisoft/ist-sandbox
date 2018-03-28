import { Input, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { BaseInput } from 'ionic-angular/util/base-input';

import { CustomForm } from './form';

import { noWhitespaceValidator } from '../forms/validators/no-whitespace.validator';

export class FormElement implements AfterViewInit {

  @Input()
  element: Element;

  @ViewChild('input')
  input: BaseInput<any>;

  constructor() { }

  ngAfterViewInit(): void {
    this.element.setElement(this);
  }

  getElement(): AbstractControl {
    return this.element.getParent().get(this.element.getName());
  }

  setFocus(): void {
    if (this.input) {
      this.input.getNativeElement().focus();
    }
  }

}

export abstract class Element {
  protected element: FormElement;
  protected name: string;
  protected label: string;
  protected icon: string;
  protected placeholder: string;
  protected validators: ValidatorFn[] = [];
  protected parent: CustomForm;

  value: any;

  constructor(name: string) {
    this.name = name;
  }

  abstract getType(): ElementTypes;

  getElement(): FormElement {
    return this.element;
  }

  setElement(element: FormElement): void {
    this.element = element;
  }

  getName(): string {
    return this.name;
  }

  getLabel(): string {
    return this.label;
  }

  setLabel(label: string): void {
    this.label = label;
  }

  getIcon(): string {
    return this.icon;
  }

  setIcon(icon: string): void {
    this.icon = icon;
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

  setPlaceHolder(placeholder: string): void {
    this.placeholder = placeholder;
  }

  addValidator(validator: ValidatorFn): void {
    this.validators.push(validator);
  }

  getValidators(): ValidatorFn[] {
    return this.validators;
  }

  getValue(): any {
    return this.value;
  }

  setValue(value: any): void {
    this.value = value;
  }

  setRequired(): void {
    this.addValidator(Validators.required);
    this.addValidator(noWhitespaceValidator());
  }

  getParent(): CustomForm {
    return this.parent;
  }

  setParent(form: CustomForm): void {
    this.parent = form;
  }

  setFocus(): void {
    this.element.setFocus();
  }

  toFormControl(): FormControl {
    return new FormControl(this.getValue(), this.getValidators());
  }
}

export enum ElementTypes {
  TEXT,
  EMAIL,
  PASSWORD,
  DATE_TIME,
  SELECT,
  TEXT_AREA,
  NUMBER,
  TAG
}
