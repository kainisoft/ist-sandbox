import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Goods } from '../../interfaces/store';

import { StoreService } from '../../providers/store';

@Component({
  selector: 'store-list',
  templateUrl: 'store-list.html'
})
export class StoreListComponent extends AbstractLoadMoreComponent<Goods> implements OnInit {

  constructor(protected storeService: StoreService) {
    super(storeService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.storeService.findList().subscribe(goods => {
      this.setEntities(goods);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.storeService.findList(last.ds).subscribe(goods => {
        this.setEntities(goods);

        resolve();
      }));
    });
  }

}
