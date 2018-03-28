import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Slides } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { StoragePhoto } from '../../interfaces/storage';
import { PhotoTypes } from '../../interfaces/photo';

import { CameraProvider } from '../../providers/camera.provider';
import { LocalizeService } from '../../providers/localize';
import { AppService } from '../../providers/app';
import { PhotoService } from '../../providers/photo';

@Component({
  selector: 'photo-uploader',
  templateUrl: 'photo-uploader.html'
})
export class PhotoUploaderComponent extends CustomComponent implements OnInit {
  modes = PhotoUploaderViewMode;

  @Input()
  mode?: PhotoUploaderViewMode = PhotoUploaderViewMode.SLIDE;

  @Input()
  maxUpload?: number = 4;

  @Input()
  photos: StoragePhoto[] = [];

  @Input()
  protected entityType?: PhotoTypes;

  @Input()
  protected entityId?: string;

  @Output()
  protected photoUploaded = new EventEmitter<StoragePhoto[]>();

  @Output()
  protected photoDeleted = new EventEmitter<StoragePhoto[]>();

  @ViewChild('slides')
  protected slider?: Slides;

  constructor(protected cameraProvider: CameraProvider,
              protected localizeService: LocalizeService,
              protected appService: AppService,
              protected photoService: PhotoService) {
    super();
  }

  ngOnInit(): void {
    this.initPhotos();
  }

  protected initPhotos(): void {
    if (!this.entityType || !this.entityId) {
      return;
    }

    this.hub.push(this.photoService.findList(this.entityType, this.entityId).subscribe(photos => {
      this.photos.length = 0;
      const storagePhoto = photos.map(photo => {
        return {
          name: photo.name,
          dataUrl: photo.url
        };
      });
      this.photos.splice(0, 0, ...storagePhoto);
    }));
  }

  async uploadPhoto(): Promise<any> {
    return this.cameraProvider.presentActionSheet({
      title: await this.localizeService.getText('Upload photo'),
      cameraHandler: (dataUrl: string) => this.uploadPhotoHandler(dataUrl),
      galleryHandler: (dataUrl: string) => this.uploadPhotoHandler(dataUrl)
    });
  }

  protected uploadPhotoHandler(dataUrl: string): void {
    const photo = {
      name: `${Date.now()}.jpg`,
      dataUrl
    };
    this.photos.push(photo);

    this.photoUploaded.emit(this.photos);

    setTimeout(() => {
      this.slider && this.slider.slideNext();
    }, 1000);
  }

  deletePhoto(index: number): void {
    const photo = this.photos.splice(index, 1);

    this.photoDeleted.emit(photo);
  }

  trackByFn(index: number, item: StoragePhoto): string {
    return item.name;
  }

}

export enum PhotoUploaderViewMode {
  LIST,
  // GRID,
  SLIDE
}
