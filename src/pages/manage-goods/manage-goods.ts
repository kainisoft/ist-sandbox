import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { FirebaseError } from 'firebase';

import { CustomComponent } from '../../core/component';

import { GoodsForm } from '../../forms/goods';

import { PhotoTypes } from '../../interfaces/photo';
import { StoragePhoto } from '../../interfaces/storage';
import { Goods } from '../../interfaces/store';

import { AppService } from '../../providers/app';
import { StoreService } from '../../providers/store';
import { LocalizeService } from '../../providers/localize';
import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { PhotoService } from '../../providers/photo';

@Component({
  selector: 'page-manage-goods',
  templateUrl: 'manage-goods.html',
})
export class ManageGoodsPage extends CustomComponent implements OnInit {
  form: GoodsForm = new GoodsForm();
  photos: StoragePhoto[] = [];
  photoTypes = PhotoTypes;
  goods: Goods;
  goodsId: string = this.navParams.get('goodsId');

  constructor(protected appService: AppService,
              protected localizeService: LocalizeService,
              protected storeService: StoreService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected photoService: PhotoService,
              protected navParams: NavParams) {
    super();
  }

  ngOnInit(): void {
    this.initGoods();
  }

  protected initGoods(): void {
    if (!this.goodsId) {
      return;
    }

    this.hub.push(this.storeService.find(this.goodsId).subscribe(goods => {
      this.goods = goods;
      this.form.patchValue(this.goods);
    }));
  }

  async proceedGoods(): Promise<any> {
    if (!this.form.valid) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const goodsEntity = await this.saveGoods();

      await this.photoService.uploadList(PhotoTypes.GOODS, goodsEntity.id, [...this.photos]);

      return this.navigatorService.pop();
    }
    catch (error) {
      return await this.handlerError(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async saveGoods(): Promise<Goods> {
    const goods = {
      uid: this.authService.currentUserUid(),
      ...this.goods,
      ...this.form.getValues()
    };

    return await this.storeService.save(goods);
  }

  protected async handlerError(error: FirebaseError): Promise<any> {
    let message;

    switch (error.code) {
      case 'storage/unauthorized':
        message = await this.localizeService.getText('UPLOAD_ERROR');
        break;
      default:
        return console.dir(error);
    }

    return await this.appService.presentToast(message);
  }

}
