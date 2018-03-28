import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { LoginForm, LoginFormError } from '../forms/login';
import { JoinForm, JoinFormError } from '../forms/join';
import { ResetPasswordForm, ResetPasswordFormError } from '../forms/reset-password';

import { LocalizeService } from './localize';

@Injectable()
export class AuthService {
  constructor(private localizeService: LocalizeService,
              public afAuth: AngularFireAuth) {

  }

  currentUser(): firebase.User {
    return this.afAuth.auth.currentUser;
  }

  currentUserUid(): string | null {
    return this.isAuthenticated()
      ? this.currentUser().uid
      : null;
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  isVerified(): boolean {
    return this.isAuthenticated() && this.currentUser().emailVerified;
  }

  async login(form: LoginForm): Promise<firebase.User> {
    await this.checkLoginForm(form);

    const { email, password } = form.getValues();
    const user: firebase.User = await this.afAuth.auth.signInWithEmailAndPassword(email, password);

    return user;
  }

  async join(form: JoinForm): Promise<firebase.User> {
    await this.checkJoinFormIsValid(form);

    const { email, password } = form.getValues();
    const user: firebase.User = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

    return user;
  }

  async resetPassword(form: ResetPasswordForm): Promise<any> {
    await this.checkResetPasswordForm(form);

    this.afAuth.auth.useDeviceLanguage();

    return await this.afAuth.auth.sendPasswordResetEmail(
      form.getControls().email.value
    );
  }

  async userSendEmailVerification(user: firebase.User): Promise<null> {
    if (user.emailVerified) {
      return;
    }

    this.afAuth.auth.useDeviceLanguage();

    return user.sendEmailVerification();
  }

  signOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  protected async checkJoinFormIsValid(form: JoinForm): Promise<any> {
    if (form.valid) {
      return;
    }

    const {firstName, lastName} = form.getControls();

    if (!firstName.valid) {
      throw new JoinFormError(
        await this.localizeService.getText('Please, enter your First Name')
      );
    } else if (!lastName.valid) {
      throw new JoinFormError(
        await this.localizeService.getText('Please, enter your Last Name')
      );
    } else {
      try {
        await this.checkLoginForm(form);
      } catch (error) {
        throw new JoinFormError(error.message);
      }
    }
  }

  async updateEmail(email: string): Promise<any> {
    try {
      await this.afAuth.auth.currentUser.updateEmail(email);
    } catch (error) {

    }
  }

  protected async checkLoginForm(form: LoginForm): Promise<any> {
    if (form.valid) {
      return;
    }

    const { email, password } = form.getControls();
    let message;

    if (!email.valid && !password.valid && !email.value && !password.value) {
      message = await this.localizeService.getText('Please, enter Email and password');
    } else if (!email.valid) {
      message = await this.localizeService.getText('Please, enter valid Email address');
    } else if (!password.valid) {
      message = await this.localizeService.getText('The password is too weak');
    } else {
      return;
    }

    throw new LoginFormError(message);
  }

  protected async checkResetPasswordForm(form: ResetPasswordForm): Promise<any> {
    if (form.valid) {
      return;
    }

    const emailControl = form.getControls().email;
    const { required, email } = emailControl.errors;
    let message;

    if (required) {
      message = await this.localizeService.getText('Please, enter your Email');
    } else if (email) {
      message = await this.localizeService.getText('Please, enter valid Email address');
    } else {
      return;
    }

    throw new ResetPasswordFormError(message);
  }

}
