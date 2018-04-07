import { EventEmitter, Input, Output } from '@angular/core';

import { Notification } from '../interfaces/notification';

export class CustomNotificationItem {

  @Input()
  notification: Notification;

  @Output()
  onClick = new EventEmitter<Notification>();

}
