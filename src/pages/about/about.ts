import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage extends CustomPage {

  constructor(protected navParams: NavParams) {
    super(navParams);
  }

}
