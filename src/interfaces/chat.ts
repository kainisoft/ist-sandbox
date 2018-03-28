import { Entity } from '../core/entity';

export interface Chat extends Entity {
  members: {[key: string]: number};
  opponents: {[key: string]: string};
  counter: {[key: string]: number};
  delivered: {[key: string]: boolean};
  type: ChatTypes;
  lastMessage?: string;
}

export enum ChatTypes {
  P2P = 'p2p',
  // GROUP = 'group' // For feature use
}
