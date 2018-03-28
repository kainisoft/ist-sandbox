import { Entity } from '../core/entity';

export enum FeedTypes {
  JOIN = 'join',
  GOODS = 'goods',
  SCREAM = 'scream',
  IDEA = 'idea'
}

export interface Feed extends Entity {
  entityType: FeedTypes;
  uid: string;
  data: any;
  commentsCount?: number;
  likesCount?: number;
}

export interface FeedJoin extends Feed {
  data: {
    uid: string
  };
}

export interface FeedGoods extends Feed {
  data: {
    id: string;
  };
}

export interface FeedScream extends Feed {
  data: {
    id: string;
  };
}

export interface FeedIdea extends Feed {
  data: {
    id: string;
  };
}
