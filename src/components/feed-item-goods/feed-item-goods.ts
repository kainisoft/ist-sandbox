import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { FeedGoods } from '../../interfaces/feed';
import { Goods } from '../../interfaces/store';
import { PhotoTypes } from '../../interfaces/photo';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';
import { StoreService } from '../../providers/store';
import { AuthService } from '../../providers/auth';

@Component({
  selector: 'feed-item-goods',
  templateUrl: 'feed-item-goods.html'
})
export class FeedItemGoodsComponent extends CustomComponent implements OnInit {
  goods: Goods;
  photoTypes = PhotoTypes;

  @Input()
  feedEntity: FeedGoods;

  constructor(protected userService: UserService,
              protected storeService: StoreService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.initGoods();
  }

  protected initGoods(): void {
    this.hub.push(this.storeService.find(this.feedEntity.data.id).subscribe(goods => {
      if (!goods) {
        return;
      }

      this.goods = goods;
    }));
  }

}
