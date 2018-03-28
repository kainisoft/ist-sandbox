import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { AuthService } from '../../providers/auth';

@Component({
  selector: 'page-terms-of-use',
  templateUrl: 'terms-of-use.html',
})
export class TermsOfUsePage extends CustomPage {
  uid: string = this.authService.currentUserUid();

  constructor(protected navParams: NavParams,
              protected authService: AuthService) {
    super(navParams);
  }

}
