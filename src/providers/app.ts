import { Injectable } from '@angular/core';

import { Loading, LoadingController, ToastController } from 'ionic-angular';

import { LocalizeService } from './localize';

const TOAST_DURATION = 5000;

@Injectable()
export class AppService {
  private loadingInstance: Loading;

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private localizeService: LocalizeService) {

  }

  presentToast(message: string, duration: number = TOAST_DURATION): Promise<any> {
    return this.toastCtrl.create({message, duration}).present();
  }

  async presentPleaseWait(): Promise<any> {
    await this.presentLoading(
      await this.localizeService.getText('Please, wait...')
    );
  }

  async presentLoading(content: string): Promise<any> {
    await this.dismissLoading();

    this.loadingInstance = this.loadingCtrl.create({content});
    await this.loadingInstance.present();
  }

  async dismissLoading(): Promise<any> {
    this.loadingInstance && await this.loadingInstance.dismiss();
    this.loadingInstance = null;
  }

}
