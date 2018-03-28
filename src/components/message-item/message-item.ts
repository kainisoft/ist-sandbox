import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { Message } from '../../interfaces/message';

import { AuthService } from '../../providers/auth';

@Component({
  selector: 'message-item',
  templateUrl: 'message-item.html'
})
export class MessageItemComponent implements OnInit, AfterViewInit {
  isOwner = false;

  @Input()
  message: Message;

  @Output()
  protected onRender = new EventEmitter<any>();

  constructor(protected authService: AuthService,
              protected elementRef: ElementRef) {

  }

  ngOnInit(): void {
    this.isOwner = this.authService.currentUserUid() === this.message.uid;
  }

  ngAfterViewInit(): void {
    this.onRender.emit({message: this.message, element: this.elementRef});
  }

}
