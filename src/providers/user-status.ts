import { Injectable } from '@angular/core';

import { CustomFirestore } from '../core/firestore';

import { UserStatus } from '../interfaces/user-status';

@Injectable()
export class UserStatusService extends CustomFirestore<UserStatus> {

  get collectionName(): string {
    return 'user-status';
  }

}
