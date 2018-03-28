import { Entity } from '../core/entity';

export interface Photo extends Entity {
  entityType: PhotoTypes;
  entityId: string;
  name: string;
  url: string;
}

export enum PhotoTypes {
  USER = 'user',
  GOODS = 'goods',
  SERVICE_CENTER = 'service-center',
  SCREAM = 'scream',
  IDEA = 'idea'
}
