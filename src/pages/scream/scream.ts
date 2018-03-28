import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { NavigatorService } from '../../providers/navigator';

import { ManageScreamPage } from '../manage-scream/manage-scream';

@Component({
  selector: 'page-scream',
  templateUrl: 'scream.html',
})
export class ScreamPage extends CustomPage {

  constructor(protected navigatorService: NavigatorService,
              protected navParams: NavParams) {
    super(navParams);
  }

  openManageScreamPage(): Promise<any> {
    return this.navigatorService.push(ManageScreamPage);
  }

}
