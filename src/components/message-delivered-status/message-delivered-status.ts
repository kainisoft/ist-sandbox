import { Component, Input, SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { Message, MessageDeliveryStatus } from '../../interfaces/message';

import { AuthService } from '../../providers/auth';

@Component({
  selector: 'message-delivered-status',
  templateUrl: 'message-delivered-status.html'
})
export class MessageDeliveredStatusComponent implements OnChanges {
  isOwner = false;
  deliveryStatuses = MessageDeliveryStatus;

  @Input()
  message: Message;

  constructor(protected authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.isOwner = this.message.uid === this.authService.currentUserUid();
  }

}
