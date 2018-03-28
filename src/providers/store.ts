import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Goods } from '../interfaces/store';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable()
export class StoreService extends CustomFirestore<Goods> {
  protected readonly STORE_PATH = 'store';

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.STORE_PATH;
  }

  findList(startAfter: DocumentSnapshot = null): Observable<Goods[]> {
    const collection: AngularFirestoreCollection<Goods> =
    this.afs.collection(this.STORE_PATH, ref => {
      let query: Query = ref;
      query = query.orderBy('createdAt', 'desc');

      if (startAfter) {
        query = query.startAfter(startAfter);
      }

      return query.limit(this.LIMIT);
    });

    return this.getEntities(collection);
  }

}
