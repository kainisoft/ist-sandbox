import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

import { User, PresenceStatus } from '../../interfaces/user';

import { AuthService } from '../../providers/auth';
import { AppService } from '../../providers/app';
import { LocalizeService } from '../../providers/localize';
import { NavigatorService } from '../../providers/navigator';
import { UserService } from '../../providers/user';

import { LoginForm, LoginFormError } from '../../forms/login';
import { JoinForm, JoinFormError } from '../../forms/join';

import { SplashScreenPage } from '../splash-screen/splash-screen';
import { VerifyEmailPage } from '../verify-email/verify-email';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { TermsOfUsePage } from '../terms-of-use/terms-of-use';

export enum FormTypes {
  SIGNIN,
  SIGNUP
}

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
  formTypes = FormTypes;
  formType: FormTypes = FormTypes.SIGNIN;

  loginForm: LoginForm;
  joinForm: JoinForm;

  constructor(private authService: AuthService,
              private appService: AppService,
              private localizeService: LocalizeService,
              private navigatorService: NavigatorService,
              private userService: UserService,
              protected navParams: NavParams) {
  }

  ngOnInit(): void {
    this.initForm();

    const {emailChanged} = this.navParams.data;

    if (emailChanged) {
      this.localizeService.getText('Please, activate your email address')
        .then(message => {
          return this.appService.presentToast(message);
        });
    }
  }

  private initForm(): void {
    this.loginForm = new LoginForm();
    this.joinForm = new JoinForm();
  }

  async onLogin(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.authService.login(this.loginForm);

      return this.navigatorService.setRoot(SplashScreenPage);
    }
    catch (error) {
      if (error instanceof LoginFormError) {
        return this.appService.presentToast(error.message);
      } else {
        return this.handleError(error);
      }
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  async onJoin(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const firebaseUser: firebase.User = await this.authService.join(this.joinForm);

      const { firstName, lastName, email } = this.joinForm.getValues();
      const user: User = {
        id: firebaseUser.uid,
        profile: {firstName, lastName, email},
        presence: PresenceStatus.ONLINE,
        lang: this.localizeService.getBrowserLang()
      };
      await this.userService.update(user);

      await this.authService.userSendEmailVerification(firebaseUser);

      return this.navigatorService.setRoot(VerifyEmailPage);
    }
    catch (error) {
      if (error instanceof JoinFormError) {
        return this.appService.presentToast(error.message);
      } else {
        return this.handleError(error);
      }
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  resetPassword(): Promise<any> {
    return this.navigatorService.setRoot(ResetPasswordPage);
  }

  private async handleError(error: any): Promise<any> {
    let message: string;

    switch (error.code) {
      case 'auth/user-disabled':
        message = await this.localizeService.getText('BAN_ACCOUNT', {email: 'kainisoft@gmail.com'}); // TODO use conf email
        break;
      case 'auth/user-not-found':
        message = await this.localizeService.getText('Account not found');
        break;
      case 'auth/wrong-password':
        message = await this.localizeService.getText('Wrong password');
        break;
      case 'auth/email-already-in-use':
        message = await this.localizeService.getText('The email address is already in use by another account');
        break;
      default:
        console.dir(error);

        return;
    }

    return this.appService.presentToast(message);
  }

  openTermsOfUse(): Promise<any> {
    return this.navigatorService.push(TermsOfUsePage);
  }
}
