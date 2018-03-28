import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { User } from '../../interfaces/user';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';

import { SettingsProfilePage } from '../settings-profile/settings-profile';
import { SettingsCarPage } from '../settings-car/settings-car';
import { SettingsPhotoPage } from '../settings-photo/settings-photo';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage extends CustomPage implements OnInit {
  user: User;

  constructor(protected navParams: NavParams, protected userService: UserService,
              protected navigatorService: NavigatorService) {
    super(navParams);
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find().subscribe(user => {
      this.user = user;
    }));
  }

  openProfileSettings(): Promise<any> {
    return this.navigatorService.push(SettingsProfilePage, {
      user: this.user
    });
  }

  openCarSettings(): Promise<any> {
    return this.navigatorService.push(SettingsCarPage, {
      user: this.user
    });
  }

  openPhotoSettings(): Promise<any> {
    return this.navigatorService.push(SettingsPhotoPage, {
      user: this.user
    });
  }

}
