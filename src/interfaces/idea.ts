import { Entity } from '../core/entity';

export interface Idea extends Entity {
  uid: string;
  title: string;
  desc: string;
  feedId?: string;
}
