import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-items',
  templateUrl: 'no-items.html'
})
export class NoItemsComponent {

  @Input()
  icon?: string = 'alert';

  @Input()
  message?: string = 'No items';

  constructor() { }

}
