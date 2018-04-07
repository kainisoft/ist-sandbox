import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { MessageNotifyService } from '../../providers/message-notify';
import { CounterService } from '../../providers/counter';

import { NotificationPage } from '../../pages/notification/notification';

@Component({
  selector: '[main-header]',
  templateUrl: 'main-header.html'
})

export class MainHeaderComponent extends CustomComponent implements OnInit {
  counter = 0;
  hasNotification = false;

  @Input()
  title: string;

  constructor(protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected messageNotifyService: MessageNotifyService,
              protected counterService: CounterService) {
    super();
  }

  ngOnInit(): void {
    const uid = this.authService.currentUserUid();

    this.hub.push(this.messageNotifyService.find(uid).filter(entity => !!entity).subscribe(notification => {
      this.counter = notification.messages;
    }));

    this.hub.push(this.counterService.find(uid).filter(entity => !!entity).subscribe(counter => {
      this.hasNotification = !!counter.notification;
    }));
  }

  openNotificationPage(): Promise<any> {
    return this.navigatorService.setRoot(NotificationPage, {
      title: 'Notifications'
    });
  }

}
