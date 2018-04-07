import { Component } from '@angular/core';

import { FeedContent, FeedPage } from '../../pages/feed/feed';

import { NavigatorService } from '../../providers/navigator';
import { CustomNotificationItem } from '../../core/notification-item';

@Component({
  selector: 'notification-item-like',
  templateUrl: 'notification-item-like.html'
})
export class NotificationItemLikeComponent extends CustomNotificationItem {

  constructor(protected navigatorService: NavigatorService) {
    super();
  }

  clickHandler(): Promise<any> {
    return this.navigatorService.push(FeedPage, {
      id: this.notification.entityId,
      content: FeedContent.LIKES
    }).then(() => {
      this.onClick.emit(this.notification);
    });
  }

}
