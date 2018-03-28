import { Injectable } from '@angular/core';

import { ActionSheetController, App, NavController, NavOptions } from 'ionic-angular';
import { Page } from 'ionic-angular/navigation/nav-util';
import { ActionSheet } from 'ionic-angular/components/action-sheet/action-sheet';
import { ActionSheetOptions } from 'ionic-angular/components/action-sheet/action-sheet-options';

@Injectable()
export class NavigatorService {
  private navOptions: NavOptions = defaultNavOptions;

  constructor(protected app: App,
              protected actionSheetCtrl: ActionSheetController) {

  }

  get navCtrl(): NavController {
    return this.app.getRootNav();
  }

  setRoot(pageOrViewCtrl: Page | string, params?: any): Promise<any> {
    return this.navCtrl.setRoot(pageOrViewCtrl, params, this.navOptions);
  }

  push(page: Page | string, params?: any): Promise<any> {
    return this.navCtrl.push(page, params);
  }

  pop(): Promise<any> {
    return this.navCtrl.pop(this.navOptions);
  }

  presentActionSheet(actionSheetOptions: ActionSheetOptions): Promise<any> {
    const actionSheet: ActionSheet = this.actionSheetCtrl.create(actionSheetOptions);

    return actionSheet.present();
  }

  navigateToMap(map: NavigatorMap): void {
    this.setRoot(map.page, map.params)
      .then(() => {
         if (map.subPage) {
           this.push(map.subPage.page, map.subPage.params);
         }
      });
  }

}

export interface NavigatorMap {
  page: Page | string;
  params?: any;
  subPage?: NavigatorMap;
}

export const defaultNavOptions: NavOptions = {
  animate: true,
  animation: 'wp-transition',
  isNavRoot: true,
  updateUrl: false,
  keyboardClose: true
};
