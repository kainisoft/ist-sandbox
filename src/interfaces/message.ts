import { Entity } from '../core/entity';

export interface Message extends Entity {
  parent: string;
  text: string;
  uid: string;
  opponent: string;
  deliveryStatus: MessageDeliveryStatus;
}

export enum MessageDeliveryStatus {
  SENDING = 'sending',
  STORED = 'stored',
  DELIVERED = 'delivered',
  READ = 'read'
}
