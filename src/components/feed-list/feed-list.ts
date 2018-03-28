import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Feed } from '../../interfaces/feed';

import { FeedService } from '../../providers/feed';
import { NavigatorService } from '../../providers/navigator';

import { FeedContent, FeedPage } from '../../pages/feed/feed';

import { ArrayUtils } from '../../utils/array';

@Component({
  selector: 'feed-list',
  templateUrl: 'feed-list.html'
})
export class FeedListComponent extends AbstractLoadMoreComponent<Feed> implements OnInit {

  constructor(protected feedService: FeedService,
              protected navigatorService: NavigatorService) {
    super(feedService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.feedService.findList().subscribe(entities => {
      this.setEntities(entities);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.feedService.findList(last.ds).subscribe(ideas => {
        this.setEntities(ideas);

        resolve();
      }));
    });
  }

  protected normalizeList(entities: Feed[]): Feed[] {
    const list = ArrayUtils.uniqueEntities(entities);

    return ArrayUtils.sortBy(list, (feed1, feed2) => {
      return feed2.createdAt.getTime() - feed1.createdAt.getTime();
    });
  }

  onCommentsClick(feedEntity: Feed): void {
    this.navigatorService.push(FeedPage, {
      id: feedEntity.id,
      content: FeedContent.COMMENTS
    });
  }

  onLikesClick(feedEntity: Feed): Promise<any> {
    return this.navigatorService.push(FeedPage, {
      id: feedEntity.id,
      content: FeedContent.LIKES
    });
  }

}
