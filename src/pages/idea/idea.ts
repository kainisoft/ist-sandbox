import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { NavigatorService } from '../../providers/navigator';

import { ManageIdeaPage } from '../manage-idea/manage-idea';

@Component({
  selector: 'page-idea',
  templateUrl: 'idea.html',
})
export class IdeaPage extends CustomPage {

  constructor(protected navParams: NavParams,
              protected navigatorService: NavigatorService) {
    super(navParams);
  }

  openManageScreamPage(): Promise<any> {
    return this.navigatorService.push(ManageIdeaPage);
  }

}
