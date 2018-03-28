import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage extends CustomPage {

  constructor(protected navParams: NavParams) {
    super(navParams);
  }

}
