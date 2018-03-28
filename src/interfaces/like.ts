import { Entity } from '../core/entity';

export interface Like extends Entity {
  parent: string;
  uid: string;
  path: string[];
}
