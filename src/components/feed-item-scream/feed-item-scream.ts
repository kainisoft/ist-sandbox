import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { FeedScream } from '../../interfaces/feed';
import { Scream } from '../../interfaces/scream';
import { PhotoTypes } from '../../interfaces/photo';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';
import { AuthService } from '../../providers/auth';
import { ScreamService } from '../../providers/scream';

@Component({
  selector: 'feed-item-scream',
  templateUrl: 'feed-item-scream.html'
})
export class FeedItemScreamComponent extends CustomComponent implements OnInit {
  scream: Scream;
  photoTypes = PhotoTypes;

  @Input()
  feedEntity: FeedScream;

  constructor(protected userService: UserService,
              protected screamService: ScreamService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.initScream();
  }

  protected initScream(): void {
    this.hub.push(this.screamService.find(this.feedEntity.data.id).subscribe(scream => {
      this.scream = scream;
    }));
  }

}
