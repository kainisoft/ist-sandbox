import { Entity } from '../core/entity';

export interface Photo extends Entity {
  name: string;
  url: string;
}
