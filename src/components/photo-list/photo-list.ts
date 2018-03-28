import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';

import { CustomComponent } from '../../core/component';

import { Photo, PhotoTypes } from '../../interfaces/photo';

import { PhotoService } from '../../providers/photo';

@Component({
  selector: 'photo-list',
  templateUrl: 'photo-list.html'
})
export class PhotoListComponent extends CustomComponent implements OnInit {
  photos: Photo[];

  @Input()
  showIfIsEmpty = true;

  @Input()
  protected entityType: PhotoTypes;

  @Input()
  protected entityId: string;

  constructor(protected photoService: PhotoService,
              protected modalCtrl: ModalController) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.photoService.findList(this.entityType, this.entityId).subscribe(photos => {
      this.photos = photos;
    }));
  }

  openViewer(index: number): Promise<any> {
    const modal = this.modalCtrl.create(GalleryModal, {
      photos: this.photos,
      initialSlide: index
    });

    return modal.present();
  }

}
