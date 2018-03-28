import { Entity } from '../core/entity';

export interface User extends Entity {
  profile: UserProfile;
  presence: PresenceStatus;
  readonly notifyToken?: string;
  readonly lang?: string;
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  birthDay?: string;
  avatar?: string;
  avatarThumbnail?: string;
  cover?: string;
}

export enum PresenceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline'
}
