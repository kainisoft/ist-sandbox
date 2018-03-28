import { Component, Input, OnInit } from '@angular/core';

import { CustomComponent } from '../../core/component';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { NotificationService } from '../../providers/notification';

@Component({
  selector: '[main-header]',
  templateUrl: 'main-header.html'
})

export class MainHeaderComponent extends CustomComponent implements OnInit {
  counter = 0;

  @Input()
  title: string;

  constructor(protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    const uid = this.authService.currentUserUid();

    this.hub.push(this.notificationService.find(uid).filter(entity => !!entity).subscribe(notification => {
      this.counter = notification.messages;
    }));
  }

}
