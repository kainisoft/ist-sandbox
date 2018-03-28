import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { NavigatorService } from '../../providers/navigator';

@Component({
  selector: 'page-likes',
  templateUrl: 'likes.html',
})
export class LikesPage implements OnInit {
  id: string;

  constructor(protected navParams: NavParams,
              protected navigatorService: NavigatorService) {
  }

  ngOnInit(): void {
    this.id = this.navParams.get('id');

    if (!this.id) {
      this.navigatorService.pop();
    }
  }

}
