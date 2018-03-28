import { Component, OnInit } from '@angular/core';

import { ResetPasswordForm, ResetPasswordFormError } from '../../forms/reset-password';

import { NavigatorService } from '../../providers/navigator';
import { AuthService } from '../../providers/auth';
import { AppService } from '../../providers/app';
import { LocalizeService } from '../../providers/localize';

import { AuthPage } from '../auth/auth';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage implements OnInit {

  form: ResetPasswordForm;

  constructor(private navigatorService: NavigatorService,
              private appService: AppService,
              private authService: AuthService,
              private localizeService: LocalizeService) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new ResetPasswordForm();
  }

  back(): void {
    this.navigatorService.setRoot(AuthPage);
  }

  async send(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.authService.resetPassword(this.form);

      const message = await this.localizeService.getText('RESET_PASSWORD_MESSAGE', {
        email: this.form.getControls().email.value
      });

      return this.appService.presentToast(message);
    } catch (error) {
      let result;

      if (error instanceof ResetPasswordFormError) {
        result = this.appService.presentToast(error.message);
      } else {
        result = this.handleError(error);
      }

      return result;
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  private async handleError(error: any): Promise<any> {
    let message: string;

    switch (error.code) {
      case 'auth/user-not-found':
        message = await this.localizeService.getText('Account not found');
        break;
      default:
        console.dir(error);

        return;
    }

    return this.appService.presentToast(message);
  }

}
