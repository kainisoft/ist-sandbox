import { Entity } from '../core/entity';

export interface Notification extends Entity {
  tap: boolean;
  messages: number;
  type: NotificationType;
}

export interface NotificationChat extends Notification {
  chatId: string;
  messageId: string;
}

export enum NotificationType {
  MESSAGE = 'message'
}
