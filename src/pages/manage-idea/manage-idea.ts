import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { FirebaseError } from 'firebase';

import { CustomComponent } from '../../core/component';

import { IdeaForm } from '../../forms/idea';

import { StoragePhoto } from '../../interfaces/storage';
import { PhotoTypes } from '../../interfaces/photo';
import { Idea } from '../../interfaces/idea';

import { AuthService } from '../../providers/auth';
import { AppService } from '../../providers/app';
import { LocalizeService } from '../../providers/localize';
import { NavigatorService } from '../../providers/navigator';
import { PhotoService } from '../../providers/photo';
import { IdeaService } from '../../providers/idea';

@Component({
  selector: 'page-manage-idea',
  templateUrl: 'manage-idea.html',
})
export class ManageIdeaPage extends CustomComponent implements OnInit {
  protected idea: Idea;

  form: IdeaForm = new IdeaForm();
  photos: StoragePhoto[] = [];
  photoTypes = PhotoTypes;
  ideaId: string = this.navParams.get('ideaId');

  constructor(protected appService: AppService,
              protected localizeService: LocalizeService,
              protected ideaService: IdeaService,
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
    if (!this.ideaId) {
      return;
    }

    this.hub.push(this.ideaService.find(this.ideaId).subscribe(idea => {
      this.idea = idea;
      this.form.patchValue(this.idea);
    }));
  }

  async proceedIdea(): Promise<any> {
    if (!this.form.valid) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const ideaEntity = await this.saveIdea();

      await this.photoService.uploadList(PhotoTypes.IDEA, ideaEntity.id, [...this.photos]);

      return await this.navigatorService.pop();
    }
    catch (error) {
      return await this.handlerError(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async saveIdea(): Promise<Idea> {
    const idea: Idea = {
      uid: this.authService.currentUserUid(),
      ...this.idea,
      ...this.form.getValues()
    };

    return await this.ideaService.save(idea);
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
