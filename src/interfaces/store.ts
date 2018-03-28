import { Entity } from '../core/entity';

export interface Goods extends Entity {
  uid: string;
  name: string;
  price: string;
  desc?: string;
  createdAt?: Date;
  feedId?: string;
}
