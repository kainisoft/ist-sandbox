import { Entity } from '../core/entity';

export interface Scream extends Entity {
  uid: string;
  title: string;
  desc: string;
  feedId?: string;
}
