import { Component, OnInit } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { CustomComponent } from '../../core/component';

import { Feed } from '../../interfaces/feed';

import { FeedService } from '../../providers/feed';
import { NavigatorService } from '../../providers/navigator';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage extends CustomComponent implements OnInit {
  id: string;
  content: FeedContent;
  contents = FeedContent;
  feed: Feed;

  constructor(private navParams: NavParams,
              private feedService: FeedService,
              private navigatorService: NavigatorService) {
    super();
  }

  ngOnInit(): void {
    this.id = this.navParams.get('id');
    this.content = this.navParams.get('content') || FeedContent.COMMENTS;

    this.initFeed();
  }

  protected initFeed(): void {
    this.hub.push(this.feedService.find(this.id).subscribe(feed => {
      if (!feed) {
        return this.navigatorService.pop();
      }

      this.feed = feed as Feed;
    }));
  }

  commentsClickHandler(): void {
    this.content = FeedContent.COMMENTS;
  }

  likesClickHandler(): void {
    this.content = FeedContent.LIKES;
  }
}

export enum FeedContent {
  COMMENTS,
  LIKES
}
