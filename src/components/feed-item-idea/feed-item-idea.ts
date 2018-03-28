import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { FeedIdea } from '../../interfaces/feed';
import { Idea } from '../../interfaces/idea';
import { PhotoTypes } from '../../interfaces/photo';

import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';
import { AuthService } from '../../providers/auth';
import { IdeaService } from '../../providers/idea';

@Component({
  selector: 'feed-item-idea',
  templateUrl: 'feed-item-idea.html'
})
export class FeedItemIdeaComponent extends CustomComponent implements OnInit {
  idea: Idea;
  photoTypes = PhotoTypes;

  @Input()
  feedEntity: FeedIdea;

  constructor(protected userService: UserService,
              protected ideaService: IdeaService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.initScream();
  }

  protected initScream(): void {
    this.hub.push(this.ideaService.find(this.feedEntity.data.id).subscribe(idea => {
      this.idea = idea;
    }));
  }

}
