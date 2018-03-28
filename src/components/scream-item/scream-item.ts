import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { PhotoTypes } from '../../interfaces/photo';
import { Scream } from '../../interfaces/scream';
import { Comment } from '../../interfaces/comment';

import { NavigatorService } from '../../providers/navigator';
import { CommentService } from '../../providers/comment';

import { FeedPage } from '../../pages/feed/feed';

@Component({
  selector: 'scream-item',
  templateUrl: 'scream-item.html'
})
export class ScreamItemComponent extends CustomComponent implements OnInit {
  comment: Comment;
  photoTypes = PhotoTypes;

  @Input()
  scream: Scream;

  constructor(protected navigatorService: NavigatorService,
              protected commentService: CommentService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.commentService.find(this.scream.feedId).subscribe(comment => {
      this.comment = comment;
    }));
  }

  openFeedPage(): Promise<any> {
    if (!this.scream.feedId) {
      return;

    }

    return this.navigatorService.push(FeedPage, {
      id: this.scream.feedId
    });
  }
}
