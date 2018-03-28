import { Entity } from '../core/entity';

export interface Car extends Entity {
  year: number;
  volume: string;
  mileage?: number;
  color?: string;
  exterior?: string[];
  interior?: string[];
}
