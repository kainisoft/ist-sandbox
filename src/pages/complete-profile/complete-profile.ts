import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { CustomComponent } from '../../core/component';

import { CompleteProfileForm } from '../../forms/complete-profile';

import { User } from '../../interfaces/user';
import { StoragePhoto } from '../../interfaces/storage';
import { PhotoTypes } from '../../interfaces/photo';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { LocalizeService } from '../../providers/localize';
import { AppService } from '../../providers/app';
import { UserService } from '../../providers/user';
import { PhotoService } from '../../providers/photo';
import { CarService } from '../../providers/car';
import { UserStatusService } from '../../providers/user-status';

import { SplashScreenPage } from '../splash-screen/splash-screen';

@Component({
  selector: 'page-complete-profile',
  templateUrl: 'complete-profile.html',
})
export class CompleteProfilePage extends CustomComponent implements OnInit, AfterViewInit {
  mode: Mode = Mode.INFO;
  modes = Mode;
  user: User;
  form: CompleteProfileForm = new CompleteProfileForm();
  photos: StoragePhoto[] = [];
  isCompleted: boolean = false;
  entityType: PhotoTypes = PhotoTypes.USER;

  constructor(protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected localizeService: LocalizeService,
              protected appService: AppService,
              protected userService: UserService,
              protected userStatusService: UserStatusService,
              protected carService: CarService,
              protected photoService: PhotoService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find().subscribe((user: User) => {
      this.user = user;

      this.proceedIsCompleted();
    }));

    this.hub.push(this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.proceedIsCompleted()));
  }

  async ngAfterViewInit(): Promise<any> {
    const message = await this.localizeService.getText('COMPLETE_PROFILE_MESSAGE');

    return this.appService.presentToast(message, 7000);
  }

  protected proceedIsCompleted(): void {
    this.isCompleted = this.form.valid && !!this.photos.length && !!this.user.profile.avatar;
  }

  async completeProfile(): Promise<any> {
    if (!this.isCompleted) {
      return;
    }

    await this.appService.presentPleaseWait();

    try {
      const status = {
        id: this.user.id,
        isCompleted: true
      };
      await this.userStatusService.save(status);

      const car = {
        id: this.user.id,
        year: this.form.getYear().getValue(),
        volume: this.form.getVolume().getValue()
      };

      await this.carService.save(car);

      await this.photoService.uploadList(PhotoTypes.USER, this.user.id, this.photos);

      return await this.navigatorService.setRoot(SplashScreenPage);
    }
    catch (error) {
      return console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  onPhotoUploaded(): void {
    this.proceedIsCompleted();
  }

}

export enum Mode {
  INFO,
  GALLERY
}
