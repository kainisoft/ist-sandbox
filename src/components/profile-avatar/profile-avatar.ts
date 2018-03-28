import { Component, Input } from '@angular/core';

import { PresenceStatus, User } from '../../interfaces/user';

import { NavigatorService } from '../../providers/navigator';

import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'profile-avatar',
  templateUrl: 'profile-avatar.html'
})
export class ProfileAvatarComponent {
  statuses = PresenceStatus;

  @Input()
  user: User;

  constructor(protected navigatorService: NavigatorService) {

  }

  openProfilePage(): Promise<any> {
    return this.navigatorService.push(ProfilePage, {
      user: this.user
    });
  }

}
