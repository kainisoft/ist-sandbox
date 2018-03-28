import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { Goods } from '../../interfaces/store';
import { PhotoTypes } from '../../interfaces/photo';

import { NavigatorService } from '../../providers/navigator';

import { FeedPage } from '../../pages/feed/feed';

@Component({
  selector: 'store-item',
  templateUrl: 'store-item.html'
})
export class StoreItemComponent extends CustomComponent implements OnInit {
  photoTypes = PhotoTypes;

  @Input()
  goods: Goods;

  constructor(protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {

  }

  openFeedPage(): Promise<any> {
    if (!this.goods.feedId) {
      return;
    }

    return this.navigatorService.push(FeedPage, {
      id: this.goods.feedId
    });
  }

}
