import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { AfterViewInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { CustomComponent } from '../../core/component';

import { Chat } from '../../interfaces/chat';
import { User } from '../../interfaces/user';
import { Message } from '../../interfaces/message';

import { AuthService } from '../../providers/auth';
import { UserService } from '../../providers/user';
import { NavigatorService } from '../../providers/navigator';
import { ChatService } from '../../providers/chat';
import { MessageService } from '../../providers/message';

import { ChatPage } from '../../pages/chat/chat';

@Component({
  selector: 'conversation-item',
  templateUrl: 'conversation-item.html'
})
export class ConversationItemComponent extends CustomComponent implements OnChanges, OnInit, AfterViewInit {
  user: User;
  lastMessage: Message;
  uid = this.authService.currentUserUid();

  @Input()
  protected chat: Chat;

  constructor(protected authService: AuthService,
              protected userService: UserService,
              protected navigatorService: NavigatorService,
              protected chatService: ChatService,
              protected messageService: MessageService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const chat = changes.chat as SimpleChange;
    const prevChat = chat.previousValue as Chat;
    const currChat = chat.currentValue as Chat;

    if (!prevChat) {
      return;
    }

    if (
      this.hasNewMessage(prevChat, currChat) ||
      this.lastMessageStatusChanged(prevChat, currChat)
    ) {
      this.initLastMessage();
      this.markChatAsDelivered();
    }
  }

  protected hasNewMessage(prevChat: Chat, currChat: Chat): boolean {
    return prevChat.lastMessage !== currChat.lastMessage;
  }

  protected lastMessageStatusChanged(prevChat: Chat, currChat: Chat): boolean {
    const opponent = currChat.opponents[this.authService.currentUserUid()];

    const prevCounter = prevChat.counter[opponent];
    const currCounter = currChat.counter[opponent];

    const prevDelivered = prevChat.delivered[opponent];
    const currDelivered = currChat.delivered[opponent];

    return prevCounter !== currCounter || prevDelivered !== currDelivered;
  }

  ngOnInit(): void {
    this.initOpponentUser();
    this.initLastMessage();
  }

  ngAfterViewInit(): void {
    this.markChatAsDelivered();
  }

  protected initOpponentUser(): void {
    const opponent = this.chat.opponents[this.authService.currentUserUid()];

    this.hub.push(this.userService.find(opponent).subscribe(user => {
      this.user = user;
    }));
  }

  protected initLastMessage(): void {
    const {id: chatId, lastMessage: messageId} = this.chat;

    this.hub.push(this.messageService.findByChatIdAndMessageId(chatId, messageId).subscribe(message => {
      this.lastMessage = message;
    }));
  }

  protected markChatAsDelivered(): void {
    this.chatService.markAsDelivered(this.chat, this.authService.currentUserUid());
  }

  openChatPage(): Promise<any> {
    return this.navigatorService.push(ChatPage, {
      chatId: this.chat.id
    });
  }
}
