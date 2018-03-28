import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { PhotoTypes } from '../../interfaces/photo';
import { Idea } from '../../interfaces/idea';
import { Comment } from '../../interfaces/comment';

import { NavigatorService } from '../../providers/navigator';
import { CommentService } from '../../providers/comment';

import { FeedPage } from '../../pages/feed/feed';

@Component({
  selector: 'idea-item',
  templateUrl: 'idea-item.html'
})
export class IdeaItemComponent extends CustomComponent implements OnInit {
  comment: Comment;
  photoTypes = PhotoTypes;

  @Input()
  idea: Idea;

  constructor(protected navigatorService: NavigatorService,
              protected commentService: CommentService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.commentService.find(this.idea.feedId).subscribe(comment => {
      this.comment = comment;
    }));
  }

  openFeedPage(): Promise<any> {
    if (!this.idea.feedId) {
      return;
    }

    return this.navigatorService.push(FeedPage, {
      id: this.idea.feedId
    });
  }

}
