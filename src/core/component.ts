import { OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

export class CustomComponent implements OnDestroy {
  protected hub: Subscription[] = [];

  constructor() { }

  protected clearSubscriptions(): void {
    this.hub.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.hub = [];
  }

  ngOnDestroy(): void {
    this.clearSubscriptions();
  }

}
