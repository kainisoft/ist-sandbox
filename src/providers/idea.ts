import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import Query = firebase.firestore.Query;

import { CustomFirestore } from '../core/firestore';

import { Idea } from '../interfaces/idea';

@Injectable()
export class IdeaService extends CustomFirestore<Idea> {
  protected IDEA_PATH = 'idea';

  constructor(protected afs: AngularFirestore) {
    super(afs);
  }

  get collectionName(): string {
    return this.IDEA_PATH;
  }

  findList(startAfter: DocumentSnapshot = null): Observable<Idea[]> {
    const collection: AngularFirestoreCollection<Idea> = this.afs.collection(this.IDEA_PATH, ref => {
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
