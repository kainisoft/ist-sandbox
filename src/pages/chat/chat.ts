import { Component, OnInit, ViewChild } from '@angular/core';

import { NavParams, Refresher } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { CustomComponent } from '../../core/component';

import { MessageListComponent } from '../../components/message-list/message-list';

import { User } from '../../interfaces/user';
import { Chat } from '../../interfaces/chat';
import { Message, MessageDeliveryStatus } from '../../interfaces/message';

import { ChatForm } from '../../forms/chat';

import { ChatService } from '../../providers/chat';
import { AuthService } from '../../providers/auth';
import { MessageService } from '../../providers/message';
import { NavigatorService } from '../../providers/navigator';
import { UserService } from '../../providers/user';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage extends CustomComponent implements OnInit {
  chat: Chat;
  user: User;
  form = new ChatForm();

  protected userSubscription: Subscription;

  @ViewChild('messageList')
  protected messageList: MessageListComponent;

  constructor(protected navParams: NavParams,
              protected chatService: ChatService,
              protected messageService: MessageService,
              protected authService: AuthService,
              protected userService: UserService,
              protected navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.initChat();
  }

  protected initChat(): Promise<any> | void {
    const { chatId, userId } = this.navParams.data;

    if (chatId) {
      this.hub.push(this.chatService.find(chatId).subscribe(chat => {
        this.chat = chat;
        this.initOpponentUser();
      }));
    } else if (userId) { // TODO Refactor
      this.chatService.findP2P(this.authService.currentUserUid(), userId).then(chat => {
        if (!chat) {
          this.chatService.openChat(userId, this.authService.currentUserUid()).then(chat => {
            this.hub.push(this.chatService.find(chat.id).subscribe(chat => {
              this.chat = chat;

              this.initOpponentUser();
            }));
          });
        } else {
          this.hub.push(this.chatService.find(chat.id).subscribe(chat => {
            this.chat = chat;

            this.initOpponentUser();
          }));
        }
      });
    } else {
      return this.navigatorService.pop();
    }
  }

  protected initOpponentUser(): void {
    const opponent = this.chat.opponents[this.authService.currentUserUid()];

    this.userSubscription && this.userSubscription.unsubscribe();
    this.userSubscription = this.userService.find(opponent).subscribe(user => {
      this.user = user;
    });
  }

  openProfilePage(): void {
    this.navigatorService.push(ProfilePage, {
      user: this.user
    });
  }

  doRefresh(refresher: Refresher): void {
    this.messageList.loadMore().then(() => refresher.complete());
  }

  async send(): Promise<any> {
    if (!this.chat) {
      return;
    }

    const value = this.form.getMessage().getValue();
    const text = value && value.trim();

    if (!text) {
      return;
    }

    const uid = this.authService.currentUserUid();
    const message: Message = {
      parent: this.chat.id,
      opponent: this.chat.opponents[uid],
      deliveryStatus: MessageDeliveryStatus.SENDING,
      text,
      uid
    };

    try {
      const element = this.form.getMessage();

      element.setValue('');

      setTimeout(() => {
        element.setFocus();
      }, 200);

      await this.messageService.add(message);
    }
    catch (error) {
      console.dir(error);
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.userSubscription && this.userSubscription.unsubscribe();
  }

}
