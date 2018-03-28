import { Injectable } from '@angular/core';
import { Camera, PictureSourceType } from '@ionic-native/camera';

import { ActionSheetOptions } from 'ionic-angular';

import { LocalizeService } from './localize';
import { NavigatorService } from './navigator';

@Injectable()
export class CameraProvider {

  constructor(private camera: Camera,
              private localizeService: LocalizeService,
              private navigatorService: NavigatorService) {
  }

  async presentActionSheet(options: CameraActionSheetOptions): Promise<any> {// TODO refactor
    const [cameraText, galleryText, cancelText] = await this.localizeService.getListText(['Camera', 'Gallery', 'Cancel']);

    const actionSheetOptions: ActionSheetOptions = {
      title: options.title,
      buttons: [
        {
          text: cameraText,
          icon: 'ios-camera-outline',
          handler: () => {
            this.getPictureFromCamera()
              .then((dataUrl: string) => options.cameraHandler(dataUrl))
              .catch((...rest) => { // TODO throw error
                console.dir(rest);
              });
          }
        },
        {
          text: galleryText,
          icon: 'ios-images-outline',
          handler: () => {
            this.getPictureFromPhotoLibrary()
              .then((dataUrl: string) => options.galleryHandler(dataUrl))
              .catch((...rest) => { // TODO throw error
                console.dir(rest);
              });
          }
        },
        {
          text: cancelText,
          icon: 'ios-close-outline',
          role: 'cancel',
          handler: () => {
            options.cancelHandler && options.cancelHandler();
          }
        }
      ],
      enableBackdropDismiss: true
    };

    return this.navigatorService.presentActionSheet(actionSheetOptions);
  }

  getPictureFromCamera(): Promise<any> {
    return this.getImage(this.camera.PictureSourceType.CAMERA);
  }

  getPictureFromPhotoLibrary(): Promise<string> {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  getImage(pictureSourceType: PictureSourceType, quality: number = 80, allowEdit: boolean = true): Promise<string> {
    const options = {
      quality,
      allowEdit,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 600,
      targetHeight: 600
    };

    return this.camera.getPicture(options).then((dataUrl: string) => {
      return `data:image/jpeg;base64,${dataUrl}`;
    });
  }
}

export interface CameraActionSheetOptions {
  title: string;
  cameraText?: string;
  galleryText?: string;
  cancelText?: string;
  cameraHandler: (dataUrl: string) => void;
  galleryHandler: (dataUrl: string) => void;
  cancelHandler?: () => void;
}
