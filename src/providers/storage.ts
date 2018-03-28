import { Injectable } from '@angular/core';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import { AngularFireStorage } from 'angularfire2/storage';

import { AuthService } from './auth';

import { StoragePhoto } from '../interfaces/storage';
import { PhotoTypes } from '../interfaces/photo';

export const UPLOAD_FORMAT = 'data_url';

@Injectable()
export class StorageService {
  protected readonly IMAGES_PATH = 'images/';
  protected readonly USER_IMAGES_PATH = `${this.IMAGES_PATH}user/`;
  // protected readonly STORE_IMAGES_PATH = `${this.IMAGES_PATH}store/`;
  // protected readonly SERVICE_CENTER_IMAGES_PATH = `${this.IMAGES_PATH}service-center/`;

  constructor(private afStorage: AngularFireStorage,
              private authService: AuthService) {

  }

  protected buildUserImagesPath(uid: string): string {
    return `${this.USER_IMAGES_PATH}${uid}/`;
  }

  protected buildPathByTypeAndId(entityType: PhotoTypes, entityId: string): string {
    return `${this.IMAGES_PATH}${entityType}/${entityId}/`;
  }

  // protected buildStoreImagesPath(id: string, name: string): string {
  //   return `${this.STORE_IMAGES_PATH}${id}/${name}`;
  // }
  //
  // protected buildServiceCenterImagesPath(id: string, name: string): string {
  //   return `${this.SERVICE_CENTER_IMAGES_PATH}${id}/${name}/`;
  // }

  uploadUserAvatar(dataUrl: string, uid: string = this.authService.currentUserUid()): Promise<UploadTaskSnapshot> {
    const path = `${this.buildUserImagesPath(uid)}avatar.jpg`;

    return this.upload(path, dataUrl);
  }

  uploadUserCover(dataUrl: string, uid: string = this.authService.currentUserUid()): Promise<UploadTaskSnapshot> {
    const path = `${this.buildUserImagesPath(uid)}cover.jpg`;

    return this.upload(path, dataUrl);
  }

  uploadPhoto(entityType: PhotoTypes, entityId: string, photo: StoragePhoto): Promise<UploadTaskSnapshot> {
    const path = `${this.buildPathByTypeAndId(entityType, entityId)}${photo.name}`;

    return this.upload(path, photo.dataUrl);
  }

  // uploadStorePhoto(id: string, storageUserPhoto: StoragePhoto): Promise<firebase.storage.UploadTaskSnapshot> {
  //   const path = this.buildStoreImagesPath(id, storageUserPhoto.name);
  //
  //   return this.upload(path, storageUserPhoto.dataUrl);
  // }
  //
  // uploadServiceCenterPhoto(id: string, photo: StoragePhoto): Promise<firebase.storage.UploadTaskSnapshot> {
  //   const path = this.buildServiceCenterImagesPath(id, photo.name);
  //
  //   return this.upload(path, photo.dataUrl);
  // }
  //
  // getUserAvatarThumbnailUrl(uid: string): Promise<string> {
  //   const path = this.buildUserImagesPath(uid);
  //
  //   return this.afStorage.ref(`${path}thumb_avatar.jpg`).getDownloadURL().take(1).toPromise();
  // }

  protected upload(path: string, dataUrl: string): Promise<UploadTaskSnapshot> {
    return this.afStorage.ref(path).putString(dataUrl, UPLOAD_FORMAT).snapshotChanges().toPromise();
  }
}
