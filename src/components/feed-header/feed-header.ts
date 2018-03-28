import { Component, Input, OnInit } from '@angular/core';

import { AlertController, PopoverController } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { Feed, FeedTypes } from '../../interfaces/feed';

import { AuthService } from '../../providers/auth';
import { NavigatorService } from '../../providers/navigator';
import { StoreService } from '../../providers/store';
import { AppService } from '../../providers/app';
import { FeedService } from '../../providers/feed';

import { MenuItem, PopoverPage } from '../../pages/popover/popover';
import { ManageGoodsPage } from '../../pages/manage-goods/manage-goods';
import { ManageScreamPage } from '../../pages/manage-scream/manage-scream';
import { ScreamService } from '../../providers/scream';
import { IdeaService } from '../../providers/idea';
import { ManageIdeaPage } from '../../pages/manage-idea/manage-idea';

@Component({
  selector: '[feed-header]',
  templateUrl: 'feed-header.html'
})
export class FeedHeaderComponent extends CustomComponent implements OnInit { // TODO refactor
  menuItems: MenuItem[];
  feedEntity: Feed;
  title: string;

  @Input()
  feedId: string;

  constructor(protected authService: AuthService,
              protected storeService: StoreService,
              protected screamService: ScreamService,
              protected ideaService: IdeaService,
              protected appService: AppService,
              protected popoverCtrl: PopoverController,
              protected alertCtrl: AlertController,
              protected navigatorService: NavigatorService,
              protected feedService: FeedService) {
    super();
  }

  ngOnInit(): void {
    this.hub.push(this.feedService.find(this.feedId).subscribe(feed => {
      this.feedEntity = feed;

      if (!this.feedEntity) {
        return;
      }

      this.initTitle();
      this.initMenuBtn();
    }));
  }

  protected initTitle(): void {
    switch (this.feedEntity.entityType) {
      case FeedTypes.JOIN:
        this.title = 'New user';
        break;
      case FeedTypes.GOODS:
        this.title = 'New goods';
        break;
      case FeedTypes.SCREAM:
        this.title = 'Call for help';
        break;
      case FeedTypes.IDEA:
        this.title = 'Idea';
        break;
    }
  }

  protected initMenuBtn(): void {
    switch (this.feedEntity.entityType) {
      case FeedTypes.GOODS:
        this.initGoodsMenu();
        break;
      case FeedTypes.SCREAM:
        this.initScreamMenu();
        break;
      case FeedTypes.IDEA:
        this.initIdeaMenu();
        break;
    }
  }

  protected initGoodsMenu(): void {
    if (this.feedEntity.uid === this.authService.currentUserUid()) {
      this.menuItems = [
        {
          key: 'editGoods',
          icon: 'create',
          label: 'Edit'
        },
        {
          key: 'deleteGoods',
          icon: 'trash',
          label: 'Delete'
        }
      ];
    }
  }

  protected initScreamMenu(): void {
    if (this.feedEntity.uid === this.authService.currentUserUid()) {
      this.menuItems = [
        {
          key: 'editScream',
          icon: 'create',
          label: 'Edit'
        },
        {
          key: 'deleteScream',
          icon: 'trash',
          label: 'Delete'
        }
      ];
    }
  }

  protected initIdeaMenu(): void {
    if (this.feedEntity.uid === this.authService.currentUserUid()) {
      this.menuItems = [
        {
          key: 'editIdea',
          icon: 'create',
          label: 'Edit'
        },
        {
          key: 'deleteIdea',
          icon: 'trash',
          label: 'Delete'
        }
      ];
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
        case 'editGoods':
          this.navigatorService.push(ManageGoodsPage, {
            goodsId: this.feedEntity.data.id
          });
          break;
        case 'deleteGoods': {
          let alert = this.alertCtrl.create({
            title: 'Are you sure?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.deleteGoods();
                }
              }
            ]
          });
          alert.present();
        } break;
        case 'editScream':
          this.navigatorService.push(ManageScreamPage, {
            screamId: this.feedEntity.data.id
          });
          break;
        case 'deleteScream': {
          let alert = this.alertCtrl.create({
            title: 'Are you sure?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.deleteScream();
                }
              }
            ]
          });
          alert.present();
        } break;
        case 'editIdea':
          this.navigatorService.push(ManageIdeaPage, {
            ideaId: this.feedEntity.data.id
          });
          break;
        case 'deleteIdea': {
          let alert = this.alertCtrl.create({
            title: 'Are you sure?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.deleteIdea();
                }
              }
            ]
          });
          alert.present();
        } break;
      }
    });
  }

  protected async deleteGoods(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.storeService.delete(this.feedEntity.data.id);
      await this.navigatorService.pop();
    }
    catch (error) {
      console.error('error delete goods');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async deleteScream(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.screamService.delete(this.feedEntity.data.id);
      await this.navigatorService.pop();
    }
    catch (error) {
      console.error('error delete scream');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

  protected async deleteIdea(): Promise<any> {
    await this.appService.presentPleaseWait();

    try {
      await this.ideaService.delete(this.feedEntity.data.id);
      await this.navigatorService.pop();
    }
    catch (error) {
      console.error('error delete scream');
      console.dir(error);
    }
    finally {
      await this.appService.dismissLoading();
    }
  }

}
