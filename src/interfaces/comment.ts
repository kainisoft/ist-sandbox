import { Entity } from '../core/entity';

export interface Comment extends Entity {
  uid: string;
  text: string;
  parent: string;
  path: string[];
  readonly lastReply?: string;
  readonly replyCount?: number;
  readonly likeCount?: number;
}
