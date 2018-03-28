import { Entity } from '../core/entity';

export interface UserStatus extends Entity {
  isCompleted: boolean;
}
