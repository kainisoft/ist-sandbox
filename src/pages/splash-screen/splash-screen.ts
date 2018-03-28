import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { UserService } from '../../providers/user';
import { UserStatusService } from '../../providers/user-status';

import { AuthPage } from '../auth/auth';
import { VerifyEmailPage } from '../verify-email/verify-email';
import { IndexPage } from '../index';
import { CompleteProfilePage } from '../complete-profile/complete-profile';

@Component({
  selector: 'page-splash-screen',
  templateUrl: 'splash-screen.html',
})
export class SplashScreenPage extends CustomComponent {

  constructor(protected platform: Platform,
              protected authService: AuthService,
              protected userService: UserService,
              protected userStatusService: UserStatusService,
              protected navigatorService: NavigatorService) {
    super();
  }

  async ngOnInit(): Promise<any> {
    await this.platform.ready();

    this.hub.push(
      this.authService.afAuth.authState.subscribe(() => this.handleAuthSubscription())
    );
  }

  protected handleAuthSubscription(): void {
    if (this.authService.isAuthenticated()) {
      this.handleIfAuthenticated();
    } else {
      this.navigatorService.setRoot(AuthPage);
    }
  }

  protected handleIfAuthenticated(): void {
    if (!this.authService.isVerified()) {
      this.navigatorService.setRoot(VerifyEmailPage);
    } else {
      this.userStatusService.find(this.authService.currentUserUid()).take(1).subscribe(userStatus => {
        if (userStatus && userStatus.isCompleted) {
          this.navigatorService.setRoot(IndexPage, {
            title: 'Index page'
          });
        } else {
          this.navigatorService.setRoot(CompleteProfilePage);
        }
      });
    }
  }

}
