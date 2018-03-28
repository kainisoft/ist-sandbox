import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { NavigatorService } from '../../providers/navigator';

import { ManageGoodsPage } from '../manage-goods/manage-goods';

@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage extends CustomPage {

  constructor(protected navigatorService: NavigatorService,
              protected navParams: NavParams) {
    super(navParams);
  }

  openAddGoodsPage(): Promise<any> {
    return this.navigatorService.push(ManageGoodsPage);
  }

}
