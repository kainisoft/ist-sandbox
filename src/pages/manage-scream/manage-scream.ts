import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { FirebaseError } from 'firebase';

import { CustomComponent } from '../../core/component';

import { ScreamForm } from '../../forms/scream';

import { StoragePhoto } from '../../interfaces/storage';
import { PhotoTypes } from '../../interfaces/photo';
import { Scream } from '../../interfaces/scream';

import { AppService } from '../../providers/app';
import { LocalizeService } from '../../providers/localize';
import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { PhotoService } from '../../providers/photo';
import { ScreamService } from '../../providers/scream';

@Component({
  selector: 'page-manage-goods',
  templateUrl: 'manage-scream.html',
})
export class ManageScreamPage extends CustomComponent implements OnInit {
  form: ScreamForm = new ScreamForm();
  photos: StoragePhoto[] = [];
  photoTypes = PhotoTypes;
  scream: Scream;

  protected screamId: string = this.navParams.get('screamId');

  constructor(protected appService: AppService,
              protected localizeService: LocalizeService,
              protected screamService: ScreamService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected photoService: PhotoService,
              protected navParams: NavParams) {
    super();
  }

  ngOnInit(): void {
    this.initScream();
  }

  protected initScream(): void {
    if (!this.screamId) {
      return;
    }

    this.hub.push(this.screamService.find(this.screamId).subscribe(scream => {
      this.scream = scream;
      this.form.patchValue(this.scream);
    }));
  }

  async proceedScream(): Promise<any> {
    if (!this.form.valid) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const screamEntity = await this.saveScream();

      await this.photoService.uploadList(PhotoTypes.SCREAM, screamEntity.id, [...this.photos]);

      return await this.navigatorService.pop();
    }
    catch (error) {
      return await this.handlerError(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async saveScream(): Promise<Scream> {
    const scream: Scream = {
      uid: this.authService.currentUserUid(),
      ...this.scream,
      ...this.form.getValues()
    };

    return await this.screamService.save(scream);
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
