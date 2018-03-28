import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';

import { SettingsProfileForm } from '../../forms/settings-profile';

import { NavigatorService } from '../../providers/navigator';
import { UserService } from '../../providers/user';
import { AppService } from '../../providers/app';
import { AuthService } from '../../providers/auth';

import { AuthPage } from '../auth/auth';

@Component({
  selector: 'page-settings-profile',
  templateUrl: 'settings-profile.html',
})
export class SettingsProfilePage extends CustomComponent implements OnInit {
  user: User;
  form: SettingsProfileForm = new SettingsProfileForm();

  constructor(protected navParams: NavParams,
              protected navigatorService: NavigatorService,
              protected userService: UserService,
              protected appService: AppService,
              protected authService: AuthService) {
    super();

  }

  ngOnInit(): void {
    this.user = this.navParams.get('user');

    this.form.patchValue(this.user.profile);
  }

  async ionViewWillLeave(): Promise<any> {
    if (!this.form.valid || this.form.pristine) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const {email, firstName, lastName, birthDay = ''} = this.form.getValues();
      const isEmailChanged = email !== this.user.profile.email;
      this.user.profile = {email, birthDay, firstName, lastName};

      await this.userService.update(this.user);

      if (isEmailChanged) {
        await this.authService.updateEmail(email);

        return await this.navigatorService.setRoot(AuthPage, {emailChanged: true})
          .then(() => {
            return this.authService.signOut();
          });
      }
    }
    catch (error) {
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }
}
