import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { CustomFirestore } from '../core/firestore';

import { Log } from '../interfaces/log';

@Injectable()
export class LogService extends CustomFirestore<Log> {

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return 'log';
  }

}
