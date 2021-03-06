import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Platform } from 'ionic-angular';

import { CustomComponent } from '../core/component';

import { UserStatus } from '../interfaces/user-status';

import { SplashScreenPage } from '../pages/splash-screen/splash-screen';

import { LocalizeService } from '../providers/localize';
import { AuthService } from '../providers/auth';
import { UserService } from '../providers/user';
import { UserStatusService } from '../providers/user-status';

@Component({
  templateUrl: 'app.html'
})
export class IstApp extends CustomComponent implements OnInit {
  rootPage: any = SplashScreenPage;
  user: UserStatus;

  constructor(protected platform: Platform,
              protected statusBar: StatusBar,
              protected splashScreen: SplashScreen,
              protected localizeService: LocalizeService,
              protected authService: AuthService,
              protected userService: UserService,
              protected userStatusService: UserStatusService) {
    super();
  }

  ngOnInit(): void {
    this.initPlatform();
    this.initLang();
    this.initUser();
  }

  private initPlatform(): void {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.hide();
    });
  }

  private initLang(): void {
    this.localizeService.setDefaultLang(this.localizeService.defaultLanguage);
    this.localizeService.use(this.localizeService.getBrowserLang());
  }

  private initUser(): void {
    this.authService.afAuth.authState.subscribe(user => {
      this.clearSubscriptions();

      if (!user) {
        this.user = null;
      } else {
        this.hub.push(this.userService.find().subscribe(user => {
          if (!user) {
            return;
          }

          if (this.localizeService.currentLang.localeCompare(user.lang) !== 0) {
            this.localizeService.use(user.lang);
          }
        }));
        this.hub.push(this.userStatusService.find(user.uid).subscribe(userStatus => {
          this.user = userStatus;
        }));
      }
    });
  }

}
