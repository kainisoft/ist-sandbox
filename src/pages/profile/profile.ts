import { Component, OnInit } from '@angular/core';

import { AlertController, NavParams, PopoverController } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { User } from '../../interfaces/user';
import { PhotoTypes } from '../../interfaces/photo';
import { ReportUser } from '../../interfaces/report';

import { UserService } from '../../providers/user';
import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { LocalizeService } from '../../providers/localize';
import { ReportService } from '../../providers/report';
import { AppService } from '../../providers/app';

import { MenuItem, PopoverPage } from '../popover/popover';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage extends CustomComponent implements OnInit {
  user: User;
  menuItems: MenuItem[] = [];
  entityType: PhotoTypes = PhotoTypes.USER;
  pageType: PageTypes = PageTypes.INFO;
  pageTypes = PageTypes;

  constructor(protected navParams: NavParams,
              protected userService: UserService,
              protected popoverCtrl: PopoverController,
              protected authService: AuthService,
              protected alertCtrl: AlertController,
              protected navigatorService: NavigatorService,
              protected localizeService: LocalizeService,
              protected reportService: ReportService,
              protected appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.user = this.navParams.get('user');

    if (this.user.id !== this.authService.currentUserUid()) {
      this.menuItems = [
        {
          key: 'report',
          icon: 'sad',
          label: 'Report'
        },
        {
          key: 'chat',
          icon: 'chatbubbles',
          label: 'Chat'
        }
      ];
    } else {
      // this.menuItems = [
      //   {
      //     key: 'delete',
      //     icon: 'trash',
      //     label: 'Delete'
      //   }
      // ];
    }
  }

  presentPopover(ev: any): void {
    const popover = this.popoverCtrl.create(PopoverPage, {menuItems: this.menuItems});

    popover.present({ev});

    popover.onDidDismiss((data: MenuItem) => {
      if (!data) {
        return;
      }

      switch (data.key) {
        case 'chat':
          this.navigatorService.push(ChatPage, {
            userId: this.user.id
          });
          break;
        case 'report':
          this.promptReport();
          break;
        case 'delete':
          // let alert = this.alertCtrl.create({
          //   title: 'Are you sure?',
          //   message: 'Are you sure?',
          //   buttons: [
          //     {
          //       text: 'No',
          //       role: 'cancel',
          //       handler: () => {
          //         console.log('Cancel clicked');
          //       }
          //     },
          //     {
          //       text: 'Yes',
          //       handler: () => {
          //         this.deleteGoods();
          //       }
          //     }
          //   ]
          // });
          // alert.present();
          break;
      }
    });
  }

  protected async promptReport(): Promise<any> {
    const [title, message, cancel, done] = await this.localizeService.getListText(['Report', 'Please, tell us what\'s wrong with this user', 'Cancel', 'Done']);

    let prompt = this.alertCtrl.create({
      title,
      message,
      inputs: [
        {
          name: 'report'
        },
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked', data);
          }
        },
        {
          text: done,
          handler: data => {
            this.handleReport(data.report);
          }
        }
      ]
    });
    prompt.present();
  }

  protected async handleReport(report: string): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      const userReport: ReportUser = {
        report,
        uid: this.authService.currentUserUid(),
        claimUid: this.user.id
      };

      await this.reportService.add(userReport);

      const message = await this.localizeService.getText('THANK_FOR_REPORT_USER');

      await this.appService.presentToast(message);
    }
    catch (e) {
      console.error('report error');
      console.dir(e);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

}

export enum PageTypes {
  INFO,
  PHOTOS
}
