import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';

import { Subscription } from 'rxjs/Subscription';
import { AngularFirestore } from 'angularfire2/firestore';

import { CustomFirestore } from '../core/firestore';

import { UserService } from './user';

import { User } from '../interfaces/user';
import { Notification, NotificationChat, NotificationType } from '../interfaces/notification';

import { LogService } from './log';
import { NavigatorMap, NavigatorService } from './navigator';

import { ConversationPage } from '../pages/conversation/conversation';
import { ChatPage } from '../pages/chat/chat';

@Injectable()
export class NotificationService extends CustomFirestore<Notification> {
  protected notifySubscription: Subscription;

  constructor(protected afs: AngularFirestore,
              protected firebase: Firebase,
              protected userService: UserService,
              protected logService: LogService,
              protected navigatorService: NavigatorService) {
    super(afs);
  }

  get collectionName(): string {
    return 'notification';
  }

  init(uid: string): void {// TODO refactor
    if (!uid) {
      return;
    }

    this.resetSubscription();

    this.userService.find(uid).take(1).subscribe(user => {
      this.initPushNotifications(user);
    });
  }

  resetSubscription(): void {
    this.notifySubscription && this.notifySubscription.unsubscribe();
    this.notifySubscription = new Subscription();
  }

  protected initPushNotifications(user: User): void {
    try {
      this.firebase.getToken().then((token: string) => {
        if (token.localeCompare(user.notifyToken) !== 0) {
          this.userService.setNotifyToken(token);
        }
      }).catch((...rest) => {
        console.dir(rest);
      });

      this.notifySubscription.add(this.firebase.onNotificationOpen().subscribe(this.proceedNotification.bind(this)));

      const tokenRefreshSub = this.firebase.onTokenRefresh().subscribe(token => {
        if (token.localeCompare(user.notifyToken) !== 0) {
          this.userService.setNotifyToken(token);
        }
      });

      this.notifySubscription.add(tokenRefreshSub);
    }
    catch (error) {
      console.error('init notify');
      console.dir(error);
    }
  }

  protected proceedNotification(notification: Notification): void {
    if (notification.tap !== true) {
      return;
    }

    switch (notification.type) {
      case NotificationType.MESSAGE:
        const notice = notification as NotificationChat;

        const map: NavigatorMap = {
          page: ConversationPage,
          params: {title: 'Messages'},
          subPage: {
            page: ChatPage,
            params: {
              chatId: notice.chatId
            }
          }
        };

        this.navigatorService.navigateToMap(map);
        break;
    }

    this.logService.add({data: notification});
  }

  // protected getProcessor(notification: Notification): void {
  //   switch (notification.type) {
  //     case NotificationType.MESSAGE:
  //       return;
  //   }
  // }

  // protected initUserNotification(user: User): void {
  //   this.notifySubscription.add(this.find(user.id).subscribe(notification => {
  //
  //   }));
  // }
}
