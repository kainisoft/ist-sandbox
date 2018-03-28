import { CustomComponent } from './component';
import { Entity } from './entity';

import { ArrayUtils } from '../utils/array';

export abstract class AbstractLoadMoreComponent<T extends Entity> extends CustomComponent {
  entities: T[];
  loadMoreState: LoadMoreState = LoadMoreState.NO_MORE;
  loadMoreStates = LoadMoreState;

  constructor(protected limit: number) {
    super();
  }

  abstract loadMore(): Promise<any>;

  setEntities(entities: T[]): void {
    this.entities = this.normalizeList([...entities, ...(this.entities || [])]);
    this.setIsMoreAwaiting(entities);
  }

  setIsMoreAwaiting(entities: T[]): void {
    if (entities.length && entities.length % this.limit === 0) {
      this.loadMoreState = LoadMoreState.AWAITING;
    } else {
      this.loadMoreState = LoadMoreState.NO_MORE;
    }
  }

  trackByFn(index: number, entity: T): string {
    return entity.id;
  }

  protected normalizeList(entities: T[]): T[] {
    return ArrayUtils.sortByCreatedAt(
      ArrayUtils.uniqueEntities(entities)
    );
  }

  protected last(): T {
    return Array.from(this.entities).pop();
  }
}

export enum LoadMoreState {
  NO_MORE,
  AWAITING, // Awaiting load more
  LOADING
}
