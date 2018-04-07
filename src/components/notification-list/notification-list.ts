import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Notification } from '../../interfaces/notification';

import { NotificationService } from '../../providers/notification';
import { AuthService } from '../../providers/auth';

@Component({
  selector: 'notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListComponent extends AbstractLoadMoreComponent<Notification> implements OnInit {
  protected uid = this.authService.currentUserUid();

  constructor(protected notificationService: NotificationService,
              protected authService: AuthService) {
    super(notificationService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.notificationService.findList(this.uid).subscribe(notifications => {
      this.setEntities(notifications);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.notificationService.findList(this.uid, last.ds).subscribe(likes => {
        this.setEntities(likes);

        resolve();
      }));
    });
  }

}
