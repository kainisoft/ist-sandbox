import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Scream } from '../../interfaces/scream';

import { ScreamService } from '../../providers/scream';

@Component({
  selector: 'scream-list',
  templateUrl: 'scream-list.html'
})
export class ScreamListComponent extends AbstractLoadMoreComponent<Scream> implements OnInit {

  constructor(protected screamService: ScreamService) {
    super(screamService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.screamService.findList().subscribe(screams => {
      this.setEntities(screams);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.screamService.findList(last.ds).subscribe(screams => {
        this.setEntities(screams);

        resolve();
      }));
    });
  }

}
