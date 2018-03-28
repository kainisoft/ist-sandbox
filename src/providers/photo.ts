import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Photo, PhotoTypes } from '../interfaces/photo';
import { StoragePhoto } from '../interfaces/storage';

import { StorageService } from './storage';

@Injectable()
export class PhotoService extends CustomFirestore<Photo> {
  protected readonly PHOTOS_PATH = 'photo';

  constructor(protected afs: AngularFirestore,
              protected storageService: StorageService) {
    super(afs);
  }

  get collectionName(): string {
    return this.PHOTOS_PATH;
  }

  add(photo: Photo): Promise<any> {
    this.sanitizeEntity(photo);

    return this.afs.collection(this.PHOTOS_PATH).add(photo);
  }

  findList(entityType: PhotoTypes, entityId: string): Observable<Photo[]> {
    const collection: AngularFirestoreCollection<Photo> = this.afs.collection(this.PHOTOS_PATH, ref => {
      let query: Query = ref;
      query = query.where('entityType', '==', entityType);
      query = query.where('entityId', '==', entityId);

      return query.orderBy('name');
    });

    return this.getEntities(collection);
  }

  async uploadList(entityType: PhotoTypes, entityId: string, photos: StoragePhoto[]): Promise<Photo[]> {
    if (!photos.length) {
      return Promise.resolve([]);
    }

    await this.removeOldPhotos(entityType, entityId, photos);

    const toUpload = photos.filter(photo => {
      return photo.dataUrl.startsWith('data:image/');
    });

    return Promise.all(toUpload.map(photo => {
      return this.storageService.uploadPhoto(entityType, entityId, photo)
        .then(uploadTask => {
          const photoEntity: Photo = {
            entityType,
            entityId,
            name: uploadTask.metadata.name,
            url: uploadTask.downloadURL
          };

          return this.add(photoEntity);
        });
    }));
  }

  private async removeOldPhotos(entityType: PhotoTypes, entityId: string, photos: StoragePhoto[]): Promise<any> {
    const originalPhotos = await this.findList(entityType, entityId).take(1).toPromise();
    const toRemove = originalPhotos.filter(originalPhoto => {
      return !photos.find(photo => {
        return photo.name === originalPhoto.name;
      });
    });

    return await Promise.all(toRemove.map(photo => {
      return this.remove(photo.id);
    }));
  }

  remove(id: string): Promise<any> {
    const path = this.buildPath(id);

    return this.afs.doc(path).delete();
  }

}
