import { Component, Input, OnInit } from '@angular/core';

import { Content, Platform } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { PresenceStatus, User } from '../../interfaces/user';
import { Menu } from '../../interfaces/menu';

import { NavigatorService } from '../../providers/navigator';
import { NotificationService } from '../../providers/notification';
import { UserService } from '../../providers/user';
import { AppService } from '../../providers/app';
import { AuthService } from '../../providers/auth';

import { StorePage } from '../../pages/store/store';
import { SettingsPage } from '../../pages/settings/settings';
import { IndexPage } from '../../pages/index';
import { ConversationPage } from '../../pages/conversation/conversation';
import { IdeaPage } from '../../pages/idea/idea';
import { ScreamPage } from '../../pages/scream/scream';
import { AuthPage } from '../../pages/auth/auth';
import { AboutPage } from '../../pages/about/about';
import { TermsOfUsePage } from '../../pages/terms-of-use/terms-of-use';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent extends CustomComponent implements OnInit {
  uid: string = this.authService.currentUserUid();
  user: User;
  menus: Menu[] = [
    {
      title: 'Index page',
      icon: 'home',
      page: IndexPage
    },
    {
      title: 'Messages',
      icon: 'chatbubbles',
      page: ConversationPage,
    },
    {
      title: 'Shop',
      icon: 'basket',
      page: StorePage
    },
    // {
    //   title: 'Masters',
    //   icon: 'build',
    //   page: ServiceCenterPage
    // },
    {
      title: 'Tips and Help',
      icon: 'megaphone',
      page: ScreamPage
    },
    {
      title: 'Idea',
      icon: 'bulb',
      page: IdeaPage
    },
    {
      title: 'Settings',
      icon: 'settings',
      page: SettingsPage
    },
    {
      title: 'About',
      icon: 'phone-portrait',
      page: AboutPage
    },
    {
      title: 'The Terms of Use',
      icon: 'book',
      page: TermsOfUsePage,
      class: 'terms_of_use'
    }
  ];

  @Input()
  content: Content;

  constructor(protected appService: AppService,
              protected authService: AuthService,
              protected navigatorService: NavigatorService,
              protected notificationService: NotificationService,
              protected userService: UserService,
              protected platform: Platform) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.userService.find(this.uid).subscribe(user => {
      this.user = user;
    }));

    this.initUserNotification();
    this.proceedPresenceStatus();
  }

  protected initUserNotification(): void {
    this.notificationService.init(this.uid);

    this.hub.push(this.notificationService.find(this.uid).subscribe(notification => {
      if (!notification) {
        return;
      }

      const menu = this.menus.find(menu => menu.icon === 'chatbubbles');

      menu.notice = notification.messages;
    }));
  }

  protected proceedPresenceStatus(): void {
    this.userService.setPresence(PresenceStatus.ONLINE, this.uid);

    this.hub.push(this.platform.resume.subscribe(() => {
      this.userService.setPresence(PresenceStatus.ONLINE, this.uid);
    }));

    this.hub.push(this.platform.pause.subscribe(() => {
      this.userService.setPresence(PresenceStatus.OFFLINE, this.uid);
    }));
  }

  openPage(menu: Menu): void {
    this.navigatorService.setRoot(menu.page, {
      title: menu.title
    });
  }

  async logout(): Promise<any> { // TODO refactor
    await this.appService.presentPleaseWait();

    try {
      this.clearSubscriptions();

      await this.userService.setPresence(PresenceStatus.OFFLINE);
      await this.navigatorService.setRoot(AuthPage);
      await this.authService.signOut();
    }
    catch (error) {
      console.error('logout error');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.notificationService.resetSubscription();
  }

}
