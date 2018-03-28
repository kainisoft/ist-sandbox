import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import Query = firebase.firestore.Query;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

import { CustomFirestore } from '../core/firestore';

import { Scream } from '../interfaces/scream';

@Injectable()
export class ScreamService extends CustomFirestore<Scream> {
  protected SCREAM_PATH = 'scream';
  public readonly LIMIT = 10;

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.SCREAM_PATH;
  }

  findList(startAfter: DocumentSnapshot = null): Observable<Scream[]> {
    const collection: AngularFirestoreCollection<Scream> = this.afs.collection(this.SCREAM_PATH, ref => {
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
