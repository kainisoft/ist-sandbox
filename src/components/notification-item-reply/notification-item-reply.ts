import { Component } from '@angular/core';

import { CustomNotificationItem } from '../../core/notification-item';

import { FeedContent, FeedPage } from '../../pages/feed/feed';

import { NavigatorService } from '../../providers/navigator';

@Component({
  selector: 'notification-item-reply',
  templateUrl: 'notification-item-reply.html'
})
export class NotificationItemReplyComponent extends CustomNotificationItem {

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
