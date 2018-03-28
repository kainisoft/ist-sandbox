import { Component, Input, OnInit } from '@angular/core';

import { Element, ElementTypes } from '../../core/form-element';

@Component({
  selector: 'element-builder',
  templateUrl: 'element-builder.html'
})
export class ElementBuilderComponent implements OnInit {
  elementTypes = ElementTypes;

  @Input()
  element: Element;

  constructor() {

  }

  ngOnInit(): void {

  }

}
