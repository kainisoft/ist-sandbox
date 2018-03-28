import { Component, Input, OnInit } from '@angular/core';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import { FirebaseError } from 'firebase';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';

import { AuthService } from '../../providers/auth';
import { CameraProvider } from '../../providers/camera.provider';
import { LocalizeService } from '../../providers/localize';
import { AppService } from '../../providers/app';
import { UserService } from '../../providers/user';
import { StorageService } from '../../providers/storage';

@Component({
  selector: 'profile-header',
  templateUrl: 'profile-header.html'
})
export class ProfileHeaderComponent extends CustomComponent implements OnInit {
  isOwner: boolean = false;
  user: User;

  @Input()
  protected uid: string;

  @Input()
  protected editable?: boolean = false;

  constructor(protected authService: AuthService,
              protected cameraProvider: CameraProvider,
              protected localizeService: LocalizeService,
              protected appService: AppService,
              protected userService: UserService,
              protected storageService: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.uid).subscribe(user => {
      this.user = user;
      this.isOwner = this.editable && (!!this.user && this.user.id === this.authService.currentUserUid());
    }));
  }

  async changeAvatar(): Promise<any> {
    if (!this.isOwner) {
      return;
    }

    return this.cameraProvider.presentActionSheet({
      title: await this.localizeService.getText('Change Avatar'),
      cameraHandler: (dataUrl: string) => this.changeAvatarHandler(dataUrl),
      galleryHandler: (dataUrl: string) => this.changeAvatarHandler(dataUrl)
    });
  }

  protected async changeAvatarHandler(dataUrl: string): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const uploadTask: UploadTaskSnapshot = await this.storageService.uploadUserAvatar(dataUrl, this.user.id);

      return await this.userService.setAvatar(uploadTask.downloadURL, this.user.id);
    }
    catch (error) {
      return await this.handlerError(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  async changeCover(): Promise<any> {
    if (!this.isOwner) {
      return;
    }

    return this.cameraProvider.presentActionSheet({
      title: await this.localizeService.getText('Change Cover'),
      cameraHandler: (dataUrl: string) => this.changeCoverHandler(dataUrl),
      galleryHandler: (dataUrl: string) => this.changeCoverHandler(dataUrl)
    });
  }

  protected async changeCoverHandler(dataUrl: string): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const uploadTask: UploadTaskSnapshot = await this.storageService.uploadUserCover(dataUrl, this.user.id);

      return await this.userService.setCover(uploadTask.downloadURL, this.user.id);
    }
    catch (error) {
      return await this.handlerError(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async handlerError(error: FirebaseError): Promise<any> {
    let message;

    switch (error.code) {
      case 'storage/unauthorized':
        message = await this.localizeService.getText('UPLOAD_ERROR');
        break;
      default:
        return console.dir('Upload error', error);
    }

    return await this.appService.presentToast(message);
  }

}
