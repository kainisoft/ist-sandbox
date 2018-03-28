import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { FeedJoin } from '../../interfaces/feed';
import { User } from '../../interfaces/user';
import { PhotoTypes } from '../../interfaces/photo';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';

@Component({
  selector: 'feed-item-join',
  templateUrl: 'feed-item-join.html'
})
export class FeedItemJoinComponent extends CustomComponent implements OnInit {
  user: User;
  photoTypes = PhotoTypes;

  @Input()
  feedEntity: FeedJoin;

  constructor(protected userService: UserService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.feedEntity.uid).subscribe((user: User) => {
      this.user = user;
    }));
  }

}
