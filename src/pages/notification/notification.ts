import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage extends CustomPage {

  constructor(protected navParams: NavParams) {
    super(navParams);
  }

}
