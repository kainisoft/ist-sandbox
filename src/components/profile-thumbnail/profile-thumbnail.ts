import { Component, Input } from '@angular/core';

import { PresenceStatus, User } from '../../interfaces/user';

@Component({
  selector: 'profile-thumbnail',
  templateUrl: 'profile-thumbnail.html'
})
export class ProfileThumbnailComponent {
  statuses = PresenceStatus;

  @Input()
  user: User;

  constructor() { }

}
