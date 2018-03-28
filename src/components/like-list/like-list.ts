import { Component, Input, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Like } from '../../interfaces/like';

import { LikeService } from '../../providers/like';

@Component({
  selector: 'like-list',
  templateUrl: 'like-list.html'
})
export class LikeListComponent extends AbstractLoadMoreComponent<Like> implements OnInit {

  @Input()
  protected id: string;

  constructor(protected likeService: LikeService) {
    super(likeService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.likeService.findList(this.id).subscribe(likes => {
      this.setEntities(likes);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.likeService.findList(this.id, last.ds).subscribe(likes => {
        this.setEntities(likes);

        resolve();
      }));
    });
  }

}
