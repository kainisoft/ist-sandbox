import { Entity } from '../core/entity';

export class ArrayUtils {
  static uniqueEntities<T extends Entity>(entities: T[]): T[] {
    return entities.filter((entity, index, arr) => {
      const i = arr.findIndex(item => item.id === entity.id);

      return i === index;
    });
  }

  static sortByCreatedAt<T extends Entity>(entities: T[]): T[] {
    return self.sortBy(entities, (entity1, entity2) => {
      const date1 = entity1.createdAt;
      const date2 = entity2.createdAt;

      return date2.getTime() - date1.getTime();
    });
  }

  static sortBy<T extends Entity>(entities: T[], fn: (a: T, b: T) => number): T[] {
    return entities.sort(fn);
  }
}

const self = ArrayUtils;
