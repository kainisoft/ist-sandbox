import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { PhotoUploaderViewMode } from '../../components/photo-uploader/photo-uploader';

import { User } from '../../interfaces/user';
import { PhotoTypes } from '../../interfaces/photo';
import { StoragePhoto } from '../../interfaces/storage';

import { AppService } from '../../providers/app';
import { PhotoService } from '../../providers/photo';

@Component({
  selector: 'page-settings-photo',
  templateUrl: 'settings-photo.html',
})
export class SettingsPhotoPage implements OnInit {
  user: User;
  photos: StoragePhoto[] = [];
  photoTypes = PhotoTypes;
  mode = PhotoUploaderViewMode;

  protected isDirty = false;

  constructor(protected navParams: NavParams,
              protected appService: AppService,
              protected photoService: PhotoService) {
  }

  ngOnInit(): void {
    this.user = this.navParams.get('user');
  }

  async ionViewWillLeave(): Promise<any> {
    if (!this.isDirty) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      await this.photoService.uploadList(PhotoTypes.USER, this.user.id, [...this.photos]);
    }
    catch (error) {
      console.error('photo settings');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  onPhotoChanged(): void {
    this.isDirty = true;
  }

}
