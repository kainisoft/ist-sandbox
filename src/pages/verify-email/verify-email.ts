import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from 'ionic-angular';
import * as firebase from 'firebase';

import { CustomComponent } from '../../core/component';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { AppService } from '../../providers/app';
import { LocalizeService } from '../../providers/localize';

import { AuthPage } from '../auth/auth';
import { CompleteProfilePage } from '../complete-profile/complete-profile';

@Component({
  selector: 'page-verify-email',
  templateUrl: 'verify-email.html'
})
export class VerifyEmailPage extends CustomComponent implements OnInit, OnDestroy {
  private timer: number;

  user: firebase.User;

  constructor(protected platform: Platform,
              protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected localizeService: LocalizeService,
              protected appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser();

    this.hub.push(this.platform.pause.subscribe(() => {
      this.clearInterval();
    }));

    this.hub.push(this.platform.resume.subscribe(() => {
      this.setInterval();
    }));

    this.setInterval();
  }

  async resending(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.authService.userSendEmailVerification(this.user);

      return await this.appService.presentToast(
        await this.localizeService.getText('Message is sent')
      );
    } catch (error) {
      console.dir('Resending error', error);
    } finally {
      await this.appService.dismissLoading();
    }
  }

  async signOut(): Promise<any> {
    await this.navigatorService.setRoot(AuthPage);
    await this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.clearInterval();
    super.ngOnDestroy();
  }

  private setInterval(): void {
    this.clearInterval();
    this.checkIsVerified();
  }

  private async checkIsVerified(): Promise<any> {
    await this.authService.currentUser().reload();

    if (this.user.emailVerified) {
      await this.navigatorService.setRoot(CompleteProfilePage);
    } else {
      this.timer = setInterval(() => {
        this.authService.currentUser().reload().then(() => {
          if (!this.user.emailVerified) {
            return;
          }

          this.navigatorService.setRoot(CompleteProfilePage);
        });
      }, 5000);
    }
  }

  private clearInterval(): void {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

}
