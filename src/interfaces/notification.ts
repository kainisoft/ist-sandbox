import { Entity } from '../core/entity';

export enum NotificationType {
  COMMENT = 'comment',
  REPLY = 'reply',
  LIKE = 'like',
  LIKE_COMMENT = 'like_comment'
}

export interface Notification extends Entity {
  uid: string;
  author: string;
  entityType: NotificationType;
  entityId: string;
  isRead?: boolean;
  data?: any;
}

export interface NotificationLikeComment extends Notification {
  data: {
    path: string[];
  };
}
