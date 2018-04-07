import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { Notification, NotificationType } from '../../interfaces/notification';
import { User } from '../../interfaces/user';

import { UserService } from '../../providers/user';
import { NotificationService } from '../../providers/notification';

@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent extends CustomComponent implements OnInit {
  notificationTypes = NotificationType;
  user: User;

  @Input()
  notification: Notification;

  constructor(protected userService: UserService,
              protected notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.notification.author).subscribe(user => {
      this.user = user;
    }));
  }

  clickHandler(notification: Notification): void {
    this.notificationService.markAsRead(notification);
  }

}
