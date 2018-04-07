import { Component } from '@angular/core';

import { FeedContent, FeedPage } from '../../pages/feed/feed';

import { NavigatorService } from '../../providers/navigator';
import { CustomNotificationItem } from '../../core/notification-item';

@Component({
  selector: 'notification-item-like-comment',
  templateUrl: 'notification-item-like-comment.html'
})
export class NotificationItemLikeCommentComponent extends CustomNotificationItem {

  constructor(protected navigatorService: NavigatorService) {
    super();
  }

  clickHandler(): Promise<any> {
    const [id, ...comments] = this.notification.data.path;

    return this.navigatorService.push(FeedPage, {
      id,
      content: FeedContent.COMMENTS,
      comments: [...comments, this.notification.entityId]
    }).then(() => {
      this.onClick.emit(this.notification);
    });
  }
}
