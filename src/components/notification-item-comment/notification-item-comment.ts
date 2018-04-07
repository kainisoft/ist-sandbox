import { Component } from '@angular/core';

import { CustomNotificationItem } from '../../core/notification-item';

import { NavigatorService } from '../../providers/navigator';

import { FeedContent, FeedPage } from '../../pages/feed/feed';

@Component({
  selector: 'notification-item-comment',
  templateUrl: 'notification-item-comment.html'
})
export class NotificationItemCommentComponent extends CustomNotificationItem {

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
