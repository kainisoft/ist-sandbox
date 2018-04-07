import { Component, ElementRef, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { AfterViewInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Keyboard } from '@ionic-native/keyboard';

import { Content } from 'ionic-angular';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Message, MessageDeliveryStatus } from '../../interfaces/message';
import { Chat } from '../../interfaces/chat';

import { MessageService } from '../../providers/message';
import { AuthService } from '../../providers/auth';
import { ChatService } from '../../providers/chat';

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.html'
})
export class MessageListComponent extends AbstractLoadMoreComponent<Message> implements OnInit, OnChanges, AfterViewInit {
  lists: List[];

  protected newMessages = 0;
  protected topOffset = 5;
  protected marker: string; // New message marker
  protected uid = this.authService.currentUserUid();
  protected lastMessage: Message;

  @Input()
  protected chat: Chat;

  @Input()
  protected content: Content;

  constructor(protected messageService: MessageService,
              protected chatService: ChatService,
              protected authService: AuthService,
              protected keyboard: Keyboard) {
    super(messageService.LIMIT);
  }

  ngOnInit(): void {
    this.initMessages();
    this.initKeyboard();
    this.newMessages = this.chat.counter[this.uid];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const chat = changes.chat as SimpleChange;

    if (!chat.isFirstChange()) {
      this.markChatAsRead();
    }
  }

  ngAfterViewInit(): void {
    this.markChatAsRead();
  }

  protected initMessages(): void {
    const counter = this.chat.counter[this.uid];
    let limit = this.messageService.LIMIT;

    if (counter >= (this.messageService.LIMIT - this.topOffset)) {
      limit = counter + this.topOffset;
    }

    this.hub.push(this.messageService.findList(this.chat.id, limit).subscribe(messages => {
      this.setEntities(messages);
      const last = this.last();

      if (last && last.uid === this.uid) {
        this.newMessages = 0;
      }

      this.lists = this.prepareList(this.entities);
    }));
  }

  protected initKeyboard(): void {
    this.hub.push(this.keyboard.onKeyboardShow().subscribe(() => {
      if (!this.chat.counter[this.uid]) {
        this.content.scrollToBottom();
      }
    }));
  }

  protected prepareList(messages: Message[]): List[] {
    const list: List[] = [];
    const currDate = new Date();

    messages.forEach(message => {
      const { createdAt } = message;
      let date = `${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`;

      if (createdAt.toDateString().localeCompare(currDate.toDateString()) === 0) {
        date = 'Today';
      }

      let parent = list.find(item => item.date === date);

      if (parent === undefined) {
        parent =  {
          date,
          messages: []
        };
        list.push(parent);
      }

      parent.messages.push(message);
    });

    return list;
  }

  trackByDate(index: number, item: List): string {
    return item.date;
  }

  hasTail(index: number, message: Message, messages: Message[]): boolean {
    return messages[index - 1].uid !== message.uid;
  }

  isNewMessage(message: Message): boolean {
    return !!this.newMessages &&
      ((this.marker === message.id) ||
      (!this.marker && message.opponent === this.uid && message.deliveryStatus !== MessageDeliveryStatus.READ));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      this.lastMessage = Array.from(this.entities).shift();

      this.hub.push(this.messageService.findList(this.chat.id, this.messageService.LIMIT, this.lastMessage.ds).subscribe(messages => {
        this.setEntities(messages);
        this.lists = this.prepareList(this.entities);
        resolve();
      }));
    });
  }

  messageDidRender(event: any): void {
    const message = event.message as Message;
    const element = event.element as ElementRef;
    const native = element.nativeElement as HTMLElement;

    if (this.isNewMessage(message)) {
      this.marker = message.id;
      this.content.scrollTo(0, native.offsetTop + 100, 0);
    } else if (this.lastMessage && native.nextElementSibling) {
      let nextElement = native.nextElementSibling as HTMLElement;

      while (nextElement.nodeName.toUpperCase().localeCompare('MESSAGE-ITEM') !== 0) {
        nextElement = nextElement.nextElementSibling as HTMLElement;
      }

      if (nextElement.id.localeCompare(this.lastMessage.id) === 0) {
        this.content.scrollTo(0, nextElement.offsetTop - 40, 0);
        this.lastMessage = null;
      }
    }
    else if (!this.marker) {
      const index = this.entities.findIndex(msg => msg.id === message.id);

      if (index === this.entities.length - 1) {
        this.content.scrollToBottom(0);
      }
    }
  }

  protected markChatAsRead(): void {
    this.chatService.markAsRead(this.chat, this.uid);
  }

  protected normalizeList(entities: Message[]): Message[] {
    return super.normalizeList(entities).reverse();
  }
}

export interface List {
  date: string;
  messages: Message[];
}
