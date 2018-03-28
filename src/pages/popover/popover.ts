import { Component, OnInit } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(protected viewCtrl: ViewController,
              protected navParams: NavParams) {
  }

  ngOnInit(): void {
    this.menuItems = this.navParams.get('menuItems');
  }

  dismiss(menu: MenuItem): Promise<any> {
    return this.viewCtrl.dismiss(menu);
  }

}

export interface MenuItem {
  key: string;
  icon: string;
  label: string;
}
