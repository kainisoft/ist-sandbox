import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { Like } from '../../interfaces/like';
import { User } from '../../interfaces/user';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';

import { ProfilePage } from '../../pages/profile/profile';

@Component({
  selector: 'like-item',
  templateUrl: 'like-item.html'
})
export class LikeItemComponent extends CustomComponent implements OnInit {
  user: User;

  @Input()
  protected likeEntity: Like;

  constructor(protected userService: UserService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.likeEntity.uid).subscribe(user => {
      this.user = user;
    }));
  }

  openProfilePage(): Promise<any> {
    return this.navigatorService.push(ProfilePage, {
      user: this.user
    });
  }

}
