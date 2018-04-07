import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { CustomFirestore } from '../core/firestore';

import { Counter, CounterTypes } from '../interfaces/counter';

@Injectable()
export class CounterService extends CustomFirestore<Counter> {

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return 'counter';
  }

  annul(counter: Counter, type: CounterTypes): Promise<any> {
    if (!counter[type]) {
      return Promise.resolve(counter);
    }

    const path = this.buildPath(counter.id);

    return this.afs.doc(path).set({[type]: 0}, {merge: true});
  }

}
