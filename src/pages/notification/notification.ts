import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomPage } from '../../core/page';

import { CounterService } from '../../providers/counter';
import { AuthService } from '../../providers/auth';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage extends CustomPage implements OnInit {
  protected uid = this.authService.currentUserUid();

  constructor(protected navParams: NavParams,
              protected counterService: CounterService,
              protected authService: AuthService) {
    super(navParams);
  }

  ngOnInit(): void {
    this.hub.push(this.counterService.find(this.uid).filter(entity => !!entity).subscribe(counter => {
      this.counterService.annul(counter, 'notification');
    }));
  }

}
