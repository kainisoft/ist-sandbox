import { Entity } from '../core/entity';

export type CounterTypes = 'message' | 'notification';

export interface Counter extends Entity {
  message: number;
  notification: number;
}
