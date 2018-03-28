import { Component, OnInit } from '@angular/core';

import { AbstractLoadMoreComponent } from '../../core/load-more';

import { Idea } from '../../interfaces/idea';

import { IdeaService } from '../../providers/idea';

@Component({
  selector: 'idea-list',
  templateUrl: 'idea-list.html'
})
export class IdeaListComponent extends AbstractLoadMoreComponent<Idea> implements OnInit {

  constructor(protected ideaService: IdeaService) {
    super(ideaService.LIMIT);
  }

  ngOnInit(): void {
    this.hub.push(this.ideaService.findList().subscribe(ideas => {
      this.setEntities(ideas);
    }));
  }

  loadMore(): Promise<any> {
    return new Promise(resolve => {
      const last = this.last();

      this.hub.push(this.ideaService.findList(last.ds).subscribe(ideas => {
        this.setEntities(ideas);

        resolve();
      }));
    });
  }

}
