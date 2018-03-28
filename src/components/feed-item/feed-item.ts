import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { Feed, FeedTypes } from '../../interfaces/feed';
import { Comment } from '../../interfaces/comment';
import { Like } from '../../interfaces/like';
import { User } from '../../interfaces/user';

import { AppService } from '../../providers/app';
import { CommentService } from '../../providers/comment';
import { LikeService } from '../../providers/like';
import { AuthService } from '../../providers/auth';
import { UserService } from '../../providers/user';

@Component({
  selector: 'feed-item',
  templateUrl: 'feed-item.html'
})
export class FeedItemComponent extends CustomComponent implements OnInit {
  user: User;
  comment: Comment;
  feedTypes = FeedTypes;

  @Input()
  feedEntity: Feed;

  @Input()
  commentsClickHandler: Function;

  @Input()
  likesClickHandler: Function;

  constructor(protected authService: AuthService,
              protected appService: AppService,
              protected userService: UserService,
              protected commentService: CommentService,
              protected likeService: LikeService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.feedEntity.uid).subscribe(user => {
      this.user = user;
    }));

    this.hub.push(this.commentService.find(this.feedEntity.id).subscribe(comment => {
      this.comment = comment;
    }));
  }

  async proceedLike(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const like: Like = {
        parent: this.feedEntity.id,
        uid: this.authService.currentUserUid(),
        path: [this.feedEntity.id]
      };

      return await this.likeService.add(like);
    }
    catch (error) {
      console.error('like proceed error');
      console.dir(error);

      return null;
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

}
